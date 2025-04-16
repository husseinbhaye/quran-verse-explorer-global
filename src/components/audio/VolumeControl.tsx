
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VolumeControlProps {
  isMuted: boolean;
  hasError: boolean;
  onToggleMute: () => void;
}

const VolumeControl = ({ isMuted, hasError, onToggleMute }: VolumeControlProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleMute}
      className="text-quran-primary hover:text-quran-primary/80"
      disabled={hasError}
    >
      {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </Button>
  );
};

export default VolumeControl;
