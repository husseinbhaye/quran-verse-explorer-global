
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
    audioChunksRef.current = [];
    setRecordingAvailable(false);

    try {
      // Request microphone access with specific constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      // Store the stream for cleanup
      streamRef.current = stream;
      
      // Create a new MediaRecorder with a higher bitrate for better quality
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp3',
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("Audio data chunk received:", event.data.size, "bytes");
        }
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        console.log("MediaRecorder stopped, total chunks:", audioChunksRef.current.length);
        
        if (audioChunksRef.current.length > 0) {
          const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp3';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          console.log("Audio blob created, size:", audioBlob.size, "bytes");
          
          const audioUrl = URL.createObjectURL(audioBlob);
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            setRecordingAvailable(true);
            console.log("Audio URL created and assigned to audio element");
          }
        } else {
          console.warn("No audio data collected during recording");
          toast({
            title: displayLanguage === "english" ? "Recording issue" : "Problème d'enregistrement",
            description:
              displayLanguage === "english"
                ? "No audio data was captured. Please check your microphone."
                : "Aucune donnée audio n'a été capturée. Veuillez vérifier votre microphone.",
            variant: "destructive",
          });
        }
        
        // Stop all audio tracks after recording
        if (streamRef.current) {
          const tracks = streamRef.current.getAudioTracks();
          tracks.forEach((track) => track.stop());
        }
      });

      // Set a timeslice to capture data more frequently
      mediaRecorderRef.current.start(1000); // Collect data every second
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
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
      });
      setIsPlaying(true);
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

      // File System Access API if available
      if ("showSaveFilePicker" in window) {
        const options = {
          suggestedName: `quran_recitation_${new Date().toISOString().slice(0, 10)}.${mimeType === 'audio/webm' ? 'webm' : 'mp3'}`,
          types: [
            {
              description: mimeType === 'audio/webm' ? "WebM Audio" : "MP3 Audio",
              accept: { [mimeType]: [mimeType === 'audio/webm' ? [".webm"] : [".mp3"]] },
            },
          ],
        };
        try {
          // @ts-ignore
          const fileHandle = await window.showSaveFilePicker(options);
          const writable = await fileHandle.createWritable();
          await writable.write(audioBlob);
          await writable.close();

          toast({
            title: displayLanguage === "english" ? "Recording saved" : "Enregistrement sauvegardé",
            description:
              displayLanguage === "english"
                ? "Your recording has been saved"
                : "Votre enregistrement a été sauvegardé",
          });
        } catch (err) {
          if ((err as Error).name !== "AbortError") throw err;
        }
      } else {
        // Download fallback
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
      }
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
