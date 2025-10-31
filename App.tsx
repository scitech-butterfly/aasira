import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CoursesView } from './views/CoursesView';
import { GlossaryView } from './views/GlossaryView';
import { OrganizationsView } from './views/OrganizationsView';
import { StudyMaterialView } from './views/StudyMaterialView';
import { LoginView } from './views/LoginView';
import type { User } from './types';
import { authApi } from './services/api';

export type Page = 'courses' | 'glossary' | 'organizations' | 'study_material';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = sessionStorage.getItem('aasiraCurrentUser');
      if (savedUser && authApi.isAuthenticated()) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Error loading user:', e);
    }
    return null;
  });

  const [activePage, setActivePage] = useState<Page>('courses');

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('aasiraCurrentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('aasiraCurrentUser');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActivePage('courses');
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    sessionStorage.clear();
  };

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'courses':
        return <CoursesView currentUser={currentUser} />;
      case 'glossary':
        return <GlossaryView />;
      case 'organizations':
        return <OrganizationsView currentUser={currentUser} />;
      case 'study_material':
        return <StudyMaterialView />;
      default:
        return <CoursesView currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-nexus-sky font-sans text-nexus-brown">
      <Header activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-nexus-brown/60 text-sm">
        <p>&copy; {new Date().getFullYear()} Aasira Learning. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;