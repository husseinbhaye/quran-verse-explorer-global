
import { useState, useEffect } from 'react';

interface Note {
  surahId: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
}

export const useNotes = (surahId: number, ayahNumber: number) => {
  const [note, setNote] = useState<string>('');
  const storageKey = `quran-note-${surahId}-${ayahNumber}`;

  useEffect(() => {
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) {
      const parsedNote: Note = JSON.parse(savedNote);
      setNote(parsedNote.text);
    }
  }, [storageKey]);

  const saveNote = (text: string) => {
    const noteData: Note = {
      surahId,
      ayahNumber,
      text,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(noteData));
    setNote(text);
  };

  return { note, saveNote };
};
