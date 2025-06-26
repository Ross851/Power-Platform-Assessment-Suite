import * as XLSX from "xlsx"

import type { Project } from "@/lib/types"

export const exportToExcel = async (project: Project) => {
  // Create a new Excel workbook
  const wb = XLSX.utils.book_new()

  // Function to add a worksheet from a JSON object
  const addWorksheet = (data: any[], sheetName: string) => {
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
  }

  // Project Details
  addWorksheet([project], "Project Details")

  // Assessment Standards
  project.standards.forEach((standard) => {
    addWorksheet(standard.questions, standard.name)
  })

  // General Documents
  addWorksheet(project.generalDocuments, "General Documents")

  // Generate the Excel file as a buffer
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })

  // Convert the buffer to a Blob
  const blob = new Blob([new Uint8Array(wbout)], { type: "application/octet-stream" })

  // Create a download link
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_assessment.xlsx` // Sanitize filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportToJson = (project: Project) => {
  const jsonString = JSON.stringify(project, null, 2)
  const blob = new Blob([jsonString], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_assessment.json` // Sanitize filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
