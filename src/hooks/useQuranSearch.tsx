
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Ayah, Translation } from '../types/quran';
import { searchQuran } from '../services';

interface UseQuranSearchProps {
  displayLanguage: 'english' | 'french';
}

export const useQuranSearch = ({ displayLanguage }: UseQuranSearchProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ayah[]>([]);
  const [searchTranslations, setSearchTranslations] = useState<{
    english: Record<number, Translation>;
    french: Record<number, Translation>;
  }>({
    english: {},
    french: {}
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setShowSearchResults(true);
    setIsSearching(true);

    try {
      // Only search in English as it's the most reliable endpoint
      const englishResults = await searchQuran(query, 'english');

      // Use the English results for both display purposes
      setSearchResults(englishResults);

      // Create translation lookup maps
      const englishMap: Record<number, Translation> = {};
      
      englishResults.forEach(ayah => {
        englishMap[ayah.number] = {
          text: ayah.text,
          ayah: ayah.number,
          language: 'english'
        };
      });

      // Since we don't have French translations from the search, 
      // we'll use the English ones for both languages
      setSearchTranslations({
        english: englishMap,
        french: englishMap // Use English translations for French display too
      });

    } catch (error) {
      toast({
        title: displayLanguage === 'english' ? 'Search Error' : 'Erreur de recherche',
        description: displayLanguage === 'english' 
          ? 'Failed to search the Quran' 
          : 'Échec de la recherche dans le Coran',
        variant: 'destructive',
      });
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const closeSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  return {
    searchQuery,
    searchResults,
    searchTranslations,
    isSearching,
    showSearchResults,
    handleSearch,
    closeSearch
  };
};
