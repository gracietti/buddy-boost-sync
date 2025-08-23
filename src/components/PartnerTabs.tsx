import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerStatus } from "@/components/PartnerStatus";
import { ConnectPartnerForm } from "@/components/ConnectPartnerForm";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Workout } from "@/hooks/useWorkouts";
import { Skeleton } from "@/components/ui/skeleton";

export function PartnerTabs() {
  const { profile, partnerProfile, loading: profileLoading, isConnected, partnerName } = useProfile();
  const { user } = useAuth();
  const [partnerWorkouts, setPartnerWorkouts] = useState<Workout[]>([]);
  const [loadingPartnerWorkouts, setLoadingPartnerWorkouts] = useState(false);

  useEffect(() => {
    if (isConnected && partnerProfile?.user_id) {
      fetchPartnerWorkouts();
    }
  }, [isConnected, partnerProfile?.user_id]);

  const fetchPartnerWorkouts = async () => {
    if (!partnerProfile?.user_id) return;
    
    setLoadingPartnerWorkouts(true);
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', partnerProfile.user_id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching partner workouts:', error);
      } else {
        setPartnerWorkouts(data || []);
      }
    } catch (error) {
      console.error('Error fetching partner workouts:', error);
    } finally {
      setLoadingPartnerWorkouts(false);
    }
  };

  if (profileLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status">Partner</TabsTrigger>
        <TabsTrigger value="activity" disabled={!isConnected}>Activity</TabsTrigger>
      </TabsList>
      
      <TabsContent value="status" className="space-y-4">
        <PartnerStatus 
          isConnected={isConnected}
          partnerName={partnerName}
          lastActive="2 min ago"
        />
        
        {!isConnected && <ConnectPartnerForm />}
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-4">
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>{partnerName}'s Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPartnerWorkouts ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : partnerWorkouts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No recent workouts from {partnerName}
                </p>
              ) : (
                <div className="space-y-4">
                  {partnerWorkouts.map((workout) => {
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
                        isPartner={true}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}