
import React from 'react';

interface SearchHeaderProps {
  searchQuery: string;
  displayLanguage: 'english' | 'french';
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ searchQuery, displayLanguage }) => {
  return (
    <h2 className="text-xl font-semibold">
      {displayLanguage === 'english' ? 'Search Results' : 'Résultats de recherche'}
      <span className="ml-2 text-sm font-normal text-muted-foreground">
        "{searchQuery}"
      </span>
    </h2>
  );
};

export default SearchHeader;
