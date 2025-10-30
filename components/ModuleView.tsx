
import React from 'react';
import type { Module } from '../types';

interface ModuleViewProps {
  module: Module;
  onStartQuiz: () => void;
  onBack: () => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({ module, onStartQuiz, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
           <h2 className="text-2xl md:text-3xl font-bold text-nexus-purple">{module.title}</h2>
           <p className="text-nexus-brown/70">Module {module.id}</p>
        </div>
        <button
            onClick={onBack}
            className="text-nexus-purple hover:text-nexus-pink transition-colors text-sm font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </button>
      </div>

      <div className="prose max-w-none text-nexus-brown mt-6 leading-relaxed">
        {module.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-nexus-purple mb-4 border-b-2 border-nexus-light-blue pb-2">Related Videos</h3>
        <div className="space-y-4">
          {module.youtubeLinks.map(link => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-nexus-sky/50 rounded-lg hover:bg-nexus-light-blue/50 transition-colors">
              <div className="flex-shrink-0 bg-nexus-pink p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.118v3.764a1 1 0 001.555.832l3.197-1.882a1 1 0 000-1.664l-3.197-1.882z" clipRule="evenodd"></path></svg>
              </div>
              <div className="ml-4">
                <p className="font-semibold text-nexus-purple">{link.title}</p>
                <p className="text-sm text-nexus-pink">Watch on YouTube</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <button
          onClick={onStartQuiz}
          className="bg-nexus-pink text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Take the Test
        </button>
      </div>
    </div>
  );
};
