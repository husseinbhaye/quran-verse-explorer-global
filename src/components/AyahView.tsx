import React from 'react';
import { Ayah, Translation } from '../types/quran';
import AudioPlayer from './audio';
import BookmarkButton from './BookmarkButton';
import TextEditor from './TextEditor';

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
  const arabicSize = {
    sm: "text-lg",
    base: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl"
  }[textSize];
  
  const translationSize = {
    sm: "text-xs",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  }[textSize];

  return (
    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm border">
      <p 
        className={`arabic text-right leading-loose mb-4 ${arabicSize}`} 
        dir="rtl"
      >
        {ayah.text}
      </p>

      {displayLanguage === 'english' && englishTranslation && (
        <p className={`text-gray-800 dark:text-gray-200 mb-2 ${translationSize}`}>
          {englishTranslation.text}
        </p>
      )}
      
      {displayLanguage === 'french' && frenchTranslation && (
        <p className={`text-gray-800 dark:text-gray-200 mb-2 ${translationSize}`}>
          {frenchTranslation.text}
        </p>
      )}
      
      {showBoth && displayLanguage === 'english' && frenchTranslation && (
        <p className={`text-gray-600 dark:text-gray-400 text-sm italic mt-2 ${translationSize}`}>
          {frenchTranslation.text}
        </p>
      )}
      
      {showBoth && displayLanguage === 'french' && englishTranslation && (
        <p className={`text-gray-600 dark:text-gray-400 text-sm italic mt-2 ${translationSize}`}>
          {englishTranslation.text}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span>{surahName} {ayah.numberInSurah}</span>
        <span>Ayah #{ayah.number}</span>
      </div>
      
      <div className="mt-4 border-t pt-3">
        <AudioPlayer surahId={ayah.surah} ayahId={ayah.numberInSurah} />
      </div>
      
      <div className="flex items-center gap-2 mt-4">
        <TextEditor displayLanguage={displayLanguage} />
        <BookmarkButton 
          ayah={ayah} 
          surahName={surahName}
          displayLanguage={displayLanguage}
        />
      </div>
    </div>
  );
};

export default AyahView;
