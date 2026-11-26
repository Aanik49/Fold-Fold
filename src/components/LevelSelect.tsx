import React from 'react';
import { ArrowLeft, BookOpen, Music, Palette, Volume2, VolumeX } from 'lucide-react';
import { foldAudio } from '../game/audio';
import { getSymbolColor, isCarbonSymbol } from '../game/engine';
import { RisoPalette, RisoTheme } from '../game/themes';
import { CategoryDef, LevelDef, ProgressMap } from '../game/types';

interface LevelSelectProps {
  categories: CategoryDef[];
  activeCategory: CategoryDef;
  onSelectCategory: (categoryId: string) => void;
  onSelectLevel: (level: LevelDef) => void;
  onBackToLobby: () => void;
  progress: ProgressMap;
  activeTheme: RisoTheme;
  hasNewThemeUnlock: boolean;
  onOpenThemes: () => void;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onOpenGuide: () => void;
}

const MiniGridPreview: React.FC<{ level: LevelDef; palette: RisoPalette }> = ({
  level,
  palette,
}) => {
  const symMap = new Map<string, string>();
  for (const s of level.symbols) {
    symMap.set(`${s.r},${s.c}`, getSymbolColor(s.type, palette));
  }
  const pinSet = new Set(level.pins.map((p) => `${p.r},${p.c}`));

  return (
    <div
      className="grid gap-1 p-1.5 bg-[var(--newsprint)] border border-[var(--charcoal-ink)]/40 rounded"
      style={{
        gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: level.rows * level.cols }).map((_, idx) => {
        const r = Math.floor(idx / level.cols);
        const c = idx % level.cols;
        const key = `${r},${c}`;
        const color = symMap.get(key);
        const isPinned = pinSet.has(key);
        return (
          <div
            key={key}
            className="w-3 h-3 rounded-[2px] bg-[var(--paper-white)] border border-[var(--charcoal-ink)]/35 flex items-center justify-center relative"
          >
            {color && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
            {isPinned && (
              <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-[var(--mustard-yellow)] border border-[var(--charcoal-ink)]" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const LevelSelect: React.FC<LevelSelectProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onSelectLevel,
  onBackToLobby,
  progress,
  activeTheme,
  hasNewThemeUnlock,
  onOpenThemes,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onOpenGuide,
}) => {
  const catStars = activeCategory.levels.reduce(
    (sum, lvl) => sum + (progress[lvl.id]?.bestStars ?? 0),
    0
  );
  const catCleared = activeCategory.levels.filter(
    (lvl) => (progress[lvl.id]?.bestStars ?? 0) > 0
  ).length;

  return (
    <div className="w-full h-full flex flex-col riso-grain-bg overflow-hidden">
      {/* Top Bar */}
      <header className="px-3.5 py-3 sm:px-7 sm:py-4 border-b-[2.5px] border-[var(--charcoal-ink)] bg-[var(--paper-white)] flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 shrink-0">
        <div className="flex items-center justify-between md:justify-start gap-2.5 min-w-0">
          <button
            onClick={() => {
              foldAudio.playClick(480);
              onBackToLobby();
            }}
            className="riso-btn h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.6} />
            <span>Lobby</span>
          </button>

          {/* Desktop 5-Volume Folder Switcher */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    foldAudio.playClick(560);
                    onSelectCategory(cat.id);
                  }}
                  style={
                    isActive
                      ? { backgroundColor: cat.cardColor, color: cat.cardText }
                      : undefined
                  }
                  className={`h-10 px-3 rounded-xl border-2 border-[var(--charcoal-ink)] font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 transition-transform cursor-pointer ${
                    isActive
                      ? 'shadow-[2px_2px_0px_var(--charcoal-ink)]'
                      : 'bg-[var(--newsprint)] text-[var(--charcoal-ink)] hover:bg-[var(--paper-white)]'
                  }`}
                >
                  {cat.code} · {cat.title}
                </button>
              );
            })}
          </div>

          {/* Mobile Controls on Row 1 */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0 pr-0.5">
            <button
              onClick={() => {
                foldAudio.playClick(590);
                onOpenThemes();
              }}
              aria-label="Paper and Ink Themes"
              className="riso-btn relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
              {hasNewThemeUnlock && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--signal-red)] border-[1.5px] border-[var(--charcoal-ink)]" />
              )}
            </button>
            <button
              onClick={() => {
                foldAudio.playClick(560);
                onOpenGuide();
              }}
              aria-label="How to Play"
              className="riso-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" strokeWidth={2.4} />
            </button>
            <button
              onClick={onToggleMusic}
              aria-label={musicEnabled ? 'Mute Music' : 'Play Music'}
              className={`riso-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${
                musicEnabled ? '' : 'opacity-65'
              }`}
            >
              <Music
                className={`w-4 h-4 ${
                  musicEnabled
                    ? 'text-[var(--cobalt-blue)]'
                    : 'text-[var(--signal-red)]'
                }`}
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={onToggleSfx}
              aria-label={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
              className="riso-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              {sfxEnabled ? (
                <Volume2 className="w-4 h-4 text-[var(--charcoal-ink)]" strokeWidth={2.5} />
              ) : (
                <VolumeX className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile 5-Volume Switcher Row */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-0.5">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  foldAudio.playClick(560);
                  onSelectCategory(cat.id);
                }}
                style={
                  isActive
                    ? { backgroundColor: cat.cardColor, color: cat.cardText }
                    : undefined
                }
                className={`h-8 flex-1 min-w-[52px] px-2 rounded-lg border-2 border-[var(--charcoal-ink)] font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'shadow-[2px_2px_0px_var(--charcoal-ink)]'
                    : 'bg-[var(--newsprint)] text-[var(--charcoal-ink)]'
                }`}
              >
                {cat.code}
              </button>
            );
          })}
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2 shrink-0 pr-0.5">
          <button
            onClick={() => {
              foldAudio.playClick(590);
              onOpenThemes();
            }}
            title={`Paper & Ink Themes (${activeTheme.name})`}
            aria-label="Paper and Ink Themes"
            className="riso-btn relative h-10 px-3 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Palette className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
            <span>Inks</span>
            {hasNewThemeUnlock && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--signal-red)] border-[1.5px] border-[var(--charcoal-ink)]" />
            )}
          </button>
          <button
            onClick={() => {
              foldAudio.playClick(560);
              onOpenGuide();
            }}
            className="riso-btn h-10 px-3 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" strokeWidth={2.4} />
            <span>Guide</span>
          </button>
          <button
            onClick={onToggleMusic}
            aria-label={musicEnabled ? 'Mute Music' : 'Play Music'}
            className={`riso-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${
              musicEnabled ? '' : 'opacity-65'
            }`}
          >
            <Music
              className={`w-4 h-4 ${
                musicEnabled
                  ? 'text-[var(--cobalt-blue)]'
                  : 'text-[var(--signal-red)]'
              }`}
              strokeWidth={2.5}
            />
          </button>
          <button
            onClick={onToggleSfx}
            aria-label={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="riso-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          >
            {sfxEnabled ? (
              <Volume2 className="w-4 h-4 text-[var(--charcoal-ink)]" strokeWidth={2.5} />
            ) : (
              <VolumeX className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </header>

      {/* Scrollable 20-Sheet Archival Catalog */}
      <main className="flex-1 overflow-y-auto riso-scroll px-4 py-5 sm:px-8 sm:py-6">
        <div className="max-w-5xl mx-auto">
          {/* Category Exhibition Banner */}
          <div
            style={{
              backgroundColor: activeCategory.cardColor,
              color: activeCategory.cardText,
            }}
            className="rounded-2xl border-[2.5px] border-[var(--charcoal-ink)] shadow-[5px_5px_0px_var(--charcoal-ink)] p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <div className="font-mono-riso text-xs font-extrabold opacity-85 uppercase tracking-wider">
                Volume {activeCategory.code} · {activeCategory.subtitle}
              </div>
              <h1 className="font-poster text-2xl sm:text-3xl uppercase mt-0.5">
                {activeCategory.title}
              </h1>
              <p className="text-xs sm:text-sm mt-1.5 opacity-90 max-w-2xl">
                {activeCategory.mechanicNote}
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono-riso shrink-0">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase opacity-75">Cleared</div>
                <div className="font-poster text-xl">{catCleared}/20</div>
              </div>
              <div className="w-px h-9 bg-current opacity-30" />
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase opacity-75">Stars</div>
                <div className="font-poster text-xl">★ {catStars}/60</div>
              </div>
            </div>
          </div>

          {/* 20 Numbered Sheet Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 pb-6">
            {activeCategory.levels.map((lvl) => {
              const p = progress[lvl.id];
              const stars = p?.bestStars ?? 0;
              const isCleared = stars > 0;
              const hasTape = lvl.tapes.length > 0;
              const hasPin = lvl.pins.length > 0;
              const hasDuplex = lvl.symbols.some(
                (s) => s.type === 'duplex_rb' || s.type === 'duplex_br'
              );
              const hasWild = lvl.symbols.some((s) => s.type === 'wild');
              const hasPerf = (lvl.perforations?.length ?? 0) > 0;
              const hasCarbon = lvl.symbols.some((s) => isCarbonSymbol(s.type));
              const hasLock = (lvl.locks?.length ?? 0) > 0;

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    foldAudio.unlock();
                    foldAudio.playCardstockFold();
                    onSelectLevel(lvl);
                  }}
                  className="riso-btn rounded-xl p-3.5 text-left flex flex-col justify-between gap-2.5 cursor-pointer bg-[var(--paper-white)]"
                >
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-1">
                    <span
                      style={{
                        backgroundColor: isCleared
                          ? activeCategory.cardColor
                          : 'var(--newsprint)',
                        color: isCleared
                          ? activeCategory.cardText
                          : 'var(--charcoal-ink)',
                      }}
                      className="font-poster text-sm px-2 py-0.5 rounded border-[1.8px] border-[var(--charcoal-ink)]"
                    >
                      {lvl.code}
                    </span>

                    <div
                      className="flex items-center gap-0.5 text-sm leading-none"
                      aria-label={`${stars} of 3 stars`}
                    >
                      {[0, 1, 2].map((s) => (
                        <span
                          key={s}
                          className={
                            s < stars
                              ? 'text-[var(--signal-red)]'
                              : 'text-[var(--charcoal-ink)]/20'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mini Geometric Board Preview */}
                  <div className="flex items-center justify-center py-1">
                    <MiniGridPreview level={lvl} palette={activeTheme.palette} />
                  </div>

                  {/* Card Footer */}
                  <div>
                    <div className="font-bold text-xs text-[var(--charcoal-ink)] truncate">
                      {lvl.title}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between font-mono-riso text-[10px] font-bold text-[var(--charcoal-ink)]/65">
                      <span>
                        {lvl.rows}×{lvl.cols} · PAR {lvl.par}
                      </span>
                      <span className="flex items-center gap-1">
                        {hasTape && (
                          <span title="One-Way Tape" className="text-[var(--mustard-yellow)]">
                            ▸
                          </span>
                        )}
                        {hasDuplex && (
                          <span title="Duplex Ink" className="text-[var(--cobalt-blue)]">
                            ◐
                          </span>
                        )}
                        {hasWild && (
                          <span title="Wild Prism" className="text-[var(--riso-teal)]">
                            ◆
                          </span>
                        )}
                        {hasPin && (
                          <span title="Brass Pin" className="text-[var(--charcoal-ink)]">
                            ●
                          </span>
                        )}
                        {hasPerf && (
                          <span title="Perforated Tear Line" className="text-[var(--signal-red)]">
                            ✂
                          </span>
                        )}
                        {hasCarbon && (
                          <span title="Carbon Copy Ink" className="text-[var(--charcoal-ink)] font-extrabold">
                            2×
                          </span>
                        )}
                        {hasLock && (
                          <span title="Locked Crease" className="text-[var(--cobalt-blue)]">
                            ⚿
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
