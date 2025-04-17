
import React from 'react';
import { Ayah, Translation } from '../types/quran';
import AudioPlayer from './audio';
import NoteDialog from './NoteDialog';
import { BookmarkButton } from './BookmarkButton';

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
        className="arabic text-right text-2xl leading-loose mb-4" 
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
      
      {/* Audio player and interactive controls */}
      <div className="mt-4 border-t pt-3">
        <AudioPlayer surahId={ayah.surah} ayahId={ayah.numberInSurah} />
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between mt-4">
        <NoteDialog 
          surahId={ayah.surah} 
          ayahNumber={ayah.number} 
          displayLanguage={displayLanguage}
        />
        <BookmarkButton 
          ayah={ayah} 
          surahName={surahName}
        />
      </div>
    </div>
  );
};

export default AyahView;
