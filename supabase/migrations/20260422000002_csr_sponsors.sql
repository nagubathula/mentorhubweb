-- Migration: CSR Sponsors
-- Stores corporate social responsibility partner organizations

CREATE TABLE IF NOT EXISTS csr_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  status text DEFAULT 'Prospect' CHECK (status IN ('Active', 'Prospect', 'Completed', 'Pending')),
  description text,
  tags jsonb DEFAULT '[]'::jsonb,
  current_amount numeric(12, 2) DEFAULT 0,
  total_amount numeric(12, 2) DEFAULT 0,
  mentees_count integer DEFAULT 0,
  mentors_count integer DEFAULT 0,
  avatar_initials text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE csr_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin full access on csr_sponsors" ON csr_sponsors
  USING (true) WITH CHECK (true);
