import React, { useState, useEffect } from 'react';
import apiFootballService from '../services/apiFootballService';

const ApiDebug = () => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testApiConnection = async () => {
    setStatus('testing');
    setError(null);
    
    try {
      console.log('🧪 Testing API connection...');
      
      // Test 1: Check if API key is set
      const apiKey = process.env.REACT_APP_API_FOOTBALL_KEY || process.env.REACT_APP_FOOTBALL_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please set REACT_APP_API_FOOTBALL_KEY (or REACT_APP_FOOTBALL_API_KEY) in your .env file.');
      }
      
      console.log('✅ API key found:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET');
      console.log('🔍 Checking env variables:');
      console.log('  - REACT_APP_API_FOOTBALL_KEY:', process.env.REACT_APP_API_FOOTBALL_KEY ? 'SET' : 'NOT SET');
      console.log('  - REACT_APP_FOOTBALL_API_KEY:', process.env.REACT_APP_FOOTBALL_API_KEY ? 'SET' : 'NOT SET');
      
      // Test 2: Try to get API status
      const statusData = await apiFootballService.getApiStatus();
      console.log('📊 API Status:', statusData);
      
      // Test 3: Try a simple leagues request
      console.log('🌍 Testing leagues endpoint...');
      const leagues = await apiFootballService.getLeagues();
      console.log('🏆 Leagues data:', leagues);
      
      // Test 4: Verify Al-Hilal team ID
      console.log('🔍 Verifying Al-Hilal team ID...');
      const teamVerification = await apiFootballService.verifyAlHilalTeamId();
      console.log('🔍 Team verification:', teamVerification);

      // Test 5: Try to get Al-Hilal team info
      console.log('🏟️ Testing team info...');
      const teamInfo = await apiFootballService.getTeamInfo();
      console.log('👥 Team info:', teamInfo);
      
      // Test 6: Try to get fixtures
      console.log('📅 Testing fixtures...');
      const fixtures = await apiFootballService.getFixtures(3, 5);
      console.log('⚽ Fixtures:', fixtures);
      
      setData({
        status: statusData,
        leagues: leagues?.slice(0, 3) || [],
        teamVerification: teamVerification,
        teamInfo: teamInfo?.[0] || null,
        fixtures: fixtures
      });
      
      setStatus('success');
      
    } catch (err) {
      console.error('❌ API Test failed:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5',
      margin: '20px',
      borderRadius: '8px'
    }}>
      <h2>🧪 API-Football Debug Console</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status: </strong>
        <span style={{ 
          color: status === 'success' ? 'green' : 
                status === 'error' ? 'red' : 
                status === 'testing' ? 'orange' : 'gray'
        }}>
          {status.toUpperCase()}
        </span>
      </div>

      {status === 'testing' && (
        <div style={{ color: 'orange' }}>
          🔄 Testing API connection... Check console for details.
        </div>
      )}

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div>
          <h3>📊 API Response Data:</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>🔑 API Status:</strong>
            <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(data.status, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>🏆 Sample Leagues:</strong>
            <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(data.leagues, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>🔍 Team ID Verification:</strong>
            <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(data.teamVerification, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>👥 Al-Hilal Team Info:</strong>
            <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(data.teamInfo, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>⚽ Fixtures:</strong>
            <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(data.fixtures, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <button 
        onClick={testApiConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Test Again
      </button>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>Instructions:</strong>
        <ol>
          <li>Make sure you have your API key in <code>.env</code> file</li>
          <li>Check the browser console for detailed logs</li>
          <li>If you see errors, check the setup guide in <code>API_FOOTBALL_SETUP.md</code></li>
        </ol>
      </div>
    </div>
  );
};

export default ApiDebug;
