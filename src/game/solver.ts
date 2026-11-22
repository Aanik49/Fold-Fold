import {
  applyFold,
  countRemainingSymbols,
  getAllLegalFolds,
  serializeBoard,
} from './engine';
import { BoardState, FoldAction } from './types';

export interface SolveResult {
  solvable: boolean;
  minMoves: number;
  solution: FoldAction[];
}

/**
 * Exact Breadth-First Search optimal solver.
 * Used both to verify all 100 levels at exact optimal Par and to power the in-game Hint system.
 */
export function solveBoard(
  initialState: BoardState,
  maxDepth = 7,
  maxNodes = 45000
): SolveResult {
  if (countRemainingSymbols(initialState) === 0) {
    return { solvable: true, minMoves: 0, solution: [] };
  }

  // Fast parity check: total symbols must be even since every match cancels exactly 2 symbols.
  const startCount = countRemainingSymbols(initialState);
  if (startCount % 2 !== 0) {
    return { solvable: false, minMoves: -1, solution: [] };
  }

  interface QueueNode {
    state: BoardState;
    path: FoldAction[];
  }

  const visited = new Set<string>();
  visited.add(serializeBoard(initialState));

  const queue: QueueNode[] = [{ state: initialState, path: [] }];
  let head = 0;

  while (head < queue.length && visited.size < maxNodes) {
    const { state, path } = queue[head++];
    if (path.length >= maxDepth) continue;

    // Early prune: if 1x1 grid still has remaining symbols, no folds possible
    if (state.rows === 1 && state.cols === 1) continue;

    const actions = getAllLegalFolds(state);
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const { nextState } = applyFold(state, action);
      const rem = countRemainingSymbols(nextState);
      const nextPath = [...path, action];

      if (rem === 0) {
        return { solvable: true, minMoves: nextPath.length, solution: nextPath };
      }

      // Prune dead states where board is reduced to 1x1 with symbols left
      if (nextState.rows === 1 && nextState.cols === 1) continue;

      if (nextPath.length < maxDepth) {
        const key = serializeBoard(nextState);
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ state: nextState, path: nextPath });
        }
      }
    }
  }

  return { solvable: false, minMoves: -1, solution: [] };
}
