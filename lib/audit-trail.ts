// Audit Trail System for Compliance and Score Tracking
import { SecurityRecommendation } from './microsoft-2025-assessment-framework'

export interface AuditEntry {
  id: string
  timestamp: Date
  type: 'task_completed' | 'evidence_uploaded' | 'score_updated' | 'assessment_changed'
  category: string
  pillar: string
  user: string
  details: {
    taskId?: string
    taskName?: string
    recommendationTitle?: string
    evidenceFiles?: string[]
    previousScore?: number
    newScore?: number
    scoreImprovement?: number
    completionPercentage?: number
    verificationStatus?: 'pending' | 'verified' | 'failed'
  }
  metadata: {
    ipAddress?: string
    sessionId?: string
    environmentId?: string
    organizationId?: string
  }
}

export interface AuditTrail {
  entries: AuditEntry[]
  lastUpdated: Date
  totalImprovements: number
  verifiedImprovements: number
  baseline?: BaselineSnapshot
  currentSnapshot?: AssessmentSnapshot
}

export interface BaselineSnapshot {
  timestamp: Date
  overallScore: number
  pillarScores: Record<string, number>
  gaps: Gap[]
  totalRecommendations: number
  criticalRecommendations: number
}

export interface AssessmentSnapshot {
  timestamp: Date
  overallScore: number
  pillarScores: Record<string, number>
  completedTasks: number
  totalTasks: number
  evidenceUploaded: number
  gapsClosed: number
  improvementRate: number
}

export interface Gap {
  pillar: string
  baselineScore: number
  targetScore: number
  gap: number
  status: 'open' | 'in_progress' | 'closed'
  tasksRequired: number
  tasksCompleted: number
}

export interface ScoreImpact {
  pillar: string
  category: string
  baselineScore: number
  currentScore: number
  projectedScore: number
  improvement: number
  completedTasks: number
  totalTasks: number
  evidenceUploaded: boolean
  verificationStatus: 'pending' | 'verified' | 'failed'
}

// Calculate score impact when tasks are completed
export function calculateScoreImpact(
  recommendation: SecurityRecommendation,
  completedTasks: string[],
  totalTasks: number,
  hasEvidence: boolean,
  currentPillarScore: number
): ScoreImpact {
  // Base improvement based on impact level
  const impactMultiplier = recommendation.impact === 'High' ? 0.15 : 
                          recommendation.impact === 'Medium' ? 0.10 : 0.05
  
  // Calculate completion percentage
  const completionPercentage = completedTasks.length / totalTasks
  
  // Evidence bonus
  const evidenceBonus = hasEvidence ? 0.02 : 0
  
  // Calculate projected improvement
  const maxImprovement = impactMultiplier * 100
  const actualImprovement = (maxImprovement * completionPercentage) + (evidenceBonus * 100)
  
  // Calculate projected score
  const projectedScore = Math.min(100, currentPillarScore + actualImprovement)
  
  return {
    pillar: recommendation.category,
    category: recommendation.category,
    baselineScore: currentPillarScore,
    currentScore: currentPillarScore,
    projectedScore: projectedScore,
    improvement: projectedScore - currentPillarScore,
    completedTasks: completedTasks.length,
    totalTasks: totalTasks,
    evidenceUploaded: hasEvidence,
    verificationStatus: hasEvidence ? 'pending' : 'pending'
  }
}

// Create audit entry for task completion
export function createTaskCompletionAuditEntry(
  taskId: string,
  taskName: string,
  recommendationTitle: string,
  pillar: string,
  user: string,
  scoreImpact: ScoreImpact
): AuditEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    type: 'task_completed',
    category: scoreImpact.category,
    pillar: pillar,
    user: user,
    details: {
      taskId,
      taskName,
      recommendationTitle,
      previousScore: scoreImpact.currentScore,
      newScore: scoreImpact.projectedScore,
      scoreImprovement: scoreImpact.improvement,
      completionPercentage: (scoreImpact.completedTasks / scoreImpact.totalTasks) * 100
    },
    metadata: {
      sessionId: `session-${Date.now()}`,
      environmentId: 'production'
    }
  }
}

// Create audit entry for evidence upload
export function createEvidenceUploadAuditEntry(
  recommendationTitle: string,
  pillar: string,
  evidenceFiles: string[],
  user: string
): AuditEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    type: 'evidence_uploaded',
    category: pillar,
    pillar: pillar,
    user: user,
    details: {
      recommendationTitle,
      evidenceFiles,
      verificationStatus: 'pending'
    },
    metadata: {
      sessionId: `session-${Date.now()}`,
      environmentId: 'production'
    }
  }
}

// Create audit entry for score update
export function createScoreUpdateAuditEntry(
  pillar: string,
  previousScore: number,
  newScore: number,
  user: string,
  reason: string
): AuditEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    type: 'score_updated',
    category: pillar,
    pillar: pillar,
    user: user,
    details: {
      previousScore,
      newScore,
      scoreImprovement: newScore - previousScore
    },
    metadata: {
      sessionId: `session-${Date.now()}`,
      environmentId: 'production'
    }
  }
}

// Generate audit report
export function generateAuditReport(auditTrail: AuditTrail): AuditReport {
  const entries = auditTrail.entries
  
  // Group by pillar
  const pillarSummary = entries.reduce((acc, entry) => {
    if (!acc[entry.pillar]) {
      acc[entry.pillar] = {
        totalTasks: 0,
        completedTasks: 0,
        evidenceUploaded: 0,
        scoreImprovement: 0,
        entries: []
      }
    }
    
    if (entry.type === 'task_completed') {
      acc[entry.pillar].completedTasks++
    }
    if (entry.type === 'evidence_uploaded') {
      acc[entry.pillar].evidenceUploaded++
    }
    if (entry.details.scoreImprovement) {
      acc[entry.pillar].scoreImprovement += entry.details.scoreImprovement
    }
    
    acc[entry.pillar].entries.push(entry)
    return acc
  }, {} as Record<string, any>)
  
  // Calculate compliance score
  const totalImprovements = entries.filter(e => e.type === 'score_updated').length
  const verifiedImprovements = entries.filter(e => 
    e.type === 'score_updated' && e.details.verificationStatus === 'verified'
  ).length
  
  const complianceScore = totalImprovements > 0 
    ? (verifiedImprovements / totalImprovements) * 100 
    : 0
  
  return {
    generatedAt: new Date(),
    period: {
      start: entries.length > 0 ? entries[0].timestamp : new Date(),
      end: new Date()
    },
    summary: {
      totalEntries: entries.length,
      tasksCompleted: entries.filter(e => e.type === 'task_completed').length,
      evidenceUploaded: entries.filter(e => e.type === 'evidence_uploaded').length,
      scoreUpdates: entries.filter(e => e.type === 'score_updated').length,
      complianceScore: complianceScore
    },
    pillarBreakdown: pillarSummary,
    timeline: generateTimeline(entries),
    recommendations: generateAuditRecommendations(pillarSummary)
  }
}

export interface AuditReport {
  generatedAt: Date
  period: {
    start: Date
    end: Date
  }
  summary: {
    totalEntries: number
    tasksCompleted: number
    evidenceUploaded: number
    scoreUpdates: number
    complianceScore: number
  }
  pillarBreakdown: Record<string, {
    totalTasks: number
    completedTasks: number
    evidenceUploaded: number
    scoreImprovement: number
    entries: AuditEntry[]
  }>
  timeline: TimelineEvent[]
  recommendations: string[]
}

export interface TimelineEvent {
  date: Date
  type: string
  description: string
  user: string
  impact: 'high' | 'medium' | 'low'
}

function generateTimeline(entries: AuditEntry[]): TimelineEvent[] {
  return entries
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .map(entry => ({
      date: entry.timestamp,
      type: entry.type,
      description: getEventDescription(entry),
      user: entry.user,
      impact: getEventImpact(entry)
    }))
}

function getEventDescription(entry: AuditEntry): string {
  switch (entry.type) {
    case 'task_completed':
      return `Completed task: ${entry.details.taskName} (${entry.details.completionPercentage?.toFixed(0)}% progress)`
    case 'evidence_uploaded':
      return `Uploaded ${entry.details.evidenceFiles?.length} evidence file(s) for ${entry.details.recommendationTitle}`
    case 'score_updated':
      return `Score improved by ${entry.details.scoreImprovement?.toFixed(1)} points in ${entry.pillar}`
    case 'assessment_changed':
      return `Assessment updated for ${entry.category}`
    default:
      return 'Unknown event'
  }
}

function getEventImpact(entry: AuditEntry): 'high' | 'medium' | 'low' {
  if (entry.type === 'score_updated' && entry.details.scoreImprovement && entry.details.scoreImprovement > 10) {
    return 'high'
  }
  if (entry.type === 'task_completed' && entry.details.completionPercentage && entry.details.completionPercentage === 100) {
    return 'high'
  }
  if (entry.type === 'evidence_uploaded') {
    return 'medium'
  }
  return 'low'
}

function generateAuditRecommendations(pillarSummary: Record<string, any>): string[] {
  const recommendations: string[] = []
  
  Object.entries(pillarSummary).forEach(([pillar, data]) => {
    if (data.completedTasks > 0 && data.evidenceUploaded === 0) {
      recommendations.push(`Upload evidence for completed tasks in ${pillar} to verify improvements`)
    }
    
    if (data.scoreImprovement < 5 && data.completedTasks > 3) {
      recommendations.push(`Review task impact calculations for ${pillar} - minimal score improvement despite completion`)
    }
    
    const completionRate = data.completedTasks / (data.totalTasks || 1)
    if (completionRate < 0.5) {
      recommendations.push(`Focus on completing remaining tasks in ${pillar} (${Math.round(completionRate * 100)}% complete)`)
    }
  })
  
  return recommendations
}

// Export functions for persisting audit trail
export function serializeAuditTrail(auditTrail: AuditTrail): string {
  return JSON.stringify(auditTrail, null, 2)
}

export function deserializeAuditTrail(data: string): AuditTrail {
  const parsed = JSON.parse(data)
  return {
    ...parsed,
    entries: parsed.entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    })),
    lastUpdated: new Date(parsed.lastUpdated)
  }
}

// Calculate real-time maturity score based on completed tasks and evidence
export function calculateRealTimeMaturityScore(
  currentScore: number,
  completedTasks: number,
  totalTasks: number,
  evidenceUploaded: boolean,
  verificationStatus: 'pending' | 'verified' | 'failed'
): number {
  const completionBonus = (completedTasks / totalTasks) * 15 // Up to 15 points for task completion
  const evidenceBonus = evidenceUploaded ? 5 : 0 // 5 points for evidence
  const verificationBonus = verificationStatus === 'verified' ? 5 : 0 // Additional 5 points for verified evidence
  
  return Math.min(100, currentScore + completionBonus + evidenceBonus + verificationBonus)
}

// Create baseline snapshot when assessment starts
export function createBaselineSnapshot(
  overallScore: number,
  pillarScores: Record<string, number>,
  recommendations: any[]
): BaselineSnapshot {
  const gaps: Gap[] = Object.entries(pillarScores).map(([pillar, score]) => ({
    pillar,
    baselineScore: score,
    targetScore: 100, // Target is always 100% maturity
    gap: 100 - score,
    status: 'open' as const,
    tasksRequired: recommendations.filter(r => 
      r.category.toLowerCase() === pillar.toLowerCase()
    ).reduce((sum, r) => sum + (r.implementationRoadmap?.phases?.reduce(
      (phaseSum: number, phase: any) => phaseSum + (phase.tasks?.length || 0), 0
    ) || 0), 0),
    tasksCompleted: 0
  }))

  return {
    timestamp: new Date(),
    overallScore,
    pillarScores,
    gaps,
    totalRecommendations: recommendations.length,
    criticalRecommendations: recommendations.filter(r => r.impact === 'High').length
  }
}

// Calculate current assessment snapshot
export function createAssessmentSnapshot(
  baseline: BaselineSnapshot,
  currentPillarScores: Record<string, number>,
  taskTracking: Record<string, any>,
  uploadedFiles: Record<string, any[]>
): AssessmentSnapshot {
  let completedTasks = 0
  let totalTasks = 0
  let evidenceUploaded = 0

  // Count completed tasks
  Object.values(taskTracking).forEach(tracking => {
    totalTasks++
    if (tracking.currentStatus === 'Completed') {
      completedTasks++
    }
  })

  // Count evidence uploads
  Object.values(uploadedFiles).forEach(files => {
    if (files.length > 0) {
      evidenceUploaded++
    }
  })

  // Calculate gaps closed
  let gapsClosed = 0
  baseline.gaps.forEach(gap => {
    const currentScore = currentPillarScores[gap.pillar.toLowerCase()] || gap.baselineScore
    const improvement = currentScore - gap.baselineScore
    if (improvement >= gap.gap * 0.8) { // 80% or more of gap closed
      gapsClosed++
    }
  })

  // Calculate overall score
  const overallScore = Object.values(currentPillarScores).reduce((sum, score) => sum + score, 0) / 
                      Object.values(currentPillarScores).length

  // Calculate improvement rate (percentage of original gap closed)
  const totalOriginalGap = baseline.gaps.reduce((sum, gap) => sum + gap.gap, 0)
  const currentTotalGap = baseline.gaps.reduce((sum, gap) => {
    const currentScore = currentPillarScores[gap.pillar.toLowerCase()] || gap.baselineScore
    return sum + (100 - currentScore)
  }, 0)
  const improvementRate = totalOriginalGap > 0 ? 
    ((totalOriginalGap - currentTotalGap) / totalOriginalGap) * 100 : 0

  return {
    timestamp: new Date(),
    overallScore,
    pillarScores: currentPillarScores,
    completedTasks,
    totalTasks,
    evidenceUploaded,
    gapsClosed,
    improvementRate
  }
}

// Calculate gap closure progress
export function calculateGapClosure(
  baseline: BaselineSnapshot,
  current: AssessmentSnapshot
): GapClosureAnalysis {
  const gapProgress = baseline.gaps.map(gap => {
    const currentScore = current.pillarScores[gap.pillar.toLowerCase()] || gap.baselineScore
    const improvement = currentScore - gap.baselineScore
    const percentageClosed = gap.gap > 0 ? (improvement / gap.gap) * 100 : 0

    return {
      pillar: gap.pillar,
      originalGap: gap.gap,
      currentGap: 100 - currentScore,
      improvement,
      percentageClosed: Math.min(100, Math.max(0, percentageClosed)),
      status: percentageClosed >= 100 ? 'closed' : 
              percentageClosed >= 50 ? 'in_progress' : 'open'
    }
  })

  const averageGapClosure = gapProgress.reduce((sum, p) => sum + p.percentageClosed, 0) / 
                            gapProgress.length

  return {
    gapProgress,
    averageGapClosure,
    totalImprovementPoints: current.overallScore - baseline.overallScore,
    timeElapsed: current.timestamp.getTime() - baseline.timestamp.getTime(),
    projectedCompletionTime: calculateProjectedCompletion(
      baseline.timestamp,
      current.timestamp,
      averageGapClosure
    )
  }
}

export interface GapClosureAnalysis {
  gapProgress: {
    pillar: string
    originalGap: number
    currentGap: number
    improvement: number
    percentageClosed: number
    status: 'open' | 'in_progress' | 'closed'
  }[]
  averageGapClosure: number
  totalImprovementPoints: number
  timeElapsed: number
  projectedCompletionTime?: Date
}

function calculateProjectedCompletion(
  startTime: Date,
  currentTime: Date,
  percentageComplete: number
): Date | undefined {
  if (percentageComplete === 0 || percentageComplete >= 100) {
    return undefined
  }

  const timeElapsed = currentTime.getTime() - startTime.getTime()
  const timePerPercent = timeElapsed / percentageComplete
  const remainingPercent = 100 - percentageComplete
  const remainingTime = timePerPercent * remainingPercent

  return new Date(currentTime.getTime() + remainingTime)
}