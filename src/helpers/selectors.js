export function getAppointmentsForDay(state, day) {
  const result = []
  
  const filteredDay = state.days.filter(stateDay => stateDay.name === day)

  
    if(state.appointments && filteredDay.length > 0) {
    const values = Object.values(state.appointments)
  
 
      filteredDay[0].appointments.forEach(app => {
      
        for (let val of values) {
          if (app === val.id) {
            result.push(val)
          }
        }
      })
    }
  return result

};

export function getInterview(state, interview) {

  if (!interview) {
    return null
  }

  const result = {}

  const values = Object.values(state.interviewers)

  for (let val of values) {
    if (val.id === interview.interviewer) {

      result.student = interview.student
      result.interviewer = val
     
    }
  }

return (result)

}

export function getInterviewersForDay(state, day) {
  const result = []
  
  const filteredDay = state.days.filter(stateDay => stateDay.name === day)

  
    if(state.appointments && filteredDay.length > 0) {
    const values = Object.values(state.interviewers)
   
 
      filteredDay[0].interviewers.forEach(app => {
       
        for (let val of values) {
         
          if (app === val.id) {
            result.push(val)
          }
        }
      })
    }
    
  return result
  

};
