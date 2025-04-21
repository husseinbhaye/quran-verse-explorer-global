
import { useState } from 'react';
import { AudioState } from '../types/audio';

export const useRecordingState = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    recordingAvailable: false,
    isPlaying: false
  });

  const startRecordingState = () => {
    setAudioState(prev => ({ ...prev, isRecording: true }));
  };

  const stopRecordingState = () => {
    setAudioState(prev => ({ 
      ...prev, 
      isRecording: false, 
      recordingAvailable: true 
    }));
  };

  const setPlayingState = (isPlaying: boolean) => {
    setAudioState(prev => ({ ...prev, isPlaying }));
  };

  return {
    audioState,
    startRecordingState,
    stopRecordingState,
    setPlayingState
  };
};
