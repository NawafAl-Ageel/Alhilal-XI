import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Header.css';

const Header = ({ user, onLogout, selectedMatch }) => {
  const { t, isRTL } = useLanguage();
  
  return (
    <header className={`app-header ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="header-left">
        <div className="brand">
          <h1 className="brand-title">{t('al_hilal')}</h1>
          <span className="brand-subtitle">{t('squad_manager')}</span>
        </div>
        
        {selectedMatch && (
          <div className="match-info">
            <span className="match-label">{t('next_match')}:</span>
            <span className="match-details">
              {t('vs')} {selectedMatch.opponent} • {selectedMatch.date}
            </span>
          </div>
        )}
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="welcome-text">{t('welcome')}, {user?.email}</span>
        </div>
        
        <button 
          onClick={onLogout}
          className="btn btn-secondary logout-btn"
        >
          {t('logout')}
        </button>
      </div>
    </header>
  );
};

export default Header;