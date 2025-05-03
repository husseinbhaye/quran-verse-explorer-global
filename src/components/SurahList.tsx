
import React from 'react';
import { Surah } from '../types/quran';
import { GoToVerseSearch, SurahListContent, MobileSidebar } from './surah-list';

interface SurahListProps {
  surahs: Surah[];
  selectedSurah: number | null;
  onSelectSurah: (surahId: number) => void;
  displayLanguage: 'english' | 'french';
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

const SurahList = ({
  surahs,
  selectedSurah,
  onSelectSurah,
  displayLanguage,
  showMobile = false,
  onCloseMobile,
}: SurahListProps) => {
  
  const handleGotoVerse = (surahId: number, verse: number) => {
    console.log(`SurahList: Navigating to Surah ${surahId}, Verse ${verse}`);
    
    // First select the surah
    onSelectSurah(surahId);
    
    // Then scroll to the verse - use the specific ayah ID format
    setTimeout(() => {
      const ayahElementId = `ayah-${surahId}-${verse}`;
      console.log(`Looking for element with ID: ${ayahElementId}`);
      
      const element = document.getElementById(ayahElementId);
      if (element) {
        console.log(`Element found, scrolling to ${ayahElementId}`);
        element.scrollIntoView({ behavior: 'smooth' });
        // Add a brief highlight effect
        element.classList.add('highlight-ayah');
        setTimeout(() => {
          element.classList.remove('highlight-ayah');
        }, 2000);
      } else {
        console.error(`Element with ID ${ayahElementId} not found`);
      }
    }, 1000); // Increased timeout to give more time for content to load
  };

  const validateSurah = (surahId: number) => {
    return surahs.some(surah => surah.id === surahId);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-full md:w-64 bg-card border-r sticky top-0 h-screen hidden md:flex flex-col z-10">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            {displayLanguage === 'english' ? 'Chapters (Surahs)' : 'Chapitres (Sourates)'}
          </h2>
        </div>
        
        <GoToVerseSearch
          displayLanguage={displayLanguage}
          onGotoVerse={handleGotoVerse}
          validateSurah={validateSurah}
        />

        <SurahListContent
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSelectSurah={onSelectSurah}
          displayLanguage={displayLanguage}
        />
      </aside>
      
      {/* Mobile overlay */}
      <MobileSidebar
        show={showMobile}
        onClose={onCloseMobile || (() => {})}
        surahs={surahs}
        selectedSurah={selectedSurah}
        onSelectSurah={onSelectSurah}
        displayLanguage={displayLanguage}
        onGotoVerse={handleGotoVerse}
      />
    </>
  );
};

export default SurahList;
