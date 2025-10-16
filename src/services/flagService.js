// Flag Service - Maps country codes to flag images
// Uses the comprehensive flags folder with all world countries

export const flagService = {
  // Map country codes to flag file names
  getCountryFlag: (countryCode) => {
    if (!countryCode) return null;
    
    // Convert to lowercase for file naming convention
    const flagCode = countryCode.toLowerCase();
    
    // Return the flag image path
    return `/images/flags/${flagCode}.png`;
  },

  // Get country name from code (optional - for tooltips/alt text)
  getCountryName: (countryCode) => {
    const countryNames = {
      'SA': 'Saudi Arabia',
      'BR': 'Brazil', 
      'AR': 'Argentina',
      'MA': 'Morocco',
      'RS': 'Serbia',
      'UY': 'Uruguay',
      'NG': 'Nigeria',
      'SN': 'Senegal',
      'FR': 'France',
      'ES': 'Spain',
      'IT': 'Italy',
      'DE': 'Germany',
      'PT': 'Portugal',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'CR': 'Croatia',
      'DK': 'Denmark',
      'SE': 'Sweden',
      'NO': 'Norway',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'SK': 'Slovakia',
      'HU': 'Hungary',
      'RO': 'Romania',
      'BG': 'Bulgaria',
      'GR': 'Greece',
      'TR': 'Turkey',
      'RU': 'Russia',
      'UA': 'Ukraine',
      'BY': 'Belarus',
      'LT': 'Lithuania',
      'LV': 'Latvia',
      'EE': 'Estonia',
      'FI': 'Finland',
      'IS': 'Iceland',
      'IE': 'Ireland',
      'GB': 'United Kingdom',
      'GB-ENG': 'England',
      'GB-SCT': 'Scotland',
      'GB-WLS': 'Wales',
      'GB-NIR': 'Northern Ireland',
      'US': 'United States',
      'CA': 'Canada',
      'MX': 'Mexico',
      'CO': 'Colombia',
      'VE': 'Venezuela',
      'PE': 'Peru',
      'EC': 'Ecuador',
      'BO': 'Bolivia',
      'PY': 'Paraguay',
      'CL': 'Chile',
      'JP': 'Japan',
      'KR': 'South Korea',
      'CN': 'China',
      'AU': 'Australia',
      'NZ': 'New Zealand',
      'ZA': 'South Africa',
      'EG': 'Egypt',
      'GH': 'Ghana',
      'CI': 'Ivory Coast',
      'CM': 'Cameroon',
      'DZ': 'Algeria',
      'TN': 'Tunisia',
      'KE': 'Kenya',
      'ET': 'Ethiopia',
      'IR': 'Iran',
      'IQ': 'Iraq',
      'SY': 'Syria',
      'LB': 'Lebanon',
      'JO': 'Jordan',
      'KW': 'Kuwait',
      'QA': 'Qatar',
      'AE': 'UAE',
      'BH': 'Bahrain',
      'OM': 'Oman',
      'YE': 'Yemen',
      'IN': 'India',
      'PK': 'Pakistan',
      'BD': 'Bangladesh',
      'LK': 'Sri Lanka',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'ID': 'Indonesia',
      'PH': 'Philippines'
    };
    
    return countryNames[countryCode] || countryCode;
  },

  // Check if flag image exists (fallback handling)
  getFlagWithFallback: (countryCode) => {
    const flagPath = flagService.getCountryFlag(countryCode);
    
    // Return flag path - browser will handle 404s gracefully
    return {
      src: flagPath,
      alt: flagService.getCountryName(countryCode),
      countryCode: countryCode
    };
  }
};

export default flagService;
