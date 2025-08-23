import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export const useInviteSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const connectPartner = async (inviteCode: string) => {
    if (!user || !inviteCode.trim()) return false;

    setLoading(true);
    try {
      // Find the profile with this invite code
      const { data: inviterProfile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (findError || !inviterProfile) {
        toast({
          title: "Invalid Invite Code",
          description: "The invite code you entered is not valid.",
          variant: "destructive",
        });
        return false;
      }

      if (inviterProfile.user_id === user.id) {
        toast({
          title: "Cannot Use Own Code",
          description: "You cannot use your own invite code.",
          variant: "destructive",
        });
        return false;
      }

      // Check if either user is already connected
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (currentProfile?.partner_id || inviterProfile.partner_id) {
        toast({
          title: "Already Connected",
          description: "One of you is already connected to another partner.",
          variant: "destructive",
        });
        return false;
      }

      // Connect both users
      const { error: updateError1 } = await supabase
        .from('profiles')
        .update({ partner_id: inviterProfile.user_id })
        .eq('user_id', user.id);

      const { error: updateError2 } = await supabase
        .from('profiles')
        .update({ partner_id: user.id })
        .eq('user_id', inviterProfile.user_id);

      if (updateError1 || updateError2) {
        throw updateError1 || updateError2;
      }

      toast({
        title: "Partner Connected!",
        description: `You're now connected with ${inviterProfile.display_name || 'your partner'}!`,
      });

      return true;
    } catch (error) {
      console.error('Error connecting partner:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect with partner. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const shareInviteCode = async (inviteCode: string) => {
    const message = `Join me on FitTogether! Use my invite code: ${inviteCode}

Download the app and enter this code to become workout partners! 💪

#FitTogether #WorkoutBuddy`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    connectPartner,
    shareInviteCode,
    loading
  };
};