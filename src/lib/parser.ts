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
 * Expected format: 1 row/cell for question, next 4 for answers.
 * By default, we assume the first option is the correct one.
 */
export async function parseWordTest(file: File): Promise<ParsedQuestion[]> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/parse-test', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Serverga yuklashda xatolik yuz berdi');
    }

    const data = await response.json();
    return data.questions;
  } catch (err) {
    console.error('Parsing error:', err);
    throw new Error('Faylni tahlil qilishda xatolik yuz berdi. Fayl .doc yoki .docx formatida ekanligiga ishonch hosil qiling.');
  }
}
