import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CoursesView } from './views/CoursesView';
import { GlossaryView } from './views/GlossaryView';
import { OrganizationsView } from './views/OrganizationsView';
import { StudyMaterialView } from './views/StudyMaterialView';
import { LoginView } from './views/LoginView';
import type { User } from './types';
import { seedInitialUsers } from './data';


export type Page = 'courses' | 'glossary' | 'organizations' | 'study_material';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('aasiraCurrentUser');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
    return null;
  });

  const [activePage, setActivePage] = useState<Page>('courses');

  useEffect(() => {
    // Seed initial users for demonstration purposes if they don't exist
    seedInitialUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aasiraCurrentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aasiraCurrentUser');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActivePage('courses'); // Go to default page on login
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
