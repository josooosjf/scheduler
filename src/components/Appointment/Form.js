import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  // took our interviewer and name and put them in state. is this correct?

  const {interviewers, onSave, onCancel, theInterviewer, theName } = props

  const [interviewer, setInterviewer] = useState(theInterviewer || null);
  const [name, setName] = useState(theName || "");
  const reset = () => {
    setName("");
    setInterviewer(null);
  };
  const cancel = () => {
    reset();
    onCancel()
  };
  const validate = () => { 
    onSave(name,interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            value={name}
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => setName(event.target.value)}
            
          />
        </form>
        <InterviewerList 
        interviewers={interviewers} 
        interviewer={interviewer} 
        setInterviewer={setInterviewer} 
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={validate} confirm>Save</Button>
        </section>
      </section>
    </main>
  );

};