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
  PageBreak,
  ShadingType,
} from "docx"
import { saveAs } from "file-saver"
import type { Project, AssessmentStandard, Question, RAGStatus } from "./types"
import { format } from "date-fns"

// --- Bytes Software Services Branding ---
const BYTES_BLUE = "003087"
const BYTES_ACCENT = "00A3E0"
const BYTES_GREY = "6D6E71"
const RAG_RED = "DC2626"
const RAG_AMBER = "F59E0B"
const RAG_GREEN = "16A34A"

// --- Maturity Level Definitions ---
const MATURITY_LEVELS = [
  { level: 1, name: "Initial", min: 0, max: 1, description: "Ad-hoc processes, no formal governance. High risk of shadow IT and security vulnerabilities." },
  { level: 2, name: "Developing", min: 1, max: 2, description: "Some processes emerging but inconsistent. Basic policies exist but enforcement is limited." },
  { level: 3, name: "Defined", min: 2, max: 3, description: "Documented processes and policies in place. Governance structures established but not fully mature." },
  { level: 4, name: "Managed", min: 3, max: 4, description: "Processes are measured and controlled. Strong governance with regular reviews and improvements." },
  { level: 5, name: "Optimised", min: 4, max: 5, description: "Continuous improvement culture. Industry-leading practices with proactive governance." },
]

const getMaturityLevel = (score: number) => {
  return MATURITY_LEVELS.find(l => score >= l.min && score < l.max) || MATURITY_LEVELS[0]
}

const getMaturityLevelByScore = (score: number) => {
  if (score >= 4) return MATURITY_LEVELS[4]
  if (score >= 3) return MATURITY_LEVELS[3]
  if (score >= 2) return MATURITY_LEVELS[2]
  if (score >= 1) return MATURITY_LEVELS[1]
  return MATURITY_LEVELS[0]
}

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
            text: "Power Platform Baseline Assessment & Justification Report",
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
            text: "© 2026 Bytes Software Services Limited | Confidential | Power Platform Assessment Suite",
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
    children: [new TextRun({ text, bold: true, color: BYTES_BLUE, size: level === HeadingLevel.HEADING_1 ? 32 : 28 })],
    spacing: { before: 400, after: 200 },
  })

const createSubHeading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, color: BYTES_ACCENT, size: 24 })],
    spacing: { before: 300, after: 200 },
  })

const createSubSubHeading = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, color: BYTES_GREY, size: 22 })],
    spacing: { before: 200, after: 150 },
  })

const createParagraph = (text: string, options?: { bold?: boolean; italic?: boolean; color?: string }) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        bold: options?.bold,
        italics: options?.italic,
        color: options?.color,
      }),
    ],
    spacing: { after: 120 },
  })

const createBullet = (text: string, level = 0) =>
  new Paragraph({ text, bullet: { level }, spacing: { after: 80 } })

const createNumberedItem = (text: string, number: number) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${number}. `, bold: true }),
      new TextRun({ text }),
    ],
    spacing: { after: 100 },
  })

const createCell = (text: string, options?: { bold?: boolean; color?: string; shading?: string }) =>
  new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: options?.bold, color: options?.color })] })],
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    shading: options?.shading ? { fill: options.shading, type: ShadingType.CLEAR } : undefined,
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

const getRagColor = (rag: RAGStatus | undefined): string => {
  switch (rag) {
    case "red": return RAG_RED
    case "amber": return RAG_AMBER
    case "green": return RAG_GREEN
    default: return BYTES_GREY
  }
}

const getRagShading = (rag: RAGStatus | undefined): string => {
  switch (rag) {
    case "red": return "FEE2E2"
    case "amber": return "FEF3C7"
    case "green": return "DCFCE7"
    default: return "F3F4F6"
  }
}

// --- Scoring Justification Helpers ---
const getScoreJustification = (question: Question): string => {
  const answer = question.answer
  const type = question.type

  if (answer === undefined || answer === null || String(answer) === "") {
    return "Not assessed - no response provided."
  }

  switch (type) {
    case "boolean":
      return answer === true || answer === "true" || answer === "Yes"
        ? `Positive response indicates this capability or control is in place. This demonstrates adherence to best practice.`
        : `Negative response indicates this capability or control is not currently implemented. This represents a gap requiring attention.`

    case "scale":
      const scaleValue = Number(answer)
      if (scaleValue <= 2) return `Score of ${scaleValue}/5 indicates significant gaps in this area. Immediate improvement recommended.`
      if (scaleValue <= 3) return `Score of ${scaleValue}/5 indicates partial implementation. Further maturation required.`
      if (scaleValue <= 4) return `Score of ${scaleValue}/5 indicates good progress with room for optimisation.`
      return `Score of ${scaleValue}/5 indicates mature implementation aligned with best practices.`

    case "percentage":
      const perc = Number(answer)
      if (perc < 25) return `Coverage of ${perc}% is critically low. Significant investment required.`
      if (perc < 50) return `Coverage of ${perc}% is below acceptable threshold. Priority improvement needed.`
      if (perc < 75) return `Coverage of ${perc}% shows progress but requires further expansion.`
      return `Coverage of ${perc}% demonstrates strong adoption and implementation.`

    case "document-review":
      return question.document?.file
        ? `Documentation provided and reviewed. ${question.document.annotations?.length || 0} annotations recorded.`
        : `No documentation provided for review.`

    default:
      return `Response recorded: "${String(answer).substring(0, 100)}${String(answer).length > 100 ? '...' : ''}"`
  }
}

const getStandardJustification = (standard: AssessmentStandard): string => {
  const score = standard.maturityScore || 0
  const maturity = getMaturityLevelByScore(score)
  const redCount = standard.questions.filter(q => q.ragStatus === "red").length
  const amberCount = standard.questions.filter(q => q.ragStatus === "amber").length
  const greenCount = standard.questions.filter(q => q.ragStatus === "green").length

  let justification = `This standard achieved a maturity score of ${score.toFixed(2)}/5.00, placing it at Maturity Level ${maturity.level} (${maturity.name}). `

  if (redCount > 0) {
    justification += `There are ${redCount} critical gap(s) requiring immediate attention. `
  }
  if (amberCount > 0) {
    justification += `${amberCount} area(s) require improvement. `
  }
  if (greenCount > 0) {
    justification += `${greenCount} area(s) meet or exceed expectations. `
  }

  return justification
}

// --- Calculate Statistics ---
const calculateStats = (project: Project) => {
  let totalQuestions = 0
  let answeredQuestions = 0
  let redCount = 0
  let amberCount = 0
  let greenCount = 0
  let totalWeightedScore = 0
  let totalWeight = 0

  project.standards.forEach(std => {
    std.questions.forEach(q => {
      totalQuestions++
      const hasAnswer = q.answer !== undefined && q.answer !== null && String(q.answer) !== ""
      if (hasAnswer) answeredQuestions++
      if (q.ragStatus === "red") redCount++
      if (q.ragStatus === "amber") amberCount++
      if (q.ragStatus === "green") greenCount++
    })
    if (std.maturityScore !== undefined && (std.completion || 0) > 0) {
      totalWeightedScore += std.maturityScore * std.weight
      totalWeight += std.weight
    }
  })

  const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0
  const completionPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  return {
    totalQuestions,
    answeredQuestions,
    redCount,
    amberCount,
    greenCount,
    overallScore,
    completionPercentage,
    maturityLevel: getMaturityLevelByScore(overallScore),
  }
}

// --- Main Export Function ---
export const exportBaselineJustificationDocument = async (project: Project) => {
  const stats = calculateStats(project)
  const assessmentDate = project.assessmentMetadata?.assessmentDate
    ? format(new Date(project.assessmentMetadata.assessmentDate), "dd MMMM yyyy")
    : format(new Date(), "dd MMMM yyyy")

  const doc = new Document({
    sections: [
      {
        headers: { default: createBytesHeader() },
        footers: { default: createBytesFooter() },
        children: [
          // --- TITLE PAGE ---
          new Paragraph({ text: "", spacing: { after: 1000 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: "POWER PLATFORM",
                bold: true,
                color: BYTES_BLUE,
                size: 56,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Baseline Assessment & Justification Report",
                bold: true,
                color: BYTES_ACCENT,
                size: 40,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [new TextRun({ text: project.name, bold: true, size: 32, color: BYTES_GREY })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Assessment Date: ${assessmentDate}`, size: 24, color: BYTES_GREY })],
            alignment: AlignmentType.CENTER,
          }),
          ...(project.assessmentMetadata ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Assessed by: ${project.assessmentMetadata.assessorName}${project.assessmentMetadata.assessorRole ? ` (${project.assessmentMetadata.assessorRole})` : ""}`,
                  size: 24,
                  color: BYTES_GREY,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ] : []),
          new Paragraph({ text: "", spacing: { after: 1200 } }),

          // Overall Score Box
          createStyledTable([
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: "OVERALL BASELINE SCORE", bold: true, color: "FFFFFF", size: 28 })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                  shading: { fill: BYTES_BLUE, type: ShadingType.CLEAR },
                  margins: { top: 200, bottom: 200 },
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${stats.overallScore.toFixed(2)} / 5.00`,
                          bold: true,
                          size: 72,
                          color: getRagColor(stats.redCount > 0 ? "red" : stats.amberCount > 0 ? "amber" : "green"),
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 200, after: 200 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `Maturity Level ${stats.maturityLevel.level}: ${stats.maturityLevel.name}`,
                          bold: true,
                          size: 32,
                          color: BYTES_GREY,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 200 },
                    }),
                  ],
                  margins: { top: 300, bottom: 300 },
                }),
              ],
            }),
          ]),

          new Paragraph({ children: [new PageBreak()] }),

          // --- EXECUTIVE SUMMARY ---
          createHeading("1. Executive Summary"),
          createParagraph(
            `This report establishes the baseline maturity assessment for ${project.name}'s Microsoft Power Platform implementation. ` +
            `The assessment evaluates ${stats.totalQuestions} criteria across ${project.standards.length} governance standards, ` +
            `aligned with Microsoft's recommended best practices and the Power Platform Centre of Excellence framework.`
          ),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          createSubSubHeading("Assessment Overview"),
          createStyledTable([
            new TableRow({
              children: [
                createCell("Metric", { bold: true, shading: "E5E7EB" }),
                createCell("Value", { bold: true, shading: "E5E7EB" }),
              ],
            }),
            new TableRow({
              children: [createCell("Overall Maturity Score"), createCell(`${stats.overallScore.toFixed(2)} / 5.00`)],
            }),
            new TableRow({
              children: [createCell("Maturity Level"), createCell(`Level ${stats.maturityLevel.level}: ${stats.maturityLevel.name}`)],
            }),
            new TableRow({
              children: [createCell("Assessment Completion"), createCell(`${stats.completionPercentage.toFixed(1)}%`)],
            }),
            new TableRow({
              children: [createCell("Questions Assessed"), createCell(`${stats.answeredQuestions} of ${stats.totalQuestions}`)],
            }),
            new TableRow({
              children: [
                createCell("Critical Gaps (Red)"),
                createCell(String(stats.redCount), { color: RAG_RED, bold: true }),
              ],
            }),
            new TableRow({
              children: [
                createCell("Improvement Areas (Amber)"),
                createCell(String(stats.amberCount), { color: RAG_AMBER, bold: true }),
              ],
            }),
            new TableRow({
              children: [
                createCell("Compliant Areas (Green)"),
                createCell(String(stats.greenCount), { color: RAG_GREEN, bold: true }),
              ],
            }),
          ]),
          new Paragraph({ text: "", spacing: { after: 300 } }),

          createSubSubHeading("Baseline Interpretation"),
          createParagraph(stats.maturityLevel.description),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          // --- METHODOLOGY ---
          createHeading("2. Scoring Methodology"),
          createParagraph(
            "This assessment uses a weighted scoring methodology aligned with Microsoft's Power Platform governance framework. " +
            "Each question contributes to the overall maturity score based on its assigned weight and the response provided."
          ),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          createSubSubHeading("2.1 Maturity Scale"),
          createStyledTable([
            new TableRow({
              children: [
                createCell("Level", { bold: true, shading: "E5E7EB" }),
                createCell("Name", { bold: true, shading: "E5E7EB" }),
                createCell("Score Range", { bold: true, shading: "E5E7EB" }),
                createCell("Description", { bold: true, shading: "E5E7EB" }),
              ],
            }),
            ...MATURITY_LEVELS.map(level =>
              new TableRow({
                children: [
                  createCell(String(level.level)),
                  createCell(level.name, { bold: true }),
                  createCell(`${level.min.toFixed(1)} - ${level.max.toFixed(1)}`),
                  createCell(level.description),
                ],
              })
            ),
          ]),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          createSubSubHeading("2.2 RAG Status Definitions"),
          createStyledTable([
            new TableRow({
              children: [
                createCell("Status", { bold: true, shading: "E5E7EB" }),
                createCell("Meaning", { bold: true, shading: "E5E7EB" }),
                createCell("Action Required", { bold: true, shading: "E5E7EB" }),
              ],
            }),
            new TableRow({
              children: [
                createCell("RED", { bold: true, color: RAG_RED, shading: "FEE2E2" }),
                createCell("Critical gap or high risk identified"),
                createCell("Immediate remediation required within 30 days"),
              ],
            }),
            new TableRow({
              children: [
                createCell("AMBER", { bold: true, color: RAG_AMBER, shading: "FEF3C7" }),
                createCell("Partial implementation or medium risk"),
                createCell("Improvement plan required within 90 days"),
              ],
            }),
            new TableRow({
              children: [
                createCell("GREEN", { bold: true, color: RAG_GREEN, shading: "DCFCE7" }),
                createCell("Meets or exceeds best practice"),
                createCell("Maintain and continuously improve"),
              ],
            }),
            new TableRow({
              children: [
                createCell("GREY", { bold: true, color: BYTES_GREY, shading: "F3F4F6" }),
                createCell("Not yet assessed"),
                createCell("Complete assessment to determine status"),
              ],
            }),
          ]),

          new Paragraph({ children: [new PageBreak()] }),

          // --- STANDARDS BREAKDOWN ---
          createHeading("3. Standards Assessment Summary"),
          createParagraph(
            "The following table summarises the baseline score for each assessment standard. " +
            "Detailed justifications for each standard follow in subsequent sections."
          ),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          createStyledTable([
            new TableRow({
              children: [
                createCell("Standard", { bold: true, shading: "E5E7EB" }),
                createCell("Score", { bold: true, shading: "E5E7EB" }),
                createCell("Level", { bold: true, shading: "E5E7EB" }),
                createCell("RAG", { bold: true, shading: "E5E7EB" }),
                createCell("Completion", { bold: true, shading: "E5E7EB" }),
              ],
            }),
            ...project.standards.map(std => {
              const maturity = getMaturityLevelByScore(std.maturityScore || 0)
              return new TableRow({
                children: [
                  createCell(std.name),
                  createCell(`${(std.maturityScore || 0).toFixed(2)}`),
                  createCell(`L${maturity.level}`),
                  createCell((std.ragStatus || "grey").toUpperCase(), {
                    bold: true,
                    color: getRagColor(std.ragStatus),
                    shading: getRagShading(std.ragStatus),
                  }),
                  createCell(`${(std.completion || 0).toFixed(0)}%`),
                ],
              })
            }),
          ]),

          new Paragraph({ children: [new PageBreak()] }),

          // --- DETAILED STANDARD BREAKDOWNS ---
          createHeading("4. Detailed Standard Justifications"),
          createParagraph(
            "This section provides detailed justification for each standard's baseline score, " +
            "including individual question assessments and evidence-based rationale."
          ),

          ...project.standards.flatMap((std, stdIndex) => {
            const maturity = getMaturityLevelByScore(std.maturityScore || 0)
            const answeredInStandard = std.questions.filter(q =>
              q.answer !== undefined && q.answer !== null && String(q.answer) !== ""
            ).length

            return [
              new Paragraph({ children: [new PageBreak()] }),
              createSubHeading(`4.${stdIndex + 1} ${std.name}`),

              // Standard summary box
              createStyledTable([
                new TableRow({
                  children: [
                    createCell("Maturity Score", { bold: true, shading: "E5E7EB" }),
                    createCell(`${(std.maturityScore || 0).toFixed(2)} / 5.00 (Level ${maturity.level}: ${maturity.name})`),
                  ],
                }),
                new TableRow({
                  children: [
                    createCell("RAG Status", { bold: true, shading: "E5E7EB" }),
                    createCell((std.ragStatus || "grey").toUpperCase(), {
                      bold: true,
                      color: getRagColor(std.ragStatus),
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    createCell("Completion", { bold: true, shading: "E5E7EB" }),
                    createCell(`${answeredInStandard} of ${std.questions.length} questions (${(std.completion || 0).toFixed(0)}%)`),
                  ],
                }),
                new TableRow({
                  children: [
                    createCell("Standard Weight", { bold: true, shading: "E5E7EB" }),
                    createCell(`${std.weight}`),
                  ],
                }),
              ]),
              new Paragraph({ text: "", spacing: { after: 200 } }),

              createSubSubHeading("Justification"),
              createParagraph(getStandardJustification(std)),
              new Paragraph({ text: "", spacing: { after: 200 } }),

              createSubSubHeading("Question-Level Assessment"),
              ...std.questions.flatMap((q, qIndex) => {
                const hasAnswer = q.answer !== undefined && q.answer !== null && String(q.answer) !== ""
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Q${qIndex + 1}: `,
                        bold: true,
                        color: BYTES_BLUE,
                      }),
                      new TextRun({ text: q.text }),
                    ],
                    spacing: { before: 150, after: 80 },
                  }),
                  createStyledTable([
                    new TableRow({
                      children: [
                        createCell("Response", { bold: true, shading: "F9FAFB" }),
                        createCell(hasAnswer ? String(q.answer) : "Not assessed"),
                      ],
                    }),
                    new TableRow({
                      children: [
                        createCell("Score", { bold: true, shading: "F9FAFB" }),
                        createCell(`${q.score || 0} / 5`),
                      ],
                    }),
                    new TableRow({
                      children: [
                        createCell("RAG Status", { bold: true, shading: "F9FAFB" }),
                        createCell((q.ragStatus || "grey").toUpperCase(), {
                          bold: true,
                          color: getRagColor(q.ragStatus),
                          shading: getRagShading(q.ragStatus),
                        }),
                      ],
                    }),
                    new TableRow({
                      children: [
                        createCell("Justification", { bold: true, shading: "F9FAFB" }),
                        createCell(getScoreJustification(q)),
                      ],
                    }),
                    ...(q.evidenceNotes ? [
                      new TableRow({
                        children: [
                          createCell("Evidence", { bold: true, shading: "F9FAFB" }),
                          createCell(q.evidenceNotes),
                        ],
                      }),
                    ] : []),
                    ...(q.riskOwner ? [
                      new TableRow({
                        children: [
                          createCell("Risk Owner", { bold: true, shading: "F9FAFB" }),
                          createCell(q.riskOwner),
                        ],
                      }),
                    ] : []),
                  ]),
                  new Paragraph({ text: "", spacing: { after: 150 } }),
                ]
              }),
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // --- RECOMMENDATIONS ---
          createHeading("5. Baseline Improvement Recommendations"),
          createParagraph(
            "Based on the baseline assessment, the following prioritised recommendations are provided to improve organisational maturity."
          ),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          createSubSubHeading("5.1 Immediate Actions (Red Items)"),
          ...(() => {
            const redItems = project.standards.flatMap(std =>
              std.questions.filter(q => q.ragStatus === "red").map(q => ({ ...q, standardName: std.name }))
            )
            if (redItems.length === 0) {
              return [createParagraph("No critical gaps identified.", { italic: true, color: RAG_GREEN })]
            }
            return redItems.map((item, i) =>
              createNumberedItem(
                `${item.standardName}: ${item.text} - ${item.evidenceNotes || "Requires immediate attention"}`,
                i + 1
              )
            )
          })(),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          createSubSubHeading("5.2 Short-Term Improvements (Amber Items)"),
          ...(() => {
            const amberItems = project.standards.flatMap(std =>
              std.questions.filter(q => q.ragStatus === "amber").map(q => ({ ...q, standardName: std.name }))
            )
            if (amberItems.length === 0) {
              return [createParagraph("No improvement areas identified.", { italic: true, color: RAG_GREEN })]
            }
            return amberItems.slice(0, 10).map((item, i) =>
              createNumberedItem(`${item.standardName}: ${item.text}`, i + 1)
            )
          })(),

          new Paragraph({ children: [new PageBreak()] }),

          // --- SIGN-OFF ---
          createHeading("6. Report Sign-Off"),
          createParagraph(
            "This baseline assessment report has been prepared by Bytes Software Services Limited " +
            "in accordance with Microsoft Power Platform governance best practices."
          ),
          new Paragraph({ text: "", spacing: { after: 300 } }),

          createStyledTable([
            new TableRow({
              children: [
                createCell("Prepared By", { bold: true, shading: "E5E7EB" }),
                createCell(project.assessmentMetadata?.assessorName || "Assessor Name"),
              ],
            }),
            new TableRow({
              children: [
                createCell("Role", { bold: true, shading: "E5E7EB" }),
                createCell(project.assessmentMetadata?.assessorRole || "Power Platform Consultant"),
              ],
            }),
            new TableRow({
              children: [
                createCell("Date", { bold: true, shading: "E5E7EB" }),
                createCell(assessmentDate),
              ],
            }),
            new TableRow({
              children: [
                createCell("Signature", { bold: true, shading: "E5E7EB" }),
                createCell("_______________________________"),
              ],
            }),
          ]),
          new Paragraph({ text: "", spacing: { after: 300 } }),

          createParagraph(
            "This report represents the baseline state at the time of assessment. " +
            "Regular re-assessment is recommended to track improvement progress.",
            { italic: true, color: BYTES_GREY }
          ),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${project.name}_Baseline_Justification_Report.docx`)
}
