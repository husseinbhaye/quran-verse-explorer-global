
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseAudioRecorderProps {
  displayLanguage: "english" | "french";
}

export function useAudioRecorder({ displayLanguage }: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      // Clean up any stream if component unmounts
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Reset audio chunks
      audioChunksRef.current = [];
      setRecordingAvailable(false);
      
      // Stop any existing media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request microphone access with specific constraints for better quality
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
      
      // Store the stream for cleanup
      streamRef.current = stream;
      
      // Create a new MediaRecorder with optimal settings
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp3') 
          ? 'audio/mp3' 
          : 'audio/wav';
      
      console.log(`Using mime type: ${mimeType}`);
      
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
              audioRef.current.load(); // Explicitly load the audio
              console.log("Audio URL created and assigned to audio element:", audioUrl);
              setRecordingAvailable(true);
            }
          } else {
            console.warn("Created audio blob is empty");
            showRecordingError();
          }
        } else {
          console.warn("No audio data collected during recording");
          showRecordingError();
        }
        
        // Stop all audio tracks after recording
        if (streamRef.current) {
          const tracks = streamRef.current.getAudioTracks();
          tracks.forEach((track) => track.stop());
          console.log("Audio tracks stopped");
        }
      });

      mediaRecorderRef.current.addEventListener("error", (event) => {
        console.error("MediaRecorder error:", event);
        showRecordingError();
      });

      // Start recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      console.log("MediaRecorder started");
      setIsRecording(true);

      toast({
        title: displayLanguage === "english" ? "Recording started" : "Enregistrement démarré",
        description:
          displayLanguage === "english"
            ? "You are now recording audio"
            : "Vous enregistrez maintenant l'audio",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: displayLanguage === "english" ? "Error" : "Erreur",
        description:
          displayLanguage === "english"
            ? "Could not access microphone. Please check permissions."
            : "Impossible d'accéder au microphone. Veuillez vérifier les autorisations.",
        variant: "destructive",
      });
    }
  };
  
  const showRecordingError = () => {
    toast({
      title: displayLanguage === "english" ? "Recording issue" : "Problème d'enregistrement",
      description:
        displayLanguage === "english"
          ? "No audio data was captured. Please check your microphone."
          : "Aucune donnée audio n'a été capturée. Veuillez vérifier votre microphone.",
      variant: "destructive",
    });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping MediaRecorder...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      toast({
        title: displayLanguage === "english" ? "Recording stopped" : "Enregistrement arrêté",
        description:
          displayLanguage === "english"
            ? "Your recording is now available"
            : "Votre enregistrement est maintenant disponible",
      });
    }
  };

  const playRecording = () => {
    if (audioRef.current && recordingAvailable) {
      console.log("Playing audio recording...");
      
      // Add event listeners to better track playback state
      audioRef.current.onplay = () => {
        console.log("Audio playback started");
        setIsPlaying(true);
      };
      
      audioRef.current.onended = () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
      };
      
      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        toast({
          title: displayLanguage === "english" ? "Playback error" : "Erreur de lecture",
          description: displayLanguage === "english"
            ? "Unable to play the recording"
            : "Impossible de lire l'enregistrement",
          variant: "destructive",
        });
      };
      
      // Ensure the audio is loaded before playing
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
          toast({
            title: displayLanguage === "english" ? "Playback error" : "Erreur de lecture",
            description: displayLanguage === "english"
              ? "Unable to play the recording"
              : "Impossible de lire l'enregistrement",
            variant: "destructive",
          });
        });
      }
    } else {
      console.warn("No audio recording available to play");
      toast({
        title: displayLanguage === "english" ? "No recording" : "Pas d'enregistrement",
        description: displayLanguage === "english"
          ? "There is no recording to play"
          : "Il n'y a pas d'enregistrement à lire",
        variant: "destructive",
      });
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const saveRecording = async () => {
    if (!recordingAvailable || audioChunksRef.current.length === 0) {
      toast({
        title: displayLanguage === "english" ? "No recording available" : "Aucun enregistrement disponible",
        description:
          displayLanguage === "english"
            ? "Please record something first"
            : "Veuillez d'abord enregistrer quelque chose",
        variant: "destructive",
      });
      return;
    }

    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp3';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      console.log("Saving audio blob, size:", audioBlob.size, "bytes");

      // Use direct download approach as showSaveFilePicker may have issues in iframes
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `quran_recitation_${new Date().toISOString().slice(0, 10)}.${mimeType === 'audio/webm' ? 'webm' : 'mp3'}`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: displayLanguage === "english" ? "Recording downloaded" : "Enregistrement téléchargé",
        description:
          displayLanguage === "english"
            ? "Your recording has been downloaded"
            : "Votre enregistrement a été téléchargé",
      });
    } catch (error) {
      console.error("Error saving recording:", error);
      toast({
        title: displayLanguage === "english" ? "Error" : "Erreur",
        description:
          displayLanguage === "english"
            ? "Failed to save recording"
            : "Échec de la sauvegarde de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  return {
    isRecording,
    isPlaying,
    recordingAvailable,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    saveRecording,
  };
}
