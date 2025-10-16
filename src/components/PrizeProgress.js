import React from 'react';
import { prizeTiers } from '../data/prizes';
import { useLanguage } from '../contexts/LanguageContext';
import './PrizeProgress.css';

const PrizeProgress = ({ totalPoints = 0 }) => {
  const { language } = useLanguage();
  // Flatten levels for a linear progress ladder
  const levels = prizeTiers.flatMap(t => t.levels);
  const nextLevel = levels.find(l => totalPoints < l.pointsRequired) || null;
  const currentLevelIndex = nextLevel ? levels.findIndex(l => l.level === nextLevel.level) - 1 : levels.length - 1;
  const currentLevel = currentLevelIndex >= 0 ? levels[currentLevelIndex] : null;
  const progressToNext = nextLevel
    ? Math.min(100, Math.round((totalPoints / nextLevel.pointsRequired) * 100))
    : 100;

  return (
    <div className="prize-progress">
      <div className="progress-header">
        <div className="points">{totalPoints} {language === 'ar' ? 'نقطة' : 'pts'}</div>
        <div className="next-tier">
          {nextLevel ? (
            <>
              <span className="label">{language === 'ar' ? 'القادم عند' : 'Next at'}</span>
              <strong>{nextLevel.pointsRequired} {language === 'ar' ? 'نقطة' : 'pts'}</strong>
            </>
          ) : (
            <strong>{language === 'ar' ? 'تم الوصول لأعلى مستوى' : 'Max tier reached'}</strong>
          )}
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressToNext}%` }} />
      </div>

      <div className="tier-preview">
        {currentLevel && (
          <div className="current">
            <div className="title">{language === 'ar' ? 'الجائزة الحالية' : 'Current Reward'}</div>
            <div className="reward-list">
              {currentLevel.rewards.map(r => (
                <div key={r.id} className="reward-item">
                  <div className="reward-image" style={{ backgroundImage: `url(${r.imageUrl})` }} />
                  <div className="reward-info">
                    <div className="reward-name">{language === 'ar' ? (r.nameAr || r.name) : r.name}</div>
                    <div className="reward-desc">{language === 'ar' ? (r.descAr || r.description) : r.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {nextLevel && (
          <div className="next">
            <div className="title">{language === 'ar' ? 'الجائزة القادمة' : 'Upcoming Reward'}</div>
            <div className="reward-list">
              {nextLevel.rewards.map(r => (
                <div key={r.id} className="reward-item">
                  <div className="reward-image" style={{ backgroundImage: `url(${r.imageUrl})` }} />
                  <div className="reward-info">
                    <div className="reward-name">{language === 'ar' ? (r.nameAr || r.name) : r.name}</div>
                    <div className="reward-desc">{language === 'ar' ? (r.descAr || r.description) : r.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizeProgress;


