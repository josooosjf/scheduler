import React from "react";
import "components/Appointment/styles.scss"
import Header from 'components/Appointment/Header'
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"

export default function Appointment(props) {
  const {id, time, interview} = props;

  return (
    <article className="appointment"  key={ id } >
      <Header time={time}/>
      {interview ? <Show student={interview.student} interviewer={interview.interviewer}/> : <Empty/> }
    </article>
  );
}