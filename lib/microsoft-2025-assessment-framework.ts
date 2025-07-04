// Microsoft Power Platform 2025 Assessment Framework
// Based on latest Microsoft documentation and best practices

import type { Question } from '@/types/assessment'

export interface AssessmentPillar {
  id: string
  name: string
  description: string
  weight: number
  icon: string
  maturityLevels: MaturityLevel[]
  questions: Question[]
}

export interface MaturityLevel {
  level: number
  name: string
  description: string
  characteristics: string[]
  recommendations?: string[]
}

export interface SecurityRecommendation {
  title: string
  description: string
  impact: 'High' | 'Medium' | 'Low'
  effort: 'High' | 'Medium' | 'Low'
  category: string
  actionItems: string[]
  evidenceCriteria: EvidenceCriteria
  implementationRoadmap: ImplementationRoadmap
}

export interface EvidenceCriteria {
  required: string[]
  optional: string[]
  formats: string[]
  validationSteps: string[]
}

export interface ImplementationRoadmap {
  phases: ImplementationPhase[]
  totalDuration: string
  prerequisites: string[]
  risks: string[]
}

export interface ImplementationPhase {
  phase: number
  name: string
  duration: string
  sprintStatus: 'Not Started' | 'Planning' | 'In Progress' | 'Completed' | 'Blocked'
  tasks: ImplementationTask[]
  deliverables: string[]
  dependencies: string[]
}

export interface ImplementationTask {
  id: string
  name: string
  description: string
  estimatedHours: number
  assignedTo: string
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked'
  acceptanceCriteria: string[]
}

// Power Platform Maturity Model (Official Microsoft Framework)
export const maturityLevels: MaturityLevel[] = [
  {
    level: 1,
    name: "Initial",
    description: "Ad hoc processes, pockets of experimentation, no overall strategy",
    characteristics: [
      "No formal governance",
      "Shadow IT prevalent",
      "No security policies",
      "Individual initiatives"
    ]
  },
  {
    level: 2,
    name: "Repeatable",
    description: "Well-documented processes, central IT team implements controls",
    characteristics: [
      "Basic DLP policies exist",
      "Some documentation",
      "IT-led governance",
      "Manual monitoring"
    ]
  },
  {
    level: 3,
    name: "Defined",
    description: "Standardized practices confirmed as standard business processes",
    characteristics: [
      "CoE established",
      "Standard policies enforced",
      "Training programs exist",
      "Regular audits"
    ]
  },
  {
    level: 4,
    name: "Capable",
    description: "Quantitatively managed processes with agreed-upon metrics",
    characteristics: [
      "Metrics-driven governance",
      "Automated monitoring",
      "Proactive management",
      "Continuous improvement"
    ]
  },
  {
    level: 5,
    name: "Efficient",
    description: "Optimized state with continuous improvement",
    characteristics: [
      "Innovation culture",
      "Self-service governance",
      "AI-driven insights",
      "Industry leadership"
    ]
  }
]

// Import complete questions with full guidance
import { enhancedGovernanceQuestions } from './microsoft-2025-assessment-enhanced'
import { 
  completeSecurityQuestions,
  completeReliabilityQuestions,
  completePerformanceQuestions,
  completeOperationalQuestions
} from './microsoft-2025-assessment-complete'

// Assessment Pillars based on Microsoft Well-Architected Framework + Governance
export const assessmentPillars: AssessmentPillar[] = [
  {
    id: "governance",
    name: "Governance & Administration",
    description: "Organizational control, compliance, and administration capabilities",
    weight: 25,
    icon: "HiShieldCheck",
    maturityLevels: maturityLevels,
    questions: enhancedGovernanceQuestions as Question[]
  },
  {
    id: "security",
    name: "Security & Compliance",
    description: "Security controls, compliance measures, and data protection",
    weight: 25,
    icon: "HiLockClosed",
    maturityLevels: maturityLevels,
    questions: completeSecurityQuestions as Question[]
  },
  {
    id: "reliability",
    name: "Reliability",
    description: "Ensure workload meets uptime and recovery targets",
    weight: 15,
    icon: "HiServer",
    maturityLevels: maturityLevels,
    questions: completeReliabilityQuestions as Question[]
  },
  {
    id: "performance",
    name: "Performance Efficiency",
    description: "Optimize resource usage and meet performance targets",
    weight: 15,
    icon: "HiLightningBolt",
    maturityLevels: maturityLevels,
    questions: completePerformanceQuestions as Question[]
  },
  {
    id: "operations",
    name: "Operational Excellence",
    description: "Run and monitor systems to deliver business value",
    weight: 20,
    icon: "HiCog",
    maturityLevels: maturityLevels,
    questions: completeOperationalQuestions as Question[]
  }
]

// Security Score Calculation (Based on Microsoft's Security Hub)
interface SecurityScoreResult {
  score: 'Low' | 'Medium' | 'High'
  numericScore: number // 0-100 for internal use
  recommendations: SecurityRecommendation[]
}

export function calculateSecurityScore(responses: Record<string, any>): SecurityScoreResult {
  let score = 0
  const maxScore = 100
  const recommendations: SecurityRecommendation[] = []

  // Critical security features with enhanced recommendations
  const criticalFeatures = [
    { 
      id: 'sec-2025-1', 
      title: 'Enable Data Exfiltration Prevention',
      description: 'Implement comprehensive data loss prevention policies to protect sensitive information from unauthorized access and exfiltration.',
      category: 'Data Protection'
    },
    { 
      id: 'sec-2025-2', 
      title: 'Configure Continuous Access Evaluation',
      description: 'Enable real-time access policy evaluation to adapt to changing security conditions and maintain zero-trust principles.',
      category: 'Identity & Access'
    },
    { 
      id: 'gov-2025-4', 
      title: 'Implement DLP Policies',
      description: 'Deploy comprehensive data loss prevention policies across all Power Platform workloads and environments.',
      category: 'Governance'
    },
    {
      id: 'regional-2025-1',
      title: 'Configure Regional Compliance Requirements',
      description: 'Implement region-specific compliance controls for GDPR, data localization, and regulatory requirements.',
      category: 'Regional Governance'
    },
    {
      id: 'governance-level-2025-1',
      title: 'Establish Tenant vs Environment Level Controls',
      description: 'Properly separate tenant-level policies from environment-specific controls with clear inheritance rules.',
      category: 'Governance Architecture'
    }
  ]

  // Important features with enhanced recommendations
  const importantFeatures = [
    { 
      id: 'gov-2025-3', 
      title: 'Monitor Security Hub',
      description: 'Establish continuous monitoring of security metrics and compliance status through Power Platform Security Hub.',
      category: 'Monitoring'
    },
    { 
      id: 'sec-2025-3', 
      title: 'Configure Customer-Managed Keys',
      description: 'Implement customer-managed encryption keys for enhanced data protection and compliance requirements.',
      category: 'Encryption'
    },
    { 
      id: 'sec-2025-5', 
      title: 'Implement Sensitivity Labels',
      description: 'Deploy Microsoft Purview sensitivity labels to classify and protect sensitive content across Power Platform.',
      category: 'Information Protection'
    },
    {
      id: 'regional-2025-2',
      title: 'Configure Regional Settings (Timezone/Currency)',
      description: 'Properly configure timezone and currency settings for each regional environment to prevent business logic errors.',
      category: 'Regional Configuration'
    },
    {
      id: 'governance-level-2025-2',
      title: 'Configure Policy Inheritance',
      description: 'Set up hierarchical policy management with appropriate override permissions for different environment types.',
      category: 'Governance Architecture'
    },
    {
      id: 'governance-level-2025-3',
      title: 'Configure Environment-Specific Controls',
      description: 'Implement environment-type specific governance controls for access, retention, and resource quotas.',
      category: 'Environment Management'
    }
  ]

  // Check critical features
  criticalFeatures.forEach(feature => {
    const response = responses[feature.id]
    if (response && response >= 4) {
      score += 15
    } else {
      recommendations.push({
        title: feature.title,
        impact: 'High',
        effort: 'Medium',
        category: feature.category,
        description: feature.description,
        actionItems: [
          `Review current implementation of ${feature.title}`,
          'Develop detailed implementation plan with timeline',
          'Assign dedicated security team resources',
          'Set target completion within 30 days',
          'Establish monitoring and validation procedures'
        ],
        evidenceCriteria: {
          required: feature.category === 'Regional Governance' ? [
            'Regional compliance matrix documentation',
            'Environment configuration screenshots per region',
            'Data residency compliance verification',
            'GDPR/regional regulation compliance sign-off',
            'Cross-border data transfer restrictions testing'
          ] : feature.category === 'Governance Architecture' ? [
            'Policy hierarchy documentation',
            'Tenant vs environment control matrix',
            'Policy inheritance configuration screenshots',
            'Environment classification documentation',
            'Governance team approval'
          ] : [
            'Security policy documentation',
            'Implementation configuration screenshots',
            'Validation test results',
            'Security team sign-off'
          ],
          optional: feature.category === 'Regional Governance' ? [
            'Regional legal review documentation',
            'Multi-timezone testing results',
            'Currency conversion testing',
            'Regional user training records'
          ] : feature.category === 'Governance Architecture' ? [
            'Environment lifecycle documentation',
            'Policy conflict resolution procedures',
            'Override approval workflows',
            'Governance monitoring dashboard'
          ] : [
            'Risk assessment documentation',
            'User training completion records',
            'Audit trail logs'
          ],
          formats: ['.pdf', '.docx', '.xlsx', '.png', '.jpg'],
          validationSteps: feature.category === 'Regional Governance' ? [
            'Verify regional environment compliance settings',
            'Test cross-border data transfer restrictions',
            'Validate timezone and currency configurations',
            'Review regional compliance audit logs',
            'Confirm GDPR right-to-be-forgotten implementation'
          ] : feature.category === 'Governance Architecture' ? [
            'Verify tenant-level policies are active',
            'Test environment-level policy inheritance',
            'Validate override permissions and workflows',
            'Review policy compliance across all environments',
            'Confirm governance monitoring is operational'
          ] : [
            'Verify policy is active and enforced',
            'Test with sample data/scenarios',
            'Review security logs for compliance',
            'Validate with security team'
          ]
        },
        implementationRoadmap: {
          totalDuration: feature.category === 'Regional Governance' ? '6-8 weeks' :
                        feature.category === 'Governance Architecture' ? '5-7 weeks' : '4-6 weeks',
          prerequisites: feature.category === 'Regional Governance' ? [
            'Global compliance team approval',
            'Regional legal review completion',
            'Multi-region admin access to Power Platform',
            'Regional data residency requirements documented'
          ] : feature.category === 'Governance Architecture' ? [
            'Governance team approval',
            'Tenant admin access to Power Platform',
            'Environment classification completed',
            'Policy architecture design approved'
          ] : [
            'Security team approval',
            'Admin access to Power Platform',
            'Backup and rollback plan'
          ],
          risks: feature.category === 'Regional Governance' ? [
            'Cross-region data synchronization compliance violations',
            'Timezone handling errors in business processes',
            'Currency conversion calculation errors',
            'Regional regulatory requirement changes during implementation'
          ] : feature.category === 'Governance Architecture' ? [
            'Policy conflicts between tenant and environment levels',
            'Unintended policy inheritance blocking development',
            'Complex override workflows causing delays',
            'Environment misclassification leading to wrong policies'
          ] : [
            'Potential user access disruption',
            'Configuration complexity',
            'Integration with existing systems'
          ],
          phases: [
            {
              phase: 1,
              name: 'Planning & Analysis',
              duration: '1 week',
              sprintStatus: 'Not Started',
              tasks: [
                {
                  id: `${feature.id}-task-1`,
                  name: feature.category === 'Regional Governance' ? 'Regional Compliance Mapping' :
                        feature.category === 'Governance Architecture' ? 'Policy Architecture Design' : 'Security Requirements Analysis',
                  description: feature.category === 'Regional Governance' ? 'Map regional compliance requirements (GDPR, data residency, local regulations)' :
                              feature.category === 'Governance Architecture' ? 'Design tenant vs environment policy architecture' : 'Analyze current security posture and define requirements',
                  estimatedHours: feature.category === 'Regional Governance' ? 24 : 16,
                  assignedTo: feature.category === 'Regional Governance' ? 'Compliance Officer' :
                             feature.category === 'Governance Architecture' ? 'Governance Architect' : 'Security Architect',
                  status: 'Not Started',
                  acceptanceCriteria: feature.category === 'Regional Governance' ? ['Regional compliance matrix created', 'Data residency requirements documented'] :
                                     feature.category === 'Governance Architecture' ? ['Policy hierarchy documented', 'Inheritance rules defined'] : ['Requirements documented', 'Stakeholder approval obtained']
                },
                {
                  id: `${feature.id}-task-2`,
                  name: feature.category === 'Regional Governance' ? 'Multi-Region Environment Planning' :
                        feature.category === 'Governance Architecture' ? 'Environment Classification' : 'Impact Assessment',
                  description: feature.category === 'Regional Governance' ? 'Plan environment structure for each region (EU-PROD, APAC-DEV, etc.)' :
                              feature.category === 'Governance Architecture' ? 'Classify environments by type and define governance levels' : 'Assess impact on existing workflows and users',
                  estimatedHours: feature.category === 'Regional Governance' ? 16 : 8,
                  assignedTo: feature.category === 'Regional Governance' ? 'Global Infrastructure Lead' :
                             feature.category === 'Governance Architecture' ? 'Environment Manager' : 'Business Analyst',
                  status: 'Not Started',
                  acceptanceCriteria: feature.category === 'Regional Governance' ? ['Environment naming convention defined', 'Regional architecture approved'] :
                                     feature.category === 'Governance Architecture' ? ['Environment types classified', 'Governance profiles created'] : ['Impact analysis completed', 'Mitigation plan created']
                }
              ],
              deliverables: feature.category === 'Regional Governance' ? ['Regional compliance document', 'Multi-region architecture'] :
                           feature.category === 'Governance Architecture' ? ['Policy architecture document', 'Environment classification'] : ['Security requirements document', 'Impact assessment report'],
              dependencies: []
            },
            {
              phase: 2,
              name: 'Configuration & Testing',
              duration: feature.category === 'Regional Governance' ? '3 weeks' : '2 weeks',
              sprintStatus: 'Not Started',
              tasks: [
                {
                  id: `${feature.id}-task-3`,
                  name: feature.category === 'Regional Governance' ? 'Regional Environment Setup' :
                        feature.category === 'Governance Architecture' ? 'Policy Hierarchy Implementation' : 'Security Policy Configuration',
                  description: feature.category === 'Regional Governance' ? 'Create region-specific environments with compliance settings' :
                              feature.category === 'Governance Architecture' ? 'Implement tenant and environment level policy hierarchy' : 'Configure security policies in test environment',
                  estimatedHours: feature.category === 'Regional Governance' ? 32 : 24,
                  assignedTo: feature.category === 'Regional Governance' ? 'Global Infrastructure Lead' :
                             feature.category === 'Governance Architecture' ? 'Governance Engineer' : 'Security Engineer',
                  status: 'Not Started',
                  acceptanceCriteria: feature.category === 'Regional Governance' ? ['Regional environments created', 'Compliance settings configured', 'DLP policies per region'] :
                                     feature.category === 'Governance Architecture' ? ['Policy inheritance working', 'Override permissions configured'] : ['Policies configured', 'Test environment validated']
                },
                {
                  id: `${feature.id}-task-4`,
                  name: feature.category === 'Regional Governance' ? 'Multi-Region Compliance Testing' :
                        feature.category === 'Governance Architecture' ? 'Policy Inheritance Testing' : 'User Acceptance Testing',
                  description: feature.category === 'Regional Governance' ? 'Test data residency, timezone handling, and cross-region restrictions' :
                              feature.category === 'Governance Architecture' ? 'Validate policy inheritance and override functionality' : 'Conduct UAT with key stakeholders',
                  estimatedHours: feature.category === 'Regional Governance' ? 24 : 16,
                  assignedTo: feature.category === 'Regional Governance' ? 'Compliance Testing Team' :
                             feature.category === 'Governance Architecture' ? 'Governance QA' : 'QA Team',
                  status: 'Not Started',
                  acceptanceCriteria: feature.category === 'Regional Governance' ? ['Regional compliance verified', 'Cross-border restrictions tested'] :
                                     feature.category === 'Governance Architecture' ? ['Policy inheritance validated', 'Override workflows tested'] : ['UAT completed', 'Issues documented and resolved']
                }
              ],
              deliverables: feature.category === 'Regional Governance' ? ['Regional environments', 'Compliance test results'] :
                           feature.category === 'Governance Architecture' ? ['Policy hierarchy', 'Inheritance test results'] : ['Configured test environment', 'UAT results'],
              dependencies: ['Phase 1 completion']
            },
            {
              phase: 3,
              name: 'Production Deployment',
              duration: feature.category === 'Regional Governance' ? '2 weeks' : '1 week',
              sprintStatus: 'Not Started',
              tasks: [
                {
                  id: `${feature.id}-task-5`,
                  name: feature.category === 'Regional Governance' ? 'Global Production Rollout' :
                        feature.category === 'Governance Architecture' ? 'Policy Hierarchy Deployment' : 'Production Deployment',
                  description: feature.category === 'Regional Governance' ? 'Deploy regional compliance settings across all production environments' :
                              feature.category === 'Governance Architecture' ? 'Deploy tenant and environment level policies to production' : 'Deploy security policies to production environment',
                  estimatedHours: feature.category === 'Regional Governance' ? 24 : 12,
                  assignedTo: feature.category === 'Regional Governance' ? 'Global Operations Team' :
                             feature.category === 'Governance Architecture' ? 'Governance DevOps' : 'DevOps Engineer',
                  status: 'Not Started',
                  acceptanceCriteria: feature.category === 'Regional Governance' ? ['All regional environments deployed', 'Compliance monitoring active', 'Cross-region restrictions verified'] :
                                     feature.category === 'Governance Architecture' ? ['Policy hierarchy active', 'Inheritance rules enforced', 'Override workflows operational'] : ['Policies deployed', 'Monitoring active']
                },
                {
                  id: `${feature.id}-task-6`,
                  name: feature.category === 'Regional Governance' ? 'Global Compliance Validation' :
                        feature.category === 'Governance Architecture' ? 'Governance Monitoring Setup' : 'Post-Deployment Validation',
                  description: feature.category === 'Regional Governance' ? 'Validate compliance across all regions and monitor for violations' :
                              feature.category === 'Governance Architecture' ? 'Set up monitoring for policy compliance and violations across environments' : 'Validate deployment and monitor for issues',
                  estimatedHours: feature.category === 'Regional Governance' ? 16 : 8,
                  assignedTo: feature.category === 'Regional Governance' ? 'Global Compliance Team' :
                             feature.category === 'Governance Architecture' ? 'Governance Operations' : 'Security Team',
                  status: 'Not Started',
                  acceptanceCriteria: feature.category === 'Regional Governance' ? ['Global compliance dashboard active', 'Regional violation alerts configured'] :
                                     feature.category === 'Governance Architecture' ? ['Governance dashboard operational', 'Policy violation alerts configured'] : ['Validation completed', 'Monitoring dashboard active']
                }
              ],
              deliverables: feature.category === 'Regional Governance' ? ['Global compliance deployment', 'Regional monitoring'] :
                           feature.category === 'Governance Architecture' ? ['Governance production system', 'Policy monitoring'] : ['Production deployment', 'Monitoring dashboard'],
              dependencies: ['Phase 2 completion']
            }
          ]
        }
      })
    }
  })

  // Check important features with similar enhanced structure
  importantFeatures.forEach(feature => {
    const response = responses[feature.id]
    if (response && response >= 3) {
      score += 10
    } else {
      recommendations.push({
        title: feature.title,
        impact: 'Medium',
        effort: 'Medium',
        category: feature.category,
        description: feature.description,
        actionItems: [
          `Evaluate current state of ${feature.title}`,
          'Create implementation plan with milestones',
          'Allocate required resources',
          'Set target completion within 60 days'
        ],
        evidenceCriteria: {
          required: [
            'Configuration documentation',
            'Implementation screenshots',
            'Testing results'
          ],
          optional: [
            'Training materials',
            'User feedback'
          ],
          formats: ['.pdf', '.docx', '.png', '.jpg'],
          validationSteps: [
            'Verify configuration',
            'Test functionality',
            'Review logs'
          ]
        },
        implementationRoadmap: {
          totalDuration: '2-4 weeks',
          prerequisites: ['Admin access', 'Team availability'],
          risks: ['Configuration complexity', 'User adoption'],
          phases: [
            {
              phase: 1,
              name: 'Planning',
              duration: '1 week',
              sprintStatus: 'Not Started',
              tasks: [
                {
                  id: `${feature.id}-plan-1`,
                  name: 'Requirements Gathering',
                  description: 'Define implementation requirements',
                  estimatedHours: 8,
                  assignedTo: 'Team Lead',
                  status: 'Not Started',
                  acceptanceCriteria: ['Requirements defined']
                }
              ],
              deliverables: ['Requirements document'],
              dependencies: []
            },
            {
              phase: 2,
              name: 'Implementation',
              duration: '1-3 weeks',
              sprintStatus: 'Not Started',
              tasks: [
                {
                  id: `${feature.id}-impl-1`,
                  name: 'Configuration',
                  description: 'Implement configuration',
                  estimatedHours: 16,
                  assignedTo: 'Engineer',
                  status: 'Not Started',
                  acceptanceCriteria: ['Configuration completed']
                }
              ],
              deliverables: ['Implemented solution'],
              dependencies: ['Phase 1 completion']
            }
          ]
        }
      })
    }
  })

  // Add points for other security practices
  if (responses['gov-2025-1'] >= 4) score += 10 // CoE deployment
  if (responses['gov-2025-2'] >= 4) score += 10 // Managed Environments
  if (responses['gov-2025-5'] >= 3) score += 5  // Bulk governance

  // Determine qualitative score
  let qualitativeScore: 'Low' | 'Medium' | 'High'
  if (score >= 80) {
    qualitativeScore = 'High'
  } else if (score >= 50) {
    qualitativeScore = 'Medium'
  } else {
    qualitativeScore = 'Low'
  }

  // Sort recommendations by impact
  recommendations.sort((a, b) => {
    const impactOrder = { 'High': 0, 'Medium': 1, 'Low': 2 }
    return impactOrder[a.impact] - impactOrder[b.impact]
  })

  return {
    score: qualitativeScore,
    numericScore: score,
    recommendations: recommendations.slice(0, 5) // Top 5 recommendations
  }
}

// Maturity Score Calculation
export function calculateMaturityLevel(responses: Record<string, any>): {
  level: number
  name: string
  score: number
  nextLevelGap: number
  recommendations: string[]
} {
  let totalScore = 0
  let maxPossibleScore = 0
  
  // Calculate weighted scores across all pillars
  assessmentPillars.forEach(pillar => {
    pillar.questions.forEach(question => {
      const response = responses[question.id]
      if (response) {
        const questionScore = (response / 5) * question.weight
        totalScore += questionScore
      }
      maxPossibleScore += question.weight
    })
  })

  const percentageScore = (totalScore / maxPossibleScore) * 100
  
  // Determine maturity level
  let level: number
  let name: string
  if (percentageScore >= 90) {
    level = 5
    name = "Efficient"
  } else if (percentageScore >= 75) {
    level = 4
    name = "Capable"
  } else if (percentageScore >= 60) {
    level = 3
    name = "Defined"
  } else if (percentageScore >= 40) {
    level = 2
    name = "Repeatable"
  } else {
    level = 1
    name = "Initial"
  }

  // Calculate gap to next level
  const nextLevelThreshold = level < 5 ? [40, 60, 75, 90][level - 1] : 100
  const nextLevelGap = Math.max(0, nextLevelThreshold - percentageScore)

  // Generate recommendations based on current level
  const recommendations = generateMaturityRecommendations(level, responses)

  return {
    level,
    name,
    score: Math.round(percentageScore),
    nextLevelGap: Math.round(nextLevelGap),
    recommendations
  }
}

function generateMaturityRecommendations(currentLevel: number, responses: Record<string, any>): string[] {
  const recommendations: string[] = []

  switch (currentLevel) {
    case 1:
      recommendations.push("Deploy Center of Excellence Starter Kit immediately")
      recommendations.push("Implement basic DLP policies using 'block first' approach")
      recommendations.push("Designate Power Platform administrators")
      break
    case 2:
      recommendations.push("Upgrade to Managed Environments for production workloads")
      recommendations.push("Enable Security Hub and act on recommendations")
      recommendations.push("Establish formal training and certification program")
      break
    case 3:
      recommendations.push("Implement automated governance at scale")
      recommendations.push("Configure advanced security features (CAE, CMK)")
      recommendations.push("Establish metrics-driven governance with KPIs")
      break
    case 4:
      recommendations.push("Optimize for continuous improvement culture")
      recommendations.push("Implement AI-driven governance with Copilot")
      recommendations.push("Share best practices with Microsoft community")
      break
    default:
      recommendations.push("Maintain leadership position through innovation")
      recommendations.push("Contribute to Power Platform product development")
      recommendations.push("Mentor other organizations on their journey")
  }

  // Add specific recommendations based on low scores
  assessmentPillars.forEach(pillar => {
    pillar.questions.forEach(question => {
      if (responses[question.id] < 3 && question.required) {
        recommendations.push(`Critical: ${question.bestPractice}`)
      }
    })
  })

  return recommendations.slice(0, 5) // Top 5 recommendations
}

// Compliance Check Function
export function performComplianceCheck(responses: Record<string, any>): {
  compliant: boolean
  score: number
  gaps: ComplianceGap[]
  certificationReady: boolean
} {
  const gaps: ComplianceGap[] = []
  let complianceScore = 100

  // Check required compliance items
  const complianceRequirements = [
    { id: 'gov-2025-4', requirement: 'DLP Policies', weight: 20 },
    { id: 'sec-2025-1', requirement: 'Data Exfiltration Prevention', weight: 15 },
    { id: 'sec-2025-2', requirement: 'Continuous Access Evaluation', weight: 15 },
    { id: 'exp-2025-1', requirement: 'WCAG 2.2 Compliance', weight: 20 },
    { id: 'sec-2025-5', requirement: 'Sensitivity Labels', weight: 10 },
    { id: 'rel-2025-2', requirement: 'Backup and Recovery Testing', weight: 10 },
    { id: 'gov-2025-1', requirement: 'CoE Deployment', weight: 10 }
  ]

  complianceRequirements.forEach(req => {
    const response = responses[req.id]
    if (!response || response < 4) {
      complianceScore -= req.weight
      gaps.push({
        requirement: req.requirement,
        current: response || 0,
        target: 4,
        impact: req.weight >= 15 ? 'High' : 'Medium',
        remediation: `Implement ${req.requirement} to meet compliance standards`
      })
    }
  })

  return {
    compliant: complianceScore >= 80,
    score: complianceScore,
    gaps: gaps.sort((a, b) => {
      const impactOrder = { 'High': 0, 'Medium': 1, 'Low': 2 }
      return impactOrder[a.impact] - impactOrder[b.impact]
    }),
    certificationReady: complianceScore >= 90
  }
}

export interface ComplianceGap {
  requirement: string
  current: number
  target: number
  impact: 'High' | 'Medium' | 'Low'
  remediation: string
}

// Helper to get all 2025 questions
export function getMicrosoft2025Questions(): Question[] {
  return assessmentPillars.flatMap(pillar => pillar.questions)
}

// Helper to get pillar scores
export function getPillarScores(responses: Record<string, any>): Record<string, number> {
  const scores: Record<string, number> = {}

  assessmentPillars.forEach(pillar => {
    let pillarScore = 0
    let pillarMaxScore = 0

    pillar.questions.forEach(question => {
      const response = responses[question.id]
      if (response) {
        pillarScore += (response / 5) * question.weight
      }
      pillarMaxScore += question.weight
    })

    scores[pillar.id] = pillarMaxScore > 0 ? Math.round((pillarScore / pillarMaxScore) * 100) : 0
  })

  return scores
}