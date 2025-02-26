'use client';

import React, { useState, useEffect } from 'react';
import SpinnerWheel from '../components/SpinnerWheel';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { quizSegments } from '../data/questions';
import { motion, AnimatePresence } from 'framer-motion';
import FallingEmojis from '../components/FallingEmojis';
import Footer from '../components/Footer';
import QuizResults from '../components/QuizResults';

export default function Page() {
  const [selectedSegment, setSelectedSegment] = useState(null); // Store the current selected segment
  const [animationType, setAnimationType] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojiSettings, setEmojiSettings] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0); // Track the current question index
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [resetWheel, setResetWheel] = useState(false); // Track when to reset the spinner

  useEffect(() => {
    if (animationType) {
      const timeout = setTimeout(() => {
        setAnimationType(null);
        setShowEmojis(false);
      }, 4000); // Wait for animation duration

      return () => clearTimeout(timeout);
    }
  }, [animationType]);

  const handleAnswer = (option) => {
    if (!selectedSegment) return;

    const isCorrect = option === selectedSegment.correctAnswer;
    setAnimationType(isCorrect ? 'success' : 'failure');

    // Trigger confetti animation for correct or wrong answers
    setEmojiSettings({
      emojis: isCorrect ? ['🎉', '🎊', '💖'] : ['❌'],
      amount: isCorrect ? 80 : 50,
      speed: isCorrect ? 5 : 3,
      size: isCorrect ? 30 : 40,
      duration: 4000,
    });

    setShowEmojis(true);

    if (questionIndex + 1 === quizSegments.length) {
      setQuizCompleted(true);
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    }

    // Reset the selected segment but don't reset the spinner
    setSelectedSegment(null);
  };

  const selectNextQuestion = () => {
    if (quizCompleted) return;

    const nextIndex = questionIndex % quizSegments.length; // Ensure we get the next question from the list
    setSelectedSegment(quizSegments[nextIndex]);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedSegment(null); // Reset selected question
    setResetWheel((prev) => !prev); // Reset the spinner
  };

  return (
    <main className="relative flex flex-row items-center justify-center min-h-screen p-0">
      {/* Left: Wheel Section */}
      <motion.div
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg shadow-lg border bg-card">
          <CardContent className="text-center p-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Spin It to Win It 🎡</h1>
            {/* Pass the resetWheel state to SpinnerWheel */}
            <SpinnerWheel key={resetWheel} onSpinEnd={selectNextQuestion} />
            <p className="text-md text-muted-foreground italic mt-4 mb-4">
              "You think you know payments? Let’s see if your brain processes as fast as your card."
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right: Question Section */}
      <motion.div
        className="flex flex-1 items-center justify-center relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg shadow-lg border bg-card p-6">
          <CardContent>
            <AnimatePresence mode="wait">
              {quizCompleted ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Show quiz results */}
                  <QuizResults score={score} restartQuiz={restartQuiz} />
                </motion.div>
              ) : (
                <motion.div
                  key={selectedSegment?.label || 'default'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Question Counter */}
                  <p className="text-lg font-medium text-muted-foreground mb-3">
                    📊 Question {questionIndex + 1} of {quizSegments.length}
                  </p>

                  {selectedSegment ? (
                    <>
                      <h2 className="text-xl font-bold text-primary">{selectedSegment.label}</h2>
                      <p className="text-lg mt-2 text-foreground">{selectedSegment.question}</p>

                      <div className="mt-4 space-y-2">
                        {selectedSegment.options.map((option, idx) => (
                          <Button
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            className="w-full bg-destructive hover:bg-destructive-foreground"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground">Spin the wheel to get a question.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* 🎉 Confetti for correct / ❌ X rain for incorrect answers */}
      {showEmojis && emojiSettings && (
        <FallingEmojis
          emojis={emojiSettings.emojis}
          amount={emojiSettings.amount}
          speed={emojiSettings.speed}
          size={emojiSettings.size}
          duration={emojiSettings.duration}
        />
      )}

      {/* Footer Section */}
      <div className="absolute bottom-0 w-full m-0 p-0">
        <Footer />
      </div>
    </main>
  );
}