
import React, { useEffect } from 'react';
import { Surah, Ayah, Translation } from '../types/quran';
import AyahView from './AyahView';
import { Separator } from './ui/separator';
import TextSizeControl from './TextSizeControl';

interface SurahViewProps {
  surah: Surah | null;
  ayahs: Ayah[];
  englishTranslations: Translation[];
  frenchTranslations: Translation[];
  loading: boolean;
  showBothTranslations: boolean;
  displayLanguage: 'english' | 'french';
  textSize: "sm" | "base" | "lg" | "xl";
  setTextSize: (size: "sm" | "base" | "lg" | "xl") => void;
}

const SurahView = ({
  surah,
  ayahs,
  englishTranslations,
  frenchTranslations,
  loading,
  showBothTranslations,
  displayLanguage,
  textSize,
  setTextSize
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
        },
        'textSize:', textSize
      );
    }
  }, [displayLanguage, englishTranslations, frenchTranslations, surah, textSize]);

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
          <h2 className="text-3xl font-['UthmanicHafs'] arabic text-center dir-rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
          <p className="text-lg text-gray-600">
            {displayLanguage === 'english' ? 'Select a Surah to begin reading' : 'Sélectionnez une sourate pour commencer la lecture'}
          </p>
        </div>
      </div>
    );
  }

  console.log("SurahView rendering with textSize:", textSize);

  const surahNameSize = {
    sm: "text-xl",
    base: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl"
  }[textSize];
  const mainTextSize = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  }[textSize];

  const primaryTranslations = displayLanguage === 'english' ? englishTranslations : frenchTranslations;
  const secondaryTranslations = displayLanguage === 'english' ? frenchTranslations : englishTranslations;
  const surahName = displayLanguage === 'english' ? surah.englishName : surah.frenchName;

  console.log(`Rendering surah with ${primaryTranslations.length} primary translations (${displayLanguage}) and ${secondaryTranslations.length} secondary translations, textSize: ${textSize}`);

  return (
    <div className={`flex-1 px-2 md:px-8 lg:px-16 py-2 md:py-4 overflow-y-auto h-[calc(100vh-12rem)] pattern-bg ${mainTextSize}`}>
      <div>
        {/* Center aligned all header text */}
        <div className="mb-8 geometric-pattern pt-6 flex flex-col items-center text-center">
          {/* Move TextSizeControl ABOVE Bismillah */}
          <div className="mb-2">
            <TextSizeControl 
              textSize={textSize} 
              setTextSize={setTextSize}
            />
          </div>

          <h1 className={`arabic my-4 font-['UthmanicHafs'] dir-rtl text-center ${surahNameSize}`}>
            {surah.name}
          </h1>
          <h2 className="text-xl font-medium text-quran-primary w-full text-center">
            {surah.englishName} - {surah.frenchName}
          </h2>
          <p className="text-sm text-gray-600 mt-2 w-full text-center">
            {surah.englishNameTranslation} | {surah.numberOfAyahs} Verses | {surah.revelationType}
          </p>
          <Separator className="my-4 bg-quran-primary/20 w-full" />
          <p className={`arabic my-4 font-['UthmanicHafs'] dir-rtl text-center ${surahNameSize === "text-xl" ? "text-lg" : surahNameSize}`}>
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          {/* Removed old TextSizeControl below Bismillah */}
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
                textSize={textSize}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurahView;

