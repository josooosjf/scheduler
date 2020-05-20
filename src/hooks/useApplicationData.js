import {  useEffect, useReducer } from "react";
import axios from "axios";

// WebSockets established outside of React component
let webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL, ["protocolOne", "protocolTwo"])

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const DELETE_INTERVIEW = "DELETE_INTERVIEW";


  // function made to update the spots counter
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
      `api/appointments/${id}`,
      {interview}
    )
    .then( function (res) { 
        dispatch({type: SET_INTERVIEW, id, interview})
    })
  
  };


  const cancelInterview = (id, interview) => {


    return axios  
      .delete(
        `api/appointments/${id}`
      )
      .then( function (res) { 
       
      dispatch({type: DELETE_INTERVIEW, id, interview: null})
    })
  };

  useEffect(() => {

    let URL1 = "api/days";
    let URL2 = "api/appointments"
    let URL3 = "api/interviewers"
  
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
    webSocket.onmessage = function (event) {
      
      const data = JSON.parse(event.data);
      const type = data.type === "SET_INTERVIEW" ? (data.interview  ?  data.type : DELETE_INTERVIEW) : data.type
      dispatch({ type: type, id: data.id, interview:data.interview})
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

