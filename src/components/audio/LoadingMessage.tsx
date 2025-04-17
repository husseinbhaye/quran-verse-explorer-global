
import React from 'react';

interface LoadingMessageProps {
  isLoading: boolean;
  error: string | null;
}

const LoadingMessage = ({ isLoading, error }: LoadingMessageProps) => {
  if (!isLoading || error) return null;
  
  return <p className="text-xs text-muted-foreground">Loading audio...</p>;
};

export default LoadingMessage;
