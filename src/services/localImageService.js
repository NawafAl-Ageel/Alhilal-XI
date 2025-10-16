// Local Image Service - Uses local club and tournament images
class LocalImageService {
  constructor() {
    // Base path for images
    this.clubImagesPath = '/images/clubs-images/';
    this.tournamentImagesPath = '/images/tournamnets-images/';
    
    // Cache for processed results
    this.cache = new Map();
    
    // Saudi club name mappings to image files
    this.clubMappings = {
      // Al-Hilal variations
      'al-hilal': 'saudi-arabia_al-hilal.svg',
      'al hilal': 'saudi-arabia_al-hilal.svg',
      'الهلال': 'saudi-arabia_al-hilal.svg',
      'hilal': 'saudi-arabia_al-hilal.svg',
      
      // Al-Nassr variations
      'al-nassr': 'saudi-arabia_al-nassr.svg',
      'al nassr': 'saudi-arabia_al-nassr.svg',
      'النصر': 'saudi-arabia_al-nassr.svg',
      'nassr': 'saudi-arabia_al-nassr.svg',
      
      // Al-Ittihad variations
      'al-ittihad': 'saudi-arabia_al-ittihad.svg',
      'al ittihad': 'saudi-arabia_al-ittihad.svg',
      'الاتحاد': 'saudi-arabia_al-ittihad.svg',
      'ittihad': 'saudi-arabia_al-ittihad.svg',
      
      // Al-Ahli variations
      'al-ahli': 'saudi-arabia_al-ahli.svg',
      'al ahli': 'saudi-arabia_al-ahli.svg',
      'الأهلي': 'saudi-arabia_al-ahli.svg',
      'ahli': 'saudi-arabia_al-ahli.svg',
      
      // Al-Shabab variations
      'al-shabab': 'saudi-arabia_al-shabab.svg',
      'al shabab': 'saudi-arabia_al-shabab.svg',
      'الشباب': 'saudi-arabia_al-shabab.svg',
      'shabab': 'saudi-arabia_al-shabab.svg',
      
      // Al-Fateh variations
      'al-fateh': 'saudi-arabia_al-fateh.svg',
      'al fateh': 'saudi-arabia_al-fateh.svg',
      'الفتح': 'saudi-arabia_al-fateh.svg',
      'fateh': 'saudi-arabia_al-fateh.svg',
      
      // Al-Raed variations
      'al-raed': 'saudi-arabia_al-raed.svg',
      'al raed': 'saudi-arabia_al-raed.svg',
      'الرائد': 'saudi-arabia_al-raed.svg',
      'raed': 'saudi-arabia_al-raed.svg',
      
      // Al-Taawoun variations
      'al-taawoun': 'saudi-arabia_al-taawoun.svg',
      'al taawoun': 'saudi-arabia_al-taawoun.svg',
      'التعاون': 'saudi-arabia_al-taawoun.svg',
      'taawoun': 'saudi-arabia_al-taawoun.svg',
      
      // Al-Ettifaq variations
      'al-ettifaq': 'saudi-arabia_al-ettifaq.svg',
      'al ettifaq': 'saudi-arabia_al-ettifaq.svg',
      'الاتفاق': 'saudi-arabia_al-ettifaq.svg',
      'ettifaq': 'saudi-arabia_al-ettifaq.svg',
      
      // Al-Fayha variations
      'al-fayha': 'saudi-arabia_al-fayha.svg',
      'al fayha': 'saudi-arabia_al-fayha.svg',
      'الفيحاء': 'saudi-arabia_al-fayha.svg',
      'fayha': 'saudi-arabia_al-fayha.svg',
      
      // Al-Wehda variations
      'al-wehda': 'saudi-arabia_al-wehda.svg',
      'al wehda': 'saudi-arabia_al-wehda.svg',
      'الوحدة': 'saudi-arabia_al-wehda.svg',
      'wehda': 'saudi-arabia_al-wehda.svg',
      
      // Al-Khaleej variations
      'al-khaleej': 'saudi-arabia_al-khaleej.svg',
      'al khaleej': 'saudi-arabia_al-khaleej.svg',
      'الخليج': 'saudi-arabia_al-khaleej.svg',
      'khaleej': 'saudi-arabia_al-khaleej.svg',
      
      // Al-Kholood variations
      'al-kholood': 'saudi-arabia_al-kholood.svg',
      'al kholood': 'saudi-arabia_al-kholood.svg',
      'الخلود': 'saudi-arabia_al-kholood.svg',
      'kholood': 'saudi-arabia_al-kholood.svg',
      
      // Al-Okhdood variations
      'al-okhdood': 'saudi-arabia_al-okhdood.svg',
      'al okhdood': 'saudi-arabia_al-okhdood.svg',
      'الأخدود': 'saudi-arabia_al-okhdood.svg',
      'okhdood': 'saudi-arabia_al-okhdood.svg',
      
      // Al-Orobah variations
      'al-orobah': 'saudi-arabia_al-orobah.svg',
      'al orobah': 'saudi-arabia_al-orobah.svg',
      'العروبة': 'saudi-arabia_al-orobah.svg',
      'orobah': 'saudi-arabia_al-orobah.svg',
      
      // Al-Qadsiah variations
      'al-qadsiah': 'saudi-arabia_al-qadsiah.svg',
      'al qadsiah': 'saudi-arabia_al-qadsiah.svg',
      'القادسية': 'saudi-arabia_al-qadsiah.svg',
      'qadsiah': 'saudi-arabia_al-qadsiah.svg',
      
      // Al-Riyadh variations
      'al-riyadh': 'saudi-arabia_al-riyadh.svg',
      'al riyadh': 'saudi-arabia_al-riyadh.svg',
      'الرياض': 'saudi-arabia_al-riyadh.svg',
      'riyadh': 'saudi-arabia_al-riyadh.svg',
      
      // Damac variations
      'damac': 'saudi-arabia_damac.svg',
      'ضمك': 'saudi-arabia_damac.svg'
    };
    
    // Tournament mappings with correct paths
    this.tournamentMappings = {
      // Saudi Professional League
      'saudi professional league': '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg',
      'saudi pro league': '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg',
      'دوري روشن السعودي': '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg',
      'roshn saudi league': '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg',
      'الدوري السعودي': '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg',
      'دوري المحترفين': '/images/tournamnets-images/saudi-arabia_saudi-professional-league.svg',
      
      // AFC Champions League
      'afc champions league': '/images/tournamnets-images/AFC_Champions_League_Elite_logo.svg.png',
      'afc champions league elite': '/images/tournamnets-images/AFC_Champions_League_Elite_logo.svg.png',
      'دوري أبطال آسيا': '/images/tournamnets-images/AFC_Champions_League_Elite_logo.svg.png',
      'champions league': '/images/tournamnets-images/AFC_Champions_League_Elite_logo.svg.png',
      
      // King's Cup
      'king cup': '/images/clubs-images/King_Cup.png',
      'kings cup': '/images/clubs-images/King_Cup.png',
      'كأس الملك': '/images/clubs-images/King_Cup.png',
      
      // Saudi Super Cup
      'saudi super cup': '/images/clubs-images/Saudi-Super-Cup.vresize.350.350.medium.0.webp',
      'super cup': '/images/clubs-images/Saudi-Super-Cup.vresize.350.350.medium.0.webp',
      'كأس السوبر السعودي': '/images/clubs-images/Saudi-Super-Cup.vresize.350.350.medium.0.webp',
      
      // FIFA Club World Cup
      'fifa club world cup': '/images/tournamnets-images/tournaments_fifa-club-world-cup.svg',
      'club world cup': '/images/tournamnets-images/tournaments_fifa-club-world-cup.svg',
      'كأس العالم للأندية': '/images/tournamnets-images/tournaments_fifa-club-world-cup.svg'
    };
    
    // Team colors for fallback generation
    this.teamColors = {
      'al-hilal': { primary: '#0066cc', secondary: '#ffffff' },
      'al-nassr': { primary: '#ffcc00', secondary: '#0066cc' },
      'al-ittihad': { primary: '#000000', secondary: '#ffcc00' },
      'al-ahli': { primary: '#00cc44', secondary: '#ffffff' },
      'al-shabab': { primary: '#ffffff', secondary: '#000000' },
      'default': { primary: '#666666', secondary: '#ffffff' }
    };
  }

  // Get team logo URL
  getTeamLogo(teamName) {
    if (!teamName) return this.getDefaultLogo();
    
    const cacheKey = `team_${teamName.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const normalizedName = teamName.toLowerCase().trim();
    
    // Try exact match first
    if (this.clubMappings[normalizedName]) {
      const result = {
        url: this.clubImagesPath + this.clubMappings[normalizedName],
        type: 'local_club',
        teamName: teamName,
        colors: this.getTeamColors(normalizedName)
      };
      this.cache.set(cacheKey, result);
      return result;
    }
    
    // Try partial match
    const partialMatch = Object.keys(this.clubMappings).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    
    if (partialMatch) {
      const result = {
        url: this.clubImagesPath + this.clubMappings[partialMatch],
        type: 'local_club',
        teamName: teamName,
        colors: this.getTeamColors(partialMatch)
      };
      this.cache.set(cacheKey, result);
      return result;
    }

    // Fallback to generated logo
    const fallbackResult = {
      url: this.generateColoredLogo(teamName),
      type: 'generated',
      teamName: teamName,
      colors: this.getTeamColors('default')
    };
    
    this.cache.set(cacheKey, fallbackResult);
    return fallbackResult;
  }

  // Get tournament logo URL
  getTournamentLogo(tournamentName) {
    if (!tournamentName) return this.getDefaultTournamentLogo();
    
    const cacheKey = `tournament_${tournamentName.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const normalizedName = tournamentName.toLowerCase().trim();
    
    // Try exact match first
    if (this.tournamentMappings[normalizedName]) {
      const result = {
        url: this.tournamentMappings[normalizedName], // Full path already included
        type: 'local_tournament',
        tournamentName: tournamentName
      };
      this.cache.set(cacheKey, result);
      return result;
    }
    
    // Try partial match
    const partialMatch = Object.keys(this.tournamentMappings).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    
    if (partialMatch) {
      const result = {
        url: this.tournamentMappings[partialMatch], // Full path already included
        type: 'local_tournament',
        tournamentName: tournamentName
      };
      this.cache.set(cacheKey, result);
      return result;
    }

    // Fallback to default tournament logo
    return this.getDefaultTournamentLogo();
  }

  // Get team colors
  getTeamColors(teamName) {
    const normalizedName = teamName.toLowerCase().trim();
    return this.teamColors[normalizedName] || this.teamColors.default;
  }

  // Generate colored fallback logo
  generateColoredLogo(teamName, size = 40) {
    const colors = this.getTeamColors(teamName);
    const firstLetter = teamName.charAt(0).toUpperCase();
    
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2-1}" fill="${colors.primary}" stroke="${colors.secondary}" stroke-width="2"/>
        <text x="${size/2}" y="${size/2+6}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size*0.5}" font-weight="bold" fill="${colors.secondary}">
          ${firstLetter}
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Get default team logo
  getDefaultLogo() {
    return {
      url: this.generateColoredLogo('Unknown'),
      type: 'generated',
      teamName: 'Unknown',
      colors: this.teamColors.default
    };
  }

  // Get default tournament logo
  getDefaultTournamentLogo() {
    return {
      url: this.generateColoredLogo('Tournament', 24),
      type: 'generated',
      tournamentName: 'Unknown'
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get all available teams
  getAvailableTeams() {
    return Object.keys(this.clubMappings);
  }

  // Get all available tournaments
  getAvailableTournaments() {
    return Object.keys(this.tournamentMappings);
  }
}

// Create and export singleton instance
const localImageService = new LocalImageService();

export default localImageService;
export { LocalImageService };
