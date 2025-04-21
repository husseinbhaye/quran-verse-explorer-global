
import { AudioToastMessage } from "../types/audio";

export const getToastMessage = (
  type: 'startRecording' | 'stopRecording' | 'noAudio' | 'microphoneError' | 'playbackError' | 'noRecording',
  displayLanguage: "english" | "french"
): AudioToastMessage => {
  const messages: Record<typeof type, AudioToastMessage> = {
    startRecording: {
      title: displayLanguage === "english" ? "Recording started" : "Enregistrement démarré",
      description: displayLanguage === "english"
        ? "You are now recording audio"
        : "Vous enregistrez maintenant l'audio"
    },
    stopRecording: {
      title: displayLanguage === "english" ? "Recording stopped" : "Enregistrement arrêté",
      description: displayLanguage === "english"
        ? "Your recording is now available"
        : "Votre enregistrement est maintenant disponible"
    },
    noAudio: {
      title: displayLanguage === "english" ? "Recording issue" : "Problème d'enregistrement",
      description: displayLanguage === "english"
        ? "No audio data was captured. Please check your microphone."
        : "Aucune donnée audio n'a été capturée. Veuillez vérifier votre microphone.",
      variant: "destructive"
    },
    microphoneError: {
      title: displayLanguage === "english" ? "Error" : "Erreur",
      description: displayLanguage === "english"
        ? "Could not access microphone. Please check permissions."
        : "Impossible d'accéder au microphone. Veuillez vérifier les autorisations.",
      variant: "destructive"
    },
    playbackError: {
      title: displayLanguage === "english" ? "Playback error" : "Erreur de lecture",
      description: displayLanguage === "english"
        ? "Unable to play the recording"
        : "Impossible de lire l'enregistrement",
      variant: "destructive"
    },
    noRecording: {
      title: displayLanguage === "english" ? "No recording" : "Pas d'enregistrement",
      description: displayLanguage === "english"
        ? "There is no recording to play"
        : "Il n'y a pas d'enregistrement à lire",
      variant: "destructive"
    }
  };

  return messages[type];
};
