
import React, { useState } from 'react';
import { glossaryTerms } from '../data';

export const GlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTerms = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.term.localeCompare(b.term));

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-6">Glossary</h1>
      <p className="mb-8 text-nexus-brown/80 max-w-3xl">
        A collection of important and complex words from the courses. Use this section to clarify any terms you're unsure about.
      </p>

      <div className="mb-8 sticky top-20 z-10">
        <input
          type="text"
          placeholder="Search for a term..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 border-2 border-nexus-light-blue rounded-lg shadow-sm focus:ring-2 focus:ring-nexus-pink focus:border-nexus-pink outline-none transition bg-white text-nexus-brown placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-4">
        {filteredTerms.length > 0 ? (
            filteredTerms.map(term => (
            <div key={term.term} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-nexus-pink">
              <h2 className="text-xl font-bold text-nexus-purple">{term.term}</h2>
              <p className="mt-2 text-nexus-brown/90">{term.definition}</p>
            </div>
            ))
        ) : (
            <div className="text-center py-10">
                <p className="text-lg text-nexus-brown/70">No terms found matching your search.</p>
            </div>
        )}
      </div>
    </div>
  );
};