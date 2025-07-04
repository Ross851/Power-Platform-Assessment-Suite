// Microsoft-Aligned Assessment Questions
// Based on official Microsoft Power Platform best practices and governance guidelines

import type { Question } from '@/types/assessment'

export const microsoftAlignedQuestions = {
  // Managed Environments Questions
  managedEnvironments: [
    {
      id: "managed-env-1",
      text: "Have you implemented Managed Environments for production workloads?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "Managed Environments",
      description: "Managed Environments provide enhanced security, compliance, and governance capabilities",
      guidance: "Microsoft strongly recommends Managed Environments for all production and critical workloads to ensure enterprise-grade security and compliance.",
      bestPractice: "Enable Managed Environments for Production, UAT, and any environment containing sensitive data.",
      tags: ["security", "governance", "compliance"],
      required: true
    },
    {
      id: "managed-env-2",
      text: "Are weekly data loss prevention (DLP) policies actively enforced?",
      type: "scale",
      weight: 4,
      importance: 5,
      category: "Managed Environments",
      description: "DLP policies prevent unauthorized sharing of sensitive information",
      guidance: "Configure DLP policies to block or warn when sensitive data types are detected in apps and flows.",
      bestPractice: "Create tenant-wide and environment-specific DLP policies covering all sensitive data types.",
      tags: ["security", "dlp", "data protection"]
    },
    {
      id: "managed-env-3",
      text: "Is customer-managed key (CMK) encryption enabled for sensitive environments?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Managed Environments",
      description: "CMK provides additional control over encryption keys",
      guidance: "Enable CMK for environments containing highly sensitive or regulated data.",
      tags: ["security", "encryption", "compliance"]
    },
    {
      id: "managed-env-4",
      text: "Are environment capacity limits and quotas properly configured?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Managed Environments",
      description: "Capacity management prevents resource exhaustion and controls costs",
      guidance: "Set appropriate storage, API request, and flow run quotas based on business needs.",
      bestPractice: "Review and adjust capacity limits monthly based on usage patterns.",
      tags: ["capacity", "performance", "cost management"]
    },
    {
      id: "managed-env-5",
      text: "Is extended backup and retention configured for critical environments?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Managed Environments",
      description: "Extended backup ensures business continuity and compliance",
      guidance: "Configure 28-day backup retention for production environments, with automated restore testing.",
      tags: ["backup", "disaster recovery", "compliance"]
    }
  ],

  // Center of Excellence (CoE) Implementation
  coeImplementation: [
    {
      id: "coe-1",
      text: "Have you deployed the CoE Starter Kit in your tenant?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "CoE Implementation",
      description: "The CoE Starter Kit provides automated governance and monitoring capabilities",
      guidance: "Deploy all three components: Core, Governance, and Nurture. Keep the kit updated monthly.",
      bestPractice: "Use a dedicated environment for CoE Kit with service principal authentication.",
      aiSuggestion: "Organizations with CoE Kit see 60% faster adoption and 40% fewer compliance issues.",
      tags: ["coe", "governance", "automation"],
      required: true
    },
    {
      id: "coe-2",
      text: "Is automated app and flow discovery running daily?",
      type: "scale",
      weight: 4,
      importance: 5,
      category: "CoE Implementation",
      description: "Automated discovery identifies shadow IT and ungoverned solutions",
      guidance: "Configure the inventory flows to run daily, with alerts for new unmanaged solutions.",
      bestPractice: "Set up Power BI reports for real-time visibility into your Power Platform estate.",
      tags: ["discovery", "monitoring", "shadow it"]
    },
    {
      id: "coe-3",
      text: "Are compliance and risk assessment workflows automated?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "CoE Implementation",
      description: "Automated compliance checking ensures consistent governance",
      guidance: "Use the compliance flows to automatically classify apps based on data sensitivity and business impact.",
      tags: ["compliance", "automation", "risk management"]
    },
    {
      id: "coe-4",
      text: "Is the app quarantine process implemented and enforced?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "CoE Implementation",
      description: "App quarantine prevents non-compliant apps from being used",
      guidance: "Configure automatic quarantine for apps that fail compliance checks, with a clear remediation process.",
      bestPractice: "Provide makers with 7 days to remediate before automatic suspension.",
      tags: ["governance", "compliance", "enforcement"]
    },
    {
      id: "coe-5",
      text: "Do you have a maker training and certification program?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "CoE Implementation",
      description: "Trained makers build more secure and compliant solutions",
      guidance: "Implement mandatory training for app makers covering security, accessibility, and best practices.",
      bestPractice: "Require certification before granting maker privileges in production environments.",
      tags: ["training", "adoption", "quality"]
    }
  ],

  // Security Baseline (MCSB Aligned)
  securityBaseline: [
    {
      id: "security-1",
      text: "Is Azure AD conditional access enforced for Power Platform access?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "Security Baseline",
      description: "Conditional access provides additional authentication security",
      guidance: "Require MFA, compliant devices, and location-based access for Power Platform.",
      bestPractice: "Use risk-based conditional access with continuous access evaluation.",
      tags: ["authentication", "azure ad", "mfa"],
      required: true
    },
    {
      id: "security-2",
      text: "Are tenant isolation policies configured to prevent external sharing?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "Security Baseline",
      description: "Tenant isolation prevents data leakage to external users",
      guidance: "Configure tenant isolation to block external connectors and cross-tenant connections.",
      bestPractice: "Maintain an allowlist of trusted tenants for B2B scenarios only.",
      tags: ["isolation", "data protection", "external access"]
    },
    {
      id: "security-3",
      text: "Is customer lockbox enabled for Microsoft support access?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Security Baseline",
      description: "Customer lockbox requires your approval for Microsoft support access",
      guidance: "Enable customer lockbox for all production environments containing sensitive data.",
      tags: ["access control", "compliance", "privacy"]
    },
    {
      id: "security-4",
      text: "Are IP firewall rules configured for Dataverse access?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Security Baseline",
      description: "IP restrictions limit access to known locations",
      guidance: "Configure IP firewall rules to allow access only from corporate networks and trusted locations.",
      tags: ["network security", "access control", "dataverse"]
    },
    {
      id: "security-5",
      text: "Is auditing enabled with appropriate retention periods?",
      type: "scale",
      weight: 4,
      importance: 5,
      category: "Security Baseline",
      description: "Auditing provides forensic capabilities and compliance evidence",
      guidance: "Enable auditing for all user activities with minimum 90-day retention, exported to Log Analytics.",
      bestPractice: "Configure alerts for high-risk activities like bulk data export or privilege changes.",
      tags: ["auditing", "compliance", "monitoring"]
    }
  ],

  // Compliance Monitoring
  complianceMonitoring: [
    {
      id: "compliance-1",
      text: "Are data residency requirements configured and enforced?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "Compliance Monitoring",
      description: "Data residency ensures compliance with regional regulations",
      guidance: "Configure environments in appropriate regions and prevent cross-region data movement.",
      bestPractice: "Use Azure Policy to enforce environment creation in approved regions only.",
      tags: ["data residency", "gdpr", "regional compliance"],
      required: true
    },
    {
      id: "compliance-2",
      text: "Is a data classification system implemented for Power Platform?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Compliance Monitoring",
      description: "Data classification helps apply appropriate security controls",
      guidance: "Implement mandatory data classification for all apps and flows handling sensitive data.",
      tags: ["data classification", "sensitivity labels", "governance"]
    },
    {
      id: "compliance-3",
      text: "Are privacy impact assessments conducted for citizen-developed apps?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Compliance Monitoring",
      description: "PIAs ensure privacy by design principles are followed",
      guidance: "Require PIAs for apps processing personal data, with legal/privacy team review.",
      bestPractice: "Automate PIA workflow using Power Automate with approval routing.",
      tags: ["privacy", "gdpr", "assessment"]
    },
    {
      id: "compliance-4",
      text: "Is consent management implemented for data collection?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Compliance Monitoring",
      description: "Consent management ensures lawful data processing",
      guidance: "Implement consent capture and management for all apps collecting personal data.",
      tags: ["consent", "privacy", "gdpr"]
    },
    {
      id: "compliance-5",
      text: "Are compliance reports automatically generated and reviewed?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Compliance Monitoring",
      description: "Regular compliance reporting ensures ongoing adherence",
      guidance: "Generate monthly compliance reports with executive dashboard and trend analysis.",
      tags: ["reporting", "monitoring", "governance"]
    }
  ],

  // Adoption Maturity
  adoptionMaturity: [
    {
      id: "adoption-1",
      text: "What percentage of business processes are digitized using Power Platform?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Adoption Maturity",
      description: "Higher digitization indicates platform value realization",
      guidance: "Target 40%+ process digitization for mature organizations.",
      bestPractice: "Maintain a process inventory with digitization roadmap.",
      tags: ["adoption", "digitization", "maturity"]
    },
    {
      id: "adoption-2",
      text: "Do you have a formal citizen developer program with defined career paths?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Adoption Maturity",
      description: "Formal programs drive sustainable adoption",
      guidance: "Create maker levels (Beginner, Intermediate, Advanced) with certification requirements.",
      tags: ["citizen development", "career development", "adoption"]
    },
    {
      id: "adoption-3",
      text: "Is there an innovation lab or hackathon program for Power Platform?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Adoption Maturity",
      description: "Innovation programs drive creative solution development",
      guidance: "Run quarterly hackathons with business sponsorship and implementation commitment.",
      tags: ["innovation", "engagement", "culture"]
    },
    {
      id: "adoption-4",
      text: "Are success stories and ROI metrics actively tracked and shared?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Adoption Maturity",
      description: "Success stories drive further adoption",
      guidance: "Maintain a solution showcase with ROI metrics, shared monthly with leadership.",
      bestPractice: "Calculate and publish TCO savings and productivity gains quarterly.",
      tags: ["roi", "communication", "adoption"]
    },
    {
      id: "adoption-5",
      text: "Is executive sponsorship visible and active?",
      type: "scale",
      weight: 4,
      importance: 5,
      category: "Adoption Maturity",
      description: "Executive sponsorship is critical for enterprise adoption",
      guidance: "Ensure C-level sponsor actively communicates vision and celebrates successes.",
      tags: ["leadership", "sponsorship", "culture"]
    }
  ],

  // Advanced Capabilities
  advancedCapabilities: [
    {
      id: "advanced-1",
      text: "Are AI Builder capabilities being utilized in production?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Advanced Capabilities",
      description: "AI Builder provides pre-built and custom AI models",
      guidance: "Start with pre-built models (receipt processing, business cards) before custom models.",
      bestPractice: "Implement AI governance including bias testing and model monitoring.",
      tags: ["ai", "innovation", "automation"]
    },
    {
      id: "advanced-2",
      text: "Is process mining implemented to identify automation opportunities?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Advanced Capabilities",
      description: "Process mining reveals inefficiencies and automation candidates",
      guidance: "Use process mining on high-volume, repetitive processes first.",
      tags: ["process mining", "optimization", "automation"]
    },
    {
      id: "advanced-3",
      text: "Are custom connectors developed following security best practices?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Advanced Capabilities",
      description: "Custom connectors extend platform capabilities securely",
      guidance: "Require security review and certification for all custom connectors.",
      bestPractice: "Use Azure API Management for enterprise custom connectors.",
      tags: ["connectors", "integration", "security"]
    },
    {
      id: "advanced-4",
      text: "Is the platform integrated with enterprise DevOps pipelines?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Advanced Capabilities",
      description: "DevOps integration enables professional development practices",
      guidance: "Implement ALM with automated testing, deployment, and rollback capabilities.",
      tags: ["devops", "alm", "automation"]
    },
    {
      id: "advanced-5",
      text: "Are PCF controls used for complex UI requirements?",
      type: "scale",
      weight: 2,
      importance: 3,
      category: "Advanced Capabilities",
      description: "PCF controls provide advanced customization capabilities",
      guidance: "Use PCF controls only when out-of-box capabilities are insufficient.",
      tags: ["pcf", "customization", "development"]
    }
  ],

  // Data Protection
  dataProtection: [
    {
      id: "data-1",
      text: "Is row-level security implemented for sensitive data?",
      type: "scale",
      weight: 5,
      importance: 5,
      category: "Data Protection",
      description: "RLS ensures users only see data they're authorized to access",
      guidance: "Implement RLS using security roles, teams, or business units as appropriate.",
      bestPractice: "Test RLS thoroughly with different user personas before production deployment.",
      tags: ["security", "access control", "dataverse"],
      required: true
    },
    {
      id: "data-2",
      text: "Are sensitive fields encrypted at the column level?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Data Protection",
      description: "Column-level encryption provides additional protection for sensitive data",
      guidance: "Encrypt PII, financial data, and health information at the column level.",
      tags: ["encryption", "security", "pii"]
    },
    {
      id: "data-3",
      text: "Is data masking configured for non-production environments?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Data Protection",
      description: "Data masking prevents exposure of sensitive data in test environments",
      guidance: "Implement dynamic data masking for all PII in development and test environments.",
      tags: ["data masking", "test data", "privacy"]
    },
    {
      id: "data-4",
      text: "Are data retention policies configured and enforced?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Data Protection",
      description: "Retention policies ensure compliance with data minimization principles",
      guidance: "Configure retention policies based on legal requirements and business needs.",
      bestPractice: "Automate data purging with audit trail for compliance evidence.",
      tags: ["retention", "compliance", "gdpr"]
    },
    {
      id: "data-5",
      text: "Is privileged access management (PAM) implemented?",
      type: "scale",
      weight: 4,
      importance: 5,
      category: "Data Protection",
      description: "PAM provides just-in-time access for administrative tasks",
      guidance: "Use Azure PIM for Power Platform administrative roles with approval workflow.",
      tags: ["pam", "privileged access", "security"]
    }
  ],

  // Operational Excellence
  operationalExcellence: [
    {
      id: "ops-1",
      text: "Are automated health checks and monitoring configured?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Operational Excellence",
      description: "Proactive monitoring prevents issues and ensures availability",
      guidance: "Monitor API limits, storage capacity, flow failures, and app performance.",
      bestPractice: "Integrate with Azure Monitor and create automated incident tickets.",
      tags: ["monitoring", "automation", "operations"]
    },
    {
      id: "ops-2",
      text: "Is capacity planning performed regularly with predictive analytics?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Operational Excellence",
      description: "Capacity planning prevents performance issues and outages",
      guidance: "Review capacity monthly and project 6-month requirements based on growth trends.",
      tags: ["capacity planning", "performance", "analytics"]
    },
    {
      id: "ops-3",
      text: "Are SLAs defined and monitored for critical applications?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Operational Excellence",
      description: "SLAs ensure business-critical apps meet availability requirements",
      guidance: "Define SLAs for Tier 1 apps with automated monitoring and alerting.",
      tags: ["sla", "availability", "monitoring"]
    },
    {
      id: "ops-4",
      text: "Is a disaster recovery plan tested quarterly?",
      type: "scale",
      weight: 4,
      importance: 5,
      category: "Operational Excellence",
      description: "DR testing ensures business continuity capabilities",
      guidance: "Test full environment restoration including data, apps, and configurations.",
      bestPractice: "Document RTO/RPO targets and validate during DR tests.",
      tags: ["disaster recovery", "business continuity", "testing"]
    },
    {
      id: "ops-5",
      text: "Are performance baselines established with anomaly detection?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Operational Excellence",
      description: "Performance baselines help identify degradation early",
      guidance: "Establish baselines for response time, throughput, and resource utilization.",
      tags: ["performance", "monitoring", "baselines"]
    }
  ]
}

// Helper function to get all Microsoft-aligned questions
export function getAllMicrosoftAlignedQuestions(): Question[] {
  return [
    ...microsoftAlignedQuestions.managedEnvironments,
    ...microsoftAlignedQuestions.coeImplementation,
    ...microsoftAlignedQuestions.securityBaseline,
    ...microsoftAlignedQuestions.complianceMonitoring,
    ...microsoftAlignedQuestions.adoptionMaturity,
    ...microsoftAlignedQuestions.advancedCapabilities,
    ...microsoftAlignedQuestions.dataProtection,
    ...microsoftAlignedQuestions.operationalExcellence
  ]
}

// Category metadata for Microsoft-aligned assessments
export const microsoftAlignedCategories = [
  {
    id: 'managed-environments',
    name: 'Managed Environments',
    description: 'Assess the implementation and configuration of Managed Environments',
    icon: 'HiShieldCheck',
    weight: 20,
    questions: microsoftAlignedQuestions.managedEnvironments
  },
  {
    id: 'coe-implementation',
    name: 'Center of Excellence',
    description: 'Evaluate CoE maturity and effectiveness',
    icon: 'HiAcademicCap',
    weight: 25,
    questions: microsoftAlignedQuestions.coeImplementation
  },
  {
    id: 'security-baseline',
    name: 'Security Baseline',
    description: 'Measure alignment with Microsoft Cloud Security Benchmark',
    icon: 'HiLockClosed',
    weight: 30,
    questions: microsoftAlignedQuestions.securityBaseline
  },
  {
    id: 'compliance-monitoring',
    name: 'Compliance & Privacy',
    description: 'Assess compliance monitoring and privacy controls',
    icon: 'HiClipboardCheck',
    weight: 15,
    questions: microsoftAlignedQuestions.complianceMonitoring
  },
  {
    id: 'adoption-maturity',
    name: 'Adoption Maturity',
    description: 'Evaluate organizational adoption and maturity',
    icon: 'HiUserGroup',
    weight: 10,
    questions: microsoftAlignedQuestions.adoptionMaturity
  },
  {
    id: 'advanced-capabilities',
    name: 'Advanced Capabilities',
    description: 'Assess utilization of advanced platform features',
    icon: 'HiSparkles',
    weight: 5,
    questions: microsoftAlignedQuestions.advancedCapabilities
  },
  {
    id: 'data-protection',
    name: 'Data Protection',
    description: 'Evaluate data protection and privacy measures',
    icon: 'HiDatabase',
    weight: 20,
    questions: microsoftAlignedQuestions.dataProtection
  },
  {
    id: 'operational-excellence',
    name: 'Operational Excellence',
    description: 'Assess operational maturity and practices',
    icon: 'HiCog',
    weight: 15,
    questions: microsoftAlignedQuestions.operationalExcellence
  }
]