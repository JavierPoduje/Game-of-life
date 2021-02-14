import { reduce } from 'ramda';

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
  const generateCellValue = (): GridValue =>
    Math.random() > RANDOM_PORCENTAGE_INITIALLY_ALIVE ? 1 : 0;
  const generateColumns = (): GridValue[] =>
    Array.from(new Array(COLS), generateCellValue);

  return Array.from(new Array(ROWS), generateColumns);
};

export const simulateNextGrid = (gridCopy: Grid) => (
  initialGrid: Grid
): Grid => {
  const killOrStayDead = (neighbors: number): boolean =>
    neighbors < 2 || neighbors > 3;

  const reviveOrStayAlive = (
    grid: Grid,
    i: number,
    j: number,
    neighbors: number
  ) => grid[i][j] === 0 && neighbors === 3;

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
  const cellDoesntOverflowGrid = (newI: number, newJ: number): boolean =>
    newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS;

  const reducer = (acc: number, [x, y]: number[]): number => {
    const newI = i + x;
    const newJ = j + y;

    return cellDoesntOverflowGrid(newI, newJ) ? acc + grid[newI][newJ] : acc;
  };

  return reduce(reducer, 0, OPERATIONS);
};
