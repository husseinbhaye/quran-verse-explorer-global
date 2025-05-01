
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
      postcardContainer.style.position = 'fixed';
      postcardContainer.style.left = '-9999px';
      postcardContainer.style.width = '800px';
      postcardContainer.style.height = '600px';
      postcardContainer.style.backgroundColor = 'white';
      postcardContainer.style.padding = '40px';
      postcardContainer.style.borderRadius = '12px';
      postcardContainer.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
      postcardContainer.style.display = 'flex';
      postcardContainer.style.flexDirection = 'column';
      postcardContainer.style.overflow = 'hidden';
      
      // Add logo and title area
      const logoArea = document.createElement('div');
      logoArea.style.display = 'flex';
      logoArea.style.alignItems = 'center';
      logoArea.style.gap = '15px';
      logoArea.style.marginBottom = '20px';
      
      // Add logo
      const logo = document.createElement('img');
      logo.src = '/lovable-uploads/72b66895-06f2-4960-a5ff-52e2a9ed4e85.png';
      logo.style.height = '60px';
      logo.style.width = 'auto';
      
      // Add title
      const title = document.createElement('div');
      title.innerHTML = `
        <div style="display: flex; flex-direction: column;">
          <span style="color: #D4B254; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">القرآن الكريم</span>
          <span style="font-size: 16px; font-family: Arial, sans-serif;">Quran Explorer</span>
        </div>
      `;
      
      // Append logo and title to logo area
      logoArea.appendChild(logo);
      logoArea.appendChild(title);
      
      // Create content area
      const contentArea = document.createElement('div');
      contentArea.style.backgroundColor = '#f9f9f9';
      contentArea.style.borderRadius = '8px';
      contentArea.style.padding = '30px';
      contentArea.style.flex = '1';
      contentArea.style.display = 'flex';
      contentArea.style.flexDirection = 'column';
      contentArea.style.border = '1px solid #eaeaea';
      
      // Add Arabic text
      const arabicText = document.createElement('p');
      arabicText.textContent = ayah.text;
      arabicText.dir = 'rtl';
      arabicText.style.fontSize = '30px';
      arabicText.style.fontFamily = 'UthmanicHafs, Arabic, sans-serif';
      arabicText.style.marginBottom = '20px';
      arabicText.style.lineHeight = '1.6';
      arabicText.style.textAlign = 'right';
      
      // Add translation text
      const translationText = document.createElement('p');
      const translationContent = displayLanguage === 'english' 
        ? (englishTranslation?.text || '') 
        : (frenchTranslation?.text || '');
      translationText.textContent = translationContent;
      translationText.style.fontSize = '16px';
      translationText.style.fontFamily = 'Arial, sans-serif';
      translationText.style.lineHeight = '1.5';
      translationText.style.color = '#333';
      
      // Add reference label
      const referenceLabel = document.createElement('div');
      referenceLabel.style.marginTop = 'auto';
      referenceLabel.style.display = 'flex';
      referenceLabel.style.justifyContent = 'space-between';
      referenceLabel.style.paddingTop = '20px';
      
      const surahRef = document.createElement('span');
      surahRef.textContent = `${surahName} ${ayah.numberInSurah}`;
      surahRef.style.backgroundColor = '#f0f0f0';
      surahRef.style.padding = '5px 12px';
      surahRef.style.borderRadius = '20px';
      surahRef.style.fontSize = '14px';
      surahRef.style.color = '#555';
      
      const ayahRef = document.createElement('span');
      ayahRef.textContent = `Ayah #${ayah.number}`;
      ayahRef.style.backgroundColor = '#f0f0f0';
      ayahRef.style.padding = '5px 12px';
      ayahRef.style.borderRadius = '20px';
      ayahRef.style.fontSize = '14px';
      ayahRef.style.color = '#555';
      
      referenceLabel.appendChild(surahRef);
      referenceLabel.appendChild(ayahRef);
      
      // Append all elements to content area
      contentArea.appendChild(arabicText);
      contentArea.appendChild(translationText);
      contentArea.appendChild(referenceLabel);
      
      // Add footer with website URL
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.textAlign = 'center';
      footer.style.color = '#888';
      footer.style.fontSize = '14px';
      footer.textContent = 'www.eemaan.org';
      
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
