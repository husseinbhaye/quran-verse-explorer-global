
import React from 'react';
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
          <h2 className="text-3xl font-arabic mb-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
          <p className="text-lg text-gray-600">
            Select a Surah to begin reading
          </p>
        </div>
      </div>
    );
  }

  const surahName = displayLanguage === 'english' ? surah.englishName : surah.frenchName;

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-12rem)] pattern-bg">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 geometric-pattern pt-6">
          <h1 className="arabic text-3xl my-4">{surah.name}</h1>
          <h2 className="text-xl font-medium text-quran-primary">
            {surah.englishName} - {surah.frenchName}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {surah.englishNameTranslation} | {surah.numberOfAyahs} Verses | {surah.revelationType}
          </p>
          <Separator className="my-4 bg-quran-primary/20" />
          <p className="arabic text-xl my-4">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>

        <div className="space-y-4">
          {ayahs.map((ayah) => {
            const englishTranslation = englishTranslations.find(t => t.ayah === ayah.number);
            const frenchTranslation = frenchTranslations.find(t => t.ayah === ayah.number);

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
