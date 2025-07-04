// Microsoft Power Platform 2025 Assessment Framework - Complete with Guidance
// Based on latest Microsoft documentation and best practices

import type { Question } from '@/types/assessment'

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
  recommendations?: string[]
}

// Complete Security Questions with Full Guidance
export const completeSecurityQuestions: EnhancedQuestion[] = [
  {
    id: "sec-2025-1",
    text: "Is data exfiltration prevention configured for Dataverse?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Security",
    description: "Control which applications can access Dataverse environments",
    guidance: "2025 feature: Prevent unauthorized apps from accessing sensitive data. Configure allowlists per environment to control which applications can read Dataverse data.",
    bestPractice: "Create allowlist of approved applications for each environment. Review quarterly and remove unused applications. Monitor access logs for anomalies.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/prevent-data-loss",
      "https://learn.microsoft.com/en-us/power-platform/admin/security/data-exfiltration-prevention",
      "https://learn.microsoft.com/en-us/power-platform/admin/security/dataverse-security"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > [Environment] > Settings > Security",
      "Power Platform Admin Center > Policies > Data policies > Connector endpoints",
      "Power Platform Admin Center > Analytics > Security > Data access reports"
    ],
    implementationSteps: [
      "Navigate to Power Platform Admin Center and select your environment",
      "Go to Settings > Security > Data exfiltration prevention",
      "Enable 'Restrict data access to approved apps only'",
      "Add approved application IDs to the allowlist",
      "Configure monitoring alerts for unauthorized access attempts",
      "Test with a non-approved app to verify blocking works",
      "Document approved apps and review process"
    ],
    commonIssues: [
      "Power BI may need explicit allowlisting for embedded reports",
      "Custom connectors require separate configuration",
      "Legacy apps may not have proper app IDs",
      "Changes take up to 30 minutes to propagate"
    ],
    tags: ["data protection", "dataverse", "exfiltration"],
    required: true
  },
  {
    id: "sec-2025-2",
    text: "Is Microsoft Entra ID Continuous Access Evaluation (CAE) enabled?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Security",
    description: "Real-time enforcement of authentication policies",
    guidance: "CAE ensures immediate revocation of compromised credentials. When a user's session is terminated or risk level changes, access is immediately blocked without waiting for token expiration.",
    bestPractice: "Enable CAE with conditional access policies for all Power Platform access. Configure with risk-based policies and MFA requirements.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-continuous-access-evaluation",
      "https://learn.microsoft.com/en-us/power-platform/admin/security/authenticate-services",
      "https://learn.microsoft.com/en-us/power-platform/admin/security/conditional-access"
    ],
    tenantLocation: [
      "Microsoft Entra admin center > Security > Conditional Access > Policies",
      "Power Platform Admin Center > Settings > Authentication",
      "Microsoft 365 admin center > Settings > Security & privacy"
    ],
    implementationSteps: [
      "Enable CAE in Microsoft Entra ID tenant settings",
      "Create conditional access policy for Power Platform",
      "Add Power Platform apps to policy scope",
      "Enable 'Require reauthentication' for high-risk events",
      "Configure session controls with CAE enforcement",
      "Test with simulated risk events",
      "Monitor sign-in logs for CAE events"
    ],
    commonIssues: [
      "Not all Power Platform services support CAE yet",
      "Token lifetime conflicts with CAE policies",
      "Guest users may experience frequent reauthentication",
      "Legacy authentication protocols don't support CAE"
    ],
    tags: ["authentication", "azure ad", "continuous evaluation"]
  },
  {
    id: "sec-2025-3",
    text: "Are customer-managed keys (CMK) configured for sensitive data?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Security",
    description: "CMK now available for Power Automate flows and Dataverse",
    guidance: "2025 update: CMK support extended to Power Automate. Use your own encryption keys stored in Azure Key Vault for complete control over data encryption.",
    bestPractice: "Use CMK for all environments containing regulated data (PII, PHI, financial). Implement key rotation policy and monitor key usage.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/customer-managed-key",
      "https://learn.microsoft.com/en-us/power-platform/admin/cmk-power-automate",
      "https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > [Environment] > Settings > Encryption",
      "Azure Portal > Key Vaults > [Your Key Vault] > Keys",
      "Power Platform Admin Center > Settings > Security > Encryption"
    ],
    implementationSteps: [
      "Create Azure Key Vault in same region as Power Platform environment",
      "Generate RSA 2048-bit key for encryption",
      "Grant Power Platform service principal access to key vault",
      "Enable CMK in environment settings",
      "Select your key from Azure Key Vault",
      "Wait for encryption process to complete (can take hours)",
      "Verify CMK status in environment details"
    ],
    commonIssues: [
      "Key vault must be in same region as environment",
      "Enabling CMK is irreversible without data export/import",
      "Performance impact during initial encryption",
      "Key rotation requires planning to avoid downtime"
    ],
    tags: ["encryption", "cmk", "data protection"]
  },
  {
    id: "sec-2025-4",
    text: "Is clickjacking protection enabled for all Power Pages?",
    type: "boolean",
    weight: 4,
    importance: 5,
    category: "Security",
    description: "Prevent iframe usage on sign-in pages",
    guidance: "Critical security feature to prevent credential theft through malicious iframes. Automatically enabled for new sites but must be manually enabled for existing ones.",
    bestPractice: "Enable X-Frame-Options and Content Security Policy headers. Test all pages to ensure legitimate iframe usage isn't broken.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-pages/security/clickjacking",
      "https://learn.microsoft.com/en-us/power-pages/configure/configure-security",
      "https://learn.microsoft.com/en-us/power-pages/security/authentication"
    ],
    tenantLocation: [
      "Power Pages design studio > Settings > Security > Headers",
      "Power Pages management app > Site Settings > Security",
      "Portal Management app > Web Files > Custom Headers"
    ],
    implementationSteps: [
      "Open Power Pages design studio",
      "Navigate to Settings > Security",
      "Enable 'Prevent clickjacking' toggle",
      "Add Content Security Policy: frame-ancestors 'none'",
      "Configure X-Frame-Options: DENY",
      "Test sign-in page cannot be embedded in iframe",
      "Verify legitimate iframe usage still works"
    ],
    commonIssues: [
      "May break Power BI embedded reports if not configured properly",
      "Custom authentication providers need separate configuration",
      "CDN-hosted content may conflict with CSP",
      "Testing tools may be blocked by strict policies"
    ],
    tags: ["power pages", "security", "authentication"]
  },
  {
    id: "sec-2025-5",
    text: "Are sensitivity labels configured and enforced?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Security",
    description: "Microsoft Purview Information Protection integration",
    guidance: "Labels cascade from data sources to Power Platform. When SharePoint or OneDrive files have sensitivity labels, those labels are inherited by Power Apps and Power Automate.",
    bestPractice: "Define 3-5 classification levels and enforce mandatory labeling. Train users on proper classification and monitor compliance.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/sensitivity-labels",
      "https://learn.microsoft.com/en-us/microsoft-365/compliance/sensitivity-labels",
      "https://learn.microsoft.com/en-us/power-platform/admin/security/information-protection"
    ],
    tenantLocation: [
      "Microsoft Purview compliance portal > Information protection > Labels",
      "Power Platform Admin Center > Settings > Security > Information protection",
      "Microsoft 365 admin center > Settings > Services > Microsoft Purview"
    ],
    implementationSteps: [
      "Create sensitivity labels in Microsoft Purview",
      "Define label policies and auto-labeling rules",
      "Enable labels for Power Platform in admin center",
      "Configure default labels for environments",
      "Train users on label selection",
      "Monitor label usage in compliance reports",
      "Audit mislabeled content quarterly"
    ],
    commonIssues: [
      "Labels may not appear immediately after creation",
      "Auto-labeling can cause performance issues",
      "Guest users may not see labels correctly",
      "Custom connectors don't inherit labels automatically"
    ],
    tags: ["classification", "sensitivity", "purview"]
  }
]

// Complete Reliability Questions with Full Guidance
export const completeReliabilityQuestions: EnhancedQuestion[] = [
  {
    id: "rel-2025-1",
    text: "Are automated health checks configured for critical apps?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Reliability",
    description: "Monitor app performance and availability proactively",
    guidance: "Use Monitor feature to track app open success rate and load times. Set up automated alerts when performance degrades below thresholds.",
    bestPractice: "Configure synthetic monitors to test critical user journeys every 5 minutes. Alert on >3 second load times or <99% success rate.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-apps/maker/monitor-overview",
      "https://learn.microsoft.com/en-us/power-platform/admin/analytics-powerapps",
      "https://learn.microsoft.com/en-us/azure/azure-monitor/app/availability-overview"
    ],
    tenantLocation: [
      "Power Apps > Apps > [Your App] > Monitor",
      "Power Platform Admin Center > Analytics > Power Apps > App metrics",
      "Azure Portal > Application Insights > Availability tests"
    ],
    implementationSteps: [
      "Enable Application Insights for Power Apps environment",
      "Configure availability tests for critical apps",
      "Set up performance baselines from historical data",
      "Create alert rules for performance degradation",
      "Configure action groups for notifications",
      "Test alert flow with simulated failures",
      "Document escalation procedures"
    ],
    commonIssues: [
      "Monitor sessions expire after 24 hours",
      "Performance data has 5-minute aggregation delay",
      "Custom connectors need separate monitoring",
      "Mobile app performance differs from web"
    ],
    tags: ["monitoring", "health", "performance"]
  },
  {
    id: "rel-2025-2",
    text: "Is environment backup and recovery tested quarterly?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Reliability",
    description: "Ensure business continuity capabilities",
    guidance: "Regular testing validates recovery procedures and ensures team readiness. Document lessons learned and update runbooks after each test.",
    bestPractice: "Maintain 3 backup types: automated system backups, manual on-demand backups before changes, and cross-region copies for DR.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/backup-restore-environments",
      "https://learn.microsoft.com/en-us/power-platform/admin/copy-environment",
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/disaster-recovery"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > [Environment] > Backups",
      "Power Platform Admin Center > Environments > [Environment] > Settings > Backup & restore",
      "Power Platform Admin Center > Resources > Capacity > Backup storage"
    ],
    implementationSteps: [
      "Document current RTO/RPO requirements",
      "Schedule quarterly DR tests in calendar",
      "Create backup before test",
      "Restore to test environment",
      "Validate data integrity and app functionality",
      "Measure actual recovery time",
      "Update runbooks with findings",
      "Train new team members on procedures"
    ],
    commonIssues: [
      "Backup retention limited to 28 days",
      "Cross-region restore requires support ticket",
      "Some components not included in backups (e.g., audit logs)",
      "Restore can take several hours for large environments"
    ],
    tags: ["backup", "disaster recovery", "business continuity"],
    required: true
  },
  {
    id: "rel-2025-3",
    text: "Are flow retry policies configured for transient failures?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Reliability",
    description: "Handle temporary service interruptions gracefully",
    guidance: "Configure exponential backoff retry policies for all external service calls. Use Circuit Breaker pattern for frequently failing services.",
    bestPractice: "Default: 4 retries with exponential backoff (5s, 15s, 60s, 300s). Configure dead letter queues for permanent failures.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-automate/retry-policy",
      "https://learn.microsoft.com/en-us/power-automate/error-handling",
      "https://learn.microsoft.com/en-us/azure/architecture/patterns/retry"
    ],
    tenantLocation: [
      "Power Automate > My flows > [Flow] > Edit > Settings > Retry policy",
      "Power Automate > Action settings > Settings > Retry policy",
      "Power Platform Admin Center > Analytics > Power Automate > Run failures"
    ],
    implementationSteps: [
      "Identify all external service connections",
      "Configure retry policy on each action",
      "Set retry count based on service SLA",
      "Configure exponential backoff delays",
      "Add error handling scopes",
      "Implement notification for permanent failures",
      "Monitor retry statistics in analytics"
    ],
    commonIssues: [
      "Default retry may be too aggressive for rate-limited APIs",
      "Timeout settings conflict with retry duration",
      "Nested retries can cause exponential delays",
      "Some triggers don't support retry policies"
    ],
    tags: ["resilience", "error handling", "automation"]
  },
  {
    id: "rel-2025-4",
    text: "Is capacity monitoring automated with alerts?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Reliability",
    description: "Prevent outages due to resource exhaustion",
    guidance: "Monitor Dataverse storage, file capacity, and API limits. Alert at 80% threshold to allow time for capacity planning.",
    bestPractice: "Implement tiered alerts: 70% (warning), 85% (critical), 95% (emergency). Automate capacity reports to leadership.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage",
      "https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations",
      "https://learn.microsoft.com/en-us/power-platform/admin/monitor-email-alerts"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Resources > Capacity",
      "Power Platform Admin Center > Analytics > Dataverse > Storage",
      "Power Platform Admin Center > Settings > Email alerts"
    ],
    implementationSteps: [
      "Review current capacity allocation",
      "Identify growth trends from last 6 months",
      "Configure email alerts for capacity thresholds",
      "Create Power Automate flow for notifications",
      "Build Power BI dashboard for trends",
      "Schedule monthly capacity reviews",
      "Document capacity planning process"
    ],
    commonIssues: [
      "File storage counted separately from database",
      "Deleted records still consume storage for 30 days",
      "API limits reset daily but not at midnight",
      "Capacity add-ons require license assignment"
    ],
    tags: ["capacity", "monitoring", "resource management"]
  },
  {
    id: "rel-2025-5",
    text: "Is multi-region deployment configured for critical apps?",
    type: "scale",
    weight: 3,
    importance: 3,
    category: "Reliability",
    description: "Ensure availability during regional outages",
    guidance: "Deploy critical apps to multiple regions with Traffic Manager routing. Use read replicas for better performance.",
    bestPractice: "Primary/secondary model with automated failover. Test failover monthly and maintain runbooks for manual intervention.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/regions-overview",
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/global-deployment",
      "https://learn.microsoft.com/en-us/azure/traffic-manager/traffic-manager-overview"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Environments > + New > Select region",
      "Azure Portal > Traffic Manager profiles > [Your profile]",
      "Power Platform Admin Center > Environments > Copy environment"
    ],
    implementationSteps: [
      "Identify critical apps requiring HA",
      "Select secondary region based on compliance",
      "Create environment in secondary region",
      "Copy production environment to secondary",
      "Configure Azure Traffic Manager",
      "Set up data synchronization process",
      "Test failover procedures",
      "Document regional dependencies"
    ],
    commonIssues: [
      "Data residency laws may limit region selection",
      "Cross-region latency affects user experience",
      "Not all features available in all regions",
      "Additional licensing costs for multiple environments"
    ],
    tags: ["high availability", "multi-region", "disaster recovery"]
  }
]

// Complete Performance Efficiency Questions
export const completePerformanceQuestions: EnhancedQuestion[] = [
  {
    id: "perf-2025-1",
    text: "Are large datasets using pagination and lazy loading?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Performance",
    description: "Optimize data retrieval for better performance",
    guidance: "Use delegation-aware queries and implement virtual scrolling for large galleries. Limit initial data load to improve app start time.",
    bestPractice: "Load maximum 100 records initially, implement search-driven data access, use indexed columns for filtering.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/delegation-overview",
      "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/performance-tips",
      "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/optimize-performance"
    ],
    tenantLocation: [
      "Power Apps Studio > File > Settings > Advanced settings > Data row limit",
      "Power Apps Studio > View > Collections > Monitor size",
      "Dataverse > Tables > [Table] > Keys and Indexes"
    ],
    implementationSteps: [
      "Analyze current data access patterns",
      "Identify non-delegable queries in app checker",
      "Create Dataverse indexes on filter columns",
      "Implement incremental data loading",
      "Replace galleries with virtual scrolling where needed",
      "Add explicit loading indicators",
      "Test with production-size datasets",
      "Monitor query performance in Application Insights"
    ],
    commonIssues: [
      "Delegation warnings ignored leading to incomplete data",
      "Complex filters becoming non-delegable",
      "Gallery rendering slow with images",
      "Concurrent user queries causing throttling"
    ],
    tags: ["performance", "data access", "optimization"],
    required: true
  },
  {
    id: "perf-2025-2",
    text: "Is Power Automate process mining identifying bottlenecks?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Performance",
    description: "Use AI to discover process inefficiencies",
    guidance: "Process mining analyzes event logs to visualize actual process flows and identify automation opportunities.",
    bestPractice: "Run process mining quarterly, focus on high-volume processes, implement suggested optimizations in phases.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-automate/process-mining-overview",
      "https://learn.microsoft.com/en-us/power-automate/process-mining-data-requirements",
      "https://learn.microsoft.com/en-us/power-automate/process-mining-best-practices"
    ],
    tenantLocation: [
      "Power Automate > Process mining > + New process",
      "Power Automate > Process mining > [Process] > Analytics",
      "Power Platform Admin Center > Analytics > Process insights"
    ],
    implementationSteps: [
      "Identify candidate processes for mining",
      "Export event logs in required format",
      "Create process mining project",
      "Upload and validate event data",
      "Review discovered process map",
      "Identify bottlenecks and variations",
      "Prioritize optimization opportunities",
      "Implement and measure improvements"
    ],
    commonIssues: [
      "Insufficient event log data for accurate analysis",
      "Process variations making mining complex",
      "Privacy concerns with detailed logging",
      "Integration with legacy systems for log extraction"
    ],
    tags: ["process mining", "optimization", "analytics"]
  },
  {
    id: "perf-2025-3",
    text: "Are concurrent operations optimized with batching?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Performance",
    description: "Reduce API calls and improve throughput",
    guidance: "Use batch operations for bulk creates/updates. Implement queue-based processing for high-volume scenarios.",
    bestPractice: "Batch size of 100-250 operations, implement retry logic, use changesets for transactional consistency.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/execute-batch-operations",
      "https://learn.microsoft.com/en-us/power-automate/process-large-datasets",
      "https://learn.microsoft.com/en-us/power-platform/admin/api-request-limits-allocations"
    ],
    tenantLocation: [
      "Power Automate > My flows > [Flow] > Settings > Concurrency control",
      "Dataverse > Settings > Administration > System jobs",
      "Power Platform Admin Center > Analytics > API usage"
    ],
    implementationSteps: [
      "Identify high-frequency operations",
      "Implement batch request wrapper",
      "Configure optimal batch sizes",
      "Add concurrency controls to flows",
      "Implement exponential backoff for retries",
      "Monitor API usage and throttling",
      "Optimize based on performance metrics",
      "Document batch processing patterns"
    ],
    commonIssues: [
      "Batch operations timing out with large datasets",
      "Partial batch failures requiring complex rollback",
      "API limits hit during peak processing",
      "Memory issues with large batch sizes"
    ],
    tags: ["batch processing", "api optimization", "concurrency"]
  },
  {
    id: "perf-2025-4",
    text: "Is caching implemented for reference data?",
    type: "scale",
    weight: 3,
    importance: 3,
    category: "Performance",
    description: "Reduce repeated data fetches",
    guidance: "Cache static and slowly-changing data in collections or environment variables. Implement cache invalidation strategy.",
    bestPractice: "Cache reference data on app start, refresh every 24 hours or on-demand, monitor cache hit rates.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/performance-tips#cache-lookup-data",
      "https://learn.microsoft.com/en-us/power-platform/guidance/patterns/caching-pattern",
      "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/working-with-variables"
    ],
    tenantLocation: [
      "Power Apps Studio > View > Collections",
      "Power Apps Studio > App > OnStart formula",
      "Power Apps Monitor > Network tab > Repeated calls"
    ],
    implementationSteps: [
      "Identify frequently accessed reference data",
      "Create caching collections on app start",
      "Implement cache refresh mechanism",
      "Add cache expiration logic",
      "Monitor cache effectiveness",
      "Handle offline scenarios",
      "Document cached data sources",
      "Test cache invalidation flows"
    ],
    commonIssues: [
      "Stale cache data causing business errors",
      "App start time increased due to cache loading",
      "Memory pressure from large caches",
      "Offline cache synchronization conflicts"
    ],
    tags: ["caching", "performance", "data optimization"]
  },
  {
    id: "perf-2025-5",
    text: "Are performance baselines established and monitored?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Performance",
    description: "Track performance trends over time",
    guidance: "Establish baselines for app load time, API response time, and flow duration. Alert on degradation from baseline.",
    bestPractice: "Weekly performance reviews, monthly trend analysis, automated alerting on 20% degradation from baseline.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/analytics-powerapps",
      "https://learn.microsoft.com/en-us/power-apps/maker/monitor-overview",
      "https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/metrics-baseline"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Analytics > Performance",
      "Application Insights > Performance > Dependencies",
      "Power Apps Monitor > Performance profiler"
    ],
    implementationSteps: [
      "Define key performance indicators",
      "Collect baseline measurements for 2 weeks",
      "Calculate statistical baselines (p50, p95, p99)",
      "Configure performance alerts",
      "Create performance dashboard",
      "Schedule weekly performance reviews",
      "Document performance SLAs",
      "Implement continuous improvement process"
    ],
    commonIssues: [
      "Baselines skewed by one-time events",
      "Seasonal variations not accounted for",
      "Alert fatigue from too sensitive thresholds",
      "Missing correlation with infrastructure changes"
    ],
    tags: ["monitoring", "baselines", "performance management"]
  }
]

// Complete Operational Excellence Questions
export const completeOperationalQuestions: EnhancedQuestion[] = [
  {
    id: "ops-2025-1",
    text: "Is ALM with automated CI/CD pipelines implemented?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Operations",
    description: "Automate solution deployment across environments",
    guidance: "Use Power Platform Build Tools with Azure DevOps or GitHub Actions. Implement automated testing and approval gates.",
    bestPractice: "Automated builds on commit, automated tests in build pipeline, manual approval for production, automated rollback capability.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools",
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/application-lifecycle-management",
      "https://learn.microsoft.com/en-us/power-platform/alm/tutorials/github-actions"
    ],
    tenantLocation: [
      "Azure DevOps > Pipelines > Library > Service connections",
      "GitHub > Settings > Secrets and variables > Actions",
      "Power Platform Admin Center > Environments > Application users"
    ],
    implementationSteps: [
      "Install Power Platform Build Tools",
      "Create service principal for authentication",
      "Configure service connections",
      "Create build pipeline for solution export",
      "Create release pipeline with stages",
      "Add automated solution checker",
      "Configure approval gates",
      "Implement automated rollback",
      "Test end-to-end deployment"
    ],
    commonIssues: [
      "Service principal permissions insufficient",
      "Solution dependencies not handled correctly",
      "Environment variables not updated properly",
      "Connection references breaking between environments"
    ],
    tags: ["alm", "devops", "automation"],
    required: true
  },
  {
    id: "ops-2025-2",
    text: "Are runbooks maintained for incident response?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Operations",
    description: "Ensure consistent and quick incident resolution",
    guidance: "Document step-by-step procedures for common incidents. Include escalation paths and rollback procedures.",
    bestPractice: "Runbook for each critical process, quarterly reviews and updates, practice scenarios monthly, version control runbooks.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/incident-management",
      "https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-overview",
      "https://learn.microsoft.com/en-us/power-platform/admin/support-overview"
    ],
    tenantLocation: [
      "SharePoint/Teams > IT Documentation > Runbooks",
      "Azure DevOps > Wiki > Operations runbooks",
      "Power Platform Admin Center > Help + support"
    ],
    implementationSteps: [
      "Identify top 10 incident types from history",
      "Create runbook template",
      "Document step-by-step resolution procedures",
      "Include screenshots and commands",
      "Add decision trees for troubleshooting",
      "Define escalation criteria",
      "Store in version-controlled wiki",
      "Schedule quarterly reviews",
      "Conduct monthly drills"
    ],
    commonIssues: [
      "Runbooks become outdated quickly",
      "Too generic to be useful in actual incidents",
      "Not accessible during outages",
      "Missing critical troubleshooting steps"
    ],
    tags: ["incident response", "documentation", "operations"]
  },
  {
    id: "ops-2025-3",
    text: "Is solution checker integrated in deployment pipeline?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Operations",
    description: "Catch issues before they reach production",
    guidance: "Run solution checker as quality gate in CI/CD. Fail builds on high-severity issues, warn on medium issues.",
    bestPractice: "Block deployment on critical issues, require justification for medium issue overrides, track issue trends over time.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/alm/checker-api/overview",
      "https://learn.microsoft.com/en-us/power-platform/alm/use-powershell-solution-checker",
      "https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tool-tasks#solution-checker"
    ],
    tenantLocation: [
      "Power Apps > Solutions > [Solution] > Solution checker",
      "Azure DevOps > Pipelines > [Pipeline] > Tasks > Solution checker",
      "Power Platform Admin Center > Solutions > History > Checker results"
    ],
    implementationSteps: [
      "Add solution checker task to build pipeline",
      "Configure severity thresholds",
      "Set pipeline to fail on critical issues",
      "Create custom ruleset if needed",
      "Add checker results to build artifacts",
      "Configure email notifications for failures",
      "Track checker scores over time",
      "Create exemption process for false positives"
    ],
    commonIssues: [
      "False positives blocking valid deployments",
      "Custom components not properly analyzed",
      "Checker timeout on large solutions",
      "Missing context for automated fixes"
    ],
    tags: ["quality assurance", "automation", "devops"]
  },
  {
    id: "ops-2025-4",
    text: "Are maker governance policies enforced?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Operations",
    description: "Control who can create apps and where",
    guidance: "Use environment strategies to separate citizen development from IT-managed apps. Implement maker onboarding process.",
    bestPractice: "Default environment for experimentation only, production apps require IT review, mandatory training for makers.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/maker-governance",
      "https://learn.microsoft.com/en-us/power-platform/admin/governance-considerations",
      "https://learn.microsoft.com/en-us/power-platform/guidance/coe/example-governance-model"
    ],
    tenantLocation: [
      "Power Platform Admin Center > Settings > Governance",
      "Power Platform Admin Center > Environments > [Default] > Settings",
      "Microsoft 365 admin center > Settings > Power Platform"
    ],
    implementationSteps: [
      "Define maker personas and permissions",
      "Configure default environment restrictions",
      "Create developer environment request process",
      "Implement mandatory maker training",
      "Set up app review process for production",
      "Configure environment creation governance",
      "Monitor maker activity with CoE kit",
      "Create maker community and support"
    ],
    commonIssues: [
      "Too restrictive policies discourage innovation",
      "Shadow IT when policies are too strict",
      "Makers unaware of governance requirements",
      "No clear path from prototype to production"
    ],
    tags: ["governance", "citizen development", "controls"]
  },
  {
    id: "ops-2025-5",
    text: "Is cost monitoring and optimization automated?",
    type: "scale",
    weight: 3,
    importance: 4,
    category: "Operations",
    description: "Control and optimize Power Platform spending",
    guidance: "Use Power BI reports for cost analysis, implement chargebacks, identify and remove unused resources monthly.",
    bestPractice: "Weekly cost reports, monthly optimization reviews, automated alerts for anomalies, chargeback to business units.",
    microsoftDocs: [
      "https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus",
      "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/cost-management",
      "https://learn.microsoft.com/en-us/power-platform/admin/pay-as-you-go-overview"
    ],
    tenantLocation: [
      "Microsoft 365 admin center > Billing > Cost management",
      "Power Platform Admin Center > Analytics > Usage",
      "Azure Cost Management > Cost analysis > Power Platform"
    ],
    implementationSteps: [
      "Enable detailed usage reporting",
      "Create Power BI cost dashboard",
      "Identify cost drivers and trends",
      "Implement environment cleanup automation",
      "Configure anomaly detection alerts",
      "Create chargeback model",
      "Review unused licenses monthly",
      "Optimize capacity allocations"
    ],
    commonIssues: [
      "Delayed billing data (up to 48 hours)",
      "Complex license model difficult to optimize",
      "Hidden costs from add-ons and storage",
      "No built-in budget controls"
    ],
    tags: ["cost management", "monitoring", "optimization"]
  }
]

// Export complete assessment framework
export const completeAssessmentFramework = {
  securityQuestions: completeSecurityQuestions,
  reliabilityQuestions: completeReliabilityQuestions,
  performanceQuestions: completePerformanceQuestions,
  operationalQuestions: completeOperationalQuestions
}