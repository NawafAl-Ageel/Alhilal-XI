import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getPlayersByCategory } from '../data/playerAPI';
import SquadStatus from './SquadStatus';
import CategoryTabs from './CategoryTabs';
import AutoFillButtons from './AutoFillButtons';
import PlayersGrid from './PlayersGrid';
import './OrganizedPlayerPanel.css';

const OrganizedPlayerPanel = ({ 
  selectedPlayers, 
  benchPlayers, 
  onPlayerSelect,
  onBenchPlayerAdd,
  onBenchPlayerRemove,
  onAutoFill,
  formation = '4-3-3' // Add formation prop to help with auto-assignment
}) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('goalkeepers');
  const playerCategories = getPlayersByCategory();

  const categories = [
    { key: 'goalkeepers', label: language === 'ar' ? 'حراس المرمى' : 'Goalkeepers' },
    { key: 'defenders', label: language === 'ar' ? 'المدافعون' : 'Defenders' },
    { key: 'midfielders', label: language === 'ar' ? 'لاعبو الوسط' : 'Midfielders' },
    { key: 'strikers', label: language === 'ar' ? 'المهاجمون' : 'Strikers' }
  ];

  const isPlayerSelected = (player) => {
    return Object.values(selectedPlayers).some(p => p?.id === player.id);
  };

  const isPlayerOnBench = (player) => {
    return benchPlayers.some(p => p.id === player.id);
  };

  const isPlayerAvailable = (player) => {
    return !isPlayerSelected(player) && !isPlayerOnBench(player);
  };

  const getAvailableSlotForPlayer = (player) => {
    // Simple formation slot mapping for auto-assignment
    const formationSlots = {
      '4-3-3': {
        'GK': ['GK'],
        'CB': ['CB1', 'CB2'], 
        'LB': ['LB'],
        'RB': ['RB'],
        'CDM': ['CDM'],
        'CM': ['LCM', 'RCM'],
        'LW': ['LW'],
        'RW': ['RW'], 
        'ST': ['ST']
      }
    };
    
    const slots = formationSlots[formation] || formationSlots['4-3-3'];
    const playerPositions = [player.position, ...(player.alternativePositions || [])];
    
    // Find the first available slot that matches player's positions
    for (const pos of playerPositions) {
      const availableSlots = slots[pos] || [];
      for (const slotId of availableSlots) {
        if (!selectedPlayers[slotId]) {
          return slotId;
        }
      }
    }
    
    // If no perfect match, find any available slot
    const allSlots = Object.values(slots).flat();
    return allSlots.find(slotId => !selectedPlayers[slotId]);
  };

  const handlePlayerClick = (player) => {
    // Disabled: selection from right panel is not allowed.
    // Flow should be: 1) click position on field, 2) pick player from modal.
    return;
  };

  const getSelectedCount = () => {
    return Object.keys(selectedPlayers).length;
  };

  const canAutoFill = () => {
    return getSelectedCount() < 11;
  };

  const getPlayerCounts = () => {
    return {
      goalkeepers: playerCategories.goalkeepers?.length || 0,
      defenders: playerCategories.defenders?.length || 0,
      midfielders: playerCategories.midfielders?.length || 0,
      strikers: playerCategories.strikers?.length || 0
    };
  };

  return (
    <div className="organized-player-panel">
      <SquadStatus 
        selectedCount={getSelectedCount()}
        benchCount={benchPlayers.length}
      />

      <AutoFillButtons 
        canAutoFill={canAutoFill()}
        onAutoFill={onAutoFill}
      />

      <CategoryTabs 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        playerCounts={getPlayerCounts()}
      />

      <PlayersGrid 
        players={playerCategories[activeCategory] || []}
        activeCategory={activeCategory}
        categories={categories}
        isPlayerSelected={isPlayerSelected}
        isPlayerOnBench={isPlayerOnBench}
        isPlayerAvailable={isPlayerAvailable}
        onPlayerClick={handlePlayerClick}
        disableSelection={true}
      />
    </div>
  );
};

export default OrganizedPlayerPanel;