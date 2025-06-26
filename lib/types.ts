export type Question = {
  id: string
  text: string
  type: "boolean" | "numeric" | "percentage" | "scale" | "text" | "document-review"
  category: string
  guidance: string
  discovery?: string
  bestPractice?: string
}

export type AssessmentStandard = {
  slug: string
  name: string
  description: string
  questions: Question[]
}

export type Answer = {
  questionId: string
  value: any
  notes?: string
  ragStatus?: "red" | "amber" | "green"
}

export type AssessmentState = {
  answers: { [questionId: string]: Answer }
  setAnswer: (answer: Answer) => void
  getAnswer: (questionId: string) => Answer | undefined
}

export type GeneralDocument = {
  id: string
  project_name: string
  file_path: string
  name: string
  type: string
  size: number
  description: string
  uploaded_at: string
  url: string
}

export type Evidence = {
  id: string
  type: "file" | "snippet"
  content: string
  url?: string
  uploadedAt: string
}

export type Project = {
  id: string
  name: string
  client_name: string | null
  created_at: string
}
