import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day : "Monday",
    days : [],
    appointments : {},
    interviewers : {},
  })

  const getDaysWithSpots = function(days, appointments) {
    const newDays = [] 
      for(const day of days) {
        const newDay = {...day};
        newDay.spots = 0;
        for(const appId of day.appointments) {
          if(!appointments[appId].interview) {
            newDay.spots++;
            console.log(newDay)
          }
        } 
        newDays.push(newDay);
      }
      console.log("newDays", newDays)
    return newDays;
  }
  const setDay = day => setState({ ...state, day })


  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
    .put(
      `http://localhost:8001/api/appointments/${id}`,
      {interview}
    )
    .then( function (res) { 
        let days = getDaysWithSpots(state.days, appointments)
                
      setState((state) => {return {...state, appointments, days}} )
    })
  };



  const cancelInterview = (id, interview) => {
    console.log("interview", interview)

    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id] : appointment
    };

    return axios  
      .delete(
        `http://localhost:8001/api/appointments/${id}`
      )
      .then( function (res) { 
        let days = getDaysWithSpots(state.days, appointments)
                
      setState((state) => {return {...state, appointments, days}} )
    })
  };

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

  


  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    
  }

}

// const daysCopy = [...state.days]
// state.days = daysCopy.map(value => { 
//    if (value.name === state.day) {
//      return {
//        ...value,
//        spots : value.spots - 1
       
//      } 
     
//    } else {
//      return {
//        ...value
//      }
//    }
// })