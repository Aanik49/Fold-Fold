import React from 'react';
import { ArrowLeft, BookOpen, Music, Volume2, VolumeX } from 'lucide-react';
import { foldAudio } from '../game/audio';
import { getSymbolColor } from '../game/engine';
import { CategoryDef, LevelDef, ProgressMap } from '../game/types';

interface LevelSelectProps {
  categories: CategoryDef[];
  activeCategory: CategoryDef;
  onSelectCategory: (categoryId: string) => void;
  onSelectLevel: (level: LevelDef) => void;
  onBackToLobby: () => void;
  progress: ProgressMap;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onOpenGuide: () => void;
}

const MiniGridPreview: React.FC<{ level: LevelDef }> = ({ level }) => {
  const symMap = new Map<string, string>();
  for (const s of level.symbols) {
    symMap.set(`${s.r},${s.c}`, getSymbolColor(s.type));
  }
  const pinSet = new Set(level.pins.map((p) => `${p.r},${p.c}`));

  return (
    <div
      className="grid gap-1 p-1.5 bg-[#F2EFE9] border border-[#141414]/40 rounded"
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
            className="w-3 h-3 rounded-[2px] bg-[#FAF8F5] border border-[#141414]/35 flex items-center justify-center relative"
          >
            {color && (
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
            {isPinned && (
              <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full bg-[#F4A261] border border-[#141414]" />
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
      <header className="px-3.5 py-3 sm:px-7 sm:py-4 border-b-[2.5px] border-[#141414] bg-[#FAF8F5] flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 shrink-0">
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
                  className={`h-10 px-3 rounded-xl border-2 border-[#141414] font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 transition-transform cursor-pointer ${
                    isActive
                      ? 'shadow-[2px_2px_0px_#141414]'
                      : 'bg-[#F2EFE9] text-[#141414] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {cat.code} · {cat.title}
                </button>
              );
            })}
          </div>

          {/* Mobile Audio Controls on Row 1 */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0 pr-0.5">
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
                className={`w-4 h-4 ${musicEnabled ? 'text-[#1D3557]' : 'text-[#E63946]'}`}
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={onToggleSfx}
              aria-label={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
              className="riso-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
            >
              {sfxEnabled ? (
                <Volume2 className="w-4 h-4 text-[#141414]" strokeWidth={2.5} />
              ) : (
                <VolumeX className="w-4 h-4 text-[#E63946]" strokeWidth={2.5} />
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
                className={`h-8 flex-1 min-w-[52px] px-2 rounded-lg border-2 border-[#141414] font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'shadow-[2px_2px_0px_#141414]'
                    : 'bg-[#F2EFE9] text-[#141414]'
                }`}
              >
                {cat.code}
              </button>
            );
          })}
        </div>

        {/* Desktop Audio Controls */}
        <div className="hidden md:flex items-center gap-2 shrink-0 pr-0.5">
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
              className={`w-4 h-4 ${musicEnabled ? 'text-[#1D3557]' : 'text-[#E63946]'}`}
              strokeWidth={2.5}
            />
          </button>
          <button
            onClick={onToggleSfx}
            aria-label={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
            className="riso-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          >
            {sfxEnabled ? (
              <Volume2 className="w-4 h-4 text-[#141414]" strokeWidth={2.5} />
            ) : (
              <VolumeX className="w-4 h-4 text-[#E63946]" strokeWidth={2.5} />
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
            className="rounded-2xl border-[2.5px] border-[#141414] shadow-[5px_5px_0px_#141414] p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
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

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    foldAudio.unlock();
                    foldAudio.playCardstockFold();
                    onSelectLevel(lvl);
                  }}
                  className={`riso-btn rounded-xl p-3.5 text-left flex flex-col justify-between gap-2.5 cursor-pointer ${
                    isCleared ? 'bg-[#FAF8F5]' : 'bg-[#FAF8F5]'
                  }`}
                >
                  {/* Card Top Row */}
                  <div className="flex items-start justify-between gap-1">
                    <span
                      style={{
                        backgroundColor: isCleared
                          ? activeCategory.cardColor
                          : '#F2EFE9',
                        color: isCleared ? activeCategory.cardText : '#141414',
                      }}
                      className="font-poster text-sm px-2 py-0.5 rounded border-[1.8px] border-[#141414]"
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
                            s < stars ? 'text-[#E63946]' : 'text-[#141414]/20'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mini Geometric Board Preview */}
                  <div className="flex items-center justify-center py-1">
                    <MiniGridPreview level={lvl} />
                  </div>

                  {/* Card Footer */}
                  <div>
                    <div className="font-bold text-xs text-[#141414] truncate">
                      {lvl.title}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between font-mono-riso text-[10px] font-bold text-[#141414]/65">
                      <span>
                        {lvl.rows}×{lvl.cols} · PAR {lvl.par}
                      </span>
                      <span className="flex items-center gap-1">
                        {hasTape && (
                          <span title="One-Way Tape" className="text-[#D97706]">
                            ▸
                          </span>
                        )}
                        {hasDuplex && (
                          <span title="Duplex Ink" className="text-[#1D3557]">
                            ◐
                          </span>
                        )}
                        {hasWild && (
                          <span title="Wild Prism" className="text-[#1E6B5C]">
                            ◆
                          </span>
                        )}
                        {hasPin && (
                          <span title="Brass Pin" className="text-[#141414]">
                            ●
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
