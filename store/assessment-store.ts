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
  // ... (dummy data modifications as before) ...
  return {
    name: "Telana_Contoso_Demo",
    clientReferenceNumber: "TEL-C0N-001",
    standards,
    createdAt: new Date("2024-05-10T10:00:00Z"),
    lastModifiedAt: new Date("2024-05-20T14:30:00Z"),
    versions: [],
  }
}

interface AssessmentState {
  projects: Project[]
  activeProjectName: string | null
  createProject: (projectName: string, clientReferenceNumber: string) => Project | undefined
  setActiveProject: (projectName: string) => void
  getActiveProject: () => Project | undefined
  deleteProject: (projectName: string) => void
  setAnswer: (payload: AnswerPayload) => void
  getOverallProgress: (projectName?: string) => number
  getOverallMaturityScore: () => number
  getOverallRAGStatus: () => RAGStatus
  getRiskProfile: () => { name: string; value: number }[]
  getHighPriorityAreas: () => (Question & { standardName: string; standardSlug: string })[]
  createVersion: (versionName: string) => void
  restoreVersion: (versionId: string) => void
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

      setAnswer: ({ standardSlug, questionId, answer, evidenceNotes, riskOwner }) => {
        set((state) => {
          const activeProject = get().getActiveProject()
          if (!activeProject) return state

          const updatedStandards = activeProject.standards.map((standard) => {
            if (standard.slug === standardSlug) {
              const updatedQuestions = standard.questions.map((q) => {
                if (q.id === questionId) {
                  const updatedQ = { ...q, answer, evidenceNotes, riskOwner }
                  // Recalculate score and RAG for the specific question
                  let score = 0
                  let ragStatus: RAGStatus = "grey"
                  if (answer !== undefined && answer !== null && answer !== "") {
                    switch (q.type) {
                      case "boolean":
                        score = answer ? 5 : 1
                        break
                      case "scale":
                        score = Number(answer)
                        break
                      default:
                        score = 3
                    }
                    if (score <= 2) ragStatus = "red"
                    else if (score <= 3) ragStatus = "amber"
                    else ragStatus = "green"
                  }
                  return { ...updatedQ, score, ragStatus }
                }
                return q
              })
              return { ...standard, questions: updatedQuestions }
            }
            return standard
          })

          const updatedProject = { ...activeProject, standards: updatedStandards, lastModifiedAt: new Date() }
          return {
            projects: state.projects.map((p) => (p.name === activeProject.name ? updatedProject : p)),
          }
        })
      },

      getOverallProgress: (projectName) => {
        const project = projectName ? get().projects.find((p) => p.name === projectName) : get().getActiveProject()
        if (!project) return 0
        const totalQuestions = project.standards.reduce((sum, std) => sum + std.questions.length, 0)
        if (totalQuestions === 0) return 0
        const answeredQuestions = project.standards.reduce(
          (sum, std) =>
            sum + std.questions.filter((q) => q.answer !== undefined && q.answer !== "" && q.answer !== null).length,
          0,
        )
        return (answeredQuestions / totalQuestions) * 100
      },

      getOverallMaturityScore: () => {
        const project = get().getActiveProject()
        if (!project) return 0
        const totalWeightedScore = project.standards.reduce((sum, std) => {
          const standardScore = std.questions.reduce((qSum, q) => qSum + (q.score || 0) * q.weight, 0)
          const standardMaxScore = std.questions.reduce((qSum, q) => qSum + 5 * q.weight, 0)
          if (standardMaxScore === 0) return sum
          return sum + (standardScore / standardMaxScore) * 5 * std.weight
        }, 0)
        const totalWeight = project.standards.reduce((sum, std) => sum + std.weight, 0)
        if (totalWeight === 0) return 0
        return totalWeightedScore / totalWeight
      },

      getOverallRAGStatus: () => {
        const project = get().getActiveProject()
        if (!project) return "grey"
        const hasRed = project.standards.some((std) => std.questions.some((q) => q.ragStatus === "red"))
        if (hasRed) return "red"
        const hasAmber = project.standards.some((std) => std.questions.some((q) => q.ragStatus === "amber"))
        if (hasAmber) return "amber"
        const hasGreen = project.standards.some((std) => std.questions.some((q) => q.ragStatus === "green"))
        if (hasGreen) return "green"
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
      name: "power-platform-assessment-storage-v5",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.projects.length === 0) {
          // If the store is empty after rehydration, add the dummy project.
          state.projects.push(createDummyProject())
        }
      },
    },
  ),
)
