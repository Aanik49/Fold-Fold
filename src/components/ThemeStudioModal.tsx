import React, { useEffect } from 'react';
import { Check, Lock, Palette, Sparkles, X } from 'lucide-react';
import { foldAudio } from '../game/audio';
import {
  getNextLockedTheme,
  isThemeUnlocked,
  RISO_THEMES,
  RisoTheme,
} from '../game/themes';
import { SymbolIconSvg } from './GameIcon';

interface ThemeStudioModalProps {
  open: boolean;
  activeThemeId: string;
  totalStars: number;
  campaignStars: number;
  dailyStars: number;
  onSelectTheme: (themeId: string) => void;
  onClose: () => void;
}

const ThemeSpecimenPreview: React.FC<{ theme: RisoTheme; locked: boolean }> = ({
  theme,
  locked,
}) => {
  const p = theme.palette;
  return (
    <div
      style={{
        backgroundColor: p.newsprint,
        borderColor: p.ink,
      }}
      className="relative rounded-xl border-2 p-2.5 overflow-hidden"
    >
      {/* Subtle Risograph halftone corner accent */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(${p.regMarkInk} 1px, transparent 0)`,
          backgroundSize: '8px 8px',
        }}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      {/* 2x2 Mini Folded Paper Board Preview */}
      <div className="relative flex items-center justify-between gap-2.5">
        <div
          style={{
            backgroundColor: p.paperWhite,
            borderColor: p.ink,
            boxShadow: `3px 3px 0px ${p.isDark ? 'rgba(0,0,0,0.55)' : p.ink}`,
          }}
          className="grid grid-cols-2 gap-1 p-1.5 rounded-lg border-2 shrink-0"
        >
          {(
            ['circle', 'cross', 'triangle', 'square'] as const
          ).map((sym) => (
            <div
              key={sym}
              style={{
                backgroundColor: p.paperShaded,
                borderColor: p.creaseInk,
              }}
              className="w-7 h-7 rounded-[4px] border border-dashed flex items-center justify-center"
            >
              <SymbolIconSvg type={sym} size={18} palette={p} />
            </div>
          ))}
        </div>

        {/* Ink Drum Swatch Strip + Paper Stock Readout */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {[p.red, p.blue, p.yellow, p.teal, p.ink].map((swatch, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: swatch,
                  borderColor: p.ink,
                }}
                className="w-4 h-4 rounded-[4px] border-[1.5px] shrink-0"
              />
            ))}
          </div>
          <div
            style={{ color: p.ink }}
            className="font-mono-riso text-[10px] font-bold leading-snug opacity-85 truncate"
          >
            {theme.paperStock}
          </div>
          <div className="flex items-center gap-1">
            <span
              style={{
                backgroundColor: p.red,
                color: p.badgeTextOnRed,
                borderColor: p.ink,
              }}
              className="font-mono-riso text-[9px] font-extrabold px-1.5 py-0.5 rounded border"
            >
              {theme.code}
            </span>
            {p.isDark && (
              <span
                style={{
                  backgroundColor: p.paperWhite,
                  color: p.ink,
                  borderColor: p.ink,
                }}
                className="font-mono-riso text-[9px] font-extrabold px-1.5 py-0.5 rounded border"
              >
                DARK STOCK
              </span>
            )}
          </div>
        </div>
      </div>

      {locked && (
        <div
          style={{
            backgroundColor: p.isDark
              ? 'rgba(10, 14, 24, 0.36)'
              : 'rgba(20, 20, 20, 0.14)',
          }}
          className="absolute inset-0 pointer-events-none"
        />
      )}
    </div>
  );
};

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({
  open,
  activeThemeId,
  totalStars,
  campaignStars,
  dailyStars,
  onSelectTheme,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  const unlockedCount = RISO_THEMES.filter((t) =>
    isThemeUnlocked(t, totalStars)
  ).length;
  const nextLocked = getNextLockedTheme(totalStars);
  const progressPct = nextLocked
    ? Math.min(100, Math.round((totalStars / nextLocked.requiredStars) * 100))
    : 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/55"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          foldAudio.playClick(460);
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Risograph Paper and Ink Studio"
    >
      <div className="riso-card rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-riso-pop">
        {/* Studio Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b-[2.5px] border-[var(--charcoal-ink)] bg-[var(--newsprint)] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-mono-riso text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[var(--signal-red)]">
              <Palette className="w-3.5 h-3.5 shrink-0" strokeWidth={2.6} />
              <span>
                RISOGRAPH PRESS STUDIO · {unlockedCount}/{RISO_THEMES.length} UNLOCKED
              </span>
            </div>
            <h2 className="font-poster text-lg sm:text-2xl uppercase text-[var(--charcoal-ink)] leading-tight truncate">
              PAPER &amp; INK PALETTES
            </h2>
          </div>

          <button
            onClick={() => {
              foldAudio.playClick(460);
              onClose();
            }}
            aria-label="Close Ink Studio"
            className="riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.6} />
          </button>
        </div>

        {/* Star Bank & Next Unlock Meter */}
        <div className="px-4 py-3 sm:px-6 border-b-2 border-[var(--charcoal-ink)] bg-[var(--paper-white)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1 rounded-lg border-2 border-[var(--charcoal-ink)] bg-[var(--newsprint)] font-mono-riso text-xs font-extrabold flex items-center gap-1.5">
              <span className="text-[var(--signal-red)]">★</span>
              <span>{totalStars} TOTAL STARS</span>
            </div>
            <span className="font-mono-riso text-[11px] font-bold opacity-75">
              Campaign ★ {campaignStars} · Daily ★ {dailyStars}
            </span>
          </div>

          {nextLocked ? (
            <div className="flex items-center gap-2.5 sm:min-w-[210px]">
              <div className="flex-1">
                <div className="flex items-center justify-between font-mono-riso text-[10px] font-extrabold uppercase mb-1">
                  <span className="truncate pr-1">NEXT: {nextLocked.name}</span>
                  <span className="text-[var(--signal-red)] shrink-0">
                    {nextLocked.requiredStars - totalStars} ★ LEFT
                  </span>
                </div>
                <div className="h-2 rounded-full border border-[var(--charcoal-ink)] bg-[var(--newsprint)] overflow-hidden">
                  <div
                    style={{ width: `${progressPct}%` }}
                    className="h-full bg-[var(--signal-red)] transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--riso-teal)] text-[var(--on-teal)] border-2 border-[var(--charcoal-ink)] font-mono-riso text-[10px] font-extrabold uppercase">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.6} />
              <span>MASTER PRINTMAKER · ALL UNLOCKED</span>
            </div>
          )}
        </div>

        {/* 6-Palette Grid */}
        <div className="flex-1 overflow-y-auto riso-scroll p-4 sm:p-5 bg-[var(--newsprint)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {RISO_THEMES.map((theme) => {
              const unlocked = isThemeUnlocked(theme, totalStars);
              const equipped = theme.id === activeThemeId;
              const remainingStars = Math.max(0, theme.requiredStars - totalStars);
              const pct =
                theme.requiredStars > 0
                  ? Math.min(100, Math.round((totalStars / theme.requiredStars) * 100))
                  : 100;

              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    if (!unlocked) {
                      foldAudio.playBlockedThud(false);
                      return;
                    }
                    if (!equipped) {
                      foldAudio.playCardstockFold();
                      onSelectTheme(theme.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (unlocked && !equipped) {
                        foldAudio.playCardstockFold();
                        onSelectTheme(theme.id);
                      }
                    }
                  }}
                  className={`rounded-2xl border-[2.5px] p-3.5 flex flex-col gap-3 transition-transform select-none ${
                    equipped
                      ? 'border-[var(--signal-red)] bg-[var(--paper-white)] shadow-[4px_4px_0px_var(--signal-red)]'
                      : unlocked
                        ? 'border-[var(--charcoal-ink)] bg-[var(--paper-white)] shadow-[4px_4px_0px_var(--charcoal-ink)] hover:-translate-y-0.5 cursor-pointer'
                        : 'border-[var(--charcoal-ink)]/55 bg-[var(--paper-white)]/80 opacity-85 cursor-not-allowed'
                  }`}
                >
                  {/* Title & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-poster text-sm sm:text-base uppercase leading-tight truncate">
                        {theme.name}
                      </h3>
                      <p className="font-mono-riso text-[10px] font-bold opacity-70 truncate mt-0.5">
                        {theme.subtitle}
                      </p>
                    </div>

                    {equipped ? (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--signal-red)] text-[var(--on-red)] border-[1.8px] border-[var(--charcoal-ink)] font-mono-riso text-[10px] font-extrabold uppercase">
                        <Check className="w-3 h-3" strokeWidth={3} />
                        <span>ACTIVE</span>
                      </span>
                    ) : unlocked ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-[var(--newsprint)] border-[1.8px] border-[var(--charcoal-ink)] font-mono-riso text-[10px] font-extrabold uppercase">
                        APPLY
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--newsprint)] border-[1.8px] border-[var(--charcoal-ink)]/60 font-mono-riso text-[10px] font-extrabold uppercase">
                        <Lock className="w-3 h-3" strokeWidth={2.6} />
                        <span>★ {theme.requiredStars}</span>
                      </span>
                    )}
                  </div>

                  {/* Live Theme Specimen Card */}
                  <ThemeSpecimenPreview theme={theme} locked={!unlocked} />

                  {/* Bottom Unlock Progress or Status Line */}
                  {unlocked ? (
                    <div className="flex items-center justify-between font-mono-riso text-[10px] font-extrabold uppercase opacity-75">
                      <span>
                        {theme.requiredStars === 0
                          ? 'STARTER EDITION'
                          : `UNLOCKED AT ★ ${theme.requiredStars}`}
                      </span>
                      <span>{equipped ? 'EQUIPPED ON PRESS' : 'TAP TO EQUIP'}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between font-mono-riso text-[10px] font-extrabold uppercase mb-1">
                        <span className="opacity-75">
                          EARN {remainingStars} MORE ★
                        </span>
                        <span className="text-[var(--signal-red)]">
                          {totalStars}/{theme.requiredStars} ★
                        </span>
                      </div>
                      <div className="h-2 rounded-full border border-[var(--charcoal-ink)]/60 bg-[var(--newsprint)] overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-[var(--cobalt-blue)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
