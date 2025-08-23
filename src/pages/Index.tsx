import { WorkoutCard } from "@/components/WorkoutCard";
import { EncouragementPanel } from "@/components/EncouragementPanel";
import { PartnerStatus } from "@/components/PartnerStatus";
import { StatsOverview } from "@/components/StatsOverview";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkoutLogger from "@/components/WorkoutLogger";
import WorkoutSuggestionsPanel from "@/components/WorkoutSuggestionsPanel";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const { user, signOut } = useAuth();
  const { workouts, loading: workoutsLoading, weeklyStats, streak } = useWorkouts();
  const { profile, partnerProfile, loading: profileLoading, isConnected, partnerName } = useProfile();

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
        {profileLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <PartnerStatus 
            isConnected={isConnected}
            partnerName={partnerName}
            lastActive="2 min ago"
          />
        )}

        {/* Stats Overview */}
        {workoutsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <StatsOverview 
            weeklyWorkouts={weeklyStats.weeklyWorkouts}
            weeklyGoal={5}
            streak={streak}
          />
        )}

        {/* Workout Logger */}
        <WorkoutLogger />

        {/* AI Workout Suggestions */}
        <WorkoutSuggestionsPanel 
          userGoals="Build strength and improve cardio"
          recentWorkouts={workouts.map(w => ({
            type: w.type,
            duration: `${w.duration_minutes} min`,
            calories: w.calories || 0,
            time: new Date(w.completed_at).toLocaleDateString(),
            isPartner: false
          }))}
        />

        {/* Recent Workouts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          {workoutsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No workouts logged yet. Start by logging your first workout above!
            </p>
          ) : (
            workouts.map((workout) => {
              const completedDate = new Date(workout.completed_at);
              const timeDisplay = completedDate.toLocaleDateString() === new Date().toLocaleDateString() 
                ? completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : completedDate.toLocaleDateString();
              
              return (
                <WorkoutCard 
                  key={workout.id}
                  type={workout.type}
                  duration={`${workout.duration_minutes} min`}
                  calories={workout.calories || 0}
                  time={timeDisplay}
                  isPartner={false}
                />
              );
            })
          )}
        </div>

        {/* Encouragement Panel */}
        <EncouragementPanel />
      </main>
    </div>
  );
};

export default Index;
