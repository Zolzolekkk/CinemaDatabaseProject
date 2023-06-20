import Programme from "./Programme";
import "./ProgrammeView.css";
import { useEffect, useState } from "react";

const ProgrammeView = ({ programme }) => {
  const [currentDay, setCurrentDay] = useState(2);
  const [currentDaySeansesMovies, setCurrentDaySeansesMovies] = useState(
    programme[currentDay]
  );

  const getHopefullyCorrectDataToDisplay = () => {
    if (programme[currentDay] != undefined) {
      // getting all unique movies ids from current day seanses
      let moviesIds = [
        ...new Set(programme[currentDay].map((seance) => seance.movieid._id)),
      ];

      // getting all seanses for each movie in 2D and 3D seperately
      let moviesSeanses = moviesIds.map((movieId) => {
        return programme[currentDay].filter(
          (seanse) => seanse.movieid._id === movieId && new Date(seanse.starttime) > new Date() && seanse['3d']
        );
      }).concat(moviesIds.map((movieId) => {
        return programme[currentDay].filter(
          (seanse) => seanse.movieid._id === movieId && new Date(seanse.starttime) > new Date() && !seanse['3d']
        );
      }));
      return moviesSeanses;
    }
  };

  return (
    <div className="programme-view-container">
      {console.log(programme[currentDay])}
      {programme[currentDay] != undefined
        ? getHopefullyCorrectDataToDisplay().map((seanse) => <Programme seanses={seanse} />)
        : null}
    </div>
  );
};

export default ProgrammeView;
