
-- Create a table for experiences
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  startdate TEXT NOT NULL,
  enddate TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to allow public read access
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Create policy that allows public read access
CREATE POLICY "Allow public read access" 
  ON public.experiences 
  FOR SELECT 
  USING (true);
