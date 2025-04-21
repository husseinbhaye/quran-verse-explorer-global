
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
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingAvailable(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          setRecordingAvailable(true);
        }
        // Stop all audio tracks
        const tracks = stream.getAudioTracks();
        tracks.forEach((track) => track.stop());
      });

      mediaRecorderRef.current.start();
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
      audioRef.current.play();
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
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });

      // File System Access API if available
      if ("showSaveFilePicker" in window) {
        const options = {
          suggestedName: `quran_recitation_${new Date().toISOString().slice(0, 10)}.mp3`,
          types: [
            {
              description: "MP3 Audio",
              accept: { "audio/mp3": [".mp3"] },
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
        a.download = `quran_recitation_${new Date().toISOString().slice(0, 10)}.mp3`;
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
