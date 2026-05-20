-- Eski jadvallarni batamom o'chirish (Toza holdan boshlash uchun)
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS literature CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 1. UUID kengaytmasini yoqish
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Adabiyotlar (literature) jadvalini yaratish
CREATE TABLE literature (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Savollar (questions) jadvalini yaratish
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  literature_id UUID REFERENCES literature(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Natijalar (results) jadvalini yaratish (Kurs, ta'lim turi va yo'nalishlar bilan)
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_surname TEXT NOT NULL,
  course TEXT NOT NULL,
  education_type TEXT NOT NULL,
  specialty TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  literature_ids UUID[] NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Sozlamalar (settings) jadvalini yaratish
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  duration INTEGER DEFAULT 30,
  question_count INTEGER DEFAULT 50
);

-- 6. Standart sozlamalarni kiritish
INSERT INTO settings (key, duration, question_count) 
VALUES ('main', 30, 50)
ON CONFLICT (key) DO UPDATE SET key = EXCLUDED.key;

-- 7. Row Level Security (RLS) yoqish
ALTER TABLE literature ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 8. Xavfsizlik qoidalarini (Policies) yaratish
-- Eslatma: Quyidagi qoidalar hamma uchun test rejimi integratsiyasida oson tahlil va ishlashga ruxsat beradi

-- Literature qoidalari
CREATE POLICY "Allow public read literature" ON literature FOR SELECT USING (true);
CREATE POLICY "Allow admin insert literature" ON literature FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin delete literature" ON literature FOR DELETE USING (true);

-- Questions qoidalari
CREATE POLICY "Allow public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow admin insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin delete questions" ON questions FOR DELETE USING (true);

-- Results qoidalari
CREATE POLICY "Allow public insert results" ON results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read results" ON results FOR SELECT USING (true);

-- Settings qoidalari
CREATE POLICY "Allow public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow admin update settings" ON settings FOR ALL USING (true);
