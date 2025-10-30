
import React, { useState } from 'react';
import type { Role, User } from '../types';
import { login, signup } from '../data';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'signup';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [organizerKey, setOrganizerKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let user: User;
      if (mode === 'login') {
        user = login(username, password);
      } else {
        user = signup(username, password, role, role === 'organizer' ? organizerKey : undefined);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isSignup = mode === 'signup';
  const isOrganizer = role === 'organizer';

  return (
    <div className="min-h-screen bg-nexus-sky flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-nexus-purple">Aasira</h1>
          <p className="text-nexus-brown/70 mt-4 text-lg">
            {isSignup ? 'Create your account' : 'Welcome Back! Please sign in.'}
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {isSignup && (
              <div>
                <label className="text-sm font-bold text-gray-700 tracking-wide">I am a...</label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`px-4 py-2 block w-full text-sm font-medium rounded-l-md transition-colors ${role === 'student' ? 'bg-nexus-purple text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`px-4 py-2 block w-full text-sm font-medium rounded-r-md transition-colors ${role === 'organizer' ? 'bg-nexus-purple text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Organizer
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="username" className="text-sm font-bold text-gray-700 tracking-wide">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-nexus-pink bg-transparent text-nexus-brown placeholder:text-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-sm font-bold text-gray-700 tracking-wide">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-nexus-pink bg-transparent text-nexus-brown placeholder:text-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {isSignup && isOrganizer && (
              <div>
                <label htmlFor="organizerKey" className="text-sm font-bold text-gray-700 tracking-wide">Organizer Key</label>
                <input
                  id="organizerKey"
                  type="password"
                  value={organizerKey}
                  onChange={(e) => setOrganizerKey(e.target.value)}
                  className="w-full text-base py-2 border-b border-gray-300 focus:outline-none focus:border-nexus-pink bg-transparent text-nexus-brown placeholder:text-gray-400"
                  placeholder="Enter your organizer key"
                  required
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div>
              <button type="submit" className="w-full flex justify-center bg-nexus-pink text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-300 hover:bg-opacity-90 transform hover:scale-105">
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
            
            <div className="text-center text-sm">
              <button type="button" onClick={() => { setMode(isSignup ? 'login' : 'signup'); setError('')}} className="font-medium text-nexus-purple hover:text-nexus-pink">
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
        <footer className="text-center p-4 text-nexus-brown/60 text-sm mt-6">
          <p>&copy; {new Date().getFullYear()} Aasira Learning. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};