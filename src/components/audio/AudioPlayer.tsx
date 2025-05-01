
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
import AudioRecorder from './AudioRecorder';

interface AudioPlayerProps {
  surahId: number;
  ayahId: number;
  reciterId?: ReciterId;
  className?: string;
  displayLanguage: "english" | "french";
  showRecordButton?: boolean;
}

const AudioPlayer = ({ 
  surahId, 
  ayahId, 
  reciterId = 'ar.alafasy', 
  className,
  displayLanguage,
  showRecordButton = false
}: AudioPlayerProps) => {
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
      <div className={cn("w-full", className)}>
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
          
          {showRecordButton && (
            <div className="ml-1 border-l border-gray-200 dark:border-gray-700 pl-1">
              <AudioRecorder displayLanguage={displayLanguage} />
            </div>
          )}
        </div>

        <ErrorDisplay error={isAudioUnloaded ? null : error} onRetry={handleRetry} />
        <LoadingMessage isLoading={isLoading} error={error} isAudioUnloaded={isAudioUnloaded} />
      </div>
    </AudioErrorBoundary>
  );
};

export default AudioPlayer;
