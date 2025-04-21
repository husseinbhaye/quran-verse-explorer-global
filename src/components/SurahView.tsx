
import React, { useEffect } from 'react';
import { Surah, Ayah, Translation } from '../types/quran';
import AyahView from './AyahView';
import { Separator } from './ui/separator';

interface SurahViewProps {
  surah: Surah | null;
  ayahs: Ayah[];
  englishTranslations: Translation[];
  frenchTranslations: Translation[];
  loading: boolean;
  showBothTranslations: boolean;
  displayLanguage: 'english' | 'french';
}

const SurahView = ({
  surah,
  ayahs,
  englishTranslations,
  frenchTranslations,
  loading,
  showBothTranslations,
  displayLanguage
}: SurahViewProps) => {
  useEffect(() => {
    if (surah) {
      console.log('SurahView update - language:', displayLanguage, 
        'surah:', surah.englishName,
        'translations:', { 
          english: englishTranslations.length, 
          french: frenchTranslations.length,
          englishSample: englishTranslations[0]?.text.substring(0, 20),
          frenchSample: frenchTranslations[0]?.text.substring(0, 20)
        });
    }
  }, [displayLanguage, englishTranslations, frenchTranslations, surah]);

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-quran-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-quran-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center pattern-bg">
        <div className="text-center">
          <h2 className="text-3xl font-['UthmanicHafs'] arabic text-center w-full dir-rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
          <p className="text-lg text-gray-600">
            {displayLanguage === 'english' ? 'Select a Surah to begin reading' : 'Sélectionnez une sourate pour commencer la lecture'}
          </p>
        </div>
      </div>
    );
  }

  const primaryTranslations = displayLanguage === 'english' ? englishTranslations : frenchTranslations;
  const secondaryTranslations = displayLanguage === 'english' ? frenchTranslations : englishTranslations;
  const surahName = displayLanguage === 'english' ? surah.englishName : surah.frenchName;

  console.log(`Rendering surah with ${primaryTranslations.length} primary translations (${displayLanguage}) and ${secondaryTranslations.length} secondary translations`);

  return (
    <div className="flex-1 px-2 md:px-8 lg:px-16 py-2 md:py-4 overflow-y-auto h-[calc(100vh-12rem)] pattern-bg">
      {/* Removed max-w-3xl and mx-auto to expand width */}
      <div>
        <div className="text-center mb-8 geometric-pattern pt-6">
          <h1 className="arabic text-3xl my-4 font-['UthmanicHafs'] text-center w-full dir-rtl">{surah.name}</h1>
          <h2 className="text-xl font-medium text-quran-primary">
            {surah.englishName} - {surah.frenchName}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {surah.englishNameTranslation} | {surah.numberOfAyahs} Verses | {surah.revelationType}
          </p>
          <Separator className="my-4 bg-quran-primary/20" />
          <p className="arabic text-xl my-4 font-['UthmanicHafs'] text-center w-full dir-rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>

        <div className="space-y-4">
          {ayahs.map((ayah) => {
            const primaryTranslation = primaryTranslations.find(t => t.ayah === ayah.number);
            const secondaryTranslation = secondaryTranslations.find(t => t.ayah === ayah.number);
            
            const englishTranslation = displayLanguage === 'english' ? primaryTranslation : secondaryTranslation;
            const frenchTranslation = displayLanguage === 'french' ? primaryTranslation : secondaryTranslation;
            
            return (
              <AyahView
                key={ayah.number}
                ayah={ayah}
                englishTranslation={englishTranslation}
                frenchTranslation={frenchTranslation}
                showBoth={showBothTranslations}
                surahName={surahName}
                displayLanguage={displayLanguage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurahView;
