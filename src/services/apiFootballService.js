/**
 * API-Football Service
 * Handles all interactions with the API-Football API for live football data
 */

import API_CONFIG from '../config/api.config';

class ApiFootballService {
  constructor() {
    // Support both API providers: 'apisports' (direct) or 'rapidapi'
    this.provider = (process.env.REACT_APP_FOOTBALL_PROVIDER || API_CONFIG.apiFootball.provider).toLowerCase();

    // Support both possible environment variable names for flexibility
    this.apiKey = process.env.REACT_APP_API_FOOTBALL_KEY || 
                  process.env.REACT_APP_FOOTBALL_API_KEY || 
                  API_CONFIG.apiFootball.key;

    // Configure base URL and headers based on provider
    if (this.provider === 'rapidapi') {
      // RapidAPI configuration per docs
      this.baseURL = 'https://api-football-v1.p.rapidapi.com/v3';
      this.headers = {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'Content-Type': 'application/json'
      };
    } else {
      // Direct API-Sports configuration per docs
      this.baseURL = 'https://v3.football.api-sports.io';
      this.headers = {
        // API-Sports direct header name
        'x-apisports-key': this.apiKey,
        // Also include RapidAPI-style header for broader compatibility
        'x-rapidapi-key': this.apiKey,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Content-Type': 'application/json'
      };
    }
    
    // Al-Hilal team ID in API-Football
    this.alHilalTeamId = 2932; // Al-Hilal's correct team ID
    
    // Saudi Pro League ID
    this.saudiProLeagueId = 307;
    
    // Current season - automatically detect or use 2025 for 2025/2026 season
    this.currentSeason = this.getCurrentSeason();
    
    // Cache to reduce API calls
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get current football season based on the current date
   * Saudi Pro League typically runs from August to May
   */
  getCurrentSeason() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Calculate current season
    // Saudi Pro League season runs from August to May
    if (currentMonth >= 8) {
      // August onwards = new season starting
      return currentYear;
    } else {
      // January-July = previous season that started last August
      return currentYear - 1;
    }
  }

  /**
   * Generic API request method with error handling and caching
   */
  async makeRequest(endpoint, params = {}) {
    try {
      // Check API key
      if (!this.apiKey) {
        throw new Error('API key not found. Please set REACT_APP_API_FOOTBALL_KEY (or REACT_APP_FOOTBALL_API_KEY) in your environment variables.');
      }

      // Create cache key
      const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
      const cachedData = this.cache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
        console.log(`📦 Using cached data for ${endpoint}`);
        return cachedData.data;
      }

      // Build URL with parameters
      // In development, use CRA proxy to avoid CORS
      const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      const base = isDev ? '/api-football' : this.baseURL;
      // Ensure absolute URL for the URL constructor when using relative base in browser
      const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
        ? window.location.origin
        : 'http://localhost:3000';
      const absoluteBase = base.startsWith('/') ? `${origin}${base}` : base;
      const urlObj = new URL(`${absoluteBase}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          urlObj.searchParams.append(key, params[key]);
        }
      });

      const finalUrl = urlObj.toString();
      console.log(`🚀 API Request: ${finalUrl}`);
      console.log(`🔧 Provider: ${this.provider}`);
      console.log(`🔑 Using API Key: ${this.apiKey ? 'SET' : 'NOT SET'}`);

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: this.headers,
        redirect: 'follow'
      });

      console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text.slice(0, 200));
        throw new Error('Expected JSON response but received non-JSON (see console for snippet)');
      }

      const data = await response.json();
      console.log(`📦 Raw API Response:`, data);
      
      // Check API response structure
      if (data.errors && data.errors.length > 0) {
        console.error('API returned errors:', data.errors);
        throw new Error(`API Error: ${data.errors.join(', ')}`);
      }
      
      if (!data.response) {
        console.warn('No response field in API data:', data);
        throw new Error('Invalid API response structure');
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: data.response,
        timestamp: Date.now()
      });

      console.log(`✅ API Success: ${endpoint}`, data.response.length || 1, 'items');
      return data.response;

    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Get Al-Hilal team information
   */
  async getTeamInfo() {
    return await this.makeRequest('/teams', {
      id: this.alHilalTeamId
    });
  }

  /**
   * Verify Al-Hilal team ID by searching for the team
   */
  async verifyAlHilalTeamId() {
    try {
      console.log('🔍 Verifying Al-Hilal team ID...');
      console.log(`🎯 Current Al-Hilal team ID: ${this.alHilalTeamId}`);
      
      // Search for Al-Hilal teams
      const searchResults = await this.makeRequest('/teams', {
        search: 'Al Hilal'
      });
      
      console.log('🔍 Al-Hilal search results:', searchResults);
      
      if (Array.isArray(searchResults)) {
        searchResults.forEach((result, index) => {
          const team = result.team;
          console.log(`  ${index + 1}. ${team?.name} (ID: ${team?.id}) - ${team?.country}`);
          if (team?.id === this.alHilalTeamId) {
            console.log(`     ✅ MATCHES our current team ID!`);
          }
        });
      }
      
      // Also try getting teams from Saudi Pro League for different seasons
      const seasons = [2025, 2024, 2023];
      for (const season of seasons) {
        try {
          console.log(`🔍 Checking Saudi Pro League teams for season ${season}...`);
          const leagueTeams = await this.makeRequest('/teams', {
            league: this.saudiProLeagueId,
            season: season
          });
          
          if (Array.isArray(leagueTeams)) {
            const alHilalInLeague = leagueTeams.find(teamData => 
              teamData.team?.name?.toLowerCase().includes('hilal') ||
              teamData.team?.name?.toLowerCase().includes('هلال')
            );
            
            if (alHilalInLeague) {
              console.log(`🔍 Al-Hilal in Saudi Pro League ${season}:`, {
                name: alHilalInLeague.team?.name,
                id: alHilalInLeague.team?.id,
                logo: alHilalInLeague.team?.logo
              });
              
              if (alHilalInLeague.team?.id === this.alHilalTeamId) {
                console.log(`     ✅ MATCHES our current team ID for season ${season}!`);
              }
            } else {
              console.log(`❌ Al-Hilal not found in season ${season}`);
            }
          }
        } catch (error) {
          console.log(`❌ Error checking season ${season}:`, error.message);
        }
      }
      
      return {
        searchResults,
        currentTeamId: this.alHilalTeamId
      };
    } catch (error) {
      console.error('Error verifying team ID:', error);
      return null;
    }
  }

  /**
   * Get Al-Hilal's current squad/players
   */
  async getSquad(season = this.currentSeason) {
    return await this.makeRequest('/players/squads', {
      team: this.alHilalTeamId,
      season: season
    });
  }

  /**
   * Get Al-Hilal's fixtures (upcoming and recent matches)
   */
  async getFixtures(last = 5, next = 10) {
    try {
      console.log(`🔍 Fetching fixtures for Al-Hilal (ID: ${this.alHilalTeamId})`);
      console.log(`📅 Current season: ${this.currentSeason} (${new Date().toISOString()})`);
      
      // Get all fixtures for Al-Hilal in the current season
      const fixtures = await this.makeRequest('/fixtures', {
        team: this.alHilalTeamId,
        season: this.currentSeason
      });

      console.log('📊 Raw fixtures data:', fixtures);
      
      // Log detailed fixture information for debugging
      if (Array.isArray(fixtures)) {
        console.log('🔍 Fixture details:');
        fixtures.forEach((fixture, index) => {
          if (fixture?.fixture) {
            const homeTeam = fixture.teams?.home?.name;
            const awayTeam = fixture.teams?.away?.name;
            const score = fixture.goals ? `${fixture.goals.home}-${fixture.goals.away}` : 'N/A';
            console.log(`  ${index + 1}. ${fixture.fixture.date} - Status: ${fixture.fixture.status?.short} (${fixture.fixture.status?.long})`);
            console.log(`     ${homeTeam} vs ${awayTeam} - Score: ${score}`);
            
            // Highlight Al-Ahli matches specifically
            if (homeTeam?.toLowerCase().includes('ahli') || awayTeam?.toLowerCase().includes('ahli')) {
              console.log(`     ⭐ FOUND AL-AHLI MATCH: ${homeTeam} vs ${awayTeam} - Score: ${score}`);
            }
          }
        });
        
        // Show all unique statuses
        const allStatuses = [...new Set(fixtures.map(f => f?.fixture?.status?.short).filter(Boolean))];
        console.log('📋 All fixture statuses found:', allStatuses);
        
        // Show recent matches (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentFixtures = fixtures.filter(f => {
          const fixtureDate = new Date(f?.fixture?.date);
          return fixtureDate >= thirtyDaysAgo;
        });
        console.log(`🕒 Fixtures in last 30 days: ${recentFixtures.length}`);
        recentFixtures.forEach(fixture => {
          if (fixture?.fixture) {
            const homeTeam = fixture.teams?.home?.name;
            const awayTeam = fixture.teams?.away?.name;
            const score = fixture.goals ? `${fixture.goals.home}-${fixture.goals.away}` : 'N/A';
            console.log(`     Recent: ${homeTeam} vs ${awayTeam} - ${score} (${fixture.fixture.date})`);
          }
        });
      }

      if (!Array.isArray(fixtures)) {
        console.warn('Fixtures is not an array:', fixtures);
        return { upcoming: [], recent: [] };
      }

      // Sort fixtures by date
      const sortedFixtures = fixtures.sort((a, b) => {
        const dateA = new Date(a?.fixture?.date || 0);
        const dateB = new Date(b?.fixture?.date || 0);
        return dateB - dateA; // Most recent first
      });

      const now = new Date();
      
      // Separate upcoming and recent matches
      // Upcoming: any match in the future that hasn't been completed
      const upcoming = sortedFixtures.filter(fixture => {
        const fixtureDate = new Date(fixture?.fixture?.date || 0);
        const status = fixture?.fixture?.status?.short;
        
        // Include if date is in the future and NOT a finished match
        const isFinished = ['FT', 'AET', 'PEN', 'AWD', 'WO', 'CANC', 'ABD', 'PST'].includes(status);
        return fixtureDate > now && !isFinished;
      }).slice(0, next); // Limit to 'next' number of matches

      // Recent: completed matches in the past
      const recent = sortedFixtures.filter(fixture => {
        const fixtureDate = new Date(fixture?.fixture?.date || 0);
        const status = fixture?.fixture?.status?.short;
        
        // Include completed matches
        const isFinished = ['FT', 'AET', 'PEN'].includes(status);
        return fixtureDate <= now && isFinished;
      }).slice(0, last); // Limit to 'last' number of matches

      const result = {
        upcoming: upcoming.reverse(), // Show earliest upcoming first
        recent: recent // Keep most recent first
      };

      console.log('🏟️ Processed fixtures:', {
        total: fixtures.length,
        upcoming: result.upcoming.length,
        recent: result.recent.length
      });

      return result;
    } catch (error) {
      console.error('Error in getFixtures:', error);
      return { upcoming: [], recent: [] };
    }
  }

  /**
   * Get specific fixture by ID
   */
  async getFixtureById(fixtureId) {
    return await this.makeRequest('/fixtures', {
      id: fixtureId
    });
  }

  /**
   * Get league standings
   */
  async getStandings(leagueId = this.saudiProLeagueId, season = this.currentSeason) {
    return await this.makeRequest('/standings', {
      league: leagueId,
      season: season
    });
  }

  /**
   * Get player statistics for a specific season
   */
  async getPlayerStats(playerId, season = this.currentSeason) {
    return await this.makeRequest('/players', {
      id: playerId,
      season: season
    });
  }

  /**
   * Get team statistics
   */
  async getTeamStats(season = this.currentSeason) {
    return await this.makeRequest('/teams/statistics', {
      team: this.alHilalTeamId,
      season: season,
      league: this.saudiProLeagueId
    });
  }

  /**
   * Get leagues information
   */
  async getLeagues(country = 'Saudi-Arabia') {
    return await this.makeRequest('/leagues', {
      country: country
    });
  }

  /**
   * Get head-to-head statistics between two teams
   */
  async getHeadToHead(team1Id = this.alHilalTeamId, team2Id) {
    return await this.makeRequest('/fixtures/headtohead', {
      h2h: `${team1Id}-${team2Id}`
    });
  }

  /**
   * Search for teams by name
   */
  async searchTeam(teamName) {
    return await this.makeRequest('/teams', {
      search: teamName
    });
  }

  /**
   * Get team logo URL
   */
  getTeamLogoUrl(teamData) {
    return teamData?.team?.logo || null;
  }

  /**
   * Get league logo URL
   */
  getLeagueLogoUrl(leagueData) {
    return leagueData?.league?.logo || null;
  }

  /**
   * Format fixture data for our application
   */
  formatFixtureData(fixture) {
    // Add null checks to prevent errors
    if (!fixture || !fixture.fixture || !fixture.teams || !fixture.league) {
      console.warn('Invalid fixture data:', fixture);
      return null;
    }

    try {
      return {
        id: fixture.fixture?.id || 'unknown',
        // Keep the raw ISO date for proper date handling
        date: fixture.fixture?.date || null,
        // Extract time from the date
        time: fixture.fixture?.date 
          ? new Date(fixture.fixture.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          : 'TBD',
        opponent: fixture.teams?.home?.id === this.alHilalTeamId 
          ? fixture.teams?.away?.name || 'Unknown Team'
          : fixture.teams?.home?.name || 'Unknown Team',
        opponentLogo: fixture.teams?.home?.id === this.alHilalTeamId 
          ? fixture.teams?.away?.logo || null
          : fixture.teams?.home?.logo || null,
        venue: fixture.fixture?.venue?.name || 'Unknown Venue',
        competition: fixture.league?.name || 'Unknown Competition',
        competitionLogo: fixture.league?.logo || null,
        isHome: fixture.teams?.home?.id === this.alHilalTeamId,
        status: fixture.fixture?.status?.short || 'NS',
        score: fixture.fixture?.status?.short === 'FT' && fixture.goals ? {
          home: fixture.goals.home || 0,
          away: fixture.goals.away || 0
        } : null
      };
    } catch (error) {
      console.error('Error formatting fixture data:', error, fixture);
      return null;
    }
  }

  /**
   * Format player data for our application
   */
  formatPlayerData(player) {
    return {
      id: player.player.id,
      name: player.player.name,
      firstname: player.player.firstname,
      lastname: player.player.lastname,
      age: player.player.age,
      nationality: player.player.nationality,
      photo: player.player.photo,
      position: player.statistics?.[0]?.games?.position || 'Unknown',
      jerseyNumber: player.statistics?.[0]?.games?.number || null,
      height: player.player.height,
      weight: player.player.weight
    };
  }

  /**
   * Clear cache (useful for forcing fresh data)
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ API cache cleared');
  }

  /**
   * Force refresh with current season data
   */
  async forceRefreshCurrentSeason() {
    this.clearCache();
    this.currentSeason = this.getCurrentSeason();
    console.log(`🔄 Force refreshing with season: ${this.currentSeason}`);
    return this.getFixtures();
  }

  /**
   * Search for specific Al-Hilal vs Al-Ahli matches for debugging
   */
  async searchAlHilalVsAlAhli() {
    try {
      console.log('🔍 Searching for Al-Hilal vs Al-Ahli matches...');
      
      // Try different season years
      const seasons = [2025, 2024, 2023];
      
      for (const season of seasons) {
        console.log(`🔍 Checking season ${season}...`);
        const fixtures = await this.makeRequest('/fixtures', {
          team: this.alHilalTeamId,
          season: season
        });
        
        if (Array.isArray(fixtures)) {
          const ahliMatches = fixtures.filter(fixture => {
            const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
            const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
            return homeTeam.includes('ahli') || awayTeam.includes('ahli');
          });
          
          if (ahliMatches.length > 0) {
            console.log(`⭐ Found ${ahliMatches.length} Al-Ahli matches in season ${season}:`);
            ahliMatches.forEach(match => {
              const homeTeam = match.teams?.home?.name;
              const awayTeam = match.teams?.away?.name;
              const score = match.goals ? `${match.goals.home}-${match.goals.away}` : 'N/A';
              const date = new Date(match.fixture?.date).toLocaleDateString();
              const status = match.fixture?.status?.short;
              console.log(`   ${date}: ${homeTeam} vs ${awayTeam} - ${score} (${status})`);
            });
          }
        }
      }
      
      // Also try without season filter
      console.log('🔍 Checking without season filter...');
      const allFixtures = await this.makeRequest('/fixtures', {
        team: this.alHilalTeamId
      });
      
      if (Array.isArray(allFixtures)) {
        const ahliMatches = allFixtures.filter(fixture => {
          const homeTeam = fixture.teams?.home?.name?.toLowerCase() || '';
          const awayTeam = fixture.teams?.away?.name?.toLowerCase() || '';
          return homeTeam.includes('ahli') || awayTeam.includes('ahli');
        });
        
        console.log(`⭐ Found ${ahliMatches.length} total Al-Ahli matches (all seasons)`);
        
        // Show recent Al-Ahli matches (last 60 days)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const recentAhliMatches = ahliMatches.filter(match => {
          const matchDate = new Date(match.fixture?.date);
          return matchDate >= sixtyDaysAgo;
        });
        
        console.log(`🕒 Recent Al-Ahli matches (last 60 days): ${recentAhliMatches.length}`);
        recentAhliMatches.forEach(match => {
          const homeTeam = match.teams?.home?.name;
          const awayTeam = match.teams?.away?.name;
          const score = match.goals ? `${match.goals.home}-${match.goals.away}` : 'N/A';
          const date = new Date(match.fixture?.date).toLocaleDateString();
          const status = match.fixture?.status?.short;
          console.log(`   ${date}: ${homeTeam} vs ${awayTeam} - ${score} (${status})`);
          
          // Check if this is the 3-3 match
          if (score === '3-3') {
            console.log(`   🎯 FOUND 3-3 MATCH!`);
          }
        });
      }
      
    } catch (error) {
      console.error('Error searching for Al-Ahli matches:', error);
    }
  }

  /**
   * Get API usage/quota information
   */
  async getApiStatus() {
    try {
      const response = await fetch(`${this.baseURL}/status`, {
        method: 'GET',
        headers: this.headers
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.error('Failed to get API status:', error);
    }
    return null;
  }
}

// Export singleton instance
const apiFootballService = new ApiFootballService();
export default apiFootballService;

// Export the class for testing purposes
export { ApiFootballService };
