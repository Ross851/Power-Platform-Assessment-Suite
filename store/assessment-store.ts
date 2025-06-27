import { create } from "zustand"
import { persist, type StateStorage } from "zustand/middleware"
import type { AssessmentStandard, AnswerPayload, RAGStatus, GeneralDocument, Project, AssessmentMetadata } from "@/lib/types" // Added Project
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

interface AssessmentState {
  projects: Project[] // Store multiple projects
  activeProjectName: string | null // Name of the currently active project

  // Project Management Actions
  createProject: (projectName: string) => void
  setActiveProject: (projectName: string) => void
  getActiveProject: () => Project | undefined
  deleteProject: (projectName: string) => void // Optional: for later

  // Assessor Management
  setAssessmentMetadata: (metadata: AssessmentMetadata) => void
  getAssessmentMetadata: () => AssessmentMetadata | undefined

  // Existing actions, now need to be context-aware of the active project
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
  }>
  addGeneralDocument: (file: File, description?: string) => void
  removeGeneralDocument: (documentId: string) => void
}

const customStorage: StateStorage = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    const { state, version } = JSON.parse(str)
    // Revive Date objects and handle generalDocuments within each project
    const revivedState = {
      ...state,
      projects: (state.projects || []).map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        lastModifiedAt: new Date(project.lastModifiedAt),
        generalDocuments: (project.generalDocuments || []).map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
          file: null, // File object is not persisted
        })),
        assessmentMetadata: project.assessmentMetadata ? {
          ...project.assessmentMetadata,
          assessmentDate: new Date(project.assessmentMetadata.assessmentDate)
        } : undefined,
        // Potentially revive dates within standards/questions if any were added
      })),
    }
    return { state: revivedState, version }
  },
  setItem: (name, newValue) => {
    const modifiedState = {
      ...newValue.state,
      projects: newValue.state.projects.map((project: Project) => ({
        ...project,
        generalDocuments: project.generalDocuments.map(
          ({ file, ...restOfDoc }: GeneralDocument) => restOfDoc, // eslint-disable-line @typescript-eslint/no-unused-vars
        ),
      })),
    }
    localStorage.setItem(name, JSON.stringify({ state: modifiedState, version: newValue.version }))
  },
  removeItem: (name) => localStorage.removeItem(name),
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectName: null,

      createProject: (projectName) => {
        if (get().projects.find((p) => p.name === projectName)) {
          alert(`Project "${projectName}" already exists.`) // Or handle more gracefully
          return
        }
        const newProject: Project = {
          name: projectName,
          standards: createInitialProjectStandards(),
          generalDocuments: [],
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

      setAssessmentMetadata: (metadata) =>
        set((state) => {
          const activeProject = state.projects.find((p) => p.name === state.activeProjectName)
          if (!activeProject) return state

          const updatedProject = { 
            ...activeProject, 
            assessmentMetadata: metadata,
            lastModifiedAt: new Date() 
          }
          return {
            projects: state.projects.map((p) => (p.name === state.activeProjectName ? updatedProject : p)),
          }
        }),

      getAssessmentMetadata: () => {
        const activeProject = get().getActiveProject()
        return activeProject?.assessmentMetadata
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
                      codeSnippets: documentData?.codeSnippets || q.codeSnippets,
                      codeSnippetsList: documentData?.codeSnippetsList || q.codeSnippetsList,
                      developerFeedback: documentData?.developerFeedback || q.developerFeedback,
                      developerFeedbackList: documentData?.developerFeedbackList || q.developerFeedbackList,
                      developerRecommendations: documentData?.developerRecommendations || q.developerRecommendations,
                      developerRecommendationsList: documentData?.developerRecommendationsList || q.developerRecommendationsList,
                      document: documentData ? { ...q.document, ...documentData } : q.document,
                      riskOwner: riskOwner !== undefined ? riskOwner : q.riskOwner,
                      isNotApplicable: documentData?.isNotApplicable || q.isNotApplicable,
                      adoptionTimeline: documentData?.adoptionTimeline || q.adoptionTimeline,
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
                    case "document-review": // Assuming document review implies some level of maturity if present
                      const hasContent = q.answer || (q.document?.annotations && q.document.annotations.length > 0)
                      questionScore = hasContent ? 3 : 1 // Simplified: 3 if assessed, 1 if not/empty
                      riskLevel = hasContent ? "medium" : "low" // Or high if absence is critical
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
            // Accumulate RAG for overall project status from other standards too
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
            else projectOverallRagStatus = "grey" // All answered are grey (e.g. text only)
          } else {
            projectOverallRagStatus = "grey" // No questions answered in the project
          }

          // Note: This simple overall RAG might need more nuance, e.g. weighting standards
          // For now, any red makes project red, any amber (no red) makes it amber.

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
                })
              }
            })
            // If the standard itself is red/amber but no specific question is, add the standard
            if (
              !std.questions.some((q) => q.ragStatus === "red" || q.ragStatus === "amber") &&
              (std.completion || 0) > 0
            ) {
              highPriority.push({
                standardName: std.name,
                standardSlug: std.slug,
                ragStatus: std.ragStatus!,
              })
            }
          }
        })
        // Sort by RAG status (red first), then by standard name
        return highPriority.sort((a, b) => {
          if (a.ragStatus === "red" && b.ragStatus !== "red") return -1
          if (a.ragStatus !== "red" && b.ragStatus === "red") return 1
          if (a.ragStatus === "amber" && b.ragStatus === "green") return -1
          if (a.ragStatus === "green" && b.ragStatus === "amber") return 1
          return a.standardName.localeCompare(b.standardName)
        })
      },

      addGeneralDocument: (file, description) =>
        set((state) => {
          const activeProject = state.projects.find((p) => p.name === state.activeProjectName)
          if (!activeProject) return state

          const newDoc: GeneralDocument = {
            id: crypto.randomUUID(),
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(),
            description,
          }
          const updatedProject = {
            ...activeProject,
            generalDocuments: [...activeProject.generalDocuments, newDoc],
            lastModifiedAt: new Date(),
          }
          return {
            projects: state.projects.map((p) => (p.name === state.activeProjectName ? updatedProject : p)),
          }
        }),

      removeGeneralDocument: (documentId) =>
        set((state) => {
          const activeProject = state.projects.find((p) => p.name === state.activeProjectName)
          if (!activeProject) return state

          const updatedProject = {
            ...activeProject,
            generalDocuments: activeProject.generalDocuments.filter((doc) => doc.id !== documentId),
            lastModifiedAt: new Date(),
          }
          return {
            projects: state.projects.map((p) => (p.name === state.activeProjectName ? updatedProject : p)),
          }
        }),
    }),
    {
      name: "power-platform-assessment-storage-v2", // Changed name to avoid conflicts with old structure
      storage: customStorage,
    },
  ),
)
