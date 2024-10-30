import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [rows, setRow] = useState(5);
  const [columns, setColumns] = useState(5);
  const [world, setWorld] = useState<number[][]>([]);

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

  const killerHandler = (rowIndex: number, colIndex: number) => {
    // debugger;

    const copy = structuredClone(world);
    copy[rowIndex][colIndex] = 7;
    console.log(rowIndex, colIndex);

    setWorld(copy);
  };

  const reviverHandler = (rowIndex: number, colIndex: number) => {
    // const copy = structuredClone(world);
    // copy[rowIndex][colIndex] = 1;

    setWorld((prev) => {
      const copy = structuredClone(prev);
      copy[rowIndex][colIndex] = 1;
      return copy;
    });
  };

  const step = () => {
    for (let i = 0; i < world.length; i++) {
      for (let j = 0; j < world[i].length; j++) {
        // debugger
        const neighbors = {
          top: world?.[i - 1]?.[j] || 0,
          bottom: world?.[i + 1]?.[j] || 0,
          right: world?.[i]?.[j + 1] || 0,
          left: world?.[i]?.[j - 1] || 0,
          topRight: world?.[i - 1]?.[j + 1] || 0,
          bottomRight: world?.[i + 1]?.[j + 1] || 0,
          topLeft: world?.[i - 1]?.[j - 1] || 0,
          bottomLeft: world?.[i + 1]?.[j - 1] || 0,
        };

        const countOfLiveNeighbors = Object.values(neighbors).filter(
          (i) => i === 1
        ).length;
        // console.log(neighbors, countOfLiveNeighbors);

        // const countOfDeadNeighbors = Object.values(neighbors).filter(
        //   (i) => i === 0
        // ).length;
        if (countOfLiveNeighbors <= 1) {
          // console.log('in');

          killerHandler(i, j);
        }
        // else if (countOfLiveNeighbors >= 4) {
        //   killerHandler(i, j);
        // } else if (countOfLiveNeighbors == 3) {
        //   reviverHandler(i, j);
        // } else if (countOfLiveNeighbors == 3 || countOfLiveNeighbors == 2) {
        //   reviverHandler(i, j);
        // } else {
        //   throw new Error('ridi');
        // }
      }
    }
  };

  console.log(world);
  return (
    <>
      <div className="world">
        {world.map((row, rowIndex) => {
          return (
            <div className="world__div-row">
              {row.map((r, colIndex) => {
                return (
                  <div
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
          <button onClick={() => step()}>start</button>
        </div>
      </div>
    </>
  );
}

export default App;
