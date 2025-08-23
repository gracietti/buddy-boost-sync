import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  partner_id?: string;
  invite_code?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setPartnerProfile(null);
      setLoading(false);
      return;
    }

    try {
      // Fetch user's own profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);

        // If user has a partner, fetch partner's profile
        if (profileData?.partner_id) {
          const { data: partnerData, error: partnerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', profileData.partner_id)
            .single();

          if (partnerError && partnerError.code !== 'PGRST116') {
            console.error('Error fetching partner profile:', partnerError);
          } else {
            setPartnerProfile(partnerData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    partnerProfile,
    loading,
    refetch: fetchProfile,
    isConnected: !!partnerProfile,
    partnerName: partnerProfile?.display_name || 'Partner'
  };
};