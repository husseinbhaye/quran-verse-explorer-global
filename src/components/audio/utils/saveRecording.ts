
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
    // Get mime type from recorder but fallback to a widely supported format
    let mimeType = mediaRecorder?.mimeType || '';
    let fileExtension = '';
    
    // Map the mime type to appropriate extension and ensure compatibility
    if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
      fileExtension = 'mp3';
      mimeType = 'audio/mp3';
    } else if (mimeType.includes('wav')) {
      fileExtension = 'wav';
      mimeType = 'audio/wav'; 
    } else if (mimeType.includes('aac')) {
      fileExtension = 'aac';
      mimeType = 'audio/aac';
    } else if (mimeType.includes('ogg')) {
      fileExtension = 'ogg';
      mimeType = 'audio/ogg';
    } else {
      // Default to mp3 as it's widely supported for playback
      fileExtension = 'mp3';
      mimeType = 'audio/mp3';
    }
    
    console.log(`Saving audio as ${fileExtension} with mime type: ${mimeType}`);
    
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    console.log("Saving audio blob, size:", audioBlob.size, "bytes, type:", mimeType);

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
