// This file integrates the new assessment categories into the main assessment standards

import { ASSESSMENT_STANDARDS } from "./constants"
import { 
  powerAppsComplexityQuestions, 
  powerAutomateSecurityQuestions, 
  powerPagesPerformanceQuestions,
  newAssessmentStandards
} from "./new-assessment-categories"
import type { AssessmentStandard } from "./types"

// Add questions to the new assessment standards
const integratedNewStandards: AssessmentStandard[] = [
  {
    ...newAssessmentStandards[0], // Power Apps Complexity
    questions: powerAppsComplexityQuestions,
  },
  {
    ...newAssessmentStandards[1], // Power Automate Security
    questions: powerAutomateSecurityQuestions,
  },
  {
    ...newAssessmentStandards[2], // Power Pages Performance  
    questions: powerPagesPerformanceQuestions,
  },
]

// Export the complete assessment standards including new categories
export const enhancedAssessmentStandards: AssessmentStandard[] = [
  ...ASSESSMENT_STANDARDS,
  ...integratedNewStandards,
]

// Update the assessmentStandards export to use the enhanced version
export const assessmentStandards = enhancedAssessmentStandards