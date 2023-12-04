'use client';
import { TIMEOUT } from 'dns';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';

const Highway = () => {
  const isLeft = useRef(false);
  const [gameStart, setGameStart] = useState(false);
  const [randomLocation, setRandomLocation] = useState(80);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const clearTime = useRef<NodeJS.Timeout | null>(null);
  const gameover = useRef<NodeJS.Timeout | null>(null);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const moveXAxis = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      let car = document.getElementById('car');
      if (car && !isLeft.current) {
        car.style.transform += ' translate3d(-180%, 0, 0)';
        isLeft.current = !isLeft.current;
      }
    } else if (e.key === 'ArrowRight') {
      let car = document.getElementById('car');
      if (car && isLeft.current) {
        isLeft.current = !isLeft.current;
        car.style.transform += ' translate3d(180%, 0, 0)';
      }
    }
  };

  const detectIntersection = useCallback(() => {
    let enemy = document.getElementById('enemy');
    let car = document.getElementById('car');
    if (enemy && car) {
      if (
        enemy.offsetTop > 520 &&
        enemy.offsetTop < 600 &&
        ((enemy.offsetLeft > 100 && !isLeft.current) ||
          (enemy.offsetLeft < 100 && isLeft.current))
      ) {
        stopInterval();
        setGameOver(true);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', moveXAxis);
    clearTime.current = setTimeout(() => {
      setGameStart(true);
    }, 2000);

    gameover.current = setInterval(() => {
      detectIntersection();
    }, 10);

    interval.current = setInterval(() => {
      createEnemyCar();
    }, 1000);

    return () => {
      if (clearTime.current && interval.current && gameover.current) {
        clearTimeout(clearTime.current);
        clearInterval(interval.current);
        clearInterval(gameover.current);
      }
    };
  }, [gameOver, detectIntersection]);

  useEffect(() => {
    if (gameOver) {
      stopInterval();
    }
  }, [gameOver]);

  const stopInterval = () => {
    if (clearTime.current && interval.current && gameover.current) {
      clearTimeout(clearTime.current);
      clearTime.current = null;
      clearInterval(interval.current);
      interval.current = null;
      clearInterval(gameover.current);
      gameover.current = null;
    }
  };

  const createEnemyCar = () => {
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    setScore((prev) => prev + 100);
    if (randomNumber === 1) {
      setRandomLocation(10);
    } else {
      setRandomLocation(60);
    }
  };

  const startNewGame = () => {
    window.location.reload();
  };
  return (
    <>
      {!gameOver ? (
        <div className='flex w-full h-screen'>
          <div className='w-4/12 bg-green-500 h-screen'>
            <h3 className='m-3 text-slate-50'>Score : {score}</h3>
          </div>
          <div className='w-4/12 bg-gray-600 h-screen relative'>
            <div className='w-[35px] h-[100px] bg-white absolute left-[43%] move-white-line '></div>
            {gameStart && (
              <div
                id='enemy'
                className={`w-[150px] absolute top-[5%] left-[${randomLocation}%] rotate-180 move-enemy-car`}
              >
                <Image
                  src='/images/enemy-car.png' // Replace with your image path
                  alt='car-image'
                  width={100} // Set your desired width
                  height={100} // Set your desired height
                />
              </div>
            )}
            <div id='car' className='w-[150px] absolute top-[70%] left-[60%]'>
              <Image
                src='/images/car-image-2.png' // Replace with your image path
                alt='car-image'
                width={170} // Set your desired width
                height={100} // Set your desired height
              />
            </div>
          </div>
          <div className='w-4/12 bg-green-500 h-screen'></div>
        </div>
      ) : (
        <div className='w-full flex justify-center items-center h-screen flex-col'>
          <h1 className='font-extrabold text-4xl mb-6 text-red-500'>Game Over</h1>
          <h1 className='font-bold mb-4'>Your Score : {score}</h1>
          <button
            className='rounded-lg bg-green-500 p-4 text-white'
            onClick={startNewGame}
          >
            Play Again
          </button>
        </div>
      )}
    </>
  );
};

export default Highway;
