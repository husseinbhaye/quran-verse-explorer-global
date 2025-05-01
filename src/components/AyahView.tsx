import React from 'react';
import { Ayah, Translation } from '../types/quran';
import AudioPlayer from './audio';
import BookmarkButton from './BookmarkButton';
import TextEditor from './TextEditor';
import { Share2, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

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

  const createPostcard = async () => {
    try {
      // Show loading toast
      toast({
        title: displayLanguage === 'english' ? 'Creating postcard...' : 'Création de la carte postale...',
        description: displayLanguage === 'english' 
          ? 'Please wait while we generate your image' 
          : 'Veuillez patienter pendant que nous générons votre image'
      });
      
      // Get reference to the current verse element
      const verseElement = document.getElementById(`verse-${ayah.surah}-${ayah.numberInSurah}`);
      if (!verseElement) return;
      
      // Create a new div for the postcard that we'll capture
      const postcardContainer = document.createElement('div');
      postcardContainer.className = 'postcard-container';
      postcardContainer.style.position = 'fixed';
      postcardContainer.style.left = '-9999px';
      postcardContainer.style.width = '800px';
      postcardContainer.style.height = '600px';
      postcardContainer.style.display = 'flex';
      postcardContainer.style.flexDirection = 'column';
      postcardContainer.style.overflow = 'hidden';
      
      // Add corner decorative elements
      const cornerTL = document.createElement('div');
      cornerTL.className = 'postcard-corner-design postcard-corner-tl';
      postcardContainer.appendChild(cornerTL);
      
      const cornerTR = document.createElement('div');
      cornerTR.className = 'postcard-corner-design postcard-corner-tr';
      postcardContainer.appendChild(cornerTR);
      
      const cornerBL = document.createElement('div');
      cornerBL.className = 'postcard-corner-design postcard-corner-bl';
      postcardContainer.appendChild(cornerBL);
      
      const cornerBR = document.createElement('div');
      cornerBR.className = 'postcard-corner-design postcard-corner-br';
      postcardContainer.appendChild(cornerBR);
      
      // Add logo and title area
      const logoArea = document.createElement('div');
      logoArea.className = 'postcard-logo-area';
      
      // Add logo
      const logo = document.createElement('img');
      logo.src = '/lovable-uploads/72b66895-06f2-4960-a5ff-52e2a9ed4e85.png';
      logo.style.height = '60px';
      logo.style.width = 'auto';
      
      // Add title
      const title = document.createElement('div');
      title.innerHTML = `
        <div style="display: flex; flex-direction: column;">
          <span style="color: #3F6473; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">القرآن الكريم</span>
          <span style="font-size: 16px; color: #D4B254; font-family: Arial, sans-serif;">Quran Explorer</span>
        </div>
      `;
      
      // Append logo and title to logo area
      logoArea.appendChild(logo);
      logoArea.appendChild(title);
      
      // Create content area
      const contentArea = document.createElement('div');
      contentArea.className = 'postcard-content';
      contentArea.style.flex = '1';
      contentArea.style.display = 'flex';
      contentArea.style.flexDirection = 'column';
      
      // Add Arabic text
      const arabicText = document.createElement('p');
      arabicText.className = 'postcard-arabic';
      arabicText.textContent = ayah.text;
      
      // Add translation text
      const translationText = document.createElement('p');
      translationText.className = 'postcard-translation';
      const translationContent = displayLanguage === 'english' 
        ? (englishTranslation?.text || '') 
        : (frenchTranslation?.text || '');
      translationText.textContent = translationContent;
      
      // Add reference label
      const referenceLabel = document.createElement('div');
      referenceLabel.className = 'postcard-reference';
      
      const surahRef = document.createElement('span');
      surahRef.className = 'postcard-reference-badge';
      surahRef.textContent = `${surahName} ${ayah.numberInSurah}`;
      
      const ayahRef = document.createElement('span');
      ayahRef.className = 'postcard-reference-badge';
      ayahRef.textContent = `Ayah #${ayah.number}`;
      
      referenceLabel.appendChild(surahRef);
      referenceLabel.appendChild(ayahRef);
      
      // Append all elements to content area
      contentArea.appendChild(arabicText);
      contentArea.appendChild(translationText);
      contentArea.appendChild(referenceLabel);
      
      // Add footer with website URL and message
      const footer = document.createElement('div');
      footer.className = 'postcard-footer';
      footer.innerHTML = '🌿 Quranic Verse Reminder – Visit us at www.eemaanfoundation.com for daily inspiration.';
      
      // Assemble the postcard
      postcardContainer.appendChild(logoArea);
      postcardContainer.appendChild(contentArea);
      postcardContainer.appendChild(footer);
      
      // Append to body temporarily (for html2canvas to work)
      document.body.appendChild(postcardContainer);
      
      // Capture the postcard as an image
      const canvas = await html2canvas(postcardContainer, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Remove the temporary element
      document.body.removeChild(postcardContainer);
      
      // Convert to image and download
      const imageData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`;
      link.click();
      
      toast({
        title: displayLanguage === 'english' ? 'Postcard created!' : 'Carte postale créée !',
        description: displayLanguage === 'english' 
          ? 'Your verse postcard has been downloaded' 
          : 'Votre carte postale avec le verset a été téléchargée'
      });
    } catch (error) {
      console.error('Error creating postcard:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english' 
          ? 'Failed to create postcard image' 
          : 'Échec de la création de l\'image de la carte postale',
        variant: 'destructive',
      });
    }
  };

  return (
    <div 
      className="bg-white/80 dark:bg-card/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-black/5 hover:shadow-xl transition-shadow duration-300"
      id={`verse-${ayah.surah}-${ayah.numberInSurah}`}
    >
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
              className="bg-white/10 hover:bg-white/20 text-quran-primary dark:text-quran-secondary"
              title={displayLanguage === 'english' ? 'Share this verse' : 'Partager ce verset'}
            >
              <Share2 size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={createPostcard}
              className="bg-white/10 hover:bg-white/20 text-quran-primary dark:text-quran-secondary"
              title={displayLanguage === 'english' ? 'Save as postcard' : 'Enregistrer comme carte postale'}
            >
              <Camera size={18} />
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
