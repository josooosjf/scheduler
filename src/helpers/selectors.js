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

