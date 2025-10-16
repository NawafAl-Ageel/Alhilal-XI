import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PrizeProgress from '../components/PrizeProgress';
import PrizeTierList from '../components/PrizeTierList';
import PrizeTimeline from '../components/PrizeTimeline';

const PrizesPage = () => {
  const { language } = useLanguage();
  const [userPoints, setUserPoints] = useState(280); // Demo with some progress

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {language === 'ar' ? 'الجوائز' : 'Prizes'}
        </h1>
        <p className="page-subtitle">
          {language === 'ar' ? 'اجمع النقاط خلال الموسم لفتح الجوائز.' : 'Earn points during the season to unlock rewards.'}
        </p>
      </div>

      <div className="content-grid">
        {/* Full width timeline */}
        <div className="content-card full-width">
          <div className="content-card-header">
            <h2 className="card-title">{language === 'ar' ? 'شريط الجوائز' : 'Prize Timeline'}</h2>
          </div>
          <PrizeTimeline totalPoints={userPoints} />
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">{language === 'ar' ? 'تقدمك' : 'Your Progress'}</h2>
          </div>
          <PrizeProgress totalPoints={userPoints} />
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">{language === 'ar' ? 'مستويات الجوائز' : 'Prize Tiers'}</h2>
          </div>
          <PrizeTierList />
        </div>
      </div>

      {/* Demo controls removed */}
    </div>
  );
};

export default PrizesPage;


