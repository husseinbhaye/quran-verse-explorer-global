
import React from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { formatTime } from '@/lib/utils';

interface PlaybackProgressProps {
  currentTime: number;
  duration: number;
  hasError: boolean;
  onTimeChange: (value: number[]) => void;
}

const PlaybackProgress = ({
  currentTime,
  duration,
  hasError,
  onTimeChange,
}: PlaybackProgressProps) => {
  return (
    <div className="flex flex-1 items-center space-x-2">
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={0.1}
        onValueChange={onTimeChange}
        className="cursor-pointer flex-1"
        disabled={!duration || hasError}
      />
      <span className="text-xs w-20 text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default PlaybackProgress;

