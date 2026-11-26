import { getActivePalette, RisoPalette } from './themes';
import {
  BlockReason,
  BoardState,
  CarbonStampLocation,
  CellState,
  FoldAction,
  FoldDir,
  FoldOrientation,
  FoldResult,
  LevelDef,
  LockedCrease,
  LockKeySymbol,
  MatchLocation,
  OneWayTape,
  PerforatedCrease,
  SymbolType,
} from './types';

export const RISO = {
  newsprint: '#F2EFE9',
  newsprintDark: '#E5E0D5',
  paperWhite: '#FAF8F5',
  paperShaded: '#EFECE4',
  red: '#E63946',
  blue: '#1D3557',
  yellow: '#F4A261',
  teal: '#1E6B5C',
  ink: '#141414',
} as const;

export function isCarbonSymbol(sym: SymbolType): boolean {
  return (
    sym === 'carbon_circle' ||
    sym === 'carbon_cross' ||
    sym === 'carbon_triangle' ||
    sym === 'carbon_square'
  );
}

export function carbonToNormalSymbol(sym: SymbolType): SymbolType {
  switch (sym) {
    case 'carbon_circle':
      return 'circle';
    case 'carbon_cross':
      return 'cross';
    case 'carbon_triangle':
      return 'triangle';
    case 'carbon_square':
      return 'square';
    default:
      return sym;
  }
}

export function getSymbolColor(sym: SymbolType, palette?: RisoPalette): string {
  const p = palette ?? getActivePalette();
  switch (sym) {
    case 'circle':
    case 'carbon_circle':
    case 'duplex_rb':
      return p.red;
    case 'cross':
    case 'carbon_cross':
    case 'duplex_br':
      return p.blue;
    case 'triangle':
    case 'carbon_triangle':
      return p.yellow;
    case 'square':
    case 'carbon_square':
      return p.ink;
    case 'wild':
      return p.teal;
  }
}

export function getEffectiveInk(sym: SymbolType): string {
  switch (sym) {
    case 'circle':
    case 'carbon_circle':
    case 'duplex_rb':
      return 'red';
    case 'cross':
    case 'carbon_cross':
    case 'duplex_br':
      return 'blue';
    case 'triangle':
    case 'carbon_triangle':
      return 'yellow';
    case 'square':
    case 'carbon_square':
      return 'charcoal';
    case 'wild':
      return 'wild';
  }
}

export function getLockKeyLabel(keySymbol: LockKeySymbol): string {
  switch (keySymbol) {
    case 'circle':
      return 'RED CIRCLES';
    case 'cross':
      return 'BLUE CROSSES';
    case 'triangle':
      return 'GOLD TRIANGLES';
    case 'square':
      return 'INK SQUARES';
  }
}

export function flipSymbolOnFold(sym: SymbolType | null): {
  next: SymbolType | null;
  flipped: boolean;
} {
  if (sym === 'duplex_rb') return { next: 'duplex_br', flipped: true };
  if (sym === 'duplex_br') return { next: 'duplex_rb', flipped: true };
  return { next: sym, flipped: false };
}

export function symbolsMatch(a: SymbolType, b: SymbolType): boolean {
  if (a === 'wild' || b === 'wild') return true;
  return getEffectiveInk(a) === getEffectiveInk(b);
}

export function countInkInGrid(grid: CellState[][], keySymbol: LockKeySymbol): number {
  const targetInk = getEffectiveInk(keySymbol);
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const stack = grid[r][c].stack;
      for (let i = 0; i < stack.length; i++) {
        const s = stack[i];
        if (s !== null && getEffectiveInk(s) === targetInk) {
          count++;
        }
      }
    }
  }
  return count;
}

export function hasAnyCarbonSymbol(state: BoardState): boolean {
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const stack = state.grid[r][c].stack;
      for (let i = 0; i < stack.length; i++) {
        const s = stack[i];
        if (s !== null && isCarbonSymbol(s)) return true;
      }
    }
  }
  return false;
}

export function createInitialBoard(level: LevelDef): BoardState {
  const grid: CellState[][] = Array.from({ length: level.rows }, () =>
    Array.from({ length: level.cols }, () => ({ stack: [null], pinned: false }))
  );

  for (const s of level.symbols) {
    if (s.r >= 0 && s.r < level.rows && s.c >= 0 && s.c < level.cols) {
      grid[s.r][s.c].stack = [s.type];
    }
  }

  for (const p of level.pins) {
    if (p.r >= 0 && p.r < level.rows && p.c >= 0 && p.c < level.cols) {
      grid[p.r][p.c].pinned = true;
    }
  }

  // Filter out any locks whose key symbol is already cleared
  const locks = (level.locks ?? [])
    .filter((lk) => countInkInGrid(grid, lk.keySymbol) > 0)
    .map((lk) => ({ ...lk }));

  return {
    rows: level.rows,
    cols: level.cols,
    grid,
    tapes: level.tapes.map((t) => ({ ...t })),
    perforations: (level.perforations ?? []).map((pf) => ({ ...pf })),
    locks,
  };
}

export function cloneBoard(state: BoardState): BoardState {
  return {
    rows: state.rows,
    cols: state.cols,
    grid: state.grid.map((row) =>
      row.map((cell) => ({ stack: [...cell.stack], pinned: cell.pinned }))
    ),
    tapes: state.tapes.map((t) => ({ ...t })),
    perforations: state.perforations.map((pf) => ({ ...pf })),
    locks: state.locks.map((lk) => ({ ...lk })),
  };
}

export function getTopSymbol(cell: CellState): SymbolType | null {
  for (let i = cell.stack.length - 1; i >= 0; i--) {
    if (cell.stack[i] !== null) return cell.stack[i];
  }
  return null;
}

export function hasTrappedSymbol(cell: CellState): boolean {
  let count = 0;
  for (let i = 0; i < cell.stack.length; i++) {
    if (cell.stack[i] !== null) count++;
    if (count > 1) return true;
  }
  return false;
}

export function countRemainingSymbols(state: BoardState): number {
  let total = 0;
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const stack = state.grid[r][c].stack;
      for (let i = 0; i < stack.length; i++) {
        if (stack[i] !== null) total++;
      }
    }
  }
  return total;
}

export function getMaxPlyDepth(state: BoardState): number {
  let maxD = 1;
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (state.grid[r][c].stack.length > maxD) {
        maxD = state.grid[r][c].stack.length;
      }
    }
  }
  return maxD;
}

export function isCreasePerforated(
  state: BoardState,
  orientation: FoldOrientation,
  index: number
): boolean {
  return state.perforations.some(
    (pf) => pf.orientation === orientation && pf.index === index
  );
}

export function getCreaseLock(
  state: BoardState,
  orientation: FoldOrientation,
  index: number
): LockedCrease | undefined {
  return state.locks.find(
    (lk) => lk.orientation === orientation && lk.index === index
  );
}

export function isCellInMovingFlap(
  r: number,
  c: number,
  orientation: FoldOrientation,
  index: number,
  dir: FoldDir
): boolean {
  if (orientation === 'v') {
    return dir === 'right' ? c < index : c >= index;
  }
  return dir === 'down' ? r < index : r >= index;
}

export function getFoldBlockReason(
  state: BoardState,
  orientation: FoldOrientation,
  index: number,
  dir: FoldDir
): BlockReason {
  // 1. Check Locked Crease (requires clearing all symbols of its key ink first)
  const lock = getCreaseLock(state, orientation, index);
  if (lock) {
    return 'lock';
  }

  // 2. Check One-Way Hazard Tape on this crease
  const tape = state.tapes.find(
    (t) => t.orientation === orientation && t.index === index
  );
  if (tape && tape.allowDir !== dir) {
    return 'tape';
  }

  // 3. Check Brass Eyelet Pins on the moving flap (cannot lift or tear a pinned sheet)
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (
        state.grid[r][c].pinned &&
        isCellInMovingFlap(r, c, orientation, index, dir)
      ) {
        return 'pin';
      }
    }
  }

  return null;
}

function mergeStacks(
  baseStack: (SymbolType | null)[],
  rawMovingStack: (SymbolType | null)[]
): {
  stack: (SymbolType | null)[];
  matched: boolean;
  matchedColor: string | null;
  carbonStamped: boolean;
  carbonColor: string | null;
  wasDuplexFlip: boolean;
} {
  const bCopy = [...baseStack];

  // Reverse the moving stack because the flap flips upside-down.
  // Also flip any duplex ink symbols on the moving flap.
  let anyDuplexFlipped = false;
  const mCopy: (SymbolType | null)[] = [];
  for (let i = rawMovingStack.length - 1; i >= 0; i--) {
    const { next, flipped } = flipSymbolOnFold(rawMovingStack[i]);
    if (flipped) anyDuplexFlipped = true;
    mCopy.push(next);
  }

  // Top-most visible symbol on the stationary base cell
  let topBaseIdx = -1;
  for (let i = bCopy.length - 1; i >= 0; i--) {
    if (bCopy[i] !== null) {
      topBaseIdx = i;
      break;
    }
  }

  // First non-null in mCopy was the TOP-most visible symbol of the moving cell
  // before folding, so it is the exact face that lands on top of the base cell!
  let touchMovIdx = -1;
  for (let i = 0; i < mCopy.length; i++) {
    if (mCopy[i] !== null) {
      touchMovIdx = i;
      break;
    }
  }

  // Case 1: Both sides have a visible symbol -> attempt match cancellation
  if (topBaseIdx !== -1 && touchMovIdx !== -1) {
    const baseSym = bCopy[topBaseIdx]!;
    const movSym = mCopy[touchMovIdx]!;
    if (symbolsMatch(baseSym, movSym)) {
      bCopy[topBaseIdx] = null;
      mCopy[touchMovIdx] = null;
      const color =
        baseSym === 'wild' ? getSymbolColor(movSym) : getSymbolColor(baseSym);
      return {
        stack: [...bCopy, ...mCopy],
        matched: true,
        matchedColor: color,
        carbonStamped: false,
        carbonColor: null,
        wasDuplexFlip: anyDuplexFlipped,
      };
    }
  }

  // Case 2: Carbon Copy Ink on moving flap lands onto a BLANK stationary cell
  // -> presses a ghost copy onto the blank base sheet and converts the carbon ink into normal ink!
  if (
    topBaseIdx === -1 &&
    bCopy.length > 0 &&
    touchMovIdx !== -1 &&
    isCarbonSymbol(mCopy[touchMovIdx]!)
  ) {
    const normalSym = carbonToNormalSymbol(mCopy[touchMovIdx]!);
    bCopy[bCopy.length - 1] = normalSym; // Stamped ghost copy onto the blank base sheet
    mCopy[touchMovIdx] = normalSym; // Original ink becomes regular after single-use carbon press
    return {
      stack: [...bCopy, ...mCopy],
      matched: false,
      matchedColor: null,
      carbonStamped: true,
      carbonColor: getSymbolColor(normalSym),
      wasDuplexFlip: anyDuplexFlipped,
    };
  }

  // Case 3: Blank moving flap folds over a stationary Carbon Copy cell
  // -> presses a ghost copy onto the blank moving ply and converts the carbon ink!
  if (
    touchMovIdx === -1 &&
    mCopy.length > 0 &&
    topBaseIdx !== -1 &&
    isCarbonSymbol(bCopy[topBaseIdx]!)
  ) {
    const normalSym = carbonToNormalSymbol(bCopy[topBaseIdx]!);
    bCopy[topBaseIdx] = normalSym;
    mCopy[0] = normalSym; // Stamped ghost copy onto the blank moving ply touching it
    return {
      stack: [...bCopy, ...mCopy],
      matched: false,
      matchedColor: null,
      carbonStamped: true,
      carbonColor: getSymbolColor(normalSym),
      wasDuplexFlip: anyDuplexFlipped,
    };
  }

  return {
    stack: [...bCopy, ...mCopy],
    matched: false,
    matchedColor: null,
    carbonStamped: false,
    carbonColor: null,
    wasDuplexFlip: anyDuplexFlipped,
  };
}

function flipDir(dir: FoldDir): FoldDir {
  switch (dir) {
    case 'left':
      return 'right';
    case 'right':
      return 'left';
    case 'up':
      return 'down';
    case 'down':
      return 'up';
  }
}

function resolveUnlockedLocks(
  grid: CellState[][],
  locks: LockedCrease[]
): { remainingLocks: LockedCrease[]; unlockedCount: number } {
  const remainingLocks: LockedCrease[] = [];
  let unlockedCount = 0;
  for (const lk of locks) {
    if (countInkInGrid(grid, lk.keySymbol) === 0) {
      unlockedCount++;
    } else {
      remainingLocks.push(lk);
    }
  }
  return { remainingLocks, unlockedCount };
}

function applyPerforatedTear(state: BoardState, action: FoldAction): FoldResult {
  const { orientation, index, dir } = action;

  if (orientation === 'v') {
    const keepRight = dir === 'right'; // Moving left flap detaches; stationary right stays
    const startC = keepRight ? index : 0;
    const endC = keepRight ? state.cols : index;
    const newCols = endC - startC;

    const newGrid: CellState[][] = Array.from({ length: state.rows }, (_, r) =>
      Array.from({ length: newCols }, (_, nc) => ({
        stack: [...state.grid[r][startC + nc].stack],
        pinned: state.grid[r][startC + nc].pinned,
      }))
    );

    const nextTapes: OneWayTape[] = [];
    for (const t of state.tapes) {
      if (t.orientation === 'h') {
        nextTapes.push({ ...t });
      } else if (t.index !== index) {
        const mapped = keepRight ? t.index - index : t.index;
        if (mapped > 0 && mapped < newCols) {
          nextTapes.push({ ...t, index: mapped });
        }
      }
    }

    const nextPerfs: PerforatedCrease[] = [];
    for (const pf of state.perforations) {
      if (pf.orientation === 'h') {
        nextPerfs.push({ ...pf });
      } else if (pf.index !== index) {
        const mapped = keepRight ? pf.index - index : pf.index;
        if (mapped > 0 && mapped < newCols) {
          nextPerfs.push({ ...pf, index: mapped });
        }
      }
    }

    const mappedLocks: LockedCrease[] = [];
    for (const lk of state.locks) {
      if (lk.orientation === 'h') {
        mappedLocks.push({ ...lk });
      } else if (lk.index !== index) {
        const mapped = keepRight ? lk.index - index : lk.index;
        if (mapped > 0 && mapped < newCols) {
          mappedLocks.push({ ...lk, index: mapped });
        }
      }
    }

    const { remainingLocks, unlockedCount } = resolveUnlockedLocks(newGrid, mappedLocks);

    return {
      nextState: {
        rows: state.rows,
        cols: newCols,
        grid: newGrid,
        tapes: nextTapes,
        perforations: nextPerfs,
        locks: remainingLocks,
      },
      matchedLocations: [],
      carbonStampedLocations: [],
      duplexFlipped: false,
      tornOff: true,
      unlockedLocksCount: unlockedCount,
    };
  } else {
    const keepBottom = dir === 'down'; // Moving top flap detaches; stationary bottom stays
    const startR = keepBottom ? index : 0;
    const endR = keepBottom ? state.rows : index;
    const newRows = endR - startR;

    const newGrid: CellState[][] = Array.from({ length: newRows }, (_, nr) =>
      Array.from({ length: state.cols }, (_, c) => ({
        stack: [...state.grid[startR + nr][c].stack],
        pinned: state.grid[startR + nr][c].pinned,
      }))
    );

    const nextTapes: OneWayTape[] = [];
    for (const t of state.tapes) {
      if (t.orientation === 'v') {
        nextTapes.push({ ...t });
      } else if (t.index !== index) {
        const mapped = keepBottom ? t.index - index : t.index;
        if (mapped > 0 && mapped < newRows) {
          nextTapes.push({ ...t, index: mapped });
        }
      }
    }

    const nextPerfs: PerforatedCrease[] = [];
    for (const pf of state.perforations) {
      if (pf.orientation === 'v') {
        nextPerfs.push({ ...pf });
      } else if (pf.index !== index) {
        const mapped = keepBottom ? pf.index - index : pf.index;
        if (mapped > 0 && mapped < newRows) {
          nextPerfs.push({ ...pf, index: mapped });
        }
      }
    }

    const mappedLocks: LockedCrease[] = [];
    for (const lk of state.locks) {
      if (lk.orientation === 'v') {
        mappedLocks.push({ ...lk });
      } else if (lk.index !== index) {
        const mapped = keepBottom ? lk.index - index : lk.index;
        if (mapped > 0 && mapped < newRows) {
          mappedLocks.push({ ...lk, index: mapped });
        }
      }
    }

    const { remainingLocks, unlockedCount } = resolveUnlockedLocks(newGrid, mappedLocks);

    return {
      nextState: {
        rows: newRows,
        cols: state.cols,
        grid: newGrid,
        tapes: nextTapes,
        perforations: nextPerfs,
        locks: remainingLocks,
      },
      matchedLocations: [],
      carbonStampedLocations: [],
      duplexFlipped: false,
      tornOff: true,
      unlockedLocksCount: unlockedCount,
    };
  }
}

export function applyFold(state: BoardState, action: FoldAction): FoldResult {
  const { orientation, index, dir } = action;

  // Perforated Tear Line: detaches & discards the moving flap!
  if (isCreasePerforated(state, orientation, index)) {
    return applyPerforatedTear(state, action);
  }

  const matchedLocations: MatchLocation[] = [];
  const carbonStampedLocations: CarbonStampLocation[] = [];
  let duplexFlipped = false;

  if (orientation === 'v') {
    const leftSpan = index;
    const rightSpan = state.cols - index;
    const newCols = Math.max(leftSpan, rightSpan);
    const newGrid: CellState[][] = Array.from({ length: state.rows }, () =>
      Array.from({ length: newCols }, () => ({ stack: [], pinned: false }))
    );

    const shift = dir === 'left' ? Math.max(0, rightSpan - leftSpan) : 0;

    for (let r = 0; r < state.rows; r++) {
      if (dir === 'right') {
        // Stationary right side starts at crease (col 0 of newGrid)
        for (let c = index; c < state.cols; c++) {
          const nc = c - index;
          newGrid[r][nc].stack = [...state.grid[r][c].stack];
          newGrid[r][nc].pinned = state.grid[r][c].pinned;
        }
        // Moving left side folds right across `index`
        for (let c = index - 1; c >= 0; c--) {
          const nc = index - 1 - c;
          const res = mergeStacks(newGrid[r][nc].stack, state.grid[r][c].stack);
          newGrid[r][nc].stack = res.stack;
          if (res.wasDuplexFlip) duplexFlipped = true;
          if (res.matched && res.matchedColor) {
            matchedLocations.push({
              r,
              c: nc,
              color: res.matchedColor,
              wasDuplexFlip: res.wasDuplexFlip,
            });
          }
          if (res.carbonStamped && res.carbonColor) {
            carbonStampedLocations.push({ r, c: nc, color: res.carbonColor });
          }
        }
      } else {
        // Stationary left side shifted so crease sits at right edge of newGrid
        for (let c = 0; c < index; c++) {
          const nc = c + shift;
          newGrid[r][nc].stack = [...state.grid[r][c].stack];
          newGrid[r][nc].pinned = state.grid[r][c].pinned;
        }
        // Moving right side folds left across `index`
        for (let c = index; c < state.cols; c++) {
          const nc = index - 1 - (c - index) + shift;
          const res = mergeStacks(newGrid[r][nc].stack, state.grid[r][c].stack);
          newGrid[r][nc].stack = res.stack;
          if (res.wasDuplexFlip) duplexFlipped = true;
          if (res.matched && res.matchedColor) {
            matchedLocations.push({
              r,
              c: nc,
              color: res.matchedColor,
              wasDuplexFlip: res.wasDuplexFlip,
            });
          }
          if (res.carbonStamped && res.carbonColor) {
            carbonStampedLocations.push({ r, c: nc, color: res.carbonColor });
          }
        }
      }
    }

    // Transform tapes cleanly (stationary tapes take priority if mirrored tape overlaps)
    const nextTapes: OneWayTape[] = [];
    const seenTapeV = new Set<number>();

    for (const t of state.tapes) {
      if (t.orientation === 'h') {
        nextTapes.push({ ...t });
      } else if (t.index !== index) {
        const isStationary = dir === 'right' ? t.index > index : t.index < index;
        if (isStationary) {
          const mappedIdx = dir === 'right' ? t.index - index : t.index + shift;
          if (mappedIdx > 0 && mappedIdx < newCols && !seenTapeV.has(mappedIdx)) {
            seenTapeV.add(mappedIdx);
            nextTapes.push({ ...t, index: mappedIdx });
          }
        }
      }
    }
    for (const t of state.tapes) {
      if (t.orientation === 'v' && t.index !== index) {
        const isMoving = dir === 'right' ? t.index < index : t.index > index;
        if (isMoving) {
          const dist = Math.abs(t.index - index);
          const mappedIdx = dir === 'right' ? dist : index - dist + shift;
          if (mappedIdx > 0 && mappedIdx < newCols && !seenTapeV.has(mappedIdx)) {
            seenTapeV.add(mappedIdx);
            nextTapes.push({
              orientation: 'v',
              index: mappedIdx,
              allowDir: flipDir(t.allowDir),
            });
          }
        }
      }
    }

    // Transform perforations cleanly
    const nextPerfs: PerforatedCrease[] = [];
    const seenPerfV = new Set<number>();
    for (const pf of state.perforations) {
      if (pf.orientation === 'h') {
        nextPerfs.push({ ...pf });
      } else if (pf.index !== index) {
        const isStationary = dir === 'right' ? pf.index > index : pf.index < index;
        const dist = Math.abs(pf.index - index);
        const mappedIdx = isStationary
          ? dir === 'right'
            ? pf.index - index
            : pf.index + shift
          : dir === 'right'
            ? dist
            : index - dist + shift;
        if (mappedIdx > 0 && mappedIdx < newCols && !seenPerfV.has(mappedIdx)) {
          seenPerfV.add(mappedIdx);
          nextPerfs.push({ orientation: 'v', index: mappedIdx });
        }
      }
    }

    // Transform locked creases cleanly (stationary takes priority)
    const mappedLocks: LockedCrease[] = [];
    const seenLockV = new Set<number>();
    for (const lk of state.locks) {
      if (lk.orientation === 'h') {
        mappedLocks.push({ ...lk });
      } else if (lk.index !== index) {
        const isStationary = dir === 'right' ? lk.index > index : lk.index < index;
        if (isStationary) {
          const mappedIdx = dir === 'right' ? lk.index - index : lk.index + shift;
          if (mappedIdx > 0 && mappedIdx < newCols && !seenLockV.has(mappedIdx)) {
            seenLockV.add(mappedIdx);
            mappedLocks.push({ ...lk, index: mappedIdx });
          }
        }
      }
    }
    for (const lk of state.locks) {
      if (lk.orientation === 'v' && lk.index !== index) {
        const isMoving = dir === 'right' ? lk.index < index : lk.index > index;
        if (isMoving) {
          const dist = Math.abs(lk.index - index);
          const mappedIdx = dir === 'right' ? dist : index - dist + shift;
          if (mappedIdx > 0 && mappedIdx < newCols && !seenLockV.has(mappedIdx)) {
            seenLockV.add(mappedIdx);
            mappedLocks.push({ ...lk, index: mappedIdx });
          }
        }
      }
    }

    const { remainingLocks, unlockedCount } = resolveUnlockedLocks(newGrid, mappedLocks);

    return {
      nextState: {
        rows: state.rows,
        cols: newCols,
        grid: newGrid,
        tapes: nextTapes,
        perforations: nextPerfs,
        locks: remainingLocks,
      },
      matchedLocations,
      carbonStampedLocations,
      duplexFlipped,
      tornOff: false,
      unlockedLocksCount: unlockedCount,
    };
  } else {
    const topSpan = index;
    const bottomSpan = state.rows - index;
    const newRows = Math.max(topSpan, bottomSpan);
    const newGrid: CellState[][] = Array.from({ length: newRows }, () =>
      Array.from({ length: state.cols }, () => ({ stack: [], pinned: false }))
    );

    const shift = dir === 'up' ? Math.max(0, bottomSpan - topSpan) : 0;

    for (let c = 0; c < state.cols; c++) {
      if (dir === 'down') {
        for (let r = index; r < state.rows; r++) {
          const nr = r - index;
          newGrid[nr][c].stack = [...state.grid[r][c].stack];
          newGrid[nr][c].pinned = state.grid[r][c].pinned;
        }
        for (let r = index - 1; r >= 0; r--) {
          const nr = index - 1 - r;
          const res = mergeStacks(newGrid[nr][c].stack, state.grid[r][c].stack);
          newGrid[nr][c].stack = res.stack;
          if (res.wasDuplexFlip) duplexFlipped = true;
          if (res.matched && res.matchedColor) {
            matchedLocations.push({
              r: nr,
              c,
              color: res.matchedColor,
              wasDuplexFlip: res.wasDuplexFlip,
            });
          }
          if (res.carbonStamped && res.carbonColor) {
            carbonStampedLocations.push({ r: nr, c, color: res.carbonColor });
          }
        }
      } else {
        for (let r = 0; r < index; r++) {
          const nr = r + shift;
          newGrid[nr][c].stack = [...state.grid[r][c].stack];
          newGrid[nr][c].pinned = state.grid[r][c].pinned;
        }
        for (let r = index; r < state.rows; r++) {
          const nr = index - 1 - (r - index) + shift;
          const res = mergeStacks(newGrid[nr][c].stack, state.grid[r][c].stack);
          newGrid[nr][c].stack = res.stack;
          if (res.wasDuplexFlip) duplexFlipped = true;
          if (res.matched && res.matchedColor) {
            matchedLocations.push({
              r: nr,
              c,
              color: res.matchedColor,
              wasDuplexFlip: res.wasDuplexFlip,
            });
          }
          if (res.carbonStamped && res.carbonColor) {
            carbonStampedLocations.push({ r: nr, c, color: res.carbonColor });
          }
        }
      }
    }

    const nextTapes: OneWayTape[] = [];
    const seenTapeH = new Set<number>();

    for (const t of state.tapes) {
      if (t.orientation === 'v') {
        nextTapes.push({ ...t });
      } else if (t.index !== index) {
        const isStationary = dir === 'down' ? t.index > index : t.index < index;
        if (isStationary) {
          const mappedIdx = dir === 'down' ? t.index - index : t.index + shift;
          if (mappedIdx > 0 && mappedIdx < newRows && !seenTapeH.has(mappedIdx)) {
            seenTapeH.add(mappedIdx);
            nextTapes.push({ ...t, index: mappedIdx });
          }
        }
      }
    }
    for (const t of state.tapes) {
      if (t.orientation === 'h' && t.index !== index) {
        const isMoving = dir === 'down' ? t.index < index : t.index > index;
        if (isMoving) {
          const dist = Math.abs(t.index - index);
          const mappedIdx = dir === 'down' ? dist : index - dist + shift;
          if (mappedIdx > 0 && mappedIdx < newRows && !seenTapeH.has(mappedIdx)) {
            seenTapeH.add(mappedIdx);
            nextTapes.push({
              orientation: 'h',
              index: mappedIdx,
              allowDir: flipDir(t.allowDir),
            });
          }
        }
      }
    }

    const nextPerfs: PerforatedCrease[] = [];
    const seenPerfH = new Set<number>();
    for (const pf of state.perforations) {
      if (pf.orientation === 'v') {
        nextPerfs.push({ ...pf });
      } else if (pf.index !== index) {
        const isStationary = dir === 'down' ? pf.index > index : pf.index < index;
        const dist = Math.abs(pf.index - index);
        const mappedIdx = isStationary
          ? dir === 'down'
            ? pf.index - index
            : pf.index + shift
          : dir === 'down'
            ? dist
            : index - dist + shift;
        if (mappedIdx > 0 && mappedIdx < newRows && !seenPerfH.has(mappedIdx)) {
          seenPerfH.add(mappedIdx);
          nextPerfs.push({ orientation: 'h', index: mappedIdx });
        }
      }
    }

    const mappedLocks: LockedCrease[] = [];
    const seenLockH = new Set<number>();
    for (const lk of state.locks) {
      if (lk.orientation === 'v') {
        mappedLocks.push({ ...lk });
      } else if (lk.index !== index) {
        const isStationary = dir === 'down' ? lk.index > index : lk.index < index;
        if (isStationary) {
          const mappedIdx = dir === 'down' ? lk.index - index : lk.index + shift;
          if (mappedIdx > 0 && mappedIdx < newRows && !seenLockH.has(mappedIdx)) {
            seenLockH.add(mappedIdx);
            mappedLocks.push({ ...lk, index: mappedIdx });
          }
        }
      }
    }
    for (const lk of state.locks) {
      if (lk.orientation === 'h' && lk.index !== index) {
        const isMoving = dir === 'down' ? lk.index < index : lk.index > index;
        if (isMoving) {
          const dist = Math.abs(lk.index - index);
          const mappedIdx = dir === 'down' ? dist : index - dist + shift;
          if (mappedIdx > 0 && mappedIdx < newRows && !seenLockH.has(mappedIdx)) {
            seenLockH.add(mappedIdx);
            mappedLocks.push({ ...lk, index: mappedIdx });
          }
        }
      }
    }

    const { remainingLocks, unlockedCount } = resolveUnlockedLocks(newGrid, mappedLocks);

    return {
      nextState: {
        rows: newRows,
        cols: state.cols,
        grid: newGrid,
        tapes: nextTapes,
        perforations: nextPerfs,
        locks: remainingLocks,
      },
      matchedLocations,
      carbonStampedLocations,
      duplexFlipped,
      tornOff: false,
      unlockedLocksCount: unlockedCount,
    };
  }
}

export function getAllLegalFolds(state: BoardState): FoldAction[] {
  const actions: FoldAction[] = [];
  for (let c = 1; c < state.cols; c++) {
    if (!getFoldBlockReason(state, 'v', c, 'right')) {
      actions.push({ orientation: 'v', index: c, dir: 'right' });
    }
    if (!getFoldBlockReason(state, 'v', c, 'left')) {
      actions.push({ orientation: 'v', index: c, dir: 'left' });
    }
  }
  for (let r = 1; r < state.rows; r++) {
    if (!getFoldBlockReason(state, 'h', r, 'down')) {
      actions.push({ orientation: 'h', index: r, dir: 'down' });
    }
    if (!getFoldBlockReason(state, 'h', r, 'up')) {
      actions.push({ orientation: 'h', index: r, dir: 'up' });
    }
  }
  return actions;
}

export function serializeBoard(state: BoardState): string {
  const parts: string[] = [`${state.rows}x${state.cols}`];
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      const cell = state.grid[r][c];
      const nonNull = cell.stack.filter((s) => s !== null);
      parts.push((cell.pinned ? 'P:' : '') + nonNull.join(','));
    }
  }
  if (state.tapes.length > 0) {
    const tStr = state.tapes
      .map((t) => `${t.orientation}${t.index}${t.allowDir[0]}`)
      .sort()
      .join('.');
    parts.push('T:' + tStr);
  }
  if (state.perforations.length > 0) {
    const pStr = state.perforations
      .map((pf) => `${pf.orientation}${pf.index}`)
      .sort()
      .join('.');
    parts.push('F:' + pStr);
  }
  if (state.locks.length > 0) {
    const lStr = state.locks
      .map((lk) => `${lk.orientation}${lk.index}${lk.keySymbol[0]}`)
      .sort()
      .join('.');
    parts.push('L:' + lStr);
  }
  return parts.join('|');
}
