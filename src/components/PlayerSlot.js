import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './PlayerSlot.css';

const PlayerSlot = ({ slotId, onClick }) => {
  const { t } = useLanguage();
  
  // Display simplified position label (CB for CB1/CB2)
  const getDisplayPosition = (slotId) => {
    if (slotId === 'CB1' || slotId === 'CB2') return 'CB';
    if (slotId === 'LST' || slotId === 'RST') return 'ST';
    return slotId;
  };
  
  const getPositionName = (slotId) => {
    const positions = {
      'GK': t('goalkeeper'),
      'LB': t('left_back'),
      'CB': t('centre_back'),
      'CB1': t('centre_back'),
      'CB2': t('centre_back'),
      'RB': t('right_back'),
      'LCB': t('left_centre_back'),
      'RCB': t('right_centre_back'),
      'LWB': t('left_wing_back'),
      'RWB': t('right_wing_back'),
      'CDM': t('defensive_mid'),
      'CM': t('centre_mid'),
      'LCM': t('left_centre_mid'),
      'RCM': t('right_centre_mid'),
      'LCDM': t('left_defensive_mid'),
      'RCDM': t('right_defensive_mid'),
      'CAM': t('attacking_mid'),
      'LAM': t('left_attacking_mid'),
      'RAM': t('right_attacking_mid'),
      'LM': t('left_mid'),
      'RM': t('right_mid'),
      'LW': t('left_wing'),
      'RW': t('right_wing'),
      'ST': t('striker'),
      'LST': t('left_striker'),
      'RST': t('right_striker'),
      'CF': t('centre_forward')
    };
    return positions[slotId] || slotId;
  };

  return (
    <div 
      className="player-slot"
      onClick={onClick}
      title={`${t('click_to_select')} ${getPositionName(slotId)}`}
    >
      <div className="slot-content">
        <div className="slot-icon">+</div>
        <div className="slot-position">{getDisplayPosition(slotId)}</div>
      </div>
      
      <div className="slot-tooltip">
        {t('click_to_select')} {getPositionName(slotId)}
      </div>
    </div>
  );
};

export default PlayerSlot;