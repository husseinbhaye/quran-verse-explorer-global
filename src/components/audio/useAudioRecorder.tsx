
import { UseAudioRecorderProps } from "./types/audio";
import { useRecorderControls } from "./hooks/useRecorderControls";

export function useAudioRecorder({ displayLanguage }: UseAudioRecorderProps) {
  const controls = useRecorderControls({ displayLanguage });
  
  return {
    isRecording: controls.isRecording,
    isPlaying: controls.isPlaying,
    recordingAvailable: controls.recordingAvailable,
    startRecording: controls.startRecording,
    stopRecording: controls.stopRecording,
    playRecording: controls.playRecording,
    stopPlayback: controls.stopPlayback,
    saveRecording: controls.saveRecording,
  };
}
