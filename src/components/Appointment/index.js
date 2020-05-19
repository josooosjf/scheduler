import React, {useEffect} from "react";
import "components/Appointment/styles.scss"
import Header from 'components/Appointment/Header'
import Show from "components/Appointment/Show"
import Empty from "components/Appointment/Empty"
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error"


export default function Appointment(props) {
  const {id, time, interview, interviewers, bookInterview, cancelInterview,} = props;

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const ERROR_SAVE= "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    interview !== null ? SHOW : EMPTY
  );

  useEffect(() => {
    if (interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [interview, transition, mode]);


  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    
    
    transition(SAVING);
    
    if(interviewer) {

      bookInterview(id, interview)
        .then(() => transition(SHOW))
        .catch((res) => {
          transition(ERROR_SAVE, true)
        }
         )

    } else {
      transition(ERROR_SAVE, true);
    }

    


  }

  const del = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(DELETING, true)

    cancelInterview(id, interview)
      .then(() => transition(EMPTY))
      .catch((res) => transition(ERROR_DELETE, true))
  };

  const edit = () => {
   
    transition(CREATE)

  };
  
  

  return (
    <article className="appointment" data-testid="appointment"  key={ id } >
      <Header time={time}/>

      {mode === CONFIRM && (
        <Confirm 
        message={"Are you sure you want to delete your interview?"}
        onConfirm= {del}
        onCancel = {back}
        />
      )}

      {mode === DELETING && <Status message={"Deleting"}/>}

      {mode === SAVING && <Status message={"Saving your interview"}/>}

      {mode === EMPTY && <Empty onAdd={ () => transition(CREATE) } />}

      {mode === SHOW && (!interview || !interview.interviewer) && <Empty onAdd={ () => transition(CREATE) } />}
            
      {mode === SHOW && interview && interview.interviewer && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={edit}
          onDelete={() => transition(CONFIRM)}
        />
      )}

      {mode === CREATE && (
      <Form
      interviewers={interviewers}
      onSave={save}
      onCancel={back}
      theName = {interview ? interview.student : ""}
      theInterviewer = {interview ? interview.interviewer.id : null}
      />
      )}  

      {mode === ERROR_DELETE && (
        <Error
          onClose={back}
          message={"Could not cancel appointment"}
        />
      )}

      {mode === ERROR_SAVE && (
        <Error
          onClose={back}
          message={"Could not save appointment"}
        />
      )}

    </article>
  );
}


