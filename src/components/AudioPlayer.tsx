
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';
import { ReciterId, getAudioUrl, RECITERS } from '../services';

interface AudioPlayerProps {
  surahId: number;
  ayahId: number;
  reciterId?: ReciterId;
  className?: string;
}

const AudioPlayer = ({ surahId, ayahId, reciterId = 'ar.alafasy', className }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = getAudioUrl(surahId, ayahId, reciterId);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Unable to play audio');
        setIsLoading(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
    setIsLoading(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onError={() => {
          setError('Error loading audio');
          setIsLoading(false);
        }}
      />
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePlayPause} 
          disabled={isLoading || !!error}
          className="text-quran-primary hover:text-quran-primary/80"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        <div className="flex-1">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSliderChange}
            className="cursor-pointer"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-quran-primary hover:text-quran-primary/80"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        
        <span className="text-xs w-12 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
      {isLoading && <p className="text-xs text-muted-foreground">Loading audio...</p>}
    </div>
  );
};

export default AudioPlayer;
