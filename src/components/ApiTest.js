import React, { useState } from 'react';
import apiFootballService from '../services/apiFootballService';

/**
 * API Test Component
 * Quick component to test API-Football connection
 * Remove this after confirming API works
 */
const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      console.log('🧪 Testing API-Football connection...');
      
      // Test 1: Get team info
      const teamInfo = await apiFootballService.getTeamInfo();
      console.log('✅ Team Info:', teamInfo);
      
      // Test 2: Get fixtures
      const fixtures = await apiFootballService.getFixtures(3, 3);
      console.log('✅ Fixtures:', fixtures);
      
      setTestResult({
        success: true,
        teamInfo: teamInfo[0],
        upcoming: fixtures.upcoming,
        recent: fixtures.recent
      });
    } catch (err) {
      console.error('❌ API Test Failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>🧪 API Test</h3>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '8px 16px',
          background: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      {loading && <p>⏳ Loading...</p>}
      
      {error && (
        <div style={{ 
          background: '#fee', 
          padding: '10px', 
          borderRadius: '4px',
          color: '#c00',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {testResult && testResult.success && (
        <div style={{ 
          background: '#efe', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <p><strong>✅ API Connected!</strong></p>
          <p>Team: {testResult.teamInfo?.team?.name}</p>
          <p>Upcoming: {testResult.upcoming?.length || 0} matches</p>
          <p>Recent: {testResult.recent?.length || 0} matches</p>
        </div>
      )}
    </div>
  );
};

export default ApiTest;

