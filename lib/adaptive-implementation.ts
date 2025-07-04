// Adaptive Implementation Planning System
import type { 
  ImplementationPhase, 
  ImplementationTask,
  SecurityRecommendation,
  TimeEstimationFactors 
} from './microsoft-2025-assessment-framework'

export interface AdaptiveImplementationPlan {
  recommendation: SecurityRecommendation
  adaptedPhases: ImplementationPhase[]
  priorityScore: number
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
  dependencies: string[]
  quickWins: ImplementationTask[]
  estimatedTotalHours: number
  suggestedApproach: 'Aggressive' | 'Balanced' | 'Conservative'
}

export interface ImplementationContext {
  currentMaturityLevel: number
  pillarScores: Record<string, number>
  organizationFactors: TimeEstimationFactors
  existingCapabilities: string[]
  blockers: string[]
  resources: {
    availableTeamMembers: number
    budgetConstraints: boolean
    timeConstraints: boolean
  }
}

// Calculate priority based on impact, current gaps, and dependencies
export function calculateImplementationPriority(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): number {
  let priority = 0

  // Impact weight (40%)
  const impactWeight = recommendation.impact === 'High' ? 40 : 
                      recommendation.impact === 'Medium' ? 25 : 10

  // Current gap weight (30%)
  const categoryGap = 100 - (context.pillarScores[recommendation.category.toLowerCase()] || 50)
  const gapWeight = (categoryGap / 100) * 30

  // Effort consideration (20%)
  const effortWeight = recommendation.effort === 'Low' ? 20 :
                      recommendation.effort === 'Medium' ? 10 : 5

  // Dependency weight (10%)
  const hasCriticalDependencies = recommendation.implementationRoadmap.prerequisites.some(
    prereq => prereq.includes('Security') || prereq.includes('Compliance')
  )
  const dependencyWeight = hasCriticalDependencies ? 10 : 5

  priority = impactWeight + gapWeight + effortWeight + dependencyWeight

  // Boost priority for critical security items in low maturity organizations
  if (context.currentMaturityLevel <= 2 && recommendation.category === 'Security') {
    priority *= 1.5
  }

  return Math.round(priority)
}

// Adapt implementation phases based on context
export function adaptImplementationPhases(
  originalPhases: ImplementationPhase[],
  context: ImplementationContext,
  recommendation: SecurityRecommendation
): ImplementationPhase[] {
  return originalPhases.map((phase, index) => {
    const adaptedPhase = { ...phase }

    // Adjust duration based on organization factors
    adaptedPhase.duration = adjustPhaseDuration(
      phase.duration,
      context.organizationFactors,
      context.currentMaturityLevel
    )

    // Adapt tasks based on context
    adaptedPhase.tasks = phase.tasks.map(task => {
      const adaptedTask = { ...task }

      // Adjust task hours based on context
      const complexityMultiplier = getComplexityMultiplier(
        task.name,
        context.currentMaturityLevel,
        context.organizationFactors
      )
      adaptedTask.estimatedHours = Math.round(task.estimatedHours * complexityMultiplier)

      // Add context-specific acceptance criteria
      adaptedTask.acceptanceCriteria = [
        ...task.acceptanceCriteria,
        ...generateContextualCriteria(task, context)
      ]

      // Adjust assignment based on available resources
      if (context.resources.availableTeamMembers < 3) {
        adaptedTask.assignedTo = 'Multi-role Team Member'
      }

      return adaptedTask
    })

    // Add additional tasks for low maturity organizations
    if (context.currentMaturityLevel <= 2 && index === 0) {
      adaptedPhase.tasks.unshift({
        id: `${phase.phase}-prep`,
        name: 'Foundation Preparation',
        description: 'Establish basic governance and security foundations',
        estimatedHours: 16,
        assignedTo: 'Governance Lead',
        status: 'Not Started',
        acceptanceCriteria: [
          'Basic governance framework documented',
          'Security policies drafted',
          'Stakeholder alignment achieved'
        ]
      })
    }

    // Adjust sprint status based on dependencies
    if (hasMissingDependencies(phase, context)) {
      adaptedPhase.sprintStatus = 'Blocked'
    }

    return adaptedPhase
  })
}

// Generate context-aware how-to guide
export function generateAdaptiveHowToGuide(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): AdaptiveHowToGuide {
  const guide: AdaptiveHowToGuide = {
    overview: generateContextualOverview(recommendation, context),
    prerequisites: adaptPrerequisites(recommendation.implementationRoadmap.prerequisites, context),
    steps: generateAdaptiveSteps(recommendation, context),
    bestPractices: selectRelevantBestPractices(recommendation, context),
    quickStart: generateQuickStartGuide(recommendation, context),
    troubleshooting: generateTroubleshootingGuide(recommendation, context),
    resources: compileRelevantResources(recommendation, context)
  }

  return guide
}

export interface AdaptiveHowToGuide {
  overview: string
  prerequisites: AdaptivePrerequisite[]
  steps: AdaptiveStep[]
  bestPractices: string[]
  quickStart: QuickStartGuide
  troubleshooting: TroubleshootingItem[]
  resources: Resource[]
}

export interface AdaptivePrerequisite {
  requirement: string
  status: 'Met' | 'Not Met' | 'Partial'
  action: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
}

export interface AdaptiveStep {
  stepNumber: number
  title: string
  description: string
  estimatedTime: string
  complexity: 'Low' | 'Medium' | 'High'
  requiredSkills: string[]
  detailedInstructions: string[]
  screenshots?: string[]
  warnings?: string[]
  tips?: string[]
  documentationLinks?: Array<{
    title: string
    url: string
    description: string
  }>
  timeAdjustmentReason?: string
}

export interface QuickStartGuide {
  timeToValue: string
  immediateActions: string[]
  quickWins: string[]
  minimalViableImplementation: string[]
}

export interface TroubleshootingItem {
  issue: string
  symptoms: string[]
  solution: string
  preventionTips: string[]
}

export interface Resource {
  title: string
  type: 'Documentation' | 'Video' | 'Template' | 'Tool' | 'Training'
  url: string
  relevance: 'Essential' | 'Recommended' | 'Optional'
  estimatedTime?: string
}

// Helper functions
function adjustPhaseDuration(
  originalDuration: string,
  factors: TimeEstimationFactors,
  maturityLevel: number
): string {
  // Parse original duration (e.g., "2 weeks" -> 2)
  const match = originalDuration.match(/(\d+)\s*(week|day|month)/i)
  if (!match) return originalDuration

  let value = parseInt(match[1])
  const unit = match[2].toLowerCase()

  // Apply multipliers based on factors
  let multiplier = 1.0

  // Organization size impact
  if (factors.organizationSize === 'enterprise') multiplier *= 1.5
  else if (factors.organizationSize === 'large') multiplier *= 1.3
  else if (factors.organizationSize === 'small') multiplier *= 0.8

  // Team experience impact
  if (factors.teamExperience === 'beginner') multiplier *= 1.5
  else if (factors.teamExperience === 'intermediate') multiplier *= 1.2
  else if (factors.teamExperience === 'expert') multiplier *= 0.8

  // Maturity level impact
  if (maturityLevel === 1) multiplier *= 1.4
  else if (maturityLevel === 2) multiplier *= 1.2
  else if (maturityLevel >= 4) multiplier *= 0.9

  // Calculate new duration
  const newValue = Math.max(1, Math.round(value * multiplier))
  
  // Adjust unit if needed
  if (unit === 'week' && newValue > 8) {
    return `${Math.round(newValue / 4)} months`
  } else if (unit === 'day' && newValue > 14) {
    return `${Math.round(newValue / 7)} weeks`
  }

  return `${newValue} ${unit}${newValue > 1 ? 's' : ''}`
}

function getComplexityMultiplier(
  taskName: string,
  maturityLevel: number,
  factors: TimeEstimationFactors
): number {
  let multiplier = 1.0

  // Task complexity factors
  if (taskName.toLowerCase().includes('compliance') || taskName.toLowerCase().includes('security')) {
    multiplier *= 1.3
  }
  if (taskName.toLowerCase().includes('migration') || taskName.toLowerCase().includes('integration')) {
    multiplier *= 1.4
  }

  // Maturity adjustments
  if (maturityLevel <= 2) {
    multiplier *= 1.5 // Everything is harder at low maturity
  } else if (maturityLevel >= 4) {
    multiplier *= 0.8 // Experienced organizations work faster
  }

  // Organization factors
  if (factors.complianceRequirements === 'critical') multiplier *= 1.4
  if (factors.changeManagementComplexity === 'very_complex') multiplier *= 1.3

  return multiplier
}

function generateContextualCriteria(
  task: ImplementationTask,
  context: ImplementationContext
): string[] {
  const criteria: string[] = []

  // Add criteria based on maturity level
  if (context.currentMaturityLevel <= 2) {
    criteria.push('Document process for future reference')
    criteria.push('Create runbook for ongoing operations')
  }

  // Add compliance-specific criteria
  if (context.organizationFactors.complianceRequirements === 'high' || 
      context.organizationFactors.complianceRequirements === 'critical') {
    criteria.push('Compliance documentation completed')
    criteria.push('Audit trail established')
  }

  // Add scale-specific criteria
  if (context.organizationFactors.organizationSize === 'enterprise') {
    criteria.push('Rollout plan for all regions/divisions created')
    criteria.push('Change management communications sent')
  }

  return criteria
}

function hasMissingDependencies(
  phase: ImplementationPhase,
  context: ImplementationContext
): boolean {
  // Check if required capabilities are missing
  const requiredCapabilities = phase.dependencies.filter(dep => 
    !context.existingCapabilities.includes(dep)
  )
  
  return requiredCapabilities.length > 0
}

function generateContextualOverview(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): string {
  const maturityContext = context.currentMaturityLevel <= 2 
    ? "As an organization in the early stages of Power Platform governance, "
    : context.currentMaturityLevel === 3
    ? "With your established governance practices, "
    : "As a mature Power Platform organization, "

  const urgencyContext = recommendation.impact === 'High' && context.pillarScores[recommendation.category.toLowerCase()] < 50
    ? "This is a critical priority that should be addressed immediately. "
    : recommendation.impact === 'Medium'
    ? "This is an important enhancement to your current capabilities. "
    : "This optimization will further improve your platform governance. "

  return `${maturityContext}implementing ${recommendation.title} will ${recommendation.description}. ${urgencyContext}Based on your organization's profile, we've adapted this implementation plan to account for your ${context.organizationFactors.organizationSize} size, ${context.organizationFactors.teamExperience} team experience, and ${context.organizationFactors.complianceRequirements} compliance requirements.`
}

function adaptPrerequisites(
  originalPrereqs: string[],
  context: ImplementationContext
): AdaptivePrerequisite[] {
  return originalPrereqs.map(prereq => {
    const isMet = context.existingCapabilities.some(cap => 
      cap.toLowerCase().includes(prereq.toLowerCase())
    )

    return {
      requirement: prereq,
      status: isMet ? 'Met' : 'Not Met',
      action: isMet 
        ? 'Verify and document current implementation'
        : `Implement ${prereq} before proceeding`,
      priority: prereq.includes('Security') || prereq.includes('Admin') 
        ? 'Critical' 
        : 'High'
    }
  })
}

function generateAdaptiveSteps(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): AdaptiveStep[] {
  const baseSteps = generateBaseSteps(recommendation)
  
  return baseSteps.map((step, index) => {
    const complexity = determineStepComplexity(step, context)
    const timeMultiplier = getTimeMultiplier(complexity, context)
    const originalTime = parseInt(step.baseTime.match(/\d+/)?.[0] || '0')
    const adjustedTime = Math.round(originalTime * timeMultiplier)
    
    // Generate time adjustment reason
    let timeAdjustmentReason = ''
    if (timeMultiplier !== 1.0) {
      const reasons: string[] = []
      if (context.organizationFactors.organizationSize === 'enterprise') {
        reasons.push('enterprise scale coordination')
      }
      if (context.organizationFactors.teamExperience === 'beginner') {
        reasons.push('additional learning time for beginner team')
      }
      if (context.organizationFactors.changeManagementComplexity === 'very_complex') {
        reasons.push('complex change management process')
      }
      if (context.currentMaturityLevel <= 2) {
        reasons.push('foundational setup required')
      }
      timeAdjustmentReason = `Adjusted from ${step.baseTime} due to: ${reasons.join(', ')}`
    }
    
    return {
      stepNumber: index + 1,
      title: step.title,
      description: adaptStepDescription(step.description, context),
      estimatedTime: adjustStepTime(step.baseTime, timeMultiplier),
      complexity,
      requiredSkills: identifyRequiredSkills(step, context),
      detailedInstructions: generateDetailedInstructions(step, context),
      warnings: generateContextualWarnings(step, context),
      tips: generateContextualTips(step, context),
      documentationLinks: generateStepDocumentation(step, recommendation),
      timeAdjustmentReason
    }
  })
}

function generateBaseSteps(recommendation: SecurityRecommendation): any[] {
  // Generate base steps based on recommendation category
  const categorySteps: Record<string, any[]> = {
    'Data Protection': [
      { title: 'Assess Current Data Classification', description: 'Review and classify sensitive data', baseTime: '2 hours' },
      { title: 'Configure DLP Policies', description: 'Implement data loss prevention rules', baseTime: '4 hours' },
      { title: 'Test and Validate', description: 'Verify policy effectiveness', baseTime: '2 hours' }
    ],
    'Identity & Access': [
      { title: 'Review Access Patterns', description: 'Analyze current access and permissions', baseTime: '3 hours' },
      { title: 'Implement Access Controls', description: 'Configure conditional access and MFA', baseTime: '4 hours' },
      { title: 'Monitor and Adjust', description: 'Review logs and fine-tune policies', baseTime: '2 hours' }
    ],
    'Governance': [
      { title: 'Define Governance Framework', description: 'Establish policies and procedures', baseTime: '4 hours' },
      { title: 'Deploy Governance Tools', description: 'Implement CoE Kit or custom solutions', baseTime: '8 hours' },
      { title: 'Train Administrators', description: 'Enable team with governance capabilities', baseTime: '4 hours' }
    ]
  }

  return categorySteps[recommendation.category] || [
    { title: 'Plan Implementation', description: 'Define approach and requirements', baseTime: '2 hours' },
    { title: 'Execute Configuration', description: 'Implement the solution', baseTime: '4 hours' },
    { title: 'Validate and Document', description: 'Test and create documentation', baseTime: '2 hours' }
  ]
}

function determineStepComplexity(step: any, context: ImplementationContext): 'Low' | 'Medium' | 'High' {
  if (context.currentMaturityLevel <= 2 && step.title.includes('Configure')) return 'High'
  if (context.organizationFactors.organizationSize === 'enterprise') return 'High'
  if (context.organizationFactors.teamExperience === 'beginner') return 'High'
  if (step.title.includes('Test') || step.title.includes('Review')) return 'Low'
  return 'Medium'
}

function getTimeMultiplier(complexity: string, context: ImplementationContext): number {
  let multiplier = complexity === 'High' ? 2.0 : complexity === 'Medium' ? 1.5 : 1.0
  
  if (context.organizationFactors.teamExperience === 'beginner') multiplier *= 1.5
  if (context.organizationFactors.changeManagementComplexity === 'very_complex') multiplier *= 1.3
  
  return multiplier
}

function adjustStepTime(baseTime: string, multiplier: number): string {
  const match = baseTime.match(/(\d+)\s*(hour|day)/i)
  if (!match) return baseTime
  
  const value = Math.round(parseInt(match[1]) * multiplier)
  const unit = match[2]
  
  if (unit === 'hour' && value > 8) {
    return `${Math.round(value / 8)} days`
  }
  
  return `${value} ${unit}${value > 1 ? 's' : ''}`
}

function adaptStepDescription(description: string, context: ImplementationContext): string {
  if (context.currentMaturityLevel <= 2) {
    return `${description}. This foundational step is critical for establishing proper governance.`
  }
  if (context.organizationFactors.organizationSize === 'enterprise') {
    return `${description} across all business units and regions, ensuring consistent implementation.`
  }
  return description
}

function identifyRequiredSkills(step: any, context: ImplementationContext): string[] {
  const baseSkills = ['Power Platform Administration']
  
  if (step.title.includes('Configure') || step.title.includes('Implement')) {
    baseSkills.push('Technical Configuration')
  }
  if (step.title.includes('Policy') || step.title.includes('Governance')) {
    baseSkills.push('Policy Development')
  }
  if (context.organizationFactors.complianceRequirements === 'high' || 
      context.organizationFactors.complianceRequirements === 'critical') {
    baseSkills.push('Compliance Management')
  }
  if (context.organizationFactors.organizationSize === 'enterprise') {
    baseSkills.push('Change Management', 'Stakeholder Communication')
  }
  
  return baseSkills
}

function generateDetailedInstructions(step: any, context: ImplementationContext): string[] {
  const instructions: string[] = []
  
  // Add context-specific instructions
  if (context.currentMaturityLevel <= 2) {
    instructions.push('Begin by documenting current state and gaps')
    instructions.push('Engage stakeholders early to ensure buy-in')
  }
  
  // Add step-specific instructions
  instructions.push(`Navigate to Power Platform Admin Center`)
  instructions.push(`Select the appropriate environment(s) for implementation`)
  
  if (step.title.includes('Configure')) {
    instructions.push('Create a backup of current configuration')
    instructions.push('Implement changes in test environment first')
    instructions.push('Document all configuration changes made')
  }
  
  if (context.organizationFactors.organizationSize === 'enterprise') {
    instructions.push('Coordinate with regional administrators')
    instructions.push('Schedule implementation during approved change windows')
  }
  
  return instructions
}

function generateContextualWarnings(step: any, context: ImplementationContext): string[] {
  const warnings: string[] = []
  
  if (context.currentMaturityLevel <= 2) {
    warnings.push('⚠️ Ensure proper testing before production deployment')
    warnings.push('⚠️ This change may impact existing workflows')
  }
  
  if (step.title.includes('Policy') || step.title.includes('DLP')) {
    warnings.push('⚠️ Overly restrictive policies may block legitimate business processes')
  }
  
  if (context.organizationFactors.organizationSize === 'enterprise') {
    warnings.push('⚠️ Coordinate rollout across all regions to avoid conflicts')
  }
  
  return warnings
}

function generateContextualTips(step: any, context: ImplementationContext): string[] {
  const tips: string[] = []
  
  if (context.organizationFactors.teamExperience === 'beginner') {
    tips.push('💡 Consider engaging Microsoft FastTrack or a partner for guidance')
    tips.push('💡 Start with a pilot group before full rollout')
  }
  
  if (context.currentMaturityLevel >= 3) {
    tips.push('💡 Leverage existing governance framework for faster implementation')
    tips.push('💡 Use automation where possible to reduce manual effort')
  }
  
  return tips
}

function generateStepDocumentation(step: any, recommendation: SecurityRecommendation): Array<{
  title: string
  url: string
  description: string
}> {
  const links: Array<{ title: string; url: string; description: string }> = []
  
  // Add documentation based on step type
  if (step.title.includes('DLP')) {
    links.push({
      title: 'Data Loss Prevention Policies',
      url: 'https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention',
      description: 'Complete guide to creating and managing DLP policies'
    })
    links.push({
      title: 'DLP Best Practices',
      url: 'https://learn.microsoft.com/en-us/power-platform/guidance/adoption/dlp-strategy',
      description: 'Strategy guide for effective DLP implementation'
    })
  }
  
  if (step.title.includes('CoE') || step.title.includes('Governance')) {
    links.push({
      title: 'Center of Excellence Starter Kit',
      url: 'https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit',
      description: 'Deploy and configure the CoE Kit'
    })
    links.push({
      title: 'Governance Best Practices',
      url: 'https://learn.microsoft.com/en-us/power-platform/guidance/adoption/admin-best-practices',
      description: 'Administration and governance guidance'
    })
  }
  
  if (step.title.includes('Access') || step.title.includes('Security')) {
    links.push({
      title: 'Security in Power Platform',
      url: 'https://learn.microsoft.com/en-us/power-platform/admin/security/overview',
      description: 'Overview of security features and controls'
    })
    links.push({
      title: 'Conditional Access Setup',
      url: 'https://learn.microsoft.com/en-us/power-platform/admin/conditional-access',
      description: 'Configure conditional access policies'
    })
  }
  
  if (step.title.includes('Monitor') || step.title.includes('Audit')) {
    links.push({
      title: 'Monitoring and Analytics',
      url: 'https://learn.microsoft.com/en-us/power-platform/admin/analytics-powerapps',
      description: 'Set up monitoring and analytics'
    })
    links.push({
      title: 'Audit Logging',
      url: 'https://learn.microsoft.com/en-us/power-platform/admin/audit-logging',
      description: 'Configure and use audit logs'
    })
  }
  
  // Add general Power Platform admin link if no specific ones added
  if (links.length === 0) {
    links.push({
      title: 'Power Platform Admin Documentation',
      url: 'https://learn.microsoft.com/en-us/power-platform/admin',
      description: 'General administration guidance'
    })
  }
  
  return links
}

function selectRelevantBestPractices(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): string[] {
  const practices: string[] = []
  
  // Universal best practices
  practices.push('Document all changes and decisions for audit purposes')
  practices.push('Test in non-production environment first')
  practices.push('Establish clear rollback procedures')
  
  // Context-specific practices
  if (context.currentMaturityLevel <= 2) {
    practices.push('Start with basic controls and gradually increase sophistication')
    practices.push('Focus on user education and change management')
  }
  
  if (context.organizationFactors.complianceRequirements === 'high' || 
      context.organizationFactors.complianceRequirements === 'critical') {
    practices.push('Maintain detailed audit logs of all configuration changes')
    practices.push('Regular compliance reviews and attestations')
  }
  
  if (context.organizationFactors.organizationSize === 'enterprise') {
    practices.push('Implement phased rollout approach by region or business unit')
    practices.push('Establish governance committee with cross-functional representation')
  }
  
  return practices
}

function generateQuickStartGuide(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): QuickStartGuide {
  const quickStart: QuickStartGuide = {
    timeToValue: context.currentMaturityLevel <= 2 ? '2-4 weeks' : '1-2 weeks',
    immediateActions: [],
    quickWins: [],
    minimalViableImplementation: []
  }
  
  // Immediate actions based on context
  if (recommendation.impact === 'High') {
    quickStart.immediateActions.push('Schedule emergency governance review')
    quickStart.immediateActions.push('Identify and protect critical assets')
  }
  
  quickStart.immediateActions.push('Assign implementation owner and team')
  quickStart.immediateActions.push('Review current state and identify gaps')
  
  // Quick wins
  if (recommendation.category === 'Security') {
    quickStart.quickWins.push('Enable basic DLP policy for sensitive data')
    quickStart.quickWins.push('Activate audit logging')
  } else if (recommendation.category === 'Governance') {
    quickStart.quickWins.push('Deploy CoE Kit core components')
    quickStart.quickWins.push('Establish environment naming standards')
  }
  
  // Minimal viable implementation
  quickStart.minimalViableImplementation.push('Implement core controls for production environment')
  quickStart.minimalViableImplementation.push('Train key administrators')
  quickStart.minimalViableImplementation.push('Establish monitoring and alerting')
  
  return quickStart
}

function generateTroubleshootingGuide(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): TroubleshootingItem[] {
  const items: TroubleshootingItem[] = []
  
  // Common issues based on maturity level
  if (context.currentMaturityLevel <= 2) {
    items.push({
      issue: 'Lack of administrative permissions',
      symptoms: ['Cannot access admin center', 'Settings appear grayed out'],
      solution: 'Request Global Admin or Power Platform Admin role assignment',
      preventionTips: ['Document required roles upfront', 'Establish role assignment process']
    })
  }
  
  // Category-specific issues
  if (recommendation.category === 'Security' || recommendation.category === 'Data Protection') {
    items.push({
      issue: 'DLP policies blocking legitimate flows',
      symptoms: ['Flows failing with connector errors', 'Users reporting access issues'],
      solution: 'Review DLP policy rules and add business justification exceptions',
      preventionTips: ['Test policies with common scenarios', 'Establish exception request process']
    })
  }
  
  // Scale-specific issues
  if (context.organizationFactors.organizationSize === 'enterprise') {
    items.push({
      issue: 'Inconsistent implementation across regions',
      symptoms: ['Different behavior in different environments', 'Compliance gaps'],
      solution: 'Establish central governance team and standardized procedures',
      preventionTips: ['Create detailed runbooks', 'Regular cross-region sync meetings']
    })
  }
  
  return items
}

function compileRelevantResources(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): Resource[] {
  const resources: Resource[] = [
    {
      title: 'Power Platform Admin Documentation',
      type: 'Documentation',
      url: 'https://learn.microsoft.com/power-platform/admin',
      relevance: 'Essential'
    }
  ]
  
  // Add category-specific resources
  if (recommendation.category === 'Security' || recommendation.category === 'Data Protection') {
    resources.push({
      title: 'Power Platform Security Best Practices',
      type: 'Documentation',
      url: 'https://learn.microsoft.com/power-platform/admin/security-overview',
      relevance: 'Essential'
    })
  }
  
  // Add maturity-specific resources
  if (context.currentMaturityLevel <= 2) {
    resources.push({
      title: 'Power Platform Adoption Framework',
      type: 'Documentation',
      url: 'https://learn.microsoft.com/power-platform/guidance/adoption/methodology',
      relevance: 'Essential'
    })
    resources.push({
      title: 'Getting Started with CoE Kit',
      type: 'Video',
      url: 'https://www.youtube.com/watch?v=CoE-StartKit',
      relevance: 'Recommended',
      estimatedTime: '45 minutes'
    })
  }
  
  // Add compliance-specific resources
  if (context.organizationFactors.complianceRequirements === 'high' || 
      context.organizationFactors.complianceRequirements === 'critical') {
    resources.push({
      title: 'Power Platform Compliance and Data Protection',
      type: 'Documentation',
      url: 'https://learn.microsoft.com/power-platform/admin/data-protection-governance',
      relevance: 'Essential'
    })
  }
  
  return resources
}

// Main function to create fully adaptive implementation plan
export function createAdaptiveImplementationPlan(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): AdaptiveImplementationPlan {
  // Calculate priority and risk
  const priorityScore = calculateImplementationPriority(recommendation, context)
  const riskLevel = determineRiskLevel(recommendation, context)
  
  // Adapt phases based on context
  const adaptedPhases = adaptImplementationPhases(
    recommendation.implementationRoadmap.phases,
    context,
    recommendation
  )
  
  // Identify quick wins
  const quickWins = identifyQuickWins(adaptedPhases, context)
  
  // Calculate total effort
  const estimatedTotalHours = calculateTotalEffort(adaptedPhases)
  
  // Determine implementation approach
  const suggestedApproach = determineSuggestedApproach(
    priorityScore,
    riskLevel,
    context
  )
  
  // Extract dependencies
  const dependencies = extractDependencies(recommendation, context)
  
  return {
    recommendation,
    adaptedPhases,
    priorityScore,
    riskLevel,
    dependencies,
    quickWins,
    estimatedTotalHours,
    suggestedApproach
  }
}

function determineRiskLevel(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): 'Critical' | 'High' | 'Medium' | 'Low' {
  if (recommendation.impact === 'High' && context.currentMaturityLevel <= 2) return 'Critical'
  if (recommendation.category === 'Security' && context.pillarScores.security < 50) return 'Critical'
  if (recommendation.impact === 'High') return 'High'
  if (recommendation.impact === 'Medium' && context.currentMaturityLevel <= 2) return 'High'
  if (recommendation.impact === 'Medium') return 'Medium'
  return 'Low'
}

function identifyQuickWins(
  phases: ImplementationPhase[],
  context: ImplementationContext
): ImplementationTask[] {
  const quickWins: ImplementationTask[] = []
  
  phases.forEach(phase => {
    phase.tasks.forEach(task => {
      if (task.estimatedHours <= 4 && !hasComplexDependencies(task, context)) {
        quickWins.push(task)
      }
    })
  })
  
  return quickWins.slice(0, 3) // Return top 3 quick wins
}

function hasComplexDependencies(
  task: ImplementationTask,
  context: ImplementationContext
): boolean {
  // Check if task requires capabilities not yet in place
  const complexKeywords = ['integration', 'migration', 'compliance', 'multi-region']
  return complexKeywords.some(keyword => 
    task.name.toLowerCase().includes(keyword) ||
    task.description.toLowerCase().includes(keyword)
  )
}

function calculateTotalEffort(phases: ImplementationPhase[]): number {
  return phases.reduce((total, phase) => {
    const phaseHours = phase.tasks.reduce((phaseTotal, task) => {
      return phaseTotal + task.estimatedHours
    }, 0)
    return total + phaseHours
  }, 0)
}

function determineSuggestedApproach(
  priorityScore: number,
  riskLevel: string,
  context: ImplementationContext
): 'Aggressive' | 'Balanced' | 'Conservative' {
  if (riskLevel === 'Critical' && priorityScore > 80) return 'Aggressive'
  if (context.currentMaturityLevel >= 4 && context.resources.availableTeamMembers >= 5) return 'Aggressive'
  if (context.currentMaturityLevel <= 2 || context.resources.timeConstraints) return 'Conservative'
  return 'Balanced'
}

function extractDependencies(
  recommendation: SecurityRecommendation,
  context: ImplementationContext
): string[] {
  const dependencies = [...recommendation.implementationRoadmap.prerequisites]
  
  // Add context-specific dependencies
  if (context.currentMaturityLevel <= 2) {
    dependencies.push('Basic governance framework')
    dependencies.push('Administrative team training')
  }
  
  if (context.organizationFactors.complianceRequirements === 'critical') {
    dependencies.push('Compliance team approval')
    dependencies.push('Legal review completed')
  }
  
  return [...new Set(dependencies)] // Remove duplicates
}