import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DailyClaps {
  date: string;
  clapsReceived: number;
  clapsSent: number;
}

export const useClaps = () => {
  const [dailyClaps, setDailyClaps] = useState<DailyClaps[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDailyClaps = async () => {
    if (!user) {
      setDailyClaps([]);
      setLoading(false);
      return;
    }

    try {
      // Get claps received and sent for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('messages')
        .select('created_at, claps_count, sender_id, recipient_id')
        .eq('type', 'clap')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching claps:', error);
        setDailyClaps([]);
      } else {
        // Group claps by date
        const clapsMap = new Map<string, { received: number; sent: number }>();
        
        data?.forEach((message) => {
          const date = new Date(message.created_at).toDateString();
          const claps = message.claps_count || 1;
          
          if (!clapsMap.has(date)) {
            clapsMap.set(date, { received: 0, sent: 0 });
          }
          
          const dayClaps = clapsMap.get(date)!;
          if (message.recipient_id === user.id) {
            dayClaps.received += claps;
          } else {
            dayClaps.sent += claps;
          }
        });

        const clapsArray = Array.from(clapsMap.entries()).map(([date, claps]) => ({
          date,
          clapsReceived: claps.received,
          clapsSent: claps.sent,
        }));

        setDailyClaps(clapsArray);
      }
    } catch (error) {
      console.error('Error fetching daily claps:', error);
      setDailyClaps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyClaps();
  }, [user]);

  const getClapsForDate = (dateString: string) => {
    const dayClaps = dailyClaps.find(d => d.date === dateString);
    return dayClaps?.clapsReceived || 0;
  };

  return {
    dailyClaps,
    loading,
    refetch: fetchDailyClaps,
    getClapsForDate
  };
};