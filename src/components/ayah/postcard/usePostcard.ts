
import { toast } from '@/hooks/use-toast';
import { capturePostcard, sharePostcard } from './postcardCapture';
import { Ayah } from '@/types/quran';

interface UsePostcardOptions {
  ayah: Ayah;
  surahName: string;
  displayLanguage: 'english' | 'french';
  translationContent: string;
}

export function usePostcard({ ayah, surahName, displayLanguage, translationContent }: UsePostcardOptions) {
  const createPostcard = async () => {
    try {
      // Show loading toast
      toast({
        title: displayLanguage === 'english' ? 'Creating postcard...' : 'Création de la carte postale...',
        description: displayLanguage === 'english' 
          ? 'Please wait while we generate your image' 
          : 'Veuillez patienter pendant que nous générons votre image'
      });
      
      // Generate the postcard image
      const imageData = await capturePostcard({ ayah, surahName, translationContent });
      
      // Try to share the postcard
      const wasShared = await sharePostcard(imageData, ayah, surahName, translationContent);
      
      // Show success toast
      toast({
        title: wasShared 
          ? (displayLanguage === 'english' ? 'Shared!' : 'Partagé!') 
          : (displayLanguage === 'english' ? 'Postcard created!' : 'Carte postale créée !'),
        description: wasShared 
          ? (displayLanguage === 'english' ? 'Postcard shared successfully' : 'Carte postale partagée avec succès') 
          : (displayLanguage === 'english' ? 'Your verse postcard has been downloaded' : 'Votre carte postale avec le verset a été téléchargée')
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

  return { createPostcard };
}
