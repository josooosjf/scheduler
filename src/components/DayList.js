import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  const { days, day, setDay } = props;

  // <DayListItem 
  // name={day.name} 
  // spots={day.spots} 
  // selected={day.name === props.day}
  // setDay={props.setDay}  />

  return (
  <ul>
    {days.map(singleDay => {
      return <DayListItem key={singleDay.id} name={singleDay.name} spots={singleDay.spots} selected={singleDay.name === day} 
      setDay={setDay}  />
    })}
  </ul> 
  )
}