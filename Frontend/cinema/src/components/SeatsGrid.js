import React, { useEffect, useState } from "react";
import "./SeatsGrid.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import NoAccountCheckout from "./NoAccountCheckout";

const SeatsGrid = ({
  user,
  noTickets,
  noRegularTickets,
  getProgramme,
  seanse,
  prices,
}) => {
  const [grid, setGrid] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [correctSeats, setCorrectSeats] = useState(true);
  const [checkoutNoAccount, setCheckoutNoAccount] = useState(false);

  // No account checkout states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const navigate = useNavigate();

  const initializeGrid = () => {
    const initialGrid = [];
    for (let seatRow of seanse.seats) {
      const row = [];
      for (let seat of seatRow.seats) {
        seat.availability ? row.push("green") : row.push("red");
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
      let flag = true;
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
              flag = false;
            });
        }
      } catch (error) {
        console.log(error);
        flag = false;
      }
      // router to main
      if (flag) {
        alert("Tickets bought successfully!");
        navigate("/");
      }
    }
  };

  const showNoAccountCheckout = () => {
    setCheckoutNoAccount(true);
  };

  const noAccountCheckout = async (event) => {
    event.preventDefault();
    if (checkSeats()) {
      console.log("no account checkout");
      let flag = true;
      try {
        for (let i = 0; i < noTickets; i++) {
          console.log(seanse._id);
          await api
            .post("/tickets/addTicket", {
              date: seanse.starttime,
              seanseid: seanse._id,
              type: i < noRegularTickets ? "regular" : "student",
              name: firstName,
              surname: lastName,
              email: email,
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
              flag = false;
            });
        }
      } catch (error) {
        console.log(error);
        flag = false;
      }
      // router to main
      if (flag) {
        alert("Tickets bought successfully!");
        navigate("/");
      }
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
        {user != null ? (
          <button className="seats-button" onClick={() => loggedInCheckout()}>
            Checkout
          </button>
        ) : !checkoutNoAccount ? (
          <div>
            <button onClick={() => showNoAccountCheckout()}>
              Checkout without account
            </button>
            <button onClick={() => navigate(`/login/:${seanse._id}`)}>Log in</button>
          </div>
        ) : (
          <div className="registration-container">
      <form className="registration-form" onSubmit={noAccountCheckout}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button type="submit">Checkout</button>
      </form>
    </div>
        )}
      </div>
    </div>
  );
};

export default SeatsGrid;
