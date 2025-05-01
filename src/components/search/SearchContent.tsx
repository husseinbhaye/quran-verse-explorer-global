
import React, { useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AyahView from '../AyahView';
import SearchResultsEmpty from './SearchResultsEmpty';
import SearchResultsLoading from './SearchResultsLoading';
import SearchResultsSummary from './SearchResultsSummary';

interface SearchContentProps {
  loading: boolean;
  results: any[];
  displayedResults: any[];
  currentPage: number;
  totalPages: number;
  displayLanguage: 'english' | 'french';
  englishTranslations: Record<number, any>;
  frenchTranslations: Record<number, any>;
  showBothTranslations: boolean;
}

const SearchContent: React.FC<SearchContentProps> = ({
  loading,
  results,
  displayedResults,
  currentPage,
  totalPages,
  displayLanguage,
  englishTranslations,
  frenchTranslations,
  showBothTranslations
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return <SearchResultsLoading displayLanguage={displayLanguage} />;
  }

  if (results.length === 0) {
    return <SearchResultsEmpty displayLanguage={displayLanguage} />;
  }

  return (
    <>
      <div className="p-4 pb-0">
        <SearchResultsSummary 
          displayedCount={displayedResults.length} 
          totalCount={results.length} 
          currentPage={currentPage} 
          totalPages={totalPages} 
          displayLanguage={displayLanguage} 
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[50vh]" ref={scrollAreaRef}>
          <div className="p-4 pt-2 space-y-4">
            {displayedResults.map((ayah) => (
              <AyahView
                key={ayah.number}
                ayah={ayah}
                englishTranslation={englishTranslations[ayah.number]}
                frenchTranslation={frenchTranslations[ayah.number]}
                showBoth={showBothTranslations}
                surahName={displayLanguage === 'english' ? 'Search Result' : 'Résultat de recherche'}
                displayLanguage={displayLanguage}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default SearchContent;
