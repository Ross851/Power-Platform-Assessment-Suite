import { microsoftAlignedQuestions } from "./microsoft-aligned-questions"
import type { AssessmentStandard, Question } from "./types"

// Map the flat object structure to the AssessmentStandard array
export const getMicrosoftAlignedStandards = (): AssessmentStandard[] => {
  const standards: AssessmentStandard[] = []

  // Helper to convert camelCase to Title Case
  const formatName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Iterate through the categories in the alignment file
  for (const [key, questions] of Object.entries(microsoftAlignedQuestions)) {
    // Cast the questions to any first to handle slight type mismatches gracefully
    // and then map them to our strict Question type
    const mappedQuestions: Question[] = (questions as any[]).map((q) => ({
      ...q,
      // Ensure required fields for the store exist
      answer: undefined,
      evidenceNotes: "",
      score: 0,
      riskLevel: undefined,
      ragStatus: "grey",
      // Map 'bestPractice' string to object if needed, or keep as string
      // The store supports string | BestPractice, so we are good.
    }))

    standards.push({
      slug: key,
      name: formatName(key),
      description: `Assessment of ${formatName(key)} capabilities aligned with Microsoft Best Practices.`,
      weight: 10, // Default weight
      questions: mappedQuestions,
      completion: 0,
      maturityScore: 0,
    })
  }

  return standards
}
