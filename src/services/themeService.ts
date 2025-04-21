
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
  },
  // --- Additional topics below ---
  {
    id: 'patience',
    label: {
      english: 'Patience',
      french: 'Patience'
    },
    keywords: ['patience', 'steadfast', 'endure', 'persevere', 'perseverance']
  },
  {
    id: 'gratitude',
    label: {
      english: 'Gratitude',
      french: 'Reconnaissance'
    },
    keywords: ['gratitude', 'thankful', 'thanks', 'thanksgiving', 'appreciate']
  },
  {
    id: 'forgiveness',
    label: {
      english: 'Forgiveness',
      french: 'Pardon'
    },
    keywords: ['forgive', 'forgiveness', 'pardon', 'merciful']
  },
  {
    id: 'paradise',
    label: {
      english: 'Paradise (Jannah)',
      french: 'Paradis (Jannah)'
    },
    keywords: ['paradise', 'jannah', 'gardens', 'delight', 'reward']
  },
  {
    id: 'hellfire',
    label: {
      english: 'Hellfire (Jahannam)',
      french: 'Enfer (Jahannam)'
    },
    keywords: ['hell', 'hellfire', 'jahannam', 'punishment', 'fire']
  },
  {
    id: 'justice',
    label: {
      english: 'Justice',
      french: 'Justice'
    },
    keywords: ['justice', 'fair', 'fairness', 'right', 'judge', 'judgement']
  },
  {
    id: 'family',
    label: {
      english: 'Family & Parents',
      french: 'Famille & Parents'
    },
    keywords: ['family', 'parents', 'mother', 'father', 'children', 'kin']
  },
  {
    id: 'knowledge',
    label: {
      english: 'Knowledge',
      french: 'Connaissance'
    },
    keywords: ['knowledge', 'wisdom', 'learn', 'teaching', 'understanding']
  },
  {
    id: 'creation',
    label: {
      english: 'Creation',
      french: 'Création'
    },
    keywords: ['creation', 'created', 'create', 'universe', 'earth', 'sky', 'heavens']
  },
  {
    id: 'dua',
    label: {
      english: 'Supplication (Dua)',
      french: 'Invocation (Dua)'
    },
    keywords: ['supplication', 'dua', 'call', 'invoke', 'pray']
  },
  {
    id: 'faith',
    label: {
      english: 'Faith (Iman)',
      french: 'Foi (Iman)'
    },
    keywords: ['faith', 'belief', 'iman', 'trust', 'certainty']
  },
  {
    id: 'repentance',
    label: {
      english: 'Repentance (Tawbah)',
      french: 'Repentir (Tawbah)'
    },
    keywords: ['repent', 'repentance', 'tawbah', 'return', 'regret']
  },
  {
    id: 'mercy',
    label: {
      english: 'Mercy',
      french: 'Miséricorde'
    },
    keywords: ['mercy', 'merciful', 'compassion', 'kindness']
  },
  {
    id: 'truth',
    label: {
      english: 'Truth & Honesty',
      french: 'Vérité & Honnêteté'
    },
    keywords: ['truth', 'truthful', 'honesty', 'sincere', 'honest']
  },
  {
    id: 'guidance',
    label: {
      english: 'Guidance',
      french: 'Guidance'
    },
    keywords: ['guide', 'guidance', 'show', 'direction', 'path']
  },
  {
    id: 'wealth',
    label: {
      english: 'Wealth & Provision',
      french: 'Richesse & Subsistance'
    },
    keywords: ['wealth', 'provision', 'sustain', 'sustenance', 'rizq', 'rich']
  },
  {
    id: 'evil',
    label: {
      english: 'Evil & Sin',
      french: 'Mal & Péché'
    },
    keywords: ['evil', 'sin', 'wrong', 'wicked', 'transgress']
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
