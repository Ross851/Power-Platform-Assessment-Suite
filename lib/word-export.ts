import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  Footer,
  Header,
} from "docx"
import { saveAs } from "file-saver"
import type { Project, Question } from "./types"
import { format } from "date-fns"

// --- Bytes Software Services Branding ---
const BYTES_BLUE = "003087" // Bytes brand blue
const BYTES_ACCENT = "00A3E0" // Bytes accent color
const BYTES_GREY = "6D6E71" // Bytes grey

// --- Helper Functions for Styling ---
const createBytesHeader = () =>
  new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: "BYTES SOFTWARE SERVICES LIMITED",
            bold: true,
            color: BYTES_BLUE,
            size: 20,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Power Platform Assessment Suite",
            color: BYTES_GREY,
            size: 18,
          }),
        ],
        alignment: AlignmentType.RIGHT,
      }),
    ],
  })

const createBytesFooter = () =>
  new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: "© 2026 Bytes Software Services Limited | Confidential",
            size: 16,
            color: BYTES_GREY,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
      }),
    ],
  })

const createHeading = (text: string, level = HeadingLevel.HEADING_1) =>
  new Paragraph({ 
    heading: level, 
    children: [new TextRun({ text, bold: true, color: BYTES_BLUE, size: level === HeadingLevel.HEADING_1 ? 32 : 28 })] 
  })

const createSubHeading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, color: BYTES_ACCENT, size: 24 })],
    spacing: { before: 300, after: 200 },
  })

const createParagraph = (text: string) => new Paragraph({ text })

const createBullet = (text: string) => new Paragraph({ text, bullet: { level: 0 } })

const createCell = (text: string, bold = false) =>
  new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold })] })],
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  })

const createStyledTable = (rows: TableRow[]) =>
  new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: BYTES_BLUE },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: BYTES_BLUE },
      left: { style: BorderStyle.SINGLE, size: 1, color: BYTES_GREY },
      right: { style: BorderStyle.SINGLE, size: 1, color: BYTES_GREY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    },
  })

// --- Client-Facing C-Suite Document Generator ---
export const exportToClientWord = async (project: Project) => {
  const highPriorityAreas = getHighPriorityAreas(project)

  const doc = new Document({
    sections: [
      {
        headers: {
          default: createBytesHeader(),
        },
        footers: {
          default: createBytesFooter(),
        },
        children: [
          createHeading(`Power Platform Assessment: Executive Summary`),
          createSubHeading(project.name),
          createParagraph(`Date: ${format(new Date(), "dd MMMM yyyy")}`),
          ...(project.assessmentMetadata ? [
            createParagraph(`Assessed by: ${project.assessmentMetadata.assessorName}${project.assessmentMetadata.assessorRole ? ` (${project.assessmentMetadata.assessorRole})` : ''}`),
            ...(project.assessmentMetadata.assessorEmail ? [createParagraph(`Contact: ${project.assessmentMetadata.assessorEmail}`)] : []),
          ] : []),
          new Paragraph({ text: "" }), // Spacer

          createSubHeading("1. Key Findings & Strategic Recommendations"),
          createParagraph(
            "This assessment has identified several key areas for improvement that will enhance security, streamline governance, and unlock greater value from your Power Platform investment. The following recommendations are prioritized based on business impact and risk mitigation.",
          ),
          ...highPriorityAreas.slice(0, 5).flatMap((area) => [
            new Paragraph({
              children: [
                new TextRun({ text: `Recommendation for ${area.standardName}: `, bold: true }),
                new TextRun(`Address critical gaps identified in '${area.text || "overall standard"}'.`),
              ],
            }),
            createBullet(
              `Impact: Mitigates ${area.ragStatus === "red" ? "high" : "medium"} risk related to ${area.category}.`,
            ),
            createBullet(`Assigned Owner (Recommended): ${area.riskOwner || "To be assigned"}`),
            new Paragraph({ text: "" }),
          ]),

          createSubHeading("2. High-Priority Risk Register"),
          createParagraph(
            "The following table outlines the most critical risks identified during the assessment that require immediate attention.",
          ),
          createStyledTable([
            new TableRow({
              children: [
                createCell("Area", true),
                createCell("Risk / Issue", true),
                createCell("Status", true),
                createCell("Owner", true),
              ],
              tableHeader: true,
            }),
            ...highPriorityAreas.map(
              (area) =>
                new TableRow({
                  children: [
                    createCell(area.standardName),
                    createCell(area.text || "Overall standard weakness"),
                    createCell((area.ragStatus || "grey").toUpperCase()),
                    createCell(area.riskOwner || "TBA"),
                  ],
                }),
            ),
          ]),
          new Paragraph({ text: "" }),

          createSubHeading("3. Strategic Roadmap Overview"),
          createParagraph(
            "We recommend a phased approach to address these findings, focusing on foundational improvements first, followed by optimization and innovation.",
          ),
          createStyledTable([
            new TableRow({
              children: [createCell("Phase", true), createCell("Timeline", true), createCell("Focus Areas", true)],
              tableHeader: true,
            }),
            new TableRow({
              children: [
                createCell("Phase 1: Foundation"),
                createCell("0-3 Months"),
                createCell("Address all 'Red' status risks. Solidify DLP policies and environment strategy."),
              ],
            }),
            new TableRow({
              children: [
                createCell("Phase 2: Optimization"),
                createCell("3-6 Months"),
                createCell("Remediate 'Amber' status risks. Implement ALM automation and mature CoE processes."),
              ],
            }),
            new TableRow({
              children: [
                createCell("Phase 3: Innovation"),
                createCell("6-12 Months"),
                createCell(
                  "Focus on technical debt reduction, modernization of custom apps, and expanding Responsible AI governance.",
                ),
              ],
            }),
          ]),
          new Paragraph({ text: "" }),

          createSubHeading("4. Next Steps"),
          createParagraph(
            "We recommend a follow-up workshop to review these findings in detail and finalize the implementation plan and resource allocation. The accompanying technical document provides the detailed instructions for your development team.",
          ),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${project.name}_Executive_Summary.docx`)
}

// --- Technical Developer Document Generator ---
export const exportToTechnicalWord = async (project: Project) => {
  const allGaps = getAllGaps(project)

  const doc = new Document({
    sections: [
      {
        headers: {
          default: createBytesHeader(),
        },
        footers: {
          default: createBytesFooter(),
        },
        children: [
          createHeading("Power Platform Assessment: Technical Implementation Guide"),
          createSubHeading(project.name),
          createParagraph(`Generated on: ${format(new Date(), "dd MMMM yyyy")}`),
          ...(project.assessmentMetadata ? [
            createParagraph(`Assessed by: ${project.assessmentMetadata.assessorName}${project.assessmentMetadata.assessorRole ? ` (${project.assessmentMetadata.assessorRole})` : ''}`),
            ...(project.assessmentMetadata.assessorEmail ? [createParagraph(`Contact: ${project.assessmentMetadata.assessorEmail}`)] : []),
          ] : []),
          new Paragraph({ text: "" }),

          createSubHeading("1. Introduction"),
          createParagraph(
            "This document provides detailed, actionable instructions for the development and administration teams to remediate the findings from the Power Platform assessment. Each section corresponds to an identified gap.",
          ),
          new Paragraph({ text: "" }),

          ...allGaps.flatMap((gap) => [
            createSubHeading(`Gap: ${gap.id} - ${gap.text}`),
            createStyledTable([
              new TableRow({
                children: [createCell("Standard", true), createCell(gap.standardName)],
              }),
              new TableRow({
                children: [createCell("Category", true), createCell(gap.category)],
              }),
              new TableRow({
                children: [createCell("Status", true), createCell((gap.ragStatus || "grey").toUpperCase())],
              }),
              new TableRow({
                children: [createCell("Current Answer", true), createCell(JSON.stringify(gap.answer) || "N/A")],
              }),
              new TableRow({
                children: [createCell("Evidence Notes", true), createCell(gap.evidenceNotes || "None")],
              }),
            ]),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Best Practice:", bold: true })] }),
            createParagraph(
              typeof gap.bestPractice === "string" 
                ? gap.bestPractice 
                : gap.bestPractice?.description || "N/A"
            ),
            new Paragraph({ text: "" }),
            
            // New Content: AI Suggestion
            ...(gap.aiSuggestion ? [
              new Paragraph({ children: [new TextRun({ text: "AI Insight:", bold: true, color: "2c5282" })] }), // Dark blue for AI
              createParagraph(gap.aiSuggestion),
              new Paragraph({ text: "" }),
            ] : []),

            // New Content: Guidance
            ...(gap.guidance ? [
              new Paragraph({ children: [new TextRun({ text: "Microsoft Guidance:", bold: true })] }),
              createParagraph(gap.guidance),
              new Paragraph({ text: "" }),
            ] : []),

            new Paragraph({ children: [new TextRun({ text: "Implementation Steps:", bold: true })] }),
            ...(typeof gap.bestPractice !== "string" && gap.bestPractice?.suggestedActions 
              ? gap.bestPractice.suggestedActions.map((action) => createBullet(action)) 
              : [createParagraph("Refer to best practice guidance above.")]
            ),
            new Paragraph({
              children: [
                new TextRun({ text: "Reference: ", bold: true }),
                new TextRun({
                  text: typeof gap.bestPractice !== "string" && gap.bestPractice?.link 
                    ? gap.bestPractice.link 
                    : "No specific link available",
                  style: "Hyperlink",
                }),
              ],
            }),
            new Paragraph({ text: "" }),
            
            // Developer Documentation Section
            ...(gap.codeSnippets || gap.developerFeedback || gap.developerRecommendations ? [
              new Paragraph({ children: [new TextRun({ text: "Developer Documentation:", bold: true })] }),
              ...(gap.codeSnippets ? [
                new Paragraph({ children: [new TextRun({ text: "Code Snippets:", bold: true })] }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: gap.codeSnippets,
                      font: "Consolas",
                      size: 20,
                    }),
                  ],
                }),
                new Paragraph({ text: "" }),
              ] : []),
              ...(gap.developerFeedback ? [
                new Paragraph({ children: [new TextRun({ text: "Developer Findings:", bold: true })] }),
                createParagraph(gap.developerFeedback),
                new Paragraph({ text: "" }),
              ] : []),
              ...(gap.developerRecommendations ? [
                new Paragraph({ children: [new TextRun({ text: "Developer Recommendations:", bold: true })] }),
                createParagraph(gap.developerRecommendations),
                new Paragraph({ text: "" }),
              ] : []),
            ] : []),
          ]),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${project.name}_Technical_Implementation_Guide.docx`)
}

// --- Data Helper Functions ---
const getHighPriorityAreas = (project: Project) => {
  const areas: Array<Question & { standardName: string }> = []
  project.standards.forEach((std) => {
    std.questions.forEach((q) => {
      if (q.ragStatus === "red" || q.ragStatus === "amber") {
        areas.push({ ...q, standardName: std.name })
      }
    })
  })
  return areas.sort((a, b) => (a.ragStatus === "red" && b.ragStatus !== "red" ? -1 : 1))
}

const getAllGaps = (project: Project) => {
  const gaps: Array<Question & { standardName: string }> = []
  project.standards.forEach((std) => {
    std.questions.forEach((q) => {
      if (q.ragStatus === "red" || q.ragStatus === "amber") {
        gaps.push({ ...q, standardName: std.name })
      }
    })
  })
  return gaps
}
