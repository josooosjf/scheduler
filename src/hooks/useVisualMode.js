import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (replace === true) {
      let newHis = [...history]
      newHis.pop()
      setHistory( prev => ([...prev.slice(0,prev.length - 1), newMode]))
      // setHistory(newHis)
      setMode(newMode)

    }
    if (replace === false) {
    setHistory( prev => ([...prev, newMode]))
    setMode(newMode)
    }
  }

  const back = () => {
    let newHistory = [...history];
    if (newHistory.length > 1) {
      newHistory.pop();
    }
    const previousMode = newHistory[newHistory.length - 1]
    // setHistory(newHistory)
    setHistory( prev => ([...prev.slice(0,prev.length - 1), previousMode]))
    setMode(previousMode)
  }

  return {
    mode, 
    transition, 
    back
  }
};

