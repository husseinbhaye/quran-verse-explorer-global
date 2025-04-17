
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
        let handle = fileHandle;
        
        // If we don't have a file handle yet, ask user to create/select a file
        if (!handle) {
          try {
            const filename = `surah_${surahId}_ayah_${ayahNumber}.txt`;
            handle = await window.showSaveFilePicker({
              suggestedName: filename,
              types: [{
                description: 'Text Files',
                accept: {'text/plain': ['.txt']},
              }],
            });
            setFileHandle(handle);
          } catch (err) {
            // User likely cancelled file picker
            console.log('File picker was cancelled or failed', err);
            return;
          }
        }

        // Write to the file
        const writable = await handle.createWritable();
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
      const filename = `surah_${surahId}_ayah_${ayahNumber}.txt`;
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Text Files',
          accept: {'text/plain': ['.txt']},
        }],
      });
      
      setFileHandle(handle);
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
