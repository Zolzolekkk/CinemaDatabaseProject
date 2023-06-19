import React, { useState } from "react";
import "./SeanseView.css";
import SeatsGrid from "./SeatsGrid";

const SeanseView = (seanse) => {
  const [normalTickets, setNormalTickets] = useState(0);
  const [studentTickets, setStudentTickets] = useState(0);

  const handleNormalTicketChange = (event) => {
    const quantity = parseInt(event.target.value);
    setNormalTickets(quantity);
  };

  const handleStudentTicketChange = (event) => {
    const quantity = parseInt(event.target.value);
    setStudentTickets(quantity);
  };

  const seatsPlaceholder = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  ];

  return (
    <div className="seanse-view-container">
      <table
        className="ticketTable"
        cellSpacing="0"
        rules="all"
        border="0"
        id="TicketsSelection"
        style={{ borderWidth: "0px", borderCollapse: "collapse" }}
      >
        <tbody>
          <tr className="header">
            <th scope="col">Rodzaj</th>
            <th className="TicketsSelectionPriceHeader" scope="col">
              Price
            </th>
            <th scope="col">Quantity</th>
          </tr>
          <tr className="TT_1">
            <td>
              <div className="type-ticket">
                <span id="lblTicketName">Regular 2D</span>
              </div>
            </td>
            <td>
              <span id="lblPrice">25.90 zł</span>
            </td>
            <td className="select-td">
              <select
                name="ctl00$CPH1$SelectTicketControl$TicketsSelection$ctl02$ddQunatity"
                id="ddQunatity_0"
                className="ddlTicketQuantity"
                onChange={handleNormalTicketChange}
                value={normalTickets}
              >
                <option value="0">
                  0
                </option>
                <option value="1">
                  1
                </option>
                <option value="2">
                  2
                </option>
                <option value="3">
                  3
                </option>
                <option value="4">
                  4
                </option>
                <option value="5">
                  5
                </option>
                <option value="6">
                  6
                </option>
                <option value="7">
                  7
                </option>
                <option value="8">
                  8
                </option>
                <option value="9">
                  9
                </option>
                <option value="10">
                  10
                </option>
              </select>
            </td>
          </tr>
          <tr className="TT_2">
            <td>
              <div className="type-ticket">
                <span id="lblTicketName">Student 2D</span>
              </div>{" "}
            </td>
            <td>
              <span id="lblPrice">21.90 zł</span>
            </td>
            <td className="select-td">
              <select
                name="ctl00$CPH1$SelectTicketControl$TicketsSelection$ctl03$ddQunatity"
                id="ddQunatity_1"
                className="ddlTicketQuantity"
                onChange={handleStudentTicketChange}
                value={studentTickets}
              >
                <option value="0">
                  0
                </option>
                <option value="1">
                  1
                </option>
                <option value="2">
                  2
                </option>
                <option value="3">
                  3
                </option>
                <option value="4">
                  4
                </option>
                <option value="5">
                  5
                </option>
                <option value="6">
                  6
                </option>
                <option value="7">
                  7
                </option>
                <option value="8">
                  8
                </option>
                <option value="9">
                  9
                </option>
                <option value="10">
                  10
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      {normalTickets + studentTickets > 0 ? <div>
        <SeatsGrid rows={12} columns={10} noTickets={normalTickets + studentTickets}/>
      </div> : null}
    </div>
  );
};

export default SeanseView;
