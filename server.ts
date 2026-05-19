import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import mammoth from 'mammoth';

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Word parsing API
app.post('/api/parse-test', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fayl yuklanmadi' });
    }

    // Mammoth extracts raw text, but for tables we might need to look at the structure
    // Since the users often use simple tables, text often comes in order:
    // Q, A1, A2, A3, A4.
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value;

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    const questions: any[] = [];
    // Looking for a pattern: Question text followed by 4 lines of answers
    // This is a simple heuristic. Better would be HTML parsing if mammoth returns HTML.
    for (let i = 0; i + 4 < lines.length; i += 5) {
      questions.push({
        question: lines[i],
        options: [lines[i+1], lines[i+2], lines[i+3], lines[i+4]],
        correctOption: 0 // Following the rule: 1st option after question is correct
      });
    }

    if (questions.length === 0) {
       return res.status(400).json({ error: 'Fayldan savollar topilmadi. Har bir savol + 4 ta javob ketma-ketligida bo\'lishi kerak.' });
    }

    res.json({ questions });
  } catch (error) {
    console.error('Parsing error:', error);
    res.status(500).json({ error: 'Faylni o\'qishda xatolik yuz berdi' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
