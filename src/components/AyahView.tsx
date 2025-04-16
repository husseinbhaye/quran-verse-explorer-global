
import React from 'react';
import { Ayah, Translation } from '../types/quran';
import { Card } from './ui/card';

interface AyahViewProps {
  ayah: Ayah;
  englishTranslation?: Translation;
  frenchTranslation?: Translation;
  showBoth: boolean;
}

const AyahView = ({ ayah, englishTranslation, frenchTranslation, showBoth }: AyahViewProps) => {
  return (
    <Card className="mb-6 overflow-hidden border-quran-primary/20 shadow-sm">
      <div className="bg-quran-primary/10 px-4 py-2 flex justify-between items-center border-b border-quran-primary/20">
        <span className="text-sm font-medium">
          {ayah.surah}:{ayah.numberInSurah}
        </span>
        <span className="bg-quran-primary text-white text-xs px-2 py-1 rounded-md">
          آية {ayah.numberInSurah}
        </span>
      </div>
      <div className="p-6">
        <p className="arabic text-right text-2xl leading-loose mb-4" dir="rtl">
          {ayah.text}
        </p>

        {englishTranslation && (
          <div className="mt-4 pt-4 border-t border-quran-primary/10">
            <h4 className="text-sm text-quran-primary font-medium mb-1">English</h4>
            <p className="text-gray-700">{englishTranslation.text}</p>
          </div>
        )}

        {frenchTranslation && showBoth && (
          <div className="mt-4 pt-4 border-t border-quran-primary/10">
            <h4 className="text-sm text-quran-primary font-medium mb-1">Français</h4>
            <p className="text-gray-700">{frenchTranslation.text}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AyahView;
