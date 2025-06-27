import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AssessmentStandard, AnswerPayload, RAGStatus, Project, ProjectVersion, Question } from "@/lib/types"
import { ASSESSMENT_STANDARDS } from "@/lib/constants"
import { v4 as uuidv4 } from "uuid"

// Helper function to create a fresh set of standards for a new project
const createInitialProjectStandards = (): AssessmentStandard[] => JSON.parse(JSON.stringify(ASSESSMENT_STANDARDS)) // Deep copy to prevent mutation

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
    versions: [],
  }
}

// --- Helper function to calculate scores for a standard ---
const calculateStandardMetrics = (standard: AssessmentStandard): AssessmentStandard => {
  let totalWeightedScore = 0
  let totalWeight = 0
  let standardHasRed = false
  let standardHasAmber = false
  let answeredQuestionsInStandard = 0

  const updatedQuestions = standard.questions.map((q) => {
    if (q.answer === undefined || q.answer === "" || q.answer === null) {
      return { ...q, score: 0, riskLevel: undefined, ragStatus: "grey" }
    }

    answeredQuestionsInStandard++
    let questionScore = 0
    let riskLevel: "low" | "medium" | "high" | undefined = undefined

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
        questionScore = 3 // Default for text, numeric if answered
        riskLevel = "medium"
    }

    const ragStatus: RAGStatus = riskLevel === "high" ? "red" : riskLevel === "medium" ? "amber" : "green"
    if (ragStatus === "red") standardHasRed = true
    if (ragStatus === "amber") standardHasAmber = true

    totalWeightedScore += questionScore * q.weight
    totalWeight += q.weight

    return { ...q, score: questionScore, riskLevel, ragStatus }
  })

  const maturityScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0
  let standardRagStatus: RAGStatus = "grey"
  if (answeredQuestionsInStandard > 0) {
    if (standardHasRed) standardRagStatus = "red"
    else if (standardHasAmber) standardRagStatus = "amber"
    else standardRagStatus = "green"
  }

  const completion = standard.questions.length > 0 ? (answeredQuestionsInStandard / standard.questions.length) * 100 : 0

  return { ...standard, questions: updatedQuestions, maturityScore, ragStatus: standardRagStatus, completion }
}

interface AssessmentState {
  projects: Project[]
  activeProjectName: string | null
  createProject: (projectName: string, clientReferenceNumber: string) => Project | undefined
  setActiveProject: (projectName: string) => void
  getActiveProject: () => Project | undefined
  getStandardProgress: (slug: string) => number
  getStandardMaturityScore: (slug: string) => number
  getStandardBySlug: (slug: string) => AssessmentStandard | undefined
  setAnswer: (payload: AnswerPayload) => void
  calculateScoresAndRAG: (standardSlug: string) => void
  getOverallProgress: (projectName?: string) => number
  getOverallMaturityScore: () => number
  getOverallRAGStatus: () => RAGStatus
  getRiskProfile: () => { name: string; value: number }[]
  getHighPriorityAreas: () => (Question & { standardName: string; standardSlug: string })[]
  createVersion: (versionName: string) => void
  restoreVersion: (versionId: string) => void
  deleteProject: (projectName: string) => void
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      projects: [], // Start with an empty array
      activeProjectName: null,

      createProject: (projectName, clientReferenceNumber) => {
        if (get().projects.find((p) => p.name === projectName)) {
          alert(`Project "${projectName}" already exists.`)
          return undefined
        }
        const newProject: Project = {
          name: projectName,
          clientReferenceNumber,
          standards: createInitialProjectStandards(),
          createdAt: new Date(),
          lastModifiedAt: new Date(),
          versions: [],
        }
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
        return newProject
      },

      setActiveProject: (projectName) => {
        const projectExists = get().projects.some((p) => p.name === projectName)
        if (projectExists) {
          set({ activeProjectName: projectName })
        } else {
          set({ activeProjectName: null })
        }
      },

      getActiveProject: () => {
        const activeName = get().activeProjectName
        if (!activeName) return undefined
        return get().projects.find((p) => p.name === activeName)
      },

      deleteProject: (projectName) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.name !== projectName),
          activeProjectName: state.activeProjectName === projectName ? null : state.activeProjectName,
        }))
      },

      getStandardProgress: (slug) => {
        const std = get().getStandardBySlug(slug)
        return std?.completion ?? 0
      },

      getStandardMaturityScore: (slug) => {
        const std = get().getStandardBySlug(slug)
        return std?.maturityScore ?? 0
      },

      getStandardBySlug: (slug: string) => {
        const activeProject = get().getActiveProject()
        return activeProject?.standards.find((s) => s.slug === slug)
      },

      setAnswer: ({ standardSlug, questionId, answer, evidenceNotes, riskOwner, documentData, evidence }) => {
        set((state) => {
          const activeProject = get().getActiveProject()
          if (!activeProject) return state

          const updatedStandards = activeProject.standards.map((standard) => {
            if (standard.slug === standardSlug) {
              let standardNeedsRecalc = false
              const updatedQuestions = standard.questions.map((q) => {
                if (q.id === questionId) {
                  standardNeedsRecalc = true
                  const updatedQ = { ...q }
                  if (answer !== undefined) updatedQ.answer = answer
                  if (evidenceNotes !== undefined) updatedQ.evidenceNotes = evidenceNotes
                  if (riskOwner !== undefined) updatedQ.riskOwner = riskOwner
                  if (documentData) updatedQ.document = { ...q.document, ...documentData }
                  if (evidence !== undefined) updatedQ.evidence = evidence
                  return updatedQ
                }
                return q
              })

              if (standardNeedsRecalc) {
                return calculateStandardMetrics({ ...standard, questions: updatedQuestions })
              }
            }
            return standard
          })

          const updatedProject = { ...activeProject, standards: updatedStandards, lastModifiedAt: new Date() }
          return {
            projects: state.projects.map((p) => (p.name === activeProject.name ? updatedProject : p)),
          }
        })
      },

      calculateScoresAndRAG: (standardSlug) => {
        set((state) => {
          const activeProject = get().getActiveProject()
          if (!activeProject) return state

          // Recalculate only the targeted standard
          const updatedStandards = activeProject.standards.map((std) =>
            std.slug === standardSlug ? calculateStandardMetrics(std) : std,
          )

          const updatedProject = {
            ...activeProject,
            standards: updatedStandards,
            lastModifiedAt: new Date(),
          }

          return {
            projects: state.projects.map((p) => (p.name === activeProject.name ? updatedProject : p)),
          }
        })
      },

      getOverallProgress: (projectName) => {
        const project = projectName ? get().projects.find((p) => p.name === projectName) : get().getActiveProject()
        if (!project) return 0
        const totalCompletion = project.standards.reduce((sum, std) => sum + (std.completion || 0), 0)
        return project.standards.length > 0 ? totalCompletion / project.standards.length : 0
      },

      getOverallMaturityScore: () => {
        const project = get().getActiveProject()
        if (!project || project.standards.length === 0) return 0
        const totalWeightedMaturity = project.standards.reduce(
          (sum, std) => sum + (std.maturityScore || 0) * std.weight,
          0,
        )
        const totalWeight = project.standards.reduce((sum, std) => sum + std.weight, 0)
        return totalWeight > 0 ? totalWeightedMaturity / totalWeight : 0
      },

      getOverallRAGStatus: () => {
        const project = get().getActiveProject()
        if (!project) return "grey"
        if (project.standards.some((s) => s.ragStatus === "red")) return "red"
        if (project.standards.some((s) => s.ragStatus === "amber")) return "amber"
        if (project.standards.some((s) => s.ragStatus === "green")) return "green"
        return "grey"
      },

      getRiskProfile: () => {
        const project = get().getActiveProject()
        if (!project) return []
        const profile = { red: 0, amber: 0, green: 0 }
        project.standards.forEach((std) =>
          std.questions.forEach((q) => {
            if (q.ragStatus && q.ragStatus !== "grey") {
              profile[q.ragStatus]++
            }
          }),
        )
        return [
          { name: "High Risk", value: profile.red },
          { name: "Medium Risk", value: profile.amber },
          { name: "Low Risk", value: profile.green },
        ]
      },

      getHighPriorityAreas: () => {
        const project = get().getActiveProject()
        if (!project) return []
        const areas: (Question & { standardName: string; standardSlug: string })[] = []
        project.standards.forEach((std) => {
          std.questions.forEach((q) => {
            if (q.ragStatus === "red" || q.ragStatus === "amber") {
              areas.push({ ...q, standardName: std.name, standardSlug: std.slug })
            }
          })
        })
        return areas.sort((a, b) => {
          if (a.ragStatus === "red" && b.ragStatus !== "red") return -1
          if (a.ragStatus !== "red" && b.ragStatus === "red") return 1
          return 0
        })
      },

      createVersion: (versionName: string) => {
        set((state) => {
          const activeProject = get().getActiveProject()
          if (!activeProject) return state
          const newVersion: ProjectVersion = {
            id: uuidv4(),
            name: versionName,
            createdAt: new Date(),
            standards: JSON.parse(JSON.stringify(activeProject.standards)),
          }
          const updatedProject = { ...activeProject, versions: [...activeProject.versions, newVersion] }
          return { projects: state.projects.map((p) => (p.name === activeProject.name ? updatedProject : p)) }
        })
      },

      restoreVersion: (versionId: string) => {
        set((state) => {
          const activeProject = get().getActiveProject()
          if (!activeProject) return state
          const versionToRestore = activeProject.versions.find((v) => v.id === versionId)
          if (!versionToRestore) return state
          const updatedProject = {
            ...activeProject,
            standards: JSON.parse(JSON.stringify(versionToRestore.standards)),
            lastModifiedAt: new Date(),
          }
          return { projects: state.projects.map((p) => (p.name === activeProject.name ? updatedProject : p)) }
        })
      },
    }),
    {
      name: "power-platform-assessment-storage-v6", // Version bump for new structure
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.projects.length === 0) {
          state.projects.push(createDummyProject())
        }
      },
    },
  ),
)
