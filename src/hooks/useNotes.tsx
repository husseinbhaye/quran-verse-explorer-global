
import { useState, useEffect } from 'react';

interface Note {
  surahId: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
  path?: string;
}

export const useNotes = (surahId: number, ayahNumber: number) => {
  const [note, setNote] = useState<string>('');
  const [path, setPath] = useState<string>('default');
  const storageKey = `quran-note-${path}-${surahId}-${ayahNumber}`;

  useEffect(() => {
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) {
      const parsedNote: Note = JSON.parse(savedNote);
      setNote(parsedNote.text);
    }
  }, [storageKey]);

  const saveNote = (text: string, notePath?: string) => {
    const actualPath = notePath || path;
    const noteData: Note = {
      surahId,
      ayahNumber,
      text,
      path: actualPath,
      createdAt: new Date().toISOString(),
    };
    const key = `quran-note-${actualPath}-${surahId}-${ayahNumber}`;
    localStorage.setItem(key, JSON.stringify(noteData));
    setNote(text);
    setPath(actualPath);
  };

  return { note, saveNote, path, setPath };
};
