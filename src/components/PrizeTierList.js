import React from 'react';
import { prizeTiers } from '../data/prizes';
import { useLanguage } from '../contexts/LanguageContext';
import './PrizeTierList.css';

const PrizeTierList = () => {
  const { language } = useLanguage();
  return (
    <div className="prize-tier-list">
      {prizeTiers.map(tier => (
        <div key={tier.id} className="tier-card">
          <div className="tier-header">
            <div className="tier-name">{language === 'ar' ? (tier.nameAr || tier.name) : tier.name}</div>
          </div>
          <div className="tier-levels">
            {tier.levels.map(level => (
              <div key={level.level} className="level-item">
                <div className="level-meta">
                  <div className="level-badge">{language === 'ar' ? `م${level.level}` : `L${level.level}`}</div>
                  <div className="points-required">{level.pointsRequired} {language === 'ar' ? 'نقطة' : 'pts'}</div>
                </div>
                <div className="rewards">
                  {level.rewards.map(r => (
                    <div key={r.id} className="reward">
                      <div className="reward-image small" style={{ backgroundImage: `url(${r.imageUrl})` }} />
                      <div className="reward-text">
                        <div className="reward-name">{language === 'ar' ? (r.nameAr || r.name) : r.name}</div>
                        <div className="reward-desc">{language === 'ar' ? (r.descAr || r.description) : r.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrizeTierList;


