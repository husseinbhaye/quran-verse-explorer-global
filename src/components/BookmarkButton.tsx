
import React from 'react';
import { Bookmark, BookmarkX } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { addBookmark, removeBookmark, isBookmarked } from '../services/bookmarkService';
import { Ayah } from '../types/quran';

interface BookmarkButtonProps {
  ayah: Ayah;
  surahName: string;
  displayLanguage: 'english' | 'french';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ ayah, surahName, displayLanguage }) => {
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = React.useState(false);
  
  // Check if this ayah is bookmarked on component mount
  React.useEffect(() => {
    setBookmarked(isBookmarked(ayah.number));
  }, [ayah.number]);

  const handleToggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(ayah.number);
      setBookmarked(false);
      toast({
        title: displayLanguage === 'english' ? 'Bookmark removed' : 'Signet supprimé',
        description: displayLanguage === 'english' 
          ? `Removed Ayah ${ayah.surah}:${ayah.numberInSurah} from bookmarks` 
          : `Ayah ${ayah.surah}:${ayah.numberInSurah} supprimé des signets`,
      });
    } else {
      addBookmark(ayah, surahName);
      setBookmarked(true);
      toast({
        title: displayLanguage === 'english' ? 'Bookmark added' : 'Signet ajouté',
        description: displayLanguage === 'english' 
          ? `Added Ayah ${ayah.surah}:${ayah.numberInSurah} to bookmarks` 
          : `Ayah ${ayah.surah}:${ayah.numberInSurah} ajouté aux signets`,
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleBookmark}
      className="text-quran-primary hover:bg-quran-primary/10"
    >
      {bookmarked ? (
        <BookmarkX className="h-4 w-4 mr-1" />
      ) : (
        <Bookmark className="h-4 w-4 mr-1" />
      )}
      <span className="text-xs">
        {bookmarked 
          ? (displayLanguage === 'english' ? 'Remove' : 'Supprimer') 
          : (displayLanguage === 'english' ? 'Bookmark' : 'Signet')}
      </span>
    </Button>
  );
};

export default BookmarkButton;
