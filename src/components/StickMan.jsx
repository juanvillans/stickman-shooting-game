import React from "react";

export default function StickMan(props) {
  return (
    <div className="relative border flex items-center flex-col [&_div]:bg-black">
      {/** head */}
      <div className="w-5 relative left-0.5 h-5 rounded-full "></div>

      {/** torso */}
      <div className="h-7 w-1  "></div>
      {/** arms  */}
      <span className="relative -top-6 -left-1 -rotate-[60deg]" style={`transform: rotate(${props.armsAngle}deg)`}>
        <div className="h-1 w-9 absolute rotate-6 origin-right "></div>
        <div className="h-1 w-9 absolute"></div>
      </span>

      {/** legs */}
      <span className="flex ">
        <span>
          <div className="h-6 w-1 relative -top-1 left-0.5 origin-top -rotate-[35deg]"></div>
          <div className="h-6 w-1 relative -top-3 left-4 origin-top -rotate-[9deg]"></div>
        </span>
        <span className=" border-red-900">
          <div className="h-6 w-1 relative -top-1 -left-0.5 origin-top "></div>
          <div className="h-6 w-1 relative  -top-2 -left-0.5 origin-top rotate-[20deg] "></div>
        </span>
      </span>
    </div>
  );
}
