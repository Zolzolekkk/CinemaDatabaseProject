import React, { useEffect, useState } from "react";
import "./SeatsGrid.css";

const SeatsGrid = ({ rows, columns, noTickets }) => {
  const [grid, setGrid] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [correctSeats, setCorrectSeats] = useState(true);

  const initializeGrid = () => {
    const initialGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push("green");
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  };

  const handleClick = (rowIndex, columnIndex) => {
    const newGrid = [...grid];
    const currentColor = newGrid[rowIndex][columnIndex];
    let newColor = currentColor;

    if (currentColor == "green" && selectedSeats.length < noTickets) {
      newColor = "yellow";
      setSelectedSeats([...selectedSeats, [rowIndex, columnIndex]]);
    } else if (currentColor == "yellow") {
      newColor = "green";
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat[0] != rowIndex || seat[1] != columnIndex
        )
      );
    }
    newGrid[rowIndex][columnIndex] = newColor;
    setGrid(newGrid);
    console.log(selectedSeats);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const checkSeats = () => {
    if (selectedSeats.length === noTickets) return true;
    alert("Please select " + noTickets + " seats!");
    return false;
  };

  // todo
  const loggedInCheckout = () => {
    if (checkSeats()) {
        console.log("checkout");
        // add tickets to db
        // console.log them
        // router to main
        }
  }

  const noAccountCheckout = () => {
    if (checkSeats()) {
        console.log("checkout");
        // router to checkout
        }
  };

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
      <div className="seats-buttons">
        {/* gdy zalogowany */}
        {/* <button className="seats-button" onClick={() => loggedInCheckout()}>Checkout</button> */}
        {/* gdy niezalogowany */}
        <button onClick={() => noAccountCheckout()}>Checkout without account</button> 
        <button>Log in</button> 
      </div>
    </div>
  );
};

export default SeatsGrid;
