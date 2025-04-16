
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Surah, Ayah, Translation } from '../types/quran';
import { fetchSurahs, fetchAyahsBySurah, fetchTranslationBySurah } from '../services/quranService';

interface UseQuranDataProps {
  displayLanguage: 'english' | 'french';
}

export const useQuranData = ({ displayLanguage }: UseQuranDataProps) => {
  const { toast } = useToast();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [englishTranslations, setEnglishTranslations] = useState<Translation[]>([]);
  const [frenchTranslations, setFrenchTranslations] = useState<Translation[]>([]);

  // Fetch surahs on initial load
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (error) {
        toast({
          title: displayLanguage === 'english' ? 'Error' : 'Erreur',
          description: displayLanguage === 'english' 
            ? 'Failed to load Quran chapters' 
            : 'Échec du chargement des chapitres du Coran',
          variant: 'destructive',
        });
        console.error('Failed to load surahs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, [displayLanguage, toast]);

  // Fetch ayahs and translations when a surah is selected
  useEffect(() => {
    if (!selectedSurah) return;

    const loadSurahContent = async () => {
      setLoading(true);
      try {
        const [arabicAyahs, englishTrans, frenchTrans] = await Promise.all([
          fetchAyahsBySurah(selectedSurah),
          fetchTranslationBySurah(selectedSurah, 'english'),
          fetchTranslationBySurah(selectedSurah, 'french')
        ]);

        setAyahs(arabicAyahs);
        setEnglishTranslations(englishTrans);
        setFrenchTranslations(frenchTrans);
      } catch (error) {
        toast({
          title: displayLanguage === 'english' ? 'Error' : 'Erreur',
          description: displayLanguage === 'english' 
            ? 'Failed to load Surah content' 
            : 'Échec du chargement du contenu de la sourate',
          variant: 'destructive',
        });
        console.error('Failed to load surah content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurahContent();
  }, [selectedSurah, displayLanguage, toast]);

  return {
    surahs,
    loading,
    selectedSurah,
    setSelectedSurah,
    ayahs,
    englishTranslations,
    frenchTranslations
  };
};
