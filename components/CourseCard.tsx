
import React from 'react';
import type { Module } from '../types';

interface CourseCardProps {
  module: Module;
  status: 'locked' | 'unlocked' | 'completed';
  onClick: () => void;
}

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v2H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CourseCard: React.FC<CourseCardProps> = ({ module, status, onClick }) => {
  const isLocked = status === 'locked';
  
  const statusConfig = {
    locked: {
      icon: <LockIcon />,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-400',
      borderColor: 'border-gray-300',
      hover: ''
    },
    unlocked: {
      icon: <PlayIcon />,
      bgColor: 'bg-white',
      textColor: 'text-nexus-brown',
      borderColor: 'border-nexus-light-blue',
      hover: 'hover:border-nexus-pink hover:shadow-lg'
    },
    completed: {
      icon: <CheckIcon />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-400',
      hover: 'hover:shadow-lg'
    }
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`p-6 rounded-lg border-2 w-full text-left ${config.borderColor} ${config.bgColor} ${!isLocked ? config.hover : ''} transition-all duration-300 flex flex-col justify-between transform disabled:cursor-not-allowed hover:-translate-y-1 disabled:transform-none`}
    >
      <div>
        <div className={`flex items-center justify-between mb-3 ${status === 'completed' ? 'text-green-600' : 'text-nexus-purple'}`}>
          <h3 className={`text-xl font-bold ${config.textColor}`}>
            {module.title}
          </h3>
          <span className={`${config.textColor}`}>{config.icon}</span>
        </div>
        <p className={`text-sm ${config.textColor} opacity-80`}>
          Module {module.id}
        </p>
      </div>
      <div className={`mt-4 text-xs font-semibold uppercase px-3 py-1 rounded-full self-start ${
          status === 'locked' ? 'bg-gray-200 text-gray-500' :
          status === 'completed' ? 'bg-green-200 text-green-800' :
          'bg-nexus-light-blue text-nexus-purple'
      }`}>
        {status}
      </div>
    </button>
  );
};
