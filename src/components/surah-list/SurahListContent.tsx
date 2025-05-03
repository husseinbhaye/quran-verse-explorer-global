
import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Surah } from '../../types/quran';
import SurahButton from './SurahButton';

interface SurahListContentProps {
  surahs: Surah[];
  selectedSurah: number | null;
  onSelectSurah: (surahId: number) => void;
  displayLanguage: 'english' | 'french';
  onCloseMobile?: () => void;
}

const SurahListContent: React.FC<SurahListContentProps> = ({
  surahs,
  selectedSurah,
  onSelectSurah,
  displayLanguage,
  onCloseMobile
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="p-2">
        {surahs.map((surah) => (
          <SurahButton
            key={surah.id}
            surah={surah}
            isSelected={selectedSurah === surah.id}
            displayLanguage={displayLanguage}
            onClick={() => {
              onSelectSurah(surah.id);
              if (onCloseMobile) onCloseMobile();
            }}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default SurahListContent;
