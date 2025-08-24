-- Add claps tracking to messages table
ALTER TABLE public.messages 
ADD COLUMN claps_count INTEGER DEFAULT 1;