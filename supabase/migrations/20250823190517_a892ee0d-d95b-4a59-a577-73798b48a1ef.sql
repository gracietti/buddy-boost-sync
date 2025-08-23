-- Helper function to get partner's user_id for a given user_id
CREATE OR REPLACE FUNCTION public.get_partner_user_id(_user_id uuid)
RETURNS uuid AS $$
  SELECT p2.user_id
  FROM public.profiles p1
  JOIN public.profiles p2 ON p2.id = p1.partner_id
  WHERE p1.user_id = _user_id
  LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public;

-- Update workouts select policy to correctly allow partner visibility
DROP POLICY IF EXISTS "Users can view their own and partner's workouts" ON public.workouts;
CREATE POLICY "Users can view own and partner workouts"
ON public.workouts
FOR SELECT
USING (
  auth.uid() = user_id
  OR user_id = public.get_partner_user_id(auth.uid())
);

-- Update messages insert policy to use partner user id
DROP POLICY IF EXISTS "Users can send messages to their partner" ON public.messages;
CREATE POLICY "Users can send messages to partner"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND recipient_id = public.get_partner_user_id(auth.uid())
);

-- Storage bucket for voice recordings
insert into storage.buckets (id, name, public) values ('voice-notes', 'voice-notes', true) on conflict do nothing;

-- Storage policies
CREATE POLICY IF NOT EXISTS "Public read voice notes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'voice-notes');

CREATE POLICY IF NOT EXISTS "Users can upload voice notes to their folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'voice-notes' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can update their own voice notes"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'voice-notes' AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Users can delete their own voice notes"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'voice-notes' AND (auth.uid())::text = (storage.foldername(name))[1]
);