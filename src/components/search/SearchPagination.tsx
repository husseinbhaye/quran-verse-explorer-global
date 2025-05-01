
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
  goToPreviousPage,
  goToNextPage
}) => {
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
  );
};

export default SearchPagination;
