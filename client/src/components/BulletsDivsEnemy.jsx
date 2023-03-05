import React, { useState, useRef, useEffect, useLayoutEffect } from "react";

export default function SetBulletsDivEnemy({top, right, transform, indx})  {
    indx = useRef()
     return (

        <>
        <div
            className={` h-1 absolute bg-red-800  z-50  origin-right bullet-parent `}
            style={{
                transform: `rotate(${transform}deg)`,
                top: `${right}px `,
                right: `${top}px`,
            }}
            >
            <div className="w-ful absolute top-0 right-0">
            <div
                className="z-0 bullet-ene w-12 h-1 right-0 rounded-r-full absolute"
                ref={indx}
                ></div>
            </div>
        </div>
        </>
     )
    
    

        
}
    