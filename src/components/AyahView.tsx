import React from 'react';
import { Ayah, Translation } from '../types/quran';
import { Card } from './ui/card';
import BookmarkButton from './BookmarkButton';
import { AudioPlayer } from './audio';
import { Button } from './ui/button';
import { Share2 } from 'lucide-react';
import NoteDialog from './NoteDialog';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface AyahViewProps {
  ayah: Ayah;
  englishTranslation?: Translation;
  frenchTranslation?: Translation;
  showBoth: boolean;
  surahName: string;
  displayLanguage: 'english' | 'french';
}

const AyahView = ({ 
  ayah, 
  englishTranslation, 
  frenchTranslation, 
  showBoth, 
  surahName,
  displayLanguage 
}: AyahViewProps) => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    console.log(`AyahView ${ayah.numberInSurah} - Current language: ${displayLanguage}`);
    console.log(`  English translation: ${englishTranslation?.text?.substring(0, 20)}...`);
    console.log(`  French translation: ${frenchTranslation?.text?.substring(0, 20)}...`);
  }, [ayah.numberInSurah, displayLanguage, englishTranslation, frenchTranslation]);

  const primaryTranslation = displayLanguage === 'english' ? englishTranslation : frenchTranslation;

  const getShareText = () => {
    const surahAyah = `${surahName} ${ayah.surah}:${ayah.numberInSurah}`;
    const arabicText = ayah.text;
    const translationText = primaryTranslation?.text || '';
    
    return `${surahAyah}\n\n${arabicText}\n\n${translationText}`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`, '_blank');
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(getShareText());
    toast({
      title: displayLanguage === 'english' ? 'Copied to clipboard' : 'Copié dans le presse-papiers',
      duration: 2000,
    });
  };

  return (
    <Card 
      id={`ayah-${ayah.surah}-${ayah.numberInSurah}`}
      className="mb-6 overflow-hidden border-quran-primary/20 shadow-sm transition-colors"
    >
      <div className="bg-quran-primary/10 px-4 py-2 flex justify-between items-center border-b border-quran-primary/20">
        <span className="text-sm font-medium">
          {ayah.surah}:{ayah.numberInSurah}
        </span>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="end" className="w-56">
              <div className="flex flex-col gap-2">
                <h4 className="font-medium text-sm">
                  {displayLanguage === 'english' ? 'Share verse' : 'Partager le verset'}
                </h4>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleShareWhatsApp}
                >
                  WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleShareTwitter}
                >
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleShareFacebook}
                >
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleShareCopy}
                >
                  {displayLanguage === 'english' ? 'Copy to clipboard' : 'Copier dans le presse-papiers'}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <BookmarkButton 
            ayah={ayah} 
            surahName={surahName} 
            displayLanguage={displayLanguage} 
          />
          <span className="bg-quran-primary text-white text-xs px-2 py-1 rounded-md">
            آية {ayah.numberInSurah}
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="arabic text-right mb-6 px-4" dir="rtl">
          {ayah.text}
        </p>

        <AudioPlayer 
          surahId={ayah.surah} 
          ayahId={ayah.numberInSurah} 
          className="mt-4 mb-2" 
        />

        {primaryTranslation && (
          <div className="mt-4 pt-4 border-t border-quran-primary/10">
            <h4 className="text-sm text-quran-primary font-medium mb-1">
              {displayLanguage === 'english' ? 'English' : 'Français'}
            </h4>
            <p className="text-gray-700">{primaryTranslation.text}</p>
            <NoteDialog 
              surahId={ayah.surah} 
              ayahNumber={ayah.numberInSurah}
              displayLanguage={displayLanguage}
            />
          </div>
        )}

        {(displayLanguage === 'english' ? frenchTranslation : englishTranslation) && showBoth && (
          <div className="mt-4 pt-4 border-t border-quran-primary/10">
            <h4 className="text-sm text-quran-primary font-medium mb-1">
              {displayLanguage === 'english' ? 'Français' : 'English'}
            </h4>
            <p className="text-gray-700">
              {displayLanguage === 'english' ? frenchTranslation?.text : englishTranslation?.text}
            </p>
            <NoteDialog 
              surahId={ayah.surah} 
              ayahNumber={ayah.numberInSurah}
              displayLanguage={displayLanguage}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default AyahView;
