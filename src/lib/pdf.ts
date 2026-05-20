/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TestResult {
  studentName: string;
  studentSurname: string;
  course?: string;
  educationType?: string;
  specialty?: string;
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
  doc.setFontSize(11);
  const infoY = 45;
  doc.text(`Talaba: ${result.studentSurname} ${result.studentName}`, 20, infoY);
  
  let currentY = infoY + 8;
  if (result.course || result.educationType || result.specialty) {
    const parts: string[] = [];
    if (result.course) parts.push(`${result.course}-kurs`);
    if (result.educationType) parts.push(result.educationType);
    if (result.specialty) parts.push(result.specialty);
    
    doc.text(`Yonalish: ${parts.join(', ')}`, 20, currentY);
    currentY += 8;
  }
  
  doc.text(`Sana: ${result.timestamp.toLocaleDateString()} ${result.timestamp.toLocaleTimeString()}`, 20, currentY);
  currentY += 8;
  
  doc.text(`Tanlangan adabiyotlar: ${result.literatureTitles.join(', ')}`, 20, currentY);

  // Results Table
  autoTable(doc, {
    startY: currentY + 10,
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

export interface GroupReportData {
  results: {
    studentName: string;
    studentSurname: string;
    course: string;
    educationType: string;
    specialty: string;
    score: number;
    total: number;
    timestamp: string | Date;
  }[];
  filters: {
    course: string;
    educationType: string;
    specialty: string;
  };
}

export function generateGroupReportPDF(data: GroupReportData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('Guliston Davlat Pedagogika Instituti', 105, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Guruh Test Natijalari Hisoboti', 105, 26, { align: 'center' });

  // Filters info
  doc.setFontSize(10);
  doc.text(`Sana: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 36);
  
  const filterDesc: string[] = [];
  if (data.filters.course) filterDesc.push(`Kurs: ${data.filters.course}`);
  if (data.filters.educationType) filterDesc.push(`Ta'lim turi: ${data.filters.educationType}`);
  if (data.filters.specialty) filterDesc.push(`Yo'nalish: ${data.filters.specialty}`);
  
  const filterText = filterDesc.length > 0 ? filterDesc.join(' | ') : 'Barcha natijalar';
  doc.text(`Filtr: ${filterText}`, 20, 42);

  // Table Body preparation
  const tableRows = data.results.map((res, index) => {
    const scorePercent = res.total > 0 ? Math.round((res.score / res.total) * 100) : 0;
    const dateFormatted = new Date(res.timestamp).toLocaleDateString();
    const timeFormatted = new Date(res.timestamp).toLocaleTimeString();
    return [
      (index + 1).toString(),
      `${res.studentSurname} ${res.studentName}`,
      res.course ? `${res.course}-kurs` : '-',
      res.educationType || '-',
      res.specialty || '-',
      `${res.score} / ${res.total}`,
      `${scorePercent}%`,
      `${dateFormatted} ${timeFormatted}`
    ];
  });

  autoTable(doc, {
    startY: 48,
    head: [['T/r', 'Talaba F.I.S', 'Kurs', 'Ta\'lim turi', 'Yo\'nalish', 'Natija', 'Foiz', 'Sana']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 8, font: 'helvetica' },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 40 },
      2: { cellWidth: 15 },
      3: { cellWidth: 20 },
      4: { cellWidth: 45 },
      5: { cellWidth: 18 },
      6: { cellWidth: 15 },
      7: { cellWidth: 27 }
    }
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('GulDPI Online Test Tizimi - Guruh Hisoboti', 105, pageHeight - 10, { align: 'center' });

  doc.save(`Guruh_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

