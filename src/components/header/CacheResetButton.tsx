
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface CacheResetButtonProps {
  displayLanguage: 'english' | 'french';
}

const CacheResetButton: React.FC<CacheResetButtonProps> = ({ displayLanguage }) => {
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
    <Button 
      variant="secondary"
      size="sm"
      className="bg-quran-secondary text-quran-dark hover:bg-quran-secondary/90"
      onClick={clearCacheAndReload}
      title={displayLanguage === 'english' ? "Clear cache and reload" : "Effacer le cache et recharger"}
    >
      <RefreshCw size={16} className="md:size-18" />
    </Button>
  );
};

export default CacheResetButton;
