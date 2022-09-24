import React, {useState,useRef, useLayoutEffect} from "react";
import { useEffect } from "react";
import StickMan from "./components/StickMan";

function App() {
  const [armsAngle, setArmsAngle] = useState(0)
  
  const arena = useRef(null);

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    setHeight(arena.current.clientHeight /2);
    setWidth(arena.current.clientWidth);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove',(e)=> {
      const {clientX, clientY} = e
      setArmsAngle(clientY - height)
    }) 
  }, [])
  console.log({height})
  return (
    <div ref={arena} className="flex w-full h-screen  border-4 border-red-900 justify-between px-8 items-center">
     <StickMan armsAngle={armsAngle}/>
    </div>
  );
}

export default App;
