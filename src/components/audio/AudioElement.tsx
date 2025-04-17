
import React from 'react';

interface AudioElementProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  audioUrl: string;
  isPlaying: boolean;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onEnded: () => void;
  onError: () => void;
}

const AudioElement = ({
  audioRef,
  audioUrl,
  isPlaying,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onError
}: AudioElementProps) => {
  return (
    <audio
      ref={audioRef}
      src={audioUrl}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onPlay={() => isPlaying}
      onPause={() => !isPlaying}
      onEnded={onEnded}
      onError={onError}
    />
  );
};

export default AudioElement;
