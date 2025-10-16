import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './PlayerSelectionModal.css';

const PlayerSelectionModal = ({ 
  isOpen, 
  onClose, 
  position, 
  availablePlayers, 
  onSelectPlayer 
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const getPositionName = (pos) => {
    const positions = {
      'GK': language === 'ar' ? 'حارس مرمى' : 'Goalkeeper',
      'LB': language === 'ar' ? 'ظهير أيسر' : 'Left Back',
      'CB': language === 'ar' ? 'قلب دفاع' : 'Centre Back',
      'RB': language === 'ar' ? 'ظهير أيمن' : 'Right Back',
      'LCB': language === 'ar' ? 'قلب دفاع أيسر' : 'Left Centre Back',
      'RCB': language === 'ar' ? 'قلب دفاع أيمن' : 'Right Centre Back',
      'LWB': language === 'ar' ? 'ظهير جناح أيسر' : 'Left Wing Back',
      'RWB': language === 'ar' ? 'ظهير جناح أيمن' : 'Right Wing Back',
      'CDM': language === 'ar' ? 'وسط دفاعي' : 'Defensive Midfielder',
      'CM': language === 'ar' ? 'وسط' : 'Central Midfielder',
      'LCM': language === 'ar' ? 'وسط أيسر' : 'Left Central Midfielder',
      'RCM': language === 'ar' ? 'وسط أيمن' : 'Right Central Midfielder',
      'CAM': language === 'ar' ? 'وسط هجومي' : 'Attacking Midfielder',
      'LM': language === 'ar' ? 'وسط أيسر' : 'Left Midfielder',
      'RM': language === 'ar' ? 'وسط أيمن' : 'Right Midfielder',
      'LW': language === 'ar' ? 'جناح أيسر' : 'Left Winger',
      'RW': language === 'ar' ? 'جناح أيمن' : 'Right Winger',
      'ST': language === 'ar' ? 'مهاجم' : 'Striker',
      'CF': language === 'ar' ? 'مهاجم صريح' : 'Centre Forward'
    };
    return positions[pos] || pos;
  };

  const filteredPlayers = availablePlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{language === 'ar' ? 'اختر لاعب' : 'Select Player'}</h3>
          <span className="position-label">{getPositionName(position)}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-search">
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن لاعب...' : 'Search player...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="modal-body">
          {filteredPlayers.length > 0 ? (
            <div className="players-list">
              {filteredPlayers.map(player => (
                <div
                  key={player.id}
                  className="player-item"
                  onClick={() => {
                    onSelectPlayer(player);
                    onClose();
                  }}
                >
                  <div className="player-avatar">
                    <img
                      src={player.image || `/players_images/${player.category}/${player.nameEn.replace(/\s+/g, '_')}_${player.position}.png`}
                      alt={player.name}
                      onError={(e) => {
                        e.target.src = '/images/players/default-player.png';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="player-info">
                    <div className="player-name">{language === 'ar' ? player.name : player.nameEn}</div>
                    <div className="player-position">{player.position}</div>
                    <span className="player-number">#{player.number}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-players">
              <p>{language === 'ar' ? 'لا يوجد لاعبون متاحون' : 'No available players'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;

