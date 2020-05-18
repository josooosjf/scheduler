import React from 'react';
import "components/InterviewerList.scss";
import InterviewerListItem from './InterviewerListItem';
import propTypes from 'prop-types';


export default function InterviewerList(props) {
  const { interviewers, interviewer, setInterviewer} = props;
  
  InterviewerList.propTypes = {
    interviewer : propTypes.number,
    setInterviewer : propTypes.func.isRequired
  }


  return (
    <section className="interviewers">
    <h4 className="interviewers__header text--light">Interviewer</h4>
    <ul className="interviewers__list">
    {interviewers.map(singleInterviewer => {
      return <InterviewerListItem 
        key={singleInterviewer.id}
        avatar={singleInterviewer.avatar} 
        name={singleInterviewer.name} 
        selected={singleInterviewer.id === interviewer} 
        setInterviewer={() => setInterviewer(singleInterviewer.id)}  
      />
    })}
    </ul>
      </section>
  )
} 

  // interviewers:array - an array of objects containing the information of each interviewer
  // interviewer:number - the id of an interviewer
  // setInterviewer:function - a function that accepts an interviewer id