import React, { useState, useCallback, useRef } from 'react';

import produce from 'immer';

import { COLS } from './constants';
import { Grid } from './types';
import {
  generateEmptyGrid,
  generateRandomGrid,
  simulateNextGrid
} from './grid';

import './App.css';

function App() {
  const [grid, setGrid] = useState(generateEmptyGrid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    const getNextGridSimulation = (gridCopy: Grid) => (g: Grid): Grid => {
      return simulateNextGrid(gridCopy)(g);
    };
    const nextGrid = (g: Grid): Grid => {
      return produce(g, gridCopy => getNextGridSimulation(gridCopy)(g));
    };
    setGrid(g => nextGrid(g));
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <div style={{ display: 'flex' }}>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'stop' : 'start'}
        </button>
        <button onClick={() => setGrid(generateRandomGrid())}>random</button>
        <button onClick={() => setGrid(generateEmptyGrid())}>clear</button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 20px)`
        }}
      >
        {grid &&
          grid.map((rows, i) =>
            rows.map((_cols, k) => (
              <div
                className="cell"
                style={{ backgroundColor: grid[i][k] ? 'pink' : undefined }}
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
              ></div>
            ))
          )}
      </div>
    </>
  );
}

export default App;
