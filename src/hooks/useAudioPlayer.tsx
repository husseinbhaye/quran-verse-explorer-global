
import { useState, useRef, useEffect } from 'react';
import { ReciterId, getAudioUrl, getAlternativeAudioUrl } from '@/services';
import { toast } from '@/components/ui/use-toast';

interface UseAudioPlayerProps {
  surahId: number;
  ayahId: number;
  reciterId?: ReciterId;
}

export function useAudioPlayer({ surahId, ayahId, reciterId = 'ar.alafasy' }: UseAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingAlternativeUrl, setUsingAlternativeUrl] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = usingAlternativeUrl 
    ? getAlternativeAudioUrl(surahId, ayahId, reciterId) 
    : getAudioUrl(surahId, ayahId, reciterId);

  // Reset player state when surahId or ayahId changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setUsingAlternativeUrl(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [surahId, ayahId, reciterId]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setIsLoading(true);
      setError(null);
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        if (!usingAlternativeUrl) {
          // Try alternative URL format
          setUsingAlternativeUrl(true);
          toast({
            title: 'Trying alternative audio source',
            description: 'The primary source failed, attempting to use backup source.',
            duration: 3000
          });
        } else {
          setError('Unable to play audio');
          toast({
            title: 'Audio unavailable',
            description: 'Unable to play recitation for this ayah.',
            variant: "destructive",
            duration: 3000
          });
        }
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

  // Reset and try again with the opposite URL format
  const handleRetry = () => {
    setUsingAlternativeUrl(!usingAlternativeUrl);
    setError(null);
    setIsLoading(true);
    
    // Small delay to ensure the audio element has time to update its source
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(err => {
          console.error('Retry failed:', err);
          setError('Audio still unavailable');
          setIsLoading(false);
        });
      }
    }, 300);
  };

  // Effect to update audio source when URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsLoading(true);
    }
  }, [audioUrl]);

  // Try alternative URL if the first one fails
  const handleError = () => {
    if (!usingAlternativeUrl) {
      console.log('Primary audio URL failed, trying alternative format');
      setUsingAlternativeUrl(true);
    } else {
      setError('Error loading audio');
      setIsLoading(false);
    }
  };

  return {
    audioRef,
    audioUrl,
    isPlaying,
    isMuted,
    duration,
    currentTime,
    isLoading,
    error,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleSliderChange,
    toggleMute,
    handleRetry,
    handleError
  };
}
