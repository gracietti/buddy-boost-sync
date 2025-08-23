import { useState } from "react";
import { Heart, MessageCircle, Mic, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import VoiceNoteRecorder from "@/components/VoiceNoteRecorder";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const stickers = [
  { emoji: "🔥", label: "Fire" },
  { emoji: "💪", label: "Strong" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🎯", label: "Target" },
  { emoji: "🏆", label: "Trophy" },
  { emoji: "👏", label: "Clap" },
  { emoji: "💯", label: "Perfect" },
  { emoji: "⚡", label: "Lightning" }
];

const quickMessages = [
  "You've got this! 💪",
  "Keep pushing! 🔥",
  "Amazing progress! ⭐",
  "Don't give up! 🎯",
  "You're crushing it! 🏆",
  "So proud of you! 👏",
  "Perfect form! 💯",
  "Beast mode! ⚡"
];

export function EncouragementPanel() {
  const [message, setMessage] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const [showQuickMessages, setShowQuickMessages] = useState(false);
  const { partnerProfile } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessage = async (content: string, type: 'text' | 'sticker' = 'text') => {
    if (!partnerProfile?.user_id || !user) {
      toast({
        title: "No Partner Connected",
        description: "Connect with a partner to send encouragements.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: partnerProfile.user_id,
          content,
          type,
          metadata: type === 'sticker' ? { isSticker: true } : {}
        });

      if (error) throw error;

      toast({
        title: "Encouragement Sent!",
        description: "Your message has been sent to your partner.",
      });

      if (type === 'text') {
        setMessage("");
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to Send",
        description: "Could not send your encouragement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceMessage = async (audioUrl: string) => {
    if (!partnerProfile?.user_id || !user) {
      toast({
        title: "No Partner Connected",
        description: "Connect with a partner to send voice messages.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a message entry first
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: partnerProfile.user_id,
          content: "Voice message",
          type: 'voice'
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Then create the voice recording entry
      const { error: voiceError } = await supabase
        .from('voice_recordings')
        .insert({
          message_id: messageData.id,
          audio_url: audioUrl,
          duration_seconds: 5 // Approximate duration
        });

      if (voiceError) throw voiceError;

      toast({
        title: "Voice Message Sent!",
        description: "Your voice encouragement has been sent to your partner.",
      });
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Failed to Send",
        description: "Could not send your voice message. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!partnerProfile) {
    return (
      <Card className="fitness-card text-center animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          <Heart className="w-8 h-8 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Send Encouragement</h3>
            <p className="text-sm text-muted-foreground">
              Connect with a partner to send motivational messages
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fitness-card animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Encourage {partnerProfile.display_name || 'Partner'}</h3>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Type an encouraging message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && message.trim() && sendMessage(message)}
          />
          <Button 
            onClick={() => message.trim() && sendMessage(message)}
            disabled={!message.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowStickers(!showStickers);
              setShowQuickMessages(false);
            }}
          >
            <Smile className="w-4 h-4 mr-1" />
            Stickers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowQuickMessages(!showQuickMessages);
              setShowStickers(false);
            }}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Quick
          </Button>
          <VoiceNoteRecorder
            onTranscription={(text) => {
              // Create a voice message with the transcribed text
              handleVoiceMessage(`data:text/plain;base64,${btoa(text)}`);
            }}
          />
        </div>

        {/* Stickers Grid */}
        {showStickers && (
          <div className="grid grid-cols-4 gap-2 p-2 bg-muted/50 rounded-lg">
            {stickers.map((sticker, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-12 text-2xl hover:bg-background"
                onClick={() => {
                  sendMessage(sticker.emoji, 'sticker');
                  setShowStickers(false);
                }}
              >
                {sticker.emoji}
              </Button>
            ))}
          </div>
        )}

        {/* Quick Messages */}
        {showQuickMessages && (
          <div className="space-y-1 p-2 bg-muted/50 rounded-lg max-h-40 overflow-y-auto">
            {quickMessages.map((msg, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto py-2 px-3 text-sm"
                onClick={() => {
                  sendMessage(msg);
                  setShowQuickMessages(false);
                }}
              >
                {msg}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}