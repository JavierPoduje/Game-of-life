import React, { useState, useCallback, useRef } from 'react';

import produce from 'immer';

import { ROWS, COLS, OPERATIONS } from './constants';
import './App.css';

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push(Array.from(Array(COLS), () => 0));
  }

  return rows;
};

const generateRandomGrid = () => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push(Array.from(Array(COLS), () => (Math.random() > 0.7 ? 1 : 0)));
  }

  return rows;
};

function App() {
  const [grid, setGrid] = useState(generateEmptyGrid);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < ROWS; i++) {
          for (let j = 0; j < COLS; j++) {
            let neighbors = 0;

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;

              if (newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS) {
                neighbors += g[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

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
        <button
          onClick={() => {
            setGrid(generateRandomGrid());
          }}
        >
          random
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          clear
        </button>
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
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? 'pink' : undefined,
                  border: 'solid 1px black'
                }}
              ></div>
            ))
          )}
      </div>
    </>
  );
}

export default App;
