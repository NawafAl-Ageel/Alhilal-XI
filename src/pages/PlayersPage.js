import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PlayerCard from '../components/PlayerCard';
import { getAllPlayers, getPlayersByCategory } from '../data/playerAPI';

const PlayersPage = () => {
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  // Get real Al-Hilal squad data
  const players = getAllPlayers().map(player => ({
    ...player,
    name: language === 'ar' ? player.name : player.nameEn,
    status: 'available'
  }));

  const filterCategories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All', count: players.length },
    { id: 'GK', label: language === 'ar' ? 'حراس' : 'Goalkeepers', count: players.filter(p => p.position === 'GK').length },
    { id: 'DEF', label: language === 'ar' ? 'مدافعون' : 'Defenders', count: players.filter(p => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position)).length },
    { id: 'MID', label: language === 'ar' ? 'وسط' : 'Midfielders', count: players.filter(p => ['CM', 'CDM', 'CAM', 'LM', 'RM', 'LW', 'RW'].includes(p.position)).length },
    { id: 'FWD', label: language === 'ar' ? 'مهاجمون' : 'Forwards', count: players.filter(p => ['ST', 'CF'].includes(p.position)).length }
  ];

  // Selection disabled on this page – view-only catalog

  const filteredPlayers = activeFilter === 'all' 
    ? players 
    : players.filter(player => {
        if (activeFilter === 'GK') return player.position === 'GK';
        if (activeFilter === 'DEF') return ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(player.position);
        if (activeFilter === 'MID') return ['CM', 'CDM', 'CAM', 'LM', 'RM', 'LW', 'RW'].includes(player.position);
        if (activeFilter === 'FWD') return ['ST', 'CF'].includes(player.position);
        return true;
      });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {language === 'ar' ? 'إدارة اللاعبين' : 'Player Management'}
        </h1>
        <p className="page-subtitle">
          {language === 'ar' 
            ? 'إدارة وتنظيم لاعبي الفريق والتشكيلات' 
            : 'Manage and organize team players and formations'
          }
        </p>
        <div className="page-actions"></div>
      </div>

      {/* Filter Tabs */}
      <div className="content-card" style={{ marginBottom: '24px' }}>
        <div className="filter-tabs">
          {filterCategories.map(category => (
            <button
              key={category.id}
              className={`filter-tab ${activeFilter === category.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.id)}
            >
              <span className="tab-label">{category.label}</span>
              <span className="tab-count">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="content-card players-page-card">
        <div className="content-card-header compact">
          <h2 className="card-title">
            {language === 'ar' ? 'قائمة اللاعبين' : 'Players List'}
          </h2>
          <div className="card-actions">
            <span className="players-count">
              {filteredPlayers.length} {language === 'ar' ? 'لاعب' : 'players'}
            </span>
          </div>
        </div>
        
        <div className="players-grid simple">
          {filteredPlayers.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelected={false}
              isAvailable={true}
              onClick={undefined}
              size="normal"
            />
          ))}
        </div>
      </div>

      <style>{`
        .players-page-card {
          border: 1px solid rgba(0,0,0,0.06);
          background: linear-gradient(180deg, #ffffff, #fafbfc);
        }

        .content-card-header.compact {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .filter-tab {
          padding: 12px 16px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
        }
        
        .filter-tab:hover {
          background: rgba(0, 102, 204, 0.05);
          border-color: rgba(0, 102, 204, 0.2);
        }
        
        .filter-tab.active {
          background: #0066cc;
          border-color: #0066cc;
          color: white;
        }
        
        .tab-label {
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .tab-count {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .players-count {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }
        
        .players-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .players-grid.simple .player-card.selected,
        .players-grid.simple .player-card .status-indicators,
        .players-grid.simple .player-card .selection-indicator {
          display: none !important;
        }
        
        @media (max-width: 768px) {
          .players-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }
          
          .filter-tabs {
            flex-direction: column;
          }
          
          .filter-tab {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PlayersPage;