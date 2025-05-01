
import React from 'react';
import { Ayah, Translation } from '../types/quran';
import AudioPlayer from './audio';
import BookmarkButton from './BookmarkButton';
import TextEditor from './TextEditor';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface AyahViewProps {
  ayah: Ayah;
  englishTranslation?: Translation;
  frenchTranslation?: Translation;
  showBoth: boolean;
  surahName: string;
  displayLanguage: 'english' | 'french';
  textSize?: "sm" | "base" | "lg" | "xl";
}

const AyahView = ({
  ayah,
  englishTranslation,
  frenchTranslation,
  showBoth,
  surahName,
  displayLanguage,
  textSize = "base"
}: AyahViewProps) => {
  const { toast } = useToast();
  
  const arabicSize = {
    sm: "text-xl",
    base: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl"
  }[textSize];
  
  const translationSize = {
    sm: "text-xs",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  }[textSize];

  const handleShare = async () => {
    const url = `${window.location.origin}/surah/${ayah.surah}/${ayah.numberInSurah}`;
    const shareText = displayLanguage === 'english'
      ? `${surahName} ${ayah.numberInSurah} - Read Quran`
      : `${surahName} ${ayah.numberInSurah} - Lire le Coran`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareText,
          text: ayah.text,
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: displayLanguage === 'english' ? 'Link copied!' : 'Lien copié!',
          description: displayLanguage === 'english' 
            ? 'Verse link copied to clipboard' 
            : 'Lien du verset copié dans le presse-papiers'
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fall back to clipboard if sharing fails
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: displayLanguage === 'english' ? 'Link copied!' : 'Lien copié!',
          description: displayLanguage === 'english' 
            ? 'Verse link copied to clipboard' 
            : 'Lien du verset copié dans le presse-papiers'
        });
      } catch (clipboardError) {
        toast({
          title: displayLanguage === 'english' ? 'Error' : 'Erreur',
          description: displayLanguage === 'english' 
            ? 'Failed to share or copy link' 
            : 'Impossible de partager ou copier le lien',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="bg-white/80 dark:bg-card/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-black/5 hover:shadow-xl transition-shadow duration-300">
      <p 
        className={`arabic text-right leading-relaxed mb-8 ${arabicSize}`} 
        dir="rtl"
      >
        {ayah.text}
      </p>

      {displayLanguage === 'english' && englishTranslation && (
        <p className={`text-gray-800 dark:text-gray-200 mb-3 ${translationSize}`}>
          {englishTranslation.text}
        </p>
      )}
      
      {displayLanguage === 'french' && frenchTranslation && (
        <p className={`text-gray-800 dark:text-gray-200 mb-3 ${translationSize}`}>
          {frenchTranslation.text}
        </p>
      )}
      
      {showBoth && displayLanguage === 'english' && frenchTranslation && (
        <p className={`text-gray-600 dark:text-gray-400 italic mt-3 ${translationSize}`}>
          {frenchTranslation.text}
        </p>
      )}
      
      {showBoth && displayLanguage === 'french' && englishTranslation && (
        <p className={`text-gray-600 dark:text-gray-400 italic mt-3 ${translationSize}`}>
          {englishTranslation.text}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="bg-quran-primary/5 dark:bg-quran-primary/10 px-3 py-1 rounded-full">
          {surahName} {ayah.numberInSurah}
        </span>
        <span className="bg-quran-primary/5 dark:bg-quran-primary/10 px-3 py-1 rounded-full">
          Ayah #{ayah.number}
        </span>
      </div>
      
      <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <TextEditor displayLanguage={displayLanguage} />
            <BookmarkButton 
              ayah={ayah} 
              surahName={surahName}
              displayLanguage={displayLanguage}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-black dark:text-gray-200"
              title={displayLanguage === 'english' ? 'Share this verse' : 'Partager ce verset'}
            >
              <Share2 size={18} />
            </Button>
          </div>
          
          <div className="flex-1">
            <AudioPlayer 
              surahId={ayah.surah} 
              ayahId={ayah.numberInSurah}
              displayLanguage={displayLanguage}
              showRecordButton={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyahView;
