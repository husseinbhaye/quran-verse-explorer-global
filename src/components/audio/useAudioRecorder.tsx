
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UseAudioRecorderProps } from "./types/audio";
import { getToastMessage } from "./utils/toastMessages";
import { useAudioRecording } from "./hooks/useAudioRecording";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import { useRecordingState } from "./hooks/useRecordingState";

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
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio data chunk received:", event.data.size, "bytes");
        } else {
          console.warn("Received empty audio data chunk");
        }
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        console.log("MediaRecorder stopped, total chunks:", audioChunksRef.current.length);
        
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          console.log("Audio blob created, size:", audioBlob.size, "bytes");
          
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

      mediaRecorderRef.current.start(1000);
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
    if (!audioState.recordingAvailable || audioChunksRef.current.length === 0) {
      handleNoRecording();
      return;
    }

    try {
      // Get the MIME type that was actually used during recording
      const mimeType = mediaRecorderRef.current?.mimeType || 
        (MediaRecorder.isTypeSupported('audio/mp3') ? 'audio/mp3' : 'audio/webm');
      
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      console.log("Saving audio blob, size:", audioBlob.size, "bytes, type:", mimeType);

      // Determine the correct file extension based on the MIME type
      let fileExtension = 'wav'; // Default fallback
      if (mimeType.includes('mp3')) {
        fileExtension = 'mp3';
      } else if (mimeType.includes('webm')) {
        fileExtension = 'webm';
      }

      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `quran_recitation_${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: displayLanguage === "english" ? "Recording downloaded" : "Enregistrement téléchargé",
        description: displayLanguage === "english"
          ? "Your recording has been downloaded"
          : "Votre enregistrement a été téléchargé",
      });
    } catch (error) {
      console.error("Error saving recording:", error);
      toast({
        title: displayLanguage === "english" ? "Error" : "Erreur",
        description: displayLanguage === "english"
          ? "Failed to save recording"
          : "Échec de la sauvegarde de l'enregistrement",
        variant: "destructive",
      });
    }
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
}
