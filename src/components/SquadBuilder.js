import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PlayerSlot from './PlayerSlot';
import PlayerCard from './PlayerCard';
import DraggablePlayerCard from './DraggablePlayerCard';
import DroppablePlayerSlot from './DroppablePlayerSlot';
import CommunityPlayerCard from './CommunityPlayerCard';
import PlayerSelectionModal from './PlayerSelectionModal';
import { getAvailablePlayersForPosition } from '../utils/positionCompatibility';
import './SquadBuilder.css';

const SquadBuilder = ({ 
  formation, 
  selectedPlayers, 
  players, 
  onPlayerSelect, 
  selectedMatch,
  onPlayerRemove,
  isReadOnly = false,
  squadView = 'personal',
  communityData = null
}) => {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Formation configurations
  const formationLayouts = {
    '4-3-3': {
      GK: [{ id: 'GK', position: [50, 90] }],
      DEF: [
        { id: 'LB', position: [15, 70] },
        { id: 'CB1', position: [35, 70] },
        { id: 'CB2', position: [65, 70] },
        { id: 'RB', position: [85, 70] }
      ],
      MID: [
        { id: 'CDM', position: [50, 50] },
        { id: 'LCM', position: [30, 40] },
        { id: 'RCM', position: [70, 40] }
      ],
      FWD: [
        { id: 'LW', position: [20, 20] },
        { id: 'ST', position: [50, 15] },
        { id: 'RW', position: [80, 20] }
      ]
    },
    '4-4-2': {
      GK: [{ id: 'GK', position: [50, 90] }],
      DEF: [
        { id: 'LB', position: [15, 70] },
        { id: 'CB1', position: [35, 70] },
        { id: 'CB2', position: [65, 70] },
        { id: 'RB', position: [85, 70] }
      ],
      MID: [
        { id: 'LM', position: [20, 45] },
        { id: 'LCM', position: [40, 50] },
        { id: 'RCM', position: [60, 50] },
        { id: 'RM', position: [80, 45] }
      ],
      FWD: [
        { id: 'LST', position: [35, 20] },
        { id: 'RST', position: [65, 20] }
      ]
    },
    '3-5-2': {
      GK: [{ id: 'GK', position: [50, 90] }],
      DEF: [
        { id: 'LCB', position: [25, 70] },
        { id: 'CB', position: [50, 75] },
        { id: 'RCB', position: [75, 70] }
      ],
      MID: [
        { id: 'LWB', position: [10, 50] },
        { id: 'LCM', position: [35, 45] },
        { id: 'CDM', position: [50, 50] },
        { id: 'RCM', position: [65, 45] },
        { id: 'RWB', position: [90, 50] }
      ],
      FWD: [
        { id: 'LST', position: [35, 20] },
        { id: 'RST', position: [65, 20] }
      ]
    },
    '4-2-3-1': {
      GK: [{ id: 'GK', position: [50, 90] }],
      DEF: [
        { id: 'LB', position: [15, 70] },
        { id: 'CB1', position: [35, 70] },
        { id: 'CB2', position: [65, 70] },
        { id: 'RB', position: [85, 70] }
      ],
      MID: [
        { id: 'LCDM', position: [40, 55] },
        { id: 'RCDM', position: [60, 55] },
        { id: 'LAM', position: [25, 35] },
        { id: 'CAM', position: [50, 30] },
        { id: 'RAM', position: [75, 35] }
      ],
      FWD: [
        { id: 'ST', position: [50, 15] }
      ]
    },
    '3-4-3': {
      GK: [{ id: 'GK', position: [50, 90] }],
      DEF: [
        { id: 'LCB', position: [25, 70] },
        { id: 'CB', position: [50, 75] },
        { id: 'RCB', position: [75, 70] }
      ],
      MID: [
        { id: 'LM', position: [20, 45] },
        { id: 'LCM', position: [40, 50] },
        { id: 'RCM', position: [60, 50] },
        { id: 'RM', position: [80, 45] }
      ],
      FWD: [
        { id: 'LW', position: [20, 20] },
        { id: 'ST', position: [50, 15] },
        { id: 'RW', position: [80, 20] }
      ]
    },
    '5-3-2': {
      GK: [{ id: 'GK', position: [50, 90] }],
      DEF: [
        { id: 'LWB', position: [10, 65] },
        { id: 'LCB', position: [30, 75] },
        { id: 'CB', position: [50, 78] },
        { id: 'RCB', position: [70, 75] },
        { id: 'RWB', position: [90, 65] }
      ],
      MID: [
        { id: 'LCM', position: [35, 45] },
        { id: 'CM', position: [50, 50] },
        { id: 'RCM', position: [65, 45] }
      ],
      FWD: [
        { id: 'LST', position: [35, 20] },
        { id: 'RST', position: [65, 20] }
      ]
    }
  };

  const currentLayout = formationLayouts[formation] || formationLayouts['4-3-3'];

  const handleSlotClick = (slotId) => {
    if (isReadOnly || squadView === 'community') return;
    
    setSelectedSlot(slotId);
    setModalOpen(true);
  };

  const handlePlayerSelection = (player) => {
    if (onPlayerSelect && selectedSlot) {
      onPlayerSelect(selectedSlot, player);
    }
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handlePlayerClick = (slotId) => {
    if (isReadOnly || squadView === 'community') return;
    
    // Remove player from position
    if (onPlayerRemove) {
      onPlayerRemove(slotId);
    }
  };

  const getAvailablePlayers = () => {
    if (!selectedSlot) return [];
    return getAvailablePlayersForPosition(players, selectedSlot, selectedPlayers);
  };

  const renderPositionLine = (positions, lineClass) => {
    if (!positions || positions.length === 0) {
      return null;
    }
    
    return (
      <div className={`position-line ${lineClass}`}>
        {positions.map((slot, index) => {
          const player = selectedPlayers[slot.id];
          return (
            <div
              key={slot.id}
              className="position-slot"
              style={{
                left: `${slot.position[0]}%`,
                top: `${slot.position[1]}%`,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              {player ? (
                <DraggablePlayerCard 
                  id={player.id}
                  player={player}
                  isSelected={true}
                  size="small"
                  onField={true}
                />
              ) : (
                <DroppablePlayerSlot 
                  id={`slot-${slot.id}`}
                  slotId={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!selectedMatch) {
    return (
      <div className="squad-builder">
        <div className="no-match-selected">
          <h3>{t('select_match_first') || 'Please select a match first'}</h3>
          <p>{t('choose_match_from_schedule') || 'Choose a match from the schedule to build your squad'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="squad-builder">
      <PlayerSelectionModal 
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSlot(null);
        }}
        position={selectedSlot}
        availablePlayers={getAvailablePlayers()}
        onSelectPlayer={handlePlayerSelection}
      />
      
      <div className="field-container">
        <div className="football-field">
          {/* Field markings */}
          <div className="field-markings">
            <div className="center-circle"></div>
            <div className="center-line"></div>
            <div className="penalty-box penalty-box-top"></div>
            <div className="penalty-box penalty-box-bottom"></div>
            <div className="goal-area goal-area-top"></div>
            <div className="goal-area goal-area-bottom"></div>
          </div>
          
          {/* Player positions */}
          <div className="player-positions">
            {/* Render all position slots directly */}
            {Object.keys(currentLayout).map(lineKey => 
              currentLayout[lineKey]?.map(slot => {
                const player = selectedPlayers[slot.id];
                return (
                  <div
                    key={slot.id}
                    className="position-slot"
                    style={{
                      position: 'absolute',
                      left: `${slot.position[0]}%`,
                      top: `${slot.position[1]}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    {squadView === 'community' ? (
                      <CommunityPlayerCard 
                        communityData={communityData ? communityData[slot.id] : null}
                        position={slot.id}
                        size="small"
                      />
                    ) : player ? (
                      <div onClick={() => handlePlayerClick(slot.id)} style={{ cursor: 'pointer' }}>
                        <PlayerCard 
                          player={player}
                          isSelected={true}
                          size="small"
                          onField={true}
                        />
                      </div>
                    ) : (
                      <PlayerSlot 
                        slotId={slot.id}
                        onClick={() => handleSlotClick(slot.id)}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquadBuilder;