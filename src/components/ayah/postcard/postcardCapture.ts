
import html2canvas from 'html2canvas';
import { dataURLToFile, downloadImage } from '../utils/postcardUtils';
import { Ayah } from '@/types/quran';
import { createPostcardElement } from './postcardRenderer';

export interface CapturePostcardOptions {
  ayah: Ayah;
  surahName: string;
  translationContent: string;
}

export async function capturePostcard({ ayah, surahName, translationContent }: CapturePostcardOptions): Promise<string> {
  // Create the postcard DOM element
  const postcardContainer = createPostcardElement({ ayah, surahName, translationContent });
  
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
  return canvas.toDataURL('image/png');
}

export async function sharePostcard(
  imageData: string, 
  ayah: Ayah, 
  surahName: string, 
  translationContent: string
): Promise<boolean> {
  try {
    // Create sharing options
    const shareData = {
      title: `${surahName} ${ayah.numberInSurah} - Quran Verse`,
      text: `${translationContent}`,
      files: [await dataURLToFile(imageData, `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`)]
    };
    
    // Check if the native sharing API supports sharing files
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return true;
    }
    
    // Fallback to download
    downloadImage(imageData, `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`);
    return false;
  } catch (error) {
    console.error('Error sharing postcard:', error);
    // Fall back to download
    downloadImage(imageData, `quran-verse-${ayah.surah}-${ayah.numberInSurah}.png`);
    return false;
  }
}
