import {  useEffect, useReducer } from "react";
import axios from "axios";

// import { act } from "@testing-library/react";

let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL, ["protocolOne", "protocolTwo"])

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const DELETE_INTERVIEW = "DELETE_INTERVIEW";

  const getDaysWithSpots = function(days, appointments) {
    const newDays = [] 
      for(const day of days) {
        const newDay = {...day};
        newDay.spots = 0;
        for(const appId of day.appointments) {
          if(!appointments[appId].interview) {
            newDay.spots++;
           
          }
        } 
        newDays.push(newDay);
      }
     
    return newDays;
  }

  function reducer (state, action) {
    switch(action.type) {
      case SET_DAY: 
        return ({...state, day : action.day });
      case SET_APPLICATION_DATA:
        return  { ...state, days :action.all[0].data, appointments: action.all[1].data, interviewers : action.all[2].data}
      case SET_INTERVIEW: {
         const appointment = {
          ...state.appointments[action.id],
          interview: { ...action.interview }
        };
        
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };

        let days = getDaysWithSpots(state.days, appointments)

        return {...state, appointments, days}
    
      }
      case DELETE_INTERVIEW: 
        const appointment = {
          ...state.appointments[action.id],
          interview: null
        }
    
        const appointments = {
          ...state.appointments,
          [action.id] : appointment
        };
    
        let days = getDaysWithSpots(state.days, appointments)

        return {...state, appointments, days}
      
    default: 
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  }

    const initial = {
      day : "Monday",
      days : [],
      appointments : {},
      interviewers : {},
    }

    const [state, dispatch] = useReducer(reducer, initial)


  const setDay = (day) => {
  dispatch({ type: SET_DAY, day });
  }


 

  


  const bookInterview = (id, interview) => {
   
    return axios
    .put(
      `http://localhost:8001/api/appointments/${id}`,
      {interview}
    )
    .then( function (res) { 
        dispatch({type: SET_INTERVIEW, id, interview})
    })
  };



  const cancelInterview = (id, interview) => {
    console.log("interview", interview)


    return axios  
      .delete(
        `http://localhost:8001/api/appointments/${id}`
      )
      .then( function (res) { 
       
      dispatch({type: DELETE_INTERVIEW, id, interview: null})
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
      dispatch({ type: SET_APPLICATION_DATA, all });
    });
  }, []);

  useEffect(() => {
    // webSocket.onopen = function (event) {
    //   webSocket.send("ping")
    // }

    webSocket.onmessage = function (event) {
      
      console.log(JSON.parse(event.data))
      const stuff = JSON.parse(event.data);
      const type = stuff.type === "SET_INTERVIEW" ? (stuff.interview  ?  stuff.type : DELETE_INTERVIEW) : stuff.type
      console.log("stuff.type", stuff.type, "type", type)
      dispatch({ type: type, id: stuff.id, interview:stuff.interview})
    }
    
    return () => webSocket.close()
  }, [])
  

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    
  }

}

