import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WorkoutSuggestion {
  name: string;
  type: string;
  duration: number;
  exercises: string[];
  difficulty: string;
}

export const useWorkoutSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<WorkoutSuggestion[]>([]);
  const { toast } = useToast();

  const getSuggestions = async (goals?: string, recentWorkouts?: any[], timeAvailable?: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('workout-suggestions', {
        body: { goals, recentWorkouts, timeAvailable }
      });

      if (error) throw error;
      
      setSuggestions(data.suggestions);
      return data.suggestions;
    } catch (error) {
      console.error('Error getting workout suggestions:', error);
      toast({
        title: "Error",
        description: "Could not get workout suggestions",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    getSuggestions,
  };
};