-- Fix infinite recursion in profiles SELECT policy using a security definer function
-- and add missing UPDATE/DELETE policies for messages and voice_recordings

-- 1) Helper function to determine if a profile row is visible to current user
CREATE OR REPLACE FUNCTION public.is_profile_visible_to_current_user(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    target_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.partner_id = target_user_id
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = target_user_id AND p.partner_id = auth.uid()
    );
$$;

-- 2) Recreate SELECT policy on profiles to avoid self-referencing recursion
DROP POLICY IF EXISTS "Users can view their own and partner profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own and partner profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own and partner profile"
ON public.profiles
FOR SELECT
USING (public.is_profile_visible_to_current_user(user_id));

-- 3) Messages: allow users to update/delete their own sent messages
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;
CREATE POLICY "Users can update their own messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can delete their own messages" ON public.messages;
CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
USING (auth.uid() = sender_id);

-- 4) Voice recordings: allow users to update/delete recordings of their own messages
DROP POLICY IF EXISTS "Users can update their voice recordings" ON public.voice_recordings;
CREATE POLICY "Users can update their voice recordings"
ON public.voice_recordings
FOR UPDATE
USING (
  message_id IN (
    SELECT m.id FROM public.messages m WHERE m.sender_id = auth.uid()
  )
)
WITH CHECK (
  message_id IN (
    SELECT m.id FROM public.messages m WHERE m.sender_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete their voice recordings" ON public.voice_recordings;
CREATE POLICY "Users can delete their voice recordings"
ON public.voice_recordings
FOR DELETE
USING (
  message_id IN (
    SELECT m.id FROM public.messages m WHERE m.sender_id = auth.uid()
  )
);
