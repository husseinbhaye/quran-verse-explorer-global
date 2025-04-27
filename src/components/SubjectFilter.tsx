
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubjectFilterProps {
  onSelectSubject: (subject: string) => void;
  displayLanguage: 'english' | 'french';
}

const subjects = {
  english: [
    { id: 'faith', label: 'Faith & Belief' },
    { id: 'worship', label: 'Worship & Prayer' },
    { id: 'ethics', label: 'Ethics & Morality' },
    { id: 'stories', label: 'Prophetic Stories' },
    { id: 'heaven', label: 'Paradise & Hellfire' },
    { id: 'law', label: 'Islamic Law' },
  ],
  french: [
    { id: 'faith', label: 'Foi et Croyance' },
    { id: 'worship', label: 'Adoration et Prière' },
    { id: 'ethics', label: 'Éthique et Moralité' },
    { id: 'stories', label: 'Histoires des Prophètes' },
    { id: 'heaven', label: 'Paradis et Enfer' },
    { id: 'law', label: 'Loi Islamique' },
  ]
};

const SubjectFilter = ({ onSelectSubject, displayLanguage }: SubjectFilterProps) => {
  return (
    <Select onValueChange={onSelectSubject}>
      <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm">
        <SelectValue placeholder={displayLanguage === 'english' ? 'Filter by subject' : 'Filtrer par sujet'} />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-sm">
        {subjects[displayLanguage].map((subject) => (
          <SelectItem key={subject.id} value={subject.id}>
            {subject.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
