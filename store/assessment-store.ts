import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project, Question, AnswerPayload, RAGStatus } from "@/lib/types"
import { ASSESSMENT_STANDARDS } from "@/lib/constants"

interface AssessmentState {
  projects: Project[]
  activeProjectName: string | null

  // Project management
  addProject: (project: Omit<Project, "standards" | "lastModifiedAt" | "versions">) => void
  setActiveProject: (projectName: string) => void
  getActiveProject: () => Project | null
  getProjectProgress: (projectName?: string) => number

  // Answer management
  setAnswer: (payload: AnswerPayload) => void

  // Scoring and analysis
  calculateScoresAndRAG: () => void
  getOverallProgress: () => number
  getOverallMaturityScore: () => number
  getOverallRAGStatus: () => RAGStatus
  getRiskProfile: () => { high: number; medium: number; low: number }
  getHighPriorityAreas: () => Array<{
    standardName: string
    standardSlug: string
    questionId?: string
    questionText?: string
    ragStatus: RAGStatus
    riskOwner?: string
  }>

  // Standard-specific functions
  getStandardProgress: (standardSlug: string) => number
  getStandardMaturityScore: (standardSlug: string) => number
  getStandardRAGStatus: (standardSlug: string) => RAGStatus
}

const calculateQuestionScore = (question: Question): number => {
  if (question.answer === undefined || question.answer === null || question.answer === "") {
    return 0
  }

  switch (question.type) {
    case "boolean":
      return question.answer === true ? 5 : 1
    case "scale":
      return typeof question.answer === "number" ? question.answer : 0
    case "percentage":
      return typeof question.answer === "number" ? Math.round((question.answer / 100) * 5) : 0
    case "text":
      return question.answer && question.answer.length > 10 ? 3 : 1
    case "numeric":
      return typeof question.answer === "number" && question.answer > 0 ? 4 : 1
    case "document-review":
      return typeof question.answer === "number" ? question.answer : 0
    default:
      return 0
  }
}

const calculateRAGStatus = (score: number): RAGStatus => {
  if (score >= 4) return "green"
  if (score >= 2.5) return "amber"
  if (score > 0) return "red"
  return "grey"
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectName: null,

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          standards: ASSESSMENT_STANDARDS.map((standard) => ({
            ...standard,
            questions: standard.questions.map((q) => ({ ...q, evidence: [] })),
          })),
          lastModifiedAt: new Date(),
          versions: [],
        }

        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectName: newProject.name,
        }))
      },

      setActiveProject: (projectName) => {
        set({ activeProjectName: projectName })
      },

      getActiveProject: () => {
        const { projects, activeProjectName } = get()
        return projects.find((p) => p.name === activeProjectName) || null
      },

      getProjectProgress: (projectName) => {
        const { projects, activeProjectName } = get()
        const targetProject = projectName
          ? projects.find((p) => p.name === projectName)
          : projects.find((p) => p.name === activeProjectName)

        if (!targetProject) return 0

        const totalQuestions = targetProject.standards.reduce((sum, standard) => sum + standard.questions.length, 0)
        const answeredQuestions = targetProject.standards.reduce(
          (sum, standard) =>
            sum +
            standard.questions.filter((q) => q.answer !== undefined && q.answer !== null && q.answer !== "").length,
          0,
        )

        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
      },

      setAnswer: (payload) => {
        set((state) => {
          const updatedProjects = state.projects.map((project) => {
            if (project.name !== state.activeProjectName) return project

            return {
              ...project,
              lastModifiedAt: new Date(),
              standards: project.standards.map((standard) => {
                if (standard.slug !== payload.standardSlug) return standard

                return {
                  ...standard,
                  questions: standard.questions.map((question) => {
                    if (question.id !== payload.questionId) return question

                    const updatedQuestion = { ...question }

                    if (payload.answer !== undefined) {
                      updatedQuestion.answer = payload.answer
                    }
                    if (payload.evidenceNotes !== undefined) {
                      updatedQuestion.evidenceNotes = payload.evidenceNotes
                    }
                    if (payload.riskOwner !== undefined) {
                      updatedQuestion.riskOwner = payload.riskOwner
                    }
                    if (payload.evidence !== undefined) {
                      updatedQuestion.evidence = payload.evidence
                    }
                    if (payload.assessmentFeedback !== undefined) {
                      updatedQuestion.assessmentFeedback = payload.assessmentFeedback
                    }

                    // Recalculate score and RAG status
                    updatedQuestion.score = calculateQuestionScore(updatedQuestion)
                    updatedQuestion.ragStatus = calculateRAGStatus(updatedQuestion.score)

                    // Determine risk level
                    if (updatedQuestion.score >= 4) {
                      updatedQuestion.riskLevel = "low"
                    } else if (updatedQuestion.score >= 2.5) {
                      updatedQuestion.riskLevel = "medium"
                    } else {
                      updatedQuestion.riskLevel = "high"
                    }

                    return updatedQuestion
                  }),
                }
              }),
            }
          })

          return { projects: updatedProjects }
        })

        // Trigger recalculation
        get().calculateScoresAndRAG()
      },

      calculateScoresAndRAG: () => {
        set((state) => {
          const updatedProjects = state.projects.map((project) => ({
            ...project,
            standards: project.standards.map((standard) => {
              const answeredQuestions = standard.questions.filter(
                (q) => q.answer !== undefined && q.answer !== null && q.answer !== "",
              )

              const completion =
                standard.questions.length > 0 ? (answeredQuestions.length / standard.questions.length) * 100 : 0

              const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0)
              const maturityScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0

              const ragStatus = calculateRAGStatus(maturityScore)

              return {
                ...standard,
                completion,
                maturityScore,
                ragStatus,
              }
            }),
          }))

          return { projects: updatedProjects }
        })
      },

      getOverallProgress: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return 0

        const totalQuestions = activeProject.standards.reduce((sum, standard) => sum + standard.questions.length, 0)
        const answeredQuestions = activeProject.standards.reduce(
          (sum, standard) =>
            sum +
            standard.questions.filter((q) => q.answer !== undefined && q.answer !== null && q.answer !== "").length,
          0,
        )

        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0
      },

      getOverallMaturityScore: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return 0

        const allAnsweredQuestions = activeProject.standards.flatMap((standard) =>
          standard.questions.filter((q) => q.answer !== undefined && q.answer !== null && q.answer !== ""),
        )

        if (allAnsweredQuestions.length === 0) return 0

        const totalScore = allAnsweredQuestions.reduce((sum, q) => sum + (q.score || 0), 0)
        return totalScore / allAnsweredQuestions.length
      },

      getOverallRAGStatus: () => {
        const maturityScore = get().getOverallMaturityScore()
        return calculateRAGStatus(maturityScore)
      },

      getRiskProfile: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return { high: 0, medium: 0, low: 0 }

        const allQuestions = activeProject.standards.flatMap((standard) => standard.questions)
        const answeredQuestions = allQuestions.filter(
          (q) => q.answer !== undefined && q.answer !== null && q.answer !== "",
        )

        return answeredQuestions.reduce(
          (profile, question) => {
            if (question.riskLevel === "high") profile.high++
            else if (question.riskLevel === "medium") profile.medium++
            else if (question.riskLevel === "low") profile.low++
            return profile
          },
          { high: 0, medium: 0, low: 0 },
        )
      },

      getHighPriorityAreas: () => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return []

        const highPriorityAreas: Array<{
          standardName: string
          standardSlug: string
          questionId?: string
          questionText?: string
          ragStatus: RAGStatus
          riskOwner?: string
        }> = []

        activeProject.standards.forEach((standard) => {
          standard.questions.forEach((question) => {
            if (question.ragStatus === "red" || (question.ragStatus === "amber" && question.riskLevel === "high")) {
              highPriorityAreas.push({
                standardName: standard.name,
                standardSlug: standard.slug,
                questionId: question.id,
                questionText: question.text,
                ragStatus: question.ragStatus,
                riskOwner: question.riskOwner,
              })
            }
          })
        })

        return highPriorityAreas.sort((a, b) => {
          if (a.ragStatus === "red" && b.ragStatus !== "red") return -1
          if (b.ragStatus === "red" && a.ragStatus !== "red") return 1
          return 0
        })
      },

      getStandardProgress: (standardSlug) => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return 0

        const standard = activeProject.standards.find((s) => s.slug === standardSlug)
        if (!standard) return 0

        const answeredQuestions = standard.questions.filter(
          (q) => q.answer !== undefined && q.answer !== null && q.answer !== "",
        )

        return standard.questions.length > 0 ? (answeredQuestions.length / standard.questions.length) * 100 : 0
      },

      getStandardMaturityScore: (standardSlug) => {
        const activeProject = get().getActiveProject()
        if (!activeProject) return 0

        const standard = activeProject.standards.find((s) => s.slug === standardSlug)
        if (!standard) return 0

        const answeredQuestions = standard.questions.filter(
          (q) => q.answer !== undefined && q.answer !== null && q.answer !== "",
        )

        if (answeredQuestions.length === 0) return 0

        const totalScore = answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0)
        return totalScore / answeredQuestions.length
      },

      getStandardRAGStatus: (standardSlug) => {
        const maturityScore = get().getStandardMaturityScore(standardSlug)
        return calculateRAGStatus(maturityScore)
      },
    }),
    {
      name: "assessment-storage",
      partialize: (state) => ({
        projects: state.projects,
        activeProjectName: state.activeProjectName,
      }),
    },
  ),
)
