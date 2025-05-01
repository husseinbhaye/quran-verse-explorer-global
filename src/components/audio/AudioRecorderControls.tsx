
import React from "react";
import { Button } from "../ui/button";
import { Mic, MicOff, Play, Square, Save } from "lucide-react";

interface AudioRecorderControlsProps {
  displayLanguage: "english" | "french";
  isRecording: boolean;
  isPlaying: boolean;
  recordingAvailable: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  playRecording: () => void;
  stopPlayback: () => void;
  saveRecording: () => void;
}

const AudioRecorderControls: React.FC<AudioRecorderControlsProps> = ({
  displayLanguage,
  isRecording,
  isPlaying,
  recordingAvailable,
  startRecording,
  stopRecording,
  playRecording,
  stopPlayback,
  saveRecording,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      {!isRecording ? (
        <Button
          onClick={startRecording}
          variant="outline"
          size="sm"
          className="bg-[#D44C37] border-[#D44C37] text-white hover:bg-[#D44C37]/90"
        >
          <Mic className="mr-1" size={16} />
          {displayLanguage === "english" ? "Record" : "Enregistrer"}
        </Button>
      ) : (
        <Button
          onClick={stopRecording}
          variant="outline"
          size="sm"
          className="bg-red-50 border-red-500 text-red-500 hover:bg-red-100"
        >
          <MicOff className="mr-1" size={16} />
          {displayLanguage === "english" ? "Stop" : "Arrêter"}
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
          {displayLanguage === "english" ? "Play" : "Lire"}
        </Button>
      )}

      {isPlaying && (
        <Button
          onClick={stopPlayback}
          variant="outline"
          size="sm"
          className="bg-white border-yellow-500 text-yellow-500 hover:bg-yellow-50"
        >
          <Square className="mr-1" size={16} />
          {displayLanguage === "english" ? "Stop" : "Arrêter"}
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
          {displayLanguage === "english" ? "Save" : "Sauvegarder"}
        </Button>
      )}
    </div>
  );
};

export default AudioRecorderControls;
