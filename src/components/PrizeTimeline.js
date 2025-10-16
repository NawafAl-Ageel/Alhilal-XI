import React, { useMemo } from 'react';
import { prizeTiers } from '../data/prizes';
import { useLanguage } from '../contexts/LanguageContext';
import './PrizeTimeline.css';

const PrizeTimeline = ({ totalPoints = 0 }) => {
  const { language } = useLanguage();

  // Flatten all levels into a single ordered array
  const allLevels = useMemo(() => {
    const levels = [];
    prizeTiers.forEach(tier => {
      tier.levels.forEach(level => {
        levels.push({
          ...level,
          tierName: language === 'ar' ? tier.nameAr : tier.name,
          tierId: tier.id
        });
      });
    });
    return levels.sort((a, b) => a.pointsRequired - b.pointsRequired);
  }, [language]);

  const maxPoints = allLevels[allLevels.length - 1]?.pointsRequired || 600;
  const progressWidth = Math.min(100, (totalPoints / maxPoints) * 100);

  return (
    <div className="prize-timeline-container">
      <div className="timeline-header">
        <div className="current-points">
          <span className="points-number">{totalPoints}</span>
          <span className="points-label">{language === 'ar' ? 'نقطة' : 'Points'}</span>
        </div>
        <div className="max-points">
          {language === 'ar' ? `من ${maxPoints}` : `of ${maxPoints}`}
        </div>
      </div>

      <div className="timeline-bar">
        <div className="timeline-track">
          <div 
            className="timeline-progress" 
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        
        <div className="milestones">
          {allLevels.map((level, index) => {
            const position = (level.pointsRequired / maxPoints) * 100;
            const isCompleted = totalPoints >= level.pointsRequired;
            const isCurrent = !isCompleted && (index === 0 || totalPoints >= allLevels[index - 1]?.pointsRequired);
            
            return (
              <div
                key={level.level}
                className={`milestone ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                style={{ left: `${position}%` }}
              >
                <div className="milestone-dot">
                  <div className="milestone-icon">
                    {level.rewards[0].type === 'digital_badge' && '🏆'}
                    {level.rewards[0].type === 'partner_service' && <img src="/images/prizes-images/jahez.png" alt="Jahez" />}
                    {level.rewards[0].type === 'physical' && '📦'}
                  </div>
                </div>
                <div className="milestone-info">
                  <div className="milestone-points">
                    {level.pointsRequired}
                  </div>
                  <div className="milestone-rewards">
                    {level.rewards.map(reward => (
                      <div key={reward.id} className="reward-preview">
                        <div className="reward-name">
                          {language === 'ar' ? reward.nameAr : reward.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default PrizeTimeline;


