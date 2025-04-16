
import React, { useState } from 'react';
import { Ayah, Translation } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import AyahView from './AyahView';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const resultsPerPage = 5;
  
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const displayedResults = results.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll back to top of results when page changes
    const resultsContainer = document.querySelector('.search-results-content');
    if (resultsContainer) {
      resultsContainer.scrollTop = 0;
    }
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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    
    // Ensure we always show at least 3 pages when possible
    if (endPage - startPage + 1 < 3 && totalPages > 2) {
      if (startPage === 1) {
        endPage = Math.min(3, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 2);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

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
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full max-h-[calc(90vh-9rem)] search-results-content">
            <div className="p-4">
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
                      ? `Showing ${displayedResults.length} of ${results.length} results (Page ${currentPage} of ${totalPages})` 
                      : `Affichage de ${displayedResults.length} sur ${results.length} résultats (Page ${currentPage} sur ${totalPages})`}
                  </p>
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
                  
                  {results.length > resultsPerPage && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={goToPreviousPage}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {getPageNumbers().map(page => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={page === currentPage}
                              onClick={() => handlePageChange(page)}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={goToNextPage}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
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
