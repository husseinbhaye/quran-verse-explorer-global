
import React from 'react';
import { Ayah, Translation } from '../types/quran';

interface AyahViewProps {
  ayah: Ayah;
  englishTranslation?: Translation;
  frenchTranslation?: Translation;
  showBoth: boolean;
  surahName: string;
  displayLanguage: 'english' | 'french';
}

const AyahView = ({
  ayah,
  englishTranslation,
  frenchTranslation,
  showBoth,
  surahName,
  displayLanguage
}: AyahViewProps) => {
  return (
    <div className="bg-white dark:bg-card rounded-lg p-4 shadow-sm border">
      <p 
        className="arabic text-right text-2xl leading-loose mb-4 font-['UthmanicHafs']" 
        dir="rtl"
      >
        {ayah.text}
      </p>
      
      {/* Primary translation based on selected language */}
      {displayLanguage === 'english' && englishTranslation && (
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          {englishTranslation.text}
        </p>
      )}
      
      {displayLanguage === 'french' && frenchTranslation && (
        <p className="text-gray-800 dark:text-gray-200 mb-2">
          {frenchTranslation.text}
        </p>
      )}
      
      {/* Secondary translation if showing both is enabled */}
      {showBoth && displayLanguage === 'english' && frenchTranslation && (
        <p className="text-gray-600 dark:text-gray-400 text-sm italic mt-2">
          {frenchTranslation.text}
        </p>
      )}
      
      {showBoth && displayLanguage === 'french' && englishTranslation && (
        <p className="text-gray-600 dark:text-gray-400 text-sm italic mt-2">
          {englishTranslation.text}
        </p>
      )}
      
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span>{surahName} {ayah.numberInSurah}</span>
        <span>Ayah #{ayah.number}</span>
      </div>
    </div>
  );
};

export default AyahView;
