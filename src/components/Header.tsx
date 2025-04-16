
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
          {/* Logo Placeholder - Replace with your actual logo */}
          <div className="w-12 h-12 bg-quran-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">Q</span>
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
    </header>
  );
};

export default Header;
