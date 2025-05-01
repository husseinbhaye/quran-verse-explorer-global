
import { getToastMessage } from "./toastMessages";

export interface MediaRecorderConfig {
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  showRecordingError: () => void;
  onRecordingStopped: () => void;
}

export const getMimeTypePreferences = (): string[] => {
  return [
    'audio/mp3',
    'audio/wav', 
    'audio/mpeg',
    'audio/aac',
    'audio/ogg',
    'audio/webm'
  ];
};

export const configureMediaRecorder = (config: MediaRecorderConfig): void => {
  const { mediaRecorderRef, onRecordingStopped } = config;
  
  if (!mediaRecorderRef.current) return;
  
  mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable(config));
  mediaRecorderRef.current.addEventListener("start", handleRecorderStart(config));
  mediaRecorderRef.current.addEventListener("error", handleRecorderError(config));
  mediaRecorderRef.current.addEventListener("stop", onRecordingStopped);
};

const handleDataAvailable = (config: MediaRecorderConfig) => (event: BlobEvent) => {
  const { audioChunksRef } = config;
  
  if (event.data.size > 0) {
    audioChunksRef.current.push(event.data);
    console.log("Audio data chunk received:", event.data.size, "bytes, type:", event.data.type);
  } else {
    console.warn("Received empty audio data chunk");
  }
};

const handleRecorderStart = (config: MediaRecorderConfig) => () => {
  const { audioChunksRef } = config;
  
  console.log("MediaRecorder started successfully");
  audioChunksRef.current = []; // Clear previous chunks on new recording
};

const handleRecorderError = (config: MediaRecorderConfig) => (event: Event) => {
  const { showRecordingError } = config;
  
  console.error("MediaRecorder error:", event);
  showRecordingError();
};

export const createMediaRecorder = (
  stream: MediaStream, 
  mimeType: string
): MediaRecorder => {
  try {
    // Try with specified mime type if available
    if (mimeType) {
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      });
      console.log(`MediaRecorder created with mime type: ${mimeType}`);
      return recorder;
    }
  } catch (err) {
    console.warn(`Failed to create MediaRecorder with specified options, trying default`, err);
  }
  
  // Fallback to default options
  const recorder = new MediaRecorder(stream);
  console.log("MediaRecorder created with default options");
  return recorder;
};
