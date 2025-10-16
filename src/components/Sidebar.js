import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Sidebar.css';

const Sidebar = ({ activeTab, onTabChange }) => {
  const { language } = useLanguage();

  const navigationItems = [
    {
      id: 'schedule',
      label: language === 'ar' ? 'الجدولة' : 'Schedule',
      icon: '/images/icons/schedule.png',
      description: language === 'ar' ? 'جدول المباريات وبناء التشكيلات' : 'Match Schedule & Squad Builder'
    },
    {
      id: 'dashboard',
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard',
      icon: '/images/icons/dashboard.png',
      description: language === 'ar' ? 'الإحصائيات والمعلومات' : 'Statistics & Info'
    },
    {
      id: 'players',
      label: language === 'ar' ? 'اللاعبون' : 'Players',
      icon: '/images/icons/players.png',
      description: language === 'ar' ? 'إدارة اللاعبين' : 'Player Management'
    },
    {
      id: 'account',
      label: language === 'ar' ? 'الحساب' : 'Account',
      icon: '/images/icons/account.png',
      description: language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'
    }
  ];

  return (
    <div className={`sidebar ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Enhanced Brand Header */}
      <div className="sidebar-header">
        <div className="brand-container">
          {/* Clean Al-Hilal Logo with Text Logo */}
          <div className="main-brand">
            <img src="/images/text-logo-blue2.png" alt="Squad Manager" className="text-logo" />
            <img src="/images/clubs-images/saudi-arabia_al-hilal.svg" alt="Al Hilal" className="alhilal-logo" />
          </div>
          
          {/* Minimal Separator */}
          <div className="brand-separator"></div>
          
          {/* Compact Powered by Tawuniya */}
          <div className="powered-by">
            <img src="/images/tawuniya-logo.png" alt="Tawuniya" className="tawuniya-logo" />
            <span className="powered-text">Powered by</span>
          </div>
        </div>
      </div>

      {/* Enhanced User Card */}
      <div className="user-card">
        <div className="user-avatar">
          <span style={{color: 'white', fontSize: '14px', fontWeight: '600'}}>
            {language === 'ar' ? 'م.ف' : 'TM'}
          </span>
        </div>
        <div className="user-info">
          <h4 className="user-name">{language === 'ar' ? 'مدير الفريق' : 'Team Manager'}</h4>
          <p className="user-role">{language === 'ar' ? 'الهلال' : 'Al-Hilal'}</p>
        </div>
        <div className="user-status">
          <div className="status-dot active"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">
            {language === 'ar' ? 'الإدارة' : 'Management'}
          </h3>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon && <img src={item.icon} alt={item.label} className={`nav-icon ${item.id === 'prizes' ? 'trophy-icon' : ''} ${item.id === 'schedule' ? 'schedule-icon' : ''}`} />}
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                <span className="nav-description">{item.description}</span>
              </div>
              <div className="nav-indicator"></div>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="footer-text">
            {language === 'ar' ? '© 2025 تطوير' : '© 2025 Tawuniya'}
          </p>
          <p className="footer-version">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;