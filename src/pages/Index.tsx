
import React, { useState } from 'react';
import Header from '../components/Header';
import SurahList from '../components/SurahList';
import SearchResults from '../components/SearchResults';
import MainContent from '../components/MainContent';
import { useQuranData } from '../hooks/useQuranData';
import { useQuranSearch } from '../hooks/useQuranSearch';

const Index = () => {
  const [displayLanguage, setDisplayLanguage] = useState<'english' | 'french'>('english');
  const [showBothTranslations, setShowBothTranslations] = useState(false);
  
  const { 
    surahs, 
    loading, 
    selectedSurah, 
    setSelectedSurah, 
    ayahs, 
    englishTranslations, 
    frenchTranslations 
  } = useQuranData({ displayLanguage });

  const {
    searchResults,
    searchTranslations,
    isSearching,
    showSearchResults,
    handleSearch,
    closeSearch
  } = useQuranSearch({ displayLanguage });

  const handleSelectSurah = (surahId: number) => {
    setSelectedSurah(surahId);
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
        />
      </div>

      {showSearchResults && (
        <SearchResults 
          results={searchResults}
          loading={isSearching}
          searchQuery={""}
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
