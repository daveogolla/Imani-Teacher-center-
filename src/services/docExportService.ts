import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  HeadingLevel,
} from 'docx';
import { SchemeOfWork, LessonPlan, RevisionMaterial } from '../types';

export async function exportSchemeToDocx(scheme: SchemeOfWork): Promise<Blob> {
  const tableRows: TableRow[] = [];

  // Header row for Schemes of Work
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        makeCell('Wk', 6, true, '004d40'),
        makeCell('Lsn', 6, true, '004d40'),
        makeCell('Strand / Topic', 18, true, '004d40'),
        makeCell('Sub-Strand', 18, true, '004d40'),
        makeCell('Specific Learning Outcomes', 24, true, '004d40'),
        makeCell('Key Inquiry Questions', 14, true, '004d40'),
        makeCell('Learning Experiences & Core Competencies', 24, true, '004d40'),
        makeCell('KICD Resources & Books', 18, true, '004d40'),
        makeCell('Assessment', 12, true, '004d40'),
        makeCell('Remarks', 10, true, '004d40'),
      ],
    })
  );

  // Lesson Rows
  scheme.lessons.forEach((l) => {
    if (l.isBreak) {
      // Break row: Blank duration clearly highlighted
      tableRows.push(
        new TableRow({
          children: [
            makeCell(`${l.week}`, 6, true, 'fef3c7'),
            makeCell(`${l.lessonNumber}`, 6, true, 'fef3c7'),
            new TableCell({
              columnSpan: 8,
              width: { size: 148, type: WidthType.PERCENTAGE },
              shading: { fill: 'fffbeb' },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `*** ${l.breakTitle || 'OFFICIAL BREAK'} - WEEK ${l.week} ***`,
                      bold: true,
                      size: 22,
                      color: 'b45309',
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `[DURATION LEFT BLANK: Learners & Teaching Staff on official scheduled break. No classroom lessons scheduled.]`,
                      italics: true,
                      size: 18,
                      color: '78350f',
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
    } else {
      tableRows.push(
        new TableRow({
          children: [
            makeCell(`${l.week}`, 6, false),
            makeCell(`${l.lessonNumber}`, 6, false),
            makeCell(l.strand, 18, false),
            makeCell(l.subStrand, 18, false),
            makeCell(l.specificLearningOutcomes, 24, false),
            makeCell(l.keyInquiryQuestions, 14, false),
            makeCell(l.learningExperiences, 24, false),
            makeCell(l.learningResources, 18, false),
            makeCell(l.assessmentMethods, 12, false),
            makeCell(l.reflection || '', 10, false),
          ],
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      // Section 1: Official Cover Page
      {
        properties: {},
        children: [
          new Paragraph({ text: '', spacing: { before: 200 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: scheme.schoolName.toUpperCase() || 'IMANI TEACHERS CENTER REPUBLIQUE',
                bold: true,
                size: 38,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'KENYA INSTITUTE OF CURRICULUM DEVELOPMENT (KICD) APPROVED FORMAT',
                bold: true,
                size: 20,
                color: '4b5563',
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 300, after: 300 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'SCHEMES OF WORK',
                bold: true,
                size: 48,
                color: '111827',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${scheme.subject.toUpperCase()} - ${scheme.grade.toUpperCase()}`,
                bold: true,
                size: 32,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${scheme.term} | Academic Year: ${scheme.year}`,
                bold: true,
                size: 24,
                color: '374151',
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 400, after: 400 } }),

          // Details Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeMetadataRow('Teacher Name:', scheme.teacherName),
              makeMetadataRow('TSC Number:', scheme.tscNumber || '_____________________'),
              makeMetadataRow('Lessons Per Week:', `${scheme.lessonsPerWeek} Lessons`),
              makeMetadataRow('Term Start Date:', scheme.termStartDate),
              makeMetadataRow('Half Term Break:', scheme.term === 'Term 3' ? 'No Half Term Break in Term 3 (Continuous Exam Term)' : `${scheme.halfTermStartDate} to ${scheme.halfTermEndDate} (Duration Blank in Schedule)`),
              makeMetadataRow('Term Closing Date:', scheme.termEndDate),
              makeMetadataRow('Approved KICD Books:', scheme.approvedBooks.join(', ') || 'KLB Visionary, Oxford, Moran'),
            ],
          }),

          new Paragraph({ text: '', spacing: { before: 400 } }),

          // Sign-off section for HoD, Deputy Principal, Principal
          new Paragraph({
            children: [
              new TextRun({
                text: 'OFFICIAL ADMINISTRATIVE SIGN-OFF & APPROVALS',
                bold: true,
                size: 22,
                color: '111827',
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  makeCell('Designation', 25, true, 'f3f4f6'),
                  makeCell('Official Name', 25, true, 'f3f4f6'),
                  makeCell('Signature & Stamp', 25, true, 'f3f4f6'),
                  makeCell('Date Approved', 25, true, 'f3f4f6'),
                ],
              }),
              new TableRow({
                children: [
                  makeCell('Head of Department (HoD)', 25, false),
                  makeCell(scheme.approvals.hod.name, 25, false),
                  makeCell(scheme.approvals.hod.signed ? '[DIGITALLY SIGNED & VERIFIED]' : '_______________________', 25, false, scheme.approvals.hod.signed ? 'ecfdf5' : undefined),
                  makeCell(scheme.approvals.hod.signed && scheme.approvals.hod.date ? scheme.approvals.hod.date : '____ / ____ / 2026', 25, false),
                ],
              }),
              new TableRow({
                children: [
                  makeCell('Deputy Principal (Academics)', 25, false),
                  makeCell(scheme.approvals.deputyPrincipal.name, 25, false),
                  makeCell(scheme.approvals.deputyPrincipal.signed ? '[DIGITALLY COUNTERSIGNED]' : '_______________________', 25, false, scheme.approvals.deputyPrincipal.signed ? 'ecfdf5' : undefined),
                  makeCell(scheme.approvals.deputyPrincipal.signed && scheme.approvals.deputyPrincipal.date ? scheme.approvals.deputyPrincipal.date : '____ / ____ / 2026', 25, false),
                ],
              }),
              new TableRow({
                children: [
                  makeCell('Principal / Head Teacher', 25, false),
                  makeCell(scheme.approvals.principal.name, 25, false),
                  makeCell(scheme.approvals.principal.signed ? '[OFFICIALLY SEALED & APPROVED]' : '_______________________', 25, false, scheme.approvals.principal.signed ? 'ecfdf5' : undefined),
                  makeCell(scheme.approvals.principal.signed && scheme.approvals.principal.date ? scheme.approvals.principal.date : '____ / ____ / 2026', 25, false),
                ],
              }),
            ],
          }),
        ],
      },
      // Section 2: Landscape Schemes Table with Running Headers/Footers & Pagination
      {
        properties: {
          page: {
            size: {
              orientation: 'landscape' as any,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${scheme.schoolName} | ${scheme.subject} - ${scheme.grade} | ${scheme.term} ${scheme.year}`,
                    italics: true,
                    size: 16,
                    color: '6b7280',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Mwalimu: ${scheme.teacherName}${scheme.tscNumber ? ` (TSC: ${scheme.tscNumber})` : ''} | IMANI TEACHERS CENTER | Page `,
                    size: 16,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    bold: true,
                    size: 16,
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    bold: true,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: `${scheme.subject.toUpperCase()} SCHEMES OF WORK - ${scheme.grade.toUpperCase()}`,
                bold: true,
                size: 26,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function exportLessonPlanToDocx(plan: LessonPlan): Promise<Blob> {
  const stepsRows: TableRow[] = plan.lessonDevelopment.map((s) => {
    return new TableRow({
      children: [
        makeCell(s.step, 20, true, 'f3f4f6'),
        makeCell(s.time, 10, false),
        makeCell(s.teacherActivity, 35, false),
        makeCell(s.learnerActivity, 35, false),
      ],
    });
  });

  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${plan.schoolName} - CBC Lesson Plan: ${plan.subject} (${plan.grade})`,
                    italics: true,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Teacher: ${plan.teacherName}${plan.tscNumber ? ` | TSC: ${plan.tscNumber}` : ''} | Page `,
                    size: 16,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    bold: true,
                    size: 16,
                  }),
                  new TextRun({ text: ' of ', size: 16 }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    bold: true,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: plan.schoolName.toUpperCase(),
                bold: true,
                size: 32,
                color: '047857',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'OFFICIAL KICD CBC / 8-4-4 LESSON PLAN',
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 200, after: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              makeMetadataRow('Teacher:', plan.teacherName),
              makeMetadataRow('TSC No:', plan.tscNumber || '_____________________'),
              makeMetadataRow('Grade / Class:', plan.grade),
              makeMetadataRow('Subject:', plan.subject),
              makeMetadataRow('Strand / Sub-Strand:', `${plan.strand} / ${plan.subStrand}`),
              makeMetadataRow('Date & Time:', `${plan.date} | ${plan.time} (${plan.durationMinutes} mins)`),
              makeMetadataRow('Roll Call:', `Boys: ${plan.rollCallBoys || 25} | Girls: ${plan.rollCallGirls || 25}`),
              makeMetadataRow('Approved KICD Books:', plan.kicdApprovedBooks.join(', ')),
              makeMetadataRow('Core Competencies:', plan.coreCompetencies.join('; ')),
              makeMetadataRow('Values & PCIs:', `${plan.values.join(', ')} | ${plan.pcis.join(', ')}`),
              makeMetadataRow('Key Inquiry Questions:', plan.keyInquiryQuestions.join('; ')),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 250 } }),
          new Paragraph({
            children: [new TextRun({ text: 'LESSON DEVELOPMENT', bold: true, size: 22 })],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  makeCell('Step', 20, true, '047857'),
                  makeCell('Time', 10, true, '047857'),
                  makeCell('Teacher Activities', 35, true, '047857'),
                  makeCell('Learner Activities', 35, true, '047857'),
                ],
              }),
              new TableRow({
                children: [
                  makeCell('Introduction', 20, true, 'f3f4f6'),
                  makeCell(plan.introduction.time, 10, false),
                  makeCell(plan.introduction.teacherActivity, 35, false),
                  makeCell(plan.introduction.learnerActivity, 35, false),
                ],
              }),
              ...stepsRows,
              new TableRow({
                children: [
                  makeCell('Conclusion', 20, true, 'f3f4f6'),
                  makeCell(plan.conclusion.time, 10, false),
                  makeCell(plan.conclusion.summary, 35, false),
                  makeCell(plan.conclusion.learnerActivity, 35, false),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Self-Evaluation / Remarks: ', bold: true, size: 20 }),
              new TextRun({ text: plan.selfEvaluation, italics: true, size: 20 }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Sign-in & Approvals:', bold: true, size: 20 }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  makeCell('HOD Signature: _______________________ Date: ____/____/2026', 50, false),
                  makeCell('Principal Signature: _______________________ Date: ____/____/2026', 50, false),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export async function exportRevisionToDocx(rev: RevisionMaterial): Promise<Blob> {
  const qParagraphs: Paragraph[] = [];

  rev.questions.forEach((q) => {
    qParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Question ${q.number}: `, bold: true, size: 22, color: '047857' }),
          new TextRun({ text: q.questionText, size: 22 }),
        ],
      })
    );
    qParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'KICD Approved Book Reference: ', bold: true, size: 18, color: '6b7280' }),
          new TextRun({ text: q.kicdBookReference, italics: true, size: 18 }),
        ],
      })
    );
    qParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Marking Scheme / Answer Guide:', bold: true, size: 20, color: '111827' }),
        ],
      })
    );
    qParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: q.answerGuide, size: 20, color: '374151' }),
        ],
        spacing: { after: 250 },
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `IMANI TEACHERS CENTER - ${rev.title} | Page `, size: 16 }),
                  new TextRun({ children: [PageNumber.CURRENT], bold: true, size: 16 }),
                  new TextRun({ text: ' of ', size: 16 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], bold: true, size: 16 }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'IMANI TEACHERS CENTER REVISION REPOSITORY', bold: true, size: 28, color: '047857' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: rev.title, bold: true, size: 24 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Curriculum: ${rev.curriculum} | Grade: ${rev.grade} | Duration: ${rev.durationMinutes} mins | Total Marks: ${rev.totalMarks}`, size: 20 }),
            ],
          }),
          new Paragraph({ text: '', spacing: { before: 200, after: 200 } }),
          ...qParagraphs,
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function makeCell(text: string, widthPercent: number, isHeader = false, bgColor?: string): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: bgColor ? { fill: bgColor } : isHeader ? { fill: '047857' } : undefined,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader,
            color: isHeader ? 'ffffff' : '111827',
            size: isHeader ? 18 : 17,
          }),
        ],
      }),
    ],
  });
}

function makeMetadataRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { fill: 'f9fafb' },
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true, size: 20, color: '111827' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            children: [new TextRun({ text: value || 'N/A', size: 20, color: '374151' })],
          }),
        ],
      }),
    ],
  });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printFormattedDocument(htmlContent: string, title: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 11pt; color: #111; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #444; padding: 6px; text-align: left; vertical-align: top; font-size: 9pt; }
          th { background-color: #047857; color: white; font-weight: bold; }
          .break-row { background-color: #fef3c7; color: #92400e; font-weight: bold; text-align: center; }
          .header-box { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 12px; margin-bottom: 15px; }
          .meta-table { width: 100%; margin-bottom: 15px; border: none; }
          .meta-table td { border: none; padding: 4px; font-size: 10pt; }
          .page-footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 9pt; color: #666; border-top: 1px solid #ccc; padding-top: 5px; }
          .approvals { margin-top: 25px; border-top: 1px dashed #666; padding-top: 10px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; text-align: right;">
          <button onclick="window.print()" style="background:#047857;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:bold;">Print / Save as PDF</button>
        </div>
        ${htmlContent}
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
