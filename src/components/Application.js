import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from './DayList'
import "components/Appointment"
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from '../helpers/selectors'





export default function Application(props) {

  const [state, setState] = useState({
    day : "Monday",
    days : [],
    appointments : {},
    interviewers : {}
  })

  const setDay = day => setState({ ...state, day })

  const appointmentsArray = getAppointmentsForDay(state, state.day);
  console.log("appointments array", appointmentsArray)
 
  // Fetch days with Axios and set days to that
  useEffect(() => {

    let URL1 = "http://localhost:8001/api/days";
    let URL2 = "http://localhost:8001/api/appointments"
    let URL3 = "http://localhost:8001/api/interviewers"
  
    const promise1 = axios.get(URL1);
    const promise2 = axios.get(URL2);
    const promise3 = axios.get(URL3)
  
    Promise.all([
      promise1,
      promise2,
      promise3
    ]).then((all) => {
      setState(prev => ({ ...prev, days : all[0].data, appointments: all[1].data, interviewers : all[2].data}));
    });
  }, []);

  

  return (
    <main className="layout">
            <section className="sidebar">
            <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        <ul>
        {appointmentsArray.map((appointment,appIndex) => {
          const interview = getInterview(state, appointment.interview)

          if (appIndex === appointmentsArray.length - 1) {
            return ( 
              <Appointment 
                key={appIndex}
                id={"last"} 
                {...appointment}
                interview={interview}
              />
              )
          } else {

          return ( 
          <Appointment
            key={appIndex}
            id={appIndex} 
            {...appointment}
            interview={interview}
          />
          )

          }
        })}
        </ul>
      </section>
    </main>
  );
  
}


 // const setDays = days => setState(prev => ({ ...prev, days }));