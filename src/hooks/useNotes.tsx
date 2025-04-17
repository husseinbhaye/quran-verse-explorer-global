
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
  const [fsApiAvailable, setFsApiAvailable] = useState<boolean | null>(null);
  const storageKey = `quran-note-${path}-${surahId}-${ayahNumber}`;

  // Check API availability on mount
  useEffect(() => {
    const checkApiAvailability = () => {
      const isAvailable = 'showSaveFilePicker' in window;
      setFsApiAvailable(isAvailable);
      return isAvailable;
    };
    
    checkApiAvailability();
  }, []);

  useEffect(() => {
    // Load existing note
    const savedNote = localStorage.getItem(storageKey);
    if (savedNote) {
      try {
        const parsedNote: Note = JSON.parse(savedNote);
        setNote(parsedNote.text);
      } catch (e) {
        console.error("Error parsing saved note:", e);
      }
    }
  }, [storageKey]);

  // Check if File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return fsApiAvailable === true;
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
      // Better error handling, checking for specific security errors
      console.error("Error creating QuranNotes folder:", error);
      
      if (error instanceof DOMException && 
         (error.name === "SecurityError" || error.message.includes("Cross origin"))) {
        // This is likely due to running in an iframe or cross-origin context
        setFsApiAvailable(false);
      }
      
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

    // Always save to localStorage as primary storage or fallback
    const key = `quran-note-${actualPath}-${surahId}-${ayahNumber}`;
    localStorage.setItem(key, JSON.stringify(noteData));
    setNote(text);
    setPath(actualPath);

    // Try to save to file system if supported
    if (isFileSystemAccessSupported()) {
      try {
        const quranNotesFolder = await ensureQuranNotesFolder();
        if (!quranNotesFolder) return;

        const filename = `surah_${surahId}_ayah_${ayahNumber}.txt`;
        const fileHandle = await quranNotesFolder.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
        return true;
      } catch (error) {
        console.error("Error saving note to file system:", error);
        // We already saved to localStorage, so we don't need to throw
        return false;
      }
    }
    
    return true; // localStorage save was successful
  };

  const chooseFileLocation = async () => {
    if (!isFileSystemAccessSupported()) {
      return false;
    }

    try {
      const quranNotesFolder = await ensureQuranNotesFolder();
      if (!quranNotesFolder) return false;

      const filename = `surah_${surahId}_ayah_${ayahNumber}.txt`;
      await quranNotesFolder.getFileHandle(filename, { create: true });
      
      return true;
    } catch (error) {
      console.error("Error choosing file location:", error);
      
      if (error instanceof DOMException && 
         (error.name === "SecurityError" || error.message.includes("Cross origin"))) {
        // Update state if we detect a security error
        setFsApiAvailable(false);
      }
      
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
    chooseFileLocation,
    fsApiAvailable
  };
};
