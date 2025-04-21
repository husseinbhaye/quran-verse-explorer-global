
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff, Play, StopCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AudioRecorderProps {
  displayLanguage: 'english' | 'french';
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ displayLanguage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingAvailable, setRecordingAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Create audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setIsPlaying(false);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const startRecording = async () => {
    // Reset any previous recording
    audioChunksRef.current = [];
    setRecordingAvailable(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          setRecordingAvailable(true);
        }
        
        // Stop all audio tracks
        const tracks = stream.getAudioTracks();
        tracks.forEach(track => track.stop());
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: displayLanguage === 'english' ? 'Recording started' : 'Enregistrement démarré',
        description: displayLanguage === 'english' ? 'You are now recording audio' : 'Vous enregistrez maintenant l\'audio',
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english' 
          ? 'Could not access microphone. Please check permissions.' 
          : 'Impossible d\'accéder au microphone. Veuillez vérifier les autorisations.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: displayLanguage === 'english' ? 'Recording stopped' : 'Enregistrement arrêté',
        description: displayLanguage === 'english' ? 'Your recording is now available' : 'Votre enregistrement est maintenant disponible',
      });
    }
  };

  const playRecording = () => {
    if (audioRef.current && recordingAvailable) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const saveRecording = async () => {
    if (!recordingAvailable || audioChunksRef.current.length === 0) {
      toast({
        title: displayLanguage === 'english' ? 'No recording available' : 'Aucun enregistrement disponible',
        description: displayLanguage === 'english' ? 'Please record something first' : 'Veuillez d\'abord enregistrer quelque chose',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
      
      // Check if the File System Access API is available
      if ('showSaveFilePicker' in window) {
        const options = {
          suggestedName: `quran_recitation_${new Date().toISOString().slice(0, 10)}.mp3`,
          types: [{
            description: 'MP3 Audio',
            accept: { 'audio/mp3': ['.mp3'] },
          }],
        };
        
        try {
          // @ts-ignore - TypeScript doesn't recognize the File System Access API yet
          const fileHandle = await window.showSaveFilePicker(options);
          const writable = await fileHandle.createWritable();
          await writable.write(audioBlob);
          await writable.close();
          
          toast({
            title: displayLanguage === 'english' ? 'Recording saved' : 'Enregistrement sauvegardé',
            description: displayLanguage === 'english' ? 'Your recording has been saved' : 'Votre enregistrement a été sauvegardé',
          });
        } catch (err) {
          // User canceled the save dialog
          if ((err as Error).name !== 'AbortError') {
            throw err;
          }
        }
      } else {
        // Fallback for browsers that don't support File System Access API
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `quran_recitation_${new Date().toISOString().slice(0, 10)}.mp3`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        toast({
          title: displayLanguage === 'english' ? 'Recording downloaded' : 'Enregistrement téléchargé',
          description: displayLanguage === 'english' ? 'Your recording has been downloaded' : 'Votre enregistrement a été téléchargé',
        });
      }
    } catch (error) {
      console.error('Error saving recording:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english' 
          ? 'Failed to save recording' 
          : 'Échec de la sauvegarde de l\'enregistrement',
        variant: 'destructive',
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={`text-white hover:text-quran-secondary hover:bg-transparent ${isRecording ? 'text-red-400' : ''}`}
        >
          {isRecording ? <MicOff size={16} className="mr-1" /> : <Mic size={16} className="mr-1" />}
          <span>
            {displayLanguage === 'english' ? 'Record' : 'Enregistrer'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h4 className="font-medium mb-2 text-center text-quran-primary">
          {displayLanguage === 'english' ? 'Record Your Recitation' : 'Enregistrez Votre Récitation'}
        </h4>
        
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {!isRecording ? (
            <Button 
              onClick={startRecording} 
              variant="outline" 
              size="sm"
              className="bg-white border-quran-primary text-quran-primary hover:bg-quran-primary/10"
            >
              <Mic className="mr-1" size={16} />
              {displayLanguage === 'english' ? 'Record' : 'Enregistrer'}
            </Button>
          ) : (
            <Button 
              onClick={stopRecording} 
              variant="outline" 
              size="sm"
              className="bg-red-50 border-red-500 text-red-500 hover:bg-red-100"
            >
              <MicOff className="mr-1" size={16} />
              {displayLanguage === 'english' ? 'Stop' : 'Arrêter'}
            </Button>
          )}
          
          {recordingAvailable && !isPlaying && (
            <Button 
              onClick={playRecording} 
              variant="outline" 
              size="sm"
              className="bg-white border-green-600 text-green-600 hover:bg-green-50"
            >
              <Play className="mr-1" size={16} />
              {displayLanguage === 'english' ? 'Play' : 'Lire'}
            </Button>
          )}
          
          {isPlaying && (
            <Button 
              onClick={stopPlayback} 
              variant="outline" 
              size="sm"
              className="bg-white border-yellow-500 text-yellow-500 hover:bg-yellow-50"
            >
              <StopCircle className="mr-1" size={16} />
              {displayLanguage === 'english' ? 'Stop' : 'Arrêter'}
            </Button>
          )}
          
          {recordingAvailable && (
            <Button 
              onClick={saveRecording} 
              variant="outline" 
              size="sm"
              className="bg-white border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Save className="mr-1" size={16} />
              {displayLanguage === 'english' ? 'Save' : 'Sauvegarder'}
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          {displayLanguage === 'english' 
            ? 'Record your own recitation and save it to your device.' 
            : 'Enregistrez votre propre récitation et sauvegardez-la sur votre appareil.'}
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default AudioRecorder;
