
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

interface GoToVerseSearchProps {
  displayLanguage: 'english' | 'french';
  onGotoVerse: (surahId: number, verseNumber: number) => void;
  validateSurah: (surahId: number) => boolean;
}

const GoToVerseSearch: React.FC<GoToVerseSearchProps> = ({
  displayLanguage,
  onGotoVerse,
  validateSurah
}) => {
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
    if (!validateSurah(surahId)) {
      toast({
        title: displayLanguage === 'english' ? 'Surah Not Found' : 'Sourate non trouvée',
        description: displayLanguage === 'english' 
          ? 'The requested surah could not be found' 
          : 'La sourate demandée est introuvable',
        variant: 'destructive',
      });
      return;
    }
    
    onGotoVerse(surahId, verse);
  };

  return (
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
  );
};

export default GoToVerseSearch;
