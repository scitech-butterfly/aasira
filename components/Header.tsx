import React, { useState } from 'react';
import type { Page } from '../App';

interface HeaderProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  children: React.ReactNode;
  isMobile?: boolean;
}> = ({ page, activePage, onClick, children, isMobile = false }) => {
  const isActive = page === activePage;
  const baseClasses = `font-medium transition-colors duration-300`;
  const mobileClasses = `block px-3 py-2 rounded-md text-base`;
  const desktopClasses = `px-4 py-2 text-sm md:text-base rounded-md`;

  const activeClasses = `bg-nexus-pink text-white`;
  const inactiveClasses = `text-nexus-purple hover:bg-nexus-light-blue/50`;

  return (
    <button
      onClick={() => onClick(page)}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </button>
  );
};


export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-nexus-purple">Aasira</div>
          </div>
          <div className="hidden md:block">
            <nav className="flex items-center space-x-4">
              <NavLink page="courses" activePage={activePage} onClick={handleNavClick}>Courses</NavLink>
              <NavLink page="glossary" activePage={activePage} onClick={handleNavClick}>Glossary</NavLink>
              <NavLink page="organizations" activePage={activePage} onClick={handleNavClick}>Organizations</NavLink>
              <NavLink page="study_material" activePage={activePage} onClick={handleNavClick}>Study Material</NavLink>
              <button onClick={handleLogoutClick} className="px-4 py-2 text-sm md:text-base font-medium rounded-md transition-colors duration-300 text-nexus-purple hover:bg-red-100">
                Logout
              </button>
            </nav>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-nexus-purple hover:bg-nexus-light-blue/50 focus:outline-none"
              aria-label="Main menu"
              aria-expanded="false"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink page="courses" activePage={activePage} onClick={handleNavClick} isMobile>Courses</NavLink>
            <NavLink page="glossary" activePage={activePage} onClick={handleNavClick} isMobile>Glossary</NavLink>
            <NavLink page="organizations" activePage={activePage} onClick={handleNavClick} isMobile>Organizations</NavLink>
            <NavLink page="study_material" activePage={activePage} onClick={handleNavClick} isMobile>Study Material</NavLink>
             <button onClick={handleLogoutClick} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-nexus-purple hover:bg-red-100">
                Logout
              </button>
          </div>
        </div>
      )}
    </header>
  );
};