
import React, { useState } from 'react';
import { Surah } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

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
  const { toast } = useToast();
  
  const handleGotoVerse = () => {
    const surahId = parseInt(surahNumber, 10);
    const verse = parseInt(verseNumber, 10);
    
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
      toast({
        title: displayLanguage === 'english' ? 'Invalid Input' : 'Entrée invalide',
        description: displayLanguage === 'english' 
          ? 'Please enter a valid surah number (1-114)' 
          : 'Veuillez entrer un numéro de sourate valide (1-114)',
        variant: 'destructive',
      });
      return;
    }
    
    if (isNaN(verse) || verse < 1) {
      toast({
        title: displayLanguage === 'english' ? 'Invalid Input' : 'Entrée invalide',
        description: displayLanguage === 'english' 
          ? 'Please enter a valid verse number' 
          : 'Veuillez entrer un numéro de verset valide',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if surah exists in our data
    const surahExists = surahs.some(surah => surah.id === surahId);
    if (!surahExists) {
      toast({
        title: displayLanguage === 'english' ? 'Surah Not Found' : 'Sourate non trouvée',
        description: displayLanguage === 'english' 
          ? 'The requested surah could not be found' 
          : 'La sourate demandée est introuvable',
        variant: 'destructive',
      });
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
        toast({
          title: displayLanguage === 'english' ? 'Verse Not Found' : 'Verset non trouvé',
          description: displayLanguage === 'english' 
            ? `Could not find verse ${verse} in Surah ${surahId}` 
            : `Impossible de trouver le verset ${verse} dans la sourate ${surahId}`,
          variant: 'destructive',
        });
      }
    }, 800); // Increased timeout to give more time for content to load
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
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm mb-1 block">
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
            <div className="flex-1">
              <label className="text-sm mb-1 block">
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
            <Button 
              onClick={handleGotoVerse}
              className="h-9"
              variant="secondary"
            >
              Ok
            </Button>
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
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-sm mb-1 block">
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
                <div className="flex-1">
                  <label className="text-sm mb-1 block">
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
                <Button 
                  onClick={handleGotoVerse}
                  className="h-9"
                  variant="secondary"
                >
                  Ok
                </Button>
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
