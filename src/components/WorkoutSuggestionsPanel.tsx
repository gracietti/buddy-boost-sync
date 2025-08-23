import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Clock, Zap } from 'lucide-react';
import { useWorkoutSuggestions } from '@/hooks/useWorkoutSuggestions';
import { Skeleton } from '@/components/ui/skeleton';

interface WorkoutSuggestionsPanelProps {
  userGoals?: string;
  recentWorkouts?: any[];
}

const WorkoutSuggestionsPanel: React.FC<WorkoutSuggestionsPanelProps> = ({ 
  userGoals, 
  recentWorkouts 
}) => {
  const { suggestions, isLoading, getSuggestions } = useWorkoutSuggestions();

  useEffect(() => {
    getSuggestions(userGoals, recentWorkouts, 30);
  }, [userGoals, recentWorkouts]);

  const refreshSuggestions = () => {
    getSuggestions(userGoals, recentWorkouts, 30);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Workout Suggestions
        </CardTitle>
        <Button
          onClick={refreshSuggestions}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{suggestion.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{suggestion.type}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {suggestion.duration}min
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{suggestion.difficulty}</span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Exercises:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.exercises.map((exercise, exerciseIndex) => (
                      <Badge key={exerciseIndex} variant="outline" className="text-xs">
                        {exercise}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No suggestions available. Try logging some workouts first!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutSuggestionsPanel;