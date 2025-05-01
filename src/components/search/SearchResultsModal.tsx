
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchHeader from './SearchHeader';
import SearchContent from './SearchContent';
import SearchPagination from './SearchPagination';

interface SearchResultsModalProps {
  results: any[];
  loading: boolean;
  searchQuery: string;
  englishTranslations: Record<number, any>;
  frenchTranslations: Record<number, any>;
  onClose: () => void;
  displayLanguage: 'english' | 'french';
  showBothTranslations: boolean;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

const SearchResultsModal = ({
  results,
  loading,
  searchQuery,
  englishTranslations,
  frenchTranslations,
  onClose,
  displayLanguage,
  showBothTranslations,
  currentPage,
  totalPages,
  handlePageChange,
  goToNextPage,
  goToPreviousPage
}: SearchResultsModalProps) => {
  const displayedResults = results.slice(
    (currentPage - 1) * 4, 
    currentPage * 4
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border shadow-lg rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <SearchHeader searchQuery={searchQuery} displayLanguage={displayLanguage} />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <SearchContent 
          loading={loading}
          results={results}
          displayedResults={displayedResults}
          currentPage={currentPage}
          totalPages={totalPages}
          displayLanguage={displayLanguage}
          englishTranslations={englishTranslations}
          frenchTranslations={frenchTranslations}
          showBothTranslations={showBothTranslations}
        />
        
        {results.length > 4 && (
          <div className="p-4 border-t">
            <SearchPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              goToPreviousPage={goToPreviousPage}
              goToNextPage={goToNextPage}
            />
          </div>
        )}
        
        <div className="p-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            {displayLanguage === 'english' ? 'Close' : 'Fermer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsModal;
