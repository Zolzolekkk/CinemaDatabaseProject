import React from "react";
import { useNavigate } from "react-router-dom";

import "./Programme.css";

const Programme = ({ seanses }) => {
  const navigate = useNavigate();

  const getTime = (time) => {
    const date = new Date(time);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {seanses != undefined && seanses.length > 0 ? (
        <div className="movie">
          <img
            className="poster"
            src={seanses[0].movieid.poster}
            alt={seanses[0].movieid.title}
          />
          <div className="details">
            <h2 className="title">{seanses[0].movieid.title}</h2>
            <p className="description">
              {seanses[0].movieid.genres[0]}, {seanses[0].movieid.genres[1]},{" "}
              {seanses[0].movieid.genres[2]}
            </p>
            <p className="format">{seanses[0].movieid["3d"] ? "3D" : "2D"}</p>
            <div className="showtimes">
              {seanses.map((seanse) => <button
                className="showtime-button"
                onClick={() => navigate(`/Seanse/:${seanse._id}}`)}
              >
                {getTime(seanse.starttime)}
              </button>)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Programme;
