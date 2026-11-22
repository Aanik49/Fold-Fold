import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Music,
  RotateCcw,
  Undo2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { foldAudio } from '../game/audio';
import {
  applyFold,
  cloneBoard,
  countRemainingSymbols,
  createInitialBoard,
  getFoldBlockReason,
  getMaxPlyDepth,
  getTopSymbol,
  RISO,
} from '../game/engine';
import {
  ActiveFoldAnim,
  BoardLayout,
  computeBoardLayout,
  createRisoPatterns,
  FlapCellSnapshot,
  HoverCreaseState,
  InkParticle,
  renderGameplayCanvas,
  RisoPatterns,
} from '../game/renderer';
import { solveBoard } from '../game/solver';
import {
  BlockReason,
  BoardState,
  CategoryDef,
  FoldAction,
  FoldDir,
  FoldOrientation,
  LevelDef,
} from '../game/types';

interface GameStageProps {
  category: CategoryDef;
  level: LevelDef;
  hasNextLevel: boolean;
  isLastInCategory: boolean;
  onBackToSheets: () => void;
  onNextLevel: () => void;
  onLevelCleared: (levelId: string, movesUsed: number, stars: number) => void;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onOpenGuide: () => void;
}

interface HistoryEntry {
  board: BoardState;
  moves: number;
}

export const GameStage: React.FC<GameStageProps> = ({
  category,
  level,
  hasNextLevel,
  isLastInCategory,
  onBackToSheets,
  onNextLevel,
  onLevelCleared,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onOpenGuide,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React HUD state (only updated on move commit / undo / reset / victory — never per frame!)
  const [movesCount, setMovesCount] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [victoryInfo, setVictoryInfo] = useState<{
    stars: number;
    moves: number;
    ply: number;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState(level.hintText);
  const [isDeadEnd, setIsDeadEnd] = useState(false);

  // Isolated mutable simulation refs so 60fps canvas loop never triggers React re-renders
  const simRef = useRef<{
    board: BoardState;
    history: HistoryEntry[];
    moves: number;
    solved: boolean;
    hasFoldedOnce: boolean;
    layout: BoardLayout;
    width: number;
    height: number;
    hoverCrease: HoverCreaseState | null;
    hintFold: FoldAction | null;
    activeAnim: ActiveFoldAnim | null;
    pendingFoldResult: ReturnType<typeof applyFold> | null;
    blockedShake: { timer: number; x: number; y: number; reason: BlockReason };
    particles: InkParticle[];
    dragState: {
      startX: number;
      startY: number;
      initialCrease: HoverCreaseState | null;
    } | null;
    time: number;
  }>({
    board: createInitialBoard(level),
    history: [],
    moves: 0,
    solved: false,
    hasFoldedOnce: false,
    layout: { tileSize: 96, boardW: 288, boardH: 192, boardX: 100, boardY: 100 },
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    hoverCrease: null,
    hintFold: null,
    activeAnim: null,
    pendingFoldResult: null,
    blockedShake: { timer: 0, x: 0, y: 0, reason: null },
    particles: [],
    dragState: null,
    time: 0,
  });

  const resetBoard = useCallback(
    (playSound = false) => {
      if (playSound) foldAudio.playClick(480);
      const sim = simRef.current;
      sim.board = createInitialBoard(level);
      sim.history = [];
      sim.moves = 0;
      sim.solved = false;
      sim.hoverCrease = null;
      sim.hintFold = null;
      sim.activeAnim = null;
      sim.pendingFoldResult = null;
      sim.dragState = null;
      sim.particles = [];
      sim.blockedShake = { timer: 0, x: 0, y: 0, reason: null };
      sim.layout = computeBoardLayout(
        sim.width,
        sim.height,
        sim.board.rows,
        sim.board.cols
      );

      setMovesCount(0);
      setCanUndo(false);
      setIsSolved(false);
      setVictoryInfo(null);
      setIsDeadEnd(false);
      setStatusMessage(level.hintText);
    },
    [level]
  );

  // Reset whenever level prop changes
  useEffect(() => {
    simRef.current.hasFoldedOnce = false;
    resetBoard(false);
  }, [level, resetBoard]);

  const handleUndo = useCallback(() => {
    const sim = simRef.current;
    if (sim.history.length === 0 || sim.activeAnim || sim.solved) return;
    const prev = sim.history.pop()!;
    sim.board = prev.board;
    sim.moves = prev.moves;
    sim.hoverCrease = null;
    sim.hintFold = null;
    sim.layout = computeBoardLayout(
      sim.width,
      sim.height,
      sim.board.rows,
      sim.board.cols
    );

    foldAudio.playUndoSwoosh();
    setMovesCount(sim.moves);
    setCanUndo(sim.history.length > 0);
    setIsDeadEnd(false);
    setStatusMessage(level.hintText);
  }, [level.hintText]);

  const handleHint = useCallback(() => {
    const sim = simRef.current;
    if (sim.activeAnim || sim.solved) return;

    foldAudio.unlock();
    const res = solveBoard(sim.board, 6, 35000);
    if (res.solvable && res.solution.length > 0) {
      sim.hintFold = res.solution[0];
      foldAudio.playHintChime();
      const step = res.solution[0];
      const dirWord = step.dir.toUpperCase();
      setStatusMessage(`HINT: FOLD ALONG THE TEAL CREASE ${dirWord}`);
      setIsDeadEnd(false);
    } else {
      foldAudio.playBlockedThud(false);
      setIsDeadEnd(true);
      setStatusMessage('NO SOLUTION FROM HERE — TAP UNDO OR RETRY');
    }
  }, []);

  const spawnInkBurst = (cx: number, cy: number, color: string) => {
    const shapes: ('circle' | 'square' | 'triangle')[] = [
      'circle',
      'square',
      'triangle',
    ];
    for (let i = 0; i < 20; i++) {
      const ang = (Math.PI * 2 * i) / 20 + Math.random() * 0.25;
      const spd = 60 + Math.random() * 115;
      simRef.current.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 8,
        size: 4 + Math.random() * 4,
        shape: shapes[i % shapes.length],
        life: 0.55 + Math.random() * 0.25,
        maxLife: 0.8,
        color: i % 4 === 0 ? RISO.ink : color,
      });
    }
  };

  const captureFlapCells = (
    board: BoardState,
    orientation: FoldOrientation,
    index: number,
    dir: FoldDir
  ): FlapCellSnapshot[] => {
    const cells: FlapCellSnapshot[] = [];
    if (orientation === 'v') {
      const cStart = dir === 'right' ? 0 : index;
      const cEnd = dir === 'right' ? index : board.cols;
      for (let r = 0; r < board.rows; r++) {
        for (let c = cStart; c < cEnd; c++) {
          cells.push({
            r,
            c,
            topSym: getTopSymbol(board.grid[r][c]),
            depth: board.grid[r][c].stack.length,
            pinned: board.grid[r][c].pinned,
          });
        }
      }
    } else {
      const rStart = dir === 'down' ? 0 : index;
      const rEnd = dir === 'down' ? index : board.rows;
      for (let r = rStart; r < rEnd; r++) {
        for (let c = 0; c < board.cols; c++) {
          cells.push({
            r,
            c,
            topSym: getTopSymbol(board.grid[r][c]),
            depth: board.grid[r][c].stack.length,
            pinned: board.grid[r][c].pinned,
          });
        }
      }
    }
    return cells;
  };

  const executeFold = useCallback(
    (orientation: FoldOrientation, index: number, dir: FoldDir) => {
      const sim = simRef.current;
      if (sim.activeAnim || sim.solved) return;

      const blockReason = getFoldBlockReason(sim.board, orientation, index, dir);
      if (blockReason) {
        foldAudio.playBlockedThud(blockReason === 'pin');
        const { boardX, boardY, boardW, boardH, tileSize } = sim.layout;
        const cx =
          orientation === 'v' ? boardX + index * tileSize : boardX + boardW * 0.5;
        const cy =
          orientation === 'h' ? boardY + index * tileSize : boardY + boardH * 0.5;
        sim.blockedShake = { timer: 0.34, x: cx, y: cy, reason: blockReason };
        setStatusMessage(
          blockReason === 'pin'
            ? 'BRASS PIN ANCHORS THAT FLAP — FOLD OTHER SHEETS ONTO IT'
            : 'ONE-WAY HAZARD TAPE BLOCKS THAT FOLD DIRECTION'
        );
        return;
      }

      sim.history.push({ board: cloneBoard(sim.board), moves: sim.moves });
      foldAudio.playCardstockFold();
      sim.hasFoldedOnce = true;
      sim.hintFold = null;
      sim.hoverCrease = null;

      const flapSnapshot = captureFlapCells(sim.board, orientation, index, dir);
      const foldResult = applyFold(sim.board, { orientation, index, dir });

      sim.pendingFoldResult = foldResult;
      sim.activeAnim = {
        orientation,
        index,
        dir,
        progress: 0,
        duration: 0.26,
        flapSnapshot,
        undersideColor: category.undersideColor,
      };
    },
    [category.undersideColor]
  );

  // Keyboard shortcuts during gameplay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 'Z') {
        handleUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        resetBoard(true);
      } else if (e.key === 'h' || e.key === 'H') {
        handleHint();
      } else if (e.key === 'Escape') {
        onBackToSheets();
      } else if (e.key === 'Enter' && isSolved && hasNextLevel) {
        onNextLevel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, resetBoard, handleHint, onBackToSheets, isSolved, hasNextLevel, onNextLevel]);

  // Main 60fps Canvas Render & Pointer/Swipe Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const patterns: RisoPatterns = createRisoPatterns(ctx);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sim = simRef.current;
      sim.width = w;
      sim.height = h;
      sim.layout = computeBoardLayout(w, h, sim.board.rows, sim.board.cols);
    };

    resize();
    window.addEventListener('resize', resize);

    const detectCreaseNearPoint = (px: number, py: number): HoverCreaseState | null => {
      const sim = simRef.current;
      if (sim.solved || sim.activeAnim) return null;
      const { boardX, boardY, boardW, boardH, tileSize } = sim.layout;
      const pad = 26;
      if (
        px < boardX - pad ||
        px > boardX + boardW + pad ||
        py < boardY - pad ||
        py > boardY + boardH + pad
      ) {
        return null;
      }

      let best: HoverCreaseState | null = null;
      let bestDist = 32;

      for (let c = 1; c < sim.board.cols; c++) {
        const cx = boardX + c * tileSize;
        const dist = Math.abs(px - cx);
        if (dist < bestDist) {
          bestDist = dist;
          const dir: FoldDir = px < cx ? 'right' : 'left';
          best = {
            orientation: 'v',
            index: c,
            dir,
            blockReason: getFoldBlockReason(sim.board, 'v', c, dir),
            peelAmount: 0,
          };
        }
      }

      for (let r = 1; r < sim.board.rows; r++) {
        const ry = boardY + r * tileSize;
        const dist = Math.abs(py - ry);
        if (dist < bestDist) {
          bestDist = dist;
          const dir: FoldDir = py < ry ? 'down' : 'up';
          best = {
            orientation: 'h',
            index: r,
            dir,
            blockReason: getFoldBlockReason(sim.board, 'h', r, dir),
            peelAmount: 0,
          };
        }
      }

      return best;
    };

    const onPointerDown = (e: PointerEvent) => {
      foldAudio.unlock();
      const sim = simRef.current;
      if (sim.solved || sim.activeAnim) return;
      const px = e.clientX;
      const py = e.clientY;
      sim.dragState = {
        startX: px,
        startY: py,
        initialCrease: detectCreaseNearPoint(px, py),
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const sim = simRef.current;
      if (sim.solved || sim.activeAnim) return;
      const px = e.clientX;
      const py = e.clientY;

      if (sim.dragState) {
        const dx = px - sim.dragState.startX;
        const dy = py - sim.dragState.startY;
        const dist = Math.hypot(dx, dy);

        if (dist > 12) {
          const { boardX, boardY, tileSize } = sim.layout;
          const peelAmount = Math.min(1, (dist - 12) / Math.max(44, tileSize * 0.7));

          if (Math.abs(dx) >= Math.abs(dy) && sim.board.cols > 1) {
            const dir: FoldDir = dx > 0 ? 'right' : 'left';
            const midX = (sim.dragState.startX + px) * 0.5;
            let nearestC = 1;
            let minD = Infinity;
            for (let c = 1; c < sim.board.cols; c++) {
              const d = Math.abs(midX - (boardX + c * tileSize));
              if (d < minD) {
                minD = d;
                nearestC = c;
              }
            }
            sim.hoverCrease = {
              orientation: 'v',
              index: nearestC,
              dir,
              blockReason: getFoldBlockReason(sim.board, 'v', nearestC, dir),
              peelAmount,
            };
          } else if (sim.board.rows > 1) {
            const dir: FoldDir = dy > 0 ? 'down' : 'up';
            const midY = (sim.dragState.startY + py) * 0.5;
            let nearestR = 1;
            let minD = Infinity;
            for (let r = 1; r < sim.board.rows; r++) {
              const d = Math.abs(midY - (boardY + r * tileSize));
              if (d < minD) {
                minD = d;
                nearestR = r;
              }
            }
            sim.hoverCrease = {
              orientation: 'h',
              index: nearestR,
              dir,
              blockReason: getFoldBlockReason(sim.board, 'h', nearestR, dir),
              peelAmount,
            };
          }
        }
      } else {
        sim.hoverCrease = detectCreaseNearPoint(px, py);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const sim = simRef.current;
      if (!sim.dragState) return;
      const dx = e.clientX - sim.dragState.startX;
      const dy = e.clientY - sim.dragState.startY;
      const dragDist = Math.hypot(dx, dy);

      if (dragDist >= 20 && sim.hoverCrease) {
        executeFold(
          sim.hoverCrease.orientation,
          sim.hoverCrease.index,
          sim.hoverCrease.dir
        );
      } else if (dragDist < 14 && sim.dragState.initialCrease) {
        const c = sim.dragState.initialCrease;
        executeFold(c.orientation, c.index, c.dir);
      }

      sim.dragState = null;
      if (sim.hoverCrease) {
        sim.hoverCrease.peelAmount = 0;
      }
    };

    const onBlur = () => {
      simRef.current.dragState = null;
      simRef.current.hoverCrease = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('blur', onBlur);

    let rafId = 0;
    let lastTs = performance.now();

    const commitFold = () => {
      const sim = simRef.current;
      const pending = sim.pendingFoldResult;
      if (!pending) return;

      sim.board = pending.nextState;
      sim.moves += 1;
      sim.activeAnim = null;
      sim.pendingFoldResult = null;
      sim.hoverCrease = null;
      sim.layout = computeBoardLayout(
        sim.width,
        sim.height,
        sim.board.rows,
        sim.board.cols
      );

      setMovesCount(sim.moves);
      setCanUndo(sim.history.length > 0);

      if (pending.duplexFlipped) {
        foldAudio.playDuplexFlip();
      }

      if (pending.matchedLocations.length > 0) {
        pending.matchedLocations.forEach((loc, idx) => {
          foldAudio.playMarimbaMatch(idx);
          const cx = sim.layout.boardX + (loc.c + 0.5) * sim.layout.tileSize;
          const cy = sim.layout.boardY + (loc.r + 0.5) * sim.layout.tileSize;
          spawnInkBurst(cx, cy, loc.color);
        });
      }

      const remaining = countRemainingSymbols(sim.board);
      if (remaining === 0) {
        sim.solved = true;
        foldAudio.playVictoryFanfare();
        const stars =
          sim.moves <= level.par ? 3 : sim.moves === level.par + 1 ? 2 : 1;
        const ply = getMaxPlyDepth(sim.board);
        onLevelCleared(level.id, sim.moves, stars);

        window.setTimeout(() => {
          setIsSolved(true);
          setVictoryInfo({ stars, moves: sim.moves, ply });
        }, 380);
      } else if (sim.board.rows === 1 && sim.board.cols === 1) {
        setIsDeadEnd(true);
        setStatusMessage('SHEET FULLY FOLDED WITH SYMBOLS LEFT — TAP UNDO OR RETRY');
      } else {
        setIsDeadEnd(false);
        setStatusMessage(level.hintText);
      }
    };

    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
      lastTs = ts;
      const sim = simRef.current;
      sim.time += dt;

      if (sim.activeAnim) {
        sim.activeAnim.progress += dt / sim.activeAnim.duration;
        if (sim.activeAnim.progress >= 1) {
          commitFold();
        }
      }

      if (sim.blockedShake.timer > 0) {
        sim.blockedShake.timer = Math.max(0, sim.blockedShake.timer - dt);
      }

      if (sim.particles.length > 0) {
        for (const p of sim.particles) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 125 * dt;
          p.rot += p.vRot * dt;
          p.life -= dt;
        }
        sim.particles = sim.particles.filter((p) => p.life > 0);
      }

      renderGameplayCanvas({
        ctx,
        patterns,
        width: sim.width,
        height: sim.height,
        board: sim.board,
        layout: sim.layout,
        time: sim.time,
        hoverCrease: sim.hoverCrease,
        activeAnim: sim.activeAnim,
        hintFold: sim.hintFold,
        blockedShake: sim.blockedShake,
        particles: sim.particles,
        showFirstFoldGuide:
          level.id === 'c1-01' && !sim.hasFoldedOnce && !sim.solved,
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [executeFold, level, onLevelCleared]);

  const currentLiveStars =
    movesCount <= level.par ? 3 : movesCount === level.par + 1 ? 2 : 1;

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Full-Viewport Interactive Origami Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-pointer touch-none"
      />

      {/* Perimeter Top HUD (pointer-events: none wrapper so playfield stays unobstructed) */}
      <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none px-3.5 pt-3 sm:px-6 sm:pt-5 flex flex-col gap-2">
        <div className="w-full flex items-center justify-between gap-2">
          {/* Top-Left: Sheets Back + Desktop Moves / Par + Sheet Readout */}
          <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 min-w-0">
            <button
              onClick={() => {
                foldAudio.playClick(480);
                onBackToSheets();
              }}
              className="riso-btn h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.6} />
              <span>Sheets</span>
            </button>

            {/* Desktop Moves / Par + 3-Star Cluster */}
            <div className="hidden sm:flex riso-card rounded-xl px-4 py-2 items-center gap-3 shrink-0">
              <div className="font-poster text-base tracking-tight uppercase flex items-center gap-1.5 border-b-2 border-[#141414] pb-0.5 font-mono-riso">
                <span className="font-poster">MOVES:</span>
                <span className="font-poster text-[#E63946] tabular-nums">
                  {movesCount}
                </span>
                <span className="font-poster">/</span>
                <span className="font-poster text-[#E63946] tabular-nums">
                  {level.par}
                </span>
                <span className="font-poster">PAR</span>
              </div>

              <div
                className="flex items-center gap-0.5 text-lg leading-none"
                aria-label={`Projected ${currentLiveStars} of 3 stars`}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={
                      i < currentLiveStars ? 'text-[#E63946]' : 'text-[#141414]/20'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Current Volume & Sheet Name (Desktop) */}
            <div className="hidden lg:flex riso-card rounded-xl px-3 py-2 items-center gap-2 shrink-0">
              <span
                style={{
                  backgroundColor: category.cardColor,
                  color: category.cardText,
                }}
                className="font-mono-riso text-xs font-extrabold px-2 py-0.5 rounded"
              >
                {category.code}-{level.code}
              </span>
              <span className="font-bold text-xs uppercase tracking-wide text-[#141414] whitespace-nowrap">
                {level.title}
              </span>
            </div>
          </div>

          {/* Top-Right: Guide, Music, SFX (never clipped on narrow screens) */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 shrink-0 pr-0.5">
            <button
              onClick={() => {
                foldAudio.playClick(560);
                onOpenGuide();
              }}
              title="How to Play"
              aria-label="How to Play"
              className="riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#141414]" strokeWidth={2.4} />
            </button>

            <button
              onClick={onToggleMusic}
              title={musicEnabled ? 'Mute Music' : 'Play Music'}
              aria-label={musicEnabled ? 'Mute Music' : 'Play Music'}
              className={`riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${
                musicEnabled ? '' : 'opacity-65'
              }`}
            >
              <Music
                className={`w-4 h-4 ${musicEnabled ? 'text-[#1D3557]' : 'text-[#E63946]'}`}
                strokeWidth={2.5}
              />
            </button>

            <button
              onClick={onToggleSfx}
              title={sfxEnabled ? 'Mute SFX (M)' : 'Enable SFX (M)'}
              aria-label={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
              className="riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              {sfxEnabled ? (
                <Volume2 className="w-4 h-4 text-[#141414]" strokeWidth={2.5} />
              ) : (
                <VolumeX className="w-4 h-4 text-[#E63946]" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Second Row: Compact Centered Moves / Par + Stars */}
        <div className="flex sm:hidden items-center justify-center">
          <div className="pointer-events-auto riso-card-sm rounded-xl px-3.5 py-1.5 flex items-center gap-3">
            <div className="font-poster text-xs tracking-tight uppercase flex items-center gap-1 border-b-2 border-[#141414] pb-0.5 font-mono-riso">
              <span className="font-poster">MOVES:</span>
              <span className="font-poster text-[#E63946] tabular-nums">
                {movesCount}
              </span>
              <span className="font-poster">/</span>
              <span className="font-poster text-[#E63946] tabular-nums">
                {level.par}
              </span>
              <span className="font-poster">PAR</span>
            </div>

            <div
              className="flex items-center gap-0.5 text-sm leading-none"
              aria-label={`Projected ${currentLiveStars} of 3 stars`}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={
                    i < currentLiveStars ? 'text-[#E63946]' : 'text-[#141414]/20'
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Tactile Origami Action Controls */}
      <footer className="fixed bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 w-full max-w-lg px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-center gap-3 sm:gap-5">
          <button
            onClick={handleUndo}
            disabled={!canUndo || isSolved}
            title="Undo Last Fold (Z)"
            className="riso-btn px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 font-poster text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap cursor-pointer"
          >
            <span>UNDO</span>
            <Undo2 className="w-4 h-4" strokeWidth={2.6} />
          </button>

          <button
            onClick={() => resetBoard(true)}
            title="Retry Sheet (R)"
            className="riso-btn px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 font-poster text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap cursor-pointer"
          >
            <span>RETRY</span>
            <RotateCcw className="w-4 h-4" strokeWidth={2.6} />
          </button>

          <button
            onClick={handleHint}
            disabled={isSolved}
            title="Show Optimal Next Fold (H)"
            className="riso-btn px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 font-poster text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap bg-[#FAF8F5] text-[#1E6B5C] cursor-pointer"
          >
            <span>HINT</span>
            <Lightbulb className="w-4 h-4" strokeWidth={2.6} />
          </button>
        </div>

        {/* Compact Status / Rule Strip */}
        <div
          className={`pointer-events-none px-3.5 py-1 rounded-full font-mono-riso text-[10px] sm:text-[11px] font-semibold tracking-wide text-center shadow-md max-w-full truncate ${
            isDeadEnd
              ? 'bg-[#E63946] text-[#FAF8F5]'
              : 'bg-[#141414] text-[#FAF8F5]'
          }`}
        >
          {statusMessage}
        </div>
      </footer>

      {/* Victory Stamp Celebration Modal */}
      {isSolved && victoryInfo && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-[#141414]/35">
          <div className="riso-card rounded-2xl p-6 sm:p-7 max-w-sm w-full animate-riso-pop">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono-riso text-[11px] font-extrabold uppercase px-2.5 py-1 bg-[#E63946] text-white border-2 border-[#141414] rounded">
                {isLastInCategory ? 'VOLUME COMPLETE' : 'PRINT CLEARED'}
              </span>

              <div className="flex items-center gap-1 text-2xl leading-none">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{ animationDelay: `${i * 110}ms` }}
                    className={
                      i < victoryInfo.stars
                        ? 'text-[#E63946] animate-star-stamp inline-block'
                        : 'text-[#141414]/20 inline-block'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="font-mono-riso text-[11px] font-bold text-[#141414]/65 uppercase">
              VOL.{category.code} · SHEET {level.code}
            </div>
            <h2 className="font-poster text-2xl uppercase leading-tight mb-1.5 text-[#141414]">
              {level.title}
            </h2>
            <p className="text-xs font-medium text-[#141414]/80 leading-relaxed mb-5">
              {victoryInfo.stars === 3
                ? `Optimal ${level.par}-move Risograph proof achieved!`
                : `Sheet cleared in ${victoryInfo.moves} moves (Par ${level.par}).`}
            </p>

            {/* 3-Column Risograph Stats */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="border-2 border-[#141414] bg-[#F2EFE9] rounded-xl p-2.5 text-center">
                <div className="font-mono-riso text-[10px] font-bold uppercase opacity-65">
                  MOVES
                </div>
                <div className="font-poster text-lg text-[#1D3557] tabular-nums">
                  {victoryInfo.moves}
                </div>
              </div>
              <div className="border-2 border-[#141414] bg-[#F2EFE9] rounded-xl p-2.5 text-center">
                <div className="font-mono-riso text-[10px] font-bold uppercase opacity-65">
                  PAR
                </div>
                <div className="font-poster text-lg text-[#E63946] tabular-nums">
                  {level.par}
                </div>
              </div>
              <div className="border-2 border-[#141414] bg-[#F2EFE9] rounded-xl p-2.5 text-center">
                <div className="font-mono-riso text-[10px] font-bold uppercase opacity-65">
                  STOCK
                </div>
                <div className="font-poster text-lg text-[#141414] tabular-nums">
                  {victoryInfo.ply} PLY
                </div>
              </div>
            </div>

            {/* Single-line Modal Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  foldAudio.playClick(480);
                  onBackToSheets();
                }}
                className="riso-btn flex-1 py-3 px-2.5 rounded-xl font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap cursor-pointer"
              >
                Sheets
              </button>
              <button
                onClick={() => resetBoard(true)}
                className="riso-btn flex-1 py-3 px-2.5 rounded-xl font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap cursor-pointer"
              >
                Retry
              </button>
              {hasNextLevel && (
                <button
                  onClick={() => {
                    foldAudio.playCardstockFold();
                    onNextLevel();
                  }}
                  className="riso-btn flex-[1.7] py-3 px-3 rounded-xl font-poster text-xs sm:text-sm uppercase tracking-wide bg-[#1D3557] text-[#FAF8F5] whitespace-nowrap cursor-pointer"
                >
                  {isLastInCategory ? 'NEXT VOL >>>' : 'NEXT >>>'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
