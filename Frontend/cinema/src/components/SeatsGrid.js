import React, { useEffect, useState } from "react";
import "./SeatsGrid.css";

const SeatsGrid = ({ rows, columns }) => {
  const [grid, setGrid] = useState([]);

  const initializeGrid = () => {
    const initialGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        (i + j) % 3 == 0 ? row.push("green") : row.push("red");
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  };

  const handleClick = (rowIndex, columnIndex) => {
    console.log(rowIndex, columnIndex);
    console.log(grid[rowIndex][columnIndex]);
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const currentColor = newGrid[rowIndex][columnIndex];
      let newColor = currentColor;

      // jak Boga kocham nie mam pojęcia co się dzieje z tymi kolorami
      if (currentColor == "green") {
        newColor = "yellow";
        //   } else if (currentColor == "yellow") {
        //     newColor = "green";
        //     newGrid[rowIndex][columnIndex] = newColor;
        //     return newGrid;
      } else {
        newColor = "green";
      }
      newGrid[rowIndex][columnIndex] = newColor;
      return newGrid;
    });
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  return (
    <div className="square-grid">
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((color, columnIndex) => (
              <div
                key={columnIndex}
                className="grid-square"
                style={{ backgroundColor: color }}
                onClick={() => handleClick(rowIndex, columnIndex)}
              >
                {columnIndex + 1}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatsGrid;
