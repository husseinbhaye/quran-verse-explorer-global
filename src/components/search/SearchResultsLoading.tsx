
import React from 'react';

interface SearchResultsLoadingProps {
  displayLanguage: 'english' | 'french';
}

const SearchResultsLoading: React.FC<SearchResultsLoadingProps> = () => {
  return (
    <div className="flex items-center justify-center p-8 flex-1 bg-white dark:bg-slate-900">
      <div className="w-12 h-12 border-4 border-t-quran-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default SearchResultsLoading;
