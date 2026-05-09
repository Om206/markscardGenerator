import {
  Document, Packer, Paragraph, Table, TableCell, TableRow,
  WidthType, AlignmentType, BorderStyle, TextRun, ImageRun,
  VerticalAlign, ShadingType,
} from "docx";
import { saveAs } from "file-saver";
import leftLogo from "../../assets/leftLogo.jpg";
import rightLogo from "../../assets/rightLogo.jpg";

// ─── Base64 helper ─────────────────────────────────────────────────────────────
const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
  });
};

// ─── DXA layout ───────────────────────────────────────────────────────────────
// A4 = 11906 wide. Margins 720 each side → content = 10466 DXA
const CM = (cm) => Math.round(cm * 567);
const PAGE_W = 10466;
const GAP    = 200; // space between two semester blocks
const SEM_W  = Math.floor((PAGE_W - GAP) / 2); // each semester block width

// ─── Border helpers ────────────────────────────────────────────────────────────
const B     = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const BTHIN = { style: BorderStyle.SINGLE, size: 2, color: "000000" };
const BNONE = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };

const BORDERS_ALL  = { top: B, bottom: B, left: B, right: B, insideH: BTHIN, insideV: BTHIN };
const BORDERS_NONE = { top: BNONE, bottom: BNONE, left: BNONE, right: BNONE };

const CELL_M = { top: 60, bottom: 60, left: 100, right: 100 };

// ─── Helpers ───────────────────────────────────────────────────────────────────
const run = (text, opts = {}) =>{
    const isKannada = /[\u0C80-\u0CFF]/.test(String(text));
  
    return new TextRun({
    text: String(text ?? ""),
    bold: opts.bold,
    size: opts.size || 16,
    font: isKannada? "Nirmala UI" : "Times New Roman",
  });
  }

const para = (text, opts = {}) =>
  new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER
             : opts.right  ? AlignmentType.RIGHT
             : AlignmentType.LEFT,
    children: Array.isArray(text) ? text : [run(text, opts)],
  });

const tc = (content, width, opts = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: CELL_M,
    columnSpan: opts.span,
    verticalAlign: VerticalAlign.CENTER,
    borders: opts.borders || BORDERS_ALL,
    shading: opts.shade ? { fill: opts.shade, type: ShadingType.CLEAR } : undefined,
    children: Array.isArray(content) ? content : [para(content, opts)],
  });

// ─── Semester column widths (11 cols, must sum exactly to SEM_W) ──────────────
// Cols: # | Subject | Max | Min | IA | Sec | Obt | Credits | Grade Pts | Credit Pts | Letter Grade
// Use proportions of SEM_W so they always fit regardless of page/margin settings
const buildColWidths = () => {
  // Proportions (must sum to 1.0)
  const ratios = [0.04, 0.52 , 0.08, 0.09, 0.09, 0.09, 0.09, 0.10];
  const cols = ratios.map((r, i) =>
    i < ratios.length - 1
      ? Math.floor(SEM_W * r)
      : SEM_W - ratios.slice(0, -1).reduce((sum, r2) => sum + Math.floor(SEM_W * r2), 0) // last col gets remainder
  );
  return cols;
};
const SC = buildColWidths();

// ─── Build one semester table ─────────────────────────────────────────────────
function buildSemesterBlock(semKey, semData) {
  const { subjects, totals } = semData;
  const NUM_COLS = 8;
  const rows = [];

  // Title row (merged across all cols)
  rows.push(
    new TableRow({
      children: [
        tc(
          [para(semKey.toUpperCase(), { center: true, bold: true, size: 18 })],
          SEM_W,
          { span: NUM_COLS, borders: BORDERS_ALL, shade: "D9D9D9" }
        ),
      ],
    })
  );

  // Header row
  rows.push(
    new TableRow({
      children: [
        tc("",            SC[0],  { center: true, bold: true }),
        tc("Subject",     SC[1],  { center: true, bold: true }),
        tc("Max",         SC[2],  { center: true, bold: true }),
        // tc("Min",         SC[3],  { center: true, bold: true }),
        // tc("IA",          SC[4],  { center: true, bold: true }),
        // tc("Sec",         SC[5],  { center: true, bold: true }),
        tc("Obt",         SC[3],  { center: true, bold: true }),
        tc("Credits",     SC[4],  { center: true, bold: true }),
        tc("Grade Pts",   SC[5],  { center: true, bold: true }),
        tc("Credit Pts",  SC[6],  { center: true, bold: true }),
        tc("Grade",       SC[7], { center: true, bold: true }),
      ],
    })
  );

  // Subject rows
  subjects.forEach((sub, i) => {
    rows.push(
      new TableRow({
        children: [
          tc(String(i + 1),            SC[0],  { center: true }),
          tc(sub.name,                 SC[1]),
          tc(String(sub.maxMarks),     SC[2],  { center: true }),
        //   tc(String(sub.minMarks),     SC[3],  { center: true }),
        //   tc(String(sub.iaMarks),      SC[4],  { center: true }),
        //   tc(String(sub.secMarks),     SC[5],  { center: true }),
          tc(String(sub.obtMarks),     SC[3],  { center: true }),
          tc(String(sub.credits),      SC[4],  { center: true }),
          tc(String(sub.grade),        SC[5],  { center: true }),
          tc(String(sub.creditPoints), SC[6],  { center: true }),
          tc(String(sub.letterGrade),  SC[7], { center: true }),
        ],
      })
    );
  });

  // Totals row — first 6 cols merged, then values
  const totalSpanWidth = SC.slice(0, 6).reduce((a, b) => a + b, 0);
  rows.push(
    new TableRow({
      children: [
        tc([para("Total", { center: true, bold: true })], totalSpanWidth, { span: 3, shade: "F2F2F2" }),
        tc(String(totals.totalMarks),        SC[3],  { center: true, bold: true, shade: "F2F2F2" }),
        tc(String(totals.totalCredits),      SC[4],  { center: true, bold: true, shade: "F2F2F2" }),
        tc("",                               SC[5],  { shade: "F2F2F2" }),
        tc(String(totals.totalCreditPoints), SC[6],  { center: true, bold: true, shade: "F2F2F2" }),
        tc("",                               SC[7], { shade: "F2F2F2" }),
      ],
    })
  );

  // SGPA row
  rows.push(
    new TableRow({
      children: [
        tc(
          [para([run("SGPA: ", { bold: true, size: 16 }), run(String(totals.sgpa), { bold: true, size: 16 })], { right: true })],
          SEM_W,
          { span: NUM_COLS, borders: { ...BORDERS_ALL, top: BTHIN } }
        ),
      ],
    })
  );

  return new Table({
    width: { size: SEM_W, type: WidthType.DXA },
    columnWidths: SC,       // critical: must sum to SEM_W
    borders: BORDERS_ALL,
    rows,
  });
}

// ─── Place two semester blocks side by side ───────────────────────────────────
// Uses an invisible outer table as a layout container.
// Word renders blocks vertically by default — the only way to go horizontal
// is to put things inside cells of the same row.
function buildSemesterPair(leftKey, leftData, rightKey, rightData) {
  const outerCols = rightKey
    ? [SEM_W, GAP, SEM_W]  // left block | gap spacer | right block
    : [SEM_W];              // only one block (odd number of semesters)

  const cells = [
    // Left semester
    new TableCell({
      width: { size: SEM_W, type: WidthType.DXA },
      borders: BORDERS_NONE,  // invisible
      children: [buildSemesterBlock(leftKey, leftData)],
    }),
  ];

  if (rightKey) {
    // Gap spacer
    cells.push(
      new TableCell({
        width: { size: GAP, type: WidthType.DXA },
        borders: BORDERS_NONE,
        children: [para("")],
      })
    );
    // Right semester
    cells.push(
      new TableCell({
        width: { size: SEM_W, type: WidthType.DXA },
        borders: BORDERS_NONE,
        children: [buildSemesterBlock(rightKey, rightData)],
      })
    );
  }

  return new Table({
    width: { size: PAGE_W, type: WidthType.DXA },
    columnWidths: outerCols, // critical: must sum to PAGE_W
    borders: BORDERS_NONE,   // invisible wrapper table
    rows: [new TableRow({ children: cells })],
  });
}

// ─── Main export ───────────────────────────────────────────────────────────────
export const generateTranscriptSideBySideDoc = async (studentInfo, selection, semesterData,cgpa) => {
  const leftLogoBase64  = await getBase64FromUrl(leftLogo);
  const rightLogoBase64 = await getBase64FromUrl(rightLogo);

  // Pair up semester keys for side-by-side layout
  const semKeys  = Object.keys(semesterData);
  const semPairs = [];
  for (let i = 0; i < semKeys.length; i += 2) {
    semPairs.push([semKeys[i], semKeys[i + 1] || null]);
  }

  // Header column widths
  const H_L = Math.round(PAGE_W * 0.15);
  const H_M = Math.round(PAGE_W * 0.70);
  const H_R = PAGE_W - H_L - H_M;

  const children = [

    // ══ HEADER ════════════════════════════════════════════════════════════════
    new Table({
      width: { size: PAGE_W, type: WidthType.DXA },
      columnWidths: [H_L, H_M, H_R],
      borders: BORDERS_ALL,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: H_L, type: WidthType.DXA },
              margins: CELL_M,
              verticalAlign: VerticalAlign.CENTER,
              borders: { ...BORDERS_ALL, right: BNONE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new ImageRun({ data: leftLogoBase64, type: "jpg", transformation: { width: 65, height: 65 } })],
                }),
              ],
            }),
            new TableCell({
              width: { size: H_M, type: WidthType.DXA },
              margins: CELL_M,
              verticalAlign: VerticalAlign.CENTER,
              borders: { ...BORDERS_ALL, left: BNONE, right: BNONE },
              children: [
                para("ಗುಲಬರ್ಗ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಕಲಬುರಗಿ",  { center: true, bold: true, size: 20 }),
                para("GULBARGA UNIVERSITY",               { center: true, bold: true, size: 26 }),
                para('"JNANA GANGA" KALABURAGI-585106, KARNATAKA, INDIA', { center: true, size: 17 }),
                para("EXAMINATION BRANCH",                { center: true, bold: true, size: 20 }),
                para("Phone: 08472-263203  Fax: 08472-263203    E-mail: regegug@rediffmail.com", { center: true, size: 14 }),
              ],
            }),
            new TableCell({
              width: { size: H_R, type: WidthType.DXA },
              margins: CELL_M,
              verticalAlign: VerticalAlign.CENTER,
              borders: { ...BORDERS_ALL, left: BNONE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new ImageRun({ data: rightLogoBase64, type: "jpg", transformation: { width: 70, height: 65 } })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ══ STUDENT INFO ══════════════════════════════════════════════════════════
    new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 160 } }),
    new Table({
      width: { size: PAGE_W, type: WidthType.DXA },
      columnWidths: [Math.floor(PAGE_W / 2), PAGE_W - Math.floor(PAGE_W / 2)],
      borders: BORDERS_NONE,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: CM(2.8), type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: [
                para([run("Name:", { size: 18 })]),
                para([run("Course:", { size: 18 })]),
                para([run("College:", { size: 18 })]),
                para([run("Duration of Course:", { size: 18 })]),
              ],
            }),
            new TableCell({
              width: { size:CM(9), type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: [
                para([ run(studentInfo.name, { bold: true, size: 18 })]),
                para([ run(selection.course[0], { bold: true, size: 18 })]),
                para([run(studentInfo.college, { bold: true, size: 18 })]),
                para([ run(studentInfo.durationOfCourse, { bold: true, size: 18 })]),
              ],
            }),
            new TableCell({
              width: { size: CM(3.1), type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: [
                para([run("Reg No:", { size: 18 })]),
                para([run("Year of Passing:", { size: 18 })]),
                para([run("Medium of Instructuin:", { size: 18 })]),
              ],
            }),
            new TableCell({
              width: { size:  CM(3.14), type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: [
                para([ run(studentInfo.rollNo, { bold: true, size: 18 })]),
                para([ run(studentInfo.examMonthYear, { bold: true, size: 18 })]),
                para([ run(studentInfo.mediumOfInst, { bold: true, size: 18 })]),
              ],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 160 } }),

    // ══ SEMESTER PAIRS (side by side) ═════════════════════════════════════════
    ...semPairs.flatMap(([lKey, rKey], idx) => [
      buildSemesterPair(
        lKey, semesterData[lKey],
        rKey, rKey ? semesterData[rKey] : null
      ),
      ...(idx < semPairs.length - 1
        ? [new Paragraph({ children: [new TextRun({ text: "" })], spacing: { before: 160 } })]
        : []
      ),
    ]),
,   

    para([run("CGPA: ",{size:20}),run(cgpa,{bold:true,size:20}),run("/10",{size:20})]),
    // ══ FOOTER ════════════════════════════════════════════════════════════════
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 400 },
      children: [new TextRun({ text: "REGISTRAR (EVALUATION)", bold: true, size: 20, font: "Times New Roman" })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: "GULBARGA UNIVERSITY, KALABURAGI", bold: true, size: 20, font: "Times New Roman" })],
    }),
  ];

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${studentInfo.rollNo}_MarksCard.docx`);
  });
};