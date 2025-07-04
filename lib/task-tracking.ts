// Task Tracking and History Management
export interface TaskHistory {
  id: string
  taskId: string
  timestamp: Date
  user: string
  action: 'status_change' | 'assignment' | 'time_update' | 'blocked' | 'unblocked' | 'comment'
  previousValue?: string
  newValue: string
  comment?: string
}

export interface TeamMember {
  id: string
  name: string
  email?: string
  role?: string
  avatar?: string
}

export interface TaskTracking {
  taskId: string
  currentStatus: string
  assignedTo: string[]
  estimatedHours: number
  actualHours?: number
  blockerNotes?: string
  history: TaskHistory[]
  teamMembers: TeamMember[]
  lastUpdated: Date
  lastUpdatedBy: string
}

// Time estimation factors based on organization profile
export interface TimeEstimationFactors {
  organizationSize: 'small' | 'medium' | 'large' | 'enterprise'
  teamExperience: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  existingInfrastructure: 'none' | 'basic' | 'moderate' | 'mature'
  complianceRequirements: 'low' | 'medium' | 'high' | 'critical'
  changeManagementComplexity: 'simple' | 'moderate' | 'complex' | 'very_complex'
}

// Baseline estimates (in hours) for different task types
export const baselineEstimates: Record<string, number> = {
  'analysis': 16,
  'planning': 8,
  'configuration': 24,
  'testing': 16,
  'deployment': 12,
  'validation': 8,
  'documentation': 12,
  'training': 20,
  'monitoring_setup': 8,
  'compliance_review': 16,
  'security_review': 12,
  'architecture_design': 24,
  'implementation': 32,
  'migration': 40,
  'integration': 24,
  'automation': 16
}

// Calculate adaptive time estimate based on factors
export function calculateAdaptiveEstimate(
  baselineHours: number,
  factors: TimeEstimationFactors
): number {
  let multiplier = 1.0

  // Organization size factor
  switch (factors.organizationSize) {
    case 'small': multiplier *= 0.7; break
    case 'medium': multiplier *= 1.0; break
    case 'large': multiplier *= 1.3; break
    case 'enterprise': multiplier *= 1.6; break
  }

  // Team experience factor
  switch (factors.teamExperience) {
    case 'beginner': multiplier *= 1.5; break
    case 'intermediate': multiplier *= 1.2; break
    case 'advanced': multiplier *= 0.9; break
    case 'expert': multiplier *= 0.7; break
  }

  // Infrastructure maturity factor
  switch (factors.existingInfrastructure) {
    case 'none': multiplier *= 1.4; break
    case 'basic': multiplier *= 1.2; break
    case 'moderate': multiplier *= 1.0; break
    case 'mature': multiplier *= 0.8; break
  }

  // Compliance requirements factor
  switch (factors.complianceRequirements) {
    case 'low': multiplier *= 0.9; break
    case 'medium': multiplier *= 1.0; break
    case 'high': multiplier *= 1.3; break
    case 'critical': multiplier *= 1.6; break
  }

  // Change management complexity
  switch (factors.changeManagementComplexity) {
    case 'simple': multiplier *= 0.8; break
    case 'moderate': multiplier *= 1.0; break
    case 'complex': multiplier *= 1.3; break
    case 'very_complex': multiplier *= 1.6; break
  }

  return Math.round(baselineHours * multiplier)
}

// Get task type from task name
export function getTaskType(taskName: string): string {
  const name = taskName.toLowerCase()
  
  if (name.includes('analysis') || name.includes('assess')) return 'analysis'
  if (name.includes('planning') || name.includes('plan')) return 'planning'
  if (name.includes('configuration') || name.includes('configure')) return 'configuration'
  if (name.includes('testing') || name.includes('test')) return 'testing'
  if (name.includes('deployment') || name.includes('deploy')) return 'deployment'
  if (name.includes('validation') || name.includes('validate')) return 'validation'
  if (name.includes('documentation') || name.includes('document')) return 'documentation'
  if (name.includes('training') || name.includes('train')) return 'training'
  if (name.includes('monitoring') || name.includes('monitor')) return 'monitoring_setup'
  if (name.includes('compliance')) return 'compliance_review'
  if (name.includes('security')) return 'security_review'
  if (name.includes('architecture') || name.includes('design')) return 'architecture_design'
  if (name.includes('implementation') || name.includes('implement')) return 'implementation'
  if (name.includes('migration') || name.includes('migrate')) return 'migration'
  if (name.includes('integration') || name.includes('integrate')) return 'integration'
  if (name.includes('automation') || name.includes('automate')) return 'automation'
  
  return 'implementation' // default
}

// Create a new history entry
export function createHistoryEntry(
  taskId: string,
  user: string,
  action: TaskHistory['action'],
  previousValue: string | undefined,
  newValue: string,
  comment?: string
): TaskHistory {
  return {
    id: `${taskId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    timestamp: new Date(),
    user,
    action,
    previousValue,
    newValue,
    comment
  }
}

// Format history entry for display
export function formatHistoryEntry(entry: TaskHistory): string {
  const timeAgo = getTimeAgo(entry.timestamp)
  
  switch (entry.action) {
    case 'status_change':
      return `${entry.user} changed status from "${entry.previousValue}" to "${entry.newValue}" ${timeAgo}`
    case 'assignment':
      return `${entry.user} assigned to ${entry.newValue} ${timeAgo}`
    case 'time_update':
      return `${entry.user} updated estimate from ${entry.previousValue}h to ${entry.newValue}h ${timeAgo}`
    case 'blocked':
      return `${entry.user} marked as blocked: "${entry.comment}" ${timeAgo}`
    case 'unblocked':
      return `${entry.user} removed blocker ${timeAgo}`
    case 'comment':
      return `${entry.user} commented: "${entry.comment}" ${timeAgo}`
    default:
      return `${entry.user} performed ${entry.action} ${timeAgo}`
  }
}

// Get relative time string
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return date.toLocaleDateString()
}

// Initialize task tracking for a task
export function initializeTaskTracking(
  taskId: string,
  taskName: string,
  assignedTo: string,
  factors: TimeEstimationFactors
): TaskTracking {
  const taskType = getTaskType(taskName)
  const baselineHours = baselineEstimates[taskType] || 16
  const estimatedHours = calculateAdaptiveEstimate(baselineHours, factors)
  
  return {
    taskId,
    currentStatus: 'Not Started',
    assignedTo: [assignedTo],
    estimatedHours,
    history: [
      createHistoryEntry(
        taskId,
        'System',
        'status_change',
        undefined,
        'Not Started',
        'Task initialized'
      )
    ],
    teamMembers: [],
    lastUpdated: new Date(),
    lastUpdatedBy: 'System'
  }
}

// Update task status with history
export function updateTaskStatus(
  tracking: TaskTracking,
  newStatus: string,
  user: string,
  blockerNotes?: string
): TaskTracking {
  const history = createHistoryEntry(
    tracking.taskId,
    user,
    'status_change',
    tracking.currentStatus,
    newStatus
  )
  
  const updatedTracking = {
    ...tracking,
    currentStatus: newStatus,
    history: [...tracking.history, history],
    lastUpdated: new Date(),
    lastUpdatedBy: user
  }
  
  // If blocked, add blocker notes
  if (newStatus === 'Blocked' && blockerNotes) {
    const blockerHistory = createHistoryEntry(
      tracking.taskId,
      user,
      'blocked',
      undefined,
      newStatus,
      blockerNotes
    )
    updatedTracking.blockerNotes = blockerNotes
    updatedTracking.history.push(blockerHistory)
  } else if (tracking.currentStatus === 'Blocked' && newStatus !== 'Blocked') {
    // Unblocked
    const unblockedHistory = createHistoryEntry(
      tracking.taskId,
      user,
      'unblocked',
      'Blocked',
      newStatus
    )
    updatedTracking.blockerNotes = undefined
    updatedTracking.history.push(unblockedHistory)
  }
  
  return updatedTracking
}

// Add team member to task
export function addTeamMember(
  tracking: TaskTracking,
  member: TeamMember,
  user: string
): TaskTracking {
  const history = createHistoryEntry(
    tracking.taskId,
    user,
    'assignment',
    tracking.assignedTo.join(', '),
    [...tracking.assignedTo, member.name].join(', ')
  )
  
  return {
    ...tracking,
    assignedTo: [...tracking.assignedTo, member.name],
    teamMembers: [...tracking.teamMembers, member],
    history: [...tracking.history, history],
    lastUpdated: new Date(),
    lastUpdatedBy: user
  }
}

// Update time estimate
export function updateTimeEstimate(
  tracking: TaskTracking,
  newHours: number,
  user: string,
  reason?: string
): TaskTracking {
  const history = createHistoryEntry(
    tracking.taskId,
    user,
    'time_update',
    tracking.estimatedHours.toString(),
    newHours.toString(),
    reason
  )
  
  return {
    ...tracking,
    estimatedHours: newHours,
    history: [...tracking.history, history],
    lastUpdated: new Date(),
    lastUpdatedBy: user
  }
}

// Get task timeline visualization data
export function getTaskTimeline(tracking: TaskTracking): {
  events: Array<{
    date: Date
    type: string
    description: string
    user: string
  }>
} {
  const events = tracking.history.map(entry => ({
    date: entry.timestamp,
    type: entry.action,
    description: formatHistoryEntry(entry),
    user: entry.user
  }))
  
  return {
    events: events.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
}