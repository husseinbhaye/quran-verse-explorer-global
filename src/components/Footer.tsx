
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-quran-primary text-white py-3 text-center text-sm mt-auto">
      <div className="container mx-auto">
        Eemaan Foundation - Copyright {currentYear}
        {/* Version marker: 2025-04-30 */}
      </div>
    </footer>
  );
};

export default Footer;
