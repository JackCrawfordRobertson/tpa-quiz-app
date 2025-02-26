'use client';

import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const TestFallingEmojis = ({ emojis, run, duration = 2000, amount = 50 }) => {
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== 'undefined') {
      updateSize(); // Set the correct size immediately after mounting
      window.addEventListener('resize', updateSize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateSize);
      }
    };
  }, []);

  return (
    <Confetti
      width={windowSize.width}
      height={windowSize.height}
      numberOfPieces={run ? amount : 0} // Adjust amount dynamically
      recycle={false} // Ensures confetti disappears after duration
      gravity={0.2} // Controls the downward speed (higher = faster)
      wind={0} // Ensures no sideways movement
      initialVelocityX={5} // Disables side movement at start
      initialVelocityY={5} // Makes it fall straight down
      drawShape={(ctx) => {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        ctx.font = '40px serif';
        ctx.fillText(randomEmoji, 0, 0);
      }}
    />
  );
};

export default TestFallingEmojis;