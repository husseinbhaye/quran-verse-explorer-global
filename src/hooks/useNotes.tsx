
import { useState, useEffect } from 'react';

interface Note {
  surahId: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
  path?: string;
}

const BASE_PATH = "C:\\Users\\peerb\\OneDrive\\Documents\\QuranNotes";

export const useNotes = (surahId: number, ayahNumber: number) => {
  const [note, setNote] = useState<string>('');
  const [path, setPath] = useState<string>(BASE_PATH);
  const storageKey = `quran-note-${path}-${surahId}-${ayahNumber}`;

  useEffect(() => {
    // Create directory if it doesn't exist
    try {
      if (window && !window.electronAPI) {
        console.warn("This feature requires Electron for full filesystem access. Falling back to localStorage.");
      }
    } catch (error) {
      console.error("Error accessing file system:", error);
    }

    // Load existing note
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

    try {
      // For now, we'll use localStorage as a fallback
      const key = `quran-note-${actualPath}-${surahId}-${ayahNumber}`;
      localStorage.setItem(key, JSON.stringify(noteData));
      setNote(text);
      setPath(actualPath);
    } catch (error) {
      console.error("Error saving note:", error);
      throw new Error("Failed to save note");
    }
  };

  return { note, saveNote, path, setPath, basePath: BASE_PATH };
};

