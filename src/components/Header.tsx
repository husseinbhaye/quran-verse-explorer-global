
import React from 'react';
import { LogoTitle, NavigationLinks, SearchBar, ThemeFilter, CacheResetButton } from './header';
import { AudioRecorder } from './audio';
import TextSizeControl from './TextSizeControl';

interface HeaderProps {
  onSearch: (query: string) => void;
  onThemeSelect?: (themeId: string) => void;
  displayLanguage?: 'english' | 'french';
  textSize: "sm" | "base" | "lg" | "xl";
  setTextSize: (size: "sm" | "base" | "lg" | "xl") => void;
  onSelectAyah?: (surahId: number, ayahNumber: number) => void;
}

const Header = ({ 
  onSearch, 
  onThemeSelect, 
  displayLanguage = 'english', 
  textSize, 
  setTextSize,
  onSelectAyah 
}: HeaderProps) => {
  const handleThemeSelect = (themeId: string) => {
    if (onThemeSelect) {
      onThemeSelect(themeId);
    }
  };

  return (
    <header className="bg-quran-primary text-white p-3 md:p-4 shadow-md">
      <div className="container mx-auto flex flex-col items-center">
        {/* Logo and Title Section */}
        <LogoTitle />
      </div>

      <div className="container mx-auto mt-2 md:mt-4">
        {/* Navigation Links */}
        <NavigationLinks displayLanguage={displayLanguage} />

        {/* Search and Actions */}
        <div className="flex items-center mt-2 justify-center gap-2">
          {/* Search functionality */}
          <SearchBar onSearch={onSearch} displayLanguage={displayLanguage} />
          
          {/* Cache reset button */}
          <CacheResetButton displayLanguage={displayLanguage} />
          
          {/* Theme filter dropdown */}
          {onThemeSelect && (
            <ThemeFilter onThemeSelect={handleThemeSelect} displayLanguage={displayLanguage} />
          )}
          
          {/* Audio recorder */}
          <div className="border-l border-white/30 ml-1 pl-2">
            <AudioRecorder displayLanguage={displayLanguage} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
