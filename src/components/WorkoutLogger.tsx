import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import VoiceNoteRecorder from './VoiceNoteRecorder';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

const WorkoutLogger: React.FC = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: '',
    sets: 1,
    reps: 1,
    weight: undefined
  });
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();

  const addExercise = () => {
    if (currentExercise.name.trim()) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({ name: '', sets: 1, reps: 1, weight: undefined });
    }
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleVoiceNote = (transcription: string) => {
    setNotes(prev => prev ? `${prev}\n\n${transcription}` : transcription);
  };

  const logWorkout = async () => {
    if (!workoutType) {
      toast({
        title: "Missing Information",
        description: "Please select a workout type",
        variant: "destructive",
      });
      return;
    }

    setIsLogging(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to log workouts",
          variant: "destructive",
        });
        return;
      }

      const workoutData = {
        user_id: user.id,
        type: workoutType,
        duration_minutes: duration ? parseInt(duration) : 30,
        notes: notes || null,
      };

      const { error } = await supabase
        .from('workouts')
        .insert(workoutData);

      if (error) throw error;

      toast({
        title: "Workout Logged!",
        description: "Your workout has been recorded successfully",
      });

      // Reset form
      setWorkoutName('');
      setWorkoutType('');
      setDuration('');
      setNotes('');
      setExercises([]);
      
      // Trigger a page reload to refresh the workouts list
      window.location.reload();
    } catch (error) {
      console.error('Error logging workout:', error);
      toast({
        title: "Error",
        description: "Could not log workout",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Log Workout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Morning Run"
            />
          </div>
          <div>
            <Label htmlFor="workout-type">Type</Label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Flexibility">Flexibility</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
          />
        </div>

        <div>
          <Label>Exercises</Label>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <Label htmlFor="exercise-name" className="text-xs text-muted-foreground">Name</Label>
                <Input
                  id="exercise-name"
                  placeholder="Exercise name"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="exercise-sets" className="text-xs text-muted-foreground">Sets</Label>
                <Input
                  id="exercise-sets"
                  type="number"
                  placeholder="Sets"
                  value={currentExercise.sets}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="exercise-reps" className="text-xs text-muted-foreground">Reps</Label>
                <Input
                  id="exercise-reps"
                  type="number"
                  placeholder="Reps"
                  value={currentExercise.reps}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="exercise-weight" className="text-xs text-muted-foreground">Weight</Label>
                <Input
                  id="exercise-weight"
                  type="number"
                  placeholder="Weight"
                  value={currentExercise.weight || ''}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>
              <div className="col-span-1 flex items-end">
                <Button onClick={addExercise} size="sm" className="w-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {exercises.length > 0 && (
              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex gap-2">
                      <Badge variant="outline">{exercise.name}</Badge>
                      <Badge variant="secondary">{exercise.sets} sets × {exercise.reps} reps</Badge>
                      {exercise.weight && <Badge>{exercise.weight}kg</Badge>}
                    </div>
                    <Button
                      onClick={() => removeExercise(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel? Any observations..."
            className="mt-2"
          />
          <div className="mt-2">
            <VoiceNoteRecorder onTranscription={handleVoiceNote} />
          </div>
        </div>

        <Button 
          onClick={logWorkout} 
          disabled={isLogging}
          className="w-full"
        >
          {isLogging ? 'Logging...' : 'Log Workout'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkoutLogger;