
import { Translation } from '../types/quran';
import { fetchFromAPI } from './api';

// Map language to the appropriate edition code
export const getEditionCode = (language: string): string => {
  console.log('Getting edition code for language:', language);
  switch (language.toLowerCase()) {
    case 'english': return 'en.sahih';
    case 'french': return 'fr.hamidullah';
    case 'arabic': return 'quran-uthmani';
    default: return 'en.sahih';
  }
};

// Fetch translation for a specific surah
export const fetchTranslationBySurah = async (surahId: number, language: string): Promise<Translation[]> => {
  const editionCode = getEditionCode(language);
  console.log(`Fetching translation for surah ${surahId} in ${language} using edition: ${editionCode}`);
  
  try {
    const data = await fetchFromAPI(`/surah/${surahId}/${editionCode}`);
    
    // Add additional logging to trace translation data
    console.log(`Retrieved ${data.data.ayahs.length} translations for ${language} edition ${editionCode}`);
    if (data.data.ayahs.length > 0) {
      console.log(`First verse sample: ${data.data.ayahs[0].text.substring(0, 30)}`);
    }
    
    return data.data.ayahs.map((ayah: any) => ({
      text: ayah.text,
      ayah: ayah.number,
      language
    }));
  } catch (error) {
    console.error(`Error fetching ${language} translation for surah ${surahId}:`, error);
    throw error;
  }
};

// Search the Quran
export const searchQuran = async (query: string, language: string = 'arabic') => {
  try {
    const editionCode = getEditionCode(language);
    console.log(`Searching in ${language} edition ${editionCode} for query: ${query}`);
    
    const data = await fetchFromAPI(`/search/${encodeURIComponent(query)}/all/${editionCode}`);
    
    return data.data.matches.map((match: any) => ({
      number: match.number,
      text: match.text,
      surah: match.surah.number,
      numberInSurah: match.numberInSurah
    }));
  } catch (error) {
    console.error(`Error searching for "${query}":`, error);
    throw error;
  }
};
