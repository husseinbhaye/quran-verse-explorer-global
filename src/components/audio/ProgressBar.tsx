
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  hasError: boolean;
  onValueChange: (value: number[]) => void;
}

const ProgressBar = ({ currentTime, duration, hasError, onValueChange }: ProgressBarProps) => {
  return (
    <div className="flex-1">
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 100}
        step={0.1}
        onValueChange={onValueChange}
        className="cursor-pointer"
        disabled={!duration || hasError}
      />
    </div>
  );
};

export default ProgressBar;
