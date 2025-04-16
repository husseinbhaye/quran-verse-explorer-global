
import { useState, useEffect } from 'react';
import { getBookmarks, addBookmark, removeBookmark, isBookmarked, Bookmark } from '../services/bookmarkService';
import { Ayah } from '../types/quran';
import { useToast } from './use-toast';

interface UseBookmarksProps {
  displayLanguage: 'english' | 'french';
}

export const useBookmarks = ({ displayLanguage }: UseBookmarksProps) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const toggleBookmark = (ayah: Ayah, surahName: string) => {
    if (isBookmarked(ayah.number)) {
      const updated = removeBookmark(ayah.number);
      setBookmarks(updated);
      toast({
        title: displayLanguage === 'english' ? 'Bookmark removed' : 'Signet supprimé',
        description: displayLanguage === 'english' 
          ? `Removed Ayah ${ayah.surah}:${ayah.numberInSurah} from bookmarks` 
          : `Ayah ${ayah.surah}:${ayah.numberInSurah} supprimé des signets`,
      });
    } else {
      const updated = addBookmark(ayah, surahName);
      setBookmarks(updated);
      toast({
        title: displayLanguage === 'english' ? 'Bookmark added' : 'Signet ajouté',
        description: displayLanguage === 'english' 
          ? `Added Ayah ${ayah.surah}:${ayah.numberInSurah} to bookmarks` 
          : `Ayah ${ayah.surah}:${ayah.numberInSurah} ajouté aux signets`,
      });
    }
  };

  const checkIsBookmarked = (ayahNumber: number) => {
    return isBookmarked(ayahNumber);
  };

  const refreshBookmarks = () => {
    setBookmarks(getBookmarks());
  };

  return {
    bookmarks,
    toggleBookmark,
    checkIsBookmarked,
    refreshBookmarks
  };
};
