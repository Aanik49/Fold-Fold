import React, { useEffect, useRef } from 'react';
import { BookOpen, Music, Volume2, VolumeX } from 'lucide-react';
import { foldAudio } from '../game/audio';
import { createRisoPatterns, renderPosterBackdrop, RisoPatterns } from '../game/renderer';
import { CategoryDef, ProgressMap } from '../game/types';
import { GameIcon, SymbolIconSvg } from './GameIcon';
import { PWAInstallButton } from './PWAInstallButton';

interface TitleLobbyProps {
  categories: CategoryDef[];
  selectedCategoryIdx: number;
  onSelectCategoryIdx: (idx: number) => void;
  onOpenCategory: (categoryId: string) => void;
  onQuickPlayCategory: (categoryId: string) => void;
  progress: ProgressMap;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onOpenGuide: () => void;
}

export const TitleLobby: React.FC<TitleLobbyProps> = ({
  categories,
  selectedCategoryIdx,
  onSelectCategoryIdx,
  onOpenCategory,
  onQuickPlayCategory,
  progress,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onOpenGuide,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Total stars across all 100 levels (max 300)
  const totalStars = categories.reduce(
    (sum, cat) =>
      sum +
      cat.levels.reduce((s, lvl) => s + (progress[lvl.id]?.bestStars ?? 0), 0),
    0
  );
  const totalCleared = categories.reduce(
    (sum, cat) =>
      sum +
      cat.levels.filter((lvl) => (progress[lvl.id]?.bestStars ?? 0) > 0).length,
    0
  );

  // Keyboard navigation for folder fan
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        const next = (selectedCategoryIdx + 1) % categories.length;
        foldAudio.playClick(540 + next * 50);
        onSelectCategoryIdx(next);
      } else if (e.key === 'ArrowLeft') {
        const prev = (selectedCategoryIdx - 1 + categories.length) % categories.length;
        foldAudio.playClick(540 + prev * 50);
        onSelectCategoryIdx(prev);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        foldAudio.playCardstockFold();
        onOpenCategory(categories[selectedCategoryIdx].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [categories, selectedCategoryIdx, onSelectCategoryIdx, onOpenCategory]);

  // Animated Bauhaus Risograph poster backdrop canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const patterns: RisoPatterns = createRisoPatterns(ctx);
    let rafId = 0;
    let time = 0;
    let lastTs = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
      lastTs = ts;
      time += dt;
      renderPosterBackdrop(ctx, patterns, window.innerWidth, window.innerHeight, time);
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
      {/* Live Bauhaus Risograph Poster Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />

      {/* Perimeter Top Bar */}
      <header className="relative z-10 px-4 pt-4 sm:px-7 sm:pt-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <GameIcon size={38} className="shrink-0" />
          <div className="hidden sm:flex items-center gap-2 font-mono-riso text-xs font-extrabold text-[#141414] whitespace-nowrap">
            <span>{totalCleared}/100 CLEARED</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#E63946]">★ {totalStars}/300</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pr-0.5">
          <PWAInstallButton />

          <button
            onClick={() => {
              foldAudio.playClick(560);
              onOpenGuide();
            }}
            className="riso-btn h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" strokeWidth={2.4} />
            <span className="hidden xs:inline sm:inline">Guide</span>
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
            title={sfxEnabled ? 'Mute Sound Effects (M)' : 'Enable Sound Effects (M)'}
            aria-label={sfxEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          >
            {sfxEnabled ? (
              <Volume2 className="w-4 h-4 text-[#141414]" strokeWidth={2.5} />
            ) : (
              <VolumeX className="w-4 h-4 text-[#E63946]" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </header>

      {/* Main Swiss Poster Centerpiece */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-3 min-h-0">
        {/* Stacked Bold Poster Typography: FOLD / FOLD */}
        <div className="text-center select-none leading-[0.84] mb-4 sm:mb-6">
          <h1 className="font-poster text-[3.5rem] sm:text-[5rem] md:text-[5.6rem] tracking-tight text-[#141414]">
            FOLD
          </h1>
          <div className="relative font-poster text-[3.5rem] sm:text-[5rem] md:text-[5.6rem] tracking-tight">
            <span
              aria-hidden="true"
              className="absolute inset-0 text-[#F4A261]/55 translate-x-[3px] translate-y-[2.5px]"
            >
              FOLD
            </span>
            <span className="relative text-[#E63946]">FOLD</span>
          </div>
          <p className="mt-2 font-mono-riso text-[11px] sm:text-xs font-bold tracking-wider text-[#141414]/75">
            5 ARCHIVAL VOLUMES · 20 GEOMETRIC SHEETS EACH
          </p>
        </div>

        {/* Fanned Stack of 5 Archival Index Folder Cards */}
        <div className="relative w-full max-w-4xl flex items-center justify-center h-[290px] sm:h-[315px]">
          {categories.map((cat, idx) => {
            const isSelected = idx === selectedCategoryIdx;
            const rel = idx - selectedCategoryIdx;
            const catStars = cat.levels.reduce(
              (sum, l) => sum + (progress[l.id]?.bestStars ?? 0),
              0
            );
            const catCleared = cat.levels.filter(
              (l) => (progress[l.id]?.bestStars ?? 0) > 0
            ).length;

            // Fan offset geometry
            const xOffset = rel * 118;
            const yOffset = Math.abs(rel) * 14 - (isSelected ? 10 : 0);
            const rot = rel * 3.8;
            const zIndex = isSelected ? 30 : 20 - Math.abs(rel) * 3;
            const scale = isSelected ? 1 : Math.max(0.86, 1 - Math.abs(rel) * 0.055);

            return (
              <div
                key={cat.id}
                onClick={() => {
                  foldAudio.unlock();
                  if (isSelected) {
                    foldAudio.playCardstockFold();
                    onOpenCategory(cat.id);
                  } else {
                    foldAudio.playClick(520 + idx * 55);
                    onSelectCategoryIdx(idx);
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (isSelected) {
                      foldAudio.playCardstockFold();
                      onOpenCategory(cat.id);
                    } else {
                      foldAudio.playClick(520 + idx * 55);
                      onSelectCategoryIdx(idx);
                    }
                  }
                }}
                style={{
                  transform: `translate3d(${xOffset}px, ${yOffset}px, 0) rotate(${rot}deg) scale(${scale})`,
                  zIndex,
                }}
                className="absolute w-[262px] sm:w-[292px] cursor-pointer transition-transform duration-200 ease-out select-none group"
              >
                {/* Archival Folder Tab */}
                <div
                  style={{
                    backgroundColor: cat.cardColor,
                    color: cat.cardText,
                    marginLeft: `${(idx % 3) * 56}px`,
                  }}
                  className="w-24 h-6 rounded-t-lg border-t-[2.5px] border-x-[2.5px] border-[#141414] px-2.5 flex items-center justify-between font-mono-riso text-[11px] font-extrabold relative top-[2px]"
                >
                  <span>VOL.{cat.code}</span>
                  <span>20</span>
                </div>

                {/* Folder Card Body */}
                <div
                  style={{
                    backgroundColor: cat.cardColor,
                    color: cat.cardText,
                    boxShadow: isSelected
                      ? '8px 8px 0px #141414'
                      : '5px 5px 0px rgba(20,20,20,0.65)',
                  }}
                  className="rounded-b-xl rounded-tr-xl border-[2.5px] border-[#141414] p-4 flex flex-col gap-3"
                >
                  {/* Top Row: Code & Stars */}
                  <div className="flex items-baseline justify-between">
                    <span className="font-poster text-2xl leading-none">{cat.code}</span>
                    <span className="font-mono-riso text-xs font-extrabold opacity-90">
                      ★ {catStars}/60
                    </span>
                  </div>

                  {/* White Geometric Symbol Preview Strip */}
                  <div className="bg-[#FAF8F5] border-2 border-[#141414] rounded-md px-3 py-2 flex items-center justify-around">
                    {cat.previewSymbols.map((sym, sIdx) => (
                      <SymbolIconSvg key={sIdx} type={sym} size={24} />
                    ))}
                  </div>

                  {/* Category Title & Progress */}
                  <div>
                    <h2 className="font-poster text-base uppercase leading-tight">
                      {cat.title}
                    </h2>
                    <div className="mt-0.5 flex items-center justify-between text-[11px] font-medium opacity-85">
                      <span>{cat.subtitle}</span>
                      <span className="font-mono-riso font-bold">{catCleared}/20</span>
                    </div>
                  </div>

                  {/* Action Buttons on Active Card */}
                  {isSelected ? (
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          foldAudio.unlock();
                          foldAudio.playCardstockFold();
                          onQuickPlayCategory(cat.id);
                        }}
                        className="riso-btn flex-1 py-2.5 px-3 rounded-lg bg-[#FAF8F5] text-[#141414] font-poster text-sm uppercase tracking-wide whitespace-nowrap cursor-pointer"
                      >
                        PLAY &gt;&gt;&gt;
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          foldAudio.unlock();
                          foldAudio.playClick(640);
                          onOpenCategory(cat.id);
                        }}
                        className="riso-btn py-2.5 px-3 rounded-lg bg-[#F2EFE9] text-[#141414] font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap cursor-pointer"
                      >
                        20 SHEETS
                      </button>
                    </div>
                  ) : (
                    <div className="h-[42px] flex items-center justify-between border-t border-current/20 pt-2 font-mono-riso text-[10px] font-bold uppercase opacity-75">
                      <span>Click to inspect</span>
                      <span>20 Levels</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Selector Indicator Bar */}
        <div className="mt-3 flex items-center gap-2">
          {categories.map((cat, idx) => {
            const active = idx === selectedCategoryIdx;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  foldAudio.playClick(520 + idx * 55);
                  onSelectCategoryIdx(idx);
                }}
                aria-label={`Select volume ${cat.code} ${cat.title}`}
                className={`h-8 px-2.5 rounded-lg border-2 border-[#141414] font-mono-riso text-xs font-extrabold transition-transform cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#141414] text-[#FAF8F5] -translate-y-0.5'
                    : 'bg-[#FAF8F5] text-[#141414] hover:-translate-y-0.5'
                }`}
              >
                {cat.code}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
