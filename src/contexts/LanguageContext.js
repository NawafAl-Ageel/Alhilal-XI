import React, { createContext, useContext, useState } from 'react';
import { arabicTranslations } from '../translations/arabic';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar'); // Default to Arabic
  const [translations, setTranslations] = useState(arabicTranslations);

  const switchLanguage = (lang) => {
    setLanguage(lang);
    if (lang === 'ar') {
      setTranslations(arabicTranslations);
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
    } else {
      // English translations can be added later
      setTranslations({}); // Will fallback to English keys
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    }
  };

  const t = (key) => {
    return translations[key] || key;
  };

  const value = {
    language,
    switchLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};