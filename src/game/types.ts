export type SymbolType =
  | 'circle'
  | 'cross'
  | 'triangle'
  | 'square'
  | 'wild'
  | 'duplex_rb'
  | 'duplex_br'
  | 'carbon_circle'
  | 'carbon_cross'
  | 'carbon_triangle'
  | 'carbon_square';

export type LockKeySymbol = 'circle' | 'cross' | 'triangle' | 'square';

export type FoldOrientation = 'v' | 'h';
export type FoldDir = 'left' | 'right' | 'up' | 'down';

export interface OneWayTape {
  orientation: FoldOrientation;
  index: number;
  allowDir: FoldDir;
}

export interface PerforatedCrease {
  orientation: FoldOrientation;
  index: number;
}

export interface LockedCrease {
  orientation: FoldOrientation;
  index: number;
  keySymbol: LockKeySymbol;
}

export interface SymbolPlacement {
  r: number;
  c: number;
  type: SymbolType;
}

export interface PinPlacement {
  r: number;
  c: number;
}

export interface LevelDef {
  id: string; // e.g. 'c1-01'
  categoryId: string;
  indexInCategory: number; // 0..19
  code: string; // '01'..'20'
  title: string;
  rows: number;
  cols: number;
  par: number;
  symbols: SymbolPlacement[];
  tapes: OneWayTape[];
  pins: PinPlacement[];
  perforations?: PerforatedCrease[];
  locks?: LockedCrease[];
  hintText: string;
}

export interface CategoryDef {
  id: string;
  code: string; // '01'..'06'
  title: string;
  subtitle: string;
  cardColor: string;
  cardText: string;
  undersideColor: string;
  previewSymbols: SymbolType[];
  mechanicNote: string;
  levels: LevelDef[];
}

export interface CellState {
  stack: (SymbolType | null)[];
  pinned: boolean;
}

export interface BoardState {
  rows: number;
  cols: number;
  grid: CellState[][];
  tapes: OneWayTape[];
  perforations: PerforatedCrease[];
  locks: LockedCrease[];
}

export interface FoldAction {
  orientation: FoldOrientation;
  index: number;
  dir: FoldDir;
}

export interface MatchLocation {
  r: number;
  c: number;
  color: string;
  wasDuplexFlip: boolean;
}

export interface CarbonStampLocation {
  r: number;
  c: number;
  color: string;
}

export interface FoldResult {
  nextState: BoardState;
  matchedLocations: MatchLocation[];
  carbonStampedLocations: CarbonStampLocation[];
  duplexFlipped: boolean;
  tornOff: boolean;
  unlockedLocksCount: number;
}

export type BlockReason = 'tape' | 'pin' | 'lock' | null;

export type ScreenMode = 'SPLASH' | 'TITLE' | 'LEVEL_SELECT' | 'DAILY' | 'PLAYING';

export interface LevelProgress {
  bestStars: number; // 0..3
  bestMoves: number | null;
}

export type ProgressMap = Record<string, LevelProgress>;

export interface DailyEntry {
  dateKey: string; // YYYY-MM-DD
  bestStars: number; // 1..3
  bestMoves: number;
  par: number;
  completedAt: string;
}

export interface DailyProgressState {
  entries: Record<string, DailyEntry>;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}
