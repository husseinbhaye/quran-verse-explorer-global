
import React from 'react';

interface SearchResultsSummaryProps {
  displayedCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  displayLanguage: 'english' | 'french';
}

const SearchResultsSummary: React.FC<SearchResultsSummaryProps> = ({
  displayedCount,
  totalCount,
  currentPage,
  totalPages,
  displayLanguage
}) => {
  return (
    <p className="text-sm text-muted-foreground">
      {displayLanguage === 'english' 
        ? `Showing ${displayedCount} of ${totalCount} results (Page ${currentPage} of ${totalPages})` 
        : `Affichage de ${displayedCount} sur ${totalCount} résultats (Page ${currentPage} sur ${totalPages})`}
    </p>
  );
};

export default SearchResultsSummary;
