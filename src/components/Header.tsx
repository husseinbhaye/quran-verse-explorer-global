import React from 'react';
import { Moon, Sun, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
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
          
          <div className="flex flex-col">
            <div className="text-quran-secondary font-bold text-3xl">
              القرآن الكريم
            </div>
            <div className="text-white font-medium text-lg hidden md:block">
              | Quran Explorer
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex w-full md:w-1/2 space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the Quran..."
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
      </div>
      
      <div className="container mx-auto mt-4">
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
      </div>
      
      <div className="container mx-auto mt-2 bg-quran-secondary/20 py-2 border-y border-quran-secondary/30">
        <div className="marquee-container">
          <div className="marquee-content">
            DONATE TO EEMAAN FOUNDATION MAURITIUS: MCB BANK ACCOUNT: 000451030435 - (IBAN: MU25MCBL0944000451030435000MUR) - Zakat, Lillah, Sadaqah Jaariyah.
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
