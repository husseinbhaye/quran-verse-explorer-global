
import React from 'react';
import { Surah } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface SurahListProps {
  surahs: Surah[];
  selectedSurah: number | null;
  onSelectSurah: (surahId: number) => void;
  displayLanguage: 'english' | 'french';
}

const SurahList = ({ surahs, selectedSurah, onSelectSurah, displayLanguage }: SurahListProps) => {
  return (
    <aside className="w-full md:w-64 bg-card border-r sticky top-0 h-screen">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {displayLanguage === 'english' ? 'Chapters (Surahs)' : 'Chapitres (Sourates)'}
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-2">
          {surahs.map((surah) => (
            <Button
              key={surah.id}
              variant="ghost"
              className={`w-full justify-between mb-1 ${
                selectedSurah === surah.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : ''
              }`}
              onClick={() => onSelectSurah(surah.id)}
            >
              <span className="flex items-center">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-quran-primary/10 text-xs mr-2">
                  {surah.id}
                </span>
                <span className="text-left">
                  {displayLanguage === 'english' ? surah.englishName : surah.frenchName}
                </span>
              </span>
              <span className="arabic text-xs opacity-80">{surah.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default SurahList;
