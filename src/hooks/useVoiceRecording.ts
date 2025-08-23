import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);

        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            try {
              const { data, error } = await supabase.functions.invoke('transcribe-voice', {
                body: { audio: base64Audio }
              });

              if (error) throw error;
              
              setIsTranscribing(false);
              resolve(data.text);
            } catch (error) {
              console.error('Transcription error:', error);
              
              // Check if it's a quota error
              const errorMessage = error.message || '';
              const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('insufficient_quota');
              
              toast({
                title: "Transcription Error",
                description: isQuotaError 
                  ? "Voice transcription service is temporarily unavailable. Please try typing your note instead."
                  : "Could not transcribe audio. Please try again or type your note instead.",
                variant: "destructive",
              });
              setIsTranscribing(false);
              resolve(null);
            }
          };
          reader.readAsDataURL(audioBlob);
        } catch (error) {
          console.error('Error processing recording:', error);
          setIsTranscribing(false);
          resolve(null);
        }
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    });
  }, [isRecording, toast]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
};