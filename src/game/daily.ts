import {
  applyFold,
  createInitialBoard,
  getAllLegalFolds,
  RISO,
} from './engine';
import { solveBoard } from './solver';
import {
  CategoryDef,
  FoldDir,
  FoldOrientation,
  LevelDef,
  OneWayTape,
  PinPlacement,
  SymbolPlacement,
  SymbolType,
} from './types';

export interface DailyPuzzleBundle {
  dateKey: string; // YYYY-MM-DD
  dayOfYear: number; // 1..366
  totalDaysInYear: number; // 365 or 366
  displayDate: string; // e.g. "NOV 25"
  fullDisplayDate: string; // e.g. "Wednesday, Nov 25, 2026"
  weekdayTheme: string;
  accentColor: string;
  level: LevelDef;
  category: CategoryDef;
}

// In-memory cache so revisiting a date is instantaneous
const dailyCache = new Map<string, DailyPuzzleBundle>();

// FNV-1a 32-bit hash for stable cross-platform seeding per calendar date
function hashDateKey(dateKey: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffle<T>(rng: () => number, arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

const WEEKDAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

const ADJECTIVES = [
  'Weimar', 'Dessau', 'Offset', 'Halftone', 'Chromatic', 'Archival', 'Metric',
  'Swiss', 'Cobalt', 'Signal', 'Mustard', 'Duplex', 'Tactile', 'Linear',
  'Folded', 'Crisp', 'Prismatic', 'Pressed', 'Layered', 'Mirrored', 'Riso',
  'Geometric', 'Modular', 'Axial', 'Proofed', 'Kinetic', 'Anchored',
];

const NOUNS = [
  'Proof', 'Folio', 'Plate', 'Crease', 'Register', 'Broadsheet', 'Grid',
  'Study', 'Sheet', 'Margin', 'Spine', 'Matrix', 'Print', 'Draft',
  'Edition', 'Specimen', 'Imprint', 'Seam', 'Index', 'Square', 'Chord',
];

interface DailySpec {
  theme: string;
  accentColor: string;
  rows: number;
  cols: number;
  targetPar: number;
  pairs: number;
  tapesCount: number;
  pinsCount: number;
  duplexPairs: number;
  wildCount: number;
  hintText: string;
}

export function parseDateKeyParts(dateKey: string): {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  weekday: number; // 0..6 (Sun..Sat)
  dayOfYear: number;
  totalDaysInYear: number;
} {
  const [y, m, d] = dateKey.split('-').map(Number);
  const year = y || 2026;
  const month = m || 1;
  const day = d || 1;

  const dt = new Date(Date.UTC(year, month - 1, day));
  const startOfYear = Date.UTC(year, 0, 1);
  const nextYear = Date.UTC(year + 1, 0, 1);
  const dayOfYear = Math.floor((dt.getTime() - startOfYear) / 86400000) + 1;
  const totalDaysInYear = Math.round((nextYear - startOfYear) / 86400000);
  const weekday = dt.getUTCDay();

  return { year, month, day, weekday, dayOfYear, totalDaysInYear };
}

function getSpecForDay(weekday: number, rng: () => number): DailySpec {
  const portrait = rng() < 0.5;
  switch (weekday) {
    case 1: // Monday: Clean Foundation
      return {
        theme: 'Classic Crease',
        accentColor: RISO.blue,
        rows: portrait ? 3 : 3,
        cols: portrait ? 3 : 4,
        targetPar: 3,
        pairs: 3,
        tapesCount: 0,
        pinsCount: 0,
        duplexPairs: 0,
        wildCount: 0,
        hintText: 'DAILY EDITION · CLEAR EVERY INK PAIR IN EXACT PAR FOLDS',
      };
    case 2: // Tuesday: Layered Order
      return {
        theme: 'Layered Order',
        accentColor: RISO.red,
        rows: portrait ? 4 : 3,
        cols: portrait ? 3 : 4,
        targetPar: 3,
        pairs: 4,
        tapesCount: 0,
        pinsCount: 0,
        duplexPairs: 0,
        wildCount: 0,
        hintText: 'DAILY EDITION · SEQUENCE YOUR FOLDS SO LAYERS DO NOT TRAP PAIRS',
      };
    case 3: // Wednesday: One-Way Tape
      return {
        theme: 'One-Way Tape',
        accentColor: RISO.yellow,
        rows: 3,
        cols: portrait ? 3 : 4,
        targetPar: 3,
        pairs: 3,
        tapesCount: 2,
        pinsCount: 0,
        duplexPairs: 0,
        wildCount: 0,
        hintText: 'DAILY EDITION · FOLLOW THE HAZARD TAPE CHEVRONS TO ROUTE YOUR FOLDS',
      };
    case 4: // Thursday: Duplex Ink & Wild
      return {
        theme: 'Duplex Plate',
        accentColor: RISO.teal,
        rows: 3,
        cols: portrait ? 3 : 4,
        targetPar: 3,
        pairs: 3,
        tapesCount: 0,
        pinsCount: 0,
        duplexPairs: 1,
        wildCount: 1,
        hintText: 'DAILY EDITION · DUPLEX INK FLIPS RED ↔ BLUE WHEN FOLDED OVER',
      };
    case 5: // Friday: Brass Eyelet & Tape
      return {
        theme: 'Rivet & Chevron',
        accentColor: RISO.ink,
        rows: 3,
        cols: 4,
        targetPar: 4,
        pairs: 4,
        tapesCount: 1,
        pinsCount: 1,
        duplexPairs: 0,
        wildCount: 0,
        hintText: 'DAILY EDITION · FOLD OTHER SHEETS ONTO THE PINNED BRASS EYELET TILE',
      };
    case 6: // Saturday: Exhibition Mix
      return {
        theme: 'Exhibition Mix',
        accentColor: RISO.red,
        rows: 3,
        cols: 4,
        targetPar: 4,
        pairs: 4,
        tapesCount: 1,
        pinsCount: 0,
        duplexPairs: 1,
        wildCount: 1,
        hintText: 'DAILY EDITION · COMBINE ONE-WAY TAPE, DUPLEX FLIPS & WILD PRISMS',
      };
    default: // Sunday: Studio Masterpiece
      return {
        theme: 'Studio Masterpiece',
        accentColor: RISO.ink,
        rows: 4,
        cols: 4,
        targetPar: 4,
        pairs: 4,
        tapesCount: 1,
        pinsCount: 1,
        duplexPairs: 1,
        wildCount: 1,
        hintText: 'SUNDAY MASTERPIECE · ALL BAUHAUS MECHANICS IN ONE ARCHIVAL SHEET',
      };
  }
}

function buildDailyCandidate(
  rng: () => number,
  spec: DailySpec,
  dateKey: string,
  dayOfYear: number,
  title: string
): LevelDef | null {
  const { rows, cols, pairs, tapesCount, pinsCount, duplexPairs, wildCount } = spec;
  const allCoords: { r: number; c: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      allCoords.push({ r, c });
    }
  }

  const chosenCoords = shuffle(rng, allCoords).slice(0, pairs * 2);
  const symbolPool: SymbolType[] = [];

  for (let i = 0; i < duplexPairs; i++) {
    const mode = randInt(rng, 0, 2);
    if (mode === 0) symbolPool.push('duplex_rb', 'cross');
    else if (mode === 1) symbolPool.push('duplex_br', 'circle');
    else symbolPool.push('duplex_rb', 'duplex_br');
  }

  const standardTypes: SymbolType[] = ['circle', 'cross', 'triangle', 'square'];
  let remainingPairs = pairs - duplexPairs;
  let wildsLeft = wildCount;
  while (wildsLeft > 0 && remainingPairs > 0) {
    const partner = pick(rng, standardTypes);
    symbolPool.push('wild', partner);
    wildsLeft--;
    remainingPairs--;
  }

  const shuffledStd = shuffle(rng, standardTypes);
  for (let i = 0; i < remainingPairs; i++) {
    const t = shuffledStd[i % shuffledStd.length];
    symbolPool.push(t, t);
  }

  const symbols: SymbolPlacement[] = chosenCoords.map((pos, idx) => ({
    r: pos.r,
    c: pos.c,
    type: symbolPool[idx],
  }));

  const tapes: OneWayTape[] = [];
  if (tapesCount > 0) {
    const creases: { orientation: FoldOrientation; index: number }[] = [];
    for (let c = 1; c < cols; c++) creases.push({ orientation: 'v', index: c });
    for (let r = 1; r < rows; r++) creases.push({ orientation: 'h', index: r });
    for (const cr of shuffle(rng, creases).slice(0, tapesCount)) {
      const allowDir: FoldDir =
        cr.orientation === 'v' ? pick(rng, ['left', 'right']) : pick(rng, ['up', 'down']);
      tapes.push({ orientation: cr.orientation, index: cr.index, allowDir });
    }
  }

  const pins: PinPlacement[] = [];
  if (pinsCount > 0) {
    for (const pc of shuffle(rng, allCoords).slice(0, pinsCount)) {
      pins.push({ r: pc.r, c: pc.c });
    }
  }

  const level: LevelDef = {
    id: `daily-${dateKey}`,
    categoryId: 'daily',
    indexInCategory: dayOfYear - 1,
    code: `#${String(dayOfYear).padStart(3, '0')}`,
    title,
    rows,
    cols,
    par: spec.targetPar,
    symbols,
    tapes,
    pins,
    hintText: spec.hintText,
  };

  const board = createInitialBoard(level);
  const solved = solveBoard(board, spec.targetPar, 6500);
  if (!solved.solvable || solved.minMoves !== spec.targetPar) {
    return null;
  }

  // Ensure duplex days genuinely involve a duplex flip when possible
  if (duplexPairs > 0) {
    let cur = board;
    let didFlip = false;
    for (const step of solved.solution) {
      const fr = applyFold(cur, step);
      if (fr.duplexFlipped) didFlip = true;
      cur = fr.nextState;
    }
    if (!didFlip) return null;
  }

  // Ensure pin days actually restrict at least 2 possible folds
  if (pinsCount > 0) {
    const noPin = createInitialBoard({ ...level, pins: [] });
    if (getAllLegalFolds(noPin).length - getAllLegalFolds(board).length < 2) {
      return null;
    }
  }

  return level;
}

export function getDailyPuzzle(dateKey: string): DailyPuzzleBundle {
  const cached = dailyCache.get(dateKey);
  if (cached) return cached;

  const { year, month, day, weekday, dayOfYear, totalDaysInYear } =
    parseDateKeyParts(dateKey);
  const seed = hashDateKey(`FOLD-FOLD-DAILY::${dateKey}`);
  const rng = createRng(seed);

  const spec = getSpecForDay(weekday, rng);
  const adj = ADJECTIVES[(dayOfYear * 7 + year) % ADJECTIVES.length];
  const noun = NOUNS[(dayOfYear * 13 + month * 5) % NOUNS.length];
  const title = `${adj} ${noun}`;

  let level: LevelDef | null = null;

  // Primary search with full themed constraints
  for (let attempt = 0; attempt < 180; attempt++) {
    level = buildDailyCandidate(rng, spec, dateKey, dayOfYear, title);
    if (level) break;
  }

  // Fallback with slightly relaxed targetPar (targetPar - 1) if a tight seed needed fewer moves
  if (!level) {
    const relaxedSpec: DailySpec = {
      ...spec,
      targetPar: Math.max(2, spec.targetPar - 1),
      tapesCount: Math.min(1, spec.tapesCount),
      pinsCount: 0,
      duplexPairs: 0,
    };
    for (let attempt = 0; attempt < 180; attempt++) {
      level = buildDailyCandidate(rng, relaxedSpec, dateKey, dayOfYear, title);
      if (level) break;
    }
  }

  // Ultimate deterministic guaranteed fallback (never fails)
  if (!level) {
    level = {
      id: `daily-${dateKey}`,
      categoryId: 'daily',
      indexInCategory: dayOfYear - 1,
      code: `#${String(dayOfYear).padStart(3, '0')}`,
      title,
      rows: 2,
      cols: 3,
      par: 2,
      symbols: [
        { r: 0, c: 1, type: 'circle' },
        { r: 0, c: 2, type: 'circle' },
        { r: 1, c: 0, type: 'cross' },
        { r: 1, c: 2, type: 'cross' },
      ],
      tapes: [],
      pins: [],
      hintText: spec.hintText,
    };
  }

  const displayDate = `${MONTH_SHORT[month - 1]} ${String(day).padStart(2, '0')}`;
  const fullDisplayDate = `${WEEKDAY_NAMES[weekday]}, ${MONTH_SHORT[month - 1]} ${day}, ${year}`;

  const cardText = spec.accentColor === RISO.yellow ? RISO.ink : RISO.paperWhite;

  const category: CategoryDef = {
    id: 'daily',
    code: 'DAY',
    title: 'DAILY EDITION',
    subtitle: spec.theme,
    cardColor: spec.accentColor,
    cardText,
    undersideColor: spec.accentColor === RISO.ink ? RISO.blue : spec.accentColor,
    previewSymbols: level.symbols.slice(0, 4).map((s) => s.type),
    mechanicNote: spec.hintText,
    levels: [level],
  };

  const bundle: DailyPuzzleBundle = {
    dateKey,
    dayOfYear,
    totalDaysInYear,
    displayDate,
    fullDisplayDate,
    weekdayTheme: spec.theme,
    accentColor: spec.accentColor,
    level,
    category,
  };

  dailyCache.set(dateKey, bundle);
  return bundle;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + deltaDays));
  const ny = dt.getUTCFullYear();
  const nm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const nd = String(dt.getUTCDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}
