import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Workout {
  id: string;
  type: string;
  duration_minutes: number;
  calories?: number;
  completed_at: string;
  user_id: string;
  notes?: string;
}

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWorkouts = async () => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching workouts:', error);
        setWorkouts([]);
      } else {
        setWorkouts(data || []);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const getWeeklyStats = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeekWorkouts = workouts.filter(workout => 
      new Date(workout.completed_at) >= weekStart
    );

    return {
      weeklyWorkouts: thisWeekWorkouts.length,
      totalCalories: thisWeekWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0)
    };
  };

  const getStreak = () => {
    if (workouts.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    for (let i = 0; i < workouts.length; i++) {
      const workoutDate = new Date(workouts[i].completed_at);
      workoutDate.setHours(23, 59, 59, 999);
      
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  return {
    workouts,
    loading,
    refetch: fetchWorkouts,
    weeklyStats: getWeeklyStats(),
    streak: getStreak()
  };
};