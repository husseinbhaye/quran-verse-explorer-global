
export interface Surah {
  id: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  frenchName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  surah: number;
  numberInSurah: number;
}

export interface Translation {
  text: string;
  ayah: number;
  language: string;
}

export type Language = 'arabic' | 'english' | 'french';
