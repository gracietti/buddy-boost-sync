import { Heart, Mic, Send, Zap, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const encouragementStickers = [
  { icon: Heart, label: "Love it!", color: "text-red-400" },
  { icon: Zap, label: "Energy!", color: "text-yellow-400" },
  { icon: Trophy, label: "Champion!", color: "text-amber-400" },
  { icon: Flame, label: "On fire!", color: "text-orange-400" },
];

const quickMessages = [
  "Keep going! 💪",
  "You're crushing it!",
  "So proud of you!",
  "Beast mode activated!"
];

export function EncouragementPanel() {
  return (
    <Card className="fitness-card animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">Send Encouragement</h3>
      
      {/* Voice Note Button */}
      <Button 
        className="w-full mb-4 gradient-primary hover:animate-glow-pulse transition-all duration-300"
        size="lg"
      >
        <Mic className="w-5 h-5 mr-2" />
        Hold to Record (5s max)
      </Button>
      
      {/* Stickers */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Quick Stickers</p>
        <div className="grid grid-cols-4 gap-2">
          {encouragementStickers.map((sticker, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex-col gap-1 hover:scale-105 transition-transform duration-200"
            >
              <sticker.icon className={`w-5 h-5 ${sticker.color}`} />
              <span className="text-xs">{sticker.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Quick Messages */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Quick Messages</p>
        <div className="grid grid-cols-1 gap-2">
          {quickMessages.map((message, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-between hover:bg-secondary/80 transition-colors"
            >
              <span className="text-sm">{message}</span>
              <Send className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}