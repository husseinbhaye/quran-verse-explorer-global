
import React from 'react';

interface NavigationLinksProps {
  displayLanguage: 'english' | 'french';
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({ displayLanguage }) => {
  return (
    <nav className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm mb-2 md:mb-0">
      <a 
        href="https://www.eemaanfoundation.org/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-white hover:text-quran-secondary transition-colors"
      >
        Eemaan Foundation
      </a>
      <span className="hidden md:inline text-quran-secondary">|</span>
      <a 
        href="https://islamic-institute.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-white hover:text-quran-secondary transition-colors"
      >
        Islamic Institute
      </a>
      <span className="hidden md:inline text-quran-secondary">|</span>
      <a 
        href="https://www.facebook.com/FatwaSeries" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-white hover:text-quran-secondary transition-colors"
      >
        Fatwa Series
      </a>
    </nav>
  );
};

export default NavigationLinks;
