import { useState, useEffect, useCallback } from 'react';
import apiFootballService from '../services/apiFootballService';

/**
 * Custom hook for API-Football integration
 * Provides easy access to live football data with loading states and error handling
 */
export const useApiFootball = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeApiCall = useCallback(async (apiCall, fallbackData = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.warn('API call failed, using fallback data:', err.message);
      return fallbackData;
    }
  }, []);

  return {
    loading,
    error,
    executeApiCall,
    clearError: () => setError(null)
  };
};

/**
 * Hook for Al-Hilal fixtures data
 */
export const useAlHilalFixtures = (last = 5, next = 10) => {
  const [fixtures, setFixtures] = useState({ upcoming: [], recent: [] });
  const { loading, error, executeApiCall } = useApiFootball();

  const fetchFixtures = useCallback(async () => {
    const fallbackData = {
      upcoming: [
        {
          id: 'mock-1',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA'),
          time: '20:00',
          opponent: 'النصر',
          venue: 'مدينة الملك فهد الرياضية',
          competition: 'دوري المحترفين السعودي',
          isHome: true,
          status: 'NS'
        }
      ],
      recent: [
        {
          id: 'mock-2',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA'),
          time: '18:00',
          opponent: 'الاتحاد',
          venue: 'استاد الأمير فيصل بن فهد',
          competition: 'دوري المحترفين السعودي',
          isHome: false,
          status: 'FT',
          score: { home: 1, away: 2 }
        }
      ]
    };

    const result = await executeApiCall(
      () => apiFootballService.getFixtures(last, next),
      fallbackData
    );

    if (result) {
      // Format the data for our components
      const formattedFixtures = {
        upcoming: result.upcoming
          ?.map(fixture => apiFootballService.formatFixtureData(fixture))
          ?.filter(fixture => fixture !== null) || [],
        recent: result.recent
          ?.map(fixture => apiFootballService.formatFixtureData(fixture))
          ?.filter(fixture => fixture !== null) || []
      };
      setFixtures(formattedFixtures);
    }
  }, [last, next, executeApiCall]);

  useEffect(() => {
    fetchFixtures();
  }, [fetchFixtures]);

  return {
    fixtures,
    loading,
    error,
    refetch: fetchFixtures
  };
};

/**
 * Hook for Al-Hilal squad data
 */
export const useAlHilalSquad = (season = new Date().getFullYear()) => {
  const [squad, setSquad] = useState([]);
  const { loading, error, executeApiCall } = useApiFootball();

  const fetchSquad = useCallback(async () => {
    // Fallback to existing player data if API fails
    const fallbackData = [];

    const result = await executeApiCall(
      () => apiFootballService.getSquad(season),
      fallbackData
    );

    if (result && result.length > 0) {
      // Format the data for our components
      const formattedSquad = result[0]?.players?.map(player => 
        apiFootballService.formatPlayerData(player)
      ) || [];
      setSquad(formattedSquad);
    }
  }, [season, executeApiCall]);

  useEffect(() => {
    fetchSquad();
  }, [fetchSquad]);

  return {
    squad,
    loading,
    error,
    refetch: fetchSquad
  };
};

/**
 * Hook for team statistics
 */
export const useTeamStats = (season = new Date().getFullYear()) => {
  const [stats, setStats] = useState(null);
  const { loading, error, executeApiCall } = useApiFootball();

  const fetchStats = useCallback(async () => {
    const fallbackData = {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    };

    const result = await executeApiCall(
      () => apiFootballService.getTeamStats(season),
      fallbackData
    );

    if (result) {
      setStats(result);
    }
  }, [season, executeApiCall]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

/**
 * Hook for league standings
 */
export const useLeagueStandings = (leagueId = 307, season = new Date().getFullYear()) => {
  const [standings, setStandings] = useState([]);
  const { loading, error, executeApiCall } = useApiFootball();

  const fetchStandings = useCallback(async () => {
    const fallbackData = [];

    const result = await executeApiCall(
      () => apiFootballService.getStandings(leagueId, season),
      fallbackData
    );

    if (result && result.length > 0) {
      setStandings(result[0]?.league?.standings?.[0] || []);
    }
  }, [leagueId, season, executeApiCall]);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return {
    standings,
    loading,
    error,
    refetch: fetchStandings
  };
};

/**
 * Hook for specific fixture details
 */
export const useFixtureDetails = (fixtureId) => {
  const [fixture, setFixture] = useState(null);
  const { loading, error, executeApiCall } = useApiFootball();

  const fetchFixture = useCallback(async () => {
    if (!fixtureId) return;

    const result = await executeApiCall(
      () => apiFootballService.getFixtureById(fixtureId),
      null
    );

    if (result && result.length > 0) {
      const formattedFixture = apiFootballService.formatFixtureData(result[0]);
      setFixture(formattedFixture);
    }
  }, [fixtureId, executeApiCall]);

  useEffect(() => {
    fetchFixture();
  }, [fetchFixture]);

  return {
    fixture,
    loading,
    error,
    refetch: fetchFixture
  };
};
