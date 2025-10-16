import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import flagService from '../services/flagService';
import './PlayerCard.css';

const PlayerCard = ({ 
  player, 
  isSelected = false, 
  isAvailable = true, 
  onClick,
  size = 'normal', // 'small', 'normal', 'large'
  isDragging = false,
  onField = false
}) => {
  const { t } = useLanguage();
  const handleClick = () => {
    if (onClick && isAvailable) {
      onClick(player);
    }
  };

  const getPositionColor = (position) => {
    if (position === 'GK') return {
      bg: 'linear-gradient(135deg, #ff6b35, #ff8a65)',
      text: '#ffffff',
      shadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
    };
    if (['CB', 'LB', 'RB', 'LCB', 'RCB', 'LWB', 'RWB'].includes(position)) return {
      bg: 'linear-gradient(135deg, #3498db, #5dade2)',
      text: '#ffffff',
      shadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
    };
    if (['CDM', 'CM', 'CAM', 'LM', 'RM', 'LCM', 'RCM'].includes(position)) return {
      bg: 'linear-gradient(135deg, #2ecc71, #58d68d)',
      text: '#ffffff',
      shadow: '0 2px 8px rgba(46, 204, 113, 0.3)'
    };
    return {
      bg: 'linear-gradient(135deg, #e74c3c, #ec7063)',
      text: '#ffffff',
      shadow: '0 2px 8px rgba(231, 76, 60, 0.3)'
    }; // Forwards
  };

  const getFlagEmoji = (nationality) => {
    const flags = {
      'SA': '🇸🇦', 'BR': '🇧🇷', 'PT': '🇵🇹', 'RS': '🇷🇸', 
      'SN': '🇸🇳', 'MA': '🇲🇦', 'FR': '🇫🇷', 'ES': '🇪🇸',
      'AR': '🇦🇷', 'NG': '🇳🇬', 'EG': '🇪🇬', 'TN': '🇹🇳'
    };
    return flags[nationality] || '🏴';
  };

  const getLastName = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.trim().split(' ');
    return nameParts[nameParts.length - 1];
  };

  const positionStyles = getPositionColor(player.position);

  // If player is on field, show only pure image
  if (onField) {
    return (
      <div 
        className={`player-card on-field ${size} ${isDragging ? 'dragging' : ''}`}
        onClick={handleClick}
      >
        <img 
          src={player.image || '/images/players/default-player.png'} 
          alt={player.name}
          className="field-player-pure-image"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Yjc3YmUiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
          }}
        />
      </div>
    );
  }

  // Regular card for panels/bench
  return (
    <div 
      className={`player-card ${size} ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleClick}
    >
      {/* Enhanced Card Header */}
      <div className="card-header">
        <div className="header-background" style={{ background: positionStyles.bg }}></div>
        <div className="header-content">
          {isSelected && (
            <div className="selection-indicator">
              <span>✓</span>
            </div>
          )}
        </div>
      </div>

      <div className="player-image">
        <div className="image-container">
          <img 
            src={player.image || '/images/players/default-player.png'} 
            alt={player.name}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Yjc3YmUiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
            }}
          />
          <div className="image-ring" style={{ borderColor: positionStyles.bg.split(',')[0].split('(')[1] }}></div>
        </div>
        <div 
          className="position-badge-enhanced"
          style={{ 
            background: positionStyles.bg,
            color: positionStyles.text,
            boxShadow: positionStyles.shadow
          }}
        >
          <div className="main-position">{player.position}</div>
          {player.alternativePositions && player.alternativePositions.length > 0 && (
            <div className="alt-positions-inline">
              {player.alternativePositions.slice(0, 2).map((pos, index) => (
                <span key={index} className="alt-pos-mini">{pos}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="player-info">
        <div className="player-name">{getLastName(player.name)}</div>
        
        <div className="player-details">
          <div className="nationality-enhanced">
            {player.nationality && (
              <div className="flag-container">
                <img 
                  src={flagService.getCountryFlag(player.nationality)}
                  alt={flagService.getCountryName(player.nationality)}
                  className="country-flag"
                  onError={(e) => {
                    // Fallback to emoji if flag image not found
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'inline';
                  }}
                />
                <span className="flag-fallback" style={{display: 'none'}}>{getFlagEmoji(player.nationality)}</span>
                <div className="flag-glow"></div>
              </div>
            )}
          </div>
          
        </div>

        {/* Status Indicators */}
        <div className="status-indicators">
          {isSelected && <div className="status-badge selected">Selected</div>}
        </div>
      </div>
      
      {!isAvailable && (
        <div className="unavailable-overlay">
          <div className="overlay-content">
            <span className="unavailable-icon">🚫</span>
            <span>{t('selected')}</span>
          </div>
        </div>
      )}

      {/* Hover Effect Gradient */}
      <div className="hover-gradient"></div>
    </div>
  );
};

export default PlayerCard;