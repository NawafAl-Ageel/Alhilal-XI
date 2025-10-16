import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import TournamentLogo from '../components/TournamentLogo';
import '../pages/Dashboard.css'; // Import Dashboard CSS for squad builder styles
import SquadBuilder from '../components/SquadBuilder';
import FormationSelector from '../components/FormationSelector';
import OrganizedPlayerPanel from '../components/OrganizedPlayerPanel';
import DraggablePlayerCard from '../components/DraggablePlayerCard';
import PlayerCard from '../components/PlayerCard';
import { getAllPlayers } from '../data/playerAPI';
import { useAlHilalFixtures, useTeamStats } from '../hooks/useApiFootball';
import getLocalizedTeamName from '../utils/teamNames';
import { useAuth } from '../contexts/AuthContext';
import { saveUserSquad, loadUserSquad, getUserSavedSquadFlags } from '../services/squadService';
import apiFootballService from '../services/apiFootballService';
// Removed drag-and-drop - using click-based selection instead

const SchedulePage = () => {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const [showSquadBuilder, setShowSquadBuilder] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [benchPlayers, setBenchPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [squadView, setSquadView] = useState('personal'); // 'personal' or 'community'
  const [communitySquad, setCommunitySquad] = useState({});
  const [savedFlags, setSavedFlags] = useState({});
  
  // API Integration - Get live Al-Hilal fixtures
  const { fixtures, loading: fixturesLoading, error: fixturesError, refetch: refetchFixtures } = useAlHilalFixtures(5, 10);
  const { stats, loading: statsLoading } = useTeamStats(apiFootballService.currentSeason);

  const handleRefreshFixtures = async () => {
    try {
      // Clear cache and force refresh with current season
      await apiFootballService.forceRefreshCurrentSeason();
      // Refetch the data
      refetchFixtures();
    } catch (error) {
      console.error('Error refreshing fixtures:', error);
    }
  };

  // Prefetch saved flags (Firestore) when fixtures load and user changes
  useEffect(() => {
    const fetchFlags = async () => {
      try {
        if (!currentUser) {
          setSavedFlags({});
          return;
        }
        const allIds = [
          ...fixtures.upcoming.map(m => String(m.id)),
          ...fixtures.recent.map(m => String(m.id))
        ];
        if (allIds.length === 0) {
          setSavedFlags({});
          return;
        }
        const flags = await getUserSavedSquadFlags(currentUser.uid, allIds);
        setSavedFlags(flags);
      } catch (e) {
        console.error('Failed to prefetch saved flags:', e);
      }
    };
    fetchFlags();
  }, [currentUser, fixtures.upcoming, fixtures.recent]);

  const handleDebugAhliMatches = async () => {
    try {
      console.log('🔍 Starting Al-Hilal vs Al-Ahli debug search...');
      await apiFootballService.searchAlHilalVsAlAhli();
    } catch (error) {
      console.error('Error debugging Al-Ahli matches:', error);
    }
  };

  const handleVerifyTeamId = async () => {
    try {
      console.log('🔍 Verifying Al-Hilal team ID...');
      await apiFootballService.verifyAlHilalTeamId();
    } catch (error) {
      console.error('Error verifying team ID:', error);
    }
  };

  // Click-based player selection - no drag and drop needed

  useEffect(() => {
    setPlayers(getAllPlayers());
  }, []);

  // Process API data with enhanced formatting
  const upcomingMatches = fixtures.upcoming.length > 0 ? fixtures.upcoming.map(match => ({
    ...match,
    // Enhanced date formatting (Gregorian calendar with Western Arabic numerals)
    formattedDate: match.date ? new Date(match.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'TBD',
    // Enhanced time formatting
    formattedTime: match.time || 'TBD',
    // Localize opponent name in Arabic mode
    opponent: getLocalizedTeamName(match.opponent, language),
    // Ensure opponent logo fallback
    opponentLogo: match.opponentLogo || `/images/clubs-images/saudi-arabia_${(match.opponent||'').toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`,
    // Competition logo
    competitionLogo: match.competitionLogo || getCompetitionLogo(match.competition)
  })) : [
    {
      id: 'fallback-1',
      opponent: language === 'ar' ? 'النصر' : 'Al-Nassr',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '20:00',
      venue: language === 'ar' ? 'ملعب الملك فهد الدولي' : 'King Fahd International Stadium',
      competition: language === 'ar' ? 'دوري روشن السعودي' : 'Saudi Pro League',
      status: 'upcoming',
      isHome: true,
      opponentLogo: '/images/clubs-images/saudi-arabia_al-nassr.svg',
      formattedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formattedTime: '20:00'
    }
  ];

  const recentMatches = fixtures.recent.length > 0 ? fixtures.recent.map(match => ({
    ...match,
    // Enhanced date formatting (Gregorian calendar with Western Arabic numerals)
    formattedDate: match.date ? new Date(match.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Unknown',
    // Enhanced time formatting
    formattedTime: match.time || 'Unknown',
    // Localize opponent name in Arabic mode
    opponent: getLocalizedTeamName(match.opponent, language),
    // Ensure opponent logo fallback
    opponentLogo: match.opponentLogo || `/images/clubs-images/saudi-arabia_${(match.opponent||'').toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`,
    // Competition logo
    competitionLogo: match.competitionLogo || getCompetitionLogo(match.competition),
    // Format score display
    scoreDisplay: match.score ? `${match.isHome ? match.score.home : match.score.away}-${match.isHome ? match.score.away : match.score.home}` : 'N/A'
  })) : [
    {
      id: 'fallback-2',
      opponent: language === 'ar' ? 'الفتح' : 'Al-Fateh',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: '20:00',
      venue: language === 'ar' ? 'ملعب الأمير سعود بن جلوي' : 'Prince Saud bin Jalawi Stadium',
      competition: language === 'ar' ? 'دوري روشن السعودي' : 'Saudi Pro League',
      status: 'completed',
      score: { home: 3, away: 1 },
      isHome: true,
      opponentLogo: '/images/clubs-images/saudi-arabia_al-fateh.svg',
      formattedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formattedTime: '20:00',
      scoreDisplay: '3-1'
    }
  ];

  const getCompetitionColor = (competition) => {
    if (competition.includes('Pro League') || competition.includes('دوري المحترفين') || competition.includes('دوري روشن السعودي')) {
      return '#0066cc';
    }
    if (competition.includes('King') || competition.includes('كأس')) {
      return '#ff8800';
    }
    if (competition.includes('Champions League') || competition.includes('دوري أبطال آسيا')) {
      return '#1a5490';
    }
    return '#666';
  };

  const getCompetitionLogo = (competition) => {
    if (competition.includes('Pro League') || competition.includes('دوري المحترفين') || competition.includes('دوري روشن السعودي')) {
      return '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg';
    }
    if (competition.includes('King') || competition.includes('كأس الملك')) {
      return '/images/tournamnets-images/King_Cup.png';
    }
    if (competition.includes('Champions League') || competition.includes('دوري أبطال آسيا')) {
      return '/images/tournamnets-images/AFC_Champions_League_Elite_logo.svg.png';
    }
    if (competition.includes('Super Cup') || competition.includes('كأس السوبر')) {
      return '/images/tournamnets-images/Saudi_Super_Cup.webp';
    }
    return null;
  };

  const handleSquadBuilder = async (match) => {
    setSelectedMatch(match);
    setShowSquadBuilder(true);
    
    // Load saved squad from Firestore (no localStorage fallback when logged in)
    try {
      let savedSquad = null;
      if (currentUser) {
        // Only Firestore when authenticated
        savedSquad = await loadUserSquad(currentUser.uid, match.id);
      } else {
        // Guests: use localStorage
        const savedSquads = JSON.parse(localStorage.getItem('savedSquads') || '{}');
        savedSquad = savedSquads[match.id];
      }
      if (savedSquad) {
        setSelectedFormation(savedSquad.formation);
        setSelectedPlayers(savedSquad.players || {});
        setBenchPlayers(savedSquad.bench || []);
        console.log('✅ Loaded saved squad for', match.opponent);
      } else {
        // No saved squad for this match: clear any previous selection to avoid carryover
        setSelectedPlayers({});
        setBenchPlayers([]);
      }
    } catch (error) {
      console.error('Error loading saved squad:', error);
      // Fail-safe: clear selection to avoid accidental carryover
      setSelectedPlayers({});
      setBenchPlayers([]);
    }
  };

  const handleBackToSchedule = () => {
    setShowSquadBuilder(false);
    setSelectedMatch(null);
  };

  const handleSaveSquad = async () => {
    try {
      const squadData = {
        matchId: selectedMatch.id,
        opponent: selectedMatch.opponent,
        competition: selectedMatch.competition,
        date: selectedMatch.date,
        formation: selectedFormation,
        players: selectedPlayers,
        bench: benchPlayers,
        savedAt: new Date().toISOString()
      };
      
      if (currentUser) {
        await saveUserSquad(currentUser.uid, selectedMatch.id, squadData);
      } else {
        // Fallback for guests: localStorage
        const savedSquads = JSON.parse(localStorage.getItem('savedSquads') || '{}');
        savedSquads[selectedMatch.id] = squadData;
        localStorage.setItem('savedSquads', JSON.stringify(savedSquads));
      }
      
      // Update saved flags immediately for better UX
      if (currentUser) {
        setSavedFlags(prev => ({ ...prev, [String(selectedMatch.id)]: true }));
      }

      alert(language === 'ar' 
        ? `✅ تم حفظ التشكيلة لمباراة ${selectedMatch?.opponent}` 
        : `✅ Squad saved for ${selectedMatch?.opponent} match`
      );
    } catch (error) {
      console.error('Error saving squad:', error);
      alert(language === 'ar' 
        ? '❌ حدث خطأ في حفظ التشكيلة' 
        : '❌ Error saving squad'
      );
    }
  };

  const handleFormationChange = (formation) => {
    setSelectedFormation(formation);
    setSelectedPlayers({}); // Clear players when changing formation
  };

  const handlePlayerSelect = (slotId, player) => {
    // Add player to the selected position
    setSelectedPlayers(prev => ({
      ...prev,
      [slotId]: player
    }));
  };

  const handlePlayerRemove = (positionId) => {
    setSelectedPlayers(prev => {
      const updated = { ...prev };
      delete updated[positionId];
      return updated;
    });
  };

  // Removed drag-and-drop handlers - using click-based selection

  const handleBenchPlayerAdd = (player) => {
    setBenchPlayers(prev => [...prev, player]);
  };

  const handleBenchPlayerRemove = (player) => {
    setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
  };

  const handleAutoFill = () => {
    // Auto fill logic here
    console.log('Auto fill positions');
  };

  const handleAutoFillBench = () => {
    // Auto fill bench logic here
    console.log('Auto fill bench');
  };

  // Community Squad Functions
  const generateMockCommunitySquad = () => {
    // Mock data showing most voted players by position
    return {
      'GK': { 
        player: players.find(p => p.nameEn === 'Yassine Bounou'), 
        percentage: 90,
        votes: 1250 
      },
      'CB1': { 
        player: players.find(p => p.nameEn === 'Kalidou Koulibaly'), 
        percentage: 85,
        votes: 1180 
      },
      'CB2': { 
        player: players.find(p => p.nameEn === 'Ali Al-Bulaihi'), 
        percentage: 72,
        votes: 998 
      },
      'LB': { 
        player: players.find(p => p.nameEn === 'Theo Hernández'), 
        percentage: 88,
        votes: 1220 
      },
      'RB': { 
        player: players.find(p => p.nameEn === 'João Cancelo'), 
        percentage: 79,
        votes: 1095 
      },
      'CDM': { 
        player: players.find(p => p.nameEn === 'Rúben Neves'), 
        percentage: 93,
        votes: 1289 
      },
      'CM': { 
        player: players.find(p => p.nameEn === 'Sergej Milinković-Savić'), 
        percentage: 81,
        votes: 1123 
      },
      'CAM': { 
        player: players.find(p => p.nameEn === 'Nasser Al-Dawsari'), 
        percentage: 67,
        votes: 929 
      },
      'LW': { 
        player: players.find(p => p.nameEn === 'Malcom'), 
        percentage: 74,
        votes: 1026 
      },
      'RW': { 
        player: players.find(p => p.nameEn === 'Malcom'), 
        percentage: 74,
        votes: 1026 
      },
      'ST': { 
        player: players.find(p => p.nameEn === 'Darwin Núñez'), 
        percentage: 96,
        votes: 1331 
      }
    };
  };

  const handleSquadViewToggle = (view) => {
    setSquadView(view);
    if (view === 'community' && Object.keys(communitySquad).length === 0) {
      setCommunitySquad(generateMockCommunitySquad());
    }
  };

  const shareSquadOnX = () => {
    // Check if squad is complete (11 players)
    if (Object.keys(selectedPlayers).length < 11) {
      alert(language === 'ar' 
        ? 'يجب اختيار 11 لاعباً لمشاركة التشكيلة' 
        : 'You must select 11 players to share the squad'
      );
      return;
    }

    // Build the squad text
    const squadPlayerNames = Object.entries(selectedPlayers)
      .map(([position, player]) => language === 'ar' ? player.nameAr : player.nameEn)
      .join(', ');

    // Build a friendly placeholder URL for sharing
    const opponentSlug = (selectedMatch.opponent || '').toString().toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');
    const formationSlug = selectedFormation.replace(/\s+/g, '');
    const shareUrl = `https://AlHilalXI.com/match/${opponentSlug}?formation=${encodeURIComponent(formationSlug)}`;

    // Create the tweet text with URL
    const tweetText = language === 'ar' 
      ? `🔵⚪️ تشكيلتي المتوقعة للهلال\n\n📋 التشكيلة (${selectedFormation}):\n${squadPlayerNames}\n\n⚽️ المباراة: ${selectedMatch.opponent}\n🏆 ${selectedMatch.competition}\n\n${shareUrl}\n\n#الهلال #تعاونية_الهلال`
      : `🔵⚪️ My Expected Al-Hilal Squad\n\n📋 Formation (${selectedFormation}):\n${squadPlayerNames}\n\n⚽️ Match: ${selectedMatch.opponent}\n🏆 ${selectedMatch.competition}\n\n${shareUrl}\n\n#AlHilal #TawuniyaAlHilal`;

    // Encode the tweet text for URL
    const encodedTweet = encodeURIComponent(tweetText);
    
    // Twitter/X share URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;
    
    // Open in new window
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const MatchCard = ({ match, showResult = false }) => {
    // Check if squad is saved for this match
    const hasSavedSquad = () => {
      // At render time we can't await Firestore; this relies on a pre-fetched map in state
      return !!savedFlags[String(match.id)];
    };
    
    return (
    <div className="content-card match-card">
      <div className="match-header">
        <div className="match-competition" style={{ color: getCompetitionColor(match.competition) }}>
          {match.competitionLogo && (
            <img 
              src={match.competitionLogo} 
              alt={match.competition}
              className="tournament-logo-small"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <span>{match.competition}</span>
        </div>
        <div className="match-date">
          <div className="date-main">{match.formattedDate || match.date}</div>
          <div className="date-time">{match.formattedTime || match.time}</div>
        </div>
      </div>
      
      <div className="match-main">
        <div className="team-info">
          <div className="team-logo-container">
            <img 
              src="/images/clubs-images/saudi-arabia_al-hilal.svg" 
              alt="Al-Hilal" 
              className="team-logo"
              onError={(e) => e.target.style.display = 'none'}
            />
            {match.isHome && <div className="home-indicator"></div>}
          </div>
          <span className="team-name">
            {language === 'ar' ? 'الهلال' : 'Al-Hilal'}
          </span>
        </div>
        
        <div className="match-details">
          {showResult ? (
            <div className="match-result">
              <div className="score-display">{match.scoreDisplay || 'N/A'}</div>
              <div className="match-status">{match.status === 'FT' ? (language === 'ar' ? 'انتهت' : 'Full Time') : match.status}</div>
            </div>
          ) : (
            <div className="match-time-info">
              <div className="match-time">{match.formattedTime || match.time}</div>
              <div className="match-status-upcoming">{language === 'ar' ? 'قادم' : 'Upcoming'}</div>
            </div>
          )}
          <div className="vs-text">VS</div>
        </div>
        
        <div className="team-info">
          <div className="team-logo-container">
            <img 
              src={match.opponentLogo || match.logo} 
              alt={match.opponent} 
              className="team-logo"
              onError={(e) => {
                e.target.src = '/images/clubs-images/default-team.svg';
                e.target.onerror = null;
              }}
            />
            {!match.isHome && <div className="away-indicator">✈️</div>}
          </div>
          <span className="team-name">{match.opponent}</span>
        </div>
      </div>
      
      <div className="match-footer">
        <div className="venue-info">
          <span className="venue-name">{match.venue}</span>
        </div>
        {!showResult && (
          <div className="match-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleSquadBuilder(match)}
            >
              <img src="/images/icons/right.png" alt="arrow" className="btn-icon-sm" />
              {hasSavedSquad() 
                ? (language === 'ar' ? 'تعديل التشكيلة' : 'Edit Squad')
                : (language === 'ar' ? 'بناء التشكيلة' : 'Build Squad')
              }
              {hasSavedSquad() && <span style={{ marginLeft: '4px' }}>✓</span>}
            </button>
            <button className="btn btn-secondary btn-sm">
              {language === 'ar' ? 'إحصائيات' : 'Stats'}
            </button>
          </div>
        )}
        {showResult && (
          <div className="match-actions">
            <button className="btn btn-secondary btn-sm">
              {language === 'ar' ? 'تفاصيل المباراة' : 'Match Details'}
            </button>
          </div>
        )}
      </div>
    </div>
    );
  };

  // Squad Builder View
  if (showSquadBuilder && selectedMatch) {
    return (
        <>
          <div className="page-header" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleBackToSchedule}
                style={{ margin: 0 }}
              >
                ← {language === 'ar' ? 'العودة للجدولة' : 'Back to Schedule'}
              </button>
              <div style={{ 
                background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)', 
                color: 'white', 
                padding: '8px 20px', 
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(0, 102, 204, 0.3)'
              }}>
                {language === 'ar' 
                  ? `مباراة ضد ${selectedMatch.opponent} - ${selectedMatch.competition}` 
                  : `Match vs ${selectedMatch.opponent} - ${selectedMatch.competition}`
                }
              </div>
            </div>
            <div className="page-actions">
              <FormationSelector 
                selectedFormation={selectedFormation}
                onFormationChange={handleFormationChange}
              />
              
              {/* Squad View Toggle */}
              <div className="squad-view-toggle">
                <button 
                  className={`toggle-btn ${squadView === 'personal' ? 'active' : ''}`}
                  onClick={() => handleSquadViewToggle('personal')}
                >
                  <span>👤</span>
                  {language === 'ar' ? 'تشكيلتي' : 'My Squad'}
                </button>
                <button 
                  className={`toggle-btn ${squadView === 'community' ? 'active' : ''}`}
                  onClick={() => handleSquadViewToggle('community')}
                >
                  <span>🏆</span>
                  {language === 'ar' ? 'تشكيلة المجتمع' : 'Community Squad'}
                </button>
              </div>
              
              {squadView === 'personal' ? (
                <>
                  <button 
                    className="btn btn-secondary"
                    onClick={shareSquadOnX}
                    disabled={Object.keys(selectedPlayers).length < 11}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>𝕏</span>
                    {language === 'ar' ? 'إرسال التشكيلة' : 'Share on X'}
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveSquad}
                  >
                    {language === 'ar' ? 'حفظ التشكيلة' : 'Save Squad'}
                  </button>
                </>
              ) : (
                <div className="community-stats">
                  <span className="stats-text">
                    {language === 'ar' ? 'إجمالي الأصوات:' : 'Total Votes:'} 
                    <strong> 1,387</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="squad-builder-layout">
            <div className="squad-content">
              <div className="field-section">
                <SquadBuilder 
                  formation={selectedFormation}
                  selectedPlayers={squadView === 'personal' ? selectedPlayers : communitySquad}
                  players={players}
                  onPlayerSelect={handlePlayerSelect}
                  selectedMatch={selectedMatch}
                  onPlayerRemove={handlePlayerRemove}
                  isReadOnly={squadView === 'community'}
                  squadView={squadView}
                  communityData={squadView === 'community' ? communitySquad : null}
                />
                
                {/* Bench Section */}
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
              
              
                <OrganizedPlayerPanel 
                  selectedPlayers={selectedPlayers}
                  benchPlayers={benchPlayers}
                  onPlayerSelect={handlePlayerSelect}
                  onBenchPlayerAdd={handleBenchPlayerAdd}
                  onBenchPlayerRemove={handleBenchPlayerRemove}
                  onAutoFill={handleAutoFill}
                  formation={selectedFormation}
                />
            </div>
          </div>
        
        <style>{`
          .squad-view-toggle {
            display: flex;
            background: #f0f4f8;
            border-radius: 12px;
            padding: 4px;
            gap: 4px;
            border: 1px solid rgba(0, 0, 0, 0.08);
          }
          
          .toggle-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            color: #666;
            font-family: inherit;
          }
          
          .toggle-btn:hover {
            background: rgba(0, 102, 204, 0.08);
            color: #0066cc;
            transform: translateY(-1px);
          }
          
          .toggle-btn.active {
            background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
            transform: translateY(-1px);
          }
          
          .toggle-btn span {
            font-size: 1.1rem;
          }
        `}</style>
        </>
    );
  }

  // Schedule View
  return (
    <div>
      
      <div className="page-header">
        <h1 className="page-title">
          {language === 'ar' ? 'جدول المباريات' : 'Match Schedule'}
        </h1>
        <p className="page-subtitle">
          {language === 'ar' 
            ? 'إدارة وتنظيم مباريات الفريق والتشكيلات' 
            : 'Manage and organize team matches and formations'
          }
        </p>
        <div className="season-indicator">
          <span className="season-label">
            {language === 'ar' ? 'الموسم:' : 'Season:'} 
          </span>
          <span className="season-value">
            {apiFootballService.currentSeason}/{apiFootballService.currentSeason + 1}
          </span>
          {apiFootballService.currentSeason < 2025 && (
            <span className="season-note">
              {language === 'ar' ? '(خطة مجانية - بيانات تاريخية)' : '(Free Plan - Historical Data)'}
            </span>
          )}
        </div>
      </div>

      <div className="content-grid">
        {/* Upcoming Matches */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'المباريات القادمة' : 'Upcoming Matches'}
            </h2>
            <div className="card-actions">
              <button 
                className="btn btn-icon"
                onClick={handleRefreshFixtures}
                disabled={fixturesLoading}
                title={language === 'ar' ? 'تحديث البيانات للموسم 2025/2026' : 'Refresh for 2025/2026 season'}
              >
              </button>
            </div>
          </div>
          
          <div className="matches-list">
            {fixturesLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>{language === 'ar' ? 'جاري تحميل المباريات من API-Football...' : 'Loading matches from API-Football...'}</p>
                <p className="loading-subtitle">{language === 'ar' ? 'قد يستغرق هذا بضع ثوان' : 'This may take a few seconds'}</p>
              </div>
            ) : fixturesError ? (
              <div className="error-state">
                <div className="error-icon"></div>
                <h3>{language === 'ar' ? 'خطأ في تحميل المباريات' : 'Error Loading Matches'}</h3>
                <p className="error-message">{fixturesError}</p>
                <div className="error-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => window.location.reload()}
                  >
                    {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                  </button>
                </div>
                {upcomingMatches.length > 0 && (
                  <div className="fallback-notice">
                    <p>{language === 'ar' ? 'عرض البيانات الاحتياطية' : 'Showing fallback data'}</p>
                  </div>
                )}
              </div>
            ) : null}
            
            {upcomingMatches.length > 0 ? (
              <>
                {fixturesError && (
                  <div className="api-status-warning">
                    <span className="warning-icon"></span>
                    <span>{language === 'ar' ? 'البيانات الاحتياطية' : 'Using fallback data'}</span>
                  </div>
                )}
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </>
            ) : !fixturesLoading && (
              <div className="no-matches">
                <div className="no-matches-icon">📅</div>
                <p>{language === 'ar' ? 'لا توجد مباريات قادمة' : 'No upcoming matches'}</p>
                <p className="no-matches-subtitle">{language === 'ar' ? 'تحقق مرة أخرى لاحقاً' : 'Check back later for updates'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'المباريات السابقة' : 'Recent Matches'}
            </h2>
            <div className="card-actions">
              <button className="btn btn-icon">
                <span></span>
              </button>
            </div>
          </div>
          
          <div className="matches-list">
            {fixturesLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>{language === 'ar' ? 'جاري تحميل النتائج من API-Football...' : 'Loading results from API-Football...'}</p>
                <p className="loading-subtitle">{language === 'ar' ? 'قد يستغرق هذا بضع ثوان' : 'This may take a few seconds'}</p>
              </div>
            ) : fixturesError ? (
              <div className="error-state">
                <div className="error-icon"></div>
                <h3>{language === 'ar' ? 'خطأ في تحميل النتائج' : 'Error Loading Results'}</h3>
                <p className="error-message">{fixturesError}</p>
                <div className="error-actions">
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => window.location.reload()}
                  >
                    {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                  </button>
                </div>
                {recentMatches.length > 0 && (
                  <div className="fallback-notice">
                    <p>{language === 'ar' ? 'عرض البيانات الاحتياطية' : 'Showing fallback data'}</p>
                  </div>
                )}
              </div>
            ) : null}
            
            {recentMatches.length > 0 ? (
              <>
                {fixturesError && (
                  <div className="api-status-warning">
                    <span className="warning-icon"></span>
                    <span>{language === 'ar' ? 'البيانات الاحتياطية' : 'Using fallback data'}</span>
                  </div>
                )}
                {recentMatches.map(match => (
                  <MatchCard key={match.id} match={match} showResult={true} />
                ))}
              </>
            ) : !fixturesLoading && (
              <div className="no-matches">
                <div className="no-matches-icon">📊</div>
                <p>{language === 'ar' ? 'لا توجد مباريات سابقة' : 'No recent matches'}</p>
                <p className="no-matches-subtitle">{language === 'ar' ? 'النتائج ستظهر هنا بعد المباريات' : 'Results will appear here after matches'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="content-grid three-column" style={{ marginTop: '24px' }}>
        <div className="content-card text-center">
          <div className="stat-value" style={{ fontSize: '2rem', fontWeight: '700', color: '#0066cc' }}>
            {upcomingMatches.length}
          </div>
          <div className="stat-label" style={{ color: '#666', fontSize: '0.9rem' }}>
            {language === 'ar' ? 'مباريات قادمة' : 'Upcoming Matches'}
          </div>
        </div>
        
        <div className="content-card text-center">
          <div className="stat-value" style={{ fontSize: '2rem', fontWeight: '700', color: '#00c851' }}>
            {statsLoading ? '—' : (stats?.wins ?? 0)}
          </div>
          <div className="stat-label" style={{ color: '#666', fontSize: '0.9rem' }}>
            {language === 'ar' ? 'انتصارات هذا الموسم' : 'Wins This Season'}
          </div>
        </div>
        
        <div className="content-card text-center">
          <div className="stat-value" style={{ fontSize: '2rem', fontWeight: '700', color: '#ff8800' }}>
            {statsLoading ? '—' : (stats?.trophies ?? 0)}
          </div>
          <div className="stat-label" style={{ color: '#666', fontSize: '0.9rem' }}>
            {language === 'ar' ? 'بطولات هذا العام' : 'Trophies This Year'}
          </div>
        </div>
      </div>

      <style>{`
        .match-card {
          margin-bottom: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 16px !important;
        }
        
        .match-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 102, 204, 0.15);
          border-color: rgba(0, 102, 204, 0.2);
        }
        
        .match-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(0, 102, 204, 0.1);
        }
        
        .match-competition {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.5px;
          background: rgba(0, 102, 204, 0.08);
          padding: 4px 10px;
          border-radius: 12px;
        }
        
        .match-date {
          font-size: 0.8rem;
          color: #333;
          font-weight: 500;
          text-align: right;
          background: rgba(255, 255, 255, 0.8);
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .date-main {
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 2px;
          color: #0066cc;
        }
        
        .date-time {
          font-size: 0.75rem;
          opacity: 0.9;
          color: #666;
        }
        
        .match-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .team-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        
        .team-logo-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .team-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 50%;
          background: #f8f9fa;
          padding: 6px;
          transition: transform 0.2s ease;
        }
        
        .team-logo:hover {
          transform: scale(1.05);
        }
        
        .home-indicator, .away-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .tournament-logo-small {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }
        
        .team-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
        }
        
        .match-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 0.5;
        }
        
        .match-time, .match-result {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0066cc;
        }
        
        .match-time-info {
          text-align: center;
        }
        
        .match-status-upcoming {
          font-size: 0.7rem;
          color: #0066cc;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .match-result {
          text-align: center;
        }
        
        .score-display {
          font-size: 1.6rem;
          font-weight: 700;
          color: #00c851;
          margin-bottom: 2px;
        }
        
        .match-status {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .vs-text {
          font-size: 0.75rem;
          color: #999;
          font-weight: 500;
          letter-spacing: 1px;
        }
        
        .match-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 2px solid rgba(0, 102, 204, 0.1);
          background: rgba(248, 249, 250, 0.5);
          margin: 12px -16px -16px -16px;
          padding: 10px 16px;
          border-radius: 0 0 12px 12px;
        }
        
        .venue-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #555;
          font-size: 0.8rem;
          max-width: 60%;
          font-weight: 500;
        }
        
        .venue-icon {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        
        .venue-name {
          font-weight: 500;
        }
        
        .match-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .btn-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .btn-sm span {
          font-size: 0.9rem;
        }
        
        .btn-icon-sm {
          width: 14px;
          height: 14px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: transform 0.2s ease;
        }
        
        .btn-sm:hover .btn-icon-sm {
          transform: translateX(1px);
        }
        
        .matches-list {
          max-height: 600px;
          overflow-y: auto;
        }
        
        .squad-builder-layout {
          margin-top: 24px;
        }
        
        .page-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .text-center {
          text-align: center;
        }
        
        .season-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
          padding: 12px 16px;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-radius: 8px;
          border-left: 4px solid #0066cc;
        }
        
        .season-label {
          font-weight: 600;
          color: #1565c0;
          font-size: 0.9rem;
        }
        
        .season-value {
          font-weight: 700;
          color: #0d47a1;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.7);
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .season-refresh-btn {
          margin-left: auto;
          font-size: 0.8rem;
          padding: 4px 12px;
        }
        
        .squad-view-toggle {
          display: flex;
          background: #f0f4f8;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .toggle-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #666;
          font-family: inherit;
        }
        
        .toggle-btn:hover {
          background: rgba(0, 102, 204, 0.08);
          color: #0066cc;
          transform: translateY(-1px);
        }
        
        .toggle-btn.active {
          background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
          transform: translateY(-1px);
        }
        
        .toggle-btn span {
          font-size: 1.1rem;
        }
        
        .community-stats {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }
        
        .stats-text {
          font-size: 0.9rem;
          color: #155724;
          font-weight: 500;
        }
        
        .season-note {
          font-size: 0.75rem;
          color: #ff9800;
          font-weight: 500;
          background: rgba(255, 152, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
        }
        
        .loading-state, .error-state, .no-matches {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }
        
        .loading-state {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          margin-bottom: 16px;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0066cc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        
        .loading-subtitle {
          font-size: 0.8rem;
          opacity: 0.7;
          margin-top: 8px;
        }
        
        .error-state {
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border-radius: 12px;
          margin-bottom: 16px;
          color: #c53030;
        }
        
        .error-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }
        
        .error-state h3 {
          margin: 0 0 12px 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .error-message {
          font-size: 0.85rem;
          opacity: 0.8;
          margin: 12px 0;
          background: rgba(0, 0, 0, 0.05);
          padding: 8px 12px;
          border-radius: 6px;
          font-family: monospace;
        }
        
        .error-actions {
          margin-top: 16px;
        }
        
        .fallback-notice {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(0, 102, 204, 0.1);
          border-radius: 6px;
          color: #0066cc;
          font-size: 0.8rem;
        }
        
        .api-status-warning {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 0.8rem;
          color: #856404;
        }
        
        .warning-icon {
          font-size: 1rem;
        }
        
        .no-matches {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          margin-bottom: 16px;
        }
        
        .no-matches-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          opacity: 0.6;
        }
        
        .no-matches-subtitle {
          font-size: 0.8rem;
          opacity: 0.7;
          margin-top: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .match-main {
            flex-direction: column;
            gap: 16px;
          }
          
          .match-details {
            order: -1;
          }
          
          .venue-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;