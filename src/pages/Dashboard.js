import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllPlayers } from '../data/playerAPI';
import { useAlHilalFixtures } from '../hooks/useApiFootball';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import Header from '../components/Header';
import SquadBuilder from '../components/SquadBuilder';
import FormationSelector from '../components/FormationSelector';
import OrganizedPlayerPanel from '../components/OrganizedPlayerPanel';
import TeamLogo from '../components/TeamLogo';
import TournamentLogo from '../components/TournamentLogo';
import localImageService from '../services/localImageService';
import DraggablePlayerCard from '../components/DraggablePlayerCard';
import PlayerCard from '../components/PlayerCard';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // API Integration - Get live Al-Hilal fixtures
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useAlHilalFixtures(3, 5);
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [benchPlayers, setBenchPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showSquadBuilder, setShowSquadBuilder] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use API data with fallback to mock data
  const apiMatches = fixtures.upcoming.length > 0 ? fixtures.upcoming : [
    {
      id: 'fallback-1',
      opponent: 'النصر',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA'),
      time: '20:00',
      venue: 'ملعب الملك فهد الدولي',
      competition: t('saudi_pro_league'),
      opponentLogo: '/images/clubs-images/saudi-arabia_al-nassr.svg'
    }
  ];

  useEffect(() => {
    // Initialize with API match data and real Al-Hilal squad
    setMatches(apiMatches);
    setPlayers(getAllPlayers()); // Use the comprehensive Al-Hilal squad API
    
    // Set first match as selected by default
    if (apiMatches.length > 0) {
      setSelectedMatch(apiMatches[0]);
    }
  }, [fixtures]); // Re-run when fixtures change

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    // Clear previous squad selection when switching matches
    setSelectedPlayers({});
    setBenchPlayers([]);
    // Show squad builder with animation
    setShowSquadBuilder(true);
  };

  const handleFormationChange = (formation) => {
    setSelectedFormation(formation);
    // Clear players when changing formation
    setSelectedPlayers({});
  };

  const handlePlayerSelect = (position, player) => {
    setSelectedPlayers(prev => {
      const updated = { ...prev };
      
      if (player === null) {
        // Remove player from position
        delete updated[position];
      } else {
        // Remove player from any existing position first
        Object.keys(updated).forEach(key => {
          if (updated[key]?.id === player.id) {
            delete updated[key];
          }
        });
        
        // Remove from bench if they were there
        setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
        
        // Add player to new position
        updated[position] = player;
      }
      
      return updated;
    });
  };

  const handleBenchPlayerAdd = (player) => {
    if (benchPlayers.length < 12 && !benchPlayers.some(p => p.id === player.id)) {
      setBenchPlayers(prev => [...prev, player]);
    }
  };

  const handleBenchPlayerRemove = (player) => {
    setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
  };

  const handlePlayerRemove = (positionId, player) => {
    // Remove player from formation and add to bench if there's space
    setSelectedPlayers(prev => {
      const updated = { ...prev };
      delete updated[positionId];
      return updated;
    });
    
    // Add to bench if there's space
    if (benchPlayers.length < 12 && !benchPlayers.some(p => p.id === player.id)) {
      setBenchPlayers(prev => [...prev, player]);
    }
  };

  const handleAutoFill = () => {
    const currentlySelected = Object.keys(selectedPlayers).length;
    if (currentlySelected >= 11) {
      // If formation is full, auto-fill bench instead
      handleAutoFillBench();
      return;
    }

    const availablePlayers = players.filter(player => 
      !Object.values(selectedPlayers).some(p => p?.id === player.id) &&
      !benchPlayers.some(p => p.id === player.id)
    );

    // Define formation slot mappings
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
      },
      '4-4-2': {
        'GK': ['GK'],
        'CB': ['CB1', 'CB2'],
        'LB': ['LB'], 
        'RB': ['RB'],
        'LM': ['LM'],
        'RM': ['RM'],
        'CM': ['LCM', 'RCM'],
        'ST': ['LST', 'RST']
      }
    };

    const slots = formationSlots[selectedFormation] || formationSlots['4-3-3'];
    const newSelectedPlayers = { ...selectedPlayers };
    
    // Auto-fill by position priority
    const positionPriority = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'LM', 'RM', 'LW', 'RW', 'ST'];
    
    for (const position of positionPriority) {
      const availableSlots = slots[position] || [];
      
      for (const slotId of availableSlots) {
        if (!newSelectedPlayers[slotId]) {
          // Find best player for this position
          const suitablePlayer = availablePlayers.find(player => 
            player.position === position || player.alternativePositions?.includes(position)
          );
          
          if (suitablePlayer) {
            newSelectedPlayers[slotId] = suitablePlayer;
            const index = availablePlayers.indexOf(suitablePlayer);
            if (index > -1) availablePlayers.splice(index, 1);
          }
        }
      }
    }
    
    setSelectedPlayers(newSelectedPlayers);
  };

  const handleAutoFillBench = () => {
    const availablePlayers = players.filter(player => 
      !Object.values(selectedPlayers).some(p => p?.id === player.id) &&
      !benchPlayers.some(p => p.id === player.id)
    );

    // Sort players by overall quality (can be enhanced with actual ratings)
    const sortedPlayers = availablePlayers.sort((a, b) => {
      // Simple priority: GK > Defenders > Midfielders > Forwards
      const positionPriority = { 'GK': 4, 'CB': 3, 'LB': 3, 'RB': 3, 'CDM': 2, 'CM': 2, 'LW': 1, 'RW': 1, 'ST': 1 };
      return (positionPriority[b.position] || 0) - (positionPriority[a.position] || 0);
    });

    // Fill bench with best remaining players (up to 12)
    const remainingBenchSlots = 12 - benchPlayers.length;
    const playersToAdd = sortedPlayers.slice(0, remainingBenchSlots);
    
    setBenchPlayers(prev => [...prev, ...playersToAdd]);
  };

  // Drag and drop handlers
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle dragging from bench (IDs start with 'bench-')
    let activePlayer;
    if (active.id.toString().startsWith('bench-')) {
      const actualPlayerId = active.id.toString().replace('bench-', '');
      activePlayer = players.find(p => p.id.toString() === actualPlayerId);
    } else {
      activePlayer = players.find(p => p.id === active.id) || 
                    Object.values(selectedPlayers).find(p => p?.id === active.id);
    }
    
    if (!activePlayer) return;

    // If dropping on a position slot
    if (over.id.startsWith('slot-')) {
      const positionId = over.id.replace('slot-', '');
      const existingPlayer = selectedPlayers[positionId];
      
      // If there's already a player in this position, substitute them
      if (existingPlayer && existingPlayer.id !== activePlayer.id) {
        // Remove the active player from their current position (if any)
        const updatedPlayers = { ...selectedPlayers };
        Object.keys(updatedPlayers).forEach(key => {
          if (updatedPlayers[key]?.id === activePlayer.id) {
            delete updatedPlayers[key];
          }
        });
        
        // Remove active player from bench if they were there
        setBenchPlayers(prev => prev.filter(p => p.id !== activePlayer.id));
        
        // Place new player in position
        updatedPlayers[positionId] = activePlayer;
        
        // Move the substituted player to bench
        setBenchPlayers(prev => {
          if (!prev.some(p => p.id === existingPlayer.id) && prev.length < 12) {
            return [...prev, existingPlayer];
          }
          return prev;
        });
        
        setSelectedPlayers(updatedPlayers);
      } else {
        // Normal placement in empty slot
        handlePlayerSelect(positionId, activePlayer);
      }
    }
    // If dropping on a player in formation (direct substitution)
    else if (over.id && !over.id.startsWith('slot-') && !over.id.startsWith('bench-')) {
      // Find which position the target player is in
      const targetPlayerId = over.id;
      const targetPosition = Object.keys(selectedPlayers).find(
        key => selectedPlayers[key]?.id.toString() === targetPlayerId.toString()
      );
      
      if (targetPosition) {
        const targetPlayer = selectedPlayers[targetPosition];
        
        // Remove active player from their current position and bench
        const updatedPlayers = { ...selectedPlayers };
        Object.keys(updatedPlayers).forEach(key => {
          if (updatedPlayers[key]?.id === activePlayer.id) {
            delete updatedPlayers[key];
          }
        });
        setBenchPlayers(prev => prev.filter(p => p.id !== activePlayer.id));
        
        // Place active player in target position
        updatedPlayers[targetPosition] = activePlayer;
        
        // Move target player to bench
        setBenchPlayers(prev => {
          if (!prev.some(p => p.id === targetPlayer.id) && prev.length < 12) {
            return [...prev, targetPlayer];
          }
          return prev;
        });
        
        setSelectedPlayers(updatedPlayers);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className={`dashboard ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header 
        user={currentUser} 
        onLogout={handleLogout}
        selectedMatch={selectedMatch}
      />
      
      
      <div className="dashboard-main">
        {!showSquadBuilder ? (
          /* Schedule View - Initial State */
          <div className="schedule-container">
            <div className="welcome-section">
              <div className="brand-header">
                <div className="logo-section">
                  <img 
                    src="/images/clubs-images/saudi-arabia_al-hilal.svg" 
                    alt="Al-Hilal" 
                    className="alhilal-logo"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <div className="brand-text">
                    <h1>Al-Hilal Squad Manager</h1>
                    <p>by Tawuniya Insurance</p>
                  </div>
                </div>
              </div>
              
              <div className="schedule-prompt">
                <h2>Select a match to build your squad</h2>
                <p>Choose from upcoming Al-Hilal fixtures</p>
              </div>
            </div>
            
            <div className="matches-grid">
              {matches.map(match => {
                const dateInfo = {
                  day: new Date(match.date).getDate(),
                  month: new Date(match.date).toLocaleDateString('en-US', { month: 'short' }),
                  weekday: new Date(match.date).toLocaleDateString('en-US', { weekday: 'short' })
                };
                
                return (
                  <div 
                    key={match.id}
                    className="match-card-modern"
                    onClick={() => handleMatchSelect(match)}
                  >
                    <div className="match-date-modern">
                      <div className="date-day">{dateInfo.day}</div>
                      <div className="date-month">{dateInfo.month}</div>
                    </div>
                    
                    <div className="match-details-modern">
                      <div className="teams">
                        <div className="home-team">
                          {/* DEBUG: Force simple image to test */}
                          <img 
                            src="/images/clubs-images/saudi-arabia_al-hilal.svg" 
                            alt="Al-Hilal" 
                            className="team-logo" 
                            style={{ width: '32px', height: '32px' }}
                          />
                          <span>Al-Hilal</span>
                        </div>
                        <div className="vs-divider">VS</div>
                        <div className="away-team">
                          <span>{match.opponent}</span>
                          <TeamLogo 
                            teamName={match.opponent} 
                            size={32} 
                            className="opponent-logo-enhanced" 
                          />
                        </div>
                      </div>
                      
                      <div className="match-info-bottom">
                        <div className="time-venue">
                          <span className="time">{match.time}</span>
                          <span className="venue">{match.venue}</span>
                        </div>
                        <div className="competition-badge">
                          <TournamentLogo 
                            tournamentName={match.competition}
                            size={20}
                            className="tournament-badge-logo"
                          />
                          <span>{match.competition}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="match-hover-indicator">
                      <span>Build Squad →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Squad Builder View - After Match Selection */
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="squad-builder-container">
              <div className="squad-header-modern">
                <button 
                  className="back-button"
                  onClick={() => setShowSquadBuilder(false)}
                >
                  ← Back to Schedule
                </button>
                
                <div className="match-info-header">
                  <h2>Squad Builder</h2>
                  <div className="selected-match-info">
                    <span>Al-Hilal vs {selectedMatch?.opponent}</span>
                    <span className="match-date">{selectedMatch?.date} • {selectedMatch?.time}</span>
                  </div>
                </div>
                
                <FormationSelector 
                  selectedFormation={selectedFormation}
                  onFormationChange={handleFormationChange}
                />
              </div>
              
              <div className="squad-content">
                <div className="field-section">
                  <SquadBuilder 
                    formation={selectedFormation}
                    selectedPlayers={selectedPlayers}
                    players={players}
                    onPlayerSelect={handlePlayerSelect}
                    onPlayerRemove={handlePlayerRemove}
                    selectedMatch={selectedMatch}
                  />
                  
                  {/* Minimalist Bench */}
                  {benchPlayers.length > 0 && (
                    <div className="bench-modern">
                      <div className="bench-header">
                        <span>Bench ({benchPlayers.length}/12)</span>
                        {benchPlayers.length < 3 && (
                          <span className="bench-warning-minimal">Min 3 required</span>
                        )}
                      </div>
                      <div className="bench-players">
                        {benchPlayers.map(player => (
                          <DraggablePlayerCard 
                            key={`bench-${player.id}`}
                            id={`bench-${player.id}`}
                            player={player}
                            isSelected={false}
                            isAvailable={true}
                            onClick={() => handleBenchPlayerRemove(player)}
                            size="small"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="players-panel">
                  <OrganizedPlayerPanel 
                    selectedPlayers={selectedPlayers}
                    benchPlayers={benchPlayers}
                    onPlayerSelect={handlePlayerSelect}
                    onBenchPlayerAdd={handleBenchPlayerAdd}
                    onBenchPlayerRemove={handleBenchPlayerRemove}
                    onAutoFill={handleAutoFill}
                    onAutoFillBench={handleAutoFillBench}
                    formation={selectedFormation}
                  />
                </div>
              </div>
            </div>
            
            <DragOverlay>
              {activeId ? (
                <PlayerCard 
                  player={players.find(p => {
                    if (activeId.toString().startsWith('bench-')) {
                      const actualId = activeId.toString().replace('bench-', '');
                      return p.id.toString() === actualId;
                    }
                    return p.id === activeId;
                  }) || Object.values(selectedPlayers).find(p => p?.id === activeId)}
                  isDragging={true}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Dashboard;