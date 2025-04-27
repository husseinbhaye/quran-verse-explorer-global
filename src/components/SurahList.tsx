
import React from 'react';
import { Surah } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import VerseSelector from './VerseSelector';
import SubjectFilter from './SubjectFilter';

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
  const selectedSurahData = selectedSurah ? surahs.find(s => s.id === selectedSurah) : null;

  const handleVerseSelect = (verse: number) => {
    console.log('Selected verse:', verse);
    if (selectedSurah) {
      const element = document.getElementById(`ayah-${selectedSurah}-${verse}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Add a brief highlight effect
        element.classList.add('highlight-ayah');
        setTimeout(() => {
          element.classList.remove('highlight-ayah');
        }, 2000);
      } else {
        console.log('Element not found:', `ayah-${selectedSurah}-${verse}`);
      }
    }
  };

  const handleSubjectSelect = (subject: string) => {
    console.log('Selected subject:', subject);
    // This will be implemented when the theme/subject filtering API is ready
  };

  // Mobile overlay for small screens
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-full md:w-64 bg-card border-r sticky top-0 h-screen hidden md:flex flex-col z-10">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            {displayLanguage === 'english' ? 'Chapters (Surahs)' : 'Chapitres (Sourates)'}
          </h2>
        </div>
        
        <div className="p-3 space-y-3 border-b">
          <VerseSelector
            totalVerses={selectedSurahData?.numberOfAyahs || 0}
            onSelectVerse={handleVerseSelect}
            displayLanguage={displayLanguage}
          />
          <SubjectFilter
            onSelectSubject={handleSubjectSelect}
            displayLanguage={displayLanguage}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="p-2">
            {surahs.map((surah) => (
              <Button
                key={surah.id}
                variant="ghost"
                className={`w-full justify-between mb-1 ${
                  selectedSurah === surah.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : ''
                }`}
                onClick={() => onSelectSurah(surah.id)}
              >
                <span className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-quran-primary/10 text-xs mr-2">
                    {surah.id}
                  </span>
                  <span className="text-left">
                    {displayLanguage === 'english' ? surah.englishName : surah.frenchName}
                  </span>
                </span>
                <span className="arabic text-xs opacity-80">{surah.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>
      
      {/* Mobile overlay */}
      {showMobile && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-40 md:hidden flex">
          <aside className="w-4/5 max-w-xs bg-card border-r shadow-lg h-full flex flex-col z-50 animate-in slide-in-from-left fill-mode-forwards">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {displayLanguage === 'english' ? 'Chapters (Surahs)' : 'Chapitres (Sourates)'}
              </h2>
              <button
                className="ml-3 text-lg font-bold text-quran-primary"
                aria-label="Close menu"
                onClick={onCloseMobile}
              >
                ×
              </button>
            </div>

            <div className="p-3 space-y-3 border-b">
              <VerseSelector
                totalVerses={selectedSurahData?.numberOfAyahs || 0}
                onSelectVerse={handleVerseSelect}
                displayLanguage={displayLanguage}
              />
              <SubjectFilter
                onSelectSubject={handleSubjectSelect}
                displayLanguage={displayLanguage}
              />
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {surahs.map((surah) => (
                  <Button
                    key={surah.id}
                    variant="ghost"
                    className={`w-full justify-between mb-1 ${
                      selectedSurah === surah.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : ''
                    }`}
                    onClick={() => {
                      onSelectSurah(surah.id);
                      onCloseMobile && onCloseMobile();
                    }}
                  >
                    <span className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-quran-primary/10 text-xs mr-2">
                        {surah.id}
                      </span>
                      <span className="text-left">
                        {displayLanguage === 'english' ? surah.englishName : surah.frenchName}
                      </span>
                    </span>
                    <span className="arabic text-xs opacity-80">{surah.name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </aside>
          {/* Closes when clicking outside the sidebar */}
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};

export default SurahList;
