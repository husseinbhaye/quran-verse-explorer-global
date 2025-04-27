
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VerseSelectorProps {
  totalVerses: number;
  onSelectVerse: (verse: number) => void;
  displayLanguage: 'english' | 'french';
}

const VerseSelector = ({ totalVerses, onSelectVerse, displayLanguage }: VerseSelectorProps) => {
  if (!totalVerses) return null;

  return (
    <Select onValueChange={(value) => onSelectVerse(Number(value))}>
      <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm">
        <SelectValue placeholder={displayLanguage === 'english' ? 'Select verse' : 'Sélectionner un verset'} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-sm">
        {Array.from({ length: totalVerses }, (_, i) => i + 1).map((verse) => (
          <SelectItem key={verse} value={verse.toString()}>
            {displayLanguage === 'english' ? `Verse ${verse}` : `Verset ${verse}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VerseSelector;
