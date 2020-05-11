import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  const { days, day, setDay } = props;

  return (
  <ul>
    {days.map(singleDay => {
      return <DayListItem key={singleDay.id} name={singleDay.name} spots={singleDay.spots} selected={singleDay.name === day} 
      setDay={setDay}  />
    })}
  </ul> 
  )
}