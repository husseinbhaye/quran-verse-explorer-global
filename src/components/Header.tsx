
import React, { useState } from 'react';
import { Filter, Search, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { commonThemes } from '../services/themeService';
import { AudioRecorder } from './audio';
import TextSizeControl from './TextSizeControl';
import { toast } from 'sonner';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSearchBar(false);
    }
  };

  const handleThemeSelect = (themeId: string) => {
    if (onThemeSelect) {
      onThemeSelect(themeId);
    }
  };

  const clearCacheAndReload = () => {
    // Clear localStorage
    localStorage.clear();
    // Clear sessionStorage
    sessionStorage.clear();
    // Show toast notification
    toast.info(displayLanguage === 'english' ? 'Clearing cache and reloading...' : 'Effacement du cache et rechargement...');
    
    // Short timeout to allow toast to display before reload
    setTimeout(() => {
      // Force reload from server without using cache
      window.location.href = window.location.href.split('?')[0] + '?fresh=' + Date.now();
    }, 1000);
  };

  return (
    <header className="bg-quran-primary text-white p-3 md:p-4 shadow-md">
      <div className="container mx-auto flex flex-col items-center">
        {/* Logo and Title Section */}
        <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-4 w-full justify-center">
          <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
            <img 
              src="/lovable-uploads/72b66895-06f2-4960-a5ff-52e2a9ed4e85.png" 
              alt="Eemaan Foundation Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <span className="text-quran-secondary font-bold text-2xl md:text-4xl">القرآن الكريم</span>
            <span className="hidden md:inline text-white mx-3 font-medium">|</span>
            <span className="text-white font-medium text-base md:text-lg">Quran Explorer</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-2 md:mt-4">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm mb-2 md:mb-0">
          <a 
            href="https://www.eemaanfoundation.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-quran-secondary transition-colors"
          >
            Eemaan Foundation
          </a>
          <span className="hidden md:inline text-quran-secondary">|</span>
          <a 
            href="https://islamic-institute.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-quran-secondary transition-colors"
          >
            Islamic Institute
          </a>
          <span className="hidden md:inline text-quran-secondary">|</span>
          <a 
            href="https://www.facebook.com/FatwaSeries" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-quran-secondary transition-colors"
          >
            Fatwa Series
          </a>
        </nav>

        {/* Search and Actions */}
        <div className="flex items-center mt-2 justify-center gap-2">
          {/* Mobile search toggle */}
          {!showSearchBar ? (
            <Button 
              variant="secondary"
              size="sm"
              className="md:hidden bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
              onClick={() => setShowSearchBar(true)}
            >
              <Search size={16} />
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="flex space-x-1 w-full md:w-auto">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={displayLanguage === 'english' ? "Search..." : "Rechercher..."}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm h-8"
                autoFocus
              />
              <Button 
                type="submit" 
                variant="secondary"
                size="sm"
                className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
              >
                <Search size={16} />
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowSearchBar(false)}
              >
                ✕
              </Button>
            </form>
          )}
          
          {/* Desktop search */}
          <form onSubmit={handleSubmit} className="hidden md:flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={displayLanguage === 'english' ? "Search the Quran..." : "Rechercher dans le Coran..."}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 w-32 md:w-auto"
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
            >
              <Search size={18} />
            </Button>
          </form>
          
          <Button 
            variant="secondary"
            size="sm"
            className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
            onClick={clearCacheAndReload}
            title={displayLanguage === 'english' ? "Clear cache and reload" : "Effacer le cache et recharger"}
          >
            <RefreshCw size={16} className="md:size-18" />
          </Button>
          
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
                    onClick={() => handleThemeSelect(theme.id)}
                    className="cursor-pointer hover:bg-quran-primary/10"
                  >
                    {displayLanguage === 'english' ? theme.label.english : theme.label.french}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="border-l border-white/30 ml-1 pl-2">
            <AudioRecorder 
              displayLanguage={displayLanguage} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
