// Simple localization for common team names (en -> ar)
// Extend this list as needed
const TEAM_NAME_AR = {
  'Al-Hilal': 'الهلال',
  'Al-Nassr': 'النصر',
  'Al-Ittihad': 'الاتحاد',
  'Al-Ahli': 'الأهلي',
  'Al-Shabab': 'الشباب',
  'Al-Fateh': 'الفتح',
  'Al-Taawoun': 'التعاون',
  'Al-Taawon': 'التعاون',
  'Al-Raed': 'الرائد',
  'Al-Fayha': 'الفيحاء',
  'Al-Ettifaq': 'الاتفاق',
  'Damac': 'ضمك',
  'Al-Wehda': 'الوحدة',
  'Al-Riyadh': 'الرياض',
  'Al-Okhdood': 'الأخدود',
  'Al-Okhdoud': 'الأخدود',
  'Al-Hazm': 'الحزم',
  'Al-Khaleej': 'الخليج',
  'Abha': 'أبها',
  'Al-Abha': 'أبها',
  'Al-Qadsiah': 'القادسية',
  'Al-Orubah': 'العروبة',
  'Al-Kholood': 'الخلود',
  'Al-Taee': 'الطائي',
  'Al-Tai': 'الطائي',
  'Al-Taie': 'الطائي',
  'Al-Tai FC': 'الطائي',
  'Al-Ansar': 'الأنصار',
  'Al-Najma': 'النجمة',
  'Al-Najmah': 'النجمة',
  'Ohod': 'أحد',
  'Najran': 'نجران',
  'Hajer': 'هجر',
  'Al-Adalah': 'العدالة',
  'Jeddah': 'جدة',
  'Al-Batin': 'الباطن',
  'Al-Duhail': 'الدحيل',
  'Al Duhail': 'الدحيل',
  'Al-Duhail SC': 'الدحيل',
  'Al Duhail SC': 'الدحيل',
};

export function getLocalizedTeamName(name, lang = 'en') {
  if (!name) return '';
  if (lang === 'ar') {
    // Try exact match first
    if (TEAM_NAME_AR[name]) return TEAM_NAME_AR[name];
    // Try normalized match (strip dashes, multiple spaces, case-insensitive)
    const normalized = name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    const found = Object.entries(TEAM_NAME_AR).find(([en]) => {
      const n = en.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      return n === normalized;
    });
    if (found) return found[1];

    // Keyword-based fallbacks for common transliteration variants
    const keywordRules = [
      { keys: ['hilal'], ar: 'الهلال' },
      { keys: ['nassr', 'nasr'], ar: 'النصر' },
      { keys: ['ittihad', 'ettehad'], ar: 'الاتحاد' },
      { keys: ['ahli', 'ahly'], ar: 'الأهلي' },
      { keys: ['shabab'], ar: 'الشباب' },
      { keys: ['fateh'], ar: 'الفتح' },
      { keys: ['taawoun', 'taawon', 'taawen', 'taawun'], ar: 'التعاون' },
      { keys: ['raed'], ar: 'الرائد' },
      { keys: ['fayha'], ar: 'الفيحاء' },
      { keys: ['ettifaq', 'ittifaq'], ar: 'الاتفاق' },
      { keys: ['damac'], ar: 'ضمك' },
      { keys: ['wehda', 'wehdah'], ar: 'الوحدة' },
      { keys: ['riyadh'], ar: 'الرياض' },
      { keys: ['okhdood', 'okhdoud', 'akhdood', 'akhdoud', 'okhdud'], ar: 'الأخدود' },
      { keys: ['hazm'], ar: 'الحزم' },
      { keys: ['khaleej'], ar: 'الخليج' },
      { keys: ['abha'], ar: 'أبها' },
      { keys: ['qadsiah', 'qadisia', 'qadisiyah'], ar: 'القادسية' },
      { keys: ['orubah', 'orobah', 'urubah'], ar: 'العروبة' },
      { keys: ['kholood', 'khalood', 'khulood'], ar: 'الخلود' },
      { keys: ['tai ', 'taee', 'al tai', 'al-tai'], ar: 'الطائي' },
      { keys: ['ansar'], ar: 'الأنصار' },
      { keys: ['najma', 'najmah'], ar: 'النجمة' },
      { keys: ['ohod', 'uhud'], ar: 'أحد' },
      { keys: ['najran'], ar: 'نجران' },
      { keys: ['hajer'], ar: 'هجر' },
      { keys: ['adalah', 'adalh', 'adal ah'], ar: 'العدالة' },
      { keys: ['batin'], ar: 'الباطن' },
      { keys: ['duhail'], ar: 'الدحيل' },
      { keys: ['jeddah'], ar: 'الأهلي' }, // common "Ahli Jeddah"
    ];

    for (const rule of keywordRules) {
      if (rule.keys.some(k => normalized.includes(k))) {
        return rule.ar;
      }
    }
    // Heuristic: if it starts with "al " or "al-", replace with Arabic article
    if (/^al[\s-]/i.test(normalized)) {
      const rest = normalized.replace(/^al[\s-]/i, '').trim();
      // Capitalize first letter of each word back to title-ish for lookup
      const title = rest.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (TEAM_NAME_AR[title]) return TEAM_NAME_AR[title];
      // Fall back to prefixing ال to transliterated remainder (not perfect but better than English)
      return `ال${rest.replace(/\s+/g, ' ').trim()}`;
    }
  }
  return name;
}

export default getLocalizedTeamName;


