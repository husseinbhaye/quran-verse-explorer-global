
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
      // Some desktop browsers need different settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true // Use simple constraint first for maximum compatibility
      }).catch(async () => {
        // If simple constraint fails, try with more specific settings
        console.log("Simple audio constraints failed, trying with specific settings");
        return navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
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
      
      // Determine supported mime types with platform-specific fallbacks
      let mimeType = 'audio/webm'; // Default - works on many desktop browsers
      
      if (MediaRecorder.isTypeSupported('audio/mp3')) {
        mimeType = 'audio/mp3';
        console.log("Using MP3 format");
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
        console.log("Using WebM format");
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
        console.log("Using OGG format");
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
        console.log("Using WAV format");
      } else {
        console.log("No specific mime type supported, using browser default");
      }
      
      return { stream, mimeType };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      const message = getToastMessage('microphoneError', displayLanguage);
      toast(message);
      throw error;
    }
  };

  return {
    mediaRecorderRef,
    audioChunksRef,
    streamRef,
    showRecordingError,
    initializeRecording
  };
};
