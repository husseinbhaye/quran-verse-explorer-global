
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: string | null;
  onRetry: () => void;
}

const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-destructive">{error}</p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry}
        className="text-xs"
      >
        <RefreshCw size={12} className="mr-1" /> Try Again
      </Button>
    </div>
  );
};

export default ErrorDisplay;
