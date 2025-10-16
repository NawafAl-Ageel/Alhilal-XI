// Fallback logos service - provides default team logos when API fails
// Using a combination of free logo resources and fallback icons

const fallbackLogos = {
  // Saudi Pro League teams - using more reliable sources
  'al-hilal': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Al_Hilal_SFC_logo.svg/200px-Al_Hilal_SFC_logo.svg.png',
  'al hilal': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Al_Hilal_SFC_logo.svg/200px-Al_Hilal_SFC_logo.svg.png',
  'الهلال': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Al_Hilal_SFC_logo.svg/200px-Al_Hilal_SFC_logo.svg.png',
  
  'al-nassr': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Al_Nassr_FC_logo.svg/200px-Al_Nassr_FC_logo.svg.png',
  'al nassr': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Al_Nassr_FC_logo.svg/200px-Al_Nassr_FC_logo.svg.png',
  'النصر': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Al_Nassr_FC_logo.svg/200px-Al_Nassr_FC_logo.svg.png',
  
  'al-ittihad': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Al-Ittihad_Logo.svg/200px-Al-Ittihad_Logo.svg.png',
  'al ittihad': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Al-Ittihad_Logo.svg/200px-Al-Ittihad_Logo.svg.png',
  'الاتحاد': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Al-Ittihad_Logo.svg/200px-Al-Ittihad_Logo.svg.png',
  
  'al-ahli': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Al-Ahli_Saudi_FC_logo.svg/200px-Al-Ahli_Saudi_FC_logo.svg.png',
  'al ahli': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Al-Ahli_Saudi_FC_logo.svg/200px-Al-Ahli_Saudi_FC_logo.svg.png',
  'الأهلي': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Al-Ahli_Saudi_FC_logo.svg/200px-Al-Ahli_Saudi_FC_logo.svg.png',
  
  'al-shabab': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Al-Shabab_FC_%28Riyadh%29_logo.svg/200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png',
  'al shabab': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Al-Shabab_FC_%28Riyadh%29_logo.svg/200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png',
  'الشباب': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Al-Shabab_FC_%28Riyadh%29_logo.svg/200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png',
  
  // Additional Saudi Pro League teams
  'al-fateh': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Al-Fateh_SC_logo.svg/200px-Al-Fateh_SC_logo.svg.png',
  'al fateh': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Al-Fateh_SC_logo.svg/200px-Al-Fateh_SC_logo.svg.png',
  'الفتح': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Al-Fateh_SC_logo.svg/200px-Al-Fateh_SC_logo.svg.png',
  
  'al-raed': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Al-Raed_FC_logo.svg/200px-Al-Raed_FC_logo.svg.png',
  'al raed': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Al-Raed_FC_logo.svg/200px-Al-Raed_FC_logo.svg.png',
  'الرائد': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Al-Raed_FC_logo.svg/200px-Al-Raed_FC_logo.svg.png',
  
  // Generic fallback patterns - using generated logos instead of emojis
  'default': 'generated',
  'unknown': 'generated',
  'football': 'generated',
  'soccer': 'generated'
};

// Team color schemes for generating colored fallback icons
const teamColors = {
  'al-hilal': { primary: '#0066cc', secondary: '#ffffff' },
  'al hilal': { primary: '#0066cc', secondary: '#ffffff' },
  'الهلال': { primary: '#0066cc', secondary: '#ffffff' },
  
  'al-nassr': { primary: '#ffcc00', secondary: '#0066cc' },
  'al nassr': { primary: '#ffcc00', secondary: '#0066cc' },
  'النصر': { primary: '#ffcc00', secondary: '#0066cc' },
  
  'al-ittihad': { primary: '#000000', secondary: '#ffcc00' },
  'al ittihad': { primary: '#000000', secondary: '#ffcc00' },
  'الاتحاد': { primary: '#000000', secondary: '#ffcc00' },
  
  'al-ahli': { primary: '#00cc44', secondary: '#ffffff' },
  'al ahli': { primary: '#00cc44', secondary: '#ffffff' },
  'الأهلي': { primary: '#00cc44', secondary: '#ffffff' },
  
  'al-shabab': { primary: '#ffffff', secondary: '#000000' },
  'al shabab': { primary: '#ffffff', secondary: '#000000' },
  'الشباب': { primary: '#ffffff', secondary: '#000000' },
  
  'default': { primary: '#666666', secondary: '#ffffff' }
};

class FallbackLogosService {
  constructor() {
    this.fallbackCache = new Map();
  }

  // Get fallback logo URL or emoji for a team
  getFallbackLogo(teamName) {
    const key = teamName.toLowerCase().trim();
    
    // Check cache first
    if (this.fallbackCache.has(key)) {
      return this.fallbackCache.get(key);
    }

    // Try exact match
    if (fallbackLogos[key]) {
      if (fallbackLogos[key] === 'generated') {
        const generated = this.generateColoredLogo(teamName);
        this.fallbackCache.set(key, generated);
        return generated;
      }
      this.fallbackCache.set(key, fallbackLogos[key]);
      return fallbackLogos[key];
    }

    // Try partial match
    const partialMatch = Object.keys(fallbackLogos).find(logoKey => 
      key.includes(logoKey) || logoKey.includes(key)
    );
    
    if (partialMatch) {
      if (fallbackLogos[partialMatch] === 'generated') {
        const generated = this.generateColoredLogo(teamName);
        this.fallbackCache.set(key, generated);
        return generated;
      }
      this.fallbackCache.set(key, fallbackLogos[partialMatch]);
      return fallbackLogos[partialMatch];
    }

    // Return default (generated)
    const defaultGenerated = this.generateColoredLogo(teamName);
    this.fallbackCache.set(key, defaultGenerated);
    return defaultGenerated;
  }

  // Get team colors for styling
  getTeamColors(teamName) {
    const key = teamName.toLowerCase().trim();
    
    if (teamColors[key]) {
      return teamColors[key];
    }

    // Try partial match
    const partialMatch = Object.keys(teamColors).find(colorKey => 
      key.includes(colorKey) || colorKey.includes(key)
    );
    
    if (partialMatch) {
      return teamColors[partialMatch];
    }

    return teamColors.default;
  }

  // Generate a colored fallback logo (SVG data URL)
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

  // Check if a URL is a valid image
  async isValidImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    try {
      // For CORS issues, we'll create an image element instead of fetch
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
      });
    } catch (error) {
      console.warn('Image validation error:', error);
      return false;
    }
  }

  // Get the best available logo (simplified - no validation for now)
  async getBestLogo(teamName, apiLogo = null) {
    console.log(`FallbackLogos: Getting best logo for "${teamName}", API logo:`, apiLogo);
    
    // Try API logo first (skip validation for now)
    if (apiLogo && typeof apiLogo === 'string' && apiLogo.startsWith('http')) {
      console.log(`FallbackLogos: Using API logo for "${teamName}"`);
      return { url: apiLogo, type: 'api' };
    }

    // Try fallback logo (skip validation for now)
    const fallbackLogo = this.getFallbackLogo(teamName);
    console.log(`FallbackLogos: Fallback logo for "${teamName}":`, fallbackLogo);
    
    if (fallbackLogo && fallbackLogo.startsWith('http')) {
      console.log(`FallbackLogos: Using fallback logo for "${teamName}"`);
      return { url: fallbackLogo, type: 'fallback' };
    }

    // Generate colored logo
    console.log(`FallbackLogos: Generating colored logo for "${teamName}"`);
    const generatedLogo = this.generateColoredLogo(teamName);
    return { url: generatedLogo, type: 'generated' };
  }

  // Preload fallback images to check validity
  async preloadFallbacks() {
    const logoUrls = Object.values(fallbackLogos).filter(logo => 
      typeof logo === 'string' && logo.startsWith('http')
    );

    const validationPromises = logoUrls.map(async url => {
      const isValid = await this.isValidImageUrl(url);
      return { url, isValid };
    });

    const results = await Promise.allSettled(validationPromises);
    console.log('Fallback logo validation results:', results);
  }
}

// Create and export singleton instance
const fallbackLogos = new FallbackLogosService();

export default fallbackLogos;
export { FallbackLogosService, teamColors };
