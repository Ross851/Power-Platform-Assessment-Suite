import type { AssessmentStandard, Question } from "../../types"

// QUESTIONS DERIVED FROM GOVERNANCE_IMPLEMENTATION_WORKBOOK.MD (JAN 2026)
// Validated against Microsoft 2025/2026 Guidance & Azure MCP Best Practices

export const workbookTenantQuestions: Question[] = [
  {
    id: "gov-workbook-t1",
    text: "Is 'Tenant Isolation' (Cross-Tenant Restrictions) configured to block inbound/outbound connection to unauthorized tenants?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "Security",
    guidance: "As per the Implementation Workbook Part 1.1: Tenant Isolation is a critical security setting to prevent data exfiltration to external tenants.",
    references: [
      {
        title: "Cross-tenant inbound/outbound restrictions",
        url: "https://learn.microsoft.com/en-us/power-platform/admin/cross-tenant-restrictions",
      },
    ],
  },
  {
    id: "gov-workbook-t2",
    text: "Is the weekly 'Admin Digest' email enabled for global admins?",
    type: "boolean",
    weight: 2,
    importance: 3,
    category: "Monitoring",
    guidance: "Governance Top Tips: Ensure the 'Weekly Digest' setting is enabled for zero-effort passive visibility.",
  },
]

export const workbookDlpQuestions: Question[] = [
  {
    id: "gov-workbook-dlp1",
    text: "Is the Default DLP Policy configured to 'Block' new connectors by default?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "DLP Strategy",
    guidance: "Recommendation from Justification & Citations: Change the default DLP policy setting so that *new* connectors are Blocked rather than allowed (Non-Business).",
    references: [
      {
        title: "DLP policies you should be considering on Day 1",
        url: "https://learn.microsoft.com/en-us/microsoft-365/community/power-platform-dlp-policies-you-should-be-considering-on-day-1",
      },
    ],
  },
]

export const workbookEnvQuestions: Question[] = [
  {
    id: "gov-workbook-env1",
    text: "Has the Default Environment been renamed to 'Personal Productivity' (or similar descriptive name)?",
    type: "boolean",
    weight: 3,
    importance: 4,
    category: "Environment Strategy",
    guidance: "Governance Top Tips: Rename the Default Environment to clearly signal its intent for personal productivity only. Prevents confusion with Production.",
  },
  {
    id: "gov-workbook-env2",
    text: "Is 'Managed Environments' DISABLED on the Default Environment (unless specifically licensed)?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "Licensing Risk",
    guidance: "CRITICAL: Enabling Managed Environments on Default requires premium licenses for EVERY user running any app. Keep Default as 'Standard' to avoid unexpected costs.",
  },
  {
    id: "gov-workbook-env3",
    text: "Is 'Default Environment Routing' enabled to direct makers to personal developer environments?",
    type: "boolean",
    weight: 4,
    importance: 5,
    category: "Environment Strategy",
    guidance: "Strategy Part 2: Turn on Default Environment Routing to prevent clutter in the Default Environment and give makers safe sandboxes.",
    references: [
      {
        title: "Default environment routing",
        url: "https://learn.microsoft.com/en-us/power-platform/admin/default-environment-routing",
      },
    ],
  },
]

// New Standard Definition to merge into constants.ts
export const workbookAssessmentStandard: AssessmentStandard = {
  slug: "implementation-workbook-compliance",
  name: "Governance Workbook Compliance (2026)",
  weight: 20,
  description: "Assessment against the specific Governance Implementation Workbook checklists, including Tenant Isolation, Block-by-Default DLP, and Environment Routing.",
  questions: [
    ...workbookTenantQuestions,
    ...workbookDlpQuestions,
    ...workbookEnvQuestions
  ],
}
