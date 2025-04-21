
import React, { useState, useEffect, useRef } from 'react';
import { Ayah, Translation } from '../types/quran';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { X } from 'lucide-react';
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
  const resultsPerPage = 4; // UPDATED FROM 5 TO 4
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const displayedResults = results.slice(startIndex, endIndex);
  
  // Reset scroll position when page changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
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
        
        {loading ? (
          <div className="flex items-center justify-center p-8 flex-1">
            <div className="w-12 h-12 border-4 border-t-quran-primary rounded-full animate-spin"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center p-8 flex-1">
            <p className="text-muted-foreground">
              {displayLanguage === 'english' 
                ? 'No results found. Try a different search term.' 
                : 'Aucun résultat trouvé. Essayez un autre terme de recherche.'}
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 pb-0">
              <p className="text-sm text-muted-foreground">
                {displayLanguage === 'english' 
                  ? `Showing ${displayedResults.length} of ${results.length} results (Page ${currentPage} of ${totalPages})` 
                  : `Affichage de ${displayedResults.length} sur ${results.length} résultats (Page ${currentPage} sur ${totalPages})`}
              </p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[50vh]">
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
            
            {results.length > resultsPerPage && (
              <div className="p-4 border-t">
                <Pagination>
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
              </div>
            )}
          </>
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

export default SearchResults;
