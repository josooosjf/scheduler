import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (replace === true) {
      
      setHistory([...history])
      setMode(newMode)

    }
    if (replace === false) {
    setHistory([...history, newMode])
    setMode(newMode)
    }
  }

  const back = () => {
    let newHistory = [...history];
    if (newHistory.length > 1) {
      newHistory.pop();
    }
    const previousMode = newHistory[newHistory.length - 1]
    setHistory(newHistory)
    setMode(previousMode)
  }

  return {
    mode, 
    transition, 
    back
  }
};

