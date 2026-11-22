import {
  BlockReason,
  BoardState,
  CellState,
  FoldAction,
  FoldDir,
  FoldOrientation,
  FoldResult,
  LevelDef,
  MatchLocation,
  OneWayTape,
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

export function getSymbolColor(sym: SymbolType): string {
  switch (sym) {
    case 'circle':
    case 'duplex_rb':
      return RISO.red;
    case 'cross':
    case 'duplex_br':
      return RISO.blue;
    case 'triangle':
      return RISO.yellow;
    case 'square':
      return RISO.ink;
    case 'wild':
      return RISO.teal;
  }
}

export function getEffectiveInk(sym: SymbolType): string {
  switch (sym) {
    case 'circle':
    case 'duplex_rb':
      return 'red';
    case 'cross':
    case 'duplex_br':
      return 'blue';
    case 'triangle':
      return 'yellow';
    case 'square':
      return 'charcoal';
    case 'wild':
      return 'wild';
  }
}

export function flipSymbolOnFold(sym: SymbolType | null): { next: SymbolType | null; flipped: boolean } {
  if (sym === 'duplex_rb') return { next: 'duplex_br', flipped: true };
  if (sym === 'duplex_br') return { next: 'duplex_rb', flipped: true };
  return { next: sym, flipped: false };
}

export function symbolsMatch(a: SymbolType, b: SymbolType): boolean {
  if (a === 'wild' || b === 'wild') return true;
  return getEffectiveInk(a) === getEffectiveInk(b);
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

  return {
    rows: level.rows,
    cols: level.cols,
    grid,
    tapes: level.tapes.map((t) => ({ ...t })),
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
  // 1. Check One-Way Hazard Tape on this crease
  const tape = state.tapes.find(
    (t) => t.orientation === orientation && t.index === index
  );
  if (tape && tape.allowDir !== dir) {
    return 'tape';
  }

  // 2. Check Brass Eyelet Pins on the moving flap (cannot lift a pinned sheet)
  for (let r = 0; r < state.rows; r++) {
    for (let c = 0; c < state.cols; c++) {
      if (state.grid[r][c].pinned && isCellInMovingFlap(r, c, orientation, index, dir)) {
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
        wasDuplexFlip: anyDuplexFlipped,
      };
    }
  }

  return {
    stack: [...bCopy, ...mCopy],
    matched: false,
    matchedColor: null,
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

export function applyFold(state: BoardState, action: FoldAction): FoldResult {
  const { orientation, index, dir } = action;
  const matchedLocations: MatchLocation[] = [];
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
        }
      }
    }

    // Transform tapes cleanly (stationary tapes take priority if mirrored tape overlaps)
    const nextTapes: OneWayTape[] = [];
    const seenV = new Set<number>();

    for (const t of state.tapes) {
      if (t.orientation === 'h') {
        nextTapes.push({ ...t });
      } else if (t.index !== index) {
        const isStationary = dir === 'right' ? t.index > index : t.index < index;
        if (isStationary) {
          const mappedIdx = dir === 'right' ? t.index - index : t.index + shift;
          if (mappedIdx > 0 && mappedIdx < newCols && !seenV.has(mappedIdx)) {
            seenV.add(mappedIdx);
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
          if (mappedIdx > 0 && mappedIdx < newCols && !seenV.has(mappedIdx)) {
            seenV.add(mappedIdx);
            nextTapes.push({
              orientation: 'v',
              index: mappedIdx,
              allowDir: flipDir(t.allowDir),
            });
          }
        }
      }
    }

    return {
      nextState: { rows: state.rows, cols: newCols, grid: newGrid, tapes: nextTapes },
      matchedLocations,
      duplexFlipped,
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
        }
      }
    }

    const nextTapes: OneWayTape[] = [];
    const seenH = new Set<number>();

    for (const t of state.tapes) {
      if (t.orientation === 'v') {
        nextTapes.push({ ...t });
      } else if (t.index !== index) {
        const isStationary = dir === 'down' ? t.index > index : t.index < index;
        if (isStationary) {
          const mappedIdx = dir === 'down' ? t.index - index : t.index + shift;
          if (mappedIdx > 0 && mappedIdx < newRows && !seenH.has(mappedIdx)) {
            seenH.add(mappedIdx);
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
          if (mappedIdx > 0 && mappedIdx < newRows && !seenH.has(mappedIdx)) {
            seenH.add(mappedIdx);
            nextTapes.push({
              orientation: 'h',
              index: mappedIdx,
              allowDir: flipDir(t.allowDir),
            });
          }
        }
      }
    }

    return {
      nextState: { rows: newRows, cols: state.cols, grid: newGrid, tapes: nextTapes },
      matchedLocations,
      duplexFlipped,
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
  return parts.join('|');
}
