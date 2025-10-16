import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SquadStatus = ({ selectedCount, benchCount }) => {
  const { language } = useLanguage();

  return (
    <div className="squad-status">
      <div className="status-item">
        <span className="status-label">
          {language === 'ar' ? 'التشكيلة الأساسية:' : 'Starting Formation:'}
        </span>
        <span className="status-value">{selectedCount}/11</span>
      </div>
      <div className="status-item">
        <span className="status-label">
          {language === 'ar' ? 'دكة البدلاء:' : 'Bench:'}
        </span>
        <span className="status-value">{benchCount}/12</span>
      </div>
    </div>
  );
};

export default SquadStatus;