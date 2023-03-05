import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import gun from "../img/gun.webp";
// import gun2Img from '../img/gun2.png'
import gun3 from "../img/gun3.png";
import shot from "../audio/shot.mp3";

export default function StickMan(props) {
  const [angle, setAngle] = useState({
    transform: `rotate(${props.armsAngle}deg)`,
  });
  const [bulletPos, setBulletPos] = useState({});

  const [impactAnimation, setImpactAnimations] = useState({});
  useEffect(() => {
    setAngle({
      transform: `rotate(${props.armsAngle}deg)`,
    });
  }, [props.armsAngle]);

  const classes =
    props.rol == "enemy" ? "left-[1200px] -scale-x-100 " : "";

  let bulletRef = useRef();
  const gunEl = useRef();

  useEffect(() => {
    let isDeath = props.stickManLifth !== 0 ? false : true;

    if (props.impactLocation == "head") {
      if (isDeath) {
        setImpactAnimations({
          head: "-rotate-[70deg]",
          arms: "rotate-45",
          arm1: "origin-bottom-left rotate-[80deg] duration-300 ",
          allBody: "-rotate-90 duration-300",
          gun: "top-6 duration-700 -rotate-[360deg]",
        });
      } else {
        setImpactAnimations({
          head: "-rotate-45",
          arms: "rotate-12",
        });
      }
    }
    if (props.impactLocation == "torso") {
      if (isDeath) {
        setImpactAnimations({
          head: "rotate-12",
          torso1: "rotate-[17deg] border-b-red-800 border-b-4",
          torso2: "-rotate-[17deg] border-t-red-800 border-t-4",
          arms: "rotate-45",
          arm1: "rotate-[90deg] origin-bottom-left",
          arm2: "-rotate-[50deg] origin-bottom-left",
          allBody: "rotate-90 duration-300",
          gun: "top-10  duration-700 -left-20 rotate-[280deg]",
        });
      } else {
        setImpactAnimations({
          head: "rotate-12",
          torso1: "rotate-[17deg] border-b-red-800 border-b-4",
          torso2: "-rotate-[17deg] border-t-red-800 border-t-4",
          arms: "rotate-12",
        });
      }
    }

    if (props.impactLocation == "legs") {
      setImpactAnimations({
        legs1: "rotate-[22deg]",
      });
    }

    if (props.stickManLifth === 0) {
      // console.log("se murió");
    } else {
      setTimeout(() => {
        // console.log("no se murio");
        setImpactAnimations({});
      }, 110);
    }
    // console.log(props.stickManLifth);
  }, [props.impactTotal]);
  return (
    <>
      <div
        ref={props.personRef}
        className={`absolute transition-all duration-400 stickMan  ${classes}`}
        style={{ top: props.stickManPosition + "px" }}
      >
        <div
          className={`relative  flex items-center  flex-col ease-linear ${impactAnimation.allBody}`}
        >
          {/** head */}
          <div
            className={`w-5 relative left-0.5 h-5 rounded-full origin-bottom bg-black  ${impactAnimation.head}`}
          ></div>
          {/** torso */}
          <div
            className={`h-[14px] w-1 rounded-full bg-black  relative  origin-top rounded-b-none ${impactAnimation.torso1}`}
          ></div>
          <div
            className={`h-[14px] w-1 rounded-full bg-black  relative  origin-bottom rounded-t-none ${impactAnimation.torso2}`}
          ></div>
          {/** arms  */}
          <span
            className={`absolute z-10 [&_div]:rounded-full [&_div]:bg-black top-6 left-2  h-1 origin-left ${impactAnimation.arms}`}
            style={angle}
          >
            <div
              className={`h-1 w-9 relative  -top-1 -left-1 origin-right rotate-[10deg] ${impactAnimation.arm1} `}
            >
              <img
                src={gun}
                ref={gunEl}
                alt=""
                className={`z-50 gun relative duration-100 left-4 bottom-2  -rotate-[3deg] ${impactAnimation.gun}`}
              />
            </div>
            <div
              className={`w-7 h-1 relative z-50 -top-2  ${impactAnimation.arm2}`}
            ></div>
          </span>

          {/** legs */}
          <span className="flex z-0 [&_div]:bg-black [&_div]:rounded-full  ">
            <span className={`rotate-12 origin-top ${impactAnimation.legs1}`}>
              <div className="h-6 w-1 relative -top-1 left-0.5 origin-top -rotate-[35deg] "></div>
              <div className="h-6 w-1 relative -top-3 left-4 origin-top -rotate-[9deg]"></div>
            </span>
            <span className=" border-red-900">
              <div className="h-6 w-1 relative -top-1 -left-0.5 origin-top "></div>
              <div className="h-6 w-1 relative  -top-2 -left-0.5 origin-top rotate-[20deg] "></div>
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
