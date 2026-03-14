-- Initialization Migration for CV Matcher AI
-- To be run in the Supabase SQL Editor or via Supabase CLI

-- 1. Create `cv_analysis` table
CREATE TABLE IF NOT EXISTS public.cv_analysis (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_cv_url text,
    job_description text,
    match_score integer CHECK (match_score >= 0 AND match_score <= 100),
    matched_keywords text[],
    missing_keywords text[],
    reformulated_cv_markdown text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Configure Row Level Security (RLS)
ALTER TABLE public.cv_analysis ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view their own analyses" 
ON public.cv_analysis 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert their own analyses" 
ON public.cv_analysis 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update their own analyses" 
ON public.cv_analysis 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete their own analyses" 
ON public.cv_analysis 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Create Storage Bucket for CV files
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Assumes auth.uid() is required to upload, but they are public to read.
CREATE POLICY "Public Access" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'cv-files');

CREATE POLICY "Authenticated users can upload CVs" 
    ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'cv-files' 
        AND auth.role() = 'authenticated'
    );
