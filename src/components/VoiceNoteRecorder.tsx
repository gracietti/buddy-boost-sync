import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';

interface VoiceNoteRecorderProps {
  onTranscription: (text: string) => void;
}

const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({ onTranscription }) => {
  const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceRecording();

  const handleRecordingToggle = async () => {
    if (isRecording) {
      const transcription = await stopRecording();
      if (transcription) {
        onTranscription(transcription);
      }
    } else {
      await startRecording();
    }
  };

  if (isTranscribing) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Transcribing...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleRecordingToggle}
      variant={isRecording ? "destructive" : "outline"}
      className="gap-2"
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Voice Note
        </>
      )}
    </Button>
  );
};

export default VoiceNoteRecorder;