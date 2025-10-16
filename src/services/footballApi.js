// Football API Service for fetching team logos and data
class FootballApiService {
  constructor() {
    // Using API-Football (free tier)
    this.baseUrl = 'https://v3.football.api-sports.io';
    // You'll need to get your free API key from https://www.api-football.com/
    this.apiKey = process.env.REACT_APP_FOOTBALL_API_KEY || '8a88afa3f76f883f7773902dfed522c3';
    
    // Saudi Pro League ID (you can get this from the API)
    this.saudiLeagueId = 307;
    
    // Cache for team logos to avoid repeated API calls
    this.logoCache = new Map();
    this.teamDataCache = new Map();
  }

  // Generic API request method
  async makeRequest(endpoint, params = {}) {
    console.log(`FootballAPI: Making request to ${endpoint} with params:`, params);
    console.log(`FootballAPI: Using API key: ${this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'NOT_SET'}`);
    
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key]) url.searchParams.append(key, params[key]);
      });

      console.log(`FootballAPI: Request URL: ${url.toString()}`);

      const response = await fetch(url, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'v3.football.api-sports.io'
        }
      });

      console.log(`FootballAPI: Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`FootballAPI: Error response:`, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`FootballAPI: Response data:`, data);
      return data;
    } catch (error) {
      console.warn('Football API request failed:', error);
      return null;
    }
  }

  // Get team logo by team name (with fuzzy matching)
  async getTeamLogo(teamName) {
    // Check cache first
    const cacheKey = teamName.toLowerCase().trim();
    if (this.logoCache.has(cacheKey)) {
      return this.logoCache.get(cacheKey);
    }

    try {
      // Search for team by name
      const response = await this.makeRequest('/teams', {
        search: teamName,
        league: this.saudiLeagueId,
        season: new Date().getFullYear()
      });

      if (response && response.response && response.response.length > 0) {
        // Find the best match
        const team = this.findBestTeamMatch(response.response, teamName);
        if (team && team.team && team.team.logo) {
          this.logoCache.set(cacheKey, team.team.logo);
          this.teamDataCache.set(cacheKey, team.team);
          return team.team.logo;
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch logo for ${teamName}:`, error);
    }

    // Cache null result to avoid repeated failed requests
    this.logoCache.set(cacheKey, null);
    return null;
  }

  // Find the best matching team from API results
  findBestTeamMatch(teams, searchName) {
    const search = searchName.toLowerCase().trim();
    
    // Exact match first
    let bestMatch = teams.find(t => 
      t.team.name.toLowerCase() === search ||
      t.team.code?.toLowerCase() === search
    );
    
    if (bestMatch) return bestMatch;

    // Partial match
    bestMatch = teams.find(t => 
      t.team.name.toLowerCase().includes(search) ||
      search.includes(t.team.name.toLowerCase())
    );
    
    if (bestMatch) return bestMatch;

    // Return first result as fallback
    return teams[0];
  }

  // Get Saudi Pro League teams (for better caching)
  async getSaudiProLeagueTeams() {
    try {
      const response = await this.makeRequest('/teams', {
        league: this.saudiLeagueId,
        season: new Date().getFullYear()
      });

      if (response && response.response) {
        // Cache all team logos
        response.response.forEach(teamData => {
          if (teamData.team) {
            const cacheKey = teamData.team.name.toLowerCase().trim();
            this.logoCache.set(cacheKey, teamData.team.logo);
            this.teamDataCache.set(cacheKey, teamData.team);
          }
        });
        
        return response.response.map(t => t.team);
      }
    } catch (error) {
      console.warn('Failed to fetch Saudi Pro League teams:', error);
    }
    
    return [];
  }

  // Preload common team logos
  async preloadCommonLogos() {
    const commonTeams = [
      'Al-Hilal', 'Al Hilal',
      'Al-Nassr', 'Al Nassr',
      'Al-Ittihad', 'Al Ittihad',
      'Al-Ahli', 'Al Ahli',
      'Al-Shabab', 'Al Shabab',
      'Al-Fateh', 'Al Fateh',
      'Al-Faisaly', 'Al Faisaly',
      'Damac', 'Al-Raed', 'Al Raed'
    ];

    // Try to get Saudi league teams first for better accuracy
    await this.getSaudiProLeagueTeams();

    // If that fails, try individual searches
    const logoPromises = commonTeams.map(team => this.getTeamLogo(team));
    await Promise.allSettled(logoPromises);
  }

  // Clear cache (useful for testing or memory management)
  clearCache() {
    this.logoCache.clear();
    this.teamDataCache.clear();
  }
}

// Create and export a singleton instance
const footballApi = new FootballApiService();

export default footballApi;

// Also export the class for testing
export { FootballApiService };
