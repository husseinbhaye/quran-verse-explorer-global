
import React from 'react';
import { cn } from '@/lib/utils';
import { ReciterId } from '@/services';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

// Import refactored components
import AudioElement from './AudioElement';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import ProgressBar from './ProgressBar';
import TimeDisplay from './TimeDisplay';
import ErrorDisplay from './ErrorDisplay';
import RepeatControl from './RepeatControl';

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
    repeatCount,
    currentRepeat,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleSliderChange,
    toggleMute,
    handleRetry,
    handleError,
    handleRepeatChange
  } = useAudioPlayer({ surahId, ayahId, reciterId });

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <AudioElement 
        audioRef={audioRef}
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
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
        
        <RepeatControl
          repeatCount={repeatCount}
          currentRepeat={currentRepeat}
          onRepeatChange={handleRepeatChange}
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
