-- Fix remaining function search path security issues
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, invite_code)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    public.generate_invite_code()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;