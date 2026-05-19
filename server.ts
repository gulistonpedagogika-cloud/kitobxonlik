import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import WordExtractor from 'word-extractor';

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Word parsing API
app.post('/api/parse-test', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Fayl yuklanmadi' });
    }

    const extractor = new WordExtractor();
    const doc = await extractor.extract(req.file.buffer);
    const body = doc.getBody();

    // Word-extractor joins table cells with \t or \n
    // We'll split the text into meaningful segments
    // Since the format is 1 question + 4 answers, we look for blocks
    const lines = body.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    const questions: any[] = [];
    for (let i = 0; i + 4 < lines.length; i += 5) {
      questions.push({
        question: lines[i],
        options: [lines[i+1], lines[i+2], lines[i+3], lines[i+4]],
        correctOption: 0 // Following the rule: 1st option after question is correct
      });
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
