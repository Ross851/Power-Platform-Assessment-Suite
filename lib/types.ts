export type QuestionType =
  | "boolean"
  | "scale"
  | "percentage"
  | "text"
  | "numeric"
  | "multi-select"
  | "file-upload" // General file upload
  | "document-review" // Specific for document review with viewer

export type RAGStatus = "red" | "amber" | "green" | "grey" | "not-applicable" // Added not-applicable

export interface BestPractice {
  description: string
  link?: string
  linkText?: string
  suggestedActions?: string[] // New: for more specific mitigation steps
  futureGuidance?: string[] // New: guidance for when they're ready to adopt this area
}

// New interfaces for timestamped entries
export interface TimestampedCodeSnippet {
  id: string
  code: string
  language?: string // e.g., 'powershell', 'javascript', 'json'
  title?: string
  description?: string
  createdAt: Date
  updatedAt?: Date
  author?: string
}

export interface TimestampedDocument {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadDate: Date
  description?: string
  author?: string
}

export interface TimestampedFeedback {
  id: string
  feedback: string
  type: 'finding' | 'recommendation' | 'observation'
  createdAt: Date
  author?: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  weight: number // For scoring
  category: string // For grouping or detailed analysis
  guidance?: string // New field for hints and guidance (UK English)
  bestPractice?: BestPractice // New field for best practice guidance
  notApplicableGuidance?: string // New: specific guidance when feature isn't used yet
  options?: string[] // For scale or multi-select
  answer?: any
  score?: number // Calculated score for this question
  evidenceNotes?: string // For text area related to evidence
  // Enhanced fields to support multiple timestamped entries
  codeSnippets?: string // Deprecated - for backward compatibility
  codeSnippetsList?: TimestampedCodeSnippet[] // New: multiple code snippets with timestamps
  developerFeedback?: string // Deprecated - for backward compatibility
  developerFeedbackList?: TimestampedFeedback[] // New: multiple feedback entries with timestamps
  developerRecommendations?: string // Deprecated - for backward compatibility
  developerRecommendationsList?: TimestampedFeedback[] // New: multiple recommendation entries with timestamps
  documentsList?: TimestampedDocument[] // New: multiple documents with timestamps
  riskLevel?: "low" | "medium" | "high" | "not-applicable" // Calculated risk
  ragStatus?: RAGStatus // New field for RAG status
  riskOwner?: string // New: to assign an owner to the risk identified by this question
  isNotApplicable?: boolean // New: flag to mark as not applicable
  adoptionTimeline?: string // New: when they plan to adopt this area
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

// New type for general programme documents
export interface GeneralDocument {
  id: string
  file: File // The actual File object
  name: string
  type: string
  size: number // in bytes
  uploadedAt: Date
  description?: string // Optional description
}

export interface AssessmentMetadata {
  assessorName: string
  assessorRole?: string
  assessorEmail?: string
  assessmentDate: Date
  reviewNotes?: string
}

export interface Project {
  name: string
  standards: AssessmentStandard[]
  generalDocuments: GeneralDocument[]
  createdAt: Date
  lastModifiedAt: Date
  assessmentMetadata?: AssessmentMetadata // Who conducted the assessment
}
