-- Tiered Access Migration for CV Matcher AI
-- Run this in the Supabase SQL Editor

-- 1. Create a `profiles` table for tiered user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  tier text DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Configure Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- 3. Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- We only create a profile if it's not an anonymous user
  IF new.is_anonymous = FALSE THEN
    INSERT INTO public.profiles (id, tier)
    VALUES (new.id, 'free');
  END IF;
  RETURN new;
END;
$$;

-- Note: We only trigger on INSERT to auth.users if they aren't anonymous
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure cv_analysis table user_id is properly linked to auth.users (Already done in Phase 2)
-- ALTER TABLE public.cv_analysis ADD CONSTRAINT cv_analysis_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);
