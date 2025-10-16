import React, { useState, useEffect } from 'react';
import localImageService from '../services/localImageService';
import './TeamLogo.css';

const TeamLogo = ({ 
  teamName, 
  size = 40, 
  className = '', 
  showName = false,
  fallbackIcon = '',
  onLoad = null,
  onError = null 
}) => {
  const [logoData, setLogoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log(`TeamLogo: Loading logo for "${teamName}"`);
    
    if (!teamName) {
      console.log('TeamLogo: No team name provided, using fallback');
      setLogoData({
        url: fallbackIcon,
        type: 'emoji',
        teamName: 'Unknown',
        colors: { primary: '#666666', secondary: '#ffffff' }
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Use local image service (synchronous)
    try {
      const data = localImageService.getTeamLogo(teamName);
      console.log(`TeamLogo: Received data for ${teamName}:`, data);
      setLogoData(data);
      setLoading(false);
      if (onLoad) onLoad(data);
    } catch (err) {
      console.warn(`TeamLogo: Failed to load logo for ${teamName}:`, err);
      setError(true);
      setLoading(false);
      setLogoData({
        url: fallbackIcon,
        type: 'error',
        teamName: teamName,
        colors: { primary: '#666666', secondary: '#ffffff' }
      });
      if (onError) onError(err);
    }
  }, [teamName, fallbackIcon, onLoad, onError]);

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
            borderRadius: '50%'
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
            backgroundColor: logoData.colors?.primary || '#666666',
            color: logoData.colors?.secondary || '#ffffff'
          }}
        >
          {logoData.url}
        </div>
      );
    }

    // Handle image URLs (including generated SVGs)
    return (
      <img
        src={logoData.url}
        alt={`${logoData.teamName} logo`}
        className="team-logo-image"
        style={{ width: size, height: size }}
        onError={handleImageError}
        loading="lazy"
      />
    );
  };

  return (
    <div 
      className={`team-logo-container ${className} ${loading ? 'loading' : ''} ${error ? 'error' : ''}`}
      title={logoData?.teamName || teamName}
    >
      {renderLogo()}
      {showName && logoData?.teamName && (
        <span className="team-logo-name" style={{ fontSize: size * 0.3 }}>
          {logoData.teamName}
        </span>
      )}
    </div>
  );
};

export default TeamLogo;
