import { WorkoutCard } from "@/components/WorkoutCard";
import { EncouragementPanel } from "@/components/EncouragementPanel";
import { PartnerStatus } from "@/components/PartnerStatus";
import { StatsOverview } from "@/components/StatsOverview";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkoutLogger from "@/components/WorkoutLogger";
import WorkoutSuggestionsPanel from "@/components/WorkoutSuggestionsPanel";

import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, signOut } = useAuth();
  
  // Mock data for demonstration
  const mockWorkouts = [
    {
      type: "Morning Run",
      duration: "32 min",
      calories: 340,
      time: "8:15 AM",
      isPartner: false
    },
    {
      type: "HIIT Workout",
      duration: "25 min", 
      calories: 285,
      time: "7:30 AM",
      isPartner: true,
      partnerName: "Sarah"
    },
    {
      type: "Yoga Flow",
      duration: "45 min",
      calories: 180,
      time: "Yesterday",
      isPartner: false
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FitTogether</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.email?.split('@')[0] || 'Fitness Buddy'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6 max-w-md mx-auto">
        {/* Partner Status */}
        <PartnerStatus 
          isConnected={true}
          partnerName="Sarah"
          lastActive="2 min ago"
        />

        {/* Stats Overview */}
        <StatsOverview 
          weeklyWorkouts={4}
          weeklyGoal={5}
          streak={7}
        />

        {/* Workout Logger */}
        <WorkoutLogger />

        {/* AI Workout Suggestions */}
        <WorkoutSuggestionsPanel 
          userGoals="Build strength and improve cardio"
          recentWorkouts={mockWorkouts}
        />

        {/* Recent Workouts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          {mockWorkouts.map((workout, index) => (
            <WorkoutCard 
              key={index}
              {...workout}
            />
          ))}
        </div>

        {/* Encouragement Panel */}
        <EncouragementPanel />
      </main>
    </div>
  );
};

export default Index;
