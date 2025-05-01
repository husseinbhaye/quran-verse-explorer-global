
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

  return (
    <div className="bg-white/80 dark:bg-card/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-black/5 hover:shadow-xl transition-shadow duration-300">
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
