import React from 'react';

export const StudyMaterialView: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-6">Study Material</h1>
      
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto">
        <div className="mx-auto bg-nexus-light-blue h-20 w-20 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-nexus-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold text-nexus-purple mb-4">Access All Study Materials</h2>
        <p className="text-nexus-brown/80 mb-8">
          All our study guides, supplementary notes, and practice materials are available in a shared Google Drive folder. Click the button below to access everything you need to succeed.
        </p>
        <a 
          href="https://drive.google.com/drive/folders/1Qm-luZBpTpZclazKyLFlmrKgyA4Szw79?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-nexus-pink text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Go to Google Drive
        </a>
      </div>
    </div>
  );
};