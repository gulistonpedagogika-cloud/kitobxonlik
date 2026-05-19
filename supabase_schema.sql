-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create literature table
CREATE TABLE IF NOT EXISTS literature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  literature_id UUID REFERENCES literature(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_surname TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  literature_ids UUID[] NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  duration INTEGER DEFAULT 30,
  question_count INTEGER DEFAULT 50
);

-- 6. Insert default settings
INSERT INTO settings (key, duration, question_count) 
VALUES ('main', 30, 50)
ON CONFLICT (key) DO UPDATE SET key = EXCLUDED.key;

-- 7. Enable RLS (Row Level Security)
ALTER TABLE literature ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 8. Create Policies (Xavfsizlik qoidalari)
-- Eslatma: Bu qoidalar hamma uchun o'qish va yozishga ruxsat beradi (Test rejimi uchun)

DO $$ 
BEGIN
    -- Literature policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read literature') THEN
        CREATE POLICY "Allow public read literature" ON literature FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin insert literature') THEN
        CREATE POLICY "Allow admin insert literature" ON literature FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin delete literature') THEN
        CREATE POLICY "Allow admin delete literature" ON literature FOR DELETE USING (true);
    END IF;

    -- Questions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read questions') THEN
        CREATE POLICY "Allow public read questions" ON questions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin insert questions') THEN
        CREATE POLICY "Allow admin insert questions" ON questions FOR INSERT WITH CHECK (true);
    END IF;

    -- Results policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert results') THEN
        CREATE POLICY "Allow public insert results" ON results FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read results') THEN
        CREATE POLICY "Allow public read results" ON results FOR SELECT USING (true);
    END IF;

    -- Settings policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read settings') THEN
        CREATE POLICY "Allow public read settings" ON settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admin update settings') THEN
        CREATE POLICY "Allow admin update settings" ON settings FOR ALL USING (true);
    END IF;
END $$;
