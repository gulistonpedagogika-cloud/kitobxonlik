-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create literature table
CREATE TABLE IF NOT EXISTS literature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  literature_id UUID REFERENCES literature(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_surname TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  literature_ids UUID[] NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  duration INTEGER DEFAULT 30,
  question_count INTEGER DEFAULT 50
);

-- 1. Enable RLS on all tables
ALTER TABLE literature ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 2. Create policies for Literature (Public Read)
CREATE POLICY "Allow public read literature" ON literature FOR SELECT USING (true);
CREATE POLICY "Allow admin insert literature" ON literature FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin delete literature" ON literature FOR DELETE USING (true);

-- 3. Create policies for Questions (Public Read)
CREATE POLICY "Allow public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow admin insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin delete questions" ON questions FOR DELETE USING (true);

-- 4. Create policies for Results (Public Insert & Read)
CREATE POLICY "Allow public insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read results" ON results FOR SELECT USING (true);

-- 5. Create policies for Settings (Public Read & Admin Update)
CREATE POLICY "Allow public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow admin update settings" ON settings FOR ALL USING (true);
