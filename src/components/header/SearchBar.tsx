
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  displayLanguage: 'english' | 'french';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, displayLanguage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSearchBar(false);
    }
  };

  return (
    <>
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
    </>
  );
};

export default SearchBar;
