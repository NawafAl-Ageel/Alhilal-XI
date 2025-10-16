import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './MatchSchedule.css';

const MatchSchedule = ({ matches, selectedMatch, onMatchSelect }) => {
  const { t } = useLanguage();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  const getCompetitionColor = (competition) => {
    const colors = {
      [t('saudi_pro_league')]: '#00cc66',
      [t('afc_champions_league')]: '#ff6b35',
      [t('king_cup')]: '#3399ff',
      [t('fifa_club_world_cup')]: '#ffa500',
      [t('super_cup')]: '#9c27b0'
    };
    return colors[competition] || '#3399ff';
  };

  return (
    <div className="match-schedule">
      <div className="schedule-header">
        <h2>{t('al_hilal_schedule')}</h2>
        <p className="schedule-subtitle">{t('select_match_to_build')}</p>
      </div>
      
      <div className="matches-list">
        {matches.map(match => {
          const dateInfo = formatDate(match.date);
          const isSelected = selectedMatch?.id === match.id;
          
          return (
            <div 
              key={match.id}
              className={`match-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onMatchSelect(match)}
            >
              <div className="match-date">
                <div className="date-number">{dateInfo.day}</div>
                <div className="date-details">
                  <div className="month">{dateInfo.month}</div>
                  <div className="weekday">{dateInfo.weekday}</div>
                </div>
              </div>
              
              <div className="match-info">
                <div className="opponent">
                  <span className="vs">{t('vs')}</span>
                  <span className="team-name">{match.opponent}</span>
                </div>
                
                <div className="match-details">
                  <div className="time-venue">
                    <span className="time">{match.time}</span>
                    <span className="venue">{match.venue}</span>
                  </div>
                  
                  <div 
                    className="competition"
                    style={{ color: getCompetitionColor(match.competition) }}
                  >
                    {match.competition}
                  </div>
                </div>
              </div>
              
              <div className="match-status">
                {isSelected && (
                  <div className="selected-indicator">
                    <span>✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {matches.length === 0 && (
        <div className="no-matches">
          <p>{t('no_upcoming_matches')}</p>
          <small>{t('check_back_later')}</small>
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;