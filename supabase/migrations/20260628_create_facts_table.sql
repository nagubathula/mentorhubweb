-- Migration: Create public.interesting_facts table
CREATE TABLE IF NOT EXISTS public.interesting_facts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    emoji TEXT,
    is_published BOOLEAN DEFAULT true,
    is_active_today BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.interesting_facts ENABLE ROW LEVEL SECURITY;

-- Allow public actions (SELECT, INSERT, UPDATE, DELETE) for prototype integration
CREATE POLICY "Public actions interesting_facts" ON public.interesting_facts FOR ALL USING (true) WITH CHECK (true);
