/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mammoth from 'mammoth';

export interface ParsedQuestion {
  question: string;
  options: string[];
  correctOption: number;
}

/**
 * Parses a Word file (.docx) and extracts questions from tables.
 * Expected format: 1 question + 4 answers ketma-ketligi.
 */
export async function parseWordTest(file: File): Promise<ParsedQuestion[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    const questions: ParsedQuestion[] = [];
    
    // Pattern: Har bir savol va undan keyin 4 ta javob
    for (let i = 0; i + 4 < lines.length; i += 5) {
      questions.push({
        question: lines[i],
        options: [lines[i+1], lines[i+2], lines[i+3], lines[i+4]],
        correctOption: 0
      });
    }

    if (questions.length === 0) {
      throw new Error('Fayldan savollar topilmadi. Har bir savol + 4 ta javob ketma-ketligida bo\'lishi kerak.');
    }

    return questions;
  } catch (err: any) {
    console.error('Parsing error:', err);
    throw new Error(err.message || 'Faylni o\'qishda xatolik yuz berdi. Fayl .docx formatida ekanligiga ishonch hosil qiling.');
  }
}
