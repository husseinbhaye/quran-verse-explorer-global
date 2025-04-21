
export interface UseAudioRecorderProps {
  displayLanguage: "english" | "french";
}

export interface AudioState {
  isRecording: boolean;
  recordingAvailable: boolean;
  isPlaying: boolean;
}

export type AudioToastMessage = {
  title: string;
  description: string;
  variant?: "default" | "destructive";
};
