'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';

const QuizResults = ({ score, restartQuiz }) => {
  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold text-primary mb-2">🎉 Quiz Complete! 🎉</h2>
      <p className="text-lg text-foreground mb-4">
        You answered <strong>{score}</strong> out of <strong>5</strong> questions correctly!
      </p>

      {score === 5 ? (
        <p className="text-lg font-medium text-green-600">🏆 Perfect score! You really know your payments!</p>
      ) : score >= 3 ? (
        <p className="text-lg font-medium text-yellow-500">✨ Great job! You’ve got a solid grasp on payments.</p>
      ) : (
        <p className="text-lg font-medium text-red-500">🔄 Keep trying! There's always more to learn.</p>
      )}

      <Button
        className="mt-4 bg-destructive hover:bg-destructive-foreground text-white px-6 py-2 rounded-lg"
        onClick={restartQuiz}
      >
        Play Again
      </Button>
    </motion.div>
  );
};

export default QuizResults;