import { TrendingUp, Target, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsOverviewProps {
  weeklyWorkouts: number;
  weeklyGoal: number;
  streak: number;
}

export function StatsOverview({ weeklyWorkouts, weeklyGoal, streak }: StatsOverviewProps) {
  const progress = (weeklyWorkouts / weeklyGoal) * 100;
  
  return (
    <div className="grid grid-cols-2 gap-4 animate-fade-in">
      <Card className="fitness-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full gradient-success">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Weekly Goal</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{weeklyWorkouts}</span>
            <span className="text-sm text-muted-foreground">/ {weeklyGoal}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="gradient-success h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </Card>

      <Card className="fitness-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full gradient-energy">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Streak</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{streak}</span>
          <span className="text-sm text-muted-foreground">days</span>
        </div>
      </Card>
    </div>
  );
}