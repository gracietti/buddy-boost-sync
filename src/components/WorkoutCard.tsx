import { Activity, Clock, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WorkoutCardProps {
  type: string;
  duration: string;
  calories: number;
  time: string;
  isPartner?: boolean;
  partnerName?: string;
}

export function WorkoutCard({ type, duration, calories, time, isPartner, partnerName }: WorkoutCardProps) {
  return (
    <Card className={`fitness-card-elevated ${isPartner ? 'border-primary/20' : ''} animate-slide-up`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isPartner ? 'gradient-primary' : 'bg-success'}`}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{type}</h3>
            {isPartner && (
              <p className="text-sm text-muted-foreground">{partnerName}</p>
            )}
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>
      
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-warning" />
          <span className="text-sm text-muted-foreground">{calories} cal</span>
        </div>
      </div>
    </Card>
  );
}