import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Music,
  Palette,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DailyShareCardModal } from './DailyShareCardModal';
import { foldAudio } from '../game/audio';
import { getDailyPuzzle, parseDateKeyParts } from '../game/daily';
import { getSymbolColor } from '../game/engine';
import { DailySharePayload } from '../game/shareCard';
import { RisoPalette, RisoTheme } from '../game/themes';
import { DailyProgressState, LevelDef } from '../game/types';

interface DailyHubProps {
  todayDateKey: string;
  dailyProgress: DailyProgressState;
  onPlayDailyDate: (dateKey: string) => void;
  onBackToLobby: () => void;
  activeTheme: RisoTheme;
  hasNewThemeUnlock: boolean;
  onOpenThemes: () => void;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  onToggleSfx: () => void;
  onToggleMusic: () => void;
  onOpenGuide: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_HEADERS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MiniDailyPreview: React.FC<{ level: LevelDef; palette: RisoPalette }> = ({
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
      className="grid gap-1.5 p-2 bg-[var(--newsprint)] border-2 border-[var(--charcoal-ink)] rounded-lg shadow-[3px_3px_0px_var(--charcoal-ink)]"
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
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-[3px] bg-[var(--paper-white)] border border-[var(--charcoal-ink)]/45 flex items-center justify-center relative"
          >
            {color && (
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
            {isPinned && (
              <span className="absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full bg-[var(--mustard-yellow)] border border-[var(--charcoal-ink)]" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const DailyHub: React.FC<DailyHubProps> = ({
  todayDateKey,
  dailyProgress,
  onPlayDailyDate,
  onBackToLobby,
  activeTheme,
  hasNewThemeUnlock,
  onOpenThemes,
  sfxEnabled,
  musicEnabled,
  onToggleSfx,
  onToggleMusic,
  onOpenGuide,
}) => {
  const todayParts = useMemo(() => parseDateKeyParts(todayDateKey), [todayDateKey]);
  const [viewYear, setViewYear] = useState(todayParts.year);
  const [viewMonth, setViewMonth] = useState(todayParts.month); // 1..12
  const [sharePayload, setSharePayload] = useState<DailySharePayload | null>(null);

  const todayBundle = useMemo(() => getDailyPuzzle(todayDateKey), [todayDateKey]);
  const todayEntry = dailyProgress.entries[todayDateKey];

  const totalDailyCleared = Object.values(dailyProgress.entries).filter(
    (e) => e.bestStars > 0
  ).length;
  const totalDailyStars = Object.values(dailyProgress.entries).reduce(
    (sum, e) => sum + (e.bestStars || 0),
    0
  );

  // Build calendar cells for viewYear / viewMonth
  const calendarCells = useMemo(() => {
    const firstDayUtc = new Date(Date.UTC(viewYear, viewMonth - 1, 1));
    const startWeekday = firstDayUtc.getUTCDay();
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();

    const cells: ({ day: number; dateKey: string; isFuture: boolean; isToday: boolean } | null)[] = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        dateKey: key,
        isFuture: key > todayDateKey,
        isToday: key === todayDateKey,
      });
    }
    return cells;
  }, [viewYear, viewMonth, todayDateKey]);

  const canGoNextMonth =
    viewYear < todayParts.year ||
    (viewYear === todayParts.year && viewMonth < todayParts.month);

  const canGoPrevMonth =
    viewYear > todayParts.year ||
    (viewYear === todayParts.year && viewMonth > 1);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    foldAudio.playClick(520);
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNextMonth) return;
    foldAudio.playClick(580);
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col riso-grain-bg overflow-hidden">
      {/* Top Bar */}
      <header className="px-3.5 py-3 sm:px-7 sm:py-4 border-b-[2.5px] border-[var(--charcoal-ink)] bg-[var(--paper-white)] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
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

          <div className="hidden sm:flex items-center gap-2 font-mono-riso text-xs font-extrabold text-[var(--charcoal-ink)] whitespace-nowrap">
            <Calendar className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
            <span>DAILY EDITION ARCHIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pr-0.5">
          <button
            onClick={() => {
              foldAudio.playClick(590);
              onOpenThemes();
            }}
            title={`Paper & Ink Themes (${activeTheme.name})`}
            aria-label="Paper and Ink Themes"
            className="riso-btn relative h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Palette className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
            <span className="hidden sm:inline">Inks</span>
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
            className="riso-btn h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 font-mono-riso text-xs font-extrabold uppercase whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" strokeWidth={2.4} />
            <span className="hidden sm:inline">Guide</span>
          </button>
          <button
            onClick={onToggleMusic}
            aria-label={musicEnabled ? 'Mute Music' : 'Play Music'}
            className={`riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer ${
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
            className="riso-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
          >
            {sfxEnabled ? (
              <Volume2 className="w-4 h-4 text-[var(--charcoal-ink)]" strokeWidth={2.5} />
            ) : (
              <VolumeX className="w-4 h-4 text-[var(--signal-red)]" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </header>

      {/* Scrollable Daily Content */}
      <main className="flex-1 overflow-y-auto riso-scroll px-4 py-5 sm:px-8 sm:py-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
          {/* Today's Featured Daily Sheet Banner */}
          <section className="riso-card rounded-2xl overflow-hidden">
            <div
              style={{
                backgroundColor: todayBundle.accentColor,
                color: todayBundle.category.cardText,
              }}
              className="px-5 py-3.5 sm:px-6 border-b-[2.5px] border-[var(--charcoal-ink)] flex flex-wrap items-center justify-between gap-2"
            >
              <div className="font-mono-riso text-xs font-extrabold uppercase tracking-wider">
                TODAY · EDITION #{String(todayBundle.dayOfYear).padStart(3, '0')}/
                {todayBundle.totalDaysInYear} · {todayBundle.weekdayTheme}
              </div>
              <div className="font-mono-riso text-xs font-extrabold uppercase">
                {todayBundle.fullDisplayDate}
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-[var(--paper-white)]">
              <div className="flex items-center gap-4 sm:gap-5">
                <MiniDailyPreview
                  level={todayBundle.level}
                  palette={activeTheme.palette}
                />

                <div>
                  <h1 className="font-poster text-2xl sm:text-3xl uppercase text-[var(--charcoal-ink)] leading-tight">
                    {todayBundle.level.title}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono-riso text-xs font-bold text-[var(--charcoal-ink)]/75">
                    <span>
                      {todayBundle.level.rows}×{todayBundle.level.cols} SHEET
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[var(--signal-red)]">
                      PAR {todayBundle.level.par}
                    </span>
                    {todayEntry && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[var(--cobalt-blue)]">
                          BEST {todayEntry.bestMoves} MOVES
                        </span>
                      </>
                    )}
                  </div>

                  {/* Today's Star Stamp */}
                  <div className="mt-2 flex items-center gap-1 text-lg leading-none">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={
                          i < (todayEntry?.bestStars ?? 0)
                            ? 'text-[var(--signal-red)]'
                            : 'text-[var(--charcoal-ink)]/20'
                        }
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-1.5 font-mono-riso text-[11px] font-bold text-[var(--charcoal-ink)]/65">
                      {todayEntry ? 'CLEARED TODAY' : 'UNSOLVED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                {todayEntry && (
                  <button
                    onClick={() => {
                      foldAudio.playCardstockFold();
                      setSharePayload({
                        dateKey: todayBundle.dateKey,
                        displayDate: todayBundle.displayDate,
                        fullDisplayDate: todayBundle.fullDisplayDate,
                        dayOfYear: todayBundle.dayOfYear,
                        totalDaysInYear: todayBundle.totalDaysInYear,
                        title: todayBundle.level.title,
                        weekdayTheme: todayBundle.weekdayTheme,
                        accentColor: todayBundle.accentColor,
                        cardText: todayBundle.category.cardText,
                        rows: todayBundle.level.rows,
                        cols: todayBundle.level.cols,
                        moves: todayEntry.bestMoves,
                        par: todayBundle.level.par,
                        stars: todayEntry.bestStars,
                        currentStreak: dailyProgress.currentStreak,
                        longestStreak: dailyProgress.longestStreak,
                      });
                    }}
                    className="riso-btn px-4 py-3.5 rounded-xl bg-[var(--signal-red)] text-[var(--on-red)] font-poster text-sm uppercase tracking-wide flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" strokeWidth={2.6} />
                    <span>SHARE CARD</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    foldAudio.unlock();
                    foldAudio.playCardstockFold();
                    onPlayDailyDate(todayDateKey);
                  }}
                  className="riso-btn px-6 py-3.5 rounded-xl bg-[var(--cobalt-blue)] text-[var(--on-blue)] font-poster text-sm sm:text-base uppercase tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {todayEntry ? 'REPLAY TODAY >>>' : 'PLAY TODAY >>>'}
                </button>
              </div>
            </div>

            {/* Separate Daily Stats Strip */}
            <div className="px-5 py-3 sm:px-6 bg-[var(--newsprint)] border-t-2 border-[var(--charcoal-ink)] grid grid-cols-4 gap-2 text-center font-mono-riso">
              <div>
                <div className="text-[10px] font-bold uppercase text-[var(--charcoal-ink)]/60">
                  Streak
                </div>
                <div className="font-poster text-base sm:text-lg text-[var(--signal-red)] tabular-nums">
                  {dailyProgress.currentStreak}d
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-[var(--charcoal-ink)]/60">
                  Best
                </div>
                <div className="font-poster text-base sm:text-lg text-[var(--cobalt-blue)] tabular-nums">
                  {dailyProgress.longestStreak}d
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-[var(--charcoal-ink)]/60">
                  Cleared
                </div>
                <div className="font-poster text-base sm:text-lg text-[var(--charcoal-ink)] tabular-nums">
                  {totalDailyCleared}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-[var(--charcoal-ink)]/60">
                  Stars
                </div>
                <div className="font-poster text-base sm:text-lg text-[var(--signal-red)] tabular-nums">
                  ★ {totalDailyStars}
                </div>
              </div>
            </div>
          </section>

          {/* Monthly Archival Calendar */}
          <section className="riso-card rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <div className="font-mono-riso text-[10px] font-extrabold uppercase tracking-wider text-[var(--charcoal-ink)]/60">
                  {viewYear} PRESS ARCHIVE
                </div>
                <h2 className="font-poster text-xl uppercase text-[var(--charcoal-ink)]">
                  {MONTH_NAMES[viewMonth - 1]} {viewYear}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  disabled={!canGoPrevMonth}
                  aria-label="Previous Month"
                  className="riso-btn w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2.6} />
                </button>
                <button
                  onClick={handleNextMonth}
                  disabled={!canGoNextMonth}
                  aria-label="Next Month"
                  className="riso-btn w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={2.6} />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center font-mono-riso text-[10px] font-extrabold text-[var(--charcoal-ink)]/60">
              {WEEKDAY_HEADERS.map((wd) => (
                <div key={wd}>{wd}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="h-12 sm:h-14" />;
                }

                const entry = dailyProgress.entries[cell.dateKey];
                const stars = entry?.bestStars ?? 0;

                if (cell.isFuture) {
                  return (
                    <div
                      key={cell.dateKey}
                      className="h-12 sm:h-14 rounded-lg border border-dashed border-[var(--charcoal-ink)]/20 bg-[var(--newsprint)]/55 flex flex-col items-center justify-center font-mono-riso text-xs font-bold text-[var(--charcoal-ink)]/30 select-none"
                    >
                      <span>{cell.day}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={cell.dateKey}
                    onClick={() => {
                      foldAudio.unlock();
                      foldAudio.playCardstockFold();
                      onPlayDailyDate(cell.dateKey);
                    }}
                    className={`h-12 sm:h-14 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 transition-transform cursor-pointer ${
                      cell.isToday
                        ? 'border-[var(--signal-red)] bg-[var(--paper-white)] shadow-[2px_2px_0px_var(--signal-red)] -translate-y-0.5'
                        : stars > 0
                          ? 'border-[var(--charcoal-ink)] bg-[var(--newsprint)] hover:-translate-y-0.5'
                          : 'border-[var(--charcoal-ink)]/45 bg-[var(--paper-white)] hover:border-[var(--charcoal-ink)] hover:-translate-y-0.5'
                    }`}
                  >
                    <span
                      className={`font-mono-riso text-xs sm:text-sm font-extrabold leading-none ${
                        cell.isToday
                          ? 'text-[var(--signal-red)]'
                          : 'text-[var(--charcoal-ink)]'
                      }`}
                    >
                      {cell.day}
                    </span>
                    <div className="flex items-center gap-[1px] text-[9px] sm:text-[10px] leading-none">
                      {[0, 1, 2].map((s) => (
                        <span
                          key={s}
                          className={
                            s < stars
                              ? 'text-[var(--signal-red)]'
                              : 'text-[var(--charcoal-ink)]/15'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <DailyShareCardModal
        payload={sharePayload}
        onClose={() => setSharePayload(null)}
      />
    </div>
  );
};
