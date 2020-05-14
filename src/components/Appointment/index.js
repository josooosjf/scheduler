import React, {useEffect} from "react";
import "components/Appointment/styles.scss"
import Header from 'components/Appointment/Header'
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import { getInterviewersForDay } from "helpers/selectors";

export default function Appointment(props) {
  const {id, time, interview} = props;
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";

  const { mode, transition, back } = useVisualMode(
   () => interview !== null ? SHOW : EMPTY
  );

  useEffect(() => {
    
    if (interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [interview, transition, mode]);



  return (
    <article className="appointment"  key={ id } >
      <Header time={time}/>

       {mode === EMPTY && <Empty onAdd={ () => transition(CREATE) } />}

       {mode === SHOW && !interview && <Empty onAdd={ () => transition(CREATE) } />}
            
       {mode === SHOW && interview && interview.interviewer && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      )}

      {mode === CREATE && (
        <Form
        
        interviewers={[]}
        onSave={props.onSave}
        onCancel={back}
        />
      )}

          

    </article>
  );
}




// {mode === EMPTY && <Empty onAdd={props.onAdd} />}
      
// {mode === SHOW && (
//   <Show
//     student={interview.student}
//     interviewer={interview.interviewer}
//     onEdit={props.onEdit}
//     onDelete={props.onDelete}
//   />
// )}


// {interview ? <Show student={interview.student} interviewer={interview.interviewer}/> : <Empty/> }