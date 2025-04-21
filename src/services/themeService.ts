
import { Ayah } from '../types/quran';
import { fetchFromAPI } from './api';

// Common Islamic themes with their keywords for search
export interface ThemeOption {
  id: string;
  label: {
    english: string;
    french: string;
  };
  keywords: string[];
}

export const commonThemes: ThemeOption[] = [
  {
    id: 'salat',
    label: {
      english: 'Prayer (Salat)',
      french: 'Prière (Salat)'
    },
    keywords: ['prayer', 'salat', 'worship', 'prostration', 'bow', 'ruku']
  },
  {
    id: 'zakat',
    label: {
      english: 'Charity (Zakat)',
      french: 'Aumône (Zakat)'
    },
    keywords: ['charity', 'zakat', 'give', 'poor', 'needy', 'alms']
  },
  {
    id: 'sawm',
    label: {
      english: 'Fasting (Sawm)',
      french: 'Jeûne (Sawm)'
    },
    keywords: ['fast', 'fasting', 'ramadan', 'sawm', 'abstain']
  },
  {
    id: 'hajj',
    label: {
      english: 'Pilgrimage (Hajj)',
      french: 'Pèlerinage (Hajj)'
    },
    keywords: ['pilgrimage', 'hajj', 'kaaba', 'mecca', 'pilgrims']
  },
  {
    id: 'tawhid',
    label: {
      english: 'Monotheism (Tawhid)',
      french: 'Monothéisme (Tawhid)'
    },
    keywords: ['oneness', 'unity', 'tawhid', 'monotheism', 'one god']
  },
  {
    id: 'prophets',
    label: {
      english: 'Prophets',
      french: 'Prophètes'
    },
    keywords: ['prophet', 'messenger', 'muhammad', 'jesus', 'moses', 'abraham', 'noah']
  }
];

// Fetch verses related to a specific theme
export const fetchVersesByTheme = async (themeId: string, language: string = 'english'): Promise<Ayah[]> => {
  try {
    const theme = commonThemes.find(t => t.id === themeId);
    if (!theme) throw new Error(`Theme ${themeId} not found`);
    
    // Use the first keyword for the search to get started
    // In a production app, this would be more sophisticated
    const keyword = theme.keywords[0];
    
    console.log(`Searching for theme ${themeId} using keyword: ${keyword}`);
    
    // Use the existing search endpoint
    const results = await fetchFromAPI(`/search/${encodeURIComponent(keyword)}/all/en.sahih`);
    
    return results.data.matches.map((match: any) => ({
      number: match.number,
      text: match.text,
      surah: match.surah.number,
      numberInSurah: match.numberInSurah
    }));
  } catch (error) {
    console.error(`Error fetching verses for theme ${themeId}:`, error);
    throw error;
  }
};
