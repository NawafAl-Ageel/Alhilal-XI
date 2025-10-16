import React from 'react';
import localImageService from '../services/localImageService';

// Simple debug component to test logo loading
const LogoDebug = () => {
  // Test the service directly
  const hilalLogo = localImageService.getTeamLogo('Al-Hilal');
  const nassrLogo = localImageService.getTeamLogo('Al-Nassr');
  const unknownLogo = localImageService.getTeamLogo('Unknown Team');
  
  // Test tournament logos
  const saudiLeagueLogo = localImageService.getTournamentLogo('دوري روشن السعودي');
  const afcLogo = localImageService.getTournamentLogo('دوري أبطال آسيا');
  
  console.log('LogoDebug: Al-Hilal logo data:', hilalLogo);
  console.log('LogoDebug: Al-Nassr logo data:', nassrLogo);
  console.log('LogoDebug: Unknown logo data:', unknownLogo);
  console.log('LogoDebug: Saudi League logo data:', saudiLeagueLogo);
  console.log('LogoDebug: AFC logo data:', afcLogo);
  
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      margin: '20px',
      borderRadius: '10px'
    }}>
      <h3>Logo Debug Test</h3>
      <p>Check console for logo data</p>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h4>Al-Hilal Logo Test:</h4>
          <p>URL: {hilalLogo.url}</p>
          <p>Type: {hilalLogo.type}</p>
          <img 
            src={hilalLogo.url} 
            alt="Al-Hilal" 
            style={{ width: '50px', height: '50px' }}
            onError={(e) => {
              console.error('Al-Hilal image failed to load:', e.target.src);
              e.target.style.border = '2px solid red';
            }}
            onLoad={() => console.log('Al-Hilal image loaded successfully')}
          />
        </div>
        
        <div>
          <h4>Al-Nassr Logo Test:</h4>
          <p>URL: {nassrLogo.url}</p>
          <p>Type: {nassrLogo.type}</p>
          <img 
            src={nassrLogo.url} 
            alt="Al-Nassr" 
            style={{ width: '50px', height: '50px' }}
            onError={(e) => {
              console.error('Al-Nassr image failed to load:', e.target.src);
              e.target.style.border = '2px solid red';
            }}
            onLoad={() => console.log('Al-Nassr image loaded successfully')}
          />
        </div>
        
        <div>
          <h4>Unknown Team Test:</h4>
          <p>URL: {unknownLogo.url}</p>
          <p>Type: {unknownLogo.type}</p>
          {unknownLogo.type === 'generated' ? (
            <img 
              src={unknownLogo.url} 
              alt="Unknown" 
              style={{ width: '50px', height: '50px' }}
              onError={(e) => {
                console.error('Generated image failed to load:', e.target.src);
                e.target.style.border = '2px solid red';
              }}
              onLoad={() => console.log('Generated image loaded successfully')}
            />
          ) : (
            <div style={{ 
              width: '50px', 
              height: '50px', 
              fontSize: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unknownLogo.url}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Tournament Logo Tests:</h4>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <p>Saudi League:</p>
            <p>URL: {saudiLeagueLogo.url}</p>
            <p>Type: {saudiLeagueLogo.type}</p>
            <img 
              src={saudiLeagueLogo.url} 
              alt="Saudi League" 
              style={{ width: '40px', height: '40px', border: '1px solid #ccc' }}
              onError={(e) => {
                console.error('Saudi League image failed to load:', e.target.src);
                e.target.style.border = '2px solid red';
              }}
              onLoad={() => console.log('Saudi League image loaded successfully')}
            />
          </div>
          
          <div>
            <p>AFC Champions:</p>
            <p>URL: {afcLogo.url}</p>
            <p>Type: {afcLogo.type}</p>
            <img 
              src={afcLogo.url} 
              alt="AFC Champions" 
              style={{ width: '40px', height: '40px', border: '1px solid #ccc' }}
              onError={(e) => {
                console.error('AFC image failed to load:', e.target.src);
                e.target.style.border = '2px solid red';
              }}
              onLoad={() => console.log('AFC image loaded successfully')}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h4>Direct Image Tests:</h4>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>
            <p>Player image (working):</p>
            <img 
              src="/images/players/Bono_GK.png"
              alt="Player test"
              style={{ width: '50px', height: '50px', border: '1px solid green' }}
              onError={(e) => {
                console.error('Player image failed to load');
                e.target.style.border = '2px solid red';
              }}
              onLoad={() => console.log('Player image loaded successfully')}
            />
          </div>
          <div>
            <p>Club image (not working):</p>
            <img 
              src="/images/clubs-images/saudi-arabia_al-hilal.svg"
              alt="Club test"
              style={{ width: '50px', height: '50px', border: '1px solid #ccc' }}
              onError={(e) => {
                console.error('Club image failed to load:', e.target.src);
                e.target.style.border = '2px solid red';
              }}
              onLoad={() => console.log('Club image loaded successfully')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDebug;
