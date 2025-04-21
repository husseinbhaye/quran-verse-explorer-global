
import React, { useState } from 'react';
import Header from '../components/Header';
import SurahList from '../components/SurahList';
import SearchResults from '../components/SearchResults';
import MainContent from '../components/MainContent';
import { useQuranData } from '../hooks/useQuranData';
import { useQuranSearch } from '../hooks/useQuranSearch';
import SidebarToggleButton from '../components/SidebarToggleButton';
import { useIsMobile } from '../hooks/use-mobile';

const Index = () => {
  const [displayLanguage, setDisplayLanguage] = useState<'english' | 'french'>('english');
  const [showBothTranslations, setShowBothTranslations] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

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
  };

  const selectedSurahData = selectedSurah ? surahs.find(s => s.id === selectedSurah) || null : null;

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header onSearch={handleSearch} />

      <div className="flex-1 flex flex-col md:flex-row relative w-full">
        {/* Sidebar toggle for mobile */}
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

        {/* Main content: always takes max width */}
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
    </div>
  );
};

export default Index;
