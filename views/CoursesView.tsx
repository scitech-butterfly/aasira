import React, { useState, useEffect, useCallback } from 'react';
import { courseModules } from '../data';
import type { Module, ModuleStatus, User } from '../types';
import { CourseCard } from '../components/CourseCard';
import { ModuleView } from '../components/ModuleView';
import { QuizView } from '../components/QuizView';
import { progressApi } from '../services/api';

type ViewMode = 'list' | 'module' | 'quiz' | 'results';

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
}

interface SavedQuizState {
  moduleId: number;
  currentQuestionIndex: number;
  selectedAnswers: Record<number, string>;
  endTime?: number;
}

interface CoursesViewProps {
  currentUser: User;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ currentUser }) => {
  const quizStateKey = `aasiraQuizState_${currentUser.id}`;

  const [moduleStatuses, setModuleStatuses] = useState<ModuleStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [initialQuizState, setInitialQuizState] = useState<{ currentQuestionIndex: number; selectedAnswers: Record<number, string>; endTime?: number } | null>(null);

  // Load progress from API
  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const progressData = await progressApi.getProgress();
        setModuleStatuses(progressData.moduleStatuses);
        setError(null);
      } catch (err: any) {
        console.error('Error loading progress:', err);
        setError(err.message || 'Failed to load progress');
        // Initialize default progress if API fails
        setModuleStatuses(
          courseModules.map((m, index) => ({
            moduleId: m.id,
            status: index === 0 ? 'unlocked' : 'locked',
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Check for saved quiz state in localStorage
  useEffect(() => {
    const savedQuizStateRaw = localStorage.getItem(quizStateKey);
    if (savedQuizStateRaw) {
      try {
        const savedQuizState: SavedQuizState = JSON.parse(savedQuizStateRaw);
        const module = courseModules.find(m => m.id === savedQuizState.moduleId);
        if (module) {
          setSelectedModule(module);
          setInitialQuizState({
            currentQuestionIndex: savedQuizState.currentQuestionIndex,
            selectedAnswers: savedQuizState.selectedAnswers,
            endTime: savedQuizState.endTime,
          });
          setViewMode('quiz');
        } else {
          localStorage.removeItem(quizStateKey);
        }
      } catch (e) {
        console.error("Failed to parse quiz state", e);
        localStorage.removeItem(quizStateKey);
      }
    }
  }, [quizStateKey]);

  const handleSelectModule = (module: Module) => {
    const status = moduleStatuses.find(s => s.moduleId === module.id)?.status;
    if (status !== 'locked') {
      setSelectedModule(module);
      setViewMode('module');
    }
  };

  const handleStartQuiz = () => {
    if (selectedModule) {
      localStorage.removeItem(quizStateKey);
      setInitialQuizState(null);
      setViewMode('quiz');
    }
  };

  const handleCompleteQuiz = useCallback(async (moduleId: number, score: number, total: number) => {
    localStorage.removeItem(quizStateKey);
    const passed = (score / total) * 100 >= 60;
    setQuizResult({ score, total, passed });
    setViewMode('results');

    if (passed) {
      const newStatuses = [...moduleStatuses];
      const currentModuleIndex = newStatuses.findIndex(s => s.moduleId === moduleId);
      
      if (currentModuleIndex !== -1) {
        newStatuses[currentModuleIndex].status = 'completed';
      }
      
      const nextModuleIndex = currentModuleIndex + 1;
      if (nextModuleIndex < newStatuses.length) {
        if (newStatuses[nextModuleIndex].status === 'locked') {
          newStatuses[nextModuleIndex].status = 'unlocked';
        }
      }

      setModuleStatuses(newStatuses);

      // Save to API
      try {
        await progressApi.updateProgress(newStatuses, {
          moduleId,
          score,
          total,
          passed
        });
      } catch (err: any) {
        console.error('Error saving progress:', err);
        // Don't show error to user, progress is saved locally
      }
    }
  }, [moduleStatuses, quizStateKey]);

  const handleReturnToList = () => {
    localStorage.removeItem(quizStateKey);
    setSelectedModule(null);
    setQuizResult(null);
    setViewMode('list');
  };
  
  const handleRetakeQuiz = () => {
    localStorage.removeItem(quizStateKey);
    setInitialQuizState(null);
    setViewMode('quiz');
  };
  
  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-6">Courses</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-pink"></div>
        </div>
      </div>
    );
  }

  const totalCompleted = moduleStatuses.filter(s => s.status === 'completed').length;
  const totalModules = courseModules.length;
  const progressPercentage = (totalCompleted / totalModules) * 100;

  const renderContent = () => {
    switch (viewMode) {
      case 'module':
        return selectedModule && <ModuleView module={selectedModule} onStartQuiz={handleStartQuiz} onBack={handleReturnToList} />;
      case 'quiz':
        return selectedModule && (
          <QuizView 
            module={selectedModule} 
            onCompleteQuiz={handleCompleteQuiz}
            initialState={initialQuizState}
            quizStateKey={quizStateKey}
          />
        );
      case 'results':
        return (
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold text-nexus-purple mb-4">Quiz Results</h2>
            {quizResult?.passed ? (
               <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                 <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               </div>
            ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
            )}
            <p className="text-lg text-nexus-brown">You scored {quizResult?.score} out of {quizResult?.total}.</p>
            <p className={`text-xl font-bold mt-2 ${quizResult?.passed ? 'text-green-600' : 'text-red-600'}`}>
              {quizResult?.passed ? 'Congratulations, you passed!' : 'You did not pass. Please try again.'}
            </p>
            {quizResult?.passed && <p className="mt-2 text-sm text-gray-600">The next module has been unlocked.</p>}
            
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0">
                <button 
                    onClick={handleReturnToList} 
                    className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Return to Courses
                </button>
                <button 
                    onClick={handleRetakeQuiz} 
                    className="bg-nexus-pink text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                >
                    Retake Quiz
                </button>
            </div>
          </div>
        );
      default:
        return (
           <>
             {error && (
               <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                 {error}
               </div>
             )}
             <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-nexus-purple mb-2">Welcome, {currentUser.username}!</h2>
                <p className="text-sm text-nexus-brown/80 mb-3">Here is your course progress.</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-nexus-pink h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none" style={{ width: `${progressPercentage}%` }}>
                     <span className="text-white text-shadow">{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
                <p className="text-right text-sm text-nexus-brown/80 mt-1">{totalCompleted} of {totalModules} modules completed.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseModules.map(module => (
                  <CourseCard
                    key={module.id}
                    module={module}
                    status={moduleStatuses.find(s => s.moduleId === module.id)?.status || 'locked'}
                    onClick={() => handleSelectModule(module)}
                  />
                ))}
             </div>
           </>
        );
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-6">Courses</h1>
      {renderContent()}
    </div>
  );
};