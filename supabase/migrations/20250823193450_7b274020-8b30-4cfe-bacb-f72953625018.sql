-- Restrict profiles visibility to only the user and their partner
-- 1) Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 2) Create a restricted SELECT policy
CREATE POLICY "Users can view their own and partner profile"
ON public.profiles
FOR SELECT
USING (
  -- The row is visible if it belongs to the current user
  (user_id = auth.uid())
  OR
  -- Or if the row belongs to the current user's partner
  (user_id IN (
    SELECT p.partner_id
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
  ))
  OR
  -- Or if the row is the partner looking at the current user's profile
  (auth.uid() IN (
    SELECT p.partner_id
    FROM public.profiles p
    WHERE p.user_id = user_id
  ))
);
