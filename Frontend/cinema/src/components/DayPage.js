import React from 'react';
import './DayPage.css';

const DayPage = ({ date, goDayBack, goDayForward }) => {
    const formatDate = (date) => {
        const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
        const options2 = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const [weekday, bagno] = date.toLocaleDateString('en-US', options).split(', ');
        const [month, day, year] = date.toLocaleDateString('en-US', options2).split('/');
        return `${weekday}, ${day}.${month}.${year}`;
      };

  return (
    <div className="date-container">
      <button className="arrow-button" onClick={goDayBack}>{'<'}</button>
      <div className="date">{date != undefined ? formatDate(date) : ''}</div>
      <button className="arrow-button" onClick={goDayForward}>{'>'}</button>
    </div>
  );
};

export default DayPage;
