import {
  ROWS,
  COLS,
  RANDOM_PORCENTAGE_INITIALLY_ALIVE,
  OPERATIONS
} from './constants';
import { Grid, GridValue } from './types';

export const generateEmptyGrid = (): Grid => {
  const cols: GridValue[] = Array.from(new Array(COLS), () => 0);
  const rows: GridValue[][] = Array.from(new Array(ROWS), () => cols);
  return rows;
};

export const generateRandomGrid = (): Grid => {
  const cols: GridValue[] = Array.from(new Array(COLS), () => {
    return Math.random() > RANDOM_PORCENTAGE_INITIALLY_ALIVE ? 1 : 0;
  });
  const rows: GridValue[][] = Array.from(new Array(ROWS), () => cols);
  return rows;
};

export const simulateNextGrid = (gridCopy: Grid) => (
  initialGrid: Grid
): Grid => {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const neighbors = getNeighbors(initialGrid, i, j);

      if (killOrStayDead(neighbors)) {
        gridCopy[i][j] = 0;
      } else if (reviveOrStayAlive(initialGrid, i, j, neighbors)) {
        gridCopy[i][j] = 1;
      }
    }
  }

  return gridCopy;
};

const getNeighbors = (grid: Grid, i: number, j: number): number => {
  let neighbors = 0;

  OPERATIONS.forEach(([x, y]) => {
    const newI = i + x;
    const newJ = j + y;

    if (cellDoesntOverflowGrid(newI, newJ)) neighbors += grid[newI][newJ];
  });

  return neighbors;
};

const killOrStayDead = (neighbors: number): boolean =>
  neighbors < 2 || neighbors > 3;

const reviveOrStayAlive = (
  grid: Grid,
  i: number,
  j: number,
  neighbors: number
) => grid[i][j] === 0 && neighbors === 3;

const cellDoesntOverflowGrid = (newI: number, newJ: number): boolean =>
  newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS;
