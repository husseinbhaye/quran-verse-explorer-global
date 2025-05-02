
import { Ayah } from '@/types/quran';

export interface PostcardRenderOptions {
  ayah: Ayah;
  surahName: string;
  translationContent: string;
}

export const createPostcardElement = ({ ayah, surahName, translationContent }: PostcardRenderOptions): HTMLDivElement => {
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
  
  // Add Eemaan logo - updated to use the new logo
  const logoDiv = document.createElement('div');
  logoDiv.innerHTML = `
    <img src="/lovable-uploads/6e963b5f-bb43-428f-b735-f40c221a435f.png" style="height: 60px; width: auto;" />
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
  footer.innerHTML = '🌿 Quranic Verse Reminder – Visit us at www.eemaanfoundation.com for daily inspiration.';
  
  // Assemble the entire postcard
  postcardContainer.appendChild(headerSection);
  postcardContainer.appendChild(greetingSection);
  postcardContainer.appendChild(contentSection);
  postcardContainer.appendChild(closingMessage);
  postcardContainer.appendChild(footer);
  
  return postcardContainer;
};
