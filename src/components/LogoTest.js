import React from 'react';
import TeamLogo from './TeamLogo';

// Simple test component to verify logo loading
const LogoTest = () => {
  const testTeams = [
    'Al-Hilal',
    'Al-Nassr', 
    'Al-Ittihad',
    'Al-Ahli',
    'Unknown Team'
  ];

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h3>Logo Loading Test</h3>
      <p>Check browser console for debugging info</p>
      
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {testTeams.map(team => (
          <div key={team} style={{ textAlign: 'center' }}>
            <TeamLogo 
              teamName={team}
              size={48}
              showName={true}
            />
            <p style={{ fontSize: '12px', marginTop: '5px' }}>{team}</p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Direct Fallback Test:</h4>
        <div style={{ display: 'flex', gap: '15px' }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Al_Hilal_SFC_logo.svg/200px-Al_Hilal_SFC_logo.svg.png" 
            alt="Al-Hilal Direct"
            style={{ width: '48px', height: '48px' }}
            onError={(e) => console.error('Direct image failed:', e)}
            onLoad={() => console.log('Direct image loaded successfully')}
          />
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#0066cc', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            H
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTest;
