
import React from 'react';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

const TimeDisplay = ({ currentTime, duration }: TimeDisplayProps) => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <span className="text-xs w-12 text-right">
      {formatTime(currentTime)} / {formatTime(duration)}
    </span>
  );
};

export default TimeDisplay;
