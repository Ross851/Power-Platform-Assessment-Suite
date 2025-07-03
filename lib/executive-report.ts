import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak, Header, Footer, PageNumber, NumberFormat, Packer } from "docx"
import type { Project, RAGStatus } from "./types"
import { saveAs } from "file-saver"

interface ExecutiveSummaryData {
  overallScore: number
  overallRAG: RAGStatus
  criticalRisks: number
  highPriorityItems: number
  totalAssessed: number
  completionRate: number
  topRisks: Array<{
    area: string
    risk: string
    impact: string
    recommendation: string
    owner?: string
  }>
  maturityByArea: Array<{
    area: string
    score: number
    rag: RAGStatus
    trend?: "improving" | "stable" | "declining"
  }>
}

export async function generateExecutiveReport(project: Project) {
  const summaryData = calculateExecutiveSummaryData(project)
  
  const doc = new Document({
    creator: "Power Platform Assessment Suite",
    title: `Executive Assessment Report - ${project.name}`,
    description: "Comprehensive Power Platform maturity assessment for executive review",
    styles: {
      default: {
        heading1: {
          run: {
            size: 32,
            bold: true,
            color: "2E4057",
          },
          paragraph: {
            spacing: { after: 400 },
          },
        },
        heading2: {
          run: {
            size: 26,
            bold: true,
            color: "2E4057",
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        heading3: {
          run: {
            size: 22,
            bold: true,
            color: "2E4057",
          },
          paragraph: {
            spacing: { before: 200, after: 200 },
          },
        },
      },
    },
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "CONFIDENTIAL - Power Platform Assessment Report",
                    size: 20,
                    color: "666666",
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${project.name} | Generated: ${new Date().toLocaleDateString()} | Page `,
                    size: 18,
                    color: "666666",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    color: "666666",
                  }),
                  new TextRun({
                    text: " of ",
                    size: 18,
                    color: "666666",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: "666666",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: [
          // Title Page
          ...createTitlePage(project, summaryData),
          new PageBreak(),
          
          // Executive Summary
          ...createExecutiveSummary(project, summaryData),
          new PageBreak(),
          
          // Risk Assessment
          ...createRiskAssessment(project, summaryData),
          new PageBreak(),
          
          // Maturity Analysis
          ...createMaturityAnalysis(project, summaryData),
          new PageBreak(),
          
          // Strategic Recommendations
          ...createStrategicRecommendations(project, summaryData),
          new PageBreak(),
          
          // Investment Priorities
          ...createInvestmentPriorities(project, summaryData),
          new PageBreak(),
          
          // 90-Day Action Plan
          ...create90DayActionPlan(project, summaryData),
          new PageBreak(),
          
          // Detailed Findings
          ...createDetailedFindings(project),
        ] as any,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${project.name}-Executive-Report-${new Date().toISOString().split('T')[0]}.docx`)
}

function calculateExecutiveSummaryData(project: Project): ExecutiveSummaryData {
  let totalScore = 0
  let totalWeight = 0
  let criticalRisks = 0
  let highPriorityItems = 0
  let totalAssessed = 0
  let totalQuestions = 0
  const topRisks: ExecutiveSummaryData['topRisks'] = []
  const maturityByArea: ExecutiveSummaryData['maturityByArea'] = []

  project.standards.forEach(standard => {
    const standardScore = standard.maturityScore || 0
    const standardWeight = standard.weight
    totalScore += standardScore * standardWeight
    totalWeight += standardWeight

    maturityByArea.push({
      area: standard.name,
      score: standardScore,
      rag: standard.ragStatus || "grey",
      trend: "stable", // In a real app, compare with previous assessments
    })

    standard.questions.forEach(question => {
      totalQuestions++
      if (question.answer !== undefined && question.answer !== "") {
        totalAssessed++
      }

      if (question.ragStatus === "red") {
        criticalRisks++
        if (topRisks.length < 5) { // Top 5 risks
          topRisks.push({
            area: standard.name,
            risk: question.text,
            impact: getImpactDescription(question),
            recommendation: question.bestPractice?.suggestedActions?.[0] || "Review and address this critical gap",
            owner: question.riskOwner,
          })
        }
      } else if (question.ragStatus === "amber") {
        highPriorityItems++
      }
    })
  })

  const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0
  const completionRate = totalQuestions > 0 ? (totalAssessed / totalQuestions) * 100 : 0
  
  // Determine overall RAG
  let overallRAG: RAGStatus = "grey"
  if (criticalRisks > 5) {
    overallRAG = "red"
  } else if (criticalRisks > 0 || highPriorityItems > 10) {
    overallRAG = "amber"
  } else if (completionRate > 80 && overallScore > 3) {
    overallRAG = "green"
  }

  return {
    overallScore,
    overallRAG,
    criticalRisks,
    highPriorityItems,
    totalAssessed,
    completionRate,
    topRisks,
    maturityByArea,
  }
}

function createTitlePage(project: Project, summary: ExecutiveSummaryData): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "POWER PLATFORM",
          size: 48,
          bold: true,
          color: "2E4057",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "MATURITY ASSESSMENT",
          size: 48,
          bold: true,
          color: "2E4057",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "EXECUTIVE REPORT",
          size: 36,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: project.name,
          size: 32,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Assessment Date: ${new Date(project.lastModifiedAt).toLocaleDateString()}`,
          size: 24,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Overall Maturity Score: ${summary.overallScore.toFixed(1)}/5.0`,
          size: 28,
          bold: true,
          color: getRAGColor(summary.overallRAG),
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 1600 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "CONFIDENTIAL",
          size: 20,
          bold: true,
          color: "CC0000",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ]
}

function createExecutiveSummary(project: Project, summary: ExecutiveSummaryData): (Paragraph | Table)[] {
  return [
    new Paragraph({
      text: "Executive Summary",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "This report presents the findings of a comprehensive Power Platform maturity assessment conducted for ",
        }),
        new TextRun({
          text: project.name,
          bold: true,
        }),
        new TextRun({
          text: ". The assessment evaluates organizational readiness, governance practices, security posture, and operational excellence across the Power Platform ecosystem.",
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Key Findings",
      heading: HeadingLevel.HEADING_2,
    }),
    createKeyMetricsTable(summary),
    new Paragraph({
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Critical Actions Required",
      heading: HeadingLevel.HEADING_3,
    }),
    ...summary.topRisks.slice(0, 3).map((risk, index) => 
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. `,
            bold: true,
          }),
          new TextRun({
            text: `${risk.area}: `,
            bold: true,
          }),
          new TextRun({
            text: risk.recommendation,
          }),
          risk.owner ? new TextRun({
            text: ` (Owner: ${risk.owner})`,
            italics: true,
          }) : new TextRun(""),
        ],
        bullet: { level: 0 },
        spacing: { after: 200 },
      })
    ),
  ]
}

function createKeyMetricsTable(summary: ExecutiveSummaryData): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Metric", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Overall Maturity Score")] }),
          new TableCell({ children: [new Paragraph(`${summary.overallScore.toFixed(1)}/5.0`)] }),
          new TableCell({ 
            children: [new Paragraph({
              children: [new TextRun({
                text: summary.overallRAG.toUpperCase(),
                color: getRAGColor(summary.overallRAG),
                bold: true,
              })],
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Assessment Completion")] }),
          new TableCell({ children: [new Paragraph(`${summary.completionRate.toFixed(0)}%`)] }),
          new TableCell({ children: [new Paragraph(summary.completionRate > 80 ? "Complete" : "In Progress")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Critical Risks Identified")] }),
          new TableCell({ children: [new Paragraph(summary.criticalRisks.toString())] }),
          new TableCell({ 
            children: [new Paragraph({
              children: [new TextRun({
                text: summary.criticalRisks > 0 ? "ACTION REQUIRED" : "None",
                color: summary.criticalRisks > 0 ? "CC0000" : "00CC00",
                bold: true,
              })],
            })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("High Priority Items")] }),
          new TableCell({ children: [new Paragraph(summary.highPriorityItems.toString())] }),
          new TableCell({ children: [new Paragraph("Review Needed")] }),
        ],
      }),
    ],
  })
}

function createRiskAssessment(project: Project, summary: ExecutiveSummaryData): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "Risk Assessment & Compliance",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "The following critical risks require immediate executive attention and resource allocation:",
      spacing: { after: 400 },
    }),
  ]

  // Group risks by category
  const risksByCategory = new Map<string, typeof summary.topRisks>()
  summary.topRisks.forEach(risk => {
    const category = getCategoryFromArea(risk.area)
    if (!risksByCategory.has(category)) {
      risksByCategory.set(category, [])
    }
    risksByCategory.get(category)!.push(risk)
  })

  risksByCategory.forEach((risks, category) => {
    paragraphs.push(
      new Paragraph({
        text: category,
        heading: HeadingLevel.HEADING_2,
      })
    )

    risks.forEach(risk => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Risk: ",
              bold: true,
              color: "CC0000",
            }),
            new TextRun({
              text: risk.risk,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Business Impact: ",
              bold: true,
            }),
            new TextRun({
              text: risk.impact,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Recommended Action: ",
              bold: true,
            }),
            new TextRun({
              text: risk.recommendation,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Risk Owner: ",
              bold: true,
            }),
            new TextRun({
              text: risk.owner || "To be assigned",
              italics: !risk.owner,
            }),
          ],
          spacing: { after: 400 },
        })
      )
    })
  })

  return paragraphs
}

function createMaturityAnalysis(project: Project, summary: ExecutiveSummaryData): (Paragraph | Table)[] {
  return [
    new Paragraph({
      text: "Maturity Analysis by Domain",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "The following table presents the maturity assessment across all evaluated domains:",
      spacing: { after: 400 },
    }),
    createMaturityTable(summary.maturityByArea),
    new Paragraph({
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Maturity Scale Reference",
      heading: HeadingLevel.HEADING_3,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "1.0-2.0: ", bold: true }),
        new TextRun({ text: "Initial/Ad-hoc - Minimal processes, reactive approach" }),
      ],
      bullet: { level: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "2.0-3.0: ", bold: true }),
        new TextRun({ text: "Developing - Basic processes established, inconsistent application" }),
      ],
      bullet: { level: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "3.0-4.0: ", bold: true }),
        new TextRun({ text: "Defined - Standardized processes, proactive management" }),
      ],
      bullet: { level: 0 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "4.0-5.0: ", bold: true }),
        new TextRun({ text: "Optimized - Continuous improvement, industry-leading practices" }),
      ],
      bullet: { level: 0 },
      spacing: { after: 400 },
    }),
  ]
}

function createMaturityTable(maturityData: ExecutiveSummaryData['maturityByArea']): Table {
  const sortedData = [...maturityData].sort((a, b) => a.score - b.score)
  
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Domain", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Score", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Trend", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
        ],
      }),
      ...sortedData.map(area => 
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(area.area)] }),
            new TableCell({ children: [new Paragraph(`${area.score.toFixed(1)}/5.0`)] }),
            new TableCell({ 
              children: [new Paragraph({
                children: [new TextRun({
                  text: area.rag.toUpperCase(),
                  color: getRAGColor(area.rag),
                  bold: true,
                })],
              })],
            }),
            new TableCell({ children: [new Paragraph(getTrendIcon(area.trend))] }),
          ],
        })
      ),
    ],
  })
}

function createStrategicRecommendations(project: Project, summary: ExecutiveSummaryData): Paragraph[] {
  const recommendations = generateStrategicRecommendations(summary)
  
  return [
    new Paragraph({
      text: "Strategic Recommendations",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "Based on the assessment findings, we recommend the following strategic initiatives:",
      spacing: { after: 400 },
    }),
    ...recommendations.map((rec, index) => [
      new Paragraph({
        text: `${index + 1}. ${rec.title}`,
        heading: HeadingLevel.HEADING_3,
      }),
      new Paragraph({
        text: rec.description,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Expected Outcome: ", bold: true }),
          new TextRun({ text: rec.outcome }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Timeline: ", bold: true }),
          new TextRun({ text: rec.timeline }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Investment Required: ", bold: true }),
          new TextRun({ text: rec.investment }),
        ],
        spacing: { after: 400 },
      }),
    ]).flat(),
  ]
}

function createInvestmentPriorities(project: Project, summary: ExecutiveSummaryData): (Paragraph | Table)[] {
  return [
    new Paragraph({
      text: "Investment Priorities & Business Case",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "The following investments are recommended to address identified gaps and advance platform maturity:",
      spacing: { after: 400 },
    }),
    createInvestmentTable(summary),
    new Paragraph({
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Return on Investment",
      heading: HeadingLevel.HEADING_2,
    }),
    new Paragraph({
      text: "Implementing these recommendations will deliver the following business value:",
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: "Risk Mitigation: Reduce security and compliance exposure by 75%",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "Operational Efficiency: Increase development velocity by 40%",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "Cost Optimization: Reduce shadow IT and technical debt by 30%",
      bullet: { level: 0 },
    }),
    new Paragraph({
      text: "Innovation Enablement: Accelerate digital transformation initiatives",
      bullet: { level: 0 },
      spacing: { after: 400 },
    }),
  ]
}

function create90DayActionPlan(project: Project, summary: ExecutiveSummaryData): Paragraph[] {
  const actionPlan = generate90DayPlan(summary)
  
  return [
    new Paragraph({
      text: "90-Day Action Plan",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "Immediate actions to address critical findings and establish momentum:",
      spacing: { after: 400 },
    }),
    ...actionPlan.map(phase => [
      new Paragraph({
        text: phase.title,
        heading: HeadingLevel.HEADING_2,
      }),
      ...phase.actions.map(action => 
        new Paragraph({
          children: [
            new TextRun({ text: `${action.week}: `, bold: true }),
            new TextRun({ text: action.task }),
            action.owner ? new TextRun({ text: ` (${action.owner})`, italics: true }) : new TextRun(""),
          ],
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      ),
      new Paragraph({
        spacing: { after: 300 },
      }),
    ]).flat(),
  ]
}

function createDetailedFindings(project: Project): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: "Detailed Assessment Findings",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      text: "The following section provides detailed findings for each assessment domain, including technical observations and developer recommendations:",
      spacing: { after: 400 },
    }),
  ]

  project.standards.forEach(standard => {
    paragraphs.push(
      new Paragraph({
        text: standard.name,
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Maturity Score: ", bold: true }),
          new TextRun({ text: `${(standard.maturityScore || 0).toFixed(1)}/5.0` }),
          new TextRun({ text: " | Status: ", bold: true }),
          new TextRun({ 
            text: (standard.ragStatus || "grey").toUpperCase(),
            color: getRAGColor(standard.ragStatus || "grey"),
            bold: true,
          }),
        ],
        spacing: { after: 200 },
      })
    )

    // Add critical findings for this standard
    const criticalFindings = standard.questions.filter(q => q.ragStatus === "red")
    if (criticalFindings.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "Critical Findings:", bold: true })],
          spacing: { before: 200, after: 100 },
        })
      )
      criticalFindings.forEach(finding => {
        paragraphs.push(
          new Paragraph({
            text: finding.text,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
        
        // Evidence Notes
        if (finding.evidenceNotes) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Evidence: ", italics: true, bold: true }),
                new TextRun({ text: finding.evidenceNotes, italics: true }),
              ],
              indent: { left: 720 },
              spacing: { after: 100 },
            })
          )
        }

        // Developer Documentation
        if (finding.codeSnippets || finding.developerFeedback || finding.developerRecommendations) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: "Developer Documentation:", bold: true })],
              spacing: { before: 100, after: 50 },
            })
          )

          // Code Snippets
          if (finding.codeSnippets) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Code Examples: ", bold: true }),
                ],
                indent: { left: 720 },
                spacing: { after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: finding.codeSnippets,
                    font: "Consolas",
                    size: 20,
                  }),
                ],
                indent: { left: 720 },
                spacing: { after: 100 },
              })
            )
          }

          // Developer Findings
          if (finding.developerFeedback) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Technical Findings: ", bold: true }),
                ],
                indent: { left: 720 },
                spacing: { after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: finding.developerFeedback }),
                ],
                indent: { left: 720 },
                spacing: { after: 100 },
              })
            )
          }

          // Developer Recommendations
          if (finding.developerRecommendations) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Developer Recommendations: ", bold: true }),
                ],
                indent: { left: 720 },
                spacing: { after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: finding.developerRecommendations }),
                ],
                indent: { left: 720 },
                spacing: { after: 100 },
              })
            )
          }
        }

        // Risk Owner
        if (finding.riskOwner) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({ text: "Risk Owner: ", bold: true }),
                new TextRun({ text: finding.riskOwner }),
              ],
              indent: { left: 720 },
              spacing: { after: 100 },
            })
          )
        }
      })
    }

    // Add amber findings with developer documentation
    const amberFindings = standard.questions.filter(q => q.ragStatus === "amber" && (q.codeSnippets || q.developerFeedback || q.developerRecommendations))
    if (amberFindings.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "Important Findings with Developer Insights:", bold: true })],
          spacing: { before: 200, after: 100 },
        })
      )
      amberFindings.forEach(finding => {
        paragraphs.push(
          new Paragraph({
            text: finding.text,
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        )
        
        // Developer Documentation for amber findings
        if (finding.codeSnippets || finding.developerFeedback || finding.developerRecommendations) {
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: "Developer Documentation:", bold: true })],
              spacing: { before: 100, after: 50 },
            })
          )

          if (finding.codeSnippets) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Code Examples: ", bold: true }),
                ],
                indent: { left: 720 },
                spacing: { after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: finding.codeSnippets,
                    font: "Consolas",
                    size: 20,
                  }),
                ],
                indent: { left: 720 },
                spacing: { after: 100 },
              })
            )
          }

          if (finding.developerFeedback) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Technical Findings: ", bold: true }),
                ],
                indent: { left: 720 },
                spacing: { after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: finding.developerFeedback }),
                ],
                indent: { left: 720 },
                spacing: { after: 100 },
              })
            )
          }

          if (finding.developerRecommendations) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: "Developer Recommendations: ", bold: true }),
                ],
                indent: { left: 720 },
                spacing: { after: 50 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: finding.developerRecommendations }),
                ],
                indent: { left: 720 },
                spacing: { after: 100 },
              })
            )
          }
        }
      })
    }

    paragraphs.push(new Paragraph({ spacing: { after: 400 } }))
  })

  return paragraphs
}

// Helper functions
function getRAGColor(rag: RAGStatus): string {
  switch (rag) {
    case "red": return "CC0000"
    case "amber": return "FF9900"
    case "green": return "00CC00"
    default: return "666666"
  }
}

function getImpactDescription(question: any): string {
  if (question.category === "Security") {
    return "Potential data breach risk and compliance violations"
  } else if (question.category === "Governance") {
    return "Lack of control leading to shadow IT and technical debt"
  } else if (question.category === "Architecture") {
    return "Scalability issues and increased operational costs"
  } else {
    return "Operational inefficiency and increased business risk"
  }
}

function getCategoryFromArea(area: string): string {
  if (area.includes("Security") || area.includes("DLP")) return "Security & Compliance"
  if (area.includes("Governance") || area.includes("CoE")) return "Governance & Control"
  if (area.includes("Architecture") || area.includes("Environment")) return "Technical Architecture"
  return "Operational Excellence"
}

function getTrendIcon(trend?: string): string {
  switch (trend) {
    case "improving": return "↑"
    case "declining": return "↓"
    default: return "→"
  }
}

function generateStrategicRecommendations(summary: ExecutiveSummaryData) {
  const recommendations = []
  
  if (summary.criticalRisks > 3) {
    recommendations.push({
      title: "Establish Power Platform Center of Excellence",
      description: "Create a dedicated CoE team to govern, support, and accelerate Power Platform adoption while mitigating identified risks.",
      outcome: "Centralized governance, reduced shadow IT, and accelerated innovation",
      timeline: "3-6 months",
      investment: "$150,000 - $250,000 (team formation and tools)",
    })
  }

  if (summary.maturityByArea.find(a => a.area.includes("Security") && a.score < 3)) {
    recommendations.push({
      title: "Implement Comprehensive Security Framework",
      description: "Deploy advanced DLP policies, implement Microsoft Purview integration, and establish security monitoring dashboards.",
      outcome: "90% reduction in data leakage risk, compliance with regulatory requirements",
      timeline: "2-3 months",
      investment: "$50,000 - $75,000 (tools and configuration)",
    })
  }

  if (summary.maturityByArea.find(a => a.area.includes("ALM") && a.score < 3)) {
    recommendations.push({
      title: "Modernize Application Lifecycle Management",
      description: "Implement automated CI/CD pipelines, source control integration, and environment management strategies.",
      outcome: "40% faster deployment cycles, improved code quality, reduced production incidents",
      timeline: "4-6 months",
      investment: "$75,000 - $100,000 (tooling and training)",
    })
  }

  return recommendations
}

function createInvestmentTable(summary: ExecutiveSummaryData): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Investment Area", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Priority", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "Estimated Cost", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: "ROI Timeline", bold: true })] })],
            shading: { fill: "E6E6E6", type: ShadingType.SOLID },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("CoE Team Formation")] }),
          new TableCell({ children: [new Paragraph("Critical")] }),
          new TableCell({ children: [new Paragraph("$150,000 - $250,000")] }),
          new TableCell({ children: [new Paragraph("6-9 months")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Security & Compliance Tools")] }),
          new TableCell({ children: [new Paragraph("High")] }),
          new TableCell({ children: [new Paragraph("$50,000 - $75,000")] }),
          new TableCell({ children: [new Paragraph("3-6 months")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Training & Certification")] }),
          new TableCell({ children: [new Paragraph("Medium")] }),
          new TableCell({ children: [new Paragraph("$30,000 - $50,000")] }),
          new TableCell({ children: [new Paragraph("6-12 months")] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Monitoring & Analytics")] }),
          new TableCell({ children: [new Paragraph("Medium")] }),
          new TableCell({ children: [new Paragraph("$25,000 - $40,000")] }),
          new TableCell({ children: [new Paragraph("3-6 months")] }),
        ],
      }),
    ],
  })
}

function generate90DayPlan(summary: ExecutiveSummaryData) {
  return [
    {
      title: "Days 1-30: Foundation & Quick Wins",
      actions: [
        { week: "Week 1", task: "Form Power Platform governance committee", owner: "CTO" },
        { week: "Week 2", task: "Implement critical DLP policies for high-risk connectors", owner: "Security Team" },
        { week: "Week 3", task: "Document current state architecture and identify technical debt", owner: "Architecture Team" },
        { week: "Week 4", task: "Launch security awareness training for citizen developers", owner: "Training Team" },
      ],
    },
    {
      title: "Days 31-60: Process & Control",
      actions: [
        { week: "Week 5-6", task: "Establish environment strategy and provisioning process", owner: "Platform Team" },
        { week: "Week 7", task: "Deploy CoE Starter Kit and configure monitoring", owner: "CoE Team" },
        { week: "Week 8", task: "Create and publish governance handbook v1.0", owner: "Governance Committee" },
      ],
    },
    {
      title: "Days 61-90: Optimization & Scale",
      actions: [
        { week: "Week 9-10", task: "Implement ALM processes and CI/CD pipelines", owner: "DevOps Team" },
        { week: "Week 11", task: "Launch citizen developer certification program", owner: "Training Team" },
        { week: "Week 12", task: "Conduct follow-up assessment and measure progress", owner: "CoE Team" },
      ],
    },
  ]
} 