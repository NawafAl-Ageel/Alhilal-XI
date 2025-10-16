import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AutoFillButtons = ({ 
  canAutoFill, 
  onAutoFill
}) => {
  const { language } = useLanguage();

  return (
    <div className="auto-fill-section">
      <button 
        className="auto-fill-btn"
        onClick={onAutoFill}
        disabled={!canAutoFill}
      >
        <span>
          {language === 'ar' ? 'ملء تلقائي للتشكيلة' : 'Auto Fill Squad'}
        </span>
      </button>
    </div>
  );
};

export default AutoFillButtons;