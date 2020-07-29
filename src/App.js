import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';

const numRows = 25;
const numCols = 25;

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


function App() {
  // const [numRows, setNumRows] = useState(25);
  // const [numCols, setNumCols] = useState(25);
  const [time, setTime] = useState(100);
  
  // clears current grid
  const createEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows
  }
  
  const [grid, setGrid] = useState(() => {
    return createEmptyGrid()
  });
  
  const [running, setRunning] = useState(false);
  
  const runningRef = useRef(running);
  runningRef.current = running
  
  const runSimulation = useCallback(() => {
    // will run a simulation on interval
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
    console.log("settimeout time",time)
    setTimeout(runSimulation, time || 100);
  }, [time])
  
  const handleTimeChange = (e) => {
    setTime(e.target.value)
    console.log("handlechange:", e.target.value)
    console.log("time:",time)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(time)
  }
  // const handleColChange = (e) => {
  //   setNumCols(e.target.value)
  // }
  
  const justOneSimulation = useCallback(() => {
    // will run a simulation one at a time
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
    Start
    </button>
    <button
    onClick={() => {
      setRunning(!running);
      runningRef.current = false;
    }}
    >
    Stop
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
    <button onClick={() => {
      setRunning(!running);
      runningRef.current = true;
      justOneSimulation();
    }}>Next Generation</button>
    <form onSubmit={handleSubmit}>
      <label>
        Time Interval:
        <input
        placeholder={time}
        type="number"
        onChange={handleTimeChange}
        />
        msec
        <button >Run</button>
      </label>
    </form>
    {/* <form>
      <label>
        Number of Cols:
        <input
        type="number"
        onChange={handleColChange}
        />
      </label>
    </form> */}
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
        backgroundColor: grid[i][j] ? 'black': undefined, 
        border: 'solid 1px orange'
      }} 
      />)
      )}
    </div>
    </>
  );
};

export default App;
