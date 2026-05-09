import { 
  Document, Packer, Paragraph, Table, TableCell, TableRow, 
  WidthType, AlignmentType, BorderStyle, TextRun, ImageRun,
  VerticalAlign, ShadingType
} from "docx";
import { saveAs } from "file-saver";
import leftLogo from "../../assets/leftLogo.jpg";
import rightLogo from "../../assets/rightLogo.jpg";

const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      // Strip the data:...;base64, prefix — ImageRun needs raw base64
      const result = reader.result;
      resolve(result);
    };
  });
};

// ─── DXA constants (1440 DXA = 1 inch) ───────────────────────────────────────
// A4 page: 11906 DXA wide. Margins: 720 left + 720 right = 9466 content width
const PAGE_W = 10466;

// Header columns: 15% / 70% / 15%
const H_LEFT  = Math.round(PAGE_W * 0.15);  // 1420
const H_MID   = Math.round(PAGE_W * 0.70);  // 6626
const H_RIGHT = PAGE_W - H_LEFT - H_MID;    // remainder

// Student info: 4 equal columns
const INFO_COL = Math.round(PAGE_W / 4);

// Marks table: 11 columns — fixed widths that sum to PAGE_W
const M_SUBJECT = 1600;
const M_CODE    = 900;
const M_REST    = Math.round((PAGE_W - M_SUBJECT - M_CODE) / 9); // ~771 each
// Adjust last column to exactly fill
const M_LAST    = PAGE_W - M_SUBJECT - M_CODE - M_REST * 8;

// ─── Border presets ────────────────────────────────────────────────────────────
const BORDER = { style: BorderStyle.SINGLE, size: 2, color: "000000" };
const BORDERS_ALL = {
  top: BORDER, bottom: BORDER, left: BORDER, right: BORDER,
  insideH: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  insideV: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};
const BORDER_NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

// ─── Cell margin for padding ───────────────────────────────────────────────────
const CELL_MARGINS = { top: 80, bottom: 80, left: 120, right: 120 };

// ─── Paragraph helpers ─────────────────────────────────────────────────────────
const p = (text, opts = {}) => {
  const isKannada = /[\u0C80-\u0CFF]/.test(String(text));
  return new Paragraph({
  
  alignment: opts.center ? AlignmentType.CENTER : opts.right ? AlignmentType.RIGHT : AlignmentType.LEFT,
  spacing: opts.spacing,
  children: [new TextRun({ text: String(text ?? ""), bold: !!opts.bold, size: opts.size,font: isKannada? "Nirmala UI" : "Times New Roman" })],
})};

const cell = (children, width, opts = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  margins: CELL_MARGINS,
  columnSpan: opts.span,
  verticalAlign: opts.vAlign || VerticalAlign.CENTER,
  borders: opts.borders || BORDERS_ALL,
  children: Array.isArray(children) ? children : [children],
});

// ─── Main export ───────────────────────────────────────────────────────────────
export const generateUniversityDoc = async (studentInfo, selection, semesterData) => {
  const leftLogoBase64  = await getBase64FromUrl(leftLogo);
  const rightLogoBase64 = await getBase64FromUrl(rightLogo);

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        }
      },
      children: [

        // ══════════════════════════════════════════════════════
        // HEADER TABLE
        // ══════════════════════════════════════════════════════
        new Table({
           alignment: AlignmentType.CENTER,
          width: { size:PAGE_W  , type: WidthType.DXA },
          columnWidths: [H_LEFT, H_MID, H_RIGHT], // ← REQUIRED
          borders: BORDERS_ALL,
          rows: [
            new TableRow({
              children: [
                // Left logo
                cell(
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        data: leftLogoBase64,
                        type: "jpg",                    // ← REQUIRED (was missing)
                        transformation: { width: 65, height: 65 },
                      }),
                    ],
                  }),
                  H_LEFT,
                  { borders: { ...BORDERS_ALL, right: BORDER_NONE } }
                ),

                // Centre text
                cell(
                  [
                    p("ಗುಲಬರ್ಗ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಕಲಬುರಗಿ", { center: true, bold: true, size: 20 }),
                    p("GULBARGA UNIVERSITY",              { center: true, bold: true, size: 26 }),
                    p('"JNANA GANGA" KALABURAGI-585106, KARNATAKA, INDIA', { center: true, size: 15 }),
                    p("EXAMINATION BRANCH",               { center: true, bold: true, size: 18 }),
                    p("Phone: 08472-263203  Fax: 08472-263203  E-mail: regegug@rediffmail.com", { center: true, size: 13 }),
                  ],
                  H_MID,
                  { borders: { ...BORDERS_ALL, left: BORDER_NONE, right: BORDER_NONE } }
                ),

                // Right logo
                cell(
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        data: rightLogoBase64,
                        type: "jpg",                    // ← REQUIRED (was missing)
                        transformation: { width: 70, height: 60 },
                      }),
                    ],
                  }),
                  H_RIGHT,
                  { borders: { ...BORDERS_ALL, left: BORDER_NONE } }
                ),
              ],
            }),
          ],
        }),

        // Spacer
        new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 160 } }),

        // ══════════════════════════════════════════════════════
        // STUDENT INFO TABLE
        // ══════════════════════════════════════════════════════
        new Table({
           alignment: AlignmentType.CENTER,
          width: { size: PAGE_W, type: WidthType.DXA },
          columnWidths: [INFO_COL, INFO_COL, INFO_COL, INFO_COL], // ← REQUIRED
          borders: BORDERS_ALL,
          rows: [
            new TableRow({
              children: [
                cell(p("Name"),                  INFO_COL),
                cell(p(studentInfo.name, { bold: true }), INFO_COL),
                cell(p("Reg No"),                INFO_COL),
                cell(p(studentInfo.rollNo, { bold: true }), INFO_COL),
              ],
            }),
            new TableRow({
              children: [
                cell(p("Course"),                INFO_COL),
                cell(p(selection.course[0], { bold: true }), INFO_COL),
                cell(p("Sem"),                   INFO_COL),
                cell(p(selection.sem[0], { bold: true }),   INFO_COL),
              ],
            }),
            new TableRow({
              children: [
                cell(p("College Name and Code"),                INFO_COL),
                cell(p(studentInfo.college, { bold: true }), INFO_COL),
                cell(p("Exam Month and Year"),                   INFO_COL),
                cell(p(studentInfo.examMonthYear, { bold: true }),   INFO_COL),
              ],
            }),
          ],
        }),

        // Spacer
        new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 160 } }),

        // ══════════════════════════════════════════════════════
        // MARKS TABLE
        // ══════════════════════════════════════════════════════
        new Table({
          width: { size: PAGE_W, type: WidthType.DXA },
          columnWidths: [           // ← REQUIRED — must sum to PAGE_W
            M_SUBJECT, M_CODE,
            M_REST, M_REST, M_REST, M_REST, M_REST,
            M_REST, M_REST, M_REST, M_LAST,
          ],
          borders: BORDERS_ALL,
          rows: [
            // Header
            new TableRow({
              children: [
                cell(p("Subject",        { center: true, bold: true, size:18 }), M_SUBJECT),
                cell(p("Code",           { center: true, bold: true, size:18 }), M_CODE),
                cell(p("Max Marks",      { center: true, bold: true, size:18 }), M_REST),
                cell(p("Min Marks",      { center: true, bold: true, size:18 }), M_REST),
                cell(p("Sec Marks",      { center: true, bold: true, size:18 }), M_REST),
                cell(p("IA Marks",       { center: true, bold: true, size:18 }), M_REST),
                cell(p("Obtained Marks", { center: true, bold: true, size:18 }), M_REST),
                cell(p("Credits",        { center: true, bold: true, size:18 }), M_REST),
                cell(p("Grade Points",   { center: true, bold: true, size:18 }), M_REST),
                cell(p("Credit Points",  { center: true, bold: true, size:18 }), M_REST),
                cell(p("Grade",          { center: true, bold: true, size:18 }), M_LAST),
              ],
            }),

            // Subject rows
            ...semesterData.subjects.map(sub => new TableRow({
              children: [
                cell(p(sub.name,         { center: true, bold: true, size:18 }), M_SUBJECT),
                cell(p(sub.code,         { center: true, bold: true, size:18 }), M_CODE),
                cell(p(sub.maxMarks),    M_REST),
                cell(p(sub.minMarks),    M_REST),
                cell(p(sub.secMarks),    M_REST),
                cell(p(sub.iaMarks),     M_REST),
                cell(p(sub.obtMarks),    M_REST),
                cell(p(sub.credits),     M_REST),
                cell(p(sub.grade),       M_REST),
                cell(p(sub.creditPoints),M_REST),
                cell(p(sub.letterGrade), M_LAST),
              ],
            })),

            // Totals row
            new TableRow({
              children: [
                cell(p("Total", { center: true, bold: true}), M_SUBJECT + M_CODE + M_REST * 4, { span: 6 }),
                cell(p(semesterData.totals.totalMarks,       { bold: true }), M_REST),
                cell(p(semesterData.totals.totalCredits,     { bold: true }), M_REST),
                cell(p(""),                                                   M_REST),
                cell(p(semesterData.totals.totalCreditPoints,{ bold: true }), M_REST),
                cell(p(""),                                                   M_LAST),
              ],
            }),
          ],
        }),

        // Spacer
        new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 200 } }),

        // SGPA
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 400 },
          children: [
            new TextRun({ text: `SGPA: ${semesterData.totals.sgpa}`, bold: true, size: 24 }),
          ],
        }),
      ],
    }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${studentInfo.rollNo}_MarksCard.docx`);
  });
};