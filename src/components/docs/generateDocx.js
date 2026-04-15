import { 
  Document, Packer, Paragraph, Table, TableCell, TableRow, 
  WidthType, AlignmentType, BorderStyle, TextRun, ImageRun 
} from "docx";
import { saveAs } from "file-saver";
import leftLogo from "../../assets/leftLogo.jpg";
import rightLogo from "../../assets/rightLogo.jpg";
 

// Helper to convert image URL to Base64 (Required for docx library)
const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
  });
};

export const generateUniversityDoc = async (studentInfo, selection, semesterData) => {
  // Replace these with your actual local logo paths
  const leftLogoUrl = leftLogo; 
  const rightLogoUrl = rightLogo;

  const leftLogoBase64 = await getBase64FromUrl(leftLogoUrl);
  const rightLogoBase64 = await getBase64FromUrl(rightLogoUrl);

  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
      },
      children: [
        // --- HEADER TABLE ---
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2 },
            bottom: { style: BorderStyle.SINGLE, size: 2 },
            left: { style: BorderStyle.SINGLE, size: 2 },
            right: { style: BorderStyle.SINGLE, size: 2 },
          },
          rows: [
            new TableRow({
              children: [
                // Column 1: University Logo
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: leftLogoBase64,
                          transformation: { width: 65, height: 65 },
                        }),
                      ],
                    }),
                  ],
                }),

                // Column 2: Center Text [cite: 1, 2]
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  verticalAlign: AlignmentType.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "ಗುಲಬರ್ಗ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಕಲಬುರಗಿ", bold: true, size: 20 })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "GULBARGA UNIVERSITY", bold: true, size: 26 })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: '"JNANA GANGA" KALABURAGI-585106, KARNATAKA, INDIA', size: 15 })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text: "EXAMINATION BRANCH", bold: true, size: 18 })],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ 
                          text: "Phone: 08472-263203 Fax: 08472-263203    E-mail: regegug@rediffmail.com", 
                          size: 11 
                        }),
                      ],
                    }),
                  ],
                }),

                // Column 3: Accreditation Logo (KSURF/NAAC)
                new TableCell({
                  width: { size: 15, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: rightLogoBase64,
                          transformation: { width: 70, height: 60 },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // --- STUDENT INFO SECTION ---
        // new Paragraph({ text: "", spacing: { before: 200 } }), // Spacer
        // new Paragraph({
        //   children: [
        //     new TextRun({ text: `Name: ${studentInfo.name}`, bold: true, break: 1 }),
        //     new TextRun({ text: `Reg No: ${studentInfo.rollNo}`, bold: true, break: 1 }),
        //     new TextRun({ text: `Course: ${selection.course[0]}`, break: 1 }),
        //     new TextRun({ text: `Semester: ${selection.sem[0]}`, break: 1 }),
        //   ],
        // }),

        // --- MARKS TABLE ---
        // new Table({
        //   width: { size: 100, type: WidthType.PERCENTAGE },
        //   spacing: { before: 300 },
        //   rows: [
        //     new TableRow({
        //       children: [
        //         new TableCell({ children: [new Paragraph({ text: "Subject", bold: true })] }),
        //         new TableCell({ children: [new Paragraph({ text: "Max", bold: true })] }),
        //         new TableCell({ children: [new Paragraph({ text: "Obtained", bold: true })] }),
        //         new TableCell({ children: [new Paragraph({ text: "Credits", bold: true })] }),
        //         new TableCell({ children: [new Paragraph({ text: "GP", bold: true })] }),
        //       ],
        //     }),
        //     ...semesterData.subjects.map(sub => new TableRow({
        //       children: [
        //         new TableCell({ children: [new Paragraph(sub.name || "")] }),
        //         new TableCell({ children: [new Paragraph(sub.maxMarks?.toString() || "")] }),
        //         new TableCell({ children: [new Paragraph(sub.obtMarks?.toString() || "")] }),
        //         new TableCell({ children: [new Paragraph(sub.credits?.toString() || "")] }),
        //         new TableCell({ children: [new Paragraph(sub.grade?.toString() || "")] }),
        //       ],
        //     })),
        //   ],
        // }),

        // --- TOTALS FOOTER ---
        // new Paragraph({
        //   alignment: AlignmentType.RIGHT,
        //   spacing: { before: 400 },
        //   children: [
        //     new TextRun({ text: `SGPA: ${semesterData.totals.totalGradePoints}`, bold: true, size: 24 }),
        //   ],
        // }),
      ],
    }],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${studentInfo.rollNo}_MarksCard.docx`);
  });
};