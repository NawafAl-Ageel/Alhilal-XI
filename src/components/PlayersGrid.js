import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import DraggablePlayerCard from './DraggablePlayerCard';

const PlayersGrid = ({ 
  players, 
  activeCategory, 
  categories,
  isPlayerSelected,
  isPlayerOnBench,
  isPlayerAvailable,
  onPlayerClick,
  disableSelection = false
}) => {
  const { language } = useLanguage();
  
  const activeCategoryLabel = categories.find(c => c.key === activeCategory)?.label;

  return (
    <div className="players-section">
      <div className="players-grid">
        {players.map(player => {
          if (disableSelection) {
            // Render non-interactive, simple cards in disabled mode
            return (
              <div key={player.id} style={{ pointerEvents: 'none' }}>
                <DraggablePlayerCard 
                  id={player.id}
                  player={player}
                  isSelected={false}
                  isAvailable={true}
                  onClick={undefined}
                />
              </div>
            );
          }

          const isSelected = isPlayerSelected(player);
          const onBench = isPlayerOnBench(player);
          const available = isPlayerAvailable(player);
          
          return (
            <DraggablePlayerCard 
              key={player.id}
              id={player.id}
              player={player}
              isSelected={isSelected}
              isAvailable={available}
              onClick={() => onPlayerClick(player)}
              className={`player-card ${onBench ? 'on-bench' : ''} ${isSelected ? 'in-formation' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlayersGrid;