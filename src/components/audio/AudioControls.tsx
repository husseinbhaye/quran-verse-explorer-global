
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  onPlayPauseClick: () => void;
}

const AudioControls = ({ isPlaying, isLoading, hasError, onPlayPauseClick }: AudioControlsProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onPlayPauseClick} 
      disabled={isLoading || hasError}
      className="text-quran-primary hover:text-quran-primary/80"
    >
      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
    </Button>
  );
};

export default AudioControls;
