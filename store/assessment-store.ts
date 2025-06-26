import { create } from "zustand"
import { persist, type StateStorage } from "zustand/middleware"
import type { AssessmentStandard, AnswerPayload, RAGStatus, Project } from "@/lib/types"
import { ASSESSMENT_STANDARDS } from "@/lib/constants"

// Helper function to create a fresh set of standards for a new project
const createInitialProjectStandards = (): AssessmentStandard[] =>
  ASSESSMENT_STANDARDS.map((standard) => ({
    ...standard,
    questions: standard.questions.map((q) => ({
      ...q,
      answer: undefined,
      score: 0,
      riskLevel: undefined,
      ragStatus: "grey" as RAGStatus,
      evidenceNotes: "",
      document: q.type === "document-review" ? { file: null, fileName: "", annotations: [] } : undefined,
    })),
    completion: 0,
    maturityScore: 0,
    ragStatus: "grey" as RAGStatus,
  }))

// --- DUMMY DATA CREATION ---
const createDummyProject = (): Project => {
  const standards = createInitialProjectStandards()

  // Answer doc-q1 as 'Yes' (Green)
  const docStandard = standards.find((s) => s.slug === "documentation-rulebooks")
  if (docStandard) {
    const docQ1 = docStandard.questions.find((q) => q.id === "doc-q1")
    if (docQ1) docQ1.answer = true
  }

  // Answer dlp-q1 as 'No' (Red) and add risk owner
  const dlpStandard = standards.find((s) => s.slug === "dlp-policy")
  if (dlpStandard) {
    const dlpQ1 = dlpStandard.questions.find((q) => q.id === "dlp-q1")
    if (dlpQ1) {
      dlpQ1.answer = false
      dlpQ1.evidenceNotes = "DLP policies are only applied to the default environment, leaving production vulnerable."
      dlpQ1.riskOwner = "CIO / Head of Security"
    }
  }

  // Answer env-q2 as '3' (Amber)
  const envStandard = standards.find((s) => s.slug === "environment-usage")
  if (envStandard) {
    const envQ2 = envStandard.questions.find((q) => q.id === "env-q2")
    if (envQ2) envQ2.answer = 3
  }

  return {
    name: "Telana_Contoso_Demo",
    clientReferenceNumber: "TEL-C0N-001",
    standards,
    createdAt: new Date("2024-05-10T10:00:00Z"),
    lastModifiedAt: new Date("2024-05-20T14:30:00Z"),
  }
}
// --- END DUMMY DATA ---

interface AssessmentState {
  projects: Project[]
  activeProjectName: string | null

  createProject: (projectName: string, clientReferenceNumber: string) => void
  setActiveProject: (projectName: string) => void
  getActiveProject: () => Project | undefined
  deleteProject: (projectName: string) => void

  setAnswer: (payload: AnswerPayload) => void
  getStandardBySlug: (slug: string) => AssessmentStandard | undefined
  getStandardProgress: (slug: string) => number
  getOverallProgress: () => number
  calculateScoresAndRAG: (standardSlug: string) => void
  getStandardMaturityScore: (slug: string) => number
  getOverallMaturityScore: () => number
  getRiskProfile: () => { high: number; medium: number; low: number }
  getOverallRAGStatus: () => RAGStatus
  getHighPriorityAreas: () => Array<{
    standardName: string
    standardSlug: string
    questionText?: string
    questionId?: string
    ragStatus: RAGStatus
    riskOwner?: string
    category: string
  }>
}

const customStorage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    const { state, version } = JSON.parse(str)
    const revivedState = {
      ...state,
      projects: (state.projects || []).map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        lastModifiedAt: new Date(project.lastModifiedAt),
      })),
    }
    return { state: revivedState, version }
  },
  setItem: (name, newValue) => {
    const modifiedState = {
      ...newValue.state,
      projects: newValue.state.projects.map((project: Project) => ({
        ...project,
      })),
    }
    localStorage.setItem(name, JSON.stringify({ state: modifiedState, version: newValue.version }))
  },
  removeItem: (name) => localStorage.removeItem(name),
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      projects: [createDummyProject()],
      activeProjectName: "Telana_Contoso_Demo",

      createProject: (projectName, clientReferenceNumber) => {
        if (get().projects.find((p) => p.name === projectName)) {
          alert(`Project "${projectName}" already exists.`)
          return
        }
        const newProject: Project = {
          name: projectName,
          clientReferenceNumber,
          standards: createInitialProjectStandards(),
          createdAt: new Date(),
          lastModifiedAt: new Date(),
        }
        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectName: projectName,
        }))
      },

      setActiveProject: (projectName) => {
        if (get().projects.find((p) => p.name === projectName)) {
          set({ activeProjectName: projectName })
        } else {
          console.warn(`Project "${projectName}" not found.`)
        }
      },

      deleteProject: (projectName) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.name !== projectName),
          activeProjectName: state.activeProjectName === projectName ? null : state.activeProjectName,
        }))
      },

      getActiveProject: () => {
        const activeName = get().activeProjectName
        if (!activeName) return undefined
        return get().projects.find((p) => p.name === activeName)
      },

      setAnswer: ({ standardSlug, questionId, answer, evidenceNotes, documentData, riskOwner }) =>
        set((state) => {
          const activeProject = state.projects.find((p) => p.name === state.activeProjectName)
          if (!activeProject) return state

          const newStandards = activeProject.standards.map((standard) => {
            if (standard.slug === standardSlug) {
              const newQuestions = standard.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      answer,
                      evidenceNotes: evidenceNotes || q.evidenceNotes,
                      document: documentData ? { ...q.document, ...documentData } : q.document,
                      riskOwner: riskOwner !== undefined ? riskOwner : q.riskOwner,
                    }
                  : q,
              )
              const answeredQuestions = newQuestions.filter(
                (q) =>
                  (q.answer !== undefined && q.answer !== "") || (q.type === "document-review" && q.document?.file),
              ).length
              const completion = newQuestions.length > 0 ? (answeredQuestions / newQuestions.length) * 100 : 0
              return { ...standard, questions: newQuestions, completion }
            }
            return standard
          })

          const updatedProject = { ...activeProject, standards: newStandards, lastModifiedAt: new Date() }
          return {
            projects: state.projects.map((p) => (p.name === state.activeProjectName ? updatedProject : p)),
          }
        }),

      getStandardBySlug: (slug) => {
        const activeProject = get().getActiveProject()
        return activeProject?.standards.find((s) => s.slug === slug)
      },

      getStandardProgress: (slug) => {
        const standard = get().getStandardBySlug(slug)
        if (!standard) return 0
        const answeredQuestions = standard.questions.filter(
          (q) => (q.answer !== undefined && q.answer !== "") || (q.type === "document-review" && q.document?.file),
        ).length
        if (standard.questions.length === 0) return 0
        return (answeredQuestions / standard.questions.length) * 100
      },

      getOverallProgress: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject || activeProject.standards.length === 0) return 0
        const totalProgress = activeProject.standards.reduce((acc, curr) => acc + (curr.completion || 0), 0)
        return totalProgress / activeProject.standards.length
      },

      calculateScoresAndRAG: (standardSlug) =>
        set((state) => {
          const activeProject = state.projects.find((p) => p.name === state.activeProjectName)
          if (!activeProject) return state

          let projectOverallRagStatus: RAGStatus = "grey"
          let projectHasRed = false
          let projectHasAmber = false
          let projectHasGreen = false
          let projectAnsweredQuestions = 0

          const newStandards = activeProject.standards.map((std) => {
            if (std.slug === standardSlug) {
              let totalWeightedScore = 0
              let totalWeight = 0
              let standardHasRed = false
              let standardHasAmber = false
              let answeredQuestionsInStandard = 0

              const updatedQuestions = std.questions.map((q) => {
                let questionScore = 0
                let riskLevel: "low" | "medium" | "high" | undefined = undefined
                let ragStatus: RAGStatus = "grey"

                if ((q.answer !== undefined && q.answer !== "") || (q.type === "document-review" && q.document?.file)) {
                  answeredQuestionsInStandard++
                  projectAnsweredQuestions++
                  switch (q.type) {
                    case "boolean":
                      questionScore = q.answer ? 5 : 1
                      riskLevel = q.answer ? "low" : "high"
                      break
                    case "scale":
                      questionScore = Number(q.answer)
                      if (questionScore <= 2) riskLevel = "high"
                      else if (questionScore <= 3) riskLevel = "medium"
                      else riskLevel = "low"
                      break
                    case "percentage":
                      const perc = Number(q.answer)
                      if (perc >= 75) questionScore = 5
                      else if (perc >= 50) questionScore = 3
                      else if (perc >= 25) questionScore = 2
                      else questionScore = 1
                      if (perc < 25) riskLevel = "high"
                      else if (perc < 75) riskLevel = "medium"
                      else riskLevel = "low"
                      break
                    case "document-review":
                      const hasContent = q.answer || (q.document?.annotations && q.document.annotations.length > 0)
                      questionScore = hasContent ? 3 : 1
                      riskLevel = hasContent ? "medium" : "low"
                      break
                    default:
                      questionScore = 3
                      riskLevel = "medium"
                  }

                  if (riskLevel === "high") ragStatus = "red"
                  else if (riskLevel === "medium") ragStatus = "amber"
                  else if (riskLevel === "low") ragStatus = "green"
                }

                if (ragStatus === "red") {
                  standardHasRed = true
                  projectHasRed = true
                }
                if (ragStatus === "amber") {
                  standardHasAmber = true
                  projectHasAmber = true
                }
                if (ragStatus === "green" && !standardHasRed && !standardHasAmber) projectHasGreen = true

                totalWeightedScore += questionScore * q.weight
                totalWeight += q.weight
                return { ...q, score: questionScore, riskLevel, ragStatus }
              })

              const maturityScore = totalWeight > 0 ? (totalWeightedScore / (totalWeight * 5)) * 5 : 0
              let standardRagStatus: RAGStatus = "grey"
              if (answeredQuestionsInStandard > 0) {
                if (standardHasRed) standardRagStatus = "red"
                else if (standardHasAmber) standardRagStatus = "amber"
                else standardRagStatus = "green"
              }
              return { ...std, questions: updatedQuestions, maturityScore, ragStatus: standardRagStatus }
            }
            if (std.ragStatus === "red") projectHasRed = true
            if (std.ragStatus === "amber") projectHasAmber = true
            if (std.ragStatus === "green" && !projectHasRed && !projectHasAmber) projectHasGreen = true
            if (
              std.questions.some(
                (q) =>
                  (q.answer !== undefined && q.answer !== "") || (q.type === "document-review" && q.document?.file),
              )
            )
              projectAnsweredQuestions++
            return std
          })

          if (projectAnsweredQuestions > 0) {
            if (projectHasRed) projectOverallRagStatus = "red"
            else if (projectHasAmber) projectOverallRagStatus = "amber"
            else if (projectHasGreen) projectOverallRagStatus = "green"
            else projectOverallRagStatus = "grey"
          } else {
            projectOverallRagStatus = "grey"
          }

          const updatedProject = { ...activeProject, standards: newStandards, lastModifiedAt: new Date() }
          return {
            projects: state.projects.map((p) => (p.name === state.activeProjectName ? updatedProject : p)),
          }
        }),

      getStandardMaturityScore: (slug) => {
        const standard = get().getStandardBySlug(slug)
        return standard?.maturityScore || 0
      },

      getOverallMaturityScore: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject || activeProject.standards.length === 0) return 0

        let totalWeightedMaturity = 0
        let totalOverallWeight = 0
        activeProject.standards.forEach((std) => {
          if (std.maturityScore !== undefined && (std.completion || 0) > 0) {
            totalWeightedMaturity += std.maturityScore * std.weight
            totalOverallWeight += std.weight
          }
        })
        if (totalOverallWeight === 0) return 0
        return totalWeightedMaturity / totalOverallWeight
      },

      getRiskProfile: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return { high: 0, medium: 0, low: 0 }

        let high = 0,
          medium = 0,
          low = 0
        activeProject.standards.forEach((std) => {
          std.questions.forEach((q) => {
            if (q.riskLevel === "high") high++
            else if (q.riskLevel === "medium") medium++
            else if (q.riskLevel === "low" && q.answer !== undefined && q.answer !== "") low++
          })
        })
        return { high, medium, low }
      },

      getOverallRAGStatus: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject || activeProject.standards.every((s) => s.ragStatus === "grey" || s.completion === 0))
          return "grey"
        if (activeProject.standards.some((s) => s.ragStatus === "red" && (s.completion || 0) > 0)) return "red"
        if (activeProject.standards.some((s) => s.ragStatus === "amber" && (s.completion || 0) > 0)) return "amber"
        if (activeProject.standards.some((s) => s.ragStatus === "green" && (s.completion || 0) > 0)) return "green"
        return "grey"
      },

      getHighPriorityAreas: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return []

        const highPriority: Array<{
          standardName: string
          standardSlug: string
          questionText?: string
          questionId?: string
          ragStatus: RAGStatus
          riskOwner?: string
          category: string
        }> = []
        activeProject.standards.forEach((std) => {
          if (std.ragStatus === "red" || std.ragStatus === "amber") {
            std.questions.forEach((q) => {
              if (q.ragStatus === "red" || q.ragStatus === "amber") {
                highPriority.push({
                  standardName: std.name,
                  standardSlug: std.slug,
                  questionText: q.text,
                  questionId: q.id,
                  ragStatus: q.ragStatus,
                  riskOwner: q.riskOwner,
                  category: q.category,
                })
              }
            })
            if (
              !std.questions.some((q) => q.ragStatus === "red" || q.ragStatus === "amber") &&
              (std.completion || 0) > 0
            ) {
              highPriority.push({
                standardName: std.name,
                standardSlug: std.slug,
                ragStatus: std.ragStatus!,
                category: std.name, // Fallback category
              })
            }
          }
        })
        return highPriority.sort((a, b) => {
          if (a.ragStatus === "red" && b.ragStatus !== "red") return -1
          if (a.ragStatus !== "red" && b.ragStatus === "red") return 1
          if (a.ragStatus === "amber" && b.ragStatus === "green") return -1
          if (a.ragStatus === "green" && b.ragStatus === "amber") return 1
          return a.standardName.localeCompare(b.standardName)
        })
      },
    }),
    {
      name: "power-platform-assessment-storage-v3", // Incremented version for storage changes
      storage: customStorage,
    },
  ),
)
