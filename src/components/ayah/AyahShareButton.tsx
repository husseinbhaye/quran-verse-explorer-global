
import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Ayah } from '@/types/quran';

interface AyahShareButtonProps {
  ayah: Ayah;
  surahName: string;
  displayLanguage: 'english' | 'french';
}

const AyahShareButton = ({ ayah, surahName, displayLanguage }: AyahShareButtonProps) => {
  const { toast } = useToast();
  
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
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleShare}
      className="bg-white/10 hover:bg-white/20 text-quran-primary dark:text-quran-secondary"
      title={displayLanguage === 'english' ? 'Share this verse' : 'Partager ce verset'}
    >
      <Share2 size={18} />
    </Button>
  );
};

export default AyahShareButton;
