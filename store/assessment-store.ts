import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { ASSESSMENT_STANDARDS } from "@/lib/constants"
import type { Project, AnswerPayload, RAGStatus, Question } from "@/lib/types"

// Define the shape of the state
interface AssessmentState {
  projects: Project[]
  activeProjectName: string | null
  createProject: (name: string, clientReferenceNumber: string) => void
  getProjectByName: (name: string) => Project | undefined
  setActiveProject: (projectName: string) => void
  getActiveProject: () => Project | undefined
  setAnswer: (payload: AnswerPayload) => void
  getOverallProgress: (projectName?: string) => number
  getOverallMaturityScore: () => number
  getOverallRAGStatus: () => RAGStatus
  getRiskProfile: () => { name: string; value: number }[]
  getHighPriorityAreas: () => (Question & { standardName: string })[]
}

// Helper function to initialize a new project
const initializeNewProject = (name: string, clientReferenceNumber: string): Project => ({
  id: crypto.randomUUID(),
  name,
  client_name: clientReferenceNumber,
  created_at: new Date().toISOString(),
  clientReferenceNumber,
  standards: JSON.parse(JSON.stringify(ASSESSMENT_STANDARDS)), // Deep copy
  lastModifiedAt: new Date(),
  versions: [],
})

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectName: null,

      createProject: (name, clientReferenceNumber) => {
        const existingProject = get().projects.find((p) => p.name === name)
        if (existingProject) {
          console.error("Project with this name already exists.")
          return
        }
        const newProject = initializeNewProject(name, clientReferenceNumber)
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      getProjectByName: (name) => {
        return get().projects.find((p) => p.name === name)
      },

      setActiveProject: (projectName) => {
        set({ activeProjectName: projectName })
      },

      getActiveProject: () => {
        const activeName = get().activeProjectName
        if (!activeName) return undefined
        return get().projects.find((p) => p.name === activeName)
      },

      setAnswer: ({ standardSlug, questionId, answer, evidenceNotes, riskOwner }) => {
        set((state) => {
          const activeProject = get().getActiveProject()
          if (!activeProject) return state

          const updatedStandards = activeProject.standards.map((standard) => {
            if (standard.slug === standardSlug) {
              const updatedQuestions = standard.questions.map((question) => {
                if (question.id === questionId) {
                  let score = 0
                  let ragStatus: RAGStatus = "grey"
                  if (answer !== undefined && answer !== null && answer !== "") {
                    if (question.type === "boolean") {
                      score = answer ? 5 : 1
                    } else if (question.type === "scale") {
                      score = Number(answer)
                    } else {
                      score = 3 // Default score for answered text/numeric/etc.
                    }

                    if (score <= 2) ragStatus = "red"
                    else if (score <= 3) ragStatus = "amber"
                    else ragStatus = "green"
                  }

                  return { ...question, answer, score, ragStatus, evidenceNotes, riskOwner }
                }
                return question
              })
              return { ...standard, questions: updatedQuestions }
            }
            return standard
          })

          const updatedProject = { ...activeProject, standards: updatedStandards, lastModifiedAt: new Date() }
          const updatedProjects = state.projects.map((p) => (p.name === activeProject.name ? updatedProject : p))

          return { projects: updatedProjects }
        })
      },

      getOverallProgress: (projectName) => {
        const project = projectName ? get().getProjectByName(projectName) : get().getActiveProject()
        if (!project) return 0

        let totalQuestions = 0
        let answeredQuestions = 0
        project.standards.forEach((standard) => {
          totalQuestions += standard.questions.length
          answeredQuestions += standard.questions.filter(
            (q) => q.answer !== undefined && q.answer !== null && q.answer !== "",
          ).length
        })
        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
      },

      getOverallMaturityScore: () => {
        const project = get().getActiveProject()
        if (!project) return 0

        let totalWeightedScore = 0
        let totalWeight = 0
        project.standards.forEach((standard) => {
          let standardScore = 0
          let standardWeight = 0
          standard.questions.forEach((q) => {
            if (q.score !== undefined) {
              standardScore += q.score * q.weight
              standardWeight += q.weight
            }
          })
          if (standardWeight > 0) {
            totalWeightedScore += (standardScore / standardWeight) * standard.weight
            totalWeight += standard.weight
          }
        })
        return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
      },

      getOverallRAGStatus: () => {
        const score = get().getOverallMaturityScore()
        if (score < 2.0) return "red"
        if (score < 3.5) return "amber"
        if (score >= 3.5) return "green"
        return "grey"
      },

      getRiskProfile: () => {
        const project = get().getActiveProject()
        if (!project) return []

        const profile = { red: 0, amber: 0, green: 0 }
        project.standards.forEach((std) => {
          std.questions.forEach((q) => {
            if (q.ragStatus && q.ragStatus !== "grey" && profile[q.ragStatus] !== undefined) {
              profile[q.ragStatus]++
            }
          })
        })
        return [
          { name: "Red", value: profile.red },
          { name: "Amber", value: profile.amber },
          { name: "Green", value: profile.green },
        ]
      },

      getHighPriorityAreas: () => {
        const project = get().getActiveProject()
        if (!project) return []
        const areas: (Question & { standardName: string })[] = []
        project.standards.forEach((std) => {
          std.questions.forEach((q) => {
            if (q.ragStatus === "red" || q.ragStatus === "amber") {
              areas.push({ ...q, standardName: std.name })
            }
          })
        })
        return areas.sort((a, b) => (a.ragStatus === "red" && b.ragStatus !== "red" ? -1 : 1))
      },
    }),
    {
      name: "power-platform-assessment-storage",
      storage: createJSONStorage(() => localStorage),
      // This part is important for hydration with complex types like Date
      reviver: (key, value) => {
        if (key === "lastModifiedAt" && typeof value === "string") {
          return new Date(value)
        }
        return value
      },
    },
  ),
)
