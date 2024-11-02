import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [rows, setRow] = useState(31);
  const [columns, setColumns] = useState(31);
  const [world, setWorld] = useState<number[][]>([]);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    const worldGenerator = (
      rows: number,
      columns: number,
      defaultValue = 0
    ) => {
      return Array.from({ length: rows }, () =>
        Array(columns).fill(defaultValue)
      );
    };
    setWorld(worldGenerator(rows, columns));
  }, [rows, columns]);

  const onClickHandler = (rowIndex: number, colIndex: number) => {
    // console.log(rowIndex, colIndex);
    const copy = structuredClone(world);
    copy[rowIndex][colIndex] = Number(!copy[rowIndex][colIndex]);

    setWorld(copy);
  };

  // const killer = (rowIndex: number, colIndex: number) => {
  //   setWorld((prev) => {
  //     const copy = JSON.parse(JSON.stringify(prev));
  //     copy[rowIndex][colIndex] = 0;
  //     return copy;
  //   });
  // };
  // const reviver = (rowIndex: number, colIndex: number) => {
  //   setWorld((prev) => {
  //     const copy = JSON.parse(JSON.stringify(prev));
  //     copy[rowIndex][colIndex] = 1;
  //     return copy;
  //   });
  // };

  const step = () => {
    setWorld((prevWorld) => {
      const copyOfPrevWorld = JSON.parse(JSON.stringify(prevWorld));
      for (let i = 0; i < prevWorld.length; i++) {
        for (let j = 0; j < prevWorld[i].length; j++) {
          const neighbors = {
            top: prevWorld?.[i - 1]?.[j] || 0,
            bottom: prevWorld?.[i + 1]?.[j] || 0,
            right: prevWorld?.[i]?.[j + 1] || 0,
            left: prevWorld?.[i]?.[j - 1] || 0,
            topRight: prevWorld?.[i - 1]?.[j + 1] || 0,
            bottomRight: prevWorld?.[i + 1]?.[j + 1] || 0,
            topLeft: prevWorld?.[i - 1]?.[j - 1] || 0,
            bottomLeft: prevWorld?.[i + 1]?.[j - 1] || 0,
          };
          const countOfLiveNeighbors = Object.values(neighbors).filter(
            (i) => i === 1
          ).length;

          if (prevWorld[i][j]) {
            if (countOfLiveNeighbors <= 1) {
              // killer(i, j);
              copyOfPrevWorld[i][j] = 0;
            }
            if (countOfLiveNeighbors >= 4) {
              copyOfPrevWorld[i][j] = 0;
              // killer(i, j);
            }
          } else {
            if (countOfLiveNeighbors === 3) {
              // reviver(i, j);
              copyOfPrevWorld[i][j] = 1;
            }
          }
        }
      }
      return copyOfPrevWorld;
    });
  };

  const startHandler = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        step();
      }, 700);
      setIntervalId(id);
    }
  };

  const stopHandler = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <>
      <div className="world">
        {world.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="world__div-row">
              {row.map((r, colIndex) => {
                return (
                  <div
                    key={colIndex}
                    className={`world__div-cell ${Boolean(r) ? 'active' : ''}`}
                    onClick={() => onClickHandler(rowIndex, colIndex)}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="settingBox">
        <div className="rowContainer settingsContainer">
          <h3>Rows</h3>
          <button onClick={() => setRow((prev) => ++prev)}>+</button>
          <span>{rows}</span>
          <button onClick={() => setRow((prev) => --prev)}>-</button>
        </div>
        <div className="colContainer settingsContainer">
          <h3>cols</h3>
          <button onClick={() => setColumns((prev) => ++prev)}>+</button>
          <span>{columns}</span>
          <button onClick={() => setColumns((prev) => --prev)}>-</button>
        </div>

        <div>
          <button onClick={() => step()}>one step</button>
          <button
            className={`startButton ${intervalId ? 'active' : ''}`}
            onClick={startHandler}
          >
            start
          </button>
          <button
            className={`stopButton ${!intervalId ? 'activeStop' : ''}`}
            onClick={stopHandler}
          >
            stop
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
