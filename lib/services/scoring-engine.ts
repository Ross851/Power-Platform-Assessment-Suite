import { Question, AssessmentStandard, RAGStatus, Project } from "@/lib/types"

export interface ScoreResult {
  overallScore: number
  overallRAG: RAGStatus
  standardScores: StandardScore[]
  riskProfile: RiskProfile
  recommendations: Recommendation[]
}

export interface StandardScore {
  standardName: string
  score: number
  ragStatus: RAGStatus
  completionPercentage: number
  criticalGaps: string[]
}

export interface RiskProfile {
  high: number
  medium: number
  low: number
  notAssessed: number
}

export interface Recommendation {
  priority: "critical" | "high" | "medium" | "low"
  category: string
  description: string
  impact: string
  effort: "low" | "medium" | "high"
}

export class ScoringEngine {
  calculateProjectScores(project: Project): ScoreResult {
    const standardScores = project.standards.map(standard => 
      this.calculateStandardScore(standard)
    )

    const overallScore = this.calculateOverallScore(standardScores, project.standards)
    const overallRAG = this.calculateOverallRAG(standardScores)
    const riskProfile = this.calculateRiskProfile(standardScores)
    const recommendations = this.generateRecommendations(project, standardScores)

    return {
      overallScore,
      overallRAG,
      standardScores,
      riskProfile,
      recommendations
    }
  }

  private calculateStandardScore(standard: AssessmentStandard): StandardScore {
    const questions = standard.questions || []
    const answeredQuestions = questions.filter(q => 
      q.isNotApplicable || this.isQuestionAnswered(q)
    )

    const completionPercentage = questions.length > 0
      ? (answeredQuestions.length / questions.length) * 100
      : 0

    let totalWeightedScore = 0
    let totalWeight = 0
    const criticalGaps: string[] = []

    answeredQuestions.forEach(question => {
      if (question.isNotApplicable) return

      const score = this.calculateQuestionScore(question)
      const weight = question.weight || 1

      totalWeightedScore += score * weight
      totalWeight += weight

      // Identify critical gaps
      if (score <= 2 && question.importance && question.importance >= 4) {
        criticalGaps.push(question.text)
      }
    })

    const score = totalWeight > 0 
      ? (totalWeightedScore / (totalWeight * 5)) * 5 
      : 0

    const ragStatus = this.calculateStandardRAG(answeredQuestions)

    return {
      standardName: standard.name,
      score,
      ragStatus,
      completionPercentage,
      criticalGaps
    }
  }

  private calculateQuestionScore(question: Question): number {
    switch (question.type) {
      case "boolean":
        return question.answer === true ? 5 : 1

      case "scale":
        return Number(question.answer) || 1

      case "percentage":
        const percentage = Number(question.answer) || 0
        if (percentage >= 75) return 5
        if (percentage >= 50) return 3
        if (percentage >= 25) return 2
        return 1

      case "document-review":
        return question.answer ? 3 : 1

      default:
        return question.answer ? 3 : 1
    }
  }

  private calculateQuestionRAG(question: Question): RAGStatus {
    if (question.isNotApplicable) return "not-applicable"
    if (!this.isQuestionAnswered(question)) return "grey"

    switch (question.type) {
      case "boolean":
        return question.answer === true ? "green" : "red"

      case "scale":
        const scaleValue = Number(question.answer)
        if (scaleValue >= 4) return "green"
        if (scaleValue === 3) return "amber"
        return "red"

      case "percentage":
        const percentage = Number(question.answer)
        if (percentage >= 75) return "green"
        if (percentage >= 25) return "amber"
        return "red"

      default:
        return question.answer ? "amber" : "grey"
    }
  }

  private calculateStandardRAG(questions: Question[]): RAGStatus {
    const ragStatuses = questions.map(q => this.calculateQuestionRAG(q))
    
    if (ragStatuses.some(status => status === "red")) return "red"
    if (ragStatuses.some(status => status === "amber")) return "amber"
    if (ragStatuses.every(status => status === "green" || status === "not-applicable")) return "green"
    return "grey"
  }

  private calculateOverallScore(
    standardScores: StandardScore[], 
    standards: AssessmentStandard[]
  ): number {
    let totalWeightedScore = 0
    let totalWeight = 0

    standardScores.forEach((score, index) => {
      if (score.completionPercentage > 0) {
        const weight = standards[index].weight || 10
        totalWeightedScore += score.score * weight
        totalWeight += weight
      }
    })

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
  }

  private calculateOverallRAG(standardScores: StandardScore[]): RAGStatus {
    const statuses = standardScores
      .filter(s => s.completionPercentage > 0)
      .map(s => s.ragStatus)

    if (statuses.length === 0) return "grey"
    if (statuses.some(s => s === "red")) return "red"
    if (statuses.some(s => s === "amber")) return "amber"
    if (statuses.every(s => s === "green")) return "green"
    return "grey"
  }

  private calculateRiskProfile(standardScores: StandardScore[]): RiskProfile {
    const profile = {
      high: 0,
      medium: 0,
      low: 0,
      notAssessed: 0
    }

    standardScores.forEach(score => {
      switch (score.ragStatus) {
        case "red":
          profile.high++
          break
        case "amber":
          profile.medium++
          break
        case "green":
          profile.low++
          break
        default:
          profile.notAssessed++
      }
    })

    return profile
  }

  private generateRecommendations(
    project: Project,
    standardScores: StandardScore[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Critical recommendations based on red standards
    standardScores
      .filter(s => s.ragStatus === "red")
      .forEach(score => {
        recommendations.push({
          priority: "critical",
          category: score.standardName,
          description: `Immediate action required for ${score.standardName}. Current score: ${score.score.toFixed(1)}/5.0`,
          impact: "High risk to platform security, compliance, or stability",
          effort: this.estimateEffort(score)
        })

        // Add specific recommendations for critical gaps
        score.criticalGaps.forEach(gap => {
          recommendations.push({
            priority: "high",
            category: score.standardName,
            description: gap,
            impact: "Direct impact on assessment score and risk profile",
            effort: "medium"
          })
        })
      })

    // High priority recommendations for amber standards
    standardScores
      .filter(s => s.ragStatus === "amber")
      .forEach(score => {
        recommendations.push({
          priority: "high",
          category: score.standardName,
          description: `Improvement needed for ${score.standardName}. Current score: ${score.score.toFixed(1)}/5.0`,
          impact: "Medium risk, potential for issues if not addressed",
          effort: this.estimateEffort(score)
        })
      })

    // General recommendations
    if (project.overallMaturityScore < 3) {
      recommendations.push({
        priority: "high",
        category: "Overall Maturity",
        description: "Overall platform maturity is below recommended levels. Focus on foundational governance and security practices.",
        impact: "Platform-wide improvements needed for sustainable growth",
        effort: "high"
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  private estimateEffort(score: StandardScore): "low" | "medium" | "high" {
    if (score.score >= 4) return "low"
    if (score.score >= 2.5) return "medium"
    return "high"
  }

  private isQuestionAnswered(question: Question): boolean {
    return question.answer !== undefined && 
           question.answer !== null && 
           question.answer !== ""
  }
}

// Export singleton instance
export const scoringEngine = new ScoringEngine()