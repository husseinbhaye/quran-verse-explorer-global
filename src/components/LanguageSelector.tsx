
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Globe, Languages } from 'lucide-react';

interface LanguageProps {
  displayLanguage: 'english' | 'french';
  setDisplayLanguage: (language: 'english' | 'french') => void;
  showBothTranslations: boolean;
  setShowBothTranslations: (show: boolean) => void;
}

const LanguageSelector = ({
  displayLanguage,
  setDisplayLanguage,
  showBothTranslations,
  setShowBothTranslations
}: LanguageProps) => {
  // Fix the language handling by ensuring a defined value is always set
  const handleLanguageChange = (value: string | undefined) => {
    console.log('Language changed:', value); 
    // Only update if value is defined and is one of our supported languages
    if (value === 'english' || value === 'french') {
      setDisplayLanguage(value);
    }
  };

  // Log current language on mount and when it changes
  useEffect(() => {
    console.log('Current display language:', displayLanguage);
  }, [displayLanguage]);

  return (
    <div className="p-4 border-t bg-card flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center space-x-2 mb-3 sm:mb-0">
        <Globe size={18} className="text-quran-primary" />
        <span className="font-medium text-sm">Interface:</span>
        <ToggleGroup 
          type="single" 
          value={displayLanguage} 
          onValueChange={handleLanguageChange}
        >
          <ToggleGroupItem value="english" aria-label="English">EN</ToggleGroupItem>
          <ToggleGroupItem value="french" aria-label="French">FR</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowBothTranslations(!showBothTranslations)}
        className={showBothTranslations ? "bg-quran-primary/10" : ""}
      >
        <Languages size={16} className="mr-2" />
        {displayLanguage === 'english' 
          ? 'Show Both Translations' 
          : 'Afficher Les Deux Traductions'}
        {showBothTranslations && <span className="ml-2 text-xs">✓</span>}
      </Button>
    </div>
  );
};

export default LanguageSelector;
