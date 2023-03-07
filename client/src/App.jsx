import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import StickMan from "./components/StickMan";
import "./stylesheets/animations.css";
import grassImg from "./img/grass.jpg";
import shot from "./audio/shot.mp3";
import emptyGunShot from "./audio/empty-gun-shot.mp3";
import reload from "./audio/reload.mp3";
import bulletHit from "./audio/bullet-hit.mp3";
import ouch from "./audio/ouch.mp3";

import io from "socket.io-client"
const socket = io.connect("https://stickman-shooting-game.adaptable.app")

function App() {
  const [armsAngle, setArmsAngle] = useState(0);
  const [enemyAngle, setEnemyAngle] = useState(0);
  const targetRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 650 });
  const [gunCharger, setGunCharger] = useState(12);
  const [bulletsAvailable, setBulletsAvailable] = useState(30);
  const [mousePos, setMousePos] = useState({
    x: null,
    y: null,
  });
  const [mousePosEn, setMousePosEn] = useState({
    x:null,
    y:null,
  })
  const [enemyImpact, setEnemyImpact] = useState({ total: 0, location: "" });
  const [ownImpact, setOwnImpact] = useState({ total: 0, location: "" });
  const [isReloading, setIsReloading] = useState(false);
  // const [bulletPath, setBulletPath] = useState();
  const [bulletsDiv, setBulletsDiv] = useState([]);
  const [bulletsDivEnemy, setBulletsDivEnemy] = useState([]);
  const [enemyPos, setEnemyPos] = useState("");
  const [enemyLifth, setEnemyLifth] = useState(100);
  const [ownLifth, setOwnLifth] = useState(100);
  const [stickManPosition, setStickManPosition] = useState({});

  useLayoutEffect(() => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.clientWidth,
        height: targetRef.current.clientHeight,
      });
    }
  }, []);
  // const angleY = (((mousePos.y - stickManPosition + 49) / 2) * 0.2).toFixed(3);
  // console.log(window.pageYOffset + gunEl.current.getBoundingClientRect().top)

  const chargerCapacity = 30;
  const enemy = useRef("");
  const stickMan = useRef("");
const alamielda = useRef(null)
  React.useEffect(() => {
    const reloadSound = new Audio(reload);

    setStickManPosition({
      top: dimensions.height / 2,
      right: stickMan.current.getBoundingClientRect().right,
      bottom: stickMan.current.getBoundingClientRect().bottom,
      left: stickMan.current.getBoundingClientRect().left,
    });

    setEnemyPos({
      top: dimensions.height / 2,
      right: enemy.current.getBoundingClientRect().right,
      bottom: enemy.current.getBoundingClientRect().bottom,
      left: enemy.current.getBoundingClientRect().left,
    });

    function updateMousePos(ev) {
      setMousePos({ x: ev.clientX, y: ev.clientY + 75 });
    }

    function keyboardController(keys, repeat) {
      let timers = {};

      document.onkeydown = function (event) {
        let key = (event || window.event).key.toLowerCase();
        if (!(key in keys)) {
          return true;
        }
        if (!(key in timers)) {
          timers[key] = null;
          keys[key]();
          if (repeat !== 0) {
            timers[key] = setInterval(keys[key], repeat);
          }
        }
        return false;
      };
      document.onkeyup = (event) => {
        let key = (event || window.event).key.toLowerCase();
        if (key in timers) {
          if (timers[key] !== null) {
            clearInterval(timers[key]);
            delete timers[key];
          }
        }
        window.onblur = function () {
          for (key in timers) {
            if (timers[key] !== null) {
              clearInterval(timers[key]);
              timers = {};
            }
          }
        };
      };
    }

    keyboardController(
      {
        s: function () {
          setStickManPosition((prev) => {
            return {
              top: prev.top < 580 ? prev.top + 50 : prev.top,
              right: stickMan.current.getBoundingClientRect().right,
              bottom: stickMan.current.getBoundingClientRect().bottom,
              left: stickMan.current.getBoundingClientRect().left,
            };
          });
        },
        w: function () {
          setStickManPosition((prev) => {
            return {
              top: prev.top > 60 ? prev.top - 50 : prev.top,
              right: stickMan.current.getBoundingClientRect().right,
              bottom: stickMan.current.getBoundingClientRect().bottom,
              left: stickMan.current.getBoundingClientRect().left,
            };
          });
        },
        // k: function () {
        //   setEnemyPos((prev) => {
        //     return {
        //       top: prev.top + 50,
        //       right: enemy.current.getBoundingClientRect().right,
        //       bottom: enemy.current.getBoundingClientRect().bottom,
        //       left: enemy.current.getBoundingClientRect().left,
        //     };
        //   });
        // },
        // i: function () {
        //   setEnemyPos((prev) => {
        //     return {
        //       top: prev.top - 50,
        //       right: enemy.current.getBoundingClientRect().right,
        //       bottom: enemy.current.getBoundingClientRect().bottom,
        //       left: enemy.current.getBoundingClientRect().left,
        //     };
        //   });
        // },
      },
      50
    );

    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (key === "r") {
        reloadSound.play();
        setIsReloading(true);
        setTimeout(() => {
          setIsReloading(false);
          setBulletsAvailable((prev) => prev + (chargerCapacity - prev));
        }, 2300);
      }
    });
    window.addEventListener("mousemove", updateMousePos);
    // console.log(enemy.current.getBoundingClientRect().top, enemy.current.getBoundingClientRect().right, enemy.current.getBoundingClientRect().bottom, enemy.current.getBoundingClientRect().left)
    return () => {
      window.removeEventListener("mousemove", updateMousePos);
      // window.removeEventListener("keypress", updateStickPosition);
    };
  }, []);
  // console.log(enemyPos)

  function shooting() {
    
    const stickDiv = document.querySelector(".stickMan");
    const distanceY =
    window.pageYOffset + stickMan.current.getBoundingClientRect().top + 90;
    const bulletPath =
    Math.atan2(mousePos.y - distanceY  , mousePos.x - 20) * (180 / Math.PI);
    let impact = false;
    
    function animate({ timing, draw, duration }) {
      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);
        draw(progress);
        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }
      });
    }

    const shotGunSound = new Audio(shot);
    const emptyGunSound = new Audio(emptyGunShot);
    const gunEl = document.querySelector(".gun");
    const gunXDistance =
      window.pageXOffset + gunEl.getBoundingClientRect().left + 23;
    const gunYDistance = window.pageYOffset + gunEl.getBoundingClientRect().top;

    if (bulletsAvailable > 0 && isReloading === false) {

      setBulletsAvailable((prev) => --prev);

      shotGunSound.play();
      setBulletsDiv((prevDivs) => {
        return [
          ...prevDivs,
          <div
            className={` h-1 absolute  z-50  left-11 origin-left bullet-parent`}
            style={{
              transform: `rotate(${bulletPath}deg)`,
              top: `${gunYDistance + 4}px `,
              left: `${gunXDistance}px`,
            }}
          >
            <div
              className="z-0 bullet w-12 h-1 rounded-r-full relative"
              id={`bullet-${bulletsDiv.length}`}
            ></div>
          </div>,
        ];
      });

      socket.emit("send_shoot", { bulletPath, bulletsDivLength: bulletsDiv.length, gunYDistance, shot: true})


      animate({
        duration: (window.innerWidth * 800) / 1360,
        timing(timeFraction) {
          return timeFraction;
        },
        draw(progress) {
          const bullet = document.querySelector(`#bullet-${bulletsDiv.length}`);
          bullet.style.left = progress * 120 + "vw";
          if (impact == false) {
            checkTouch(
              {
                top: bullet.getBoundingClientRect().top,
                right: bullet.getBoundingClientRect().right,
                bottom: bullet.getBoundingClientRect().bottom,
                left: bullet.getBoundingClientRect().left,
              },
              {
                top: enemy.current.getBoundingClientRect().top,
                right: enemy.current.getBoundingClientRect().right,
                bottom: enemy.current.getBoundingClientRect().bottom,
                left: enemy.current.getBoundingClientRect().left,
              },
              bullet
            );
          }
        },
      });

      const bulletHitSound = new Audio(bulletHit);
      const ouchSound = new Audio(ouch);
      function checkTouch(bullets, enemyPos, bullet) {
        if (
          !(
            bullets.top > enemyPos.bottom - 11 ||
            bullets.right < enemyPos.left ||
            bullets.bottom < enemyPos.top ||
            bullets.left > enemyPos.right
          )
        ) {
          if (bullets.bottom < enemyPos.top + 22) {
            console.log("head");
            setEnemyImpact((prev) => ({
              total: ++prev.total,
              location: "head",
            }));
            setEnemyLifth((prev) => (prev - 60 < 0 ? 0 : prev - 60));
          } else if (bullets.top > enemyPos.top + 40) {
            console.log("legs");
            setEnemyLifth((prev) => (prev - 10 < 0 ? 0 : prev - 10));
            setEnemyImpact((prev) => ({
              total: ++prev.total,
              location: "legs",
            }));
          } else {
            console.log("torso");
            setEnemyLifth((prev) => (prev - 20 < 0 ? 0 : prev - 20));
            setEnemyImpact((prev) => ({
              total: ++prev.total,
              location: "torso",
            }));
          }
          impact = true;
          bulletHitSound.play();
          bullet.classList.add("red");
          
          setTimeout(() => {
            ouchSound.play();
          }, 160);
        }
      }
      gunEl.style = "rotate: -20deg";
      setTimeout(() => {
        gunEl.style = "rotate: -4deg";
      }, 100);
    } else if (bulletsAvailable === 0 && isReloading === false) {
      emptyGunSound.play();
    }
    
  }

  function animate({ timing, draw, duration }) {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      let progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }
 
  function shooting2(bulletPath, bulletsDivLength, gunTop, shot) {



    const shotGunSound = new Audio(shot);
    const emptyGunSound = new Audio(emptyGunShot);
    const gunEl = enemy.current.querySelector(".gun");
    const gunXDistance = targetRef.current.clientWidth - gunEl.getBoundingClientRect().right  
    // const gunYDistance = window.pageYOffset + gunEl.getBoundingClientRect().top;

    if (shot === true) {

      shotGunSound.play();
      setBulletsDivEnemy((prevDivs) => {
        return [
          ...prevDivs,
          <div key={prevDivs.length}
            className={` h-1 absolute   z-50  origin-right bullet-parent`}
            style={{
              transform: `rotate(${bulletPath > 0 ? -bulletPath : Math.abs(bulletPath)}deg)`,
              top: `${gunTop + 4}px `,
              right: `${gunXDistance}px`,
            }}
          >
            <div className="w-ful absolute top-0 right-0">
              <div
                className="z-0 bullet w-12 h-1 right-0 rounded-r-full absolute"
                id={`bullet-ene${bulletsDivLength+1}`}
              ></div>
            </div>
          </div>,
        ];
      });
      
      

      
      
      gunEl.style = "rotate: -20deg";
      setTimeout(() => {
        gunEl.style = "rotate: -4deg";
      }, 100);
    } else  {
      emptyGunSound.play();
    }
    
  }


  useLayoutEffect(() => {
   socket.on("receive_angle", (data) => {
     setMousePosEn(data.mousePos)
    setEnemyAngle(data.armsAngle)
    setEnemyPos(data.stickManPosition)
   }) 
   socket.on("receive_shoot", (data) => {
     shooting2(data.bulletPath, data.bulletsDivLength, data.gunYDistance, data.shot)
    }) 
    
  }, [socket])
  
  useEffect(() => {
    if( ownLifth === 0 )
    socket.emit('')
  
  }, [ownLifth || enemyLifth])

  useEffect(() => {
    const bulletHitSound = new Audio(bulletHit);
    const ouchSound = new Audio(ouch);
    let impact = false;
    if (bulletsDivEnemy.length > 0) {
      let bullet = document.querySelector(`#bullet-ene${bulletsDivEnemy.length}`);
    
      animate({
        duration: (window.innerWidth * 800) / 1360,
        timing(timeFraction) {
          return timeFraction;
        },
        draw(progress) {
          bullet.style.right = progress * 120 + "vw";
          if (impact == false) {
            checkTouch(
              {
                top: bullet.getBoundingClientRect().top,
                right: bullet.getBoundingClientRect().right,
                bottom: bullet.getBoundingClientRect().bottom,
                left: bullet.getBoundingClientRect().left,
              },
              {
                top: stickMan.current.getBoundingClientRect().top,
                right: stickMan.current.getBoundingClientRect().right,
                bottom: stickMan.current.getBoundingClientRect().bottom,
                left: stickMan.current.getBoundingClientRect().left,
              },
              bullet
            );
          }
        },
      });
      
      function checkTouch(bullets, stickManPosition, bullet) {
        if (
          !(
            bullets.top > stickManPosition.bottom - 11 ||
            bullets.right < stickManPosition.left ||
            bullets.bottom < stickManPosition.top ||
            bullets.left > stickManPosition.right
          )
        ) {
          if (bullets.bottom < stickManPosition.top + 22) {
            setOwnImpact((prev) => ({
              total: ++prev.total,
              location: "head",
            }));
            setOwnLifth((prev) => (prev - 60 < 0 ? 0 : prev - 60));
          } else if (bullets.top > stickManPosition.top + 40) {
            setOwnLifth((prev) => (prev - 10 < 0 ? 0 : prev - 10));
            setOwnImpact((prev) => ({
              total: ++prev.total,
              location: "legs",
            }));
          } else {
            setOwnLifth((prev) => (prev - 20 < 0 ? 0 : prev - 20));
            setOwnImpact((prev) => ({
              total: ++prev.total,
              location: "torso",
            }));
          }
          impact = true;
          bulletHitSound.play();
          bullet.classList.add("red");
          
          setTimeout(() => {
            ouchSound.play();
          }, 160);
        }
      }
  
    }
    
  }, [bulletsDivEnemy]);


  useEffect(() => {
    setArmsAngle(
      Math.atan2(mousePos.y - stickManPosition.top - 90, mousePos.x) *
      (180 / Math.PI)
      );
      socket.emit("send_angle", {armsAngle, stickManPosition, mousePos})
  }, [mousePos, stickManPosition.top]);


  useEffect(() => {
   
  }, [ownLifth || enemyLifth]);

  const x1 = 20;
  const y1 = stickManPosition;
  const x2 = mousePos.x;
  const y2 = mousePos.y;

  return (
    <div
      onMouseDown={shooting}
      ref={targetRef}
      className={`overflow-hidden w-full h-screen relative  arena`}
    >
      {bulletsDiv}
      <div ref={alamielda}>
        {bulletsDivEnemy}

      </div>

      <StickMan
        key={1}
        gunCharger={gunCharger}
        bulletsAvailable={bulletsAvailable}
        armsAngle={armsAngle}
        stickManPosition={stickManPosition.top}
        personRef={stickMan}

        impactTotal={ownImpact.total}
        impactLocation={ownImpact.location}
        stickManLifth={ownLifth}
      />

      {/* <canvas id="canvas" height="800" width="1200"> </canvas> */}


      <StickMan
        key={2}
        personRef={enemy}
        rol={"enemy"}
        armsAngle={enemyAngle}

        stickManPosition={enemyPos.top}
        impactTotal={enemyImpact.total}
        impactLocation={enemyImpact.location}
        stickManLifth={enemyLifth}
      />
      <div className="vidas w-full py-2 px-10 flex justify-between">
        <div className="me">
        <div className="w-32 h-4 border-black border-2">
          <div
            className="h-full bg-red-700 "
            style={{ width: ownLifth + "%" }}
          ></div>
        </div>
          <p className="text-white font-bold">
            {isReloading ? "reloading.." : bulletsAvailable} / {chargerCapacity}
          </p>
        </div>

        <div className="w-32 h-4 border-black border-2">
          <div
            className="h-full bg-red-700 "
            style={{ width: enemyLifth + "%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
