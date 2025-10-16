import React, { useState, useEffect } from 'react';
import localImageService from '../services/localImageService';
import './TeamLogo.css'; // Reuse the same CSS

const TournamentLogo = ({ 
  tournamentName, 
  size = 24, 
  className = '', 
  fallbackIcon = '',
  onLoad = null,
  onError = null 
}) => {
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(`TournamentLogo: Loading logo for "${tournamentName}"`);
    
    if (!tournamentName) {
      console.log('TournamentLogo: No tournament name provided, using fallback');
      setLogoData({
        url: fallbackIcon,
        type: 'emoji',
        tournamentName: 'Unknown'
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Use local image service (synchronous)
    try {
      const data = localImageService.getTournamentLogo(tournamentName);
      console.log(`TournamentLogo: Received data for ${tournamentName}:`, data);
      setLogoData(data);
      setLoading(false);
      if (onLoad) onLoad(data);
    } catch (err) {
      console.warn(`TournamentLogo: Failed to load logo for ${tournamentName}:`, err);
      setError(true);
      setLoading(false);
      setLogoData({
        url: fallbackIcon,
        type: 'error',
        tournamentName: tournamentName
      });
      if (onError) onError(err);
    }
  }, [tournamentName, fallbackIcon, onLoad, onError]);

  const handleImageError = () => {
    setError(true);
    setLogoData(prev => ({
      ...prev,
      url: fallbackIcon,
      type: 'error_fallback'
    }));
  };

  const renderLogo = () => {
    if (loading) {
      return (
        <div 
          className="team-logo-skeleton"
          style={{ 
            width: size, 
            height: size,
            backgroundColor: '#f0f0f0',
            borderRadius: '4px'
          }}
        >
          <div className="skeleton-shimmer"></div>
        </div>
      );
    }

    if (!logoData) {
      return (
        <div 
          className="team-logo-fallback"
          style={{ 
            width: size, 
            height: size,
            fontSize: size * 0.6 
          }}
        >
          {fallbackIcon}
        </div>
      );
    }

    // Handle emoji or text fallbacks
    if (logoData.type === 'emoji' || logoData.type === 'error' || logoData.type === 'error_fallback') {
      return (
        <div 
          className="team-logo-emoji"
          style={{ 
            width: size, 
            height: size,
            fontSize: size * 0.6,
            backgroundColor: '#f8f9fa',
            color: '#666666',
            borderRadius: '4px'
          }}
        >
          {logoData.url}
        </div>
      );
    }

    // Handle image URLs
    return (
      <img
        src={logoData.url}
        alt={`${logoData.tournamentName} logo`}
        className="team-logo-image tournament-logo"
        style={{ width: size, height: size, borderRadius: '4px' }}
        onError={handleImageError}
        loading="lazy"
      />
    );
  };

  return (
    <div 
      className={`team-logo-container tournament-logo-container ${className} ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}
      title={logoData?.tournamentName || tournamentName}
    >
      {renderLogo()}
    </div>
  );
};

export default TournamentLogo;
