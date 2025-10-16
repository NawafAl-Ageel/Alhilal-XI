import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlHilalFixtures } from '../hooks/useApiFootball';
import getLocalizedTeamName from '../utils/teamNames';
import { getAllPlayers } from '../data/playerAPI';

const DashboardPage = () => {
  const { language } = useLanguage();

  // Base squad data (from local roster)
  const players = getAllPlayers();
  const squadStats = useMemo(() => ({
    totalPlayers: players.length,
    availablePlayers: players.length, // no injury feed yet
    injuredPlayers: 0,
    suspendedPlayers: 0,
    averageAge: 26.8,
    internationalPlayers: players.filter(p => p.nationality && p.nationality !== 'SA').length
  }), [players]);

  const positionBreakdown = useMemo(() => {
    const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    players.forEach(p => {
      if (p.position === 'GK') counts.GK += 1;
      else if (['CB','LB','RB','LCB','RCB','LWB','RWB'].includes(p.position)) counts.DEF += 1;
      else if (['CM','CDM','CAM','LM','RM','LCM','RCM'].includes(p.position)) counts.MID += 1;
      else counts.FWD += 1;
    });
    const total = Object.values(counts).reduce((a,b)=>a+b,0) || 1;
    return [
      { position: 'GK', count: counts.GK, percentage: Math.round((counts.GK/total)*100) },
      { position: 'DEF', count: counts.DEF, percentage: Math.round((counts.DEF/total)*100) },
      { position: 'MID', count: counts.MID, percentage: Math.round((counts.MID/total)*100) },
      { position: 'FWD', count: counts.FWD, percentage: Math.round((counts.FWD/total)*100) }
    ];
  }, [players]);

  // Live fixtures data from API-Football
  const { fixtures, loading: fixturesLoading, error: fixturesError } = useAlHilalFixtures(5, 5);

  const recentPerformance = useMemo(() => {
    return (fixtures.recent || []).map(fx => ({
      match: `${fx.isHome ? (language === 'ar' ? 'الهلال' : 'Al-Hilal') : getLocalizedTeamName(fx.opponent, language)} ${fx.score ? (fx.isHome ? fx.score.home : fx.score.away) : ''}-${fx.score ? (fx.isHome ? fx.score.away : fx.score.home) : ''} ${!fx.isHome ? (language === 'ar' ? 'الهلال' : 'Al-Hilal') : getLocalizedTeamName(fx.opponent, language)}`,
      result: fx.status === 'FT' && fx.score ? ((fx.isHome ? fx.score.home : fx.score.away) > (fx.isHome ? fx.score.away : fx.score.home) ? 'W' : ((fx.isHome ? fx.score.home : fx.score.away) === (fx.isHome ? fx.score.away : fx.score.home) ? 'D' : 'L')) : 'W',
      date: fx.date
    }));
  }, [fixtures.recent, language]);

  // Removed Next Match widget and data selection per request

  const getResultColor = (result) => {
    switch (result) {
      case 'W': return '#00c851';
      case 'D': return '#ff8800';
      case 'L': return '#e74c3c';
      default: return '#666';
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 'GK': return '#ff6b35';
      case 'DEF': return '#3498db';
      case 'MID': return '#2ecc71';
      case 'FWD': return '#e74c3c';
      default: return '#666';
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color = '#0066cc' }) => (
    <div className="content-card text-center">
      <div className="stat-icon" style={{ fontSize: '2rem', marginBottom: '12px' }}>
        {icon}
      </div>
      <div className="stat-value" style={{ fontSize: '2rem', fontWeight: '700', color, marginBottom: '8px' }}>
        {value}
      </div>
      <div className="stat-title" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
        {title}
      </div>
      {subtitle && (
        <div className="stat-subtitle" style={{ fontSize: '0.8rem', color: '#666' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
        <p className="page-subtitle">
          {language === 'ar' 
            ? 'نظرة شاملة على أداء الفريق والإحصائيات' 
            : 'Comprehensive overview of team performance and statistics'
          }
        </p>
        <div className="page-actions">
          <button className="btn btn-primary">
            {language === 'ar' ? 'تقرير مفصل' : 'Detailed Report'}
          </button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="content-grid three-column">
        <StatCard
          icon=""
          title={language === 'ar' ? 'إجمالي اللاعبين' : 'Total Players'}
          value={squadStats.totalPlayers}
          subtitle={`${squadStats.availablePlayers} ${language === 'ar' ? 'متاح' : 'available'}`}
          color="#0066cc"
        />
        <StatCard
          icon=""
          title={language === 'ar' ? 'المباريات (آخر/قادمة)' : 'Matches (recent/upcoming)'}
          value={`${(fixtures.recent||[]).length}/${(fixtures.upcoming||[]).length}`}
          subtitle={fixturesLoading ? (language === 'ar' ? 'جاري التحميل' : 'Loading') : (fixturesError || '')}
          color="#00c851"
        />
        <StatCard
          icon=""
          title={language === 'ar' ? 'أهداف الموسم (آخر 5)' : 'Goals (last 5)'}
          value={useMemo(() => {
            return (fixtures.recent||[]).reduce((sum, fx) => {
              if (!fx.score) return sum;
              return sum + fx.score.home + fx.score.away;
            }, 0);
          }, [fixtures.recent])}
          subtitle={language === 'ar' ? 'مجموع أهداف آخر 5 مباريات' : 'Total in last 5 matches'}
          color="#ff8800"
        />
      </div>

      <div className="content-grid two-column" style={{ marginTop: '24px' }}>
        {/* Squad Status */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'حالة الفريق' : 'Squad Status'}
            </h2>
          </div>
          
          <div className="squad-overview">
            <div className="status-grid">
              <div className="status-item">
                <div className="status-circle" style={{ backgroundColor: '#00c851' }}>
                  {squadStats.availablePlayers}
                </div>
                <span className="status-label">
                  {language === 'ar' ? 'متاح' : 'Available'}
                </span>
              </div>
              <div className="status-item">
                <div className="status-circle" style={{ backgroundColor: '#ff8800' }}>
                  {squadStats.injuredPlayers}
                </div>
                <span className="status-label">
                  {language === 'ar' ? 'مصاب' : 'Injured'}
                </span>
              </div>
              <div className="status-item">
                <div className="status-circle" style={{ backgroundColor: '#e74c3c' }}>
                  {squadStats.suspendedPlayers}
                </div>
                <span className="status-label">
                  {language === 'ar' ? 'موقوف' : 'Suspended'}
                </span>
              </div>
            </div>
            
            <div className="additional-stats">
              <div className="stat-row">
                <span className="stat-label">
                  {language === 'ar' ? 'متوسط العمر:' : 'Average Age:'}
                </span>
                <span className="stat-value">{squadStats.averageAge} {language === 'ar' ? 'سنة' : 'years'}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">
                  {language === 'ar' ? 'اللاعبون الدوليون:' : 'International Players:'}
                </span>
                <span className="stat-value">{squadStats.internationalPlayers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Position Breakdown */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'توزيع المراكز' : 'Position Breakdown'}
            </h2>
          </div>
          
          <div className="position-chart">
            {positionBreakdown.map((pos, index) => (
              <div key={index} className="position-row">
                <div className="position-info">
                  <span className="position-label">
                    {pos.position === 'GK' ? (language === 'ar' ? 'حراس' : 'Goalkeepers') :
                     pos.position === 'DEF' ? (language === 'ar' ? 'مدافعون' : 'Defenders') :
                     pos.position === 'MID' ? (language === 'ar' ? 'وسط' : 'Midfielders') :
                     (language === 'ar' ? 'مهاجمون' : 'Forwards')}
                  </span>
                  <span className="position-count">{pos.count}</span>
                </div>
                <div className="position-bar">
                  <div 
                    className="position-fill" 
                    style={{ 
                      width: `${pos.percentage}%`, 
                      backgroundColor: getPositionColor(pos.position) 
                    }}
                  ></div>
                </div>
                <span className="position-percentage">{pos.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-grid two-column" style={{ marginTop: '24px' }}>
        {/* Recent Performance */}
        <div className="content-card">
          <div className="content-card-header">
            <h2 className="card-title">
              {language === 'ar' ? 'الأداء الأخير' : 'Recent Performance'}
            </h2>
          </div>
          
          <div className="performance-list">
            {recentPerformance.map((match, index) => (
              <div key={index} className="performance-item">
                <div className="match-info">
                  <span className="match-name">{match.match}</span>
                  <span className="match-date">
                    {new Date(match.date).toLocaleDateString('en-US')}
                  </span>
                </div>
                <div 
                  className="result-badge"
                  style={{ 
                    backgroundColor: getResultColor(match.result),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  {match.result}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Match widget removed */}
      </div>

      <style>{`
        .text-center { text-align: center; }
        
        .squad-overview {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .status-grid {
          display: flex;
          justify-content: space-around;
          gap: 16px;
        }
        
        .status-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .status-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .status-label {
          font-size: 0.8rem;
          color: #666;
          font-weight: 500;
        }
        
        .additional-stats {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 16px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }
        
        .stat-row .stat-label {
          color: #666;
          font-size: 0.9rem;
        }
        
        .stat-row .stat-value {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }
        
        .position-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .position-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .position-info {
          min-width: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .position-label {
          font-size: 0.85rem;
          color: #666;
        }
        
        .position-count {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }
        
        .position-bar {
          flex: 1;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .position-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        
        .position-percentage {
          font-size: 0.8rem;
          color: #666;
          min-width: 35px;
          text-align: right;
        }
        
        .performance-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .performance-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .match-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .match-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
        }
        
        .match-date {
          font-size: 0.8rem;
          color: #666;
        }
        
        .next-match {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .match-teams {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        
        .team {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        
        .team-logo-large {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 50%;
          background: #f8f9fa;
          padding: 8px;
        }
        
        .team-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          text-align: center;
        }
        
        .vs-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 0.8;
        }
        
        .vs-text {
          font-size: 1rem;
          font-weight: 700;
          color: #0066cc;
          letter-spacing: 1px;
        }
        
        .match-datetime {
          text-align: center;
        }
        
        .match-datetime .match-date {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
        }
        
        .match-datetime .match-time {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0066cc;
        }
        
        .match-details-next {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .detail-icon {
          font-size: 1rem;
        }
        
        .detail-text {
          font-size: 0.85rem;
          color: #666;
        }
        
        .match-actions-next {
          margin-top: 8px;
        }
        
        @media (max-width: 768px) {
          .content-grid.two-column,
          .content-grid.three-column {
            grid-template-columns: 1fr;
          }
          
          .status-grid {
            flex-wrap: wrap;
          }
          
          .match-teams {
            flex-direction: column;
            gap: 12px;
          }
          
          .vs-section {
            order: -1;
          }
          
          .position-info {
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;