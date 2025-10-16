/**
 * API Configuration
 * Store your API keys here for development
 * 
 * IMPORTANT: In production, these should be environment variables
 * For now, we'll use this for development purposes
 */

export const API_CONFIG = {
  // API-Football Configuration
  apiFootball: {
    key: process.env.REACT_APP_API_FOOTBALL_KEY || '8a88afa3f76f883f7773902dfed522c3',
    baseURL: 'https://v3.football.api-sports.io',
    provider: 'apisports'
  },
  
  // Al-Hilal specific IDs
  alHilal: {
    teamId: 2932,
    leagueId: 307, // Saudi Pro League
  }
};

export default API_CONFIG;

