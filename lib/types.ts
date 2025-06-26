export type QuestionType =
  | "boolean"
  | "scale"
  | "percentage"
  | "text"
  | "numeric"
  | "multi-select"
  | "file-upload" // General file upload
  | "document-review" // Specific for document review with viewer

export type RAGStatus = "red" | "amber" | "green" | "grey" // Added grey for unassessed/neutral

export interface BestPractice {
  description: string
  link?: string
  linkText?: string
  suggestedActions?: string[] // New: for more specific mitigation steps
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  weight: number // For scoring
  category: string // For grouping or detailed analysis
  guidance?: string // New field for hints and guidance (UK English)
  bestPractice?: BestPractice // New field for best practice guidance
  options?: string[] // For scale or multi-select
  answer?: any
  score?: number // Calculated score for this question
  evidenceNotes?: string // For text area related to evidence
  riskLevel?: "low" | "medium" | "high" // Calculated risk
  ragStatus?: RAGStatus // New field for RAG status
  riskOwner?: string // New: to assign an owner to the risk identified by this question
  document?: {
    file?: File | null
    fileName?: string
    numPages?: number
    annotations?: Array<{ page: number; text: string; tags?: string[] }>
  }
}

export interface AssessmentStandard {
  slug: string
  name: string
  weight: number // Overall weight of this standard in the assessment
  description: string
  questions: Question[]
  completion?: number // Percentage completion for this standard
  maturityScore?: number // Maturity score for this standard
  ragStatus?: RAGStatus // New field for RAG status
}

export interface AnswerPayload {
  standardSlug: string
  questionId: string
  answer: any
  evidenceNotes?: string
  documentData?: any // For document review type
  riskOwner?: string // New
}

// This type now reflects the DB schema, not the temporary client-side file object
export interface GeneralDocument {
  id: string
  project_name: string
  file_path: string
  name: string
  type: string | null
  size: number | null
  description: string | null
  uploaded_at: string // Comes as string from DB
  url?: string // Optional public URL for the file
}

export interface Project {
  name: string
  clientReferenceNumber: string // Now mandatory
  standards: AssessmentStandard[]
  createdAt: Date
  lastModifiedAt: Date
}
