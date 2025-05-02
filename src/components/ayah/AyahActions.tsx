
import TextEditor from '@/components/TextEditor';
import BookmarkButton from '@/components/BookmarkButton';
import AyahShareButton from './AyahShareButton';
import PostcardGenerator from './postcard/PostcardGenerator';
import AudioPlayer from '@/components/audio';
import { AyahActionsProps } from './types';

const AyahActions = ({ ayah, surahName, displayLanguage, translationContent }: AyahActionsProps) => {
  return (
    <div className="border-t border-black/5 dark:border-white/5 pt-4 mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <TextEditor displayLanguage={displayLanguage} />
          <BookmarkButton 
            ayah={ayah} 
            surahName={surahName}
            displayLanguage={displayLanguage}
          />
          <AyahShareButton 
            ayah={ayah} 
            surahName={surahName}
            displayLanguage={displayLanguage}
          />
          <PostcardGenerator 
            ayah={ayah} 
            surahName={surahName}
            displayLanguage={displayLanguage}
            translationContent={translationContent}
          />
        </div>
        
        <div className="flex-1">
          <AudioPlayer 
            surahId={ayah.surah} 
            ayahId={ayah.numberInSurah}
            displayLanguage={displayLanguage}
            showRecordButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AyahActions;
