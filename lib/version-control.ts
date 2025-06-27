import type { Project, AssessmentStandard } from "./types"

export interface AssessmentVersion {
  id: string
  projectName: string
  version: string
  timestamp: Date
  author: string
  notes: string
  snapshot: Project
  changes: VersionChange[]
}

export interface VersionChange {
  type: "added" | "modified" | "removed"
  path: string
  oldValue?: any
  newValue?: any
  timestamp: Date
}

export interface VersionComparison {
  version1: AssessmentVersion
  version2: AssessmentVersion
  improvements: ComparisonItem[]
  regressions: ComparisonItem[]
  unchanged: ComparisonItem[]
  overallTrend: "improving" | "declining" | "stable"
  maturityDelta: number
}

export interface ComparisonItem {
  area: string
  metric: string
  oldValue: any
  newValue: any
  change: number
  impact: "high" | "medium" | "low"
}

export class VersionControl {
  private static VERSIONS_KEY = "pp-assessment-versions"
  private static CURRENT_VERSION = "1.0.0"

  // Create a new version snapshot
  static createVersion(
    project: Project, 
    author: string = "Unknown", 
    notes: string = ""
  ): AssessmentVersion {
    const existingVersions = this.getAllVersions(project.name)
    const versionNumber = this.generateVersionNumber(existingVersions)
    
    const version: AssessmentVersion = {
      id: `${project.name}-v${versionNumber}-${Date.now()}`,
      projectName: project.name,
      version: versionNumber,
      timestamp: new Date(),
      author,
      notes,
      snapshot: JSON.parse(JSON.stringify(project)), // Deep clone
      changes: this.detectChanges(project, existingVersions[0]?.snapshot)
    }

    this.saveVersion(version)
    return version
  }

  // Get all versions for a project
  static getAllVersions(projectName: string): AssessmentVersion[] {
    try {
      const allVersions = localStorage.getItem(this.VERSIONS_KEY)
      if (!allVersions) return []
      
      const parsed = JSON.parse(allVersions) as AssessmentVersion[]
      return parsed
        .filter(v => v.projectName === projectName)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } catch (error) {
      console.error("Failed to load versions:", error)
      return []
    }
  }

  // Compare two versions
  static compareVersions(
    versionId1: string, 
    versionId2: string
  ): VersionComparison | null {
    const version1 = this.getVersion(versionId1)
    const version2 = this.getVersion(versionId2)
    
    if (!version1 || !version2) return null

    const improvements: ComparisonItem[] = []
    const regressions: ComparisonItem[] = []
    const unchanged: ComparisonItem[] = []

    // Compare overall metrics
    const v1Metrics = this.calculateMetrics(version1.snapshot)
    const v2Metrics = this.calculateMetrics(version2.snapshot)

    // Overall maturity
    const maturityDelta = v2Metrics.overallMaturity - v1Metrics.overallMaturity
    
    // Compare by standard
    version1.snapshot.standards.forEach((std1, index) => {
      const std2 = version2.snapshot.standards[index]
      if (!std2) return

      const score1 = std1.maturityScore || 0
      const score2 = std2.maturityScore || 0
      const change = score2 - score1

      const item: ComparisonItem = {
        area: std1.name,
        metric: "Maturity Score",
        oldValue: score1,
        newValue: score2,
        change,
        impact: Math.abs(change) > 1 ? "high" : Math.abs(change) > 0.5 ? "medium" : "low"
      }

      if (change > 0.1) {
        improvements.push(item)
      } else if (change < -0.1) {
        regressions.push(item)
      } else {
        unchanged.push(item)
      }

      // Compare completion rates
      const completion1 = this.calculateCompletion(std1)
      const completion2 = this.calculateCompletion(std2)
      const completionChange = completion2 - completion1

      if (Math.abs(completionChange) > 5) {
        const completionItem: ComparisonItem = {
          area: std1.name,
          metric: "Completion Rate",
          oldValue: `${completion1}%`,
          newValue: `${completion2}%`,
          change: completionChange,
          impact: Math.abs(completionChange) > 20 ? "high" : "medium"
        }

        if (completionChange > 0) {
          improvements.push(completionItem)
        } else {
          regressions.push(completionItem)
        }
      }
    })

    // Determine overall trend
    let overallTrend: "improving" | "declining" | "stable" = "stable"
    if (improvements.length > regressions.length * 2) {
      overallTrend = "improving"
    } else if (regressions.length > improvements.length * 2) {
      overallTrend = "declining"
    }

    return {
      version1,
      version2,
      improvements,
      regressions,
      unchanged,
      overallTrend,
      maturityDelta
    }
  }

  // Generate timeline data for visualization
  static getMaturityTimeline(projectName: string): {
    date: Date
    version: string
    overallScore: number
    areaScores: { [area: string]: number }
  }[] {
    const versions = this.getAllVersions(projectName)
    
    return versions.map(v => {
      const metrics = this.calculateMetrics(v.snapshot)
      const areaScores: { [area: string]: number } = {}
      
      v.snapshot.standards.forEach(std => {
        areaScores[std.name] = std.maturityScore || 0
      })

      return {
        date: new Date(v.timestamp),
        version: v.version,
        overallScore: metrics.overallMaturity,
        areaScores
      }
    })
  }

  // Private helper methods
  private static saveVersion(version: AssessmentVersion): void {
    try {
      const existing = localStorage.getItem(this.VERSIONS_KEY)
      const versions = existing ? JSON.parse(existing) : []
      versions.push(version)
      
      // Keep only last 20 versions per project to manage storage
      const projectVersions = versions.filter((v: AssessmentVersion) => 
        v.projectName === version.projectName
      )
      
      if (projectVersions.length > 20) {
        const toKeep = projectVersions.slice(-20)
        const otherVersions = versions.filter((v: AssessmentVersion) => 
          v.projectName !== version.projectName
        )
        versions.length = 0
        versions.push(...otherVersions, ...toKeep)
      }
      
      localStorage.setItem(this.VERSIONS_KEY, JSON.stringify(versions))
    } catch (error) {
      console.error("Failed to save version:", error)
    }
  }

  private static getVersion(versionId: string): AssessmentVersion | null {
    const allVersions = localStorage.getItem(this.VERSIONS_KEY)
    if (!allVersions) return null
    
    const versions = JSON.parse(allVersions) as AssessmentVersion[]
    return versions.find(v => v.id === versionId) || null
  }

  private static generateVersionNumber(existingVersions: AssessmentVersion[]): string {
    if (existingVersions.length === 0) return "1.0.0"
    
    const latest = existingVersions[0]
    const [major, minor, patch] = latest.version.split('.').map(Number)
    
    // Simple versioning: increment patch for now
    return `${major}.${minor}.${patch + 1}`
  }

  private static detectChanges(
    current: Project, 
    previous?: Project
  ): VersionChange[] {
    const changes: VersionChange[] = []
    
    if (!previous) {
      changes.push({
        type: "added",
        path: "project",
        newValue: current.name,
        timestamp: new Date()
      })
      return changes
    }

    // Compare standards
    current.standards.forEach((std, idx) => {
      const prevStd = previous.standards[idx]
      if (!prevStd) return

      std.questions.forEach((q, qIdx) => {
        const prevQ = prevStd.questions[qIdx]
        if (!prevQ) return

        if (q.answer !== prevQ.answer) {
          changes.push({
            type: "modified",
            path: `${std.name} > ${q.text}`,
            oldValue: prevQ.answer,
            newValue: q.answer,
            timestamp: new Date()
          })
        }

        if (q.evidenceNotes !== prevQ.evidenceNotes && q.evidenceNotes) {
          changes.push({
            type: "modified",
            path: `${std.name} > ${q.text} > Evidence`,
            oldValue: prevQ.evidenceNotes,
            newValue: q.evidenceNotes,
            timestamp: new Date()
          })
        }
      })
    })

    return changes
  }

  private static calculateMetrics(project: Project) {
    let totalScore = 0
    let totalWeight = 0
    let completedQuestions = 0
    let totalQuestions = 0

    project.standards.forEach(std => {
      const score = std.maturityScore || 0
      const weight = std.weight
      totalScore += score * weight
      totalWeight += weight

      std.questions.forEach(q => {
        totalQuestions++
        if (q.answer !== undefined && q.answer !== "") {
          completedQuestions++
        }
      })
    })

    return {
      overallMaturity: totalWeight > 0 ? totalScore / totalWeight : 0,
      completionRate: totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0,
      totalQuestions,
      completedQuestions
    }
  }

  private static calculateCompletion(standard: AssessmentStandard): number {
    const answered = standard.questions.filter(q => 
      q.answer !== undefined && q.answer !== ""
    ).length
    
    return standard.questions.length > 0 
      ? Math.round((answered / standard.questions.length) * 100)
      : 0
  }

  // Export version history
  static exportVersionHistory(projectName: string): void {
    const versions = this.getAllVersions(projectName)
    const timeline = this.getMaturityTimeline(projectName)
    
    const exportData = {
      projectName,
      exportDate: new Date().toISOString(),
      versions: versions.map(v => ({
        version: v.version,
        date: v.timestamp,
        author: v.author,
        notes: v.notes,
        metrics: this.calculateMetrics(v.snapshot)
      })),
      timeline
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName}-version-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
} 