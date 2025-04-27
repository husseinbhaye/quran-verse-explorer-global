
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Surah, Ayah, Translation } from '../types/quran';
import { fetchSurahs, fetchAyahsBySurah, fetchTranslationBySurah } from '../services';

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

  // Add specific log for language changes to track when it happens
  useEffect(() => {
    console.log('useQuranData - displayLanguage changed to:', displayLanguage);
  }, [displayLanguage]);

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

  // Fetch ayahs and translations when a surah is selected OR language changes
  useEffect(() => {
    if (!selectedSurah) return;
    
    console.log('Loading surah content for', selectedSurah, 'with language:', displayLanguage);

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
        
        console.log('Translations loaded:', {
          english: englishTrans.length,
          french: frenchTrans.length,
          englishSample: englishTrans[0]?.text.substring(0, 20),
          frenchSample: frenchTrans[0]?.text.substring(0, 20),
          currentLanguage: displayLanguage
        });
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

  // Function to navigate to a specific ayah
  const goToAyah = async (surahId: number, ayahNumber: number) => {
    try {
      // If it's a different surah than currently selected, change surah first
      if (surahId !== selectedSurah) {
        setSelectedSurah(surahId);
        
        // Wait for the content to load before scrolling
        toast({
          title: displayLanguage === 'english' ? 'Loading verse' : 'Chargement du verset',
          description: displayLanguage === 'english' 
            ? 'Please wait while we load the content' 
            : 'Veuillez patienter pendant le chargement',
        });
        
        // Add a delay to ensure content is loaded
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (!loading && ayahs.length > 0) {
              clearInterval(checkInterval);
              resolve(true);
            }
          }, 200);
          
          // Timeout after 5 seconds just in case
          setTimeout(() => {
            clearInterval(checkInterval);
            resolve(false);
          }, 5000);
        });
      }
      
      // Scroll to the ayah with a delay to ensure the DOM is ready
      setTimeout(() => {
        const ayahElement = document.getElementById(`ayah-${surahId}-${ayahNumber}`);
        if (ayahElement) {
          ayahElement.scrollIntoView({ behavior: 'smooth' });
          ayahElement.classList.add('highlight-ayah');
          setTimeout(() => {
            ayahElement.classList.remove('highlight-ayah');
          }, 2000);
        } else {
          console.error('Ayah element not found:', `ayah-${surahId}-${ayahNumber}`);
          
          // Show error toast
          toast({
            title: displayLanguage === 'english' ? 'Error' : 'Erreur',
            description: displayLanguage === 'english' 
              ? 'Could not find the requested verse' 
              : 'Impossible de trouver le verset demandé',
            variant: 'destructive',
          });
        }
      }, 500);
    } catch (error) {
      console.error('Error navigating to ayah:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english' 
          ? 'Failed to navigate to the verse' 
          : 'Échec de la navigation vers le verset',
        variant: 'destructive',
      });
    }
  };

  return {
    surahs,
    loading,
    selectedSurah,
    setSelectedSurah,
    ayahs,
    englishTranslations,
    frenchTranslations,
    goToAyah
  };
};
