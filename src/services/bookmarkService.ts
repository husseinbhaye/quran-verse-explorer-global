
// Bookmark service to manage ayah bookmarks

import { Ayah } from '../types/quran';

// Type for bookmark entries
export interface Bookmark {
  id: string;
  ayah: Ayah;
  createdAt: Date;
  surahName: string;
}

// Get bookmarks from local storage
export const getBookmarks = (): Bookmark[] => {
  try {
    const bookmarks = localStorage.getItem('quran-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

// Add a bookmark
export const addBookmark = (ayah: Ayah, surahName: string): Bookmark[] => {
  try {
    const bookmarks = getBookmarks();
    
    // Check if already bookmarked
    const exists = bookmarks.some(bookmark => bookmark.ayah.number === ayah.number);
    
    if (!exists) {
      const newBookmark: Bookmark = {
        id: `bookmark-${ayah.number}`,
        ayah,
        createdAt: new Date(),
        surahName
      };
      
      const updatedBookmarks = [newBookmark, ...bookmarks];
      localStorage.setItem('quran-bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    }
    
    return bookmarks;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return getBookmarks();
  }
};

// Remove a bookmark
export const removeBookmark = (ayahNumber: number): Bookmark[] => {
  try {
    const bookmarks = getBookmarks();
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.ayah.number !== ayahNumber);
    localStorage.setItem('quran-bookmarks', JSON.stringify(updatedBookmarks));
    return updatedBookmarks;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return getBookmarks();
  }
};

// Check if an ayah is bookmarked
export const isBookmarked = (ayahNumber: number): boolean => {
  const bookmarks = getBookmarks();
  return bookmarks.some(bookmark => bookmark.ayah.number === ayahNumber);
};
