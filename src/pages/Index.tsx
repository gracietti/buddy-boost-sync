import { WorkoutCard } from "@/components/WorkoutCard";
import { EncouragementPanel } from "@/components/EncouragementPanel";
import { PartnerTabs } from "@/components/PartnerTabs";
import { StatsOverview } from "@/components/StatsOverview";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        {/* Activity and Partner Tabs */}
        <PartnerTabs 
          weeklyStats={weeklyStats}
          streak={streak}
          userWorkouts={workouts}
          workoutsLoading={workoutsLoading}
        />

      </main>
    </div>
  );
};

export default Index;
