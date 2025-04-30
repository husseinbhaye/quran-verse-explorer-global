
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
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
    <header className="bg-quran-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-24 h-24 flex items-center justify-center">
            <img 
              src="/lovable-uploads/72b66895-06f2-4960-a5ff-52e2a9ed4e85.png" 
              alt="Eemaan Foundation Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex flex-row items-center">
            <span className="text-quran-secondary font-bold text-4xl ml-2">القرآن الكريم</span>
            <span className="text-white mx-3 font-medium">|</span>
            <span className="text-white font-medium text-lg">Quran Explorer</span>
          </div>
        </div>
        
        <div className="flex w-full md:w-auto gap-2 justify-center md:justify-end">
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={displayLanguage === 'english' ? "Search the Quran..." : "Rechercher dans le Coran..."}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
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
            className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
            onClick={clearCacheAndReload}
            title={displayLanguage === 'english' ? "Clear cache and reload" : "Effacer le cache et recharger"}
          >
            <RefreshCw size={18} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary"
                className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
                aria-label={displayLanguage === 'english' ? "Filter by theme" : "Filtrer par thème"}
              >
                <Filter size={18} />
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
        </div>
      </div>

      <div className="container mx-auto mt-4 flex flex-wrap items-center justify-between">
        <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
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

        <div className="flex items-center mt-3 md:mt-0 justify-center md:justify-end gap-4">
          <div>
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
