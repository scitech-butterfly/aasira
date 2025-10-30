
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Module } from '../types';

interface QuizViewProps {
  module: Module;
  onCompleteQuiz: (moduleId: number, score: number, total: number) => void;
  quizStateKey: string;
  initialState?: {
    currentQuestionIndex: number;
    selectedAnswers: Record<number, string>;
    endTime?: number;
  } | null;
}

const QUIZ_DURATION_SECONDS = 10 * 60; // 10 minutes

export const QuizView: React.FC<QuizViewProps> = ({ module, onCompleteQuiz, initialState, quizStateKey }) => {
  if (!module || !module.quiz || module.quiz.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold text-red-500">Quiz Error</h2>
        <p className="mt-4 text-nexus-brown">This module's quiz could not be loaded as it contains no questions.</p>
        <button 
            onClick={() => onCompleteQuiz(module.id, 0, 0)} 
            className="mt-6 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
        >
            Return to Courses
        </button>
      </div>
    );
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialState?.currentQuestionIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(initialState?.selectedAnswers || {});
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION_SECONDS);

  const endTimeRef = useRef<number>(
    initialState?.endTime && initialState.endTime > Date.now()
      ? initialState.endTime
      : Date.now() + QUIZ_DURATION_SECONDS * 1000
  );
  const handleSubmitRef = useRef<(() => void) | null>(null);

  // The actual submit logic, memoized
  const handleSubmit = useCallback(() => {
    let score = 0;
    module.quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    onCompleteQuiz(module.id, score, module.quiz.length);
  }, [module, onCompleteQuiz, selectedAnswers]);

  // Keep the ref updated with the latest version of handleSubmit
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Timer effect, runs only once on mount
  useEffect(() => {
    const timerId = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(timerId);
        handleSubmitRef.current?.(); // Auto-submit when time is up
      }
    }, 1000);

    return () => clearInterval(timerId); // Cleanup on unmount
  }, []);

  // Save progress to localStorage whenever the question or answers change.
  useEffect(() => {
    const quizState = {
      moduleId: module.id,
      currentQuestionIndex,
      selectedAnswers,
      endTime: endTimeRef.current,
    };
    localStorage.setItem(quizStateKey, JSON.stringify(quizState));
  }, [module.id, currentQuestionIndex, selectedAnswers, quizStateKey]);

  const currentQuestion = module.quiz[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === module.quiz.length - 1;

  const handleSelectAnswer = (option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / module.quiz.length) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-nexus-purple mb-2">Quiz: {module.title}</h2>
      
      <div className="flex justify-between items-center mb-4 text-sm">
        <p className="text-nexus-brown/70">Question {currentQuestionIndex + 1} of {module.quiz.length}</p>
        <div className={`flex items-center font-bold ${timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-nexus-pink'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{minutes}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

       <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-nexus-pink h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
       </div>

      <div>
        <p className="text-lg font-medium text-nexus-brown mb-5">{currentQuestion.question}</p>
        <div className="space-y-3">
          {currentQuestion.options.map(option => (
            <label
              key={option}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestionIndex] === option
                  ? 'border-nexus-pink bg-nexus-pink/10'
                  : 'border-gray-200 hover:border-nexus-light-blue'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={selectedAnswers[currentQuestionIndex] === option}
                onChange={() => handleSelectAnswer(option)}
                className="h-4 w-4 text-nexus-pink focus:ring-nexus-pink"
              />
              <span className="ml-3 text-nexus-brown">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 text-right">
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestionIndex]}
            className="bg-nexus-pink text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};