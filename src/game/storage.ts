import { DailyProgressState, ProgressMap } from './types';

const PROGRESS_KEY = 'fold_fold_progress_v1';
const DAILY_PROGRESS_KEY = 'fold_fold_daily_v1';
const SETTINGS_KEY = 'fold_fold_settings_v1';

export interface AudioSettings {
  sfx: boolean;
  music: boolean;
}

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors in private contexts
  }
}

function emptyDailyProgress(): DailyProgressState {
  return {
    entries: {},
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  };
}

function parseDateKeyUTC(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1);
}

function formatDateKeyUTC(utcMs: number): string {
  const dt = new Date(utcMs);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeDailyStreaks(
  entries: Record<string, { bestStars: number }>,
  todayKey: string
): { currentStreak: number; longestStreak: number } {
  const solvedKeys = Object.keys(entries)
    .filter((k) => (entries[k]?.bestStars ?? 0) > 0)
    .sort();

  if (solvedKeys.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const DAY_MS = 86400000;
  let longest = 1;
  let run = 1;
  for (let i = 1; i < solvedKeys.length; i++) {
    const prevMs = parseDateKeyUTC(solvedKeys[i - 1]);
    const currMs = parseDateKeyUTC(solvedKeys[i]);
    if (currMs - prevMs === DAY_MS) {
      run++;
      if (run > longest) longest = run;
    } else if (currMs !== prevMs) {
      run = 1;
    }
  }

  // Current streak counts backwards from today (or yesterday if today not yet played)
  const solvedSet = new Set(solvedKeys);
  const todayMs = parseDateKeyUTC(todayKey);
  const yesterdayKey = formatDateKeyUTC(todayMs - DAY_MS);

  let cursorMs = solvedSet.has(todayKey)
    ? todayMs
    : solvedSet.has(yesterdayKey)
      ? todayMs - DAY_MS
      : -1;

  let current = 0;
  while (cursorMs !== -1 && solvedSet.has(formatDateKeyUTC(cursorMs))) {
    current++;
    cursorMs -= DAY_MS;
  }

  return { currentStreak: current, longestStreak: Math.max(longest, current) };
}

export function loadDailyProgress(todayKey?: string): DailyProgressState {
  try {
    const raw = localStorage.getItem(DAILY_PROGRESS_KEY);
    if (!raw) return emptyDailyProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || typeof parsed.entries !== 'object') {
      return emptyDailyProgress();
    }
    const entries = parsed.entries ?? {};
    const refToday = todayKey ?? getLocalTodayDateKey();
    const { currentStreak, longestStreak } = computeDailyStreaks(entries, refToday);
    return {
      entries,
      currentStreak,
      longestStreak: Math.max(longestStreak, Number(parsed.longestStreak) || 0),
      lastCompletedDate:
        typeof parsed.lastCompletedDate === 'string' ? parsed.lastCompletedDate : null,
    };
  } catch {
    return emptyDailyProgress();
  }
}

export function saveDailyProgress(state: DailyProgressState) {
  try {
    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function recordDailyCompletion(
  prev: DailyProgressState,
  dateKey: string,
  movesUsed: number,
  stars: number,
  par: number,
  todayKey: string
): DailyProgressState {
  const existing = prev.entries[dateKey];
  const bestStars = Math.max(existing?.bestStars ?? 0, stars);
  const bestMoves =
    existing?.bestMoves != null ? Math.min(existing.bestMoves, movesUsed) : movesUsed;

  const entries = {
    ...prev.entries,
    [dateKey]: {
      dateKey,
      bestStars,
      bestMoves,
      par,
      completedAt: new Date().toISOString(),
    },
  };

  const { currentStreak, longestStreak } = computeDailyStreaks(entries, todayKey);
  const next: DailyProgressState = {
    entries,
    currentStreak,
    longestStreak: Math.max(prev.longestStreak, longestStreak),
    lastCompletedDate: dateKey,
  };
  saveDailyProgress(next);
  return next;
}

export function getLocalTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { sfx: true, music: true };
    const parsed = JSON.parse(raw);
    return {
      sfx: typeof parsed.sfx === 'boolean' ? parsed.sfx : true,
      music: typeof parsed.music === 'boolean' ? parsed.music : true,
    };
  } catch {
    return { sfx: true, music: true };
  }
}

const THEME_KEY = 'fold_fold_theme_v1';
const SEEN_THEMES_KEY = 'fold_fold_seen_themes_v1';

export function loadSelectedThemeId(): string {
  try {
    return localStorage.getItem(THEME_KEY) || 'bauhaus';
  } catch {
    return 'bauhaus';
  }
}

export function saveSelectedThemeId(themeId: string) {
  try {
    localStorage.setItem(THEME_KEY, themeId);
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSeenUnlockedThemes(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_THEMES_KEY);
    if (!raw) return ['bauhaus'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : ['bauhaus'];
  } catch {
    return ['bauhaus'];
  }
}

export function saveSeenUnlockedThemes(ids: string[]) {
  try {
    localStorage.setItem(SEEN_THEMES_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota errors
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}
