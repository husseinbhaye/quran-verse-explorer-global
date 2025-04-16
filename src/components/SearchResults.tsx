
import React from 'react';
import { Ayah, Translation } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import AyahView from './AyahView';

interface SearchResultsProps {
  results: Ayah[];
  loading: boolean;
  searchQuery: string;
  englishTranslations: Record<number, Translation>;
  frenchTranslations: Record<number, Translation>;
  onClose: () => void;
  displayLanguage: 'english' | 'french';
  showBothTranslations: boolean;
}

const SearchResults = ({
  results,
  loading,
  searchQuery,
  englishTranslations,
  frenchTranslations,
  onClose,
  displayLanguage,
  showBothTranslations
}: SearchResultsProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border shadow-lg rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {displayLanguage === 'english' ? 'Search Results' : 'Résultats de recherche'}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              "{searchQuery}"
            </span>
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="w-12 h-12 border-4 border-t-quran-primary rounded-full animate-spin"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                {displayLanguage === 'english' 
                  ? 'No results found. Try a different search term.' 
                  : 'Aucun résultat trouvé. Essayez un autre terme de recherche.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {displayLanguage === 'english' 
                  ? `Found ${results.length} results` 
                  : `Trouvé ${results.length} résultats`}
              </p>
              {results.map((ayah) => (
                <AyahView
                  key={ayah.number}
                  ayah={ayah}
                  englishTranslation={englishTranslations[ayah.number]}
                  frenchTranslation={frenchTranslations[ayah.number]}
                  showBoth={showBothTranslations}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            {displayLanguage === 'english' ? 'Close' : 'Fermer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
