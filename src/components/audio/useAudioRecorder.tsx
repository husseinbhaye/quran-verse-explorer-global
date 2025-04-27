
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UseAudioRecorderProps } from "./types/audio";
import { getToastMessage } from "./utils/toastMessages";
import { useAudioRecording } from "./hooks/useAudioRecording";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import { useRecordingState } from "./hooks/useRecordingState";
import { saveRecording as saveRecordingUtil } from "./utils/saveRecording";

export function useAudioRecorder({ displayLanguage }: UseAudioRecorderProps) {
  const { toast } = useToast();
  const { audioState, startRecordingState, stopRecordingState, setPlayingState } = useRecordingState();
  
  const {
    mediaRecorderRef,
    audioChunksRef,
    streamRef,
    showRecordingError,
    initializeRecording
  } = useAudioRecording(displayLanguage);

  const {
    audioRef,
    handlePlaybackError,
    handleNoRecording
  } = useAudioPlayback(displayLanguage);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setPlayingState(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const { stream, mimeType } = await initializeRecording();
      
      // Create MediaRecorder with appropriate options for better platform compatibility
      try {
        // Try with specified mime type if available
        if (mimeType) {
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: mimeType,
            audioBitsPerSecond: 128000
          });
          console.log(`MediaRecorder created with mime type: ${mimeType}`);
        } else {
          // Fallback to default options
          mediaRecorderRef.current = new MediaRecorder(stream);
          console.log("MediaRecorder created with default options");
        }
      } catch (err) {
        console.warn(`Failed to create MediaRecorder with specified options, trying default`, err);
        mediaRecorderRef.current = new MediaRecorder(stream);
        console.log("MediaRecorder created with default options after fallback");
      }

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio data chunk received:", event.data.size, "bytes, type:", event.data.type);
        } else {
          console.warn("Received empty audio data chunk");
        }
      });

      mediaRecorderRef.current.addEventListener("start", () => {
        console.log("MediaRecorder started successfully");
        audioChunksRef.current = []; // Clear previous chunks on new recording
      });

      mediaRecorderRef.current.addEventListener("error", (event) => {
        console.error("MediaRecorder error:", event);
        showRecordingError();
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        console.log("MediaRecorder stopped, total chunks:", audioChunksRef.current.length);
        
        if (audioChunksRef.current.length > 0) {
          // Determine the most appropriate mime type based on what was recorded
          const actualMimeType = mediaRecorderRef.current?.mimeType || mimeType || 'audio/mp3';
          
          const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
          console.log("Audio blob created, size:", audioBlob.size, "bytes, type:", actualMimeType);
          
          if (audioBlob.size > 0) {
            const audioUrl = URL.createObjectURL(audioBlob);
            if (audioRef.current) {
              audioRef.current.src = audioUrl;
              audioRef.current.load();
              console.log("Audio URL created and assigned to audio element:", audioUrl);
              stopRecordingState();
            }
          } else {
            console.warn("Created audio blob is empty");
            showRecordingError();
          }
        } else {
          console.warn("No audio data collected during recording");
          showRecordingError();
        }
        
        if (streamRef.current) {
          const tracks = streamRef.current.getAudioTracks();
          tracks.forEach((track) => track.stop());
          console.log("Audio tracks stopped");
        }
      });

      // Use smaller timeslices for more responsive data collection
      mediaRecorderRef.current.start(200); // More frequent data collection
      console.log("MediaRecorder started");
      startRecordingState();

      const message = getToastMessage('startRecording', displayLanguage);
      toast(message);
    } catch (error) {
      console.error("Error in startRecording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && audioState.isRecording) {
      console.log("Stopping MediaRecorder...");
      mediaRecorderRef.current.stop();
      stopRecordingState();

      const message = getToastMessage('stopRecording', displayLanguage);
      toast(message);
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioState.recordingAvailable) {
      console.log("Playing audio recording...");
      
      audioRef.current.onplay = () => {
        console.log("Audio playback started");
        setPlayingState(true);
      };
      
      audioRef.current.onended = () => {
        console.log("Audio playback ended");
        setPlayingState(false);
      };
      
      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlayingState(false);
        handlePlaybackError();
      };
      
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        setPlayingState(false);
        handlePlaybackError();
      });
    } else {
      console.warn("No audio recording available to play");
      handleNoRecording();
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingState(false);
    }
  };

  const saveRecording = async () => {
    await saveRecordingUtil(
      audioChunksRef.current,
      mediaRecorderRef.current,
      displayLanguage
    );
  };

  return {
    isRecording: audioState.isRecording,
    isPlaying: audioState.isPlaying,
    recordingAvailable: audioState.recordingAvailable,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    saveRecording,
  };
};
