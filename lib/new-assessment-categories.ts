import type { AssessmentStandard, Question } from "./types"

// New assessment categories for Power Platform
// These address specific areas: Power Apps complexity, Power Automate security, and Power Pages performance

export const powerAppsComplexityQuestions: Question[] = [
  {
    id: "app-complex-q1",
    text: "Are component libraries used to ensure consistency across Power Apps?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Architecture",
    guidance:
      "Component libraries promote reusability, consistency, and maintenance efficiency. They reduce development time and ensure UI/UX standards.",
    references: [
      {
        title: "Component library",
        url: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/component-library",
      },
    ],
  },
  {
    id: "app-complex-q2",
    text: "What is the average number of screens per Power App (enter number)?",
    type: "numeric",
    weight: 3,
    importance: 3,
    category: "Complexity",
    guidance:
      "Apps with >20 screens may indicate complexity that should be split into multiple apps. Large apps impact performance and maintainability.",
  },
  {
    id: "app-complex-q3",
    text: "Are performance optimization techniques implemented (delegation, concurrent, indexed columns)?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Performance",
    guidance:
      "Performance optimization is critical for complex apps. Check for proper delegation warnings, use of concurrent functions, and indexed Dataverse columns.",
    references: [
      {
        title: "Performance optimization",
        url: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/performance-tips",
      },
    ],
  },
  {
    id: "app-complex-q4",
    text: "Is there a defined threshold for when to use model-driven vs canvas apps?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Architecture",
    guidance:
      "Clear guidelines help makers choose the right app type. Model-driven apps excel at complex data scenarios, while canvas apps offer design flexibility.",
  },
  {
    id: "app-complex-q5",
    text: "Are named formulas used to reduce app complexity and improve performance?",
    type: "boolean",
    weight: 3,
    importance: 4,
    category: "Performance",
    guidance:
      "Named formulas (Power Fx) reduce redundant calculations and improve app performance by computing values once and reusing them.",
    references: [
      {
        title: "Named formulas",
        url: "https://learn.microsoft.com/en-us/power-platform/power-fx/named-formulas",
      },
    ],
  },
  {
    id: "app-complex-q6",
    text: "What percentage of apps use responsive design for multi-device support?",
    type: "percentage",
    weight: 3,
    importance: 3,
    category: "Design",
    guidance:
      "Responsive design ensures apps work across devices. Use flexible layouts, responsive containers, and device-specific formulas.",
  },
  {
    id: "app-complex-q7",
    text: "Are accessibility standards (WCAG 2.1) implemented in Power Apps?",
    type: "scale",
    weight: 4,
    importance: 5,
    category: "Accessibility",
    guidance:
      "Accessibility is legally required in many regions. Check color contrast, screen reader support, keyboard navigation, and accessible labels.",
    references: [
      {
        title: "Accessibility guidelines",
        url: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/accessibility-guidelines",
      },
    ],
  },
  {
    id: "app-complex-q8",
    text: "Is app telemetry configured to monitor performance and errors?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Monitoring",
    guidance:
      "App telemetry provides insights into performance bottlenecks, error rates, and user behavior. Essential for complex production apps.",
  },
  {
    id: "app-complex-q9",
    text: "Are custom connectors documented with OpenAPI specifications?",
    type: "boolean",
    weight: 3,
    importance: 3,
    category: "Integration",
    guidance:
      "OpenAPI specs ensure custom connectors are well-documented, maintainable, and can be shared across the organization.",
  },
  {
    id: "app-complex-q10",
    text: "Is there a code review process for complex Power Fx formulas?",
    type: "boolean",
    weight: 3,
    importance: 4,
    category: "Quality",
    guidance:
      "Complex formulas should be reviewed for performance, maintainability, and correctness. Consider delegation, naming conventions, and error handling.",
  },
]

export const powerAutomateSecurityQuestions: Question[] = [
  {
    id: "flow-sec-q1",
    text: "Are secure inputs/outputs enabled for sensitive data in flows?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "Security",
    guidance:
      "Secure inputs/outputs prevent sensitive data from appearing in run history and logs. Critical for handling PII, credentials, or confidential data.",
    references: [
      {
        title: "Secure data in flows",
        url: "https://learn.microsoft.com/en-us/power-automate/secure-data-process",
      },
    ],
  },
  {
    id: "flow-sec-q2",
    text: "Is Azure Key Vault integrated for managing secrets in flows?",
    type: "boolean",
    weight: 4,
    importance: 5,
    category: "Security",
    guidance:
      "Key Vault provides secure, centralized secret management. Avoid hardcoding credentials or API keys in flow definitions.",
    references: [
      {
        title: "Key Vault integration",
        url: "https://learn.microsoft.com/en-us/power-automate/key-vault-integration",
      },
    ],
  },
  {
    id: "flow-sec-q3",
    text: "Are flow run permissions restricted based on data sensitivity?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Access Control",
    guidance:
      "Limit who can view flow runs containing sensitive data. Use environment security roles and flow sharing settings appropriately.",
  },
  {
    id: "flow-sec-q4",
    text: "Is there a process for reviewing and approving high-privilege flow connections?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Governance",
    guidance:
      "Flows with admin connectors or elevated permissions pose security risks. Implement approval processes for such connections.",
  },
  {
    id: "flow-sec-q5",
    text: "Are HTTP actions restricted or monitored in DLP policies?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "Security",
    guidance:
      "Unrestricted HTTP actions can exfiltrate data to any endpoint. Configure endpoint filtering or block HTTP connector in sensitive environments.",
  },
  {
    id: "flow-sec-q6",
    text: "What percentage of flows use service accounts instead of personal accounts?",
    type: "percentage",
    weight: 3,
    importance: 4,
    category: "Security",
    guidance:
      "Service accounts provide better security and continuity. Personal account dependencies create risks when users leave or change roles.",
  },
  {
    id: "flow-sec-q7",
    text: "Are flow isolation boundaries implemented for different security zones?",
    type: "boolean",
    weight: 3,
    importance: 4,
    category: "Architecture",
    guidance:
      "Separate environments or solutions for flows handling different data classifications (public, internal, confidential, restricted).",
  },
  {
    id: "flow-sec-q8",
    text: "Is flow execution history retention configured based on compliance requirements?",
    type: "boolean",
    weight: 3,
    importance: 3,
    category: "Compliance",
    guidance:
      "Configure appropriate retention periods for flow run history based on regulatory requirements and data sensitivity.",
  },
  {
    id: "flow-sec-q9",
    text: "Are critical flows protected with error handling and compensating actions?",
    type: "scale",
    weight: 4,
    importance: 4,
    category: "Reliability",
    guidance:
      "Implement try-catch-finally patterns, compensating transactions, and proper error notifications for business-critical flows.",
  },
  {
    id: "flow-sec-q10",
    text: "Is there an incident response plan for compromised flow credentials?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Security",
    guidance:
      "Have procedures for credential rotation, flow suspension, and impact assessment if flow connections are compromised.",
  },
]

export const powerPagesPerformanceQuestions: Question[] = [
  {
    id: "pages-perf-q1",
    text: "Is CDN (Content Delivery Network) enabled for Power Pages sites?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Performance",
    guidance:
      "CDN improves page load times by serving static content from geographically distributed servers. Essential for global audiences.",
    references: [
      {
        title: "Power Pages CDN",
        url: "https://learn.microsoft.com/en-us/power-pages/admin/cdn",
      },
    ],
  },
  {
    id: "pages-perf-q2",
    text: "Are page load times monitored and optimized (target <3 seconds)?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Performance",
    guidance:
      "Page load time directly impacts user experience and SEO. Monitor using tools like Application Insights or Google PageSpeed.",
  },
  {
    id: "pages-perf-q3",
    text: "Is server-side caching configured for dynamic content?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Performance",
    guidance:
      "Output caching and object caching reduce database queries and improve response times. Configure based on content update frequency.",
    references: [
      {
        title: "Caching in Power Pages",
        url: "https://learn.microsoft.com/en-us/power-pages/configure/caching",
      },
    ],
  },
  {
    id: "pages-perf-q4",
    text: "Are images optimized (format, size, lazy loading)?",
    type: "scale",
    weight: 3,
    importance: 4,
    category: "Performance",
    guidance:
      "Use modern formats (WebP), appropriate sizes, and lazy loading. Large images are a common cause of poor performance.",
  },
  {
    id: "pages-perf-q5",
    text: "What percentage of API calls use pagination for large datasets?",
    type: "percentage",
    weight: 4,
    importance: 4,
    category: "Performance",
    guidance:
      "Pagination prevents loading excessive data. Implement server-side pagination for tables, lists, and search results.",
  },
  {
    id: "pages-perf-q6",
    text: "Is JavaScript bundling and minification implemented?",
    type: "boolean",
    weight: 3,
    importance: 3,
    category: "Performance",
    guidance:
      "Bundling and minification reduce file sizes and HTTP requests. Use build tools or Power Pages built-in optimization features.",
  },
  {
    id: "pages-perf-q7",
    text: "Are database queries optimized with proper indexing?",
    type: "scale",
    weight: 5,
    importance: 5,
    category: "Performance",
    guidance:
      "Proper Dataverse indexing is crucial for query performance. Analyze slow queries and add indexes for frequently filtered columns.",
  },
  {
    id: "pages-perf-q8",
    text: "Is synthetic monitoring configured to detect performance degradation?",
    type: "boolean",
    weight: 3,
    importance: 3,
    category: "Monitoring",
    guidance:
      "Synthetic monitoring proactively detects performance issues before users complain. Set up automated tests for critical user journeys.",
  },
  {
    id: "pages-perf-q9",
    text: "Are progressive web app (PWA) features implemented?",
    type: "boolean",
    weight: 2,
    importance: 3,
    category: "Performance",
    guidance:
      "PWA features like service workers enable offline functionality and improved performance through intelligent caching.",
  },
  {
    id: "pages-perf-q10",
    text: "Is there a performance budget defined and monitored?",
    type: "boolean",
    weight: 3,
    importance: 3,
    category: "Governance",
    guidance:
      "Performance budgets (e.g., max page size, load time) ensure performance remains a priority throughout development.",
  },
]

// New assessment standards incorporating the new categories
export const newAssessmentStandards: AssessmentStandard[] = [
  {
    slug: "power-apps-complexity",
    name: "Power Apps Complexity & Architecture",
    weight: 15,
    description: "Assessment of Power Apps complexity management, architecture patterns, and development best practices.",
  },
  {
    slug: "power-automate-security",
    name: "Power Automate Security & Governance",
    weight: 20,
    description: "Evaluation of security controls, governance practices, and risk management for Power Automate flows.",
  },
  {
    slug: "power-pages-performance",
    name: "Power Pages Performance & Optimization",
    weight: 15,
    description: "Analysis of Power Pages performance optimization, caching strategies, and user experience metrics.",
  },
]