import React, { useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import SchedulePage from './pages/SchedulePage';
import DashboardPage from './pages/DashboardPage';
import PlayersPage from './pages/PlayersPage';
import AccountPage from './pages/AccountPage';
import PrizesPage from './pages/PrizesPage';
import './App.css';
import SplashScreen from './components/SplashScreen';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <SchedulePage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'players':
        return <PlayersPage />;
      case 'prizes':
        return <PrizesPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        {(() => {
          const Router = process.env.NODE_ENV === 'production' ? HashRouter : BrowserRouter;
          return (
        <Router>
          <div className="App">
            {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
                      {renderContent()}
                    </MainLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
          );
        })()}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
