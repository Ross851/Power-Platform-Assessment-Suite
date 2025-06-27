import type { Project } from "./types"
import { saveAs } from "file-saver"
import ExcelJS from "exceljs"

export const exportToJson = (project: Project) => {
  const dataStr = JSON.stringify(project, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  saveAs(dataBlob, `${project.name}-assessment.json`)
}

export const exportToExcel = async (project: Project) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Assessment Results")

  // Add headers
  worksheet.columns = [
    { header: "Standard", key: "standard", width: 30 },
    { header: "Question", key: "question", width: 50 },
    { header: "Category", key: "category", width: 20 },
    { header: "Weight", key: "weight", width: 10 },
    { header: "Answer", key: "answer", width: 20 },
    { header: "Score", key: "score", width: 10 },
    { header: "RAG Status", key: "ragStatus", width: 15 },
    { header: "Risk Level", key: "riskLevel", width: 15 },
    { header: "Evidence Notes", key: "evidenceNotes", width: 40 },
    { header: "Code Snippets", key: "codeSnippets", width: 40 },
    { header: "Developer Findings", key: "developerFeedback", width: 40 },
    { header: "Developer Recommendations", key: "developerRecommendations", width: 40 },
    { header: "Risk Owner", key: "riskOwner", width: 20 },
  ]

  // Style the header row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  }

  // Add data rows
  project.standards.forEach((standard) => {
    standard.questions.forEach((question) => {
      worksheet.addRow({
        standard: standard.name,
        question: question.text,
        category: question.category,
        weight: question.weight,
        answer: question.answer || "Not answered",
        score: question.score || 0,
        ragStatus: question.ragStatus || "grey",
        riskLevel: question.riskLevel || "N/A",
        evidenceNotes: question.evidenceNotes || "",
        codeSnippets: question.codeSnippets || "",
        developerFeedback: question.developerFeedback || "",
        developerRecommendations: question.developerRecommendations || "",
        riskOwner: question.riskOwner || "",
      })
    })
  })

  // Add summary sheet
  const summarySheet = workbook.addWorksheet("Summary")
  summarySheet.columns = [
    { header: "Standard", key: "standard", width: 30 },
    { header: "Completion %", key: "completion", width: 15 },
    { header: "Maturity Score", key: "maturityScore", width: 15 },
    { header: "RAG Status", key: "ragStatus", width: 15 },
  ]

  const summaryHeaderRow = summarySheet.getRow(1)
  summaryHeaderRow.font = { bold: true }
  summaryHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  }

  project.standards.forEach((standard) => {
    summarySheet.addRow({
      standard: standard.name,
      completion: `${standard.completion || 0}%`,
      maturityScore: standard.maturityScore || 0,
      ragStatus: standard.ragStatus || "grey",
    })
  })

  // Add Developer Documentation Summary Sheet
  const devDocSheet = workbook.addWorksheet("Developer Documentation")
  devDocSheet.columns = [
    { header: "Standard", key: "standard", width: 30 },
    { header: "Question", key: "question", width: 50 },
    { header: "RAG Status", key: "ragStatus", width: 15 },
    { header: "Code Snippets", key: "codeSnippets", width: 40 },
    { header: "Developer Findings", key: "developerFeedback", width: 40 },
    { header: "Developer Recommendations", key: "developerRecommendations", width: 40 },
  ]

  const devDocHeaderRow = devDocSheet.getRow(1)
  devDocHeaderRow.font = { bold: true }
  devDocHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  }

  // Only include questions that have developer documentation
  project.standards.forEach((standard) => {
    standard.questions.forEach((question) => {
      if (question.codeSnippets || question.developerFeedback || question.developerRecommendations) {
        devDocSheet.addRow({
          standard: standard.name,
          question: question.text,
          ragStatus: question.ragStatus || "grey",
          codeSnippets: question.codeSnippets || "",
          developerFeedback: question.developerFeedback || "",
          developerRecommendations: question.developerRecommendations || "",
        })
      }
    })
  })

  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  saveAs(blob, `${project.name}-assessment.xlsx`)
}
