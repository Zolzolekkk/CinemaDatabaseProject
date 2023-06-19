import React from "react";
import {useNavigate} from "react-router-dom";

import "./Programme.css";

const Programme = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <div>
      {movie ? (
        <div className="movie">
          {console.log(movie)}
          <img className="poster" src={movie.poster} alt={movie.title} />
          <div className="details">
            <h2 className="title">{movie.title}</h2>
            <p className="description">{movie.genres[0]}, {movie.genres[1]}, {movie.genres[2]}</p>
            {/* <p className="format">{is3D ? '3D' : '2D'}</p> */}
            <p className="format">3D DUB</p>
            <div className="showtimes">
              {/* {showtimes.map((time, index) => ( */}
              <button className="showtime-button" onClick={() => navigate(`/Seanse/${1}`)}>11:00 {/*todo*/}</button> 
              <button className="showtime-button">14:00 {/*todo*/}</button> 
              <button className="showtime-button">17:00 {/*todo*/}</button> 

              {/* ))} */}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Programme;
