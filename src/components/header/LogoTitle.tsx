
import React from 'react';

const LogoTitle: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-4 w-full justify-center">
      <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
        <img 
          src="/lovable-uploads/72b66895-06f2-4960-a5ff-52e2a9ed4e85.png" 
          alt="Eemaan Foundation Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex flex-col md:flex-row items-center">
        <span className="text-quran-secondary font-bold text-2xl md:text-4xl">القرآن الكريم</span>
        <span className="hidden md:inline text-white mx-3 font-medium">|</span>
        <span className="text-white font-medium text-base md:text-lg">Quran Explorer</span>
      </div>
    </div>
  );
};

export default LogoTitle;
