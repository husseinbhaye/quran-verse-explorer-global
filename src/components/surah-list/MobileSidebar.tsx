
import React from 'react';
import { Surah } from '../../types/quran';
import GoToVerseSearch from './GoToVerseSearch';
import SurahListContent from './SurahListContent';

interface MobileSidebarProps {
  show: boolean;
  onClose: () => void;
  surahs: Surah[];
  selectedSurah: number | null;
  onSelectSurah: (surahId: number) => void;
  displayLanguage: 'english' | 'french';
  onGotoVerse: (surahId: number, verseNumber: number) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  show,
  onClose,
  surahs,
  selectedSurah,
  onSelectSurah,
  displayLanguage,
  onGotoVerse
}) => {
  const validateSurah = (surahId: number) => {
    return surahs.some(surah => surah.id === surahId);
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-40 md:hidden flex">
      <aside className="w-4/5 max-w-xs bg-card border-r shadow-lg h-full flex flex-col z-50 animate-in slide-in-from-left fill-mode-forwards">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {displayLanguage === 'english' ? 'Chapters (Surahs)' : 'Chapitres (Sourates)'}
          </h2>
          <button
            className="ml-3 text-lg font-bold text-quran-primary"
            aria-label="Close menu"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <GoToVerseSearch 
          displayLanguage={displayLanguage}
          onGotoVerse={onGotoVerse}
          validateSurah={validateSurah}
        />

        <SurahListContent
          surahs={surahs}
          selectedSurah={selectedSurah}
          onSelectSurah={onSelectSurah}
          displayLanguage={displayLanguage}
          onCloseMobile={onClose}
        />
      </aside>
      {/* Closes when clicking outside the sidebar */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default MobileSidebar;
