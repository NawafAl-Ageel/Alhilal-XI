import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔧 LoginPage: Form submitted', { isLogin, email });
    
    if (!isLogin && password !== confirmPassword) {
      return setError(t('passwords_not_match'));
    }

    try {
      setError('');
      setLoading(true);
      
      if (isLogin) {
        console.log('🔧 LoginPage: Attempting login');
        await login(email, password);
      } else {
        console.log('🔧 LoginPage: Attempting signup');
        await signup(email, password);
      }
      
      console.log('✅ LoginPage: Authentication successful');
      navigate('/');
    } catch (error) {
      console.error('❌ LoginPage: Authentication failed', error);
      
      // Handle specific error messages
      let errorMessage = t(isLogin ? 'failed_to_sign_in' : 'failed_to_create_account');
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'البريد الإلكتروني غير صحيح';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'المستخدم غير موجود';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور ضعيفة جداً';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="login-bg">
        <div className="login-form-container">
          <div className="brand-header">
            <h1 className="brand-title">{t('al_hilal')}</h1>
            <h2 className="brand-subtitle">{t('squad_manager')}</h2>
            <p className="brand-description">{t('powered_by_tawuniya')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <h3 className="form-title">{isLogin ? t('welcome_back') : t('join_the_squad')}</h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label className="input-label" htmlFor="email">{t('email')}</label>
              <input
                id="email"
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="password">{t('password')}</label>
              <input
                id="password"
                type="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label className="input-label" htmlFor="confirm">{t('confirm_password')}</label>
                <input
                  id="confirm"
                  type="password"
                  placeholder={t('confirm_password')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  required
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-100"
            >
              {loading ? t('processing') : (isLogin ? t('sign_in') : t('sign_up'))}
            </button>
            
            <div className="form-switch">
              <p>
                {isLogin ? t('dont_have_account') : t('already_have_account')}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="link-button"
                >
                  {isLogin ? t('sign_up') : t('sign_in')}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;