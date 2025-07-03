import type { Question } from "./types"

// Updated Power Platform Assessment Questions based on 2024 best practices
// Aligned with Microsoft's latest guidance on Power Platform governance, security, and adoption

export const enhancedAssessmentQuestions: Record<string, Question[]> = {
  "documentation-rulebooks": [
    {
      id: "doc-q1",
      text: "Is there a central repository for Power Platform documentation?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Documentation",
      guidance:
        "Consider SharePoint sites, Teams channels, wikis, or dedicated document management systems. A single source of truth is key for discoverability and consistency.",
      references: [
        {
          title: "CoE best practices",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/overview",
        },
      ],
    },
    {
      id: "doc-q2",
      text: "How up-to-date is the Power Platform governance rulebook (scale 1-5)?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Documentation",
      guidance:
        "Assess if the rulebook reflects current platform capabilities, organisational policies, and recent changes. Check the last review date. Outdated rulebooks can lead to non-compliance and security risks.",
      references: [
        {
          title: "Reactive governance strategies",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/reactive-governance",
        },
      ],
    },
    {
      id: "doc-q3",
      text: "What percentage of critical applications have user and technical documentation?",
      type: "percentage",
      weight: 3,
      importance: 3,
      category: "Documentation",
      guidance:
        "Identify critical applications first. User documentation helps with adoption, while technical documentation aids support, development, and understanding resource usage.",
    },
    {
      id: "doc-q4",
      text: "Is there a documented process for solution architecture reviews and technical design documentation?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Documentation",
      guidance:
        "Architecture review processes ensure solutions are scalable, maintainable, and aligned with platform best practices. This should include templates for solution design documents.",
      references: [
        {
          title: "Solution architecture guidance",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/architecture/solution-architecture-overview",
        },
      ],
    },
    {
      id: "doc-q5",
      text: "Are API specifications and integration patterns documented for Power Platform solutions?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Documentation",
      guidance:
        "Document custom connectors, API integrations, and data flow patterns. This is crucial for maintaining and troubleshooting complex integrations.",
    },
  ],

  "dlp-policy": [
    {
      id: "dlp-q1",
      text: "Are DLP policies implemented for all relevant environments?",
      type: "boolean",
      weight: 5,
      importance: 5,
      category: "Security",
      guidance:
        "Check the Power Platform Admin Centre for DLP policies across all environments. Evaluate effectiveness: Are policies tested in simulation mode? What's the match rate? Document the current DLP landscape, connector classifications, policy scope, and testing procedures.",
      references: [
        {
          title: "Data Protection",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/data-protection",
        },
      ],
    },
    {
      id: "dlp-q2",
      text: "How often are DLP policies reviewed and updated (scale 1-5)?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Governance",
      guidance:
        "Regular reviews ensure policies adapt to new connectors and evolving business needs. This is part of ongoing governance and security monitoring.",
      references: [
        {
          title: "Governance, Security, and Compliance",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/observability#governance-security-and-compliance",
        },
      ],
    },
    {
      id: "dlp-q3",
      text: "What percentage of connectors are explicitly classified in DLP policies?",
      type: "percentage",
      weight: 4,
      importance: 4,
      category: "Security",
      guidance:
        "Unclassified connectors often fall into a default group. Aim for explicit classification of all available connectors to ensure robust data governance and security.",
    },
    {
      id: "dlp-q4",
      text: "Is Microsoft Purview integrated for data classification and sensitivity labeling in Power Platform?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Security",
      guidance:
        "Microsoft Purview integration enables advanced data classification, sensitivity labeling, and compliance monitoring across Power Platform solutions.",
      references: [
        {
          title: "Microsoft Purview and Power Platform",
          url: "https://learn.microsoft.com/en-us/power-platform/admin/data-loss-prevention-policies",
        },
      ],
    },
    {
      id: "dlp-q5",
      text: "Are endpoint filtering and HTTP action restrictions configured in DLP policies?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Security",
      guidance:
        "Advanced DLP features like endpoint filtering prevent data exfiltration to unauthorized URLs and enhance security posture.",
    },
  ],

  "environment-usage": [
    {
      id: "env-q1",
      text: "Is there a documented environment strategy?",
      type: "boolean",
      weight: 5,
      importance: 5,
      category: "Strategy",
      guidance:
        "Look for a strategy defining types of environments (dev, test, prod, personal productivity), their purpose, and provisioning process. This strategy should align with ALM practices.",
      references: [
        {
          title: "Environment Strategy guidance",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy",
        },
      ],
    },
    {
      id: "env-q2",
      text: "Are Managed Environments utilized for production workloads?",
      type: "boolean",
      weight: 4,
      importance: 5,
      category: "Governance",
      guidance:
        "Managed Environments provide enhanced governance, security, and operational insights. They are recommended for all production and business-critical environments.",
      references: [
        {
          title: "Managed Environments overview",
          url: "https://learn.microsoft.com/en-us/power-platform/admin/managed-environment-overview",
        },
      ],
    },
    {
      id: "env-q3",
      text: "Is environment lifecycle management automated (provisioning, decommissioning)?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Automation",
      guidance:
        "Automated environment management reduces manual overhead and ensures consistent governance. Consider using Power Platform pipelines, Azure DevOps, or GitHub Actions.",
    },
    {
      id: "env-q4",
      text: "Are environment groups configured for organizing related environments?",
      type: "boolean",
      weight: 2,
      importance: 3,
      category: "Organization",
      guidance:
        "Environment groups help organize environments by project, department, or lifecycle stage, improving manageability at scale.",
    },
    {
      id: "env-q5",
      text: "Is capacity monitoring and optimization performed regularly?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Operations",
      guidance:
        "Regular capacity monitoring helps optimize license usage, identify performance issues, and plan for growth. Use Power Platform Admin Center analytics.",
    },
  ],

  "security-access": [
    {
      id: "sec-q1",
      text: "Is multi-factor authentication (MFA) enforced for all Power Platform users?",
      type: "boolean",
      weight: 5,
      importance: 5,
      category: "Security",
      guidance:
        "MFA is a critical security control. Verify enforcement through Conditional Access policies in Azure AD/Entra ID.",
      references: [
        {
          title: "Security best practices",
          url: "https://learn.microsoft.com/en-us/power-platform/admin/security-best-practices",
        },
      ],
    },
    {
      id: "sec-q2",
      text: "Are Conditional Access policies configured for Power Platform access?",
      type: "boolean",
      weight: 4,
      importance: 5,
      category: "Security",
      guidance:
        "Conditional Access can enforce device compliance, location restrictions, and risk-based access controls for Power Platform.",
    },
    {
      id: "sec-q3",
      text: "Is Privileged Identity Management (PIM) used for admin roles?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Security",
      guidance:
        "PIM provides just-in-time access to administrative privileges, reducing the risk of persistent high-privilege accounts.",
    },
    {
      id: "sec-q4",
      text: "Are service principals used for automated processes instead of user accounts?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Security",
      guidance:
        "Service principals provide more secure authentication for automated processes and eliminate dependency on user accounts.",
    },
    {
      id: "sec-q5",
      text: "Is customer-managed key (CMK) encryption enabled for sensitive environments?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Security",
      guidance:
        "CMK provides additional control over encryption keys for environments containing highly sensitive data.",
    },
  ],

  "monitoring-analytics": [
    {
      id: "mon-q1",
      text: "Is Application Insights integrated for Power Apps telemetry?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Monitoring",
      guidance:
        "Application Insights provides detailed telemetry, performance metrics, and error tracking for Power Apps.",
      references: [
        {
          title: "Monitor and troubleshoot",
          url: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/application-insights",
        },
      ],
    },
    {
      id: "mon-q2",
      text: "Are Power Platform Analytics reports regularly reviewed?",
      type: "scale",
      weight: 3,
      importance: 4,
      category: "Analytics",
      guidance:
        "Regular review of analytics helps identify usage patterns, performance issues, and adoption trends.",
    },
    {
      id: "mon-q3",
      text: "Is Azure Monitor configured for platform-wide monitoring?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Monitoring",
      guidance:
        "Azure Monitor can aggregate logs and metrics from Power Platform, providing centralized monitoring and alerting.",
    },
    {
      id: "mon-q4",
      text: "Are automated alerts configured for critical events (failures, capacity)?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Operations",
      guidance:
        "Proactive alerting helps identify and resolve issues before they impact users. Configure alerts for flow failures, capacity thresholds, and security events.",
    },
    {
      id: "mon-q5",
      text: "Is user adoption tracking implemented with defined KPIs?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Analytics",
      guidance:
        "Track metrics like active users, app usage frequency, and feature adoption to measure platform success.",
    },
  ],

  "alm-devops": [
    {
      id: "alm-q1",
      text: "Are Power Platform pipelines configured for solution deployment?",
      type: "boolean",
      weight: 5,
      importance: 5,
      category: "ALM",
      guidance:
        "Power Platform pipelines provide native ALM capabilities for deploying solutions across environments with approval workflows.",
      references: [
        {
          title: "Power Platform pipelines",
          url: "https://learn.microsoft.com/en-us/power-platform/alm/pipelines",
        },
      ],
    },
    {
      id: "alm-q2",
      text: "Is source control (Git) used for Power Platform solutions?",
      type: "boolean",
      weight: 4,
      importance: 5,
      category: "DevOps",
      guidance:
        "Source control enables version history, collaboration, and rollback capabilities. Use Power Platform CLI for solution export/import.",
    },
    {
      id: "alm-q3",
      text: "Are automated tests implemented for Power Platform solutions?",
      type: "scale",
      weight: 4,
      importance: 4,
      category: "Quality",
      guidance:
        "Automated testing ensures solution quality. Consider Power Apps Test Studio, Power Automate testing, and custom test frameworks.",
    },
    {
      id: "alm-q4",
      text: "Is solution checker integrated into the deployment pipeline?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Quality",
      guidance:
        "Solution checker identifies performance, security, and reliability issues before deployment.",
    },
    {
      id: "alm-q5",
      text: "Are deployment approvals and governance gates configured?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Governance",
      guidance:
        "Approval workflows ensure proper review and authorization before production deployments.",
    },
  ],

  "data-governance": [
    {
      id: "data-q1",
      text: "Is Dataverse used as the primary data platform for enterprise solutions?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Data Platform",
      guidance:
        "Dataverse provides enterprise-grade security, auditing, and integration capabilities compared to other data sources.",
      references: [
        {
          title: "Dataverse overview",
          url: "https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro",
        },
      ],
    },
    {
      id: "data-q2",
      text: "Are data retention policies configured and enforced?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Compliance",
      guidance:
        "Data retention policies ensure compliance with regulations and optimize storage. Configure in Dataverse and audit log settings.",
    },
    {
      id: "data-q3",
      text: "Is field-level security implemented for sensitive data?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Security",
      guidance:
        "Field-level security in Dataverse restricts access to sensitive fields based on user roles and permissions.",
    },
    {
      id: "data-q4",
      text: "Are data integration patterns standardized (ETL/ELT, real-time)?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Integration",
      guidance:
        "Standardized integration patterns ensure consistency, maintainability, and performance across solutions.",
    },
    {
      id: "data-q5",
      text: "Is data quality monitoring and cleansing automated?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Quality",
      guidance:
        "Automated data quality checks help maintain data integrity and reliability across Power Platform solutions.",
    },
  ],

  "training-adoption": [
    {
      id: "train-q1",
      text: "Is there a formal Power Platform training program for makers?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Training",
      guidance:
        "Formal training ensures makers understand best practices, governance policies, and platform capabilities.",
      references: [
        {
          title: "Training and adoption",
          url: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/training",
        },
      ],
    },
    {
      id: "train-q2",
      text: "Are Power Platform champions identified and engaged?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "Adoption",
      guidance:
        "Champions drive adoption, provide peer support, and bridge the gap between IT and business users.",
    },
    {
      id: "train-q3",
      text: "Is there a maker community or forum for knowledge sharing?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Community",
      guidance:
        "Internal communities foster collaboration, knowledge sharing, and problem-solving among makers.",
    },
    {
      id: "train-q4",
      text: "Are success stories and use cases documented and shared?",
      type: "scale",
      weight: 2,
      importance: 3,
      category: "Adoption",
      guidance:
        "Sharing success stories motivates adoption and provides practical examples of platform value.",
    },
    {
      id: "train-q5",
      text: "Is maker productivity and satisfaction measured?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Metrics",
      guidance:
        "Regular surveys and metrics help identify training needs and adoption barriers.",
    },
  ],

  "business-value": [
    {
      id: "value-q1",
      text: "Are business value metrics defined for Power Platform initiatives?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Metrics",
      guidance:
        "Define metrics like time saved, cost reduction, process improvement to demonstrate platform ROI.",
    },
    {
      id: "value-q2",
      text: "Is there a process for measuring and reporting ROI?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Governance",
      guidance:
        "Regular ROI reporting justifies platform investment and guides future initiatives.",
    },
    {
      id: "value-q3",
      text: "Are citizen development initiatives tracked and measured?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Metrics",
      guidance:
        "Track the number of citizen developers, solutions created, and business impact to measure program success.",
    },
    {
      id: "value-q4",
      text: "Is there executive sponsorship for Power Platform initiatives?",
      type: "boolean",
      weight: 4,
      importance: 5,
      category: "Leadership",
      guidance:
        "Executive sponsorship is crucial for platform success, resource allocation, and organizational alignment.",
    },
    {
      id: "value-q5",
      text: "Are Power Platform costs optimized and regularly reviewed?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "Operations",
      guidance:
        "Regular cost reviews help optimize licensing, identify unused resources, and improve ROI.",
    },
  ],

  "innovation-ai": [
    {
      id: "ai-q1",
      text: "Is Copilot for Power Platform enabled and utilized?",
      type: "boolean",
      weight: 3,
      importance: 4,
      category: "AI/Innovation",
      guidance:
        "Copilot accelerates development with AI-assisted app creation, flow building, and natural language queries.",
      references: [
        {
          title: "Copilot in Power Platform",
          url: "https://learn.microsoft.com/en-us/power-platform/developer/copilot",
        },
      ],
    },
    {
      id: "ai-q2",
      text: "Are AI Builder capabilities integrated into solutions?",
      type: "scale",
      weight: 3,
      importance: 3,
      category: "AI/Innovation",
      guidance:
        "AI Builder enables custom AI models for form processing, object detection, prediction, and text analysis.",
    },
    {
      id: "ai-q3",
      text: "Is there a process for evaluating and adopting new Power Platform features?",
      type: "boolean",
      weight: 3,
      importance: 3,
      category: "Innovation",
      guidance:
        "Stay current with platform innovations through regular feature evaluation and controlled pilots.",
    },
    {
      id: "ai-q4",
      text: "Are GPT/Azure OpenAI services integrated with Power Platform?",
      type: "boolean",
      weight: 2,
      importance: 3,
      category: "AI/Innovation",
      guidance:
        "Integration with Azure OpenAI enables advanced language models and conversational AI in Power Platform solutions.",
    },
    {
      id: "ai-q5",
      text: "Is responsible AI governance implemented for AI-powered solutions?",
      type: "boolean",
      weight: 4,
      importance: 4,
      category: "Governance",
      guidance:
        "Ensure AI solutions follow responsible AI principles including fairness, transparency, and accountability.",
    },
  ],
}