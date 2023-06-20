import React, { useState, useEffect } from "react";
import "./SeanseView.css";
import SeatsGrid from "./SeatsGrid";
import { useParams } from 'react-router-dom';
import api from "../api/axiosConfig";

const SeanseView = ({user}) => {
  const [normalTickets, setNormalTickets] = useState(0);
  const [studentTickets, setStudentTickets] = useState(0);
  const [prices, setPrices] = useState(null);
  const [programme, setProgramme] = useState(null);
  const [seanse, setSeanse] = useState(null);

  const { seanseID } = useParams();
  const cleanedID = seanseID.replace(/[:}]/g, "");

  const getPrices = async () => {
    await api.get("/price").then((response) => {
      setPrices(response.data.priceList);
    }).catch((error) => {
      console.log(error);
    });
  }

  const getProgramme = async () => {
    try {
      const response = await api.get("programmes/getProgrammesWeekly");
      const seansesByDay = response.data.programmes.map((item) =>
        Object.entries(item.days).map(([day, { seanses }]) => seanses)
      );
      setProgramme(seansesByDay.flat());
      setSeanse(seansesByDay.flat().flat().find((seanse) => seanse._id === cleanedID));
    } catch (error) {
      console.log(error);
    }
  };

  const handleNormalTicketChange = (event) => {
    const quantity = parseInt(event.target.value);
    setNormalTickets(quantity);
  };

  const handleStudentTicketChange = (event) => {
    const quantity = parseInt(event.target.value);
    setStudentTickets(quantity);
  };

  useEffect(() => {
    getProgramme();
    getPrices();
  }, []);

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
            <th scope="col">Type</th>
            <th className="TicketsSelectionPriceHeader" scope="col">
              Price
            </th>
            <th scope="col">Quantity</th>
          </tr>
          <tr className="TT_1">
            <td>
              <div className="type-ticket">
                <span id="lblTicketName">Regular {seanse ? (seanse['3d'] ? '3D' : '2D') : ''}</span>
              </div>
            </td>
            <td>
              <span id="lblPrice">{prices && seanse ? (seanse['3d'] ? prices.normal['3d'].toFixed(2) : prices.normal['2d'].toFixed(2)) : ''} zł</span>
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
                <span id="lblTicketName">Student {seanse ? (seanse['3d'] ? '3D' : '2D') : ''}</span>
              </div>{" "}
            </td>
            <td>
              <span id="lblPrice">{prices && seanse ? (seanse['3d'] ? prices.student['3d'].toFixed(2) : prices.student['2d'].toFixed(2)) : ''} zł</span>
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
        <SeatsGrid noTickets={normalTickets + studentTickets} user={user} seanse={seanse} noRegularTickets={normalTickets} prices={prices}/>
      </div> : null}
    </div>
  );
};

export default SeanseView;
