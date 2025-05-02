
import { Ayah, Translation } from '@/types/quran';

export interface AyahViewProps {
  ayah: Ayah;
  englishTranslation?: Translation;
  frenchTranslation?: Translation;
  showBoth: boolean;
  surahName: string;
  displayLanguage: 'english' | 'french';
  textSize?: "sm" | "base" | "lg" | "xl";
}

export interface PostcardGeneratorProps {
  ayah: Ayah;
  surahName: string;
  displayLanguage: 'english' | 'french';
  translationContent: string;
}

export interface AyahActionsProps {
  ayah: Ayah;
  surahName: string;
  displayLanguage: 'english' | 'french';
  translationContent: string;
}

export interface AyahTextProps {
  ayah: Ayah;
  englishTranslation?: Translation;
  frenchTranslation?: Translation;
  showBoth: boolean;
  displayLanguage: 'english' | 'french';
  textSize: "sm" | "base" | "lg" | "xl";
}
