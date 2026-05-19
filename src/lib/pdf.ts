/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TestResult {
  studentName: string;
  studentSurname: string;
  literatureTitles: string[];
  score: number;
  total: number;
  timestamp: Date;
}

export function generateResultsPDF(result: TestResult) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Guliston Davlat Pedagogika Instituti', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Test Natijasi', 105, 30, { align: 'center' });

  // Student Info
  doc.setFontSize(12);
  const infoY = 45;
  doc.text(`Talaba: ${result.studentSurname} ${result.studentName}`, 20, infoY);
  doc.text(`Sana: ${result.timestamp.toLocaleDateString()} ${result.timestamp.toLocaleTimeString()}`, 20, infoY + 10);
  doc.text(`Tanlangan adabiyotlar: ${result.literatureTitles.join(', ')}`, 20, infoY + 20);

  // Results Table
  autoTable(doc, {
    startY: infoY + 30,
    head: [['Ko\'rsatkich', 'Qiymat']],
    body: [
      ['Umumiy savollar', result.total.toString()],
      ['To\'g\'ri javoblar', result.score.toString()],
      ['Foiz', `${Math.round((result.score / result.total) * 100)}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] } // Using RGB for indigo-600
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('GulDPI Online Test Tizimi', 105, pageHeight - 10, { align: 'center' });

  doc.save(`${result.studentSurname}_${result.studentName}_natija.pdf`);
}
