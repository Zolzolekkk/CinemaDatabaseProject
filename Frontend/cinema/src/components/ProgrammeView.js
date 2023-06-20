import DayPage from "./DayPage";
import Programme from "./Programme";
import "./ProgrammeView.css";
import { useEffect, useState } from "react";

const ProgrammeView = ({ programme, firstDay }) => {
  const [currentDay, setCurrentDay] = useState(firstDay ? Math.floor((new Date() - firstDay)/ (1000 * 60 * 60 * 24)) : 5);
  const [currentDaySeansesMovies, setCurrentDaySeansesMovies] = useState(
    programme[currentDay]
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [backVisible, setBackVisible] = useState(true);
  const [forwardVisible, setForwardVisible] = useState(false);

  const goDayBack = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1);
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
      setForwardVisible(true);
    }
    if (currentDay === 0) {
      setBackVisible(false);
    }
  }

  const goDayForward = () => {
    if (currentDay < programme.length - 1) {
      setCurrentDay(currentDay + 1);
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
      setBackVisible(true);
    }
    if (currentDay === programme.length - 1) {
      setForwardVisible(false);
    }
  }

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
      {programme[currentDay] != undefined
        ? getHopefullyCorrectDataToDisplay().map((seanse) => <Programme seanses={seanse} />)
        : null}
        <DayPage date={currentDate} goDayBack={goDayBack} goDayForward={goDayForward}/>
    </div>
  );
};

export default ProgrammeView;
