
import React, { useState } from 'react';
import { Surah } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
  const [surahNumber, setSurahNumber] = useState<string>('');
  const [verseNumber, setVerseNumber] = useState<string>('');
  
  const handleGotoVerse = () => {
    const surahId = parseInt(surahNumber, 10);
    const verse = parseInt(verseNumber, 10);
    
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
      console.log('Invalid surah number');
      return;
    }
    
    if (isNaN(verse) || verse < 1) {
      console.log('Invalid verse number');
      return;
    }
    
    // First select the surah
    onSelectSurah(surahId);
    
    // Then scroll to the verse
    setTimeout(() => {
      const element = document.getElementById(`ayah-${surahId}-${verse}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Add a brief highlight effect
        element.classList.add('highlight-ayah');
        setTimeout(() => {
          element.classList.remove('highlight-ayah');
        }, 2000);
      } else {
        console.log('Element not found:', `ayah-${surahId}-${verse}`);
      }
    }, 100);
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
          <div className="flex items-center gap-2">
            <div className="flex-1 flex flex-col">
              <label className="text-sm mb-1">
                {displayLanguage === 'english' ? 'Surah' : 'Sourate'}
              </label>
              <Input
                type="number"
                min="1"
                max="114"
                value={surahNumber}
                onChange={(e) => setSurahNumber(e.target.value)}
                placeholder={displayLanguage === 'english' ? '1-114' : '1-114'}
                className="h-9"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm mb-1">
                {displayLanguage === 'english' ? 'Verse' : 'Verset'}
              </label>
              <Input
                type="number"
                min="1"
                value={verseNumber}
                onChange={(e) => setVerseNumber(e.target.value)}
                placeholder={displayLanguage === 'english' ? 'Number' : 'Numéro'}
                className="h-9"
              />
            </div>
            <div className="flex flex-col justify-end">
              <Button 
                onClick={handleGotoVerse}
                className="h-9"
                variant="secondary"
              >
                Ok
              </Button>
            </div>
          </div>
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
              <div className="flex items-center gap-2">
                <div className="flex-1 flex flex-col">
                  <label className="text-sm mb-1">
                    {displayLanguage === 'english' ? 'Surah' : 'Sourate'}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="114"
                    value={surahNumber}
                    onChange={(e) => setSurahNumber(e.target.value)}
                    placeholder={displayLanguage === 'english' ? '1-114' : '1-114'}
                    className="h-9"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="text-sm mb-1">
                    {displayLanguage === 'english' ? 'Verse' : 'Verset'}
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={verseNumber}
                    onChange={(e) => setVerseNumber(e.target.value)}
                    placeholder={displayLanguage === 'english' ? 'Number' : 'Numéro'}
                    className="h-9"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Button 
                    onClick={handleGotoVerse}
                    className="h-9"
                    variant="secondary"
                  >
                    Ok
                  </Button>
                </div>
              </div>
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
