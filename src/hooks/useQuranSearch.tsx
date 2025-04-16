
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
      // Search in all three languages
      const [arabicResults, englishResults, frenchResults] = await Promise.all([
        searchQuran(query, 'arabic'),
        searchQuran(query, 'english'),
        searchQuran(query, 'french')
      ]);

      // Combine and deduplicate results
      const allResults = [...arabicResults];
      const ayahNumbers = new Set(allResults.map(ayah => ayah.number));
      
      [...englishResults, ...frenchResults].forEach(ayah => {
        if (!ayahNumbers.has(ayah.number)) {
          ayahNumbers.add(ayah.number);
          allResults.push(ayah);
        }
      });

      setSearchResults(allResults);

      // Create translation lookup maps
      const englishMap: Record<number, Translation> = {};
      const frenchMap: Record<number, Translation> = {};
      
      englishResults.forEach(ayah => {
        englishMap[ayah.number] = {
          text: ayah.text,
          ayah: ayah.number,
          language: 'english'
        };
      });
      
      frenchResults.forEach(ayah => {
        frenchMap[ayah.number] = {
          text: ayah.text,
          ayah: ayah.number,
          language: 'french'
        };
      });

      setSearchTranslations({
        english: englishMap,
        french: frenchMap
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
