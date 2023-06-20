import React, { useEffect, useState } from "react";
import "./SeatsGrid.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const SeatsGrid = ({ user, noTickets, noRegularTickets, seanse, prices }) => {
  const [grid, setGrid] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [correctSeats, setCorrectSeats] = useState(true);

  const navigate = useNavigate();

  const initializeGrid = () => {
    const initialGrid = [];
    for (let seatRow of seanse.seats) {
      // console.log(seatRow);
      const row = [];
      for (let seat of seatRow.seats) {
        console.log(seat);
        seat.availability ? row.push("green") : row.push("red");
      }
      initialGrid.push(row);
    }
    console.log(user);
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

  const loggedInCheckout = async () => {
    if (checkSeats()) {
      try {
        for (let i = 0; i < noTickets; i++) {
          console.log(seanse._id);
          await api
            .post("/tickets/addTicket", {
              date: seanse.starttime,
              seanseid: seanse._id,
              type: i < noRegularTickets ? "regular" : "student",
              userid: user.id,
              row: selectedSeats[i][0],
              col: selectedSeats[i][1],
              price:
                i < noRegularTickets
                  ? seanse["3d"]
                    ? prices.normal["3d"]
                    : prices.normal["2d"]
                  : seanse["3d"]
                  ? prices.student["3d"]
                  : prices.student["2d"],
            })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
      }
      // router to main
      // navigate("/");
    }
  };

  const noAccountCheckout = () => {
    if (checkSeats()) {
      console.log("checkout");
      // router to checkout
    }
  };

  return (
    <div className="square-grid">
      {console.log(seanse)}
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
        {user != null ? (
          <button className="seats-button" onClick={() => loggedInCheckout()}>
            Checkout
          </button>
        ) : (
          <div>
            <button onClick={() => noAccountCheckout()}>
              Checkout without account
            </button>
            <button>Log in</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatsGrid;
