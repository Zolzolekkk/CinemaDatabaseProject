import React from "react";

import "./Programme.css";

const Programme = ({ movie }) => {
  return (
    <div>
      {movie ? (
        <div className="movie">
          {console.log(movie)}
          <img src={movie.poster} alt={movie.title} />
          <div className="details">
            <h2 className="title">{movie.title}</h2>
            <div className="showtimes">
              {/* {showtimes.map((time, index) => ( */}
              <button className="showtime-button">17:00</button>
              {/* ))} */}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Programme;
