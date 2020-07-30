import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import './App.css';


const numRows = 25;
const numCols = 35;


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
  const [time, setTime] = useState(100);
  
  const [generation, setGeneration] = useState(0);


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
    setGeneration((generation) => generation + 1);
    setTimeout(runSimulation, time);
  }, [time])
  
  const handleTimeChange = (e) => {
    setTime(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  
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
    setGeneration((generation) => generation + 1);
  }, [])

  return (
    <>
    <div className="game-display">
    <header>
      <h1>
      Conway's Game of Life
      </h1>
    </header>
    <div className="left-side">
      <label>
        # Generation: {generation}
      </label>
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
    <div className="buttons">
    <button className="button"
    onClick={() => {
      setRunning(!running);
      runningRef.current = true;
      runSimulation();
    }}
    >
    Start
    </button>
    <button className="button"
    onClick={() => {
      setRunning(!running);
      runningRef.current = false;
    }}
    >
    Stop
    </button>
    <button  className="button"
    onClick={() => {
      setGrid(createEmptyGrid());
    }}>Clear</button>
    <button className="button"
    onClick={() => {
      const rows = [];
      // randomizes grid 50/50 either alive or dead for each space.
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => Math.random() > .5 ? 1 : 0));
      }

      setGrid(rows);
    }}>Randomize Grid</button>
    <button className="button"
    onClick={() => {
      setRunning(!running)
      runningRef.current = true;
      justOneSimulation();

    }}>Next Generation</button>
    <form className="time-interval"onSubmit={handleSubmit}>
      <label>
        Time Interval: 
        <input
        value={time}
        type="number"
        onChange={handleTimeChange}
        />
        msec
      </label>
    </form>
    </div>
    </div>
    <div className="game-text">
      <h2>Rules:</h2>
      <p>In the Game of Life, these rules examine each cell of the grid. For each cell, it counts that cell's eight neighbors (up, down, left, right, and diagonals), and then act on that result.
      <ul>
      <li>If the cell is alive and has 2 or 3 neighbors, then it remains alive. Else it dies.</li>
      <li>If the cell is dead and has exactly 3 neighbors, then it comes to life. Else if remains dead.</li>
      </ul>
      From those two rules, many types of "creatures" can be created that move around the "landscape".
      Note: cells that are off the edge of the grid are typically assumed to be dead. </p>
      <h2>Interactive Rules:</h2>
      <ul>
      <li>You can customize the grid to your liking while the game is <u><b>not</b></u> running.  Simply click on a square to make it alive, or dead.</li>
      <li>The 'Randomize Grid' button will generate a random grid to start with.</li>
      <li>The 'Next Generation' button will manually progress the game one generation at a time.</li>
      <li>You can set the runtime of the game via the 'Time Interval' by inputing your own time.  Time is in milliseconds(1000 msec = 1 sec).</li>
      </ul>
    </div>
    <footer className="alg-text">
      <h2>About this Algorithm:</h2>
      <p>In computability theory, a system of data-manipulation rules (such as a computer's instruction set, a programming language, or a cellular automaton) is said to be Turing-complete or computationally universal if it can be used to simulate any Turing machine. This means that this system is able to recognize or decide other data-manipulation rule sets. Turing completeness is used as a way to express the power of such a data-manipulation rule set. Virtually all programming languages today are Turing-complete. The concept is named after English mathematician and computer scientist Alan Turing.</p>
    </footer>
    </div>
    </>
  );
};

export default App;
