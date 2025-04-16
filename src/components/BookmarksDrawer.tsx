
import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter
} from './ui/drawer';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { getBookmarks, removeBookmark, Bookmark as BookmarkType } from '../services/bookmarkService';
import { Card, CardContent, CardHeader } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface BookmarksDrawerProps {
  displayLanguage: 'english' | 'french';
  onSelectAyah: (surahId: number, ayahNumber: number) => void;
}

const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({ displayLanguage, onSelectAyah }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setBookmarks(getBookmarks());
    }
  }, [open]);

  const handleRemoveBookmark = (ayahNumber: number) => {
    const updated = removeBookmark(ayahNumber);
    setBookmarks(updated);
  };

  const handleSelectAyah = (bookmark: BookmarkType) => {
    onSelectAyah(bookmark.ayah.surah, bookmark.ayah.numberInSurah);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bookmark className="h-4 w-4" />
          <span>{displayLanguage === 'english' ? 'Bookmarks' : 'Signets'}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {displayLanguage === 'english' ? 'Your Bookmarks' : 'Vos Signets'}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[60vh]">
          <div className="p-4 grid gap-4">
            {bookmarks.length > 0 ? (
              bookmarks.map(bookmark => (
                <Card key={bookmark.id} className="border-quran-primary/20">
                  <CardHeader className="p-3 bg-quran-primary/10 flex flex-row items-center justify-between">
                    <div className="text-sm font-medium">
                      {bookmark.surahName} ({bookmark.ayah.surah}:{bookmark.ayah.numberInSurah})
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSelectAyah(bookmark)}
                      >
                        {displayLanguage === 'english' ? 'View' : 'Voir'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveBookmark(bookmark.ayah.number)}
                      >
                        {displayLanguage === 'english' ? 'Remove' : 'Supprimer'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <p className="arabic text-right text-lg" dir="rtl">
                      {bookmark.ayah.text.length > 100 
                        ? `${bookmark.ayah.text.substring(0, 100)}...` 
                        : bookmark.ayah.text}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {displayLanguage === 'english' 
                  ? 'No bookmarks yet. Bookmark your favorite ayahs to see them here.' 
                  : 'Pas encore de signets. Ajoutez vos ayahs préférés en favoris pour les voir ici.'}
              </div>
            )}
          </div>
        </ScrollArea>
        <DrawerFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {displayLanguage === 'english' ? 'Close' : 'Fermer'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BookmarksDrawer;
