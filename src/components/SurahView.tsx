
import React, { useEffect } from 'react';
import { Surah, Ayah, Translation } from '../types/quran';
import AyahView from './AyahView';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';

interface SurahViewProps {
  surah: Surah | null;
  ayahs: Ayah[];
  englishTranslations: Translation[];
  frenchTranslations: Translation[];
  loading: boolean;
  showBothTranslations: boolean;
  displayLanguage: 'english' | 'french';
  textSize: "sm" | "base" | "lg" | "xl";
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
      <div className="flex-1 p-6 flex items-center justify-center islamic-pattern-bg">
        <div className="text-center p-10 islamic-card backdrop-blur-sm rounded-2xl border border-quran-secondary/30">
          <h2 className="text-3xl font-['UthmanicHafs'] arabic text-center dir-rtl mb-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
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
    <div className={`flex-1 px-4 md:px-8 lg:px-16 py-4 md:py-6 overflow-y-auto h-[calc(100vh-12rem)] islamic-pattern-bg ${mainTextSize} scroll-smooth`}>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-12 pt-8 pb-6 px-6 rounded-2xl islamic-card-gradient backdrop-blur-sm shadow-lg border border-quran-secondary/20 hover:shadow-xl transition-shadow duration-300 fade-in-up">
          <CardContent className="p-0">
            <div className="ornament-divider mb-4"></div>
            <h1 className={`arabic my-6 font-['UthmanicHafs'] dir-rtl text-center ${surahNameSize}`}>
              {surah.name}
            </h1>
            
            <h2 className="text-xl font-medium bg-gradient-to-r from-quran-secondary to-quran-secondary/70 bg-clip-text text-transparent w-full text-center">
              {surah.englishName} - {surah.frenchName}
            </h2>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 w-full text-center">
              {surah.englishNameTranslation} | {surah.numberOfAyahs} Verses | {surah.revelationType}
            </p>
            
            <Separator className="my-6 bg-quran-secondary/20 w-full" />
            
            <p className={`arabic my-6 font-['UthmanicHafs'] dir-rtl text-center ${surahNameSize === "text-xl" ? "text-lg" : surahNameSize}`}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <div className="ornament-divider mt-4 rotate-180"></div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {ayahs.map((ayah, index) => {
            const primaryTranslation = primaryTranslations.find(t => t.ayah === ayah.number);
            const secondaryTranslation = secondaryTranslations.find(t => t.ayah === ayah.number);

            const englishTranslation = displayLanguage === 'english' ? primaryTranslation : secondaryTranslation;
            const frenchTranslation = displayLanguage === 'french' ? primaryTranslation : secondaryTranslation;

            // Add a specific ID for each ayah that can be targeted by the verse selector
            return (
              <div 
                key={ayah.number} 
                id={`ayah-${surah.id}-${ayah.number}`} 
                className={`scroll-mt-24 ayah-card fade-in-up ${index % 2 === 0 ? 'from-opacity-80 to-opacity-95' : 'from-opacity-90 to-opacity-100'}`}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <AyahView
                  ayah={ayah}
                  englishTranslation={englishTranslation}
                  frenchTranslation={frenchTranslation}
                  showBoth={showBothTranslations}
                  surahName={surahName}
                  displayLanguage={displayLanguage}
                  textSize={textSize}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SurahView;
