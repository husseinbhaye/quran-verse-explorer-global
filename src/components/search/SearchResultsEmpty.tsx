
import React from 'react';

interface SearchResultsEmptyProps {
  displayLanguage: 'english' | 'french';
}

const SearchResultsEmpty: React.FC<SearchResultsEmptyProps> = ({ displayLanguage }) => {
  return (
    <div className="text-center p-8 flex-1">
      <p className="text-muted-foreground">
        {displayLanguage === 'english' 
          ? 'No results found. Try a different search term.' 
          : 'Aucun résultat trouvé. Essayez un autre terme de recherche.'}
      </p>
    </div>
  );
};

export default SearchResultsEmpty;
