import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { uploadUserAvatar, loadUserProfile, saveUserProfile } from '../services/profileService';

const AccountPage = () => {
  const { language, switchLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const [photoURL, setPhotoURL] = useState('/images/user-avatar.png');
  const [avatarEmpty, setAvatarEmpty] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    emailUpdates: false
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    favoritePosition: ''
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const init = async () => {
      if (!currentUser) return;
      try {
        const profile = await loadUserProfile(currentUser.uid);
        if (profile?.photoURL) {
          setPhotoURL(profile.photoURL);
          setAvatarEmpty(false);
        } else {
          setAvatarEmpty(true);
        }
        if (profile) {
          setProfile(prev => ({
            ...prev,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            favoritePosition: profile.favoritePosition || ''
          }));
          if (typeof profile.emailUpdates === 'boolean') {
            setSettings({ emailUpdates: profile.emailUpdates });
          }
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };
    init();
  }, [currentUser]);

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    try {
      setUploading(true);
      const url = await uploadUserAvatar(currentUser.uid, file);
      setPhotoURL(url);
      setAvatarEmpty(false);
    } catch (err) {
      console.error('Avatar upload failed', err);
      alert(language === 'ar' ? 'فشل رفع الصورة' : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    const first = (profile.firstName || '').trim();
    const last = (profile.lastName || '').trim();
    if (first || last) {
      return `${first.charAt(0) || ''}${last.charAt(0) || ''}`.toUpperCase() || 'U';
    }
    const email = currentUser?.email || '';
    return (email.charAt(0) || 'U').toUpperCase();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
        </h1>
        <p className="page-subtitle">
          {language === 'ar' 
            ? 'إدارة حسابك وتفضيلات التطبيق' 
            : 'Manage your account and application preferences'
          }
        </p>
      </div>

      <div className="content-grid two-column">
        {/* Profile Settings */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </h2>
          </div>
          
          <div className="profile-section">
            <div className={`profile-avatar ${avatarEmpty ? 'empty' : ''}`}>
              {!avatarEmpty ? (
                <img src={photoURL} alt="Profile" onError={() => setAvatarEmpty(true)} />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials()}
                </div>
              )}
              <label className="avatar-edit-btn" htmlFor="avatar-input" title={language === 'ar' ? 'تغيير الصورة' : 'Change photo'}>
                {uploading ? '…' : '✎'}
              </label>
              <input id="avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={onAvatarChange} />
            </div>
            
            <div className="profile-info">
              <div className="form-group">
                <label>{language === 'ar' ? 'الاسم' : 'Name'}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder={language === 'ar' ? 'الاسم الأول' : 'First name'}
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder={language === 'ar' ? 'اسم العائلة' : 'Last name'}
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                <input type="email" defaultValue={currentUser?.email} readOnly/>
              </div>
              <div className="form-group">
                <label>{language === 'ar' ? 'رقم الجوال' : 'Phone'}</label>
                <input type="tel" value={profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>{language === 'ar' ? 'المركز المفضل' : 'Favorite Position'}</label>
                <select value={profile.favoritePosition} onChange={(e) => handleProfileChange('favoritePosition', e.target.value)}>
                  <option value="">{language === 'ar' ? 'اختر' : 'Select'}</option>
                  <option value="GK">GK</option>
                  <option value="DEF">DEF</option>
                  <option value="MID">MID</option>
                  <option value="FWD">FWD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
            </h2>
          </div>
          
          <div className="settings-list">
            {/* Interface Language */}
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">
                  {language === 'ar' ? 'لغة الواجهة' : 'Interface Language'}
                </span>
                <span className="setting-desc">
                  {language === 'ar' ? 'اختر العربية أو الإنجليزية' : 'Choose Arabic or English'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select value={language} onChange={(e) => switchLanguage(e.target.value)}>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">
                  {language === 'ar' ? 'تحديثات البريد' : 'Email Updates'}
                </span>
                <span className="setting-desc">
                  {language === 'ar' ? 'تلقي التحديثات عبر البريد' : 'Receive updates via email'}
                </span>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.emailUpdates}
                  onChange={() => handleSettingChange('emailUpdates')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="content-card" style={{ marginTop: '24px' }}>
        <div className="account-actions">
          <button className="btn btn-primary" onClick={async () => {
            try {
              if (!currentUser) return;
              await saveUserProfile(currentUser.uid, {
                ...profile,
                emailUpdates: settings.emailUpdates
              });
              alert(language === 'ar' ? '✅ تم حفظ الحساب' : '✅ Account saved');
            } catch (e) {
              console.error(e);
              alert(language === 'ar' ? '❌ تعذر حفظ الحساب' : '❌ Failed to save account');
            }
          }}>
            {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
          </button>
          {/* Removed test reset button */}
          <button className="btn" style={{ backgroundColor: '#e74c3c', color: 'white' }}>
            {language === 'ar' ? 'تسجيل خروج' : 'Sign Out'}
          </button>
        </div>
      </div>

      <style>{`
        .profile-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        
        .profile-avatar {
          position: relative;
          width: 80px;
          height: 80px;
        }
        
        .profile-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-avatar.empty {
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #e3f2fd, #bbdefb);
          border: 2px dashed rgba(0, 102, 204, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.2rem;
          color: #0d47a1;
        }
        
        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: #0066cc;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        
        .profile-info {
          width: 100%;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: inherit;
        }
        
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }
        
        .setting-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .setting-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
        }
        
        .setting-desc {
          font-size: 0.8rem;
          color: #666;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.2s;
          border-radius: 24px;
        }
        
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.2s;
          border-radius: 50%;
        }
        
        input:checked + .toggle-slider {
          background-color: #0066cc;
        }
        
        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }
        
        .account-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          .content-grid.two-column {
            grid-template-columns: 1fr;
          }
          
          .account-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountPage;