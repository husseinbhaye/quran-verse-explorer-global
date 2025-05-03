
import React from 'react';
import { Button } from '../ui/button';
import { Surah } from '../../types/quran';

interface SurahButtonProps {
  surah: Surah;
  isSelected: boolean;
  displayLanguage: 'english' | 'french';
  onClick: () => void;
}

const SurahButton: React.FC<SurahButtonProps> = ({ 
  surah, 
  isSelected, 
  displayLanguage, 
  onClick 
}) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-between mb-1 ${
        isSelected ? 'bg-primary/10 text-primary font-medium' : ''
      }`}
      onClick={onClick}
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
  );
};

export default SurahButton;
