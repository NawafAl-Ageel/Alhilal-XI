import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './PlayerCard.css';

const CommunityPlayerCard = ({ 
  communityData, // { player, percentage, votes }
  size = 'small',
  position
}) => {
  const { language } = useLanguage();

  if (!communityData || !communityData.player) {
    return (
      <div className="community-player-card empty">
        <div className="empty-slot">
          <span className="position-label">{position}</span>
          <span className="empty-text">
            {language === 'ar' ? 'لا توجد أصوات' : 'No votes'}
          </span>
        </div>
      </div>
    );
  }

  const { player, percentage, votes } = communityData;

  return (
    <div className="community-player-card">
      <div className="player-image-container">
        <img 
          src={player.image} 
          alt={player.name}
          className="community-player-image"
          onError={(e) => {
            e.target.src = '/images/players/default-player.png';
          }}
        />
        
        {/* Voting Percentage Badge */}
        <div className="voting-badge">
          <span className="percentage">{percentage}%</span>
        </div>
      </div>
      
      <div className="community-player-info">
        <div className="player-name">
          {language === 'ar' ? player.name : player.nameEn}
        </div>
        <div className="voting-stats">
          <span className="votes-count">
            {votes.toLocaleString()} {language === 'ar' ? 'صوت' : 'votes'}
          </span>
        </div>
      </div>
      
      {/* Position Badge */}
      <div className="position-badge-community">
        {position}
      </div>
    </div>
  );
};

export default CommunityPlayerCard;
