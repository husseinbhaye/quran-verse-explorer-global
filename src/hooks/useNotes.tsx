
import { useState, useEffect } from 'react';

interface Note {
  surahId: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
  path?: string;
}

const BASE_PATH = "QuranNotes";

export const useNotes = (surahId: number, ayahNumber: number) => {
  const [note, setNote] = useState<string>('');
  const [path, setPath] = useState<string>(BASE_PATH);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const storageKey = `quran-note-${path}-${surahId}-${ayahNumber}`;

  useEffect(() => {
    // Load existing note
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) {
      const parsedNote: Note = JSON.parse(savedNote);
      setNote(parsedNote.text);
    }
  }, [storageKey]);

  // Check if File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return 'showSaveFilePicker' in window;
  };

  const ensureQuranNotesFolder = async (): Promise<FileSystemDirectoryHandle | null> => {
    if (!isFileSystemAccessSupported()) return null;

    try {
      // Request access to the root directory
      const rootHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      // Check if QuranNotes folder already exists
      let quranNotesFolder;
      try {
        quranNotesFolder = await rootHandle.getDirectoryHandle(BASE_PATH);
      } catch (error) {
        // Folder doesn't exist, so create it
        quranNotesFolder = await rootHandle.getDirectoryHandle(BASE_PATH, { create: true });
      }

      return quranNotesFolder;
    } catch (error) {
      console.error("Error creating QuranNotes folder:", error);
      return null;
    }
  };

  const saveNote = async (text: string, notePath?: string) => {
    const actualPath = notePath || path;
    const noteData: Note = {
      surahId,
      ayahNumber,
      text,
      path: actualPath,
      createdAt: new Date().toISOString(),
    };

    try {
      // First, save to localStorage as fallback
      const key = `quran-note-${actualPath}-${surahId}-${ayahNumber}`;
      localStorage.setItem(key, JSON.stringify(noteData));
      setNote(text);
      setPath(actualPath);

      // Now try to save to file system if supported
      if (isFileSystemAccessSupported()) {
        const quranNotesFolder = await ensureQuranNotesFolder();
        if (!quranNotesFolder) return;

        const filename = `surah_${surahId}_ayah_${ayahNumber}.txt`;
        const fileHandle = await quranNotesFolder.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
      }
    } catch (error) {
      console.error("Error saving note:", error);
      throw new Error("Failed to save note");
    }
  };

  const chooseFileLocation = async () => {
    if (!isFileSystemAccessSupported()) {
      return false;
    }

    try {
      const quranNotesFolder = await ensureQuranNotesFolder();
      if (!quranNotesFolder) return false;

      const filename = `surah_${surahId}_ayah_${ayahNumber}.txt`;
      const handle = await quranNotesFolder.getFileHandle(filename, { create: true });
      
      return true;
    } catch (error) {
      console.error("Error choosing file location:", error);
      return false;
    }
  };

  return { 
    note, 
    saveNote, 
    path, 
    setPath, 
    basePath: BASE_PATH, 
    isFileSystemAccessSupported: isFileSystemAccessSupported(),
    chooseFileLocation 
  };
};

