
import React from 'react';
import { AyahViewProps } from './types';
import AyahText from './AyahText';
import AyahActions from './AyahActions';

const AyahView = ({
  ayah,
  englishTranslation,
  frenchTranslation,
  showBoth,
  surahName,
  displayLanguage,
  textSize = "base"
}: AyahViewProps) => {
  
  // Determine which translation to use for the postcard and sharing
  const translationContent = displayLanguage === 'english' 
    ? (englishTranslation?.text || '') 
    : (frenchTranslation?.text || '');

  return (
    <div 
      className="bg-white/80 dark:bg-card/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-black/5 hover:shadow-xl transition-shadow duration-300"
      id={`verse-${ayah.surah}-${ayah.numberInSurah}`}
    >
      <AyahText
        ayah={ayah}
        englishTranslation={englishTranslation}
        frenchTranslation={frenchTranslation}
        showBoth={showBoth}
        displayLanguage={displayLanguage}
        textSize={textSize}
      />
      
      <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="bg-quran-primary/5 dark:bg-quran-primary/10 px-3 py-1 rounded-full">
          {surahName} {ayah.numberInSurah}
        </span>
        <span className="bg-quran-primary/5 dark:bg-quran-primary/10 px-3 py-1 rounded-full">
          Ayah #{ayah.number}
        </span>
      </div>
      
      <AyahActions
        ayah={ayah}
        surahName={surahName}
        displayLanguage={displayLanguage}
        translationContent={translationContent}
      />
    </div>
  );
};

export default AyahView;
