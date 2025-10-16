// Unified Team Logo Service
// Combines API-Football service with fallback logos for reliable team logo fetching

import footballApi from './footballApi';
import fallbackLogosService from './fallbackLogos';

class TeamLogoService {
  constructor() {
    this.logoCache = new Map();
    this.loadingPromises = new Map();
    this.initialized = false;
  }

  // Initialize the service
  async initialize() {
    if (this.initialized) return;

    try {
      // Preload common logos in parallel
      const preloadPromises = [
        footballApi.preloadCommonLogos(),
        fallbackLogosService.preloadFallbacks()
      ];

      await Promise.allSettled(preloadPromises);
      this.initialized = true;
      console.log('Team Logo Service initialized successfully');
    } catch (error) {
      console.warn('Team Logo Service initialization failed:', error);
      this.initialized = true; // Still mark as initialized to avoid blocking
    }
  }

  // Get team logo with comprehensive fallback strategy
  async getTeamLogo(teamName) {
    if (!teamName) {
      return this.getDefaultLogo();
    }

    const cacheKey = teamName.toLowerCase().trim();

    // Return cached result if available
    if (this.logoCache.has(cacheKey)) {
      return this.logoCache.get(cacheKey);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    // Create new loading promise
    const loadingPromise = this.fetchTeamLogo(teamName, cacheKey);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const result = await loadingPromise;
      this.logoCache.set(cacheKey, result);
      return result;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  // Internal method to fetch team logo with fallback strategy
  async fetchTeamLogo(teamName, cacheKey) {
    console.log(`TeamLogoService: Fetching logo for "${teamName}"`);
    
    try {
      // Step 1: Try API-Football
      console.log(`TeamLogoService: Trying API-Football for "${teamName}"`);
      const apiLogo = await footballApi.getTeamLogo(teamName);
      console.log(`TeamLogoService: API-Football result for "${teamName}":`, apiLogo);
      
      // Step 2: Get best available logo (validates URLs)
      console.log(`TeamLogoService: Getting best logo for "${teamName}"`);
      const logoResult = await fallbackLogosService.getBestLogo(teamName, apiLogo);
      console.log(`TeamLogoService: Best logo result for "${teamName}":`, logoResult);
      
      const finalResult = {
        url: logoResult.url,
        type: logoResult.type,
        teamName: teamName,
        colors: fallbackLogosService.getTeamColors(teamName)
      };
      
      console.log(`TeamLogoService: Final result for "${teamName}":`, finalResult);
      return finalResult;

    } catch (error) {
      console.warn(`TeamLogoService: Failed to fetch logo for ${teamName}:`, error);
      
      // Final fallback
      const fallbackResult = {
        url: fallbackLogosService.generateColoredLogo(teamName),
        type: 'error_fallback',
        teamName: teamName,
        colors: fallbackLogosService.getTeamColors(teamName)
      };
      
      console.log(`TeamLogoService: Error fallback for "${teamName}":`, fallbackResult);
      return fallbackResult;
    }
  }

  // Get default logo for unknown teams
  getDefaultLogo() {
    return {
      url: fallbackLogosService.generateColoredLogo('Unknown'),
      type: 'generated',
      teamName: 'Unknown',
      colors: { primary: '#666666', secondary: '#ffffff' }
    };
  }

  // Batch load multiple team logos
  async batchLoadLogos(teamNames) {
    if (!Array.isArray(teamNames)) return [];

    const uniqueTeams = [...new Set(teamNames.filter(name => name))];
    const logoPromises = uniqueTeams.map(teamName => 
      this.getTeamLogo(teamName).catch(error => {
        console.warn(`Failed to load logo for ${teamName}:`, error);
        return this.getDefaultLogo();
      })
    );

    return Promise.allSettled(logoPromises);
  }

  // Get Al-Hilal logo specifically (for home team)
  async getAlHilalLogo() {
    return this.getTeamLogo('Al-Hilal');
  }

  // Preload logos for a match schedule
  async preloadScheduleLogos(matches) {
    if (!Array.isArray(matches)) return;

    const teamNames = matches.reduce((teams, match) => {
      if (match.opponent) teams.push(match.opponent);
      teams.push('Al-Hilal'); // Always include home team
      return teams;
    }, []);

    await this.batchLoadLogos(teamNames);
  }

  // Clear cache (useful for testing or memory management)
  clearCache() {
    this.logoCache.clear();
    this.loadingPromises.clear();
    footballApi.clearCache();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      logoCache: this.logoCache.size,
      loadingPromises: this.loadingPromises.size,
      initialized: this.initialized
    };
  }

  // Check if service is ready
  isReady() {
    return this.initialized;
  }
}

// Create and export singleton instance
const teamLogoService = new TeamLogoService();

// Initialize on import (non-blocking)
teamLogoService.initialize().catch(console.warn);

export default teamLogoService;
export { TeamLogoService };
