
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { commonThemes } from '../../services/themeService';

interface ThemeFilterProps {
  onThemeSelect: (themeId: string) => void;
  displayLanguage: 'english' | 'french';
}

const ThemeFilter: React.FC<ThemeFilterProps> = ({ onThemeSelect, displayLanguage }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary"
          size="sm"
          className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
          aria-label={displayLanguage === 'english' ? "Filter by theme" : "Filtrer par thème"}
        >
          <Filter size={16} className="md:size-18" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white/95 shadow-lg backdrop-blur-sm border border-quran-primary/20">
        <DropdownMenuGroup>
          {commonThemes.map((theme) => (
            <DropdownMenuItem 
              key={theme.id}
              onClick={() => onThemeSelect(theme.id)}
              className="cursor-pointer hover:bg-quran-primary/10"
            >
              {displayLanguage === 'english' ? theme.label.english : theme.label.french}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeFilter;
