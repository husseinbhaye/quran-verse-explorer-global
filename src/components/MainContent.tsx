
import React from 'react';
import { Surah, Ayah, Translation } from '../types/quran';
import SurahView from './SurahView';
import LanguageSelector from './LanguageSelector';
import TextSizeControl from './TextSizeControl';

interface MainContentProps {
  selectedSurah: Surah | null;
  ayahs: Ayah[];
  englishTranslations: Translation[];
  frenchTranslations: Translation[];
  loading: boolean;
  showBothTranslations: boolean;
  displayLanguage: 'english' | 'french';
  setDisplayLanguage: (language: 'english' | 'french') => void;
  setShowBothTranslations: (show: boolean) => void;
  onSelectAyah: (surahId: number, ayahNumber: number) => void;
  textSize: "sm" | "base" | "lg" | "xl";
  setTextSize: (size: "sm" | "base" | "lg" | "xl") => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedSurah,
  ayahs,
  englishTranslations,
  frenchTranslations,
  loading,
  showBothTranslations,
  displayLanguage,
  setDisplayLanguage,
  setShowBothTranslations,
  onSelectAyah,
  textSize,
  setTextSize
}) => {
  console.log("MainContent rendered with textSize:", textSize);
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2">
          <TextSizeControl 
            textSize={textSize}
            setTextSize={setTextSize}
          />
        </div>
        <LanguageSelector 
          displayLanguage={displayLanguage}
          setDisplayLanguage={setDisplayLanguage}
          showBothTranslations={showBothTranslations}
          setShowBothTranslations={setShowBothTranslations}
        />
      </div>
      
      <SurahView 
        surah={selectedSurah}
        ayahs={ayahs}
        englishTranslations={englishTranslations}
        frenchTranslations={frenchTranslations}
        loading={loading}
        showBothTranslations={showBothTranslations}
        displayLanguage={displayLanguage}
        textSize={textSize}
      />
    </div>
  );
};

export default MainContent;
