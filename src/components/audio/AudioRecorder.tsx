
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Mic, MicOff } from "lucide-react";
import AudioRecorderControls from "./AudioRecorderControls";
import { useAudioRecorder } from "./useAudioRecorder";

interface AudioRecorderProps {
  displayLanguage: "english" | "french";
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ displayLanguage }) => {
  const {
    isRecording,
    isPlaying,
    recordingAvailable,
    startRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    saveRecording,
  } = useAudioRecorder({ displayLanguage });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`text-white hover:text-quran-secondary hover:bg-transparent ${isRecording ? "text-red-400" : ""}`}
        >
          {isRecording ? <MicOff size={16} className="mr-1" /> : <Mic size={16} className="mr-1" />}
          <span>{displayLanguage === "english" ? "Record" : "Enregistrer"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h4 className="font-medium mb-2 text-center text-quran-primary">
          {displayLanguage === "english" ? "Record Your Recitation" : "Enregistrez Votre Récitation"}
        </h4>
        <AudioRecorderControls
          displayLanguage={displayLanguage}
          isRecording={isRecording}
          isPlaying={isPlaying}
          recordingAvailable={recordingAvailable}
          startRecording={startRecording}
          stopRecording={stopRecording}
          playRecording={playRecording}
          stopPlayback={stopPlayback}
          saveRecording={saveRecording}
        />
        <p className="text-xs text-gray-500 mt-3 text-center">
          {displayLanguage === "english"
            ? "Record your own recitation and save it to your device."
            : "Enregistrez votre propre récitation et sauvegardez-la sur votre appareil."}
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default AudioRecorder;
