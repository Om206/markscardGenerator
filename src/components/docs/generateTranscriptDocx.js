import { 
  Document, Packer, Paragraph, Table, TableCell, TableRow, 
  WidthType, AlignmentType, BorderStyle, TextRun, ImageRun 
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
    reader.onloadend = () => resolve(reader.result);
  });
};

export const generateTranscript = async (studentInfo, selection, semesterData) => {
    const leftLogoUrl = leftLogo;
    const rightLogoUrl = rightLogo;
    const leftLogoBase64 = await getBase64FromUrl(leftLogoUrl);
    const rightLogoBase64 = await getBase64FromUrl(rightLogoUrl);

    const doc = new Document({
        sections:[{
            properties: {
        page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } }
      },
      children: [
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
                   borders:{
            right: { style: BorderStyle.NONE, size: 2 },},
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
                   borders:{ 
            
            left: { style: BorderStyle.NONE, size: 2 },
            right: { style: BorderStyle.NONE, size: 2 },},
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
                          size: 13 
                        }),
                      ],
                    }),
                  ],
                }),

                // Column 3: Accreditation Logo (KSURF/NAAC)
                new TableCell({
                   borders:{
            left: { style: BorderStyle.NONE, size: 2 },},
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

        new Paragraph({text:"", spacing:{before:200}}),
        new Table({
          width:{size: 100, type: WidthType.PERCENTAGE},
          spacing:{before: 300},
          rows:[
            new TableRow({
              children:[
                new TableCell({children: [new Paragraph({text:"Name"})],width:{size:10, type: WidthType.PERCENTAGE}}),
                new TableCell({children: [new Paragraph({text:`${studentInfo.name}`,bold:true})]}),
                new TableCell({children: [new Paragraph({text:"Reg No"})],width:{size:10, type: WidthType.PERCENTAGE}}),
                new TableCell({children: [new Paragraph({text:`${studentInfo.rollNo}`,bold:true})]})
              ]
            }),
            new TableRow({
              children:[
                new TableCell({children: [new Paragraph({text:"Course"})]}),
                new TableCell({children: [new Paragraph({text:`${selection.course[0]}`,bold:true})]}),
                new TableCell({children: [new Paragraph({text:"Sem"})]}),
                new TableCell({children: [new Paragraph({text:`${selection.sem[0]}`,bold:true})]})
              ]
            }),
          ]
        }),
        new Paragraph({ text: "", spacing: { before: 200 } }),
        
      ]
        }]
    })
}