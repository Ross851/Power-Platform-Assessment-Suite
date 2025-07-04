// Microsoft Power Platform 2025 Assessment Framework - Enhanced with Best Practices
// Based on latest Microsoft documentation and best practices with tenant location guidance

import type { Question } from '@/types/assessment'
import { queryMicrosoftDocs, getDocumentationLinks } from './microsoft-docs-query'

export interface EnhancedQuestion extends Question {
  microsoftDocs?: string[]
  tenantLocation?: string[]
  implementationSteps?: string[]
  commonIssues?: string[]
}

export interface AssessmentPillar {
  id: string
  name: string
  description: string
  weight: number
  icon: string
  maturityLevels: MaturityLevel[]
  questions: EnhancedQuestion[]
}

export interface MaturityLevel {
  level: number
  name: string
  description: string
  characteristics: string[]
}

// Enhanced Governance Questions with Best Practices
export const enhancedGovernanceQuestions: EnhancedQuestion[] = [
  {
    id: "gov-2025-1",
    text: "Is the Center of Excellence (CoE) Starter Kit deployed and updated monthly?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Governance",
    description: "CoE kit provides automated governance and monitoring capabilities",
    guidance: "Microsoft requires CoE kit updates at least every 3 months for security and feature updates",
    bestPractice: "Deploy all components (Core, Governance, Nurture) and automate monthly updates. Use the CoE Setup and Upgrade Wizard app for guided installation.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit",
      "https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup",
      "https://github.com/microsoft/coe-starter-kit"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Resources > Center of Excellence",
      "Make.PowerApps.com > Solutions > Center of Excellence - Core",
      "AppSource > Search 'CoE Starter Kit' > Get it now"
    ],
    implementationSteps: [
      "Create two production environments with English as default language",
      "Install CoE solutions using the Setup Wizard",
      "Configure service account with Power Platform service admin role",
      "Set up data collection method (Traditional or Data Export)",
      "Schedule monthly update flows"
    ],
    commonIssues: [
      "Performance issues in tenants with >10,000 objects - use Data Export method",
      "Missing licenses - requires Power Apps Premium or Dynamics 365",
      "Flows timing out - adjust flow timeout settings"
    ],
    tags: ["coe", "governance", "automation"],
    required: true
  },
  {
    id: "gov-2025-2",
    text: "Are Managed Environments configured for production workloads?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Governance",
    description: "Managed Environments provide enhanced security and governance",
    guidance: "2025 recommendation: Use Managed Environments for all production and UAT environments",
    bestPractice: "Enable Power Platform Advisor for proactive recommendations. Use Environment Groups for scale management.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview",
      "https://learn.microsoft.com/en-us/power-platform/guidance/white-papers/managed-environment-activation",
      "https://learn.microsoft.com/en-us/power-platform/guidance/white-papers/environment-strategy"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > Select Environment > Edit > Enable Managed Environment",
      "Power Platform Admin Center > Settings > Environment Groups (Premium feature)",
      "Power Platform Admin Center > Policies > Environment routing"
    ],
    implementationSteps: [
      "Navigate to Power Platform Admin Center",
      "Select production environment",
      "Click Edit > Enable Managed Environment toggle",
      "Configure sharing limits and solution checker",
      "Set up Weekly digest for monitoring"
    ],
    commonIssues: [
      "Licensing - requires standalone Power Apps/Automate licenses",
      "Cannot disable once enabled without Microsoft support",
      "Apps require explicit sharing after enabling"
    ],
    tags: ["managed environments", "security", "production"]
  },
  {
    id: "gov-2025-3",
    text: "Is the Power Platform Security Hub enabled and monitored?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Governance",
    description: "Security Hub provides centralized security posture assessment",
    guidance: "New in 2025: Security Hub with Low/Medium/High scoring and actionable recommendations",
    bestPractice: "Review Security Hub weekly and act on all High priority recommendations. Enable tenant-wide analytics for score calculation.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/security/security-overview",
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/security-posture-management"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Security (left navigation)",
      "Power Platform Admin Center > Analytics > Tenant > Enable tenant-level analytics",
      "Power Platform Admin Center > Security > Overview > View recommendations"
    ],
    implementationSteps: [
      "Enable tenant-wide analytics (required for scoring)",
      "Wait 24 hours for initial data population",
      "Access Security Hub in PPAC",
      "Review security score and recommendations",
      "Create action plan for Medium/High items"
    ],
    commonIssues: [
      "Security Hub requires tenant admin permissions",
      "24-hour delay for score updates",
      "Currently in preview - features may change"
    ],
    tags: ["security hub", "monitoring", "posture"]
  },
  {
    id: "gov-2025-4",
    text: "Are DLP policies configured following the 'block first' strategy?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Governance",
    description: "No default DLP policies exist - organizations must implement proactively",
    guidance: "Start restrictive and gradually open access as business needs are validated",
    bestPractice: "Configure both tenant-level and environment-specific DLP policies. Create business/non-business connector groups.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention",
      "https://learn.microsoft.com/en-us/power-platform/admin/dlp-custom-connector-enforcement"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Policies > Data policies",
      "Power Platform Admin Center > Data policies > + New Policy",
      "Select 'Multiple environments' for tenant-wide or specific environments"
    ],
    implementationSteps: [
      "Create baseline tenant-wide DLP policy",
      "Move all connectors to 'Blocked' initially",
      "Move Microsoft 365 connectors to 'Business'",
      "Create environment-specific policies as needed",
      "Document exceptions and review quarterly"
    ],
    commonIssues: [
      "No warning before blocking - test in non-prod first",
      "Custom connectors require separate configuration",
      "Child flows inherit parent flow DLP context"
    ],
    tags: ["dlp", "data protection", "compliance"]
  },
  {
    id: "gov-2025-5",
    text: "Is automated bulk governance configured for scale management?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Governance",
    description: "2025 feature for managing high volumes of Power Platform assets",
    guidance: "Use enterprise scale administration tools for organizations with 100+ apps/flows",
    bestPractice: "Implement PowerShell automation for bulk operations. Use CoE Kit for inventory management.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/powershell-getting-started",
      "https://learn.microsoft.com/en-us/power-platform/guidance/coe/power-bi"
    ],
    tenantLocation: [
      "PowerShell: Install-Module Microsoft.PowerApps.Administration.PowerShell",
      "Power Platform Admin Center > Environment Groups (for bulk policy application)",
      "CoE Kit > Power Platform Admin View app"
    ],
    implementationSteps: [
      "Install Power Platform PowerShell modules",
      "Create service principal for automation",
      "Develop scripts for bulk operations",
      "Schedule regular governance runs",
      "Export results to Power BI for reporting"
    ],
    commonIssues: [
      "API throttling with large operations",
      "Service principal requires specific permissions",
      "Consider using Graph API for better performance"
    ],
    tags: ["scale", "automation", "enterprise"]
  },
  {
    id: "dlp-2025-1",
    text: "Are DLP policies configured with custom connector parity enforcement?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "DLP Advanced",
    description: "Custom connectors now have full parity with standard connectors in DLP policies",
    guidance: "2025 Update: Custom connectors support all DLP features including HTTP actions, connector action control, and endpoint filtering",
    bestPractice: "Apply same governance standards to custom connectors as Microsoft connectors. Use endpoint filtering for granular control.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/dlp-custom-connector-parity",
      "https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-classification",
      "https://learn.microsoft.com/en-us/power-platform/admin/dlp-granular-controls"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Policies > Data policies > Custom connectors tab",
      "Power Platform Admin Center > Policies > [Policy] > Connector configurations",
      "Power Platform Admin Center > Policies > [Policy] > Endpoint filtering"
    ],
    implementationSteps: [
      "Review all custom connectors in your tenant",
      "Classify custom connectors (Business/Non-Business/Blocked)",
      "Configure endpoint filtering for external APIs",
      "Set up connector action controls for sensitive operations",
      "Enable HTTP action restrictions in DLP policies",
      "Test custom connector DLP enforcement in non-production"
    ],
    commonIssues: [
      "Legacy custom connectors may need updates for full DLP support",
      "Endpoint filtering requires exact URL matching",
      "HTTP actions in flows must be explicitly allowed",
      "Custom connector sharing still requires separate governance"
    ],
    tags: ["dlp", "custom connectors", "parity", "advanced governance"],
    required: true
  },
  {
    id: "release-2025-1",
    text: "Is your organization actively monitoring Microsoft Release Plans for Power Platform updates?",
    type: "scale",
    weight: 4,
    importance: 5,
    category: "Release Management",
    description: "Stay ahead of platform changes by monitoring official release plans",
    guidance: "Microsoft publishes release waves twice yearly (April & October) with 6-month preview periods",
    bestPractice: "Assign team member to review release plans monthly. Test preview features in sandbox environments. Plan for mandatory updates.",
    microsoftDocs: [
      "https://releaseplans.microsoft.com/en-us/?app=Power+Platform",
      "https://releaseplans.microsoft.com/en-us/?app=Microsoft+Dataverse",
      "https://learn.microsoft.com/en-us/power-platform/admin/general-availability-deployment"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Settings > Features > Preview features",
      "Power Platform Admin Center > Help + support > Message center",
      "Microsoft 365 Admin Center > Health > Message center (filtered for Power Platform)"
    ],
    implementationSteps: [
      "Bookmark release plans for Power Platform and Dataverse",
      "Set up RSS feed or email alerts for release plan updates",
      "Create monthly review cadence for upcoming features",
      "Map release plan items to your roadmap",
      "Enable preview features in sandbox for testing",
      "Document impacts and create adoption plans"
    ],
    commonIssues: [
      "Preview features may have breaking changes",
      "Some features are region-specific in initial rollout",
      "Mandatory updates can break existing functionality",
      "Feature rollout dates can shift based on region"
    ],
    tags: ["release management", "updates", "preview features"],
    required: true
  },
  {
    id: "dataverse-2025-1",
    text: "Are you leveraging latest Dataverse features for performance and governance?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Platform Features",
    description: "Dataverse 2025 includes elastic tables, enhanced search, and improved bulk operations",
    guidance: "New features include Copilot in Dataverse, elastic tables for high-volume logging, and enhanced Dataverse search",
    bestPractice: "Use elastic tables for telemetry/logging data. Enable Dataverse search for better performance. Leverage bulk operation APIs.",
    microsoftDocs: [
      "https://releaseplans.microsoft.com/en-us/?app=Microsoft+Dataverse",
      "https://learn.microsoft.com/en-us/power-platform/admin/elastic-tables",
      "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/use-elastic-tables"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > [Environment] > Settings > Features > Elastic tables",
      "Power Platform Admin Center > Environments > [Environment] > Settings > Product > Search",
      "Power Platform Admin Center > Environments > [Environment] > Resources > Dataverse capacity"
    ],
    implementationSteps: [
      "Identify high-volume data scenarios (logs, telemetry, IoT)",
      "Evaluate elastic tables vs standard tables",
      "Enable Dataverse search for better query performance",
      "Implement bulk operation patterns for data migration",
      "Configure Copilot for Dataverse if licensed",
      "Monitor Dataverse capacity and performance metrics"
    ],
    commonIssues: [
      "Elastic tables have limited relationship support",
      "Dataverse search requires additional configuration",
      "Bulk operations have different throttling limits",
      "Some features require additional licensing"
    ],
    tags: ["dataverse", "performance", "elastic tables", "search"]
  },
  {
    id: "regional-2025-1",
    text: "Are regional compliance requirements (GDPR, data localization) configured per region?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Regional Governance",
    description: "Region-specific compliance controls for global organizations",
    guidance: "Different regions require different compliance approaches - GDPR for EU, data residency for Asia-Pacific, SOX for US",
    bestPractice: "Configure environment-specific DLP policies based on regional requirements. Use geo-routing for data residency compliance.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/regions-overview",
      "https://learn.microsoft.com/en-us/power-platform/admin/geo",
      "https://learn.microsoft.com/en-us/power-platform/guidance/white-papers/global-deployment"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > Environment Details > Region",
      "Power Platform Admin Center > Data policies > Environment specific policies",
      "Power Platform Admin Center > Analytics > Geographic view"
    ],
    implementationSteps: [
      "Map organizational regions to compliance requirements",
      "Create region-specific environment naming conventions (EU-PROD, APAC-DEV, etc.)",
      "Configure environment-specific DLP policies per region",
      "Set up data loss prevention rules for cross-border data transfer",
      "Implement timezone-aware scheduled flows and apps",
      "Configure currency and locale settings per regional environments"
    ],
    commonIssues: [
      "Cross-region data synchronization violating data residency laws",
      "Timezone handling in global workflows causing business disruption",
      "Currency conversion errors in multi-region financial apps",
      "GDPR right-to-be-forgotten not implemented in Power Platform data"
    ],
    tags: ["regional", "gdpr", "data residency", "compliance"],
    required: true
  },
  {
    id: "regional-2025-2", 
    text: "Are timezone and currency configurations properly set for each regional environment?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Regional Governance",
    description: "Proper regional settings prevent business logic errors in global deployments",
    guidance: "Timezone-aware scheduling and currency handling are critical for global operations",
    bestPractice: "Use UTC for all backend processes, display local time in UI. Implement multi-currency support with exchange rate APIs.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/system-settings-dialog-box-formats-tab",
      "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/global-apps"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > Settings > Product > Behavior > Regional Settings",
      "Power Apps > Settings > Administrative Settings > System Settings > Formats",
      "Power Automate > Monitor > Run history > Time zone settings"
    ],
    implementationSteps: [
      "Document timezone requirements per regional business",
      "Configure base currency for each regional environment",
      "Set up automatic timezone detection in user apps",
      "Implement UTC storage with local time display",
      "Configure exchange rate connectors for currency conversion",
      "Test cross-timezone scheduled workflows"
    ],
    commonIssues: [
      "Scheduled flows running at wrong local times",
      "Currency calculations using wrong exchange rates",
      "Date format mismatches between regions causing data errors",
      "User confusion with UTC vs local time displays"
    ],
    tags: ["timezone", "currency", "regional settings"]
  },
  {
    id: "governance-level-2025-1",
    text: "Are tenant-level policies (security, compliance, cost) properly separated from environment-level controls?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Governance Architecture",
    description: "Clear separation between global tenant policies and environment-specific controls",
    guidance: "Tenant-level: global security baseline, compliance frameworks, cost budgets. Environment-level: access controls, data retention, resource quotas.",
    bestPractice: "Use Policy Inheritance framework - tenant policies are inherited but can be overridden at environment level where permitted.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/tenant-level-analytics",
      "https://learn.microsoft.com/en-us/power-platform/admin/environment-and-tenant-resource-capacity",
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Policies > Data policies (Tenant level)",
      "Power Platform Admin Center > Environments > [Environment] > Settings (Environment level)",
      "Power Platform Admin Center > Resources > Capacity > Add-ons (Tenant level)",
      "Power Platform Admin Center > Environments > [Environment] > Resources (Environment level)"
    ],
    implementationSteps: [
      "Define tenant-level policy categories (security, compliance, cost, data)",
      "Identify which policies can be overridden at environment level",
      "Create policy inheritance matrix showing tenant→environment flow",
      "Implement environment-specific overrides for dev/test flexibility",
      "Set up monitoring for policy compliance across all environments",
      "Document policy conflict resolution procedures"
    ],
    commonIssues: [
      "Conflicting policies between tenant and environment level",
      "Over-restrictive tenant policies blocking legitimate development",
      "Environment admins unaware of inherited tenant policies",
      "No clear escalation path for policy exceptions"
    ],
    tags: ["tenant level", "environment level", "policy inheritance"],
    required: true
  },
  {
    id: "governance-level-2025-2",
    text: "Is policy inheritance properly configured with appropriate override permissions?",
    type: "scale", 
    weight: 4,
    importance: 4,
    category: "Governance Architecture",
    description: "Hierarchical policy management with controlled override capabilities",
    guidance: "Production environments should inherit strict tenant policies. Dev/Test environments may have approved overrides for agility.",
    bestPractice: "Use Environment Groups for policy management at scale. Enable selective overrides with approval workflows.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview",
      "https://learn.microsoft.com/en-us/power-platform/admin/environment-groups"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environment groups > Managed Environment settings",
      "Power Platform Admin Center > Policies > Environment-specific policies",
      "Power Platform Admin Center > Environments > [Environment] > Edit"
    ],
    implementationSteps: [
      "Create environment classification (Production, UAT, Development, Sandbox)",
      "Define inheritance rules per environment classification",
      "Set up Environment Groups for scaled policy management",
      "Configure Managed Environment settings for production",
      "Implement approval workflows for policy override requests",
      "Create monitoring dashboard for policy compliance by environment"
    ],
    commonIssues: [
      "Production environments accidentally inheriting development policies",
      "No audit trail for policy override approvals",
      "Environment Groups not properly configured for inheritance",
      "Policy changes affecting wrong environment types"
    ],
    tags: ["policy inheritance", "environment groups", "managed environments"]
  },
  {
    id: "governance-level-2025-3",
    text: "Are environment-specific controls (access, retention, quotas) properly configured per environment type?",
    type: "scale",
    weight: 4,
    importance: 4, 
    category: "Governance Architecture",
    description: "Environment-type specific governance controls aligned with business risk",
    guidance: "Production: strict access, long retention, high quotas. Development: flexible access, short retention, limited quotas.",
    bestPractice: "Automate environment provisioning with governance templates. Use PowerShell/CLI for consistent configuration.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/powerapps-powershell",
      "https://learn.microsoft.com/en-us/power-platform/admin/environment-strategy"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > [Environment] > Settings > Users + permissions",
      "Power Platform Admin Center > Environments > [Environment] > Settings > Product > Features",
      "Power Platform Admin Center > Environments > [Environment] > Resources > Quotas"
    ],
    implementationSteps: [
      "Define environment types and their governance profiles",
      "Create environment provisioning templates with embedded governance",
      "Set up automated quota monitoring and alerting",
      "Configure environment-specific data retention policies",
      "Implement role-based access controls per environment type",
      "Create environment lifecycle automation (provision→govern→decommission)"
    ],
    commonIssues: [
      "Development environments consuming production-level resources",
      "Inconsistent access controls across similar environment types",
      "Manual environment setup leading to governance gaps",
      "No automated cleanup of temporary development environments"
    ],
    tags: ["environment controls", "access management", "resource quotas"]
  }
]

// Helper function to get tenant navigation steps
export function getTenantNavigationSteps(questionId: string): string[] {
  const question = enhancedGovernanceQuestions.find(q => q.id === questionId)
  return question?.tenantLocation || []
}

// Helper function to get implementation guide
export function getImplementationGuide(questionId: string): {
  steps: string[]
  docs: string[]
  issues: string[]
} {
  const question = enhancedGovernanceQuestions.find(q => q.id === questionId)
  return {
    steps: question?.implementationSteps || [],
    docs: question?.microsoftDocs || [],
    issues: question?.commonIssues || []
  }
}

// Security scoring helper based on Microsoft's Low/Medium/High system
export function calculateSecurityScore(responses: Record<string, any>): {
  score: 'Low' | 'Medium' | 'High'
  percentage: number
  recommendations: string[]
} {
  let totalScore = 0
  let maxScore = 0
  const recommendations: string[] = []

  enhancedGovernanceQuestions.forEach(question => {
    maxScore += question.weight
    const response = responses[question.id]
    
    if (response) {
      totalScore += (response / 5) * question.weight
    } else {
      recommendations.push(`Complete assessment for: ${question.text}`)
    }
    
    // Add specific recommendations based on score
    if (response && response < 3) {
      recommendations.push(`Improve: ${question.text} - ${question.bestPractice}`)
    }
  })

  const percentage = (totalScore / maxScore) * 100
  let score: 'Low' | 'Medium' | 'High' = 'Low'
  
  if (percentage >= 80) {
    score = 'High'
  } else if (percentage >= 60) {
    score = 'Medium'
  }

  return { score, percentage, recommendations }
}