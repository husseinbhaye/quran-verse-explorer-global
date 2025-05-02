
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
      
      // Create a new div for the redesigned postcard that we'll capture
      const postcardContainer = document.createElement('div');
      postcardContainer.className = 'new-postcard-container';
      postcardContainer.style.position = 'fixed';
      postcardContainer.style.left = '-9999px';
      postcardContainer.style.width = '800px';
      postcardContainer.style.height = 'auto';
      postcardContainer.style.backgroundColor = 'white';
      postcardContainer.style.borderRadius = '8px';
      postcardContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      postcardContainer.style.overflow = 'hidden';
      postcardContainer.style.fontFamily = 'Arial, sans-serif';
      postcardContainer.style.border = '15px solid #a4b8cc';
      
      // Create header
      const headerSection = document.createElement('div');
      headerSection.style.display = 'flex';
      headerSection.style.justifyContent = 'space-between';
      headerSection.style.alignItems = 'center';
      headerSection.style.padding = '20px';
      headerSection.style.borderBottom = '1px solid #eaeaea';
      
      // Add Quran title and subtitle
      const titleDiv = document.createElement('div');
      titleDiv.innerHTML = `
        <div style="display: flex; flex-direction: column;">
          <span style="color: #33485f; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">القرآن الكريم</span>
          <span style="font-size: 16px; color: #D4B254; font-family: Arial, sans-serif;">Quran Explorer</span>
        </div>
      `;
      
      // Add Eemaan logo
      const logoDiv = document.createElement('div');
      logoDiv.innerHTML = `
        <img src="/lovable-uploads/814f8fae-d6b5-483c-8b05-8f99afbf7cb9.png" style="height: 60px; width: auto;" />
      `;
      
      headerSection.appendChild(titleDiv);
      headerSection.appendChild(logoDiv);
      
      // Create greeting section
      const greetingSection = document.createElement('div');
      greetingSection.style.padding = '10px 20px';
      greetingSection.style.textAlign = 'center';
      greetingSection.style.borderBottom = '1px solid #eaeaea';
      greetingSection.innerHTML = `<p style="margin: 0; font-style: italic; color: #555;">Assalaamou aleykum Warahmat-Ullah wa barakatuhu</p>`;
      
      // Create content section
      const contentSection = document.createElement('div');
      contentSection.style.padding = '30px 20px';
      contentSection.style.textAlign = 'center';
      
      // Add Arabic text
      const arabicText = document.createElement('p');
      arabicText.style.fontSize = '32px';
      arabicText.style.lineHeight = '1.6';
      arabicText.style.marginBottom = '30px';
      arabicText.style.textAlign = 'center';
      arabicText.style.fontFamily = 'UthmanicHafs, Arial, sans-serif';
      arabicText.style.color = '#33485f';
      arabicText.style.direction = 'rtl';
      arabicText.textContent = ayah.text;
      
      // Add translation
      const translationText = document.createElement('p');
      translationText.style.fontSize = '18px';
      translationText.style.lineHeight = '1.5';
      translationText.style.color = '#333';
      translationText.style.margin = '0 0 30px 0';
      const translationContent = displayLanguage === 'english' 
        ? (englishTranslation?.text || '') 
        : (frenchTranslation?.text || '');
      translationText.textContent = translationContent;
      
      // Add reference
      const referenceText = document.createElement('p');
      referenceText.style.fontSize = '16px';
      referenceText.style.color = '#666';
      referenceText.textContent = `${surahName} ${ayah.numberInSurah} • Ayah #${ayah.number}`;
      
      // Append everything to content section
      contentSection.appendChild(arabicText);
      contentSection.appendChild(translationText);
      contentSection.appendChild(referenceText);
      
      // Create closing message
      const closingMessage = document.createElement('div');
      closingMessage.style.padding = '10px 20px';
      closingMessage.style.textAlign = 'right';
      closingMessage.style.fontStyle = 'italic';
      closingMessage.style.color = '#555';
      closingMessage.style.borderTop = '1px solid #eaeaea';
      closingMessage.innerHTML = `<p style="margin: 0;">May Allah bless you day.</p>`;
      
      // Create footer
      const footer = document.createElement('div');
      footer.style.backgroundColor = '#a4b8cc';
      footer.style.color = '#333';
      footer.style.padding = '12px 20px';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '14px';
      footer.innerHTML = 'Quranic Verse Reminder - Visit us at www.eemaanfoundation.com for daily inspiration.';
      
      // Assemble the entire postcard
      postcardContainer.appendChild(headerSection);
      postcardContainer.appendChild(greetingSection);
      postcardContainer.appendChild(contentSection);
      postcardContainer.appendChild(closingMessage);
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
      
      // Convert to image
      const imageData = canvas.toDataURL('image/png');
      
      // Create sharing options
      const shareData = {
        title: `${surahName} ${ayah.numberInSurah} - Quran Verse`,
        text: `${translationContent}`,
        files: [await dataURLToFile(imageData, `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`)]
      };
      
      // Check if the native sharing API supports sharing files
      if (navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          toast({
            title: displayLanguage === 'english' ? 'Shared!' : 'Partagé!',
            description: displayLanguage === 'english' 
              ? 'Postcard shared successfully' 
              : 'Carte postale partagée avec succès'
          });
          return;
        } catch (error) {
          console.error('Error sharing with files:', error);
          // Fall back to other methods
        }
      }
      
      // Try sharing just the link if file sharing isn't supported
      if (navigator.share) {
        try {
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(`${surahName} ${ayah.numberInSurah} - ${translationContent} - Visit us at www.eemaanfoundation.com`)}`;
          window.open(whatsappUrl);
          // Also download the image
          downloadImage(imageData, `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`);
          return;
        } catch (error) {
          console.error('Error sharing to WhatsApp:', error);
        }
      }
      
      // Final fallback - just download the image
      downloadImage(imageData, `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`);
      
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
  
  // Helper function to convert data URL to File object for sharing
  const dataURLToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
  };
  
  // Helper function to download image
  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
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
