
import React from 'react';
import { cn } from '@/lib/utils';
import { ReciterId } from '@/services';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

// Import refactored components
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';
import TimeDisplay from './TimeDisplay';
import ErrorDisplay from './ErrorDisplay';

interface AudioPlayerProps {
  surahId: number;
  ayahId: number;
  reciterId?: ReciterId;
  className?: string;
}

const AudioPlayer = ({ surahId, ayahId, reciterId = 'ar.alafasy', className }: AudioPlayerProps) => {
  const {
    audioRef,
    audioUrl,
    isPlaying,
    isMuted,
    duration,
    currentTime,
    isLoading,
    error,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleSliderChange,
    toggleMute,
    handleRetry,
    handleError
  } = useAudioPlayer({ surahId, ayahId, reciterId });

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => isPlaying}
        onPause={() => !isPlaying}
        onEnded={handleEnded}
        onError={handleError}
      />
      
      <div className="flex items-center space-x-2">
        <AudioControls 
          isPlaying={isPlaying} 
          isLoading={isLoading} 
          hasError={!!error} 
          onPlayPauseClick={handlePlayPause} 
        />
        
        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          hasError={!!error} 
          onValueChange={handleSliderChange} 
        />
        
        <VolumeControl 
          isMuted={isMuted} 
          hasError={!!error} 
          onToggleMute={toggleMute} 
        />
        
        <TimeDisplay currentTime={currentTime} duration={duration} />
      </div>

      <ErrorDisplay error={error} onRetry={handleRetry} />
      
      {isLoading && !error && <p className="text-xs text-muted-foreground">Loading audio...</p>}
    </div>
  );
};

export default AudioPlayer;
