
import { Surah } from '../types/quran';
import { fetchFromAPI } from './api';
import { getFrenchSurahName } from './translationUtils';

// Fetch all surahs
export const fetchSurahs = async (): Promise<Surah[]> => {
  try {
    const data = await fetchFromAPI('/surah');
    
    // Add French names
    return data.data.map((surah: any) => ({
      id: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      englishNameTranslation: surah.englishNameTranslation,
      frenchName: getFrenchSurahName(surah.number, surah.englishName),
      numberOfAyahs: surah.numberOfAyahs,
      revelationType: surah.revelationType
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

// Fetch ayahs for a specific surah
export const fetchAyahsBySurah = async (surahId: number) => {
  try {
    const data = await fetchFromAPI(`/surah/${surahId}`);
    
    return data.data.ayahs.map((ayah: any) => ({
      number: ayah.number,
      text: ayah.text,
      surah: surahId,
      numberInSurah: ayah.numberInSurah
    }));
  } catch (error) {
    console.error(`Error fetching ayahs for surah ${surahId}:`, error);
    throw error;
  }
};
