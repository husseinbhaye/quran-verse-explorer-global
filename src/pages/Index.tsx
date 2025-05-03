
import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import SurahList from '../components/SurahList';
import SearchResults from '../components/SearchResults';
import MainContent from '../components/MainContent';
import { useQuranData } from '../hooks/useQuranData';
import { useQuranSearch } from '../hooks/useQuranSearch';
import SidebarToggleButton from '../components/SidebarToggleButton';
import { useIsMobile } from '../hooks/use-mobile';
import { fetchVersesByTheme } from '../services/themeService';
import { useToast } from '@/components/ui/use-toast';
import { Ayah, Translation } from '../types/quran';

const Index = () => {
  const [displayLanguage, setDisplayLanguage] = React.useState<'english' | 'french'>('english');
  const [showBothTranslations, setShowBothTranslations] = React.useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = React.useState(false);
  const [textSize, setTextSize] = React.useState<"sm" | "base" | "lg" | "xl">("base");
  const [themeResults, setThemeResults] = useState<{
    theme: string;
    results: Ayah[];
    translations: {
      english: Record<number, Translation>;
      french: Record<number, Translation>;
    }
  } | null>(null);

  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { 
    surahs, 
    loading, 
    selectedSurah, 
    setSelectedSurah,
    ayahs, 
    englishTranslations, 
    frenchTranslations,
    goToAyah
  } = useQuranData({ displayLanguage });

  const {
    searchQuery,
    searchResults,
    searchTranslations,
    isSearching,
    showSearchResults,
    handleSearch,
    closeSearch
  } = useQuranSearch({ displayLanguage });

  const handleSelectSurah = (surahId: number) => {
    setSelectedSurah(surahId);
    if (isMobile) setShowSidebarMobile(false);
    setThemeResults(null);
  };

  const handleSetTextSize = useCallback((size: "sm" | "base" | "lg" | "xl") => {
    console.log("Index: Setting text size to:", size);
    setTextSize(size);
  }, []);

  const handleThemeSelect = async (themeId: string) => {
    try {
      if (showSearchResults) {
        closeSearch();
      }
      
      toast({
        title: displayLanguage === 'english' ? 'Loading theme verses' : 'Chargement des versets thématiques',
        description: displayLanguage === 'english' ? 'Please wait...' : 'Veuillez patienter...',
      });
      
      const results = await fetchVersesByTheme(themeId, displayLanguage);
      
      const englishMap: Record<number, Translation> = {};
      
      results.forEach(ayah => {
        englishMap[ayah.number] = {
          text: ayah.text,
          ayah: ayah.number,
          language: 'english'
        };
      });
      
      setThemeResults({
        theme: themeId,
        results,
        translations: {
          english: englishMap,
          french: englishMap
        }
      });
      
      toast({
        title: displayLanguage === 'english' ? 'Theme verses loaded' : 'Versets thématiques chargés',
        description: displayLanguage === 'english' 
          ? `Found ${results.length} verses related to this theme` 
          : `Trouvé ${results.length} versets liés à ce thème`,
      });
      
    } catch (error) {
      console.error('Error loading theme verses:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english'
          ? 'Failed to load themed verses'
          : 'Échec du chargement des versets thématiques',
        variant: 'destructive',
      });
    }
  };

  const closeThemeResults = () => {
    setThemeResults(null);
  };

  React.useEffect(() => {
    console.log("Current text size in Index:", textSize);
  }, [textSize]);

  const selectedSurahData = selectedSurah ? surahs.find(s => s.id === selectedSurah) || null : null;

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header 
        onSearch={handleSearch} 
        onThemeSelect={handleThemeSelect}
        displayLanguage={displayLanguage}
        textSize={textSize}
        setTextSize={handleSetTextSize}
        onSelectAyah={goToAyah}
      />

      <div className="flex-1 flex flex-col md:flex-row relative w-full">
        {isMobile && (
          <SidebarToggleButton onClick={() => setShowSidebarMobile(true)} />
        )}
        <SurahList 
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSelectSurah={handleSelectSurah}
          displayLanguage={displayLanguage}
          showMobile={isMobile && showSidebarMobile}
          onCloseMobile={() => setShowSidebarMobile(false)}
        />

        <main className="flex-1 w-full max-w-full min-w-0">
          <MainContent 
            selectedSurah={selectedSurahData}
            ayahs={ayahs}
            englishTranslations={englishTranslations}
            frenchTranslations={frenchTranslations}
            loading={loading}
            showBothTranslations={showBothTranslations}
            displayLanguage={displayLanguage}
            setDisplayLanguage={setDisplayLanguage}
            setShowBothTranslations={setShowBothTranslations}
            onSelectAyah={goToAyah}
            textSize={textSize}
            setTextSize={handleSetTextSize}
          />
        </main>
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
      
      {themeResults && (
        <SearchResults 
          results={themeResults.results}
          loading={false}
          searchQuery={displayLanguage === 'english' 
            ? `Theme: ${themeResults.theme}`
            : `Thème: ${themeResults.theme}`}
          englishTranslations={themeResults.translations.english}
          frenchTranslations={themeResults.translations.french}
          onClose={closeThemeResults}
          displayLanguage={displayLanguage}
          showBothTranslations={showBothTranslations}
        />
      )}
    </div>
  );
};

export default Index;
