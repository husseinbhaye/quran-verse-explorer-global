
import React from 'react';
import { cn } from '@/lib/utils';
import { ReciterId } from '@/services';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Repeat } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
        
        <div className="flex items-center gap-2">
          <Select
            value={repeatCount.toString()}
            onValueChange={(value) => handleRepeatChange(Number(value))}
          >
            <SelectTrigger className="w-[100px] h-8">
              <Repeat className="h-4 w-4 mr-1" />
              <SelectValue placeholder="Repeat" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 10].map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentRepeat > 0 && (
            <span className="text-xs text-muted-foreground">
              {currentRepeat}/{repeatCount}
            </span>
          )}
        </div>

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
