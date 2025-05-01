
import React from 'react';
import { cn } from '@/lib/utils';
import { ReciterId } from '@/services';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import AudioErrorBoundary from './AudioErrorBoundary';
import AudioElement from './AudioElement';
import AudioControls from './AudioControls';
import PlaybackProgress from './PlaybackProgress';
import RepeatControl from './RepeatControl';
import VolumeControl from './VolumeControl';
import ErrorDisplay from './ErrorDisplay';
import LoadingMessage from './LoadingMessage';

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
    isAudioUnloaded,
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
    <AudioErrorBoundary>
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
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
            isLoading={isLoading && !isAudioUnloaded} 
            hasError={!!error && !isAudioUnloaded} 
            onPlayPauseClick={handlePlayPause} 
          />
          
          <PlaybackProgress
            currentTime={currentTime}
            duration={duration}
            hasError={!!error && !isAudioUnloaded}
            onTimeChange={handleSliderChange}
          />
          
          <RepeatControl
            repeatCount={repeatCount}
            currentRepeat={currentRepeat}
            onRepeatChange={handleRepeatChange}
          />

          <VolumeControl 
            isMuted={isMuted} 
            hasError={!!error && !isAudioUnloaded} 
            onToggleMute={toggleMute} 
          />
        </div>

        <ErrorDisplay error={isAudioUnloaded ? null : error} onRetry={handleRetry} />
        <LoadingMessage isLoading={isLoading} error={error} isAudioUnloaded={isAudioUnloaded} />
      </div>
    </AudioErrorBoundary>
  );
};

export default AudioPlayer;
