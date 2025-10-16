import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import PlayerCard from './PlayerCard';

const DraggablePlayerCard = ({ 
  id, 
  player, 
  isSelected = false, 
  isAvailable = true, 
  onClick,
  size = 'normal',
  onField = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: id,
    data: {
      type: 'player',
      player: player,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  } : {};

  // When rendering on the pitch, render a minimal card to guarantee cleanliness
  if (onField) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
      >
        <div className={`player-card on-field ${isDragging ? 'dragging' : ''}`} onClick={onClick}>
          <img
            src={player?.image || '/images/players/default-player.png'}
            alt={player?.name || 'player'}
            className="field-player-pure-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Yjc3YmUiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <PlayerCard
        player={player}
        isSelected={isSelected}
        isAvailable={isAvailable}
        onClick={onClick}
        size={size}
        isDragging={isDragging}
        onField={false}
      />
    </div>
  );
};

export default DraggablePlayerCard;