
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

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 2,
        }
      });
      
      console.log("Microphone access granted, stream created");
      streamRef.current = stream;
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp3') 
          ? 'audio/mp3' 
          : 'audio/wav';
      
      console.log(`Using mime type: ${mimeType}`);
      
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
