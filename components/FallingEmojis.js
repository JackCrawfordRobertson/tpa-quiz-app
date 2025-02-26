'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FallingEmojis = ({ 
  emojis, 
  amount, 
  speed,  
  size,   
  duration 
}) => {
  const [emojiArray, setEmojiArray] = useState([]);

  useEffect(() => {
    if (!emojis || !amount || !speed || !size || !duration) return;

    const generateEmojis = () => {
      return Array.from({ length: amount }).map((_, index) => ({
        id: index,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100, // Random X position
        delay: Math.random() * 1.5, // Staggered drop
        rotate: Math.random() * 360, // Initial rotation
        velocityX: (Math.random() - 0.5) * 100, // Sideways drift
        spinSpeed: Math.random() * 100 + 50, // Random spin speed
      }));
    };

    setEmojiArray(generateEmojis());

    const timer = setTimeout(() => setEmojiArray([]), duration);
    return () => clearTimeout(timer);
  }, [emojis, amount, speed, size, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {emojiArray.map(({ id, emoji, left, delay, rotate, velocityX, spinSpeed }) => (
        <motion.span
          key={id}
          initial={{ opacity: 0, y: -50, rotate }} // Start invisible, above viewport
          animate={{ 
            opacity: [0, 1, 1, 0], // Fade in quickly, stay, then fade out
            y: '90vh', // Falls slightly above full viewport height
            x: [`${left}%`, `${left + velocityX}%`], // Sideways drift
            rotate: [rotate, rotate + spinSpeed] 
          }}
          transition={{ 
            duration: speed, 
            delay, 
            ease: 'easeOut',
            opacity: { duration: 2, delay, times: [0, 0.1, 0.9, 1] } // Quick fade-in, fade-out at end
          }}
          style={{
            position: 'absolute',
            left: `${left}%`,
            fontSize: `${size}px`,
            top: '-50px',
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
};

export default FallingEmojis;