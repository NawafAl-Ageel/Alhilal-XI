import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import PlayerSlot from './PlayerSlot';

const DroppablePlayerSlot = ({ id, slotId, onClick }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      type: 'slot',
      slotId: slotId,
    },
  });

  const style = {
    backgroundColor: isOver ? 'rgba(51, 153, 255, 0.3)' : undefined,
    transform: isOver ? 'scale(1.05)' : undefined,
    transition: 'all 0.2s ease',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PlayerSlot slotId={slotId} onClick={onClick} />
    </div>
  );
};

export default DroppablePlayerSlot;