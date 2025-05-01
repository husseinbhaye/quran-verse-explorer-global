
import React, { useState, useEffect } from 'react';
import { Ayah, Translation } from '../types/quran';
import { SearchResultsModal } from './search';

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
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4;
  
  const totalPages = Math.ceil(results.length / resultsPerPage);
  
  // Reset page when new results come in
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);
  
  // Reset scroll position when page changes
  useEffect(() => {
    // The scroll area is now handled in the SearchContent component
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <SearchResultsModal
      results={results}
      loading={loading}
      searchQuery={searchQuery}
      englishTranslations={englishTranslations}
      frenchTranslations={frenchTranslations}
      onClose={onClose}
      displayLanguage={displayLanguage}
      showBothTranslations={showBothTranslations}
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      goToNextPage={goToNextPage}
      goToPreviousPage={goToPreviousPage}
    />
  );
};

export default SearchResults;
