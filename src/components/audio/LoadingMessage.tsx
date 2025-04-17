
import React from 'react';

interface LoadingMessageProps {
  isLoading: boolean;
  error: string | null;
  isAudioUnloaded?: boolean;
}

const LoadingMessage = ({ isLoading, error, isAudioUnloaded = false }: LoadingMessageProps) => {
  if (error && !isAudioUnloaded) return null; // Don't show loading when there's an error
  if (!isLoading || isAudioUnloaded) return null; // Don't show loading when audio is intentionally unloaded
  
  return <p className="text-xs text-muted-foreground">Loading audio...</p>;
};

export default LoadingMessage;
