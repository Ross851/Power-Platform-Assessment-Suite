'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'
import { 
  ArrowLeft, 
  Rocket, 
  Shield, 
  Target, 
  TrendingUp,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  FileText,
  MapPin,
  Code,
  AlertTriangle,
  Sparkles,
  Activity,
  Award,
  Lightbulb,
  ClipboardList,
  RefreshCw,
  ExternalLink,
  Server,
  Zap,
  Settings,
  Upload,
  X
} from 'lucide-react'
import { enhancedGovernanceQuestions } from '@/lib/microsoft-2025-assessment-enhanced'
import { assessmentPillars, calculateSecurityScore, calculateMaturityLevel } from '@/lib/microsoft-2025-assessment-framework'
import { ThemeToggle } from '@/components/governance/theme-toggle'
import { useAssessmentStore } from '@/store/assessment-store'
import { 
  calculateScoreImpact, 
  createTaskCompletionAuditEntry, 
  createEvidenceUploadAuditEntry,
  createScoreUpdateAuditEntry,
  generateAuditReport,
  calculateRealTimeMaturityScore,
  createBaselineSnapshot,
  createAssessmentSnapshot,
  calculateGapClosure
} from '@/lib/audit-trail'
import { SpiderChart } from '@/components/charts/spider-chart'
import { EnhancedSpiderChart } from '@/components/charts/enhanced-spider-chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { 
  TaskTracking, 
  TimeEstimationFactors
} from '@/lib/task-tracking'
import {
  initializeTaskTracking,
  calculateAdaptiveEstimate,
  getTaskType,
  baselineEstimates,
  updateTaskStatus
} from '@/lib/task-tracking'
import { TaskTrackingDialog } from '@/components/task-tracking'
import { 
  createAdaptiveImplementationPlan, 
  generateAdaptiveHowToGuide,
  type ImplementationContext
} from '@/lib/adaptive-implementation'
import { SafeClientWrapper } from '@/components/safe-client-wrapper'
import './demo.css'

// Chart component using CSS
const RadialChart = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="relative w-32 h-32">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

export default function Microsoft2025BeautifulPage() {
  // Get audit trail functions from store
  const { addAuditEntry, getAuditTrail, auditTrail, setBaseline } = useAssessmentStore()
  
  // Error boundary for browser extensions and storage issues
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('detectStore') || 
          event.message?.includes('extension://') ||
          event.filename?.includes('extension://')) {
        event.preventDefault()
        return false
      }
      
      // Handle storage corruption
      if (event.message?.includes('JSON parse error') || 
          event.message?.includes('Illegal constructor')) {
        console.warn('Storage corruption detected, clearing corrupted data...')
        try {
          // Clear only the problematic storage
          if (typeof window !== 'undefined' && window.localStorage) {
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
              if (key.includes('power-platform-assessment')) {
                try {
                  const value = localStorage.getItem(key)
                  if (value && !value.startsWith('{') && !value.startsWith('[')) {
                    localStorage.removeItem(key)
                    console.log('Removed corrupted storage key:', key)
                  }
                } catch (e) {
                  console.error('Error checking storage key:', key, e)
                }
              }
            })
          }
        } catch (e) {
          console.error('Error clearing corrupted storage:', e)
        }
      }
    }
    
    window.addEventListener('error', handleError, true)
    return () => window.removeEventListener('error', handleError, true)
  }, [])
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({})
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
  const [expandedRecommendation, setExpandedRecommendation] = useState<number | null>(null)
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({})
  const [taskAssignments, setTaskAssignments] = useState<Record<string, string>>({})
  const [riskOwners, setRiskOwners] = useState<Record<string, string>>({})
  const [sprintStatuses, setSprintStatuses] = useState<Record<string, string>>({})
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({})
  const [showReport, setShowReport] = useState(false)
  const [taskTracking, setTaskTracking] = useState<Record<string, TaskTracking>>({})
  const [taskBasedScoreAdjustments, setTaskBasedScoreAdjustments] = useState<Record<string, number>>({})
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null)
  const [organizationFactors, setOrganizationFactors] = useState<TimeEstimationFactors>({
    organizationSize: 'medium',
    teamExperience: 'intermediate',
    existingInfrastructure: 'basic',
    complianceRequirements: 'medium',
    changeManagementComplexity: 'moderate'
  })

  // Microsoft expected scores
  const microsoftExpectedScores: Record<string, number> = {
    governance: 80,
    security: 85,
    reliability: 75,
    performance: 70,
    operations: 75,
    experience: 80
  }

  // Calculate scores
  const calculatePillarScore = (pillarId: string) => {
    const pillar = assessmentPillars.find(p => p.id === pillarId)
    if (!pillar) return 0
    
    let total = 0
    let count = 0
    
    pillar.questions.forEach(q => {
      if (responses[q.id]) {
        total += (responses[q.id] / 5) * 100
        count++
      }
    })
    
    const baseScore = count > 0 ? Math.round(total / count) : 0
    const taskAdjustment = taskBasedScoreAdjustments[pillarId] || 0
    
    return Math.min(100, baseScore + taskAdjustment)
  }

  const pillarScores = assessmentPillars.reduce((acc, pillar) => {
    acc[pillar.id] = calculatePillarScore(pillar.id)
    return acc
  }, {} as Record<string, number>)

  const securityScore = calculateSecurityScore(responses)
  const maturityLevel = calculateMaturityLevel(responses)
  const overallScore = Math.round(Object.values(pillarScores).reduce((a, b) => a + b, 0) / Object.keys(pillarScores).length)
  
  // Create implementation context for adaptive planning
  const implementationContext: ImplementationContext = {
    currentMaturityLevel: maturityLevel?.level || 1,
    pillarScores,
    organizationFactors,
    existingCapabilities: Object.entries(responses)
      .filter(([_, value]) => value >= 4)
      .map(([key, _]) => key),
    blockers: Object.entries(responses)
      .filter(([_, value]) => value === 1)
      .map(([key, _]) => key),
    resources: {
      availableTeamMembers: organizationFactors.organizationSize === 'enterprise' ? 10 :
                           organizationFactors.organizationSize === 'large' ? 5 :
                           organizationFactors.organizationSize === 'medium' ? 3 : 2,
      budgetConstraints: organizationFactors.organizationSize === 'small',
      timeConstraints: maturityLevel?.level === 1
    }
  }

  // Animate scores
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    Object.entries(pillarScores).forEach(([key, targetValue], index) => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedScores(prev => {
            const current = prev[key] || 0
            if (current < targetValue) {
              return { ...prev, [key]: Math.min(current + 2, targetValue) }
            } else if (current > targetValue) {
              return { ...prev, [key]: Math.max(current - 2, targetValue) }
            }
            clearInterval(interval)
            return prev
          })
        }, 20)
      }, index * 100)
      timers.push(timer)
    })
    return () => timers.forEach(clearTimeout)
  }, [responses, taskBasedScoreAdjustments])

  // Pillar color scheme to match gap analysis
  const pillarColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    governance: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    security: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      text: 'text-teal-600 dark:text-teal-400',
      border: 'border-teal-200 dark:border-teal-800',
      badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    },
    reliability: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    performance: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-800',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    },
    operations: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-800',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    },
    experience: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      text: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800',
      badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    }
  }

  // Calculate question impact on pillar score
  const calculateQuestionImpact = (pillarId: string, questionWeight: number): string => {
    const pillar = assessmentPillars.find(p => p.id === pillarId)
    if (!pillar) return 'Low'
    
    const totalWeight = pillar.questions.reduce((sum, q) => sum + (q.weight || 1), 0)
    const impactPercentage = (questionWeight / totalWeight) * 100
    
    if (impactPercentage >= 25) return 'High Impact'
    if (impactPercentage >= 15) return 'Medium Impact'
    return 'Low Impact'
  }

  // Calculate gap closure contribution
  const calculateGapContribution = (pillarId: string, questionId: string): number => {
    const currentValue = responses[questionId] || 0
    const maxValue = 5
    const currentScore = pillarScores[pillarId] || 0
    const targetScore = microsoftExpectedScores[pillarId] || 80
    const gap = Math.max(0, targetScore - currentScore)
    
    if (gap === 0) return 100 // Gap already closed
    
    const maxContribution = ((maxValue - currentValue) / maxValue) * 100
    return Math.min(100, (maxContribution / gap) * 100)
  }

  // Map recommendation categories to pillar IDs
  const mapCategoryToPillar = (category: string): string => {
    const categoryLower = category.toLowerCase()
    
    // Security-related categories
    if (categoryLower.includes('data protection') || 
        categoryLower.includes('identity') || 
        categoryLower.includes('access') || 
        categoryLower.includes('encryption') || 
        categoryLower.includes('information protection') || 
        categoryLower.includes('security') ||
        categoryLower.includes('compliance')) {
      return 'security'
    }
    
    // Governance-related categories
    if (categoryLower.includes('governance') || 
        categoryLower.includes('environment management') || 
        categoryLower.includes('administration')) {
      return 'governance'
    }
    
    // Performance-related categories
    if (categoryLower.includes('performance') || 
        categoryLower.includes('optimization') || 
        categoryLower.includes('efficiency')) {
      return 'performance'
    }
    
    // Reliability-related categories
    if (categoryLower.includes('reliability') || 
        categoryLower.includes('monitoring') || 
        categoryLower.includes('backup') || 
        categoryLower.includes('disaster recovery')) {
      return 'reliability'
    }
    
    // Operations-related categories
    if (categoryLower.includes('operations') || 
        categoryLower.includes('automation') || 
        categoryLower.includes('deployment')) {
      return 'operations'
    }
    
    // Default fallback - try to match exact pillar names
    const pillarMatch = assessmentPillars.find(p => 
      p.id === categoryLower || 
      p.name.toLowerCase().includes(categoryLower)
    )
    
    return pillarMatch?.id || 'governance' // Default to governance if no match
  }

  const toggleQuestionExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const loadDemoData = () => {
    // Create baseline if it doesn't exist before loading demo data
    if (!auditTrail?.baseline) {
      const baselineScores = assessmentPillars.reduce((acc, pillar) => {
        acc[pillar.id] = 25 + Math.random() * 30 // Demo baseline between 25-55%
        return acc
      }, {} as Record<string, number>)
      
      const baseline = createBaselineSnapshot(
        Object.values(baselineScores).reduce((a, b) => a + b, 0) / Object.keys(baselineScores).length,
        baselineScores,
        []
      )
      
      // Save baseline to store
      setBaseline(baseline)
      
      // Create audit entry for baseline
      addAuditEntry({
        id: `audit-baseline-${Date.now()}`,
        timestamp: new Date(),
        type: 'assessment_changed',
        category: 'baseline',
        pillar: 'all',
        user: 'System',
        details: {
          previousScore: 0,
          newScore: baseline.overallScore,
          scoreImprovement: baseline.overallScore
        },
        metadata: {
          sessionId: `session-${Date.now()}`,
          environmentId: 'production'
        }
      })
    }
    
    // Reset task-based score adjustments when loading demo data
    setTaskBasedScoreAdjustments({})
    
    setResponses({
      'gov-2025-1': 4,
      'gov-2025-2': 3,
      'gov-2025-3': 2,
      'gov-2025-4': 4,
      'gov-2025-5': 3,
      'sec-2025-1': 2,
      'sec-2025-2': 3,
      'sec-2025-3': 1,
      'sec-2025-4': true,
      'sec-2025-5': 3,
      'rel-2025-1': 4,
      'rel-2025-2': 3,
      'rel-2025-3': 3,
      'perf-2025-1': 2,
      'perf-2025-2': 3,
      'ops-2025-1': 4,
      'ops-2025-2': 2,
      'ops-2025-3': 3,
      'exp-2025-1': 5,
      'exp-2025-2': 3,
      'exp-2025-3': 4
    })

    // Sample notes for demonstration
    setQuestionNotes({
      'gov-2025-1': 'CoE Kit deployed in August 2024. Currently running version 3.2.1. Monthly update process established with automated Power Automate flow. Identified need to upgrade to latest version 3.3.0 for enhanced telemetry features. IT team trained on maintenance procedures.',
      'gov-2025-2': 'Managed Environments enabled for Production only. Plan to extend to UAT by Q2. Currently facing licensing constraints - need 50 additional standalone licenses. Business case approved, procurement in progress. Risk: Development teams bypassing controls.',
      'sec-2025-3': 'Customer-managed keys not implemented. Security team has approved implementation for Q2 2025. Waiting for Azure Key Vault setup completion. Dependencies: Need Azure subscription upgrade and security team resources allocated.',
      'gov-2025-5': 'Limited automation for bulk governance. Currently managing 150+ apps manually. PowerShell scripts drafted but not tested. Major gap identified during audit. Plan: Implement CoE Kit bulk management features and custom PowerShell automation by end of Q1.',
      'regional-2025-1': 'Regional compliance partially implemented. EU environments configured with GDPR controls. Asia-Pacific region pending - waiting for legal review of data residency requirements. US environments compliant with SOX. Timeline: Complete APAC implementation by March 2025.',
    })
  }

  const getStatusIcon = (value: number) => {
    if (value >= 4) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (value >= 3) return <AlertCircle className="w-5 h-5 text-blue-600" />
    if (value >= 2) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getPillarIcon = (pillarId: string) => {
    const iconMap: Record<string, any> = {
      governance: Shield,
      security: Shield,
      reliability: Server,
      performance: Zap,
      operations: Settings,
      experience: Sparkles
    }
    const Icon = iconMap[pillarId] || BarChart3
    return Icon
  }

  const getScoreBadgeVariant = (score: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (score) {
      case 'High': return 'default'
      case 'Medium': return 'secondary'
      case 'Low': return 'destructive'
      default: return 'outline'
    }
  }

  const calculateGap = (pillarId: string) => {
    const current = pillarScores[pillarId] || 0
    const expected = microsoftExpectedScores[pillarId] || 80
    return expected - current
  }

  // Handle file upload
  const handleFileUpload = (questionId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      setUploadedFiles(prev => ({
        ...prev,
        [questionId]: [...(prev[questionId] || []), ...newFiles]
      }))
      
      // Add audit trail entry for evidence upload
      if (questionId.startsWith('evidence-')) {
        const recommendationTitle = questionId.replace('evidence-', '')
        const fileNames = newFiles.map(f => f.name)
        
        // Find the recommendation to get the pillar
        const recommendation = securityScore?.recommendations?.find(r => r.title === recommendationTitle)
        if (recommendation) {
          const auditEntry = createEvidenceUploadAuditEntry(
            recommendationTitle,
            recommendation.category,
            fileNames,
            "Current User"
          )
          addAuditEntry(auditEntry)
          
          // Trigger score recalculation since evidence was uploaded
          recalculateScoresWithEvidence()
        }
      }
    }
  }

  // Remove uploaded file
  const removeFile = (questionId: string, fileIndex: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.filter((_, index) => index !== fileIndex) || []
    }))
  }

  // Recalculate scores when evidence is uploaded
  const recalculateScoresWithEvidence = () => {
    // Trigger a recalculation of maturity scores
    const updatedScores = { ...animatedScores }
    
    // Update each pillar score based on completed tasks and evidence
    Object.keys(pillarScores).forEach(pillar => {
      const currentScore = pillarScores[pillar] || 0
      const recommendations = securityScore?.recommendations?.filter(r => 
        r.category.toLowerCase() === pillar.toLowerCase()
      ) || []
      
      let scoreBoost = 0
      recommendations.forEach(rec => {
        const hasEvidence = uploadedFiles[`evidence-${rec.title}`]?.length > 0
        if (hasEvidence) {
          scoreBoost += 2 // 2% boost per recommendation with evidence
        }
      })
      
      const newScore = Math.min(100, currentScore + scoreBoost)
      updatedScores[pillar] = newScore
    })
    
    setAnimatedScores(updatedScores)
  }

  // Generate recommendations report
  const generateReport = () => {
    // Create report content
    const reportContent = {
      title: 'Power Platform Assessment Report',
      date: new Date().toLocaleDateString(),
      scores: {
        security: securityScore?.score || 'Not Calculated',
        maturity: maturityLevel?.name || 'Not Assessed',
        overall: overallScore,
        compliance: maturityLevel?.score || 0
      },
      pillars: assessmentPillars.map(pillar => ({
        name: pillar.name,
        score: animatedScores[pillar.id] || 0,
        gap: calculateGap(pillar.id)
      })),
      recommendations: securityScore?.recommendations || [],
      taskAssignments,
      riskOwners,
      sprintStatuses,
      taskStatuses,
      taskTracking: Object.entries(taskTracking).map(([id, tracking]) => ({
        taskId: id,
        currentStatus: tracking.currentStatus,
        assignedTeam: tracking.assignedTo,
        estimatedHours: tracking.estimatedHours,
        history: tracking.history.map((h: any) => ({
          timestamp: h.timestamp,
          user: h.user,
          action: h.action,
          details: `${h.previousValue || ''} → ${h.newValue}`,
          comment: h.comment
        }))
      })),
      organizationFactors,
      notes: questionNotes
    }

    // Convert to JSON and trigger download
    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `power-platform-assessment-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Show success message
    alert('Report generated successfully! Check your downloads folder.')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Microsoft 2025 Assessment Demo</h1>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <Button onClick={loadDemoData} variant="outline" size="sm">
                <Rocket className="mr-2 h-4 w-4" />
                Load Sample Data
              </Button>
              <Link href="/enterprise-demo">
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Enterprise Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Gradient Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Microsoft 2025 Power Platform Assessment
              </h1>
              <p className="opacity-90">
                Based on latest Microsoft Well-Architected Framework and Security Standards
              </p>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-75 mb-1">Security Score</div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {securityScore?.score || 'Calculating...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('assessment')}>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{maturityLevel?.level || '-'}/5</h3>
              <p className="text-sm text-gray-600">Maturity Level</p>
              <p className="text-xs font-medium text-blue-600">{maturityLevel?.name}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('assessment')}>
            <CardContent className="p-6 text-center">
              <Award className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{maturityLevel?.score || 0}%</h3>
              <p className="text-sm text-gray-600">Compliance Score</p>
              <p className="text-xs font-medium text-green-600">
                {maturityLevel?.score >= 70 ? 'Compliant' : 'Non-Compliant'}
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('assessment')}>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{overallScore}%</h3>
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className="text-xs font-medium text-purple-600">
                {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Work'}
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('assessment')}>
            <CardContent className="p-6 text-center">
              <Activity className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">
                {Object.keys(responses).length}/{assessmentPillars.reduce((acc, p) => acc + p.questions.length, 0)}
              </h3>
              <p className="text-sm text-gray-600">Questions Answered</p>
              <Progress 
                value={(Object.keys(responses).length / assessmentPillars.reduce((acc, p) => acc + p.questions.length, 0)) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pillar Scores with Gap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Gap Analysis vs Microsoft Standards</CardTitle>
                <p className="text-sm text-muted-foreground">Hover over badges for detailed breakdown</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assessmentPillars.map(pillar => {
                    const score = animatedScores[pillar.id] || 0
                    const expected = microsoftExpectedScores[pillar.id] || 80
                    const gap = calculateGap(pillar.id)
                    const Icon = getPillarIcon(pillar.id)
                    
                    return (
                      <div 
                        key={pillar.id} 
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          hoveredPillar === pillar.id 
                            ? `${pillarColors[pillar.id].bg} ${pillarColors[pillar.id].border} border-2 shadow-lg`
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveTab('assessment')}
                        onMouseEnter={() => setHoveredPillar(pillar.id)}
                        onMouseLeave={() => setHoveredPillar(null)}
                      >
                        <div className="flex items-center gap-4">
                          <Icon className={`w-8 h-8 ${hoveredPillar === pillar.id ? pillarColors[pillar.id].text : 'text-gray-600'} transition-colors`} />
                          <div>
                            <h4 className="font-semibold">{pillar.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={score} className="w-24 h-2" />
                              <span className="text-sm font-medium">{score}%</span>
                            </div>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge 
                                variant={gap <= 0 ? "default" : gap <= 20 ? "secondary" : "destructive"}
                                className="cursor-help"
                              >
                                {gap <= 0 ? 'Met' : `-${gap}%`}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p className="font-semibold mb-1">{pillar.name}</p>
                                <p>Current: {score}%</p>
                                <p>Expected: {expected}%</p>
                                <p className="font-medium mt-1">
                                  Gap: {gap <= 0 ? 'None' : `-${gap}%`}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Spider Chart for Areas of Improvement */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Radar - Areas for Improvement</CardTitle>
                <p className="text-sm text-muted-foreground">Shows your journey from baseline to current with Microsoft maturity levels</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <EnhancedSpiderChart 
                    key={`radar-${Object.values(pillarScores).join('-')}`}
                    labels={assessmentPillars.map(p => p.name)}
                    series={[
                      {
                        name: 'Baseline',
                        data: assessmentPillars.map(pillar => 
                          auditTrail?.baseline?.pillarScores?.[pillar.id] || 0
                        ),
                        color: '#3b82f6',
                        fillOpacity: 0.1,
                        strokeDasharray: '4 4'
                      },
                      {
                        name: 'Current',
                        data: assessmentPillars.map(pillar => 
                          animatedScores[pillar.id] || 0
                        ),
                        color: '#10b981',
                        fillOpacity: 0.3
                      },
                      {
                        name: 'Microsoft Target',
                        data: assessmentPillars.map(pillar => 
                          microsoftExpectedScores[pillar.id] || 80
                        ),
                        color: '#8b5cf6',
                        fillOpacity: 0.1,
                        strokeDasharray: '2 2'
                      }
                    ]}
                    microsoftLevels={{
                      basic: 40,
                      intermediate: 65,
                      advanced: 85
                    }}
                    width={500}
                    height={400}
                    className="w-full max-w-lg"
                    showLegend={true}
                  />
                </div>
                
                {/* Gap Closure Summary */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {auditTrail?.baseline?.overallScore?.toFixed(0) || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Baseline Score</div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {overallScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Current Score</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      +{Math.max(0, overallScore - (auditTrail?.baseline?.overallScore || 0)).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Profile for Time Estimates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Organization Profile
                </CardTitle>
                <p className="text-sm text-muted-foreground">Configure your organization to get accurate time estimates</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Organization Size</Label>
                    <Select
                      value={organizationFactors.organizationSize}
                      onValueChange={(value: any) => setOrganizationFactors(prev => ({ ...prev, organizationSize: value }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt;100)</SelectItem>
                        <SelectItem value="medium">Medium (100-1000)</SelectItem>
                        <SelectItem value="large">Large (1000-10k)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (10k+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Team Experience</Label>
                    <Select
                      value={organizationFactors.teamExperience}
                      onValueChange={(value: any) => setOrganizationFactors(prev => ({ ...prev, teamExperience: value }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Infrastructure</Label>
                    <Select
                      value={organizationFactors.existingInfrastructure}
                      onValueChange={(value: any) => setOrganizationFactors(prev => ({ ...prev, existingInfrastructure: value }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="mature">Mature</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Compliance</Label>
                    <Select
                      value={organizationFactors.complianceRequirements}
                      onValueChange={(value: any) => setOrganizationFactors(prev => ({ ...prev, complianceRequirements: value }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Change Complexity</Label>
                    <Select
                      value={organizationFactors.changeManagementComplexity}
                      onValueChange={(value: any) => setOrganizationFactors(prev => ({ ...prev, changeManagementComplexity: value }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="complex">Complex</SelectItem>
                        <SelectItem value="very_complex">Very Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-900 dark:text-blue-100">
                    <strong>Time Estimate Impact:</strong> Based on your profile, task estimates will be adjusted automatically. 
                    For example, a baseline 16h task might become {calculateAdaptiveEstimate(16, organizationFactors)}h for your organization.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Radial Progress Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <p className="text-sm text-muted-foreground">Progress from baseline with gap closure tracking</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* KPI Grid */}
                  <div key={`kpi-${Object.values(pillarScores).join('-')}`} className="grid grid-cols-3 gap-6">
                    {[
                      { 
                        label: 'Security',
                        current: pillarScores.security || 0,
                        baseline: auditTrail?.baseline?.pillarScores?.security || 0,
                        color: '#3b82f6',
                        icon: Shield
                      },
                      { 
                        label: 'Maturity',
                        current: maturityLevel?.score || 0,
                        baseline: auditTrail?.baseline?.overallScore || 0,
                        color: '#10b981',
                        icon: TrendingUp
                      },
                      { 
                        label: 'Overall',
                        current: overallScore,
                        baseline: auditTrail?.baseline?.overallScore || 0,
                        color: '#8b5cf6',
                        icon: Award
                      }
                    ].map((kpi, index) => {
                      const improvement = Math.max(0, kpi.current - kpi.baseline)
                      const target = 100
                      const gapToTarget = Math.max(1, target - kpi.baseline)
                      const gapClosed = Math.min(100, Math.max(0, (improvement / gapToTarget) * 100))
                      
                      return (
                        <div key={index} className="text-center">
                          {/* Enhanced Radial Chart with layers */}
                          <div className="relative inline-block">
                            {/* Background circle for target */}
                            <svg className="transform -rotate-90 w-32 h-32">
                              {/* Target ring (100%) */}
                              <circle
                                cx="64"
                                cy="64"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                className="text-gray-200 dark:text-gray-700"
                              />
                              {/* Baseline indicator */}
                              <circle
                                cx="64"
                                cy="64"
                                r="45"
                                fill="none"
                                stroke={kpi.color}
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 45 * (kpi.baseline / 100)} ${2 * Math.PI * 45}`}
                                className="opacity-30"
                              />
                              {/* Current progress */}
                              <circle
                                cx="64"
                                cy="64"
                                r="45"
                                fill="none"
                                stroke={kpi.color}
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 45 * (kpi.current / 100)} ${2 * Math.PI * 45}`}
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <kpi.icon className="w-6 h-6 mb-1" style={{ color: kpi.color }} />
                              <div className="text-2xl font-bold">{kpi.current}%</div>
                            </div>
                          </div>
                          
                          {/* Labels and progress */}
                          <div className="mt-3">
                            <div className="font-medium">{kpi.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              From {kpi.baseline}% → {kpi.current}%
                            </div>
                            
                            {/* Mini progress bar showing gap closure */}
                            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                                style={{ width: `${Math.min(100, gapClosed)}%` }}
                              />
                            </div>
                            <div className="text-xs mt-1">
                              <span className="text-green-600 font-medium">
                                {gapClosed > 0 ? `${gapClosed.toFixed(0)}% gap closed` : 'No change'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Microsoft Maturity Level Progress */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Microsoft Maturity Levels Progress</h4>
                    <div className="space-y-2">
                      {[
                        { level: 'Basic', threshold: 40, color: 'bg-orange-500' },
                        { level: 'Intermediate', threshold: 65, color: 'bg-yellow-500' },
                        { level: 'Advanced', threshold: 85, color: 'bg-green-500' }
                      ].map((level) => {
                        const baselineReached = (auditTrail?.baseline?.overallScore || 0) >= level.threshold
                        const currentReached = overallScore >= level.threshold
                        const isNewlyReached = !baselineReached && currentReached
                        
                        return (
                          <div key={level.level} className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium">{level.level}</div>
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${level.color} transition-all duration-1000`}
                                style={{ 
                                  width: `${Math.min(100, (overallScore / level.threshold) * 100)}%` 
                                }}
                              />
                            </div>
                            <div className="text-xs w-20 text-right">
                              {currentReached ? (
                                <span className="text-green-600">✓ Achieved</span>
                              ) : (
                                <span>{level.threshold}% needed</span>
                              )}
                            </div>
                            {isNewlyReached && (
                              <Badge variant="default" className="text-xs">New!</Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <Shield className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold">Security-First</h3>
                  <p className="text-sm text-muted-foreground">Low/Medium/High scoring</p>
                </CardContent>
              </Card>
              <Card className="border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <Target className="w-8 h-8 text-green-600 mb-2" />
                  <h3 className="font-semibold">5-Level Maturity</h3>
                  <p className="text-sm text-muted-foreground">Initial to Efficient</p>
                </CardContent>
              </Card>
              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold">6 Pillars</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive coverage</p>
                </CardContent>
              </Card>
              <Card className="border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <FileText className="w-8 h-8 text-amber-600 mb-2" />
                  <h3 className="font-semibold">Board-Ready</h3>
                  <p className="text-sm text-muted-foreground">Executive reporting</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-4">
            {/* Assessment Pillars */}
            {assessmentPillars.map(pillar => {
              const Icon = getPillarIcon(pillar.id)
              const score = pillarScores[pillar.id] || 0
              
              return (
                <Card key={pillar.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          score >= 80 ? 'bg-green-100 text-green-600' :
                          score >= 60 ? 'bg-blue-100 text-blue-600' :
                          score >= 40 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle>{pillar.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{pillar.description}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{score}%</div>
                        <p className="text-xs text-muted-foreground">Pillar Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pillar.id === 'governance' ? enhancedGovernanceQuestions.map(question => {
                      const value = responses[question.id] || 0
                      const isExpanded = expandedQuestions.has(question.id)
                      
                      return (
                        <div 
                          key={question.id} 
                          className={`border rounded-lg p-4 space-y-3 transition-all duration-200 ${
                            hoveredPillar === pillar.id ? `${pillarColors[pillar.id].border} shadow-md` : ''
                          }`}
                          onMouseEnter={() => setHoveredPillar(pillar.id)}
                          onMouseLeave={() => setHoveredPillar(null)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {/* Pillar Color Badge */}
                                <Badge className={`text-xs ${pillarColors[pillar.id].badge} border-0`}>
                                  {pillar.name}
                                </Badge>
                                {/* Impact Indicator */}
                                <Badge variant="outline" className="text-xs">
                                  {calculateQuestionImpact(pillar.id, question.weight || 1)}
                                </Badge>
                                {question.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <h4 className="font-medium flex items-center gap-2">
                                {question.text}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {question.description}
                              </p>
                              {/* Gap Closure Progress Bar */}
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Gap Closure Potential</span>
                                  <span>{calculateGapContribution(pillar.id, question.id).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${pillarColors[pillar.id].text.replace('text-', 'bg-')}`}
                                    style={{ 
                                      width: `${calculateGapContribution(pillar.id, question.id)}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            {value > 0 && getStatusIcon(value)}
                          </div>

                          {/* Scale Input */}
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Not at all</span>
                              <span>Completely</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={value || 1}
                              onChange={(e) => setResponses(prev => ({
                                ...prev,
                                [question.id]: parseInt(e.target.value)
                              }))}
                              className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer range-slider"
                              style={{
                                opacity: 1,
                                visibility: 'visible'
                              }}
                            />
                            <div className="flex justify-between text-xs mt-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <span key={n}>{n}</span>
                              ))}
                            </div>
                          </div>

                          {/* File Upload for Evidence */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Evidence Documents</label>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                                onChange={(e) => handleFileUpload(question.id, e.target.files)}
                                className="hidden"
                                id={`file-upload-${question.id}`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`file-upload-${question.id}`)?.click()}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Files
                              </Button>
                            </div>
                            {uploadedFiles[question.id] && uploadedFiles[question.id].length > 0 && (
                              <div className="space-y-1">
                                {uploadedFiles[question.id].map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-sm">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <span className="truncate font-medium">{file.name}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </Badge>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(question.id, index)}
                                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Notes Section */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <ClipboardList className="w-4 h-4" />
                              Assessment Notes & Reasoning
                            </label>
                            <textarea
                              className="w-full min-h-[100px] p-3 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Document your reasoning for this score. Include:
• Current state assessment
• Evidence reviewed
• Gaps identified
• Planned actions
• Timeline considerations
• Dependencies or blockers"
                              value={questionNotes[question.id] || ''}
                              onChange={(e) => setQuestionNotes(prev => ({
                                ...prev,
                                [question.id]: e.target.value
                              }))}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{(questionNotes[question.id] || '').length} characters</span>
                              <span>Notes are saved automatically</span>
                            </div>
                          </div>

                          {/* Best Practice */}
                          {question.bestPractice && (
                            <Alert>
                              <Lightbulb className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Best Practice:</strong> {question.bestPractice}
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Guidance Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleQuestionExpanded(question.id)}
                            className="w-full"
                          >
                            {isExpanded ? 'Hide' : 'Show'} Detailed Guidance
                            <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </Button>

                          {/* Expanded Guidance */}
                          {isExpanded && (
                            <Tabs defaultValue="location" className="mt-4">
                              <TabsList className="grid grid-cols-4 w-full">
                                <TabsTrigger value="location">Where</TabsTrigger>
                                <TabsTrigger value="steps">Steps</TabsTrigger>
                                <TabsTrigger value="issues">Issues</TabsTrigger>
                                <TabsTrigger value="docs">Docs</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="location" className="mt-3 space-y-2">
                                {question.tenantLocation?.map((loc, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                                      {loc}
                                    </code>
                                  </div>
                                ))}
                              </TabsContent>
                              
                              <TabsContent value="steps" className="mt-3 space-y-2">
                                {question.implementationSteps?.map((step, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <Badge variant="outline">{idx + 1}</Badge>
                                    <span className="text-sm">{step}</span>
                                  </div>
                                ))}
                              </TabsContent>
                              
                              <TabsContent value="issues" className="mt-3 space-y-2">
                                {question.commonIssues?.map((issue, idx) => (
                                  <Alert key={idx} className="py-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="text-sm">{issue}</AlertDescription>
                                  </Alert>
                                ))}
                              </TabsContent>
                              
                              <TabsContent value="docs" className="mt-3 space-y-2">
                                {question.microsoftDocs?.map((doc, idx) => (
                                  <a
                                    key={idx}
                                    href={doc}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {doc.replace('https://learn.microsoft.com/', 'MS Learn: ')}
                                  </a>
                                ))}
                              </TabsContent>
                            </Tabs>
                          )}
                        </div>
                      )
                    }) : pillar.questions.map(question => {
                      const value = responses[question.id] || 0
                      const isExpanded = expandedQuestions.has(question.id)
                      
                      return (
                        <div 
                          key={question.id} 
                          className={`border rounded-lg p-4 space-y-3 transition-all duration-200 ${
                            hoveredPillar === pillar.id ? `${pillarColors[pillar.id].border} shadow-md` : ''
                          }`}
                          onMouseEnter={() => setHoveredPillar(pillar.id)}
                          onMouseLeave={() => setHoveredPillar(null)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {/* Pillar Color Badge */}
                                <Badge className={`text-xs ${pillarColors[pillar.id].badge} border-0`}>
                                  {pillar.name}
                                </Badge>
                                {/* Impact Indicator */}
                                <Badge variant="outline" className="text-xs">
                                  {calculateQuestionImpact(pillar.id, question.weight || 1)}
                                </Badge>
                                {question.required && (
                                  <Badge variant="destructive" className="text-xs">Required</Badge>
                                )}
                              </div>
                              <h4 className="font-medium flex items-center gap-2">
                                {question.text}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {question.description}
                              </p>
                              {/* Gap Closure Progress Bar */}
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Gap Closure Potential</span>
                                  <span>{calculateGapContribution(pillar.id, question.id).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${pillarColors[pillar.id].text.replace('text-', 'bg-')}`}
                                    style={{ 
                                      width: `${calculateGapContribution(pillar.id, question.id)}%` 
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            {value > 0 && getStatusIcon(value)}
                          </div>

                          {/* Scale Input for all questions */}
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Not at all</span>
                              <span>Completely</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={value || 1}
                              onChange={(e) => setResponses(prev => ({
                                ...prev,
                                [question.id]: parseInt(e.target.value)
                              }))}
                              className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer range-slider"
                              style={{
                                opacity: 1,
                                visibility: 'visible'
                              }}
                            />
                            <div className="flex justify-between text-xs mt-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <span key={n}>{n}</span>
                              ))}
                            </div>
                          </div>

                          {/* File Upload for Evidence */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Evidence Documents</label>
                            <div className="flex gap-2">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                                onChange={(e) => handleFileUpload(question.id, e.target.files)}
                                className="hidden"
                                id={`file-upload-${question.id}`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`file-upload-${question.id}`)?.click()}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Files
                              </Button>
                            </div>
                            {uploadedFiles[question.id] && uploadedFiles[question.id].length > 0 && (
                              <div className="space-y-1">
                                {uploadedFiles[question.id].map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded text-sm">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <span className="truncate font-medium">{file.name}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </Badge>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(question.id, index)}
                                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Notes Section */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <ClipboardList className="w-4 h-4" />
                              Assessment Notes & Reasoning
                            </label>
                            <textarea
                              className="w-full min-h-[100px] p-3 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Document your reasoning for this score. Include:
• Current state assessment
• Evidence reviewed
• Gaps identified
• Planned actions
• Timeline considerations
• Dependencies or blockers"
                              value={questionNotes[question.id] || ''}
                              onChange={(e) => setQuestionNotes(prev => ({
                                ...prev,
                                [question.id]: e.target.value
                              }))}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{(questionNotes[question.id] || '').length} characters</span>
                              <span>Notes are saved automatically</span>
                            </div>
                          </div>

                          {/* Best Practice if available */}
                          {question.bestPractice && (
                            <Alert>
                              <Lightbulb className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Best Practice:</strong> {question.bestPractice}
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Comprehensive Guidance */}
                          {question.guidance && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleQuestionExpanded(question.id)}
                              className="w-full"
                            >
                              {isExpanded ? 'Hide' : 'Show'} Guidance
                              <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </Button>
                          )}

                          {isExpanded && (
                            <Tabs defaultValue="guidance" className="mt-4">
                              <TabsList className="grid grid-cols-5 w-full">
                                <TabsTrigger value="guidance">Guidance</TabsTrigger>
                                <TabsTrigger value="where">Where</TabsTrigger>
                                <TabsTrigger value="steps">Steps</TabsTrigger>
                                <TabsTrigger value="issues">Issues</TabsTrigger>
                                <TabsTrigger value="docs">Docs</TabsTrigger>
                              </TabsList>

                              <TabsContent value="guidance" className="mt-3">
                                <Alert>
                                  <Info className="h-4 w-4" />
                                  <AlertDescription>
                                    <div className="space-y-2">
                                      <p>{question.guidance}</p>
                                      {question.bestPractice && (
                                        <div className="mt-2 pt-2 border-t">
                                          <p className="font-medium">Best Practice:</p>
                                          <p className="text-sm">{question.bestPractice}</p>
                                        </div>
                                      )}
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              </TabsContent>

                              <TabsContent value="where" className="mt-3">
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Where to Find in Tenant
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1 text-sm">
                                      <p className="font-medium">Power Platform Admin Center:</p>
                                      <p className="text-muted-foreground">Navigate to admin.powerplatform.microsoft.com</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1 text-sm">
                                      <p className="font-medium">For this feature:</p>
                                      <p className="text-muted-foreground">
                                        {question.category === 'Governance' ? 'Policies > Data policies > Settings' :
                                         question.category === 'Security' ? 'Settings > Security > Configuration' :
                                         question.category === 'Reliability' ? 'Environments > [Environment] > Settings' :
                                         question.category === 'Performance' ? 'Analytics > Performance metrics' :
                                         'Settings > Administration'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="steps" className="mt-3">
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm flex items-center gap-2">
                                    <ClipboardList className="w-4 h-4" />
                                    Implementation Steps
                                  </h5>
                                  <ol className="space-y-2 text-sm">
                                    <li className="flex gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0">1</Badge>
                                      <span>Assess current state and document requirements</span>
                                    </li>
                                    <li className="flex gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0">2</Badge>
                                      <span>Configure in test environment first</span>
                                    </li>
                                    <li className="flex gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0">3</Badge>
                                      <span>Validate with stakeholders and security team</span>
                                    </li>
                                    <li className="flex gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0">4</Badge>
                                      <span>Deploy to production with monitoring</span>
                                    </li>
                                    <li className="flex gap-2">
                                      <Badge variant="outline" className="text-xs shrink-0">5</Badge>
                                      <span>Document configuration and train users</span>
                                    </li>
                                  </ol>
                                </div>
                              </TabsContent>

                              <TabsContent value="issues" className="mt-3">
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                                    Common Issues & Solutions
                                  </h5>
                                  <div className="space-y-2">
                                    <Alert>
                                      <AlertTriangle className="h-4 w-4" />
                                      <AlertDescription>
                                        <p className="font-medium">Configuration Complexity</p>
                                        <p className="text-sm">Start with basic settings and gradually add complexity</p>
                                      </AlertDescription>
                                    </Alert>
                                    <Alert>
                                      <AlertTriangle className="h-4 w-4" />
                                      <AlertDescription>
                                        <p className="font-medium">User Impact</p>
                                        <p className="text-sm">Test thoroughly and communicate changes in advance</p>
                                      </AlertDescription>
                                    </Alert>
                                    <Alert>
                                      <AlertTriangle className="h-4 w-4" />
                                      <AlertDescription>
                                        <p className="font-medium">Performance Considerations</p>
                                        <p className="text-sm">Monitor system performance after implementation</p>
                                      </AlertDescription>
                                    </Alert>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="docs" className="mt-3">
                                <div className="space-y-2">
                                  <h5 className="font-medium text-sm flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    Microsoft Documentation
                                  </h5>
                                  <div className="space-y-2">
                                    <a
                                      href={`https://learn.microsoft.com/en-us/power-platform/admin/${
                                        question.category === 'Governance' ? 'governance-considerations' :
                                        question.category === 'Security' ? 'security/overview' :
                                        question.category === 'Reliability' ? 'backup-restore-environments' :
                                        question.category === 'Performance' ? 'performance-tips' :
                                        'admin-documentation'
                                      }`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      <div>
                                        <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                                          {question.category} Best Practices
                                        </p>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                          Official Microsoft Learn documentation
                                        </p>
                                      </div>
                                    </a>
                                    <a
                                      href="https://learn.microsoft.com/en-us/power-platform/guidance/adoption/admin-best-practices"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                      <div>
                                        <p className="font-medium text-sm">Admin Best Practices</p>
                                        <p className="text-xs text-muted-foreground">General guidance for administrators</p>
                                      </div>
                                    </a>
                                    <a
                                      href="https://aka.ms/ppac"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                      <div>
                                        <p className="font-medium text-sm">Power Platform Admin Center</p>
                                        <p className="text-xs text-muted-foreground">Direct link to admin portal</p>
                                      </div>
                                    </a>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {/* Report Generation Button */}
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => generateReport()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
            </div>

            {/* Recommendations Summary */}
            {securityScore && securityScore.recommendations && securityScore.recommendations.length > 0 && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Recommendations Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your assessment, we've identified {securityScore.recommendations.length} recommendations across the following areas:
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Organize Recommendations by Pillar */}
            {(() => {
              // Group recommendations by pillar/category
              const allRecommendations = securityScore?.recommendations || []
              const recommendationsByPillar = allRecommendations.reduce((acc, rec) => {
                // Map categories to pillars
                const pillarMap: Record<string, string> = {
                  'Governance': 'Governance & Administration',
                  'Security': 'Security & Compliance',
                  'Data Protection': 'Security & Compliance',
                  'Identity & Access': 'Security & Compliance',
                  'Monitoring': 'Operational Excellence',
                  'Encryption': 'Security & Compliance',
                  'Information Protection': 'Security & Compliance',
                  'Regional Governance': 'Governance & Administration',
                  'Regional Configuration': 'Governance & Administration',
                  'Governance Architecture': 'Governance & Administration',
                  'Environment Management': 'Governance & Administration'
                }
                
                const pillar = pillarMap[rec.category] || rec.category
                if (!acc[pillar]) {
                  acc[pillar] = []
                }
                acc[pillar].push(rec)
                return acc
              }, {} as Record<string, typeof allRecommendations>)

              const pillarConfig: Record<string, { icon: any; color: string; borderColor: string }> = {
                'Governance & Administration': { icon: Shield, color: 'text-purple-600', borderColor: 'border-l-purple-500' },
                'Security & Compliance': { icon: Shield, color: 'text-red-600', borderColor: 'border-l-red-500' },
                'Reliability': { icon: Server, color: 'text-blue-600', borderColor: 'border-l-blue-500' },
                'Performance Efficiency': { icon: Zap, color: 'text-yellow-600', borderColor: 'border-l-yellow-500' },
                'Operational Excellence': { icon: Settings, color: 'text-green-600', borderColor: 'border-l-green-500' }
              }

              return Object.entries(recommendationsByPillar).map(([pillarName, recommendations]) => (
                <Card key={pillarName} className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {(() => {
                        const config = pillarConfig[pillarName] || { icon: BarChart3, color: 'text-gray-600', borderColor: 'border-l-gray-500' }
                        const Icon = config.icon
                        return <Icon className={`w-5 h-5 ${config.color}`} />
                      })()}
                      {pillarName} Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendations.map((rec, index) => {
                      const config = pillarConfig[pillarName] || { borderColor: 'border-l-gray-500' }
                      return (
                        <Card key={index} className={`border-l-4 ${config.borderColor}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {rec.category}
                                </Badge>
                                <span className="font-medium">{rec.title}</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={rec.impact === 'High' ? 'destructive' : rec.impact === 'Medium' ? 'secondary' : 'default'}>
                                  {rec.impact} Impact
                                </Badge>
                                <Badge variant="outline">
                                  {rec.effort} Effort
                                </Badge>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground">{rec.description}</p>

                            {/* Action Items */}
                            <div>
                              <h5 className="font-medium text-sm mb-2">Action Items</h5>
                              <ul className="text-sm space-y-1">
                                {rec.actionItems?.map((action, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-600 mt-1" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Expand Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedRecommendation(expandedRecommendation === index ? null : index)}
                              className="w-full justify-between"
                            >
                              {expandedRecommendation === index ? 'Hide' : 'Show'} Implementation Details
                              <ChevronRight className={`h-4 w-4 transition-transform ${expandedRecommendation === index ? 'rotate-90' : ''}`} />
                            </Button>

                            {/* Expanded Details */}
                            {expandedRecommendation === index && rec.evidenceCriteria && rec.implementationRoadmap && (
                              <Tabs defaultValue="evidence" className="mt-4">
                                <TabsList className="grid grid-cols-3 w-full">
                                  <TabsTrigger value="evidence">Evidence Criteria</TabsTrigger>
                                  <TabsTrigger value="roadmap">Implementation Roadmap</TabsTrigger>
                                  <TabsTrigger value="guide">How-To Guide</TabsTrigger>
                                </TabsList>

                                <TabsContent value="evidence" className="mt-3 space-y-3">
                                  {/* Required Evidence */}
                                  <div>
                                    <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                      Required Evidence
                                    </h6>
                                    <ul className="text-sm space-y-1">
                                      {rec.evidenceCriteria.required.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <Badge variant="destructive" className="text-xs">Required</Badge>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Optional Evidence */}
                                  <div>
                                    <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                                      <Info className="w-4 h-4 text-blue-600" />
                                      Optional Evidence
                                    </h6>
                                    <ul className="text-sm space-y-1">
                                      {rec.evidenceCriteria.optional.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <Badge variant="secondary" className="text-xs">Optional</Badge>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Accepted Formats */}
                                  <div>
                                    <h6 className="font-medium text-sm mb-2">Accepted File Formats</h6>
                                    <div className="flex gap-1 flex-wrap">
                                      {rec.evidenceCriteria.formats.map((format, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {format}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Validation Steps */}
                                  <div>
                                    <h6 className="font-medium text-sm mb-2">Validation Steps</h6>
                                    <ol className="text-sm space-y-1">
                                      {rec.evidenceCriteria.validationSteps.map((step, i) => (
                                        <li key={i} className="flex gap-2">
                                          <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                  
                                  {/* Evidence Upload */}
                                  <div>
                                    <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                                      <Upload className="w-4 h-4" />
                                      Upload Evidence
                                    </h6>
                                    <div className="space-y-2">
                                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        <input
                                          type="file"
                                          id={`evidence-${rec.title}-${index}`}
                                          multiple
                                          accept={rec.evidenceCriteria.formats.join(',')}
                                          onChange={(e) => handleFileUpload(`evidence-${rec.title}`, e.target.files)}
                                          className="hidden"
                                        />
                                        <label
                                          htmlFor={`evidence-${rec.title}-${index}`}
                                          className="flex flex-col items-center cursor-pointer"
                                        >
                                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                          <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Click to upload evidence files
                                          </span>
                                          <span className="text-xs text-gray-500 mt-1">
                                            Accepted: {rec.evidenceCriteria.formats.join(', ')}
                                          </span>
                                        </label>
                                      </div>
                                      
                                      {/* Display uploaded files */}
                                      {uploadedFiles[`evidence-${rec.title}`] && uploadedFiles[`evidence-${rec.title}`].length > 0 && (
                                        <div className="space-y-1">
                                          <p className="text-xs font-medium">Uploaded Evidence:</p>
                                          {uploadedFiles[`evidence-${rec.title}`].map((file, fileIndex) => (
                                            <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                                              <span className="truncate">{file.name}</span>
                                              <button
                                                onClick={() => removeFile(`evidence-${rec.title}`, fileIndex)}
                                                className="text-red-600 hover:text-red-800"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="roadmap" className="mt-3 space-y-4">
                                  {/* Roadmap Overview */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <h6 className="font-medium mb-1">Total Duration</h6>
                                      <Badge variant="outline">{rec.implementationRoadmap.totalDuration}</Badge>
                                    </div>
                                    <div>
                                      <h6 className="font-medium mb-1">Prerequisites</h6>
                                      <ul className="space-y-1">
                                        {rec.implementationRoadmap.prerequisites.map((prereq, i) => (
                                          <li key={i} className="text-xs">• {prereq}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h6 className="font-medium mb-1">Risks & Ownership</h6>
                                      <ul className="space-y-2">
                                        {rec.implementationRoadmap.risks.map((risk, i) => (
                                          <li key={i} className="text-xs">
                                            <div className="flex items-center gap-1">
                                              <span className="text-orange-600 dark:text-orange-400">⚠ {risk}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-muted-foreground">Owner:</span>
                                              <Input
                                                type="text"
                                                value={riskOwners[`${rec.title}-risk-${i}`] || ''}
                                                onChange={(e) => setRiskOwners(prev => ({
                                                  ...prev,
                                                  [`${rec.title}-risk-${i}`]: e.target.value
                                                }))}
                                                placeholder="Risk owner"
                                                className="h-5 w-24 text-xs"
                                              />
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {/* Implementation Phases */}
                                  <div>
                                    <h6 className="font-medium mb-3">Implementation Phases (Adapted for Your Organization)</h6>
                                    <div className="space-y-3">
                                      {(() => {
                                        try {
                                          const adaptivePlan = createAdaptiveImplementationPlan(rec, implementationContext)
                                          
                                          // Show adaptation summary
                                          return (
                                          <>
                                            {/* Adaptation Summary */}
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                                              <div className="flex items-start gap-2">
                                                <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                                <div className="space-y-2 text-sm">
                                                  <p className="font-medium text-blue-900 dark:text-blue-100">
                                                    Plan adapted based on your assessment:
                                                  </p>
                                                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                                                    <li>• Priority: <Badge variant={adaptivePlan.priorityScore > 70 ? 'destructive' : 'secondary'} className="ml-1">{adaptivePlan.priorityScore}/100</Badge></li>
                                                    <li>• Risk Level: <Badge variant={adaptivePlan.riskLevel === 'Critical' ? 'destructive' : adaptivePlan.riskLevel === 'High' ? 'secondary' : 'outline'} className="ml-1">{adaptivePlan.riskLevel}</Badge></li>
                                                    <li>• Approach: <Badge variant="outline" className="ml-1">{adaptivePlan.suggestedApproach}</Badge></li>
                                                    <li>• Total Effort: <strong>{adaptivePlan.estimatedTotalHours}h</strong> (adjusted for your {organizationFactors.organizationSize} organization)</li>
                                                    {adaptivePlan.quickWins.length > 0 && (
                                                      <li>• Quick Wins Available: {adaptivePlan.quickWins.map(qw => qw.name).join(', ')}</li>
                                                    )}
                                                  </ul>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Render adapted phases */}
                                            {adaptivePlan.adaptedPhases.map((phase, i) => (
                                        <div key={i} className="border rounded-lg p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <Badge variant="outline">Phase {phase.phase}</Badge>
                                              <span className="font-medium text-sm">{phase.name}</span>
                                            </div>
                                            <div className="flex gap-2">
                                              <Select
                                                value={sprintStatuses[`${rec.title}-phase-${i}`] || phase.sprintStatus}
                                                onValueChange={(value) => setSprintStatuses(prev => ({
                                                  ...prev,
                                                  [`${rec.title}-phase-${i}`]: value
                                                }))}
                                              >
                                                <SelectTrigger className="w-32 h-7 text-xs">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="Not Started">Not Started</SelectItem>
                                                  <SelectItem value="Planning">Planning</SelectItem>
                                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                                  <SelectItem value="Completed">Completed</SelectItem>
                                                  <SelectItem value="Blocked">Blocked</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <Badge variant="outline" className="text-xs">
                                                {phase.duration}
                                              </Badge>
                                            </div>
                                          </div>

                                          {/* Tasks */}
                                          <div className="space-y-2">
                                            {phase.tasks.map((task, j) => {
                                              // Initialize or get task tracking
                                              if (!taskTracking[task.id]) {
                                                const tracking = initializeTaskTracking(
                                                  task.id,
                                                  task.name,
                                                  task.assignedTo,
                                                  organizationFactors
                                                )
                                                setTaskTracking(prev => ({ ...prev, [task.id]: tracking }))
                                              }
                                              
                                              const tracking = taskTracking[task.id] || initializeTaskTracking(
                                                task.id,
                                                task.name,
                                                task.assignedTo,
                                                organizationFactors
                                              )
                                              
                                              // Calculate adaptive hours
                                              const taskType = getTaskType(task.name)
                                              const baselineHours = baselineEstimates[taskType] || task.estimatedHours
                                              const adaptiveHours = calculateAdaptiveEstimate(baselineHours, organizationFactors)
                                              
                                              return (
                                                <TooltipProvider key={j}>
                                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                                  <div className="flex items-start justify-between">
                                                    <div className="flex-1 space-y-2">
                                                      <div>
                                                        <div className="font-medium text-sm">{task.name}</div>
                                                        <div className="text-xs text-muted-foreground">{task.description}</div>
                                                      </div>
                                                      
                                                      <div className="flex items-center gap-4 text-xs">
                                                        <div className="flex items-center gap-2">
                                                          <span className="text-muted-foreground">Lead:</span>
                                                          <span className="font-medium">{tracking.assignedTo[0]}</span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-1">
                                                          <span className="text-muted-foreground">Est:</span>
                                                          <span className="font-medium">{tracking.estimatedHours || adaptiveHours}h</span>
                                                          {adaptiveHours !== task.estimatedHours && (
                                                            <Tooltip>
                                                              <TooltipTrigger>
                                                                <span className="text-muted-foreground underline decoration-dotted cursor-help">
                                                                  (baseline: {task.estimatedHours}h)
                                                                </span>
                                                              </TooltipTrigger>
                                                              <TooltipContent className="max-w-xs">
                                                                <p className="text-xs">
                                                                  Time adjusted from {task.estimatedHours}h to {adaptiveHours}h based on:
                                                                  {organizationFactors.organizationSize === 'enterprise' && ' enterprise scale,'}
                                                                  {organizationFactors.teamExperience === 'beginner' && ' beginner team experience,'}
                                                                  {organizationFactors.changeManagementComplexity === 'very_complex' && ' complex change management,'}
                                                                  {maturityLevel?.level <= 2 && ' low maturity level'}
                                                                </p>
                                                              </TooltipContent>
                                                            </Tooltip>
                                                          )}
                                                        </div>
                                                      </div>
                                                      
                                                      {/* User Assignment */}
                                                      <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground">Assigned to:</span>
                                                        <Input
                                                          type="text"
                                                          placeholder="Enter name"
                                                          value={taskAssignments[task.id] || tracking.assignedTo[0] || ''}
                                                          onChange={(e) => {
                                                            setTaskAssignments(prev => ({
                                                              ...prev,
                                                              [task.id]: e.target.value
                                                            }))
                                                            // Update tracking too
                                                            if (e.target.value) {
                                                              const updated = { ...tracking, assignedTo: [e.target.value, ...tracking.assignedTo.slice(1)] }
                                                              setTaskTracking(prev => ({ ...prev, [task.id]: updated }))
                                                            }
                                                          }}
                                                          className="h-6 w-32 text-xs"
                                                        />
                                                      </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                      {/* Status Dropdown */}
                                                      <Select
                                                        value={tracking.currentStatus}
                                                        onValueChange={(value) => {
                                                          const updated = updateTaskStatus(tracking, value, "Current User", value === 'Blocked' ? 'Task blocked' : undefined)
                                                          setTaskTracking(prev => ({ ...prev, [task.id]: updated }))
                                                          
                                                          // Handle task status changes
                                                          if (value === 'Completed' && tracking.currentStatus !== 'Completed') {
                                                            // Calculate score impact
                                                            const completedTasks = phase.tasks.filter(t => 
                                                              t.id === task.id || (taskTracking[t.id]?.currentStatus === 'Completed')
                                                            ).map(t => t.id)
                                                            
                                                            const hasEvidence = uploadedFiles[`evidence-${rec.title}`]?.length > 0
                                                            const currentPillarScore = pillarScores[rec.category.toLowerCase()] || 0
                                                            
                                                            const scoreImpact = calculateScoreImpact(
                                                              rec,
                                                              completedTasks,
                                                              phase.tasks.length,
                                                              hasEvidence,
                                                              currentPillarScore
                                                            )
                                                            
                                                            // Update task-based score adjustments
                                                            const pillarId = mapCategoryToPillar(rec.category)
                                                            const improvement = scoreImpact.projectedScore - currentPillarScore
                                                            
                                                            // Debug logging
                                                            console.log(`Task "${task.name}" completed:`, {
                                                              category: rec.category,
                                                              mappedPillar: pillarId,
                                                              improvement: improvement,
                                                              currentScore: currentPillarScore,
                                                              projectedScore: scoreImpact.projectedScore
                                                            })
                                                            
                                                            setTaskBasedScoreAdjustments(prev => ({
                                                              ...prev,
                                                              [pillarId]: (prev[pillarId] || 0) + improvement
                                                            }))
                                                            
                                                            // Create and add audit entry
                                                            const auditEntry = createTaskCompletionAuditEntry(
                                                              task.id,
                                                              task.name,
                                                              rec.title,
                                                              rec.category,
                                                              "Current User",
                                                              scoreImpact
                                                            )
                                                            
                                                            addAuditEntry(auditEntry)
                                                            
                                                            // Update scores if all tasks in phase are completed
                                                            if (completedTasks.length === phase.tasks.length) {
                                                              const scoreUpdateEntry = createScoreUpdateAuditEntry(
                                                                rec.category,
                                                                currentPillarScore,
                                                                scoreImpact.projectedScore,
                                                                "Current User",
                                                                `Completed all tasks in ${phase.name}`
                                                              )
                                                              addAuditEntry(scoreUpdateEntry)
                                                            }
                                                          } else if (tracking.currentStatus === 'Completed' && value !== 'Completed') {
                                                            // Handle task being uncompleted
                                                            const pillarId = mapCategoryToPillar(rec.category)
                                                            const completedTasks = phase.tasks.filter(t => 
                                                              taskTracking[t.id]?.currentStatus === 'Completed' && t.id !== task.id
                                                            ).map(t => t.id)
                                                            
                                                            const hasEvidence = uploadedFiles[`evidence-${rec.title}`]?.length > 0
                                                            const currentPillarScore = pillarScores[rec.category.toLowerCase()] || 0
                                                            
                                                            // Calculate the score impact of removing this task
                                                            const scoreImpactBefore = calculateScoreImpact(
                                                              rec,
                                                              [...completedTasks, task.id],
                                                              phase.tasks.length,
                                                              hasEvidence,
                                                              currentPillarScore - (taskBasedScoreAdjustments[pillarId] || 0)
                                                            )
                                                            
                                                            const scoreImpactAfter = calculateScoreImpact(
                                                              rec,
                                                              completedTasks,
                                                              phase.tasks.length,
                                                              hasEvidence,
                                                              currentPillarScore - (taskBasedScoreAdjustments[pillarId] || 0)
                                                            )
                                                            
                                                            const reduction = scoreImpactBefore.projectedScore - scoreImpactAfter.projectedScore
                                                            
                                                            // Update task-based score adjustments
                                                            setTaskBasedScoreAdjustments(prev => ({
                                                              ...prev,
                                                              [pillarId]: Math.max(0, (prev[pillarId] || 0) - reduction)
                                                            }))
                                                            
                                                            // Create audit entry for task status change
                                                            addAuditEntry({
                                                              id: Date.now().toString(),
                                                              timestamp: new Date().toISOString(),
                                                              type: 'task_status_change',
                                                              description: `Task "${task.name}" status changed from Completed to ${value}`,
                                                              category: rec.category,
                                                              user: "Current User",
                                                              previousValue: 'Completed',
                                                              newValue: value,
                                                              metadata: {
                                                                taskId: task.id,
                                                                recommendation: rec.title,
                                                                phase: phase.name,
                                                                scoreReduction: reduction
                                                              }
                                                            })
                                                          }
                                                        }}
                                                      >
                                                        <SelectTrigger className="h-7 text-xs w-[120px]">
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                          <SelectItem value="Not Started">Not Started</SelectItem>
                                                          <SelectItem value="Planning">Planning</SelectItem>
                                                          <SelectItem value="In Progress">In Progress</SelectItem>
                                                          <SelectItem value="Blocked">Blocked</SelectItem>
                                                          <SelectItem value="Completed">Completed</SelectItem>
                                                        </SelectContent>
                                                      </Select>
                                                      
                                                      {/* Task Tracking Dialog */}
                                                      <TaskTrackingDialog
                                                        taskId={task.id}
                                                        taskName={task.name}
                                                        tracking={tracking}
                                                        onUpdate={(updated) => {
                                                          setTaskTracking(prev => ({ ...prev, [task.id]: updated }))
                                                        }}
                                                        currentUser="Current User"
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                                </TooltipProvider>
                                              )
                                            })}
                                          </div>

                                          {/* Deliverables */}
                                          <div className="mt-2">
                                            <h7 className="font-medium text-xs text-muted-foreground">Deliverables:</h7>
                                            <div className="flex gap-1 mt-1">
                                              {phase.deliverables.map((deliverable, j) => (
                                                <Badge key={j} variant="secondary" className="text-xs">
                                                  {deliverable}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                          </>
                                        )
                                        } catch (error) {
                                          console.error('Error creating adaptive plan:', error)
                                          // Fallback to original phases if adaptive planning fails
                                          return rec.implementationRoadmap.phases.map((phase, i) => (
                                            <div key={i} className="border rounded-lg p-3">
                                              <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                  <Badge variant="outline">Phase {phase.phase}</Badge>
                                                  <span className="font-medium text-sm">{phase.name}</span>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                  {phase.duration}
                                                </Badge>
                                              </div>
                                              <div className="space-y-2">
                                                {phase.tasks.map((task, j) => (
                                                  <div key={j} className="text-sm">
                                                    <p className="font-medium">{task.name}</p>
                                                    <p className="text-xs text-muted-foreground">{task.description}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))
                                        }
                                      })()}
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="guide" className="mt-3 space-y-4">
                                  <div className="space-y-4">
                                    {(() => {
                                      try {
                                        const adaptiveGuide = generateAdaptiveHowToGuide(rec, implementationContext)
                                        return (
                                        <>
                                          <h6 className="font-medium">Adaptive Implementation Guide</h6>
                                          
                                          {/* Contextual Overview */}
                                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            <p className="text-sm">{adaptiveGuide.overview}</p>
                                          </div>
                                          
                                          {/* Prerequisites Status */}
                                          <div>
                                            <h7 className="text-sm font-medium mb-2 flex items-center gap-2">
                                              <ClipboardList className="w-4 h-4" />
                                              Prerequisites Check
                                            </h7>
                                            <div className="space-y-2">
                                              {adaptiveGuide.prerequisites.map((prereq, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 border rounded">
                                                  <div className="flex items-center gap-2">
                                                    {prereq.status === 'Met' ? (
                                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : prereq.status === 'Partial' ? (
                                                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                    ) : (
                                                      <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                    <span className="text-sm">{prereq.requirement}</span>
                                                  </div>
                                                  <Badge variant={prereq.priority === 'Critical' ? 'destructive' : prereq.priority === 'High' ? 'secondary' : 'outline'} className="text-xs">
                                                    {prereq.priority}
                                                  </Badge>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          
                                          {/* Quick Start Guide */}
                                          <div>
                                            <h7 className="text-sm font-medium mb-2 flex items-center gap-2">
                                              <Zap className="w-4 h-4" />
                                              Quick Start ({adaptiveGuide.quickStart.timeToValue})
                                            </h7>
                                            <div className="space-y-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                              <p className="text-sm font-medium text-green-900 dark:text-green-100">Immediate Actions:</p>
                                              <ul className="space-y-1">
                                                {adaptiveGuide.quickStart.immediateActions.map((action, i) => (
                                                  <li key={i} className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                                                    <span>•</span>
                                                    <span>{action}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                    
                                    {/* Microsoft Documentation Links */}
                                    <div>
                                      <h7 className="text-sm font-medium mb-2 flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4" />
                                        Microsoft Documentation
                                      </h7>
                                      <div className="space-y-2">
                                        <a 
                                          href="https://learn.microsoft.com/en-us/power-platform/guidance/adoption/admin-best-practices"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Power Platform Admin Best Practices
                                        </a>
                                        <a 
                                          href="https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Center of Excellence Starter Kit
                                        </a>
                                        <a 
                                          href="https://learn.microsoft.com/en-us/power-platform/admin/security-overview"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                          <ExternalLink className="w-3 h-3" />
                                          Security & Compliance Overview
                                        </a>
                                      </div>
                                    </div>

                                          {/* Adaptive Step-by-Step Guide */}
                                          <div>
                                            <h7 className="text-sm font-medium mb-2">Adaptive Implementation Steps</h7>
                                            <ol className="space-y-3 text-sm">
                                              {adaptiveGuide.steps.map((step, i) => (
                                                <li key={i} className="flex gap-2">
                                                  <Badge variant="outline" className="text-xs shrink-0">{step.stepNumber}</Badge>
                                                  <div className="flex-1">
                                                    <p className="font-medium">{step.title}</p>
                                                    <p className="text-muted-foreground text-xs mt-1">{step.description}</p>
                                                    <div className="mt-2 flex items-center gap-4 text-xs">
                                                      <span className="flex items-center gap-1">
                                                        <Activity className="w-3 h-3" />
                                                        {step.estimatedTime}
                                                      </span>
                                                      <Badge variant={step.complexity === 'High' ? 'destructive' : step.complexity === 'Medium' ? 'secondary' : 'outline'} className="text-xs">
                                                        {step.complexity} Complexity
                                                      </Badge>
                                                    </div>
                                                    {step.timeAdjustmentReason && (
                                                      <p className="text-xs text-muted-foreground mt-1 italic">
                                                        {step.timeAdjustmentReason}
                                                      </p>
                                                    )}
                                                    {step.warnings && step.warnings.length > 0 && (
                                                      <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs">
                                                        {step.warnings.map((warning, j) => (
                                                          <p key={j} className="text-orange-800 dark:text-orange-200">{warning}</p>
                                                        ))}
                                                      </div>
                                                    )}
                                                    {step.tips && step.tips.length > 0 && (
                                                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                                                        {step.tips.map((tip, j) => (
                                                          <p key={j} className="text-blue-800 dark:text-blue-200">{tip}</p>
                                                        ))}
                                                      </div>
                                                    )}
                                                    {step.documentationLinks && step.documentationLinks.length > 0 && (
                                                      <div className="mt-2 pt-2 border-t">
                                                        <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                                          <ExternalLink className="w-3 h-3" />
                                                          Helpful Documentation:
                                                        </p>
                                                        <div className="space-y-1">
                                                          {step.documentationLinks.map((link, j) => (
                                                            <a
                                                              key={j}
                                                              href={link.url}
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              className="flex items-start gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                              <span>•</span>
                                                              <div>
                                                                <span className="font-medium">{link.title}</span>
                                                                {link.description && (
                                                                  <span className="text-gray-600 dark:text-gray-400 block">{link.description}</span>
                                                                )}
                                                              </div>
                                                            </a>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </li>
                                              ))}
                                      </ol>
                                    </div>

                                          {/* Troubleshooting Guide */}
                                          <div>
                                            <h7 className="text-sm font-medium mb-2 flex items-center gap-2">
                                              <AlertTriangle className="w-4 h-4" />
                                              Troubleshooting Guide
                                            </h7>
                                            <div className="space-y-2">
                                              {adaptiveGuide.troubleshooting.map((item, i) => (
                                                <div key={i} className="border rounded p-3 space-y-2">
                                                  <p className="font-medium text-sm">{item.issue}</p>
                                                  <div className="text-xs text-muted-foreground">
                                                    <p className="font-medium">Symptoms:</p>
                                                    <ul className="ml-4">
                                                      {item.symptoms.map((symptom, j) => (
                                                        <li key={j}>• {symptom}</li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                  <div className="text-xs">
                                                    <p className="font-medium text-green-700 dark:text-green-400">Solution:</p>
                                                    <p className="text-green-600 dark:text-green-300">{item.solution}</p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          
                                          {/* Resources */}
                                          <div>
                                            <h7 className="text-sm font-medium mb-2 flex items-center gap-2">
                                              <ExternalLink className="w-4 h-4" />
                                              Relevant Resources
                                            </h7>
                                            <div className="space-y-2">
                                              {adaptiveGuide.resources.map((resource, i) => (
                                                <a
                                                  key={i}
                                                  href={resource.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <ExternalLink className="w-3 h-3" />
                                                    <span className="text-sm">{resource.title}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                                                    <Badge variant={resource.relevance === 'Essential' ? 'destructive' : resource.relevance === 'Recommended' ? 'secondary' : 'outline'} className="text-xs">
                                                      {resource.relevance}
                                                    </Badge>
                                                  </div>
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        </>
                                      )
                                      } catch (error) {
                                        console.error('Error creating adaptive guide:', error)
                                        // Fallback to basic guide
                                        return (
                                          <div>
                                            <h6 className="font-medium">Implementation Guide</h6>
                                            <p className="text-sm text-muted-foreground">
                                              Follow the implementation phases above to deploy {rec.title}.
                                            </p>
                                          </div>
                                        )
                                      }
                                    })()}
                                    
                                    {/* Common Pitfalls */}
                                    <div>
                                      <h7 className="text-sm font-medium mb-2">Common Pitfalls to Avoid</h7>
                                      <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                          <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                                          <div>
                                            <span className="font-medium">Over-restrictive policies</span>
                                            <p className="text-xs text-muted-foreground">Balance security with user productivity</p>
                                          </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                                          <div>
                                            <span className="font-medium">Skipping pilot phase</span>
                                            <p className="text-xs text-muted-foreground">Test governance controls with a small group first</p>
                                          </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                          <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                                          <div>
                                            <span className="font-medium">Ignoring change management</span>
                                            <p className="text-xs text-muted-foreground">Communicate changes and provide training</p>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      )
                    })}
                  </CardContent>
                </Card>
              ))
            })()}

            {/* Maturity Recommendations */}
            {maturityLevel && maturityLevel.recommendations && maturityLevel.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Maturity Level Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {maturityLevel.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Badge>{index + 1}</Badge>
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Fallback when no recommendations */}
            {(!securityScore || !securityScore.recommendations || securityScore.recommendations.length === 0) && 
             (!maturityLevel || !maturityLevel.recommendations || maturityLevel.recommendations.length === 0) && (
              <Card>
                <CardContent className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
                  <p className="text-gray-500">
                    Complete the assessment questions to receive personalized recommendations for improving your Power Platform implementation.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <SafeClientWrapper>
              {/* Audit Trail and Compliance Report */}
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Audit Trail & Compliance
                  </div>
                  <button 
                    onClick={() => {
                      try {
                        const trail = getAuditTrail()
                        if (trail) {
                          const report = generateAuditReport(trail)
                          console.log('Audit Report:', report)
                        }
                      } catch (e) {
                        console.error('Error generating report:', e)
                      }
                    }}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Generate Audit Report
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gap Closure Progress - The Main Audit View */}
                {(() => {
                  // Create baseline if it doesn't exist
                  const auditTrail = getAuditTrail()
                  if (!auditTrail?.baseline && securityScore) {
                    const baseline = createBaselineSnapshot(
                      overallScore,
                      pillarScores,
                      securityScore.recommendations || []
                    )
                    // Save baseline to store
                    setBaseline(baseline)
                  }
                  
                  // Create current snapshot
                  const currentSnapshot = auditTrail?.baseline && securityScore ? 
                    createAssessmentSnapshot(
                      auditTrail.baseline,
                      pillarScores,
                      taskTracking,
                      uploadedFiles
                    ) : null
                  
                  // Calculate gap closure
                  const gapAnalysis = auditTrail?.baseline && currentSnapshot ?
                    calculateGapClosure(auditTrail.baseline, currentSnapshot) : null
                  
                  return (
                    <div className="space-y-4">
                      {/* Gap Closure Header */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Gap Closure Progress</h3>
                        {gapAnalysis ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average Gap Closure</span>
                              <span className="font-bold text-lg">{gapAnalysis.averageGapClosure.toFixed(1)}%</span>
                            </div>
                            <Progress value={gapAnalysis.averageGapClosure} className="h-3" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Started: {auditTrail.baseline?.overallScore.toFixed(0)}%</span>
                              <span>Current: {currentSnapshot?.overallScore.toFixed(0)}%</span>
                              <span>Target: 100%</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Complete your assessment to establish baseline</p>
                        )}
                      </div>
                      
                      {/* Pillar-by-Pillar Gap Analysis */}
                      {gapAnalysis && (
                        <div>
                          <h4 className="font-medium mb-3">Gap Closure by Pillar</h4>
                          <div className="space-y-3">
                            {gapAnalysis.gapProgress.map((gap, index) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium capitalize">{gap.pillar}</span>
                                  <Badge 
                                    variant={
                                      gap.status === 'closed' ? 'default' :
                                      gap.status === 'in_progress' ? 'secondary' : 'outline'
                                    }
                                  >
                                    {gap.status === 'closed' ? 'Gap Closed' :
                                     gap.status === 'in_progress' ? 'In Progress' : 'Open'}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Original Gap: {gap.originalGap.toFixed(0)}%</span>
                                    <span>Current Gap: {gap.currentGap.toFixed(0)}%</span>
                                    <span className="font-medium text-green-600">
                                      Improved: +{gap.improvement.toFixed(0)}%
                                    </span>
                                  </div>
                                  <Progress value={gap.percentageClosed} className="h-2" />
                                  <p className="text-xs text-muted-foreground">
                                    {gap.percentageClosed.toFixed(0)}% of gap closed
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Projected Completion */}
                          {gapAnalysis.projectedCompletionTime && (
                            <Alert className="mt-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                At current pace, full gap closure projected by:{' '}
                                <strong>{gapAnalysis.projectedCompletionTime.toLocaleDateString()}</strong>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}
                
                {/* Compliance Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Total Actions</div>
                    <div className="text-2xl font-bold">{getAuditTrail()?.entries?.length || 0}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                    <div className="text-2xl font-bold">
                      {getAuditTrail()?.entries?.filter(e => e.type === 'task_completed').length || 0}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Evidence Uploaded</div>
                    <div className="text-2xl font-bold">
                      {getAuditTrail()?.entries?.filter(e => e.type === 'evidence_uploaded').length || 0}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Score Improvements</div>
                    <div className="text-2xl font-bold">{getAuditTrail()?.totalImprovements || 0}</div>
                  </Card>
                </div>

                {/* Real-time Score Updates with Gap Visualization */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Maturity Journey - From Baseline to Target
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(pillarScores).map(([pillar, baseScore]) => {
                      // Calculate real-time score based on completed tasks and evidence
                      const recommendations = securityScore?.recommendations?.filter(r => 
                        r.category.toLowerCase() === pillar.toLowerCase()
                      ) || []
                      
                      let completedTasks = 0
                      let totalTasks = 0
                      let hasEvidence = false
                      
                      recommendations.forEach(rec => {
                        rec.implementationRoadmap?.phases?.forEach(phase => {
                          phase.tasks.forEach(task => {
                            totalTasks++
                            if (taskTracking[task.id]?.currentStatus === 'Completed') {
                              completedTasks++
                            }
                          })
                        })
                        if (uploadedFiles[`evidence-${rec.title}`]?.length > 0) {
                          hasEvidence = true
                        }
                      })
                      
                      const realtimeScore = totalTasks > 0 ? calculateRealTimeMaturityScore(
                        baseScore,
                        completedTasks,
                        totalTasks,
                        hasEvidence,
                        'pending'
                      ) : baseScore
                      
                      const gap = 100 - baseScore
                      const gapClosed = realtimeScore - baseScore
                      const gapRemaining = 100 - realtimeScore
                      const gapClosurePercentage = gap > 0 ? (gapClosed / gap) * 100 : 0
                      
                      return (
                        <div key={pillar} className="border rounded-lg p-4">
                          <div className="space-y-3">
                            {/* Header with pillar name and gap info */}
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium capitalize text-lg">{pillar}</h4>
                              <div className="text-sm text-muted-foreground">
                                Gap to close: {gap.toFixed(0)}%
                              </div>
                            </div>
                            
                            {/* Visual progress bar showing journey */}
                            <div className="relative">
                              <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                {/* Baseline section */}
                                <div 
                                  className="absolute h-full bg-blue-200 dark:bg-blue-900"
                                  style={{ width: `${baseScore}%` }}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                    {baseScore > 10 && `Start: ${baseScore}%`}
                                  </div>
                                </div>
                                
                                {/* Progress section */}
                                <div 
                                  className="absolute h-full bg-green-500"
                                  style={{ 
                                    left: `${baseScore}%`,
                                    width: `${gapClosed}%` 
                                  }}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                                    {gapClosed > 5 && `+${gapClosed.toFixed(0)}%`}
                                  </div>
                                </div>
                                
                                {/* Remaining gap */}
                                <div 
                                  className="absolute h-full border-2 border-dashed border-gray-400"
                                  style={{ 
                                    left: `${realtimeScore}%`,
                                    width: `${gapRemaining}%` 
                                  }}
                                />
                              </div>
                              
                              {/* Labels */}
                              <div className="flex justify-between mt-1 text-xs">
                                <span>0%</span>
                                <span className="font-medium">Current: {realtimeScore.toFixed(0)}%</span>
                                <span>Target: 100%</span>
                              </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="text-xs text-muted-foreground">Tasks Done</div>
                                <div className="font-medium">{completedTasks}/{totalTasks}</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="text-xs text-muted-foreground">Gap Closed</div>
                                <div className="font-medium text-green-600">{gapClosurePercentage.toFixed(0)}%</div>
                              </div>
                              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="text-xs text-muted-foreground">Evidence</div>
                                <div className="font-medium">{hasEvidence ? '✓' : '—'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Audit Timeline */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Activity
                  </h3>
                  <div className="h-[400px] overflow-y-auto">
                    <div className="space-y-3">
                      {(getAuditTrail()?.entries || [])
                        .sort((a, b) => {
                          const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime()
                          const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime()
                          return bTime - aTime
                        })
                        .slice(0, 20)
                        .map((entry, index) => (
                          <div key={index} className="flex gap-3 p-3 border rounded-lg">
                            <div className="relative">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                entry.type === 'task_completed' ? 'bg-green-100 dark:bg-green-900' :
                                entry.type === 'evidence_uploaded' ? 'bg-blue-100 dark:bg-blue-900' :
                                entry.type === 'score_updated' ? 'bg-purple-100 dark:bg-purple-900' :
                                'bg-gray-100 dark:bg-gray-800'
                              }`}>
                                {entry.type === 'task_completed' && (
                                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {entry.type === 'evidence_uploaded' && (
                                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                )}
                                {entry.type === 'score_updated' && (
                                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">
                                  {entry.type === 'task_completed' && `Completed: ${entry.details.taskName}`}
                                  {entry.type === 'evidence_uploaded' && `Uploaded ${entry.details.evidenceFiles?.length} file(s)`}
                                  {entry.type === 'score_updated' && `Score improved by ${entry.details.scoreImprovement?.toFixed(1)}%`}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(entry.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {entry.category} • {entry.user}
                                {entry.details.completionPercentage && ` • ${entry.details.completionPercentage.toFixed(0)}% complete`}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Score improvements are automatically calculated based on task completion and evidence uploads. 
                    For audit purposes, all changes are tracked with timestamps and user information. 
                    Scores will be finalized once all evidence is verified.
                  </AlertDescription>
                </Alert>
                
                {/* Storage Management - Only show if there are errors */}
                {typeof window !== 'undefined' && (
                  <div className="text-xs text-muted-foreground flex items-center justify-between mt-4">
                    <span>Having issues? Try clearing cache</span>
                    <button 
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => {
                        if (confirm('Clear all assessment data? This cannot be undone.')) {
                          try {
                            localStorage.removeItem('power-platform-assessment-storage-v2')
                            window.location.reload()
                          } catch (e) {
                            console.error('Error clearing storage:', e)
                          }
                        }
                      }}
                    >
                      Clear Storage
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
            </SafeClientWrapper>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}