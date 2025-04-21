
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { getToastMessage } from "../utils/toastMessages";

export const useAudioPlayback = (displayLanguage: "english" | "french") => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlaybackError = () => {
    const message = getToastMessage('playbackError', displayLanguage);
    toast(message);
  };

  const handleNoRecording = () => {
    const message = getToastMessage('noRecording', displayLanguage);
    toast(message);
  };

  return {
    audioRef,
    handlePlaybackError,
    handleNoRecording
  };
};
