
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { getToastMessage } from "../utils/toastMessages";

export const useAudioRecording = (displayLanguage: "english" | "french") => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const showRecordingError = () => {
    const message = getToastMessage('noAudio', displayLanguage);
    toast(message);
  };

  const initializeRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request audio with different constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }).catch(async () => {
        // If specific settings fail, try with simple constraints
        console.log("Specific audio constraints failed, trying with simple settings");
        return navigator.mediaDevices.getUserMedia({ audio: true });
      });
      
      console.log("Microphone access granted, stream created");
      streamRef.current = stream;
      
      // Check if we have active audio tracks
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error("No audio tracks found in the media stream");
      }
      
      console.log(`Audio tracks available: ${audioTracks.length}`);
      console.log("Audio track settings:", audioTracks[0].getSettings());
      
      // Determine supported mime types with better desktop compatibility
      // Try different formats in order of preference and compatibility
      let mimeType = '';
      const preferredTypes = getMimeTypePreferences();
      
      for (const type of preferredTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          console.log(`Using ${type} format`);
          break;
        }
      }
      
      if (!mimeType) {
        console.log("No preferred mime types supported, using browser default");
      }
      
      return { stream, mimeType };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      const message = getToastMessage('microphoneError', displayLanguage);
      toast(message);
      throw error;
    }
  };

  const getMimeTypePreferences = () => {
    return [
      'audio/mp3',
      'audio/wav', 
      'audio/mpeg',
      'audio/aac',
      'audio/ogg',
      'audio/webm'
    ];
  };

  return {
    mediaRecorderRef,
    audioChunksRef,
    streamRef,
    showRecordingError,
    initializeRecording
  };
};
