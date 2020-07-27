import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];
// clears current grid
const createEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  }
  return rows
}

function App() {
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid()
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
    // Will run a simulation of game of life
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ]
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
  }, [])

  return (
    <>
    <button
    onClick={() => {
      setRunning(!running);
      runningRef.current = true;
      runSimulation();
    }}
    >
      {running ? "Stop" : "Start"}
    </button>
    <button onClick={() => {
      setGrid(createEmptyGrid());
    }}>Clear</button>
    <button onClick={() => {
      const rows = [];
      // randomizes grid 50/50 either alive or dead for each space.
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => Math.random() > .5 ? 1 : 0));
      }

      setGrid(rows);
    }}>Randomize Grid</button>

    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols}, 20px)`
    }}>
      {grid.map((rows, i) => 
      rows.map((col, j) => 
      <div 
      key={`${i}-${j}`}
      onClick={() => {
        // only click new squares while simulation is not running.
        if (!running) {
        const newGrid = produce(grid, gridCopy => {
          gridCopy[i][j] = grid[i][j] ? 0 : 1;
        });
        setGrid(newGrid);
      }
      }}
      style = {{ 
        width: 20, 
        height: 20, 
        backgroundColor: grid[i][j] ? 'forestgreen': undefined, 
        border: 'solid 1px black'
      }} 
      />)
      )}
    </div>
    </>
  );
};

export default App;
