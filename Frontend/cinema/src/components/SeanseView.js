import React, { useState } from "react";
import "./SeanseView.css";

const SeanseView = (seanse) => {
  const [normalTickets, setNormalTickets] = useState(0);
  const [studentTickets, setStudentTickets] = useState(0);

  const incrementNormalTickets = () => {
    setNormalTickets(normalTickets + 1);
  };

  const decrementNormalTickets = () => {
    if (normalTickets > 0) {
      setNormalTickets(normalTickets - 1);
    }
  };

  const incrementStudentTickets = () => {
    setStudentTickets(studentTickets + 1);
  };

  const decrementStudentTickets = () => {
    if (studentTickets > 0) {
      setStudentTickets(studentTickets - 1);
    }
  };

  return (
    <div>
      <table
        className="ticketTable"
        cellspacing="0"
        rules="all"
        border="0"
        id="TicketsSelection"
        style={{borderWidth: '0px', borderCollapse: 'collapse'}}
      >
        <tbody>
          <tr className="header">
            <th scope="col">Rodzaj</th>
            <th className="TicketsSelectionPriceHeader" scope="col">
              Cena
            </th>
            <th scope="col">Opłata serwisowa</th>
            <th scope="col">Ilość</th>
          </tr>
          <tr class="TT_1">
            <td>
              <div class="type-ticket">
                <span id="lblTicketName">Normalny 2D</span>
              </div>
            </td>
            <td>
              <span id="lblPrice">25.90 zł</span>
            </td>
            <td>
              <span id="lblServiceCharge">2.00 zł</span>
            </td>
            <td>
              <select
                name="ctl00$CPH1$SelectTicketControl$TicketsSelection$ctl02$ddQunatity"
                id="ddQunatity_0"
                className="ddlTicketQuantity"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </td>
          </tr>
          <tr class="TT_2">
            <td>
              <div className="type-ticket">
                <span id="lblTicketName">Ulgowy 2D</span>
              </div>{" "}
              (DZIECKO / STUDENT / SENIOR / WETERAN)
            </td>
            <td>
              <span id="lblPrice">21.90 zł</span>
            </td>
            <td>
              <span id="lblServiceCharge">2.00 zł</span>
            </td>
            <td>
              <select
                name="ctl00$CPH1$SelectTicketControl$TicketsSelection$ctl03$ddQunatity"
                id="ddQunatity_1"
                className="ddlTicketQuantity"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SeanseView;
