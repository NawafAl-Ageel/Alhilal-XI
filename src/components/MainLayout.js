import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MainLayout.css';
import { loadUserProfile } from '../services/profileService';

const MainLayout = ({ activeTab, onTabChange, children }) => {
  const { currentUser, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) { setFirstName(''); return; }
      try {
        const p = await loadUserProfile(currentUser.uid);
        setFirstName(p?.firstName || '');
      } catch {}
    };
    load();
  }, [currentUser]);

  // Ensure sidebar is open by default on desktop, hidden on mobile
  useEffect(() => {
    const update = () => {
      const isDesktop = window.innerWidth > 1024;
      setSidebarOpen(isDesktop);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className={`main-layout ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Sidebar - toggleable */}
      <button 
        className={`sidebar-toggle ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(prev => !prev)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>
      <div className={`sidebar-container ${sidebarOpen ? 'visible' : ''}`}
           onClick={() => setSidebarOpen(false)}>
        <div className="sidebar-sheet" onClick={(e) => e.stopPropagation()}>
          <Sidebar activeTab={activeTab} onTabChange={(id) => { onTabChange(id); setSidebarOpen(false); }} />
        </div>
      </div>
      
      {/* Main Content - Always pushed to the right of sidebar */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
          </div>
          <div className="header-right">
            {currentUser ? (
              <div className="user-section">
                <span className="user-welcome">
                  {language === 'ar' ? (firstName ? `💙هلا ${firstName}` : 'هلا') : (firstName ? `💙Hi ${firstName}` : 'Hi')}
                </span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  {language === 'ar' ? 'تسجيل خروج' : 'Logout'}
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleLogin}>
                {language === 'ar' ? 'تسجيل دخول' : 'Login'}
              </button>
            )}
          </div>
        </header>
        
        {/* Key by activeTab to retrigger mount + entry animation on tab change */}
        <div key={activeTab} className="content-wrapper content-enter content-gamified">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;