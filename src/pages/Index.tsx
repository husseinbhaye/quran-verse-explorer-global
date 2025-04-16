
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Surah, Ayah, Translation, Language } from '../types/quran';
import { fetchSurahs, fetchAyahsBySurah, fetchTranslationBySurah, searchQuran } from '../services/quranService';
import Header from '../components/Header';
import SurahList from '../components/SurahList';
import SurahView from '../components/SurahView';
import LanguageSelector from '../components/LanguageSelector';
import SearchResults from '../components/SearchResults';

const Index = () => {
  const { toast } = useToast();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [englishTranslations, setEnglishTranslations] = useState<Translation[]>([]);
  const [frenchTranslations, setFrenchTranslations] = useState<Translation[]>([]);
  const [displayLanguage, setDisplayLanguage] = useState<'english' | 'french'>('english');
  const [showBothTranslations, setShowBothTranslations] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ayah[]>([]);
  const [searchTranslations, setSearchTranslations] = useState<{
    english: Record<number, Translation>;
    french: Record<number, Translation>;
  }>({
    english: {},
    french: {}
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
  }, []);

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
  }, [selectedSurah]);

  const handleSelectSurah = (surahId: number) => {
    setSelectedSurah(surahId);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setShowSearchResults(true);
    setIsSearching(true);

    try {
      // Search in all three languages
      const [arabicResults, englishResults, frenchResults] = await Promise.all([
        searchQuran(query, 'arabic'),
        searchQuran(query, 'english'),
        searchQuran(query, 'french')
      ]);

      // Combine and deduplicate results
      const allResults = [...arabicResults];
      const ayahNumbers = new Set(allResults.map(ayah => ayah.number));
      
      [...englishResults, ...frenchResults].forEach(ayah => {
        if (!ayahNumbers.has(ayah.number)) {
          ayahNumbers.add(ayah.number);
          allResults.push(ayah);
        }
      });

      setSearchResults(allResults);

      // Create translation lookup maps
      const englishMap: Record<number, Translation> = {};
      const frenchMap: Record<number, Translation> = {};
      
      englishResults.forEach(ayah => {
        englishMap[ayah.number] = {
          text: ayah.text,
          ayah: ayah.number,
          language: 'english'
        };
      });
      
      frenchResults.forEach(ayah => {
        frenchMap[ayah.number] = {
          text: ayah.text,
          ayah: ayah.number,
          language: 'french'
        };
      });

      setSearchTranslations({
        english: englishMap,
        french: frenchMap
      });

    } catch (error) {
      toast({
        title: displayLanguage === 'english' ? 'Search Error' : 'Erreur de recherche',
        description: displayLanguage === 'english' 
          ? 'Failed to search the Quran' 
          : 'Échec de la recherche dans le Coran',
        variant: 'destructive',
      });
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const closeSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const selectedSurahData = selectedSurah ? surahs.find(s => s.id === selectedSurah) || null : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />

      <div className="flex-1 flex flex-col md:flex-row">
        <SurahList 
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSelectSurah={handleSelectSurah}
          displayLanguage={displayLanguage}
        />

        <div className="flex-1 flex flex-col">
          <SurahView 
            surah={selectedSurahData}
            ayahs={ayahs}
            englishTranslations={englishTranslations}
            frenchTranslations={frenchTranslations}
            loading={loading}
            showBothTranslations={showBothTranslations}
          />
          
          <LanguageSelector 
            displayLanguage={displayLanguage}
            setDisplayLanguage={setDisplayLanguage}
            showBothTranslations={showBothTranslations}
            setShowBothTranslations={setShowBothTranslations}
          />
        </div>
      </div>

      {showSearchResults && (
        <SearchResults 
          results={searchResults}
          loading={isSearching}
          searchQuery={searchQuery}
          englishTranslations={searchTranslations.english}
          frenchTranslations={searchTranslations.french}
          onClose={closeSearch}
          displayLanguage={displayLanguage}
          showBothTranslations={showBothTranslations}
        />
      )}
    </div>
  );
};

export default Index;
