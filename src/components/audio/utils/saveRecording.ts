
import { toast } from "@/hooks/use-toast";
import { getToastMessage } from "./toastMessages";

export const saveRecording = async (
  audioChunks: Blob[],
  mediaRecorder: MediaRecorder | null,
  displayLanguage: "english" | "french"
) => {
  if (!audioChunks.length) {
    const message = getToastMessage('noRecording', displayLanguage);
    toast(message);
    return;
  }

  try {
    const mimeType = mediaRecorder?.mimeType || 
      (MediaRecorder.isTypeSupported('audio/mp3') ? 'audio/mp3' : 'audio/webm');
    
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    console.log("Saving audio blob, size:", audioBlob.size, "bytes, type:", mimeType);

    let fileExtension = 'wav';
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
