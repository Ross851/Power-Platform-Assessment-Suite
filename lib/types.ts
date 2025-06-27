export type QuestionType =
  | "boolean"
  | "scale"
  | "percentage"
  | "text"
  | "numeric"
  | "multi-select"
  | "file-upload" // General file upload
  | "document-review" // Specific for document review with viewer

export type RAGStatus = "red" | "amber" | "green" | "grey"

export interface BestPractice {
  description: string
  link?: string
  linkText?: string
  suggestedActions?: string[]
}

export interface DeveloperGuidance {
  whatThisMeans: string
  whenNeeded: string[]
  implementationRequirements: string[]
  evidenceToLookFor: string[]
}

export interface AssessmentFeedback {
  howAssessed: string[]
  assessmentDate?: string
  reviewedBy?: string
  findings?: string
  limitations?: string
  recommendations?: string
}

export type EvidenceType = "file" | "snippet" | "link"

export interface Evidence {
  id: string // UUID from database
  type: EvidenceType
  title: string
  content: string // File name for 'file', text content for 'snippet'
  uploadedAt: string
  uploadedBy: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  weight: number
  category: string
  subcategory?: string
  guidance?: string
  bestPractice?: BestPractice
  developerGuidance?: DeveloperGuidance
  assessmentFeedback?: AssessmentFeedback
  options?: string[]
  answer?: any
  score?: number
  evidenceNotes?: string
  riskLevel?: "low" | "medium" | "high"
  ragStatus?: RAGStatus
  riskOwner?: string
  discovery?: string[]
  document?: {
    file?: File | null
    fileName?: string
    numPages?: number
    annotations?: Array<{ page: number; text: string; tags?: string[] }>
  }
  evidence: Evidence[]
  lastModified?: string
  required?: boolean
  helpText?: string
}

export interface AssessmentStandard {
  id: string
  slug: string
  name: string
  weight: number
  description: string
  questions: Question[]
  completion?: number
  maturityScore?: number
  ragStatus?: RAGStatus
}

export interface ProjectVersion {
  id: string
  name: string
  createdAt: Date
  standards: AssessmentStandard[]
}

export interface AnswerPayload {
  standardSlug: string
  questionId: string
  answer?: any
  evidenceNotes?: string
  documentData?: any
  riskOwner?: string
  evidence?: Evidence[]
  assessmentFeedback?: AssessmentFeedback
}

export interface GeneralDocument {
  id: string
  project_name: string
  file_path: string
  name: string
  type: string | null
  size: number | null
  description: string | null
  uploaded_at: string
  url?: string
}

export interface Project {
  id: string // from DB
  name: string // from DB
  client_name: string | null // from DB
  created_at: string // from DB
  clientReferenceNumber: string
  description?: string
  lastModifiedAt: string
  standards: AssessmentStandard[]
  versions: ProjectVersion[]
}

export interface RAGIndicator {
  status: "red" | "amber" | "green"
  score: number
  reasoning: string
  recommendations: string[]
}
