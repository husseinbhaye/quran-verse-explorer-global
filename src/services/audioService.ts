
import { fetchFromAPI } from './api';

// Available reciters with their Quran API identifiers
export const RECITERS = {
  // Arabic reciters
  'ar.alafasy': { name: 'Mishary Rashid Alafasy', language: 'arabic' },
  'ar.abdulbasit': { name: 'Abdul Basit', language: 'arabic' },
  'ar.abdurrahmaansudais': { name: 'Abdurrahmaan As-Sudais', language: 'arabic' },
  'ar.hanirifai': { name: 'Hani Ar-Rifai', language: 'arabic' },
  'ar.husary': { name: 'Mahmoud Khalil Al-Husary', language: 'arabic' },
  'ar.minshawi': { name: 'Mohamed Siddiq al-Minshawi', language: 'arabic' },
  'ar.muhammadayyoub': { name: 'Muhammad Ayyoub', language: 'arabic' },
};

export type ReciterId = keyof typeof RECITERS;

/**
 * Get the audio URL for a specific ayah
 * @param surahId - The surah number
 * @param ayahId - The ayah number within the surah
 * @param reciterId - The reciter identifier
 * @returns The URL to the audio file
 */
export const getAudioUrl = (surahId: number, ayahId: number, reciterId: ReciterId = 'ar.alafasy'): string => {
  // Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/1_1.mp3 for surah 1, ayah 1
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${surahId}_${ayahId}.mp3`;
};

/**
 * Get the alternative audio URL if the primary URL fails
 * This uses a different format that some API endpoints might use
 */
export const getAlternativeAudioUrl = (surahId: number, ayahId: number, reciterId: ReciterId = 'ar.alafasy'): string => {
  // Alternative format with a colon separator: https://cdn.islamic.network/quran/audio/128/ar.alafasy/1:1.mp3
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${surahId}:${ayahId}.mp3`;
};

/**
 * Check if audio is available for a specific reciter
 * This is a utility function that can be used to verify if a specific reciter has audio available
 */
export const checkAudioAvailability = async (reciterId: ReciterId): Promise<boolean> => {
  try {
    const response = await fetchFromAPI(`/edition?format=audio&language=${RECITERS[reciterId].language}&identifier=${reciterId}`);
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error('Error checking audio availability:', error);
    return false;
  }
};
