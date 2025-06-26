import type { AssessmentStandard, QuestionType } from "./types"

export const ASSESSMENT_STANDARDS: AssessmentStandard[] = [
  {
    slug: "documentation-rulebooks",
    name: "Documentation & Rulebooks Review",
    weight: 10,
    description: "Review of existing documentation, standards, and governance rulebooks for the organisation.",
    questions: [
      {
        id: "doc-q1",
        text: "Is there a central repository for Power Platform documentation?",
        type: "boolean",
        weight: 3,
        category: "Documentation",
        guidance:
          "Consider SharePoint sites, Teams channels, wikis, or dedicated document management systems. A single source of truth is key for discoverability and consistency.",
        bestPractice: {
          description:
            "A mature organisation maintains a central, accessible repository for all Power Platform documentation, including governance policies, best practices, and solution-specific materials. This is a core principle of a well-governed platform.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/overview",
          linkText: "Learn about CoE best practices",
          suggestedActions: [
            "Identify and designate a primary platform for documentation (e.g., SharePoint, Confluence).",
            "Migrate existing documentation to the central repository.",
            "Establish clear guidelines for documentation creation, formatting, and maintenance.",
            "Communicate the location and importance of the central repository to all stakeholders.",
          ],
        },
      },
      {
        id: "doc-q2",
        text: "How up-to-date is the Power Platform governance rulebook (scale 1-5)?",
        type: "scale",
        weight: 4,
        category: "Documentation",
        options: ["1 (Outdated/None)", "2", "3", "4", "5 (Very Current)"],
        guidance:
          "Assess if the rulebook reflects current platform capabilities, organisational policies, and recent changes. Check the last review date. Outdated rulebooks can lead to non-compliance and security risks.",
        bestPractice: {
          description:
            "Governance documentation should be treated as a living document, reviewed and updated at least quarterly to keep pace with platform updates and evolving business needs. This is a key part of reactive governance and ensures insights into platform usage inform policy.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/reactive-governance",
          linkText: "Review reactive governance strategies",
          suggestedActions: [
            "Establish a regular review cycle (e.g., quarterly) for the governance rulebook.",
            "Assign ownership for maintaining and updating the rulebook.",
            "Incorporate feedback from the CoE, IT, and business units into updates.",
            "Track changes and version history for the rulebook.",
          ],
        },
      },
      {
        id: "doc-q3",
        text: "What percentage of critical applications have user and technical documentation?",
        type: "percentage",
        weight: 3,
        category: "Documentation",
        guidance:
          "Identify critical applications first. User documentation helps with adoption, while technical documentation aids support, development, and understanding resource usage.",
      },
    ],
  },
  {
    slug: "dlp-policy",
    name: "DLP Policy Assessment",
    weight: 10,
    description: "Assessment of Data Loss Prevention (DLP) policies and their effectiveness within the organisation.",
    questions: [
      {
        id: "dlp-q1",
        text: "Are DLP policies implemented for all relevant environments?",
        type: "boolean",
        weight: 5,
        category: "Security",
        guidance:
          "Check the Power Platform Admin Centre for DLP policies across all environments (default, production, development, individual productivity). Evaluate effectiveness: Are policies tested in simulation mode? What's the match rate? Is there a process for gradual rollout (simulation -> tips -> enforcement)? In evidence notes, document the current DLP landscape, connector classifications, policy scope, testing procedures, and analyse its effectiveness, noting identified weaknesses, false positive rates, or potential workarounds.",
        bestPractice: {
          description:
            "Best practice is to have a tenant-wide policy that acts as a baseline, with more restrictive policies applied to production and business-critical environments to protect sensitive data. Regular monitoring of DLP policy impact is essential.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/data-protection",
          linkText: "Learn about Data Protection",
          suggestedActions: [
            "Define a baseline DLP policy for the entire tenant with explicit classification for all connectors.",
            "Implement stricter, environment-specific DLP policies for production and sensitive data environments.",
            "Establish a process for DLP policy lifecycle: simulation mode testing, match rate analysis, gradual rollout, and user education.",
            "Regularly audit environments to ensure appropriate DLP policies are applied and effective.",
            "Use the CoE Starter Kit DLP impact analysis tools to evaluate user adherence and identify false positives/negatives.",
            "Compile and maintain a list of identified weaknesses, coverage gaps, and areas for improvement in DLP policies, refining based on feedback and analytics.",
            "Integrate DLP policy monitoring with Microsoft Purview data classification insights.",
          ],
        },
        discovery: [
          "Navigate to the Power Platform Admin Center (admin.powerplatform.microsoft.com).",
          "In the left navigation pane, select 'Policies' > 'Data policies'.",
          "Review the list of policies. Check the 'Scope' column to see which environments they apply to (e.g., Tenant-level, Multiple environments).",
          "Click on a policy and select the 'Connectors' tab to review how connectors are classified (Business, Non-Business, Blocked).",
        ],
      },
      {
        id: "dlp-q2",
        text: "How often are DLP policies reviewed and updated (scale 1-5)?",
        type: "scale",
        weight: 4,
        category: "Governance",
        options: ["1 (Never)", "2 (Annually)", "3 (Bi-Annually)", "4 (Quarterly)", "5 (Monthly)"],
        guidance:
          "Regular reviews ensure policies adapt to new connectors and evolving business needs. This is part of ongoing governance and security monitoring.",
        bestPractice: {
          description:
            "DLP policies should be reviewed frequently (e.g., quarterly) to adapt to new connectors and business requirements. This proactive approach is vital for maintaining security and compliance, supported by insights from platform monitoring.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/observability#governance-security-and-compliance",
          linkText: "Insights for Governance, Security, and Compliance",
        },
      },
      {
        id: "dlp-q3",
        text: "What percentage of connectors are explicitly classified (Business, Non-Business, Blocked) in DLP policies?",
        type: "percentage",
        weight: 4,
        category: "Security",
        guidance:
          "Unclassified connectors often fall into a default group. Aim for explicit classification of all available connectors to ensure robust data governance and security.",
      },
      {
        id: "dlp-q4",
        text: "Is there a documented process for requesting exceptions or changes to DLP policies?",
        type: "boolean",
        weight: 3,
        category: "Governance",
        guidance:
          "A clear process ensures legitimate needs can be met while maintaining control and auditability. This process should be part of your overall governance framework.",
      },
      {
        id: "dlp-q5",
        text: "Are DLP policies configured to restrict data flows between different geographic regions to comply with data residency requirements?",
        type: "boolean",
        weight: 4,
        category: "Data Residency & Compliance",
        guidance:
          "For global organizations, it's critical to prevent sensitive data from one region (e.g., EU) from being processed or stored in another (e.g., US). Check if DLP policies are scoped to specific regions or use connector action controls to block cross-region data movement.",
        bestPractice: {
          description:
            "In a multi-region tenancy, DLP policies must be designed to enforce data sovereignty. This involves creating region-specific policies that prevent connectors from moving data across geographic boundaries, which is a key requirement for regulations like GDPR.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/dlp-connector-action-controls",
          linkText: "Connector action controls",
          suggestedActions: [
            "Map out all data residency requirements for your organization.",
            "Create region-specific DLP policies for environments within each geography.",
            "Use connector action controls to block specific actions that could lead to cross-region data transfer.",
            "Regularly audit DLP logs for violations of regional data policies.",
          ],
        },
      },
    ],
  },
  {
    slug: "environment-usage",
    name: "Environment Usage & Architecture",
    weight: 10,
    description: "Evaluation of environment strategy, usage, overall architecture, and complex connectivity patterns.",
    questions: [
      {
        id: "env-q1",
        text: "Is there a documented environment strategy?",
        type: "boolean",
        weight: 5,
        category: "Strategy",
        guidance:
          "Look for a strategy defining types of environments (dev, test, prod, personal productivity), their purpose, and provisioning process. This strategy should align with ALM practices and support monitoring of resource usage.",
        bestPractice: {
          description:
            "A robust environment strategy is fundamental to governing the platform at scale. It should define environment types, access policies, and the process for requesting new environments, ensuring a clear path for ALM and enabling effective resource optimisation through observability.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy",
          linkText: "Read the Environment Strategy guidance",
        },
      },
      {
        id: "env-q2",
        text: "How well is the environment strategy communicated and understood by makers and administrators (scale 1-5)?",
        type: "scale",
        weight: 3,
        category: "Strategy",
        options: ["1 (Poorly)", "2", "3", "4", "5 (Very Well)"],
        guidance:
          "Assess awareness through training materials, CoE communications, or direct feedback from stakeholders. Clear understanding promotes adherence and efficient resource use.",
      },
      {
        id: "env-q3",
        text: "What is the ratio of production to non-production environments (e.g., 1:3)?",
        type: "text",
        weight: 2,
        category: "Architecture",
        guidance:
          "A healthy ratio typically involves more non-production environments to support proper ALM. Enter as 'Prod:NonProd', e.g., '1:3'. This ratio can impact capacity and licence monitoring.",
      },
      {
        id: "env-q4",
        text: "Is there a defined strategy and governance process for managing on-premises data gateways, including regional deployment for data residency?",
        type: "boolean",
        weight: 3,
        category: "Connectivity & Integration",
        guidance:
          "Assess policies for gateway clusters for high availability, security (who can install/manage), patching, monitoring performance, and how gateways are allocated. For global organizations, check for a strategy of deploying gateways within specific geographic regions to keep data local.",
        bestPractice: {
          description:
            "A well-defined governance model for on-premises data gateways, including clustering for HA and region-specific deployments, ensures secure, reliable, and compliant connectivity to on-premises data sources.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/wp-onpremises-data-gateway",
          linkText: "On-premises data gateway best practices",
        },
      },
      {
        id: "env-q5",
        text: "Is Azure API Management utilised for exposing and managing APIs used in hybrid integration scenarios with Power Platform?",
        type: "boolean",
        weight: 2,
        category: "Connectivity & Integration",
        guidance:
          "For complex hybrid integrations, Azure API Management can provide a secure and managed way to expose on-premises or other custom APIs for consumption by Power Platform solutions. Assess if this is part of the integration strategy for relevant use cases.",
        bestPractice: {
          description:
            "Making use of Azure API Management for hybrid API exposure provides enhanced security, policy enforcement, monitoring, and lifecycle management for APIs consumed by Power Platform, supporting robust and scalable integrations.",
          link: "https://learn.microsoft.com/en-us/azure/api-management/api-management-key-concepts",
          linkText: "Azure API Management Overview",
        },
      },
      {
        id: "env-q6",
        text: "Are resilient integration patterns, such as circuit breakers, implemented for critical integrations between Power Platform and external systems?",
        type: "boolean",
        weight: 2,
        category: "Connectivity & Integration",
        guidance:
          "Circuit breaker patterns help prevent cascading failures in distributed systems by stopping requests to a failing service after a certain threshold. Assess if such patterns are considered or implemented for critical, high-volume integrations to improve solution resilience.",
        bestPractice: {
          description:
            "Implementing resilience patterns like circuit breakers in critical integrations helps to isolate failures, prevent system overload, and improve the overall stability and reliability of Power Platform solutions interacting with external services.",
          link: "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker",
          linkText: "Circuit Breaker Pattern",
        },
      },
      {
        id: "env-q7",
        text: "Is there a defined strategy for managing data residency, including the geographic distribution of environments and data?",
        type: "boolean",
        weight: 5,
        category: "Data Residency & Compliance",
        guidance:
          "For global organizations, this is critical. Look for a documented policy that specifies where data can be stored and processed, and how environments are provisioned to comply with laws like GDPR. This impacts performance, latency, and compliance.",
        bestPractice: {
          description:
            "A formal data residency strategy involves creating separate environments in different geographic regions, supported by region-specific DLP policies and gateway deployments. This ensures compliance with data localization laws and optimizes performance for global users.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/new-datacenter-regions",
          linkText: "Power Platform geographic availability",
          suggestedActions: [
            "Define and document a clear data residency policy for the organization.",
            "Establish separate Power Platform environments for each required geographic region.",
            "Implement a process for provisioning regional on-premises data gateways.",
            "Configure region-specific DLP policies to prevent unauthorized cross-border data flows.",
            "Monitor for and audit any cross-region data movement to ensure compliance.",
          ],
        },
      },
    ],
  },
  {
    slug: "security-access",
    name: "Security, Access & Threat Detection",
    weight: 15,
    description:
      "Review of security configurations, access controls, identity management, data segregation, and threat detection capabilities.",
    questions: [
      {
        id: "sec-q1",
        text: "Are security roles within Dataverse and Power Platform environments reviewed regularly based on the principle of least privilege?",
        type: "boolean",
        weight: 3,
        category: "Access Control",
        guidance:
          "This question evaluates if a formal process exists for reviewing security roles (Dataverse, Power Platform Admin roles like Global, Dynamics 365, Power Platform admin) against the principle of least privilege. Assess the maturity: Level 100 (basic password policies) to Level 500 (AI-driven risk assessment, continuous compliance). Key metrics to consider: provisioning time (<1 day target), MFA adoption (100% target), automated identity lifecycle tasks (>80% coverage). Use evidence notes to document the current review process, its frequency, role mapping, and findings on excessive permissions or gaps. Summarise the current maturity level based on the 100-500 scale.",
        bestPractice: {
          description:
            "Security roles, including tenant-level Power Platform admin roles, should be reviewed regularly as part of a 'Least Privileged Access' (LPA) model. This ensures users and administrators only have the access they absolutely need, a core principle of Microsoft's 'Zero Trust' security approach. Monitoring user activity and access patterns provides essential insights for these reviews.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/create-edit-security-role",
          linkText: "Learn about managing security roles",
          suggestedActions: [
            "Establish a documented, scheduled review (e.g., quarterly) for all security roles, including tenant-level admin roles.",
            "Define and implement target metrics for identity lifecycle management (e.g., provisioning time, MFA adoption, automation coverage).",
            "Generate a report detailing identified security gaps, excessive permissions, or non-compliance against least privilege.",
            "Implement an approval process for creating or modifying security roles, incorporating peer review.",
            "Remediate identified gaps by creating or modifying roles to enforce least privilege.",
            "Remove or consolidate unused or overly permissive security roles.",
            "Integrate Identity Secure Score recommendations into the review process.",
          ],
        },
        discovery: [
          "For environment roles: Navigate to the Power Platform Admin Center.",
          "Select an environment, then go to 'Settings' > 'Users + permissions' > 'Security roles'.",
          "Click on a key role (e.g., System Administrator, Basic User) to inspect its detailed privileges across different tables.",
          "For tenant-level roles: Navigate to the Microsoft Entra admin center (entra.microsoft.com).",
          "Go to 'Identity' > 'Roles & admins' > 'Roles and administrators'.",
          "Search for roles like 'Power Platform Administrator' or 'Dynamics 365 Administrator' and review their assigned members.",
        ],
      },
      {
        id: "sec-q2",
        text: "Rate the effectiveness of current access control mechanisms for apps and data (1-5).",
        type: "scale",
        weight: 3,
        category: "Access Control",
        options: ["1 (Ineffective)", "2", "3", "4", "5 (Highly Effective)"],
        guidance:
          "Consider how access is granted, managed, and revoked for apps, flows, and underlying data sources. Are Azure AD groups used effectively? Effective controls are key to data security and compliance.",
        bestPractice: {
          description:
            "Effective access control uses a 'Defence-in-Depth' strategy, combining authentication, authorisation (Web Roles, Table Permissions), and regular configuration checks. For external sites, this includes making use of Power Pages' robust security model. Observability tools help verify that these controls are working as intended.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/wp-security",
          linkText: "Review the Power Platform Security White Paper",
        },
      },
      {
        id: "sec-q3",
        text: "For external-facing Power Pages sites, is a Web Application Firewall (WAF) configured and are security headers (like CSP) actively managed?",
        type: "boolean",
        weight: 3,
        category: "Application Security",
        guidance:
          "Check the site's configuration in the Power Platform admin centre. A WAF provides a critical perimeter defence against common web attacks. Active management of security headers is part of ongoing application security.",
        bestPractice: {
          description:
            "Power Pages security follows a 'Defence-in-Depth' model. A key layer is the network perimeter, where a Web Application Firewall (WAF) should be used to filter malicious traffic. Additionally, configuring HTTP Security Headers like Content-Security-Policy (CSP) hardens the application against client-side attacks. Monitoring WAF logs and site activity provides crucial security insights.",
          link: "https://learn.microsoft.com/en-us/power-pages/guidance/white-papers/security",
          linkText: "Read the Power Pages Security White Paper",
        },
      },
      {
        id: "sec-q4",
        text: "Are Power Platform activity logs, audits, and events being collected and monitored for suspicious activities (e.g., using Microsoft Sentinel or other SIEM tools)?",
        type: "boolean",
        weight: 5,
        category: "Threat Detection & Monitoring",
        guidance:
          "Effective threat detection requires comprehensive logging and monitoring. Assess maturity: Level 100 (basic reactive monitoring) to Level 500 (AI-driven insights, self-healing). Check if tools like Microsoft Sentinel are configured to ingest Power Platform logs (activity, audit) and if alerts are set up for suspicious activities. Evaluate diagnostic settings coverage across M365 services (Exchange, SharePoint, Teams) and log retention alignment with compliance. Use evidence notes to document current monitoring, auditing processes, SIEM integration status, and alert configurations.",
        bestPractice: {
          description:
            "Implementing robust monitoring and alerting systems, such as Microsoft Sentinel, is crucial for detecting suspicious activities and responding promptly to protect data and applications. This includes collecting Power Platform activity logs, audits, and events.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/threat-detection#microsoft-sentinel",
          linkText: "Using Microsoft Sentinel for threat detection",
          suggestedActions: [
            "Integrate Power Platform activity and audit logs with Microsoft Sentinel or your existing SIEM solution.",
            "Ensure comprehensive diagnostic settings coverage for all relevant M365 services, forwarding logs to a central Log Analytics workspace.",
            "Configure alert rules in the SIEM for high-risk activities, specific threat scenarios (e.g., unauthorised geo-access, bulk deletion), and deviations from security baselines.",
            "Regularly review SIEM dashboards and investigate alerts promptly, following a defined incident response plan.",
            "Ensure log retention policies meet compliance and operational requirements.",
            "Develop KQL queries and workbooks for custom reporting and proactive threat hunting.",
          ],
        },
      },
      {
        id: "sec-q5",
        text: "Is there a defined process for investigating and responding to detected threats or security incidents within the Power Platform environment?",
        type: "boolean",
        weight: 4,
        category: "Incident Response",
        guidance:
          "A documented incident response plan should outline steps for investigation, containment, eradication, recovery, and lessons learned. This plan should be regularly tested.",
        bestPractice: {
          description:
            "A well-defined incident response plan enables organisations to effectively manage and mitigate security breaches. For Power Platform, this includes processes for investigating alerts from tools like Sentinel and responding manually or via automated workflows.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/threat-detection#respond-to-power-platform-related-threats",
          linkText: "Responding to Power Platform threats",
        },
      },
      {
        id: "sec-q6",
        text: "Are specific threat scenarios (e.g., Power Apps activity from unauthorised geographic locations, bulk data deletion, malicious links) actively monitored and alerted on?",
        type: "boolean",
        weight: 4,
        category: "Threat Detection Scenarios",
        guidance:
          "Check if monitoring tools are configured with rules or analytics to detect common Power Platform threat scenarios as outlined by Microsoft.",
        bestPractice: {
          description:
            "Make use of built-in threat coverage and configure custom detection rules in solutions like Microsoft Sentinel to monitor for specific scenarios such as unauthorised access, bulk data operations, and activity from departing employees.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/threat-detection#built-in-threat-coverage",
          linkText: "Common threat scenarios in Power Platform",
        },
      },
      {
        id: "sec-q7",
        text: "Is there a clearly defined and implemented strategy for data segregation within Dataverse environments (e.g., using Business Units, tailored security roles, field-level security, or hierarchy security) to ensure data is appropriately partitioned and access is restricted according to organisational structure, function, or specific compliance requirements?",
        type: "boolean",
        weight: 4,
        category: "Data Governance & Segregation",
        guidance:
          "Assess whether a formal strategy exists for partitioning data within Dataverse. This goes beyond environment-level separation and looks at controls like Business Units to separate data for different departments/regions, specific security roles to control record/field visibility, and potentially hierarchy security for managerial access. Lack of clear segregation can lead to data leakage or unauthorised access.",
        bestPractice: {
          description:
            "A robust data segregation strategy within Dataverse is crucial for large or complex organisations. It ensures that users only see the data relevant to their roles and responsibilities, supporting compliance (e.g., GDPR, HIPAA) and minimising security risks. This model should be regularly reviewed and updated.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/wp-security-dataverse",
          linkText: "Dataverse Security White Paper",
          suggestedActions: [
            "Design and document a Business Unit structure that aligns with organisational data ownership and access needs.",
            "Create granular security roles that enforce the principle of least privilege for data access.",
            "Utilise field-level security for sensitive attributes within tables.",
            "Consider hierarchy security for scenarios requiring managerial oversight of subordinates' data.",
          ],
        },
      },
      {
        id: "sec-q8",
        text: "Is the implemented data segregation model regularly audited for effectiveness and compliance, and is this model (including Business Unit structure and key security role designs) clearly documented and maintained?",
        type: "boolean",
        weight: 3,
        category: "Data Governance & Segregation",
        guidance:
          "Check for evidence of periodic audits (e.g., annually) of the data segregation controls. This includes verifying that security roles and Business Unit assignments correctly enforce the intended access restrictions. Comprehensive documentation should detail the segregation logic, BU structure, and how key security roles are configured.",
        bestPractice: {
          description:
            "Regular audits and comprehensive documentation of the data segregation model are essential for ongoing governance. Audits verify that controls remain effective, while documentation aids in understanding, maintaining, and evolving the model as business needs change.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges",
          linkText: "Understand Security Roles and Privileges",
          suggestedActions: [
            "Establish a schedule for auditing the data segregation model (e.g., annually or bi-annually).",
            "Perform test scenarios to validate that security roles and Business Units restrict access as intended.",
            "Keep documentation of the Business Unit structure, security role matrix, and field-level security configurations up-to-date.",
            "Review audit logs for any unauthorised access attempts or unusual data access patterns.",
          ],
        },
      },
      {
        id: "sec-q9",
        text: "Is there a formal security review process for custom connectors to prevent credential leakage and ensure secure coding practices?",
        type: "boolean",
        weight: 4,
        category: "Integration Security",
        guidance:
          "Custom connectors can be a major security risk if not properly governed. Check for a mandatory code review process that looks for hardcoded credentials, insecure handling of API keys, and adherence to OAuth 2.0 standards over basic authentication.",
        bestPractice: {
          description:
            "All custom connectors must undergo a rigorous security review before being deployed to production. This process should enforce the use of secure authentication methods like OAuth 2.0 and mandate that all secrets are stored in Azure Key Vault, not in the connector definition.",
          link: "https://learn.microsoft.com/en-us/connectors/custom-connectors/security",
          linkText: "Custom connector security",
          suggestedActions: [
            "Mandate a security code review for all new or updated custom connectors.",
            "Prohibit the use of hardcoded credentials or API keys within connector definitions.",
            "Enforce the use of Azure Key Vault for all secrets and credentials used by connectors.",
            "Prioritize OAuth 2.0 authentication for all custom connectors where possible.",
          ],
        },
      },
    ],
  },
  {
    slug: "licensing-cost-management",
    name: "Licensing & Cost Management",
    weight: 10,
    description: "Evaluation of the Power Platform licensing strategy, allocation, monitoring, and cost optimisation.",
    questions: [
      {
        id: "lic-q1",
        text: "Is there a documented Power Platform licensing strategy that aligns with business needs and forecasted usage?",
        type: "boolean",
        weight: 4,
        category: "Strategy & Governance",
        guidance:
          "Look for a strategy that defines when to use M365 seeded licences vs. premium licences (per-user, per-app), and how pay-as-you-go fits in. It should be owned by the CoE or a dedicated IT asset manager.",
        bestPractice: {
          description:
            "A clear licensing strategy is essential for managing costs and ensuring users have the right capabilities. It prevents both over-provisioning and compliance issues, enabling sustainable growth.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus",
          linkText: "Review Power Platform licensing and billing",
        },
      },
      {
        id: "lic-q2",
        text: "Is there a defined and communicated process for users to request premium licences?",
        type: "boolean",
        weight: 3,
        category: "Process & Allocation",
        guidance:
          "A formal request and approval process helps control costs and ensures premium licences are allocated to valid, high-value use cases. Check for a request form, approval workflow, and clear criteria.",
      },
      {
        id: "lic-q3",
        text: "How effectively is licence consumption monitored against purchased capacity (e.g., Dataverse capacity, API calls, premium licences)?",
        type: "scale",
        options: ["1 (Not Monitored)", "2", "3", "4", "5 (Actively Monitored & Optimised)"],
        weight: 4,
        category: "Monitoring & Optimisation",
        guidance:
          "Check for regular reviews of the capacity reports in the Power Platform Admin Centre and tenant-level licence reports in the Microsoft 365 admin centre. Proactive monitoring prevents service disruptions and unexpected costs.",
        bestPractice: {
          description:
            "Actively monitoring licence and capacity consumption allows for proactive optimisation, cost savings, and accurate forecasting. The Power Platform Admin Centre, Microsoft 365 admin centre, and CoE Starter Kit are key tools for this.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage",
          linkText: "Learn about managing Dataverse capacity",
        },
      },
      {
        id: "lic-q4",
        text: "Is the organisation utilising or planning to utilise pay-as-you-go (PAYG) billing for Power Platform to handle variable usage or specific scenarios?",
        type: "boolean",
        weight: 3,
        category: "Strategy & Optimisation",
        guidance:
          "PAYG can be a cost-effective way to license users with infrequent premium access or to cover overages. Assess if this model has been evaluated against traditional per-user licences.",
        bestPractice: {
          description:
            "Pay-as-you-go provides flexibility and can be a cost-effective alternative to pre-purchased licences for certain usage patterns. A mature strategy evaluates PAYG as part of the overall licensing mix.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/pay-as-you-go-overview",
          linkText: "Overview of Pay-as-you-go billing",
        },
      },
      {
        id: "lic-q5",
        text: "Is there a strategy for managing and monitoring AI Builder service credits consumption?",
        type: "boolean",
        weight: 2,
        category: "AI & Automation",
        guidance:
          "AI Builder usage consumes service credits. Check if there's a process to monitor credit consumption, allocate credits to environments/users, and request additional credits if needed. This is part of cost management for AI solutions.",
        bestPractice: {
          description:
            "Effective management of AI Builder credits ensures that AI capabilities are available when needed and costs are controlled. Monitor consumption via the Power Platform Admin Centre and consider allocating credits strategically.",
          link: "https://learn.microsoft.com/en-us/ai-builder/administer-licensing",
          linkText: "AI Builder licensing and credit management",
        },
      },
      {
        id: "lic-q6",
        text: "Is there a regular audit process to detect and remediate licensing compliance risks (e.g., premium connector misuse, per-app violations, guest access)?",
        type: "boolean",
        weight: 4,
        category: "Compliance & Auditing",
        guidance:
          "Licensing violations can lead to significant unexpected costs. Check for a proactive process, potentially using PowerShell scripts or CoE Starter Kit tools, to audit for common issues like apps with standard licenses using premium connectors, or users with per-app licenses accessing multiple apps.",
        bestPractice: {
          description:
            "A proactive, automated licensing audit is crucial for avoiding large, unbudgeted costs and ensuring compliance. This process should be run regularly (e.g., monthly) to identify and address violations before they become a major financial risk.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/power-bi-licensing",
          linkText: "CoE Power BI - Licensing",
          suggestedActions: [
            "Develop and schedule a monthly PowerShell script to audit for common licensing violations.",
            "Use the CoE Starter Kit's licensing dashboards to visualize potential compliance issues.",
            "Establish a clear process for remediating identified violations, including user communication and license reallocation.",
            "Educate makers on licensing rules to prevent violations from occurring.",
          ],
        },
      },
    ],
  },
  {
    slug: "management-coe",
    name: "Management, CoE & Adoption Maturity",
    weight: 25,
    description:
      "Assessment of platform management practices, CoE structure, functions, adoption maturity, operational excellence, and alignment with the Well-Architected Framework.",
    questions: [
      {
        id: "coe-q1",
        text: "Is a Power Platform Centre of Excellence (CoE) formally established with a clear vision, defined metrics, and strategic goals aligned with business outcomes?",
        type: "boolean",
        weight: 4,
        category: "CoE Strategy & Foundation",
        guidance:
          "A formal CoE starts with a clear 'why'. Evaluate the CoE's maturity: from ungoverned citizen development to automated governance with AI-driven recommendations and enterprise-scale automation. Assess if the CoE has a documented vision, measurable metrics (KPIs like active maker counts, solution success rates, governance compliance %), and strategic goals aligned with business outcomes. Use evidence notes to document its current state, operational effectiveness, vision, goals, and key metrics. The CoE Starter Kit Core Components can help inventory assets to inform this strategy.",
        bestPractice: {
          description:
            "Establishing a CoE begins with defining a clear vision, metrics, and goals. This strategic alignment ensures the CoE's efforts are focused on delivering tangible business value and driving operational excellence. Make use of the CoE Starter Kit for foundational inventory and scanning.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit",
          linkText: "Explore the CoE Starter Kit",
          suggestedActions: [
            "If no CoE exists, create a business case outlining its value and alignment with strategic business objectives.",
            "Define and document the CoE's vision, mission, strategic goals, and target maturity level.",
            "Identify and track key performance indicators (KPIs) to measure CoE success and platform impact (e.g., maker growth, solution deployment times, technical debt reduction).",
            "Outline and communicate recommendations for improving the CoE's function, automation capabilities, and alignment with business outcomes.",
            "Leverage the CoE Starter Kit for comprehensive platform inventory, risk assessment, and adoption tracking.",
          ],
        },
      },
      {
        id: "coe-q2",
        text: "Is there a dedicated CoE core team with clearly defined roles and responsibilities (e.g., Admin, Governance Lead, Training Lead, Champions Lead)?",
        type: "boolean",
        weight: 4,
        category: "CoE Team & Roles",
        guidance:
          "A CoE needs dedicated individuals. Check for a defined team structure and if responsibilities for key CoE functions are assigned, including specific Power Platform Service Administrator roles. Refer to Microsoft's guidance on forming a core team and assigning admin roles.",
        bestPractice: {
          description:
            "A successful CoE requires a dedicated core team with well-defined roles and responsibilities, including clearly assigned Power Platform Service Administrators who manage tenant-level settings and delegate environment administration. This ensures accountability and focused effort on key areas like administration, governance, training, and community nurturing.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/admin-documentation",
          linkText: "Learn about Power Platform administration",
        },
      },
      {
        id: "coe-q3",
        text: "Has the CoE established clear governance standards and policies for the Power Platform (e.g., environment strategy, DLP, licensing, ALM, security configurations)?",
        type: "boolean",
        weight: 5,
        category: "CoE Governance",
        guidance:
          "Look for documented governance policies covering key aspects of platform management (environment strategy, DLP, licensing, ALM, security configurations, data governance, AI governance). Assess the comprehensiveness and enforcement of these policies. The CoE Starter Kit Governance Components can assist in risk assessment and policy enforcement. Note any identified gaps in policy coverage or enforcement mechanisms.",
        bestPractice: {
          description:
            "Robust governance and standards are critical for maintaining a secure, compliant, and well-managed Power Platform. The CoE is responsible for defining, documenting, and enforcing these policies, supported by tools like the CoE Starter Kit Governance Components.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/govern",
          linkText: "CoE Governance Components",
        },
      },
      {
        id: "coe-q4",
        text: "Does the CoE provide comprehensive training, support, and resources (e.g., documentation, templates, best practice guides) to empower makers and users?",
        type: "boolean",
        weight: 3,
        category: "CoE Training & Support",
        guidance:
          "Assess the availability and quality of training materials, support channels (helpdesk, community forums), and resources designed to help users effectively and safely use the Power Platform. The CoE Starter Kit Nurture Components can support community building.",
        bestPractice: {
          description:
            "Providing adequate training, support, and readily accessible resources is essential for nurturing maker skills, driving adoption, and ensuring users can make use of the platform effectively and securely. Utilise CoE Starter Kit Nurture Components to build the maker community.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/nurture",
          linkText: "CoE Nurture Components",
        },
      },
      {
        id: "coe-q5",
        text: "Does the CoE actively foster innovation, encourage a culture of continuous improvement, and facilitate knowledge sharing within the Power Platform community?",
        type: "boolean",
        weight: 3,
        category: "CoE Innovation & Community",
        guidance:
          "Look for initiatives like hackathons, showcases, champion programmes, regular community calls, and mechanisms for sharing successes and lessons learned. The CoE Starter Kit Innovation Backlog can track feature requests.",
        bestPractice: {
          description:
            "A thriving CoE fosters a culture of innovation and continuous improvement. This involves actively engaging the maker community, promoting knowledge sharing, and celebrating successes to inspire further development. The Innovation Backlog component of the CoE Starter Kit can help manage ideas.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/innovation-backlog",
          linkText: "CoE Innovation Backlog",
        },
      },
      {
        id: "coe-q6",
        text: "Does the CoE regularly measure and communicate its success and the business value delivered by the Power Platform (e.g., through dashboards, reports, newsletters)?",
        type: "boolean",
        weight: 3,
        category: "CoE Measurement & Communication",
        guidance:
          "Check if the CoE tracks key metrics (adoption rates, solutions built, ROI) and communicates these achievements to stakeholders to demonstrate impact and secure ongoing support. The CoE Starter Kit Audit Log Components and Power BI reports provide advanced analytics.",
        bestPractice: {
          description:
            "Measuring and effectively communicating the success and business value generated by the Power Platform is crucial for demonstrating the CoE's impact and securing continued investment and stakeholder buy-in. Make use of CoE Starter Kit analytics.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/setup-audit-log",
          linkText: "CoE Audit Log Components",
        },
      },
      {
        id: "coe-q7",
        text: "How would you rate the organisation's alignment with the Power Platform Well-Architected Framework pillars (Reliability, Security, Operational Excellence, Performance Efficiency, Experience Optimisation)? (Scale 1-5)",
        type: "scale",
        weight: 4,
        category: "Architectural Best Practices",
        options: ["1 (No Alignment)", "2 (Minimal)", "3 (Partial)", "4 (Good)", "5 (Strong Alignment)"],
        guidance:
          "Consider if solutions are designed with these pillars in mind. The framework provides assessment questionnaires. This is a holistic view of architectural maturity.",
        bestPractice: {
          description:
            "Adhering to the Power Platform Well-Architected Framework ensures solutions are robust, secure, efficient, and provide a good user experience. Regularly assess against its pillars.",
          link: "https://learn.microsoft.com/en-us/power-platform/well-architected/overview",
          linkText: "Power Platform Well-Architected Framework",
        },
      },
      {
        id: "coe-q8",
        text: "How would you rate the organisation's maturity across the Power Platform Adoption Maturity Model dimensions (e.g., Strategy, Business Value, Security, Governance, Support, Community, Responsible AI, Automation, Fusion Teams)? (Scale 1-5, average across dimensions)",
        type: "scale",
        weight: 4,
        category: "Adoption Maturity",
        options: ["1 (Initial)", "2 (Emerging)", "3 (Defined)", "4 (Managed)", "5 (Efficient)"],
        guidance:
          "This model evaluates maturity across nine dimensions. Assess each dimension and provide an overall average or note key areas of strength/weakness. This helps identify targeted improvement opportunities. Pay particular attention to the 'Responsible AI' dimension.",
        bestPractice: {
          description:
            "The Power Platform Adoption Maturity Model provides a structured approach to assess and improve organisational maturity. Aim to progress through the stages (Initial to Efficient) across all relevant dimensions, including a strong focus on 'Responsible AI'.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/maturity-model-overview",
          linkText: "Power Platform Adoption Maturity Model",
        },
      },
      {
        id: "coe-q9",
        text: "Are administrative tasks (e.g., environment creation, DLP policy updates, licence assignment reviews) automated where possible using Power Platform tools or scripts (PowerShell, Management APIs)?",
        type: "boolean",
        weight: 3,
        category: "CoE Operations & Automation",
        guidance:
          "Look for strategic use of Power Automate flows, PowerShell cmdlets (e.g., for Power Platform Administrators module), Management APIs, or CoE Starter Kit automation flows to streamline routine and complex administrative tasks like bulk environment provisioning, licence optimisation workflows, automated DLP policy deployment, and compliance monitoring.",
        bestPractice: {
          description:
            "Automating routine and complex administrative tasks using PowerShell, Management APIs, and other platform tools frees up admin time for more strategic work, reduces errors, ensures consistent policy application, and enables proactive compliance monitoring.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/powershell-for-power-platform-administrators",
          linkText: "Explore PowerShell for Power Platform Admins",
        },
      },
      {
        id: "coe-q10",
        text: "Is there a defined governance framework for the development and deployment of AI solutions (AI Builder models, Power Virtual Agents, Copilots)?",
        type: "boolean",
        weight: 4,
        category: "AI & Automation Governance",
        guidance:
          "Consider policies for data usage in AI, ethical reviews, model lifecycle management, who can create/deploy AI solutions, and monitoring of AI model performance and usage. This is crucial for Responsible AI.",
        bestPractice: {
          description:
            "A specific governance framework for AI solutions ensures they are developed responsibly, ethically, and securely. This includes data governance, model validation, lifecycle management, and clear accountability.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/responsible-ai/overview",
          linkText: "Overview of Responsible AI in Power Platform",
        },
      },
      {
        id: "coe-q11",
        text: "Are Power Virtual Agents (PVA) bots governed with clear ownership, topic management processes, and integration strategies?",
        type: "boolean",
        weight: 3,
        category: "AI & Automation Governance",
        guidance:
          "Assess if there's a strategy for PVA, including who can create bots, how topics are managed and updated, version control, security for sensitive information handled by bots, and how they integrate with other systems and human handoff.",
        bestPractice: {
          description:
            "Effective governance for Power Virtual Agents includes defined ownership, standardised topic development and management, version control, security protocols, and a clear strategy for integration and escalation.",
          link: "https://learn.microsoft.com/en-us/power-virtual-agents/governance-overview",
          linkText: "Power Virtual Agents Governance",
        },
      },
      {
        id: "coe-q12",
        text: "Is there a defined strategy and governance model for the rollout and usage of Microsoft Copilots (e.g., Copilot Studio, Copilots in Power Platform, Microsoft 365 Copilot) within the organisation?",
        type: "boolean",
        weight: 4,
        category: "AI & Automation Governance",
        guidance:
          "Assess if there's a clear plan for adopting Copilots, including identifying use cases, data security and privacy considerations (especially with organisational data), user training, licensing, and customisation strategies (e.g., using Copilot Studio).",
        bestPractice: {
          description:
            "A proactive strategy for Copilot adoption ensures that these powerful AI assistants are used effectively and responsibly, maximising value while mitigating risks. This includes clear guidelines on data handling, customisation, and ongoing monitoring of usage and impact.",
          link: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-get-started",
          linkText: "Learn about Copilot Studio",
        },
      },
      {
        id: "coe-q13",
        text: "Are Responsible AI principles (e.g., fairness, reliability & safety, privacy & security, inclusiveness, transparency, accountability) actively operationalised in the development and deployment of AI solutions?",
        type: "boolean",
        weight: 4,
        category: "Responsible AI Implementation",
        guidance:
          "Beyond having policies, check for practical implementation: Are there ethical review boards or processes? Are AI impact assessments conducted? Is there monitoring for bias or unintended outcomes? Are transparency mechanisms in place for users interacting with AI?",
        bestPractice: {
          description:
            "Operationalising Responsible AI principles involves embedding them into the entire AI lifecycle, from design and development to deployment and monitoring. This requires concrete processes, tools, and a culture of ethical AI development.",
          link: "https://learn.microsoft.com/en-us/azure/ai-services/responsible-ai",
          linkText: "Microsoft's Responsible AI Standard",
        },
      },
      {
        id: "coe-q14",
        text: "Does the organisation have a formal process for managing Power Platform release waves and mandatory updates, including early access testing, feature control, staged rollouts, and impact assessments?",
        type: "boolean",
        weight: 3,
        category: "CoE Operations & Change Management",
        guidance:
          "Look for evidence of participation in early access programmes, proactive use of feature control switches at the environment level (where available), defined staged rollout strategies for significant updates, and documented impact assessment processes. This ensures smooth adoption of new features and mitigates risks.",
        bestPractice: {
          description:
            "Proactively managing Power Platform release waves, including rigorous testing of new features in non-production environments via early access and communicating changes effectively, is crucial for minimising disruption and maximising the benefits of platform updates.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/release-waves-overview",
          linkText: "Managing release waves",
        },
      },
      {
        id: "coe-q15",
        text: "Is the organisation leveraging Power Platform Managed Environments to apply enhanced governance controls (e.g., solution checker enforcement, sharing limits, usage insights, maker onboarding)?",
        type: "boolean",
        weight: 4,
        category: "CoE Governance & Control",
        guidance:
          "Managed Environments offer premium governance capabilities. Assess if they are activated for relevant environments (especially production or those with critical apps) and if their features (like solution checker enforcement, sharing limits, usage insights, maker onboarding/welcome content, data policies) are being utilised to enforce stricter policies, gain better visibility, and reduce orphaned solutions.",
        bestPractice: {
          description:
            "Utilising Managed Environments provides administrators with greater control, visibility, and insights, enabling proactive governance, streamlined maker onboarding, and risk mitigation for critical Power Platform assets.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/managed-environments-overview",
          linkText: "Managed Environments Overview",
        },
      },
      {
        id: "coe-q16",
        text: "Is there a strategy for tenant isolation or managing multi-tenant Power Platform deployments, considering regional compliance and data residency requirements?",
        type: "boolean",
        weight: 3,
        category: "CoE Strategy & Architecture",
        guidance:
          "For organisations with multiple tenants or specific needs for data isolation (e.g., due to mergers, divestitures, or strict regulatory requirements), assess if a strategy exists for managing these scenarios, including considerations for cross-tenant collaboration, data residency, and regional compliance.",
        bestPractice: {
          description:
            "A clear strategy for tenant isolation or multi-tenant management, aligned with regional compliance and data residency needs, is essential for complex organisational structures to maintain security and meet regulatory obligations.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/multiple-online-environments-tenants",
          linkText: "Managing multiple environments and tenants",
        },
      },
      {
        id: "coe-q17",
        text: "Is there a defined strategy and process for performance optimisation and scaling of critical Power Platform solutions?",
        type: "boolean",
        weight: 3,
        category: "Operational Excellence",
        guidance:
          "Assess if there are processes for performance testing, identifying bottlenecks (e.g., delegation warnings, API throttling), optimising apps/flows (e.g., efficient Dataverse queries, flow design), and planning for capacity/scalability of widely adopted solutions.",
        bestPractice: {
          description:
            "A proactive approach to performance optimisation and scalability, including regular performance testing and adherence to design best practices, ensures critical Power Platform solutions remain responsive and reliable as usage grows.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/well-architected/performance-efficiency/overview",
          linkText: "Well-Architected: Performance Efficiency",
          suggestedActions: [
            "Mandate performance testing for any app expected to have more than 100 concurrent users.",
            "Implement automated alerts for flows that consistently exceed duration thresholds or hit API throttling limits.",
            "Conduct quarterly capacity planning reviews for Dataverse storage and API call quotas.",
            "Enforce data retention and archival policies to manage Dataverse storage growth.",
          ],
        },
      },
      {
        id: "coe-q18",
        text: "Is there a proactive process to identify, document, and prioritise opportunities for automating governance reporting and monitoring tasks (e.g., generating reports on unused apps, licence assignments, security role changes)?",
        type: "boolean",
        weight: 3,
        category: "CoE Operations & Automation",
        guidance:
          "Evaluate if the CoE or admin team actively seeks to automate manual reporting and monitoring tasks (e.g., generating reports on unused apps, licence assignments, security role changes, DLP violations, environment sprawl). Look for documented requirements for potential automation, including data sources, triggers, desired outcomes, and ROI calculations. Use the evidence notes to list identified opportunities, their priority, and outline technical prerequisites or existing automation solutions (e.g., using Power Automate, PowerShell with Graph API, CoE Starter Kit flows).",
        bestPractice: {
          description:
            "Mature governance includes automating the collection and presentation of key metrics. This reduces manual effort, provides near real-time insights, and allows the CoE to focus on strategic improvements rather than manual data gathering.",
          link: "https://learn.microsoft.com/en-us/power-automate/getting-started",
          linkText: "Get started with Power Automate",
          suggestedActions: [
            "Workshop with the CoE/admin team to identify the most time-consuming manual reporting and monitoring tasks.",
            "For the top 3-5 opportunities, document detailed requirements (data sources, logic, output format, triggers, expected ROI).",
            "Develop a proof-of-concept (PoC) for one high-value automation using Power Automate, Logic Apps, or PowerShell scripts integrated with Power BI for visualisation.",
            "Create a backlog of governance automation tasks, prioritised by impact and feasibility, to be addressed quarterly.",
            "Explore CoE Starter Kit automation capabilities for common governance tasks.",
            "Integrate automated reporting with ticketing systems or notification channels for proactive alerting.",
          ],
        },
      },
      {
        id: "coe-q19",
        text: "Is there a systematic process to identify, quantify (e.g., using a technical debt register, SQALE method, or impact on Secure/Compliance Scores), and manage technical debt across the Power Platform (e.g., legacy solutions, complex customisations, orphaned assets, unsupported components)? Upload relevant documentation or analysis.",
        type: "document-review",
        weight: 4,
        category: "Operational Excellence & Technical Debt",
        guidance:
          "Evaluate if a formal process exists for cataloguing technical debt, including outdated software versions, unsupported customisations (e.g., CDS connectors), dependencies on legacy systems (e.g., SharePoint lists), and orphaned solutions. Assess if impact is measured through maintenance costs, security vulnerabilities, or operational inefficiencies.",
        bestPractice: {
          description:
            "A mature organisation proactively identifies, quantifies, and manages technical debt. This involves maintaining a technical debt register, regularly assessing its impact on security, compliance, cost, and agility, and implementing a strategic plan for remediation or mitigation. This aligns with principles of operational excellence and sustainable platform growth.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/well-architected/operational-excellence/overview",
          linkText: "Learn about Operational Excellence",
          suggestedActions: [
            "Establish a formal process for identifying and cataloguing technical debt across all Power Platform solutions and components.",
            "Develop a technical debt register, including details like age, complexity, dependencies, business impact, and estimated remediation effort.",
            "Prioritise technical debt items based on risk and business impact.",
            "Develop and implement a remediation plan, including strategies for refactoring, retiring, or replacing indebted solutions.",
            "Integrate technical debt review into the solution lifecycle management process.",
          ],
        },
      },
      {
        id: "coe-q20",
        text: "Is there a formal process for analysing custom-developed solutions against native Power Platform capabilities to identify modernisation opportunities (e.g., replacing custom code with standard features, evaluating TCO)? Upload relevant analysis or strategy documents.",
        type: "document-review",
        weight: 3,
        category: "Modernisation & Optimisation",
        guidance:
          "Assess if the CoE or relevant teams systematically review existing or proposed custom solutions (including complex scripts, custom components, or extensive code-first developments) against the evolving capabilities of the Power Platform. This analysis should consider factors like Total Cost of Ownership (TCO), maintainability, scalability, and security.",
        bestPractice: {
          description:
            "A mature CoE proactively evaluates custom solutions against native Power Platform capabilities to identify opportunities for modernisation. This reduces technical debt, lowers TCO, improves maintainability, and leverages the ongoing innovation of the platform. This process should be integrated into solution design reviews and periodic portfolio assessments.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/strategy",
          linkText: "Power Platform Adoption Strategy",
          suggestedActions: [
            "Establish a regular review process (e.g., annually or bi-annually) to assess existing custom solutions against current Power Platform features.",
            "Develop criteria for evaluating when to modernise a custom solution, including TCO, maintenance effort, and security risks.",
            "For new solutions, mandate an analysis of native Power Platform capabilities before approving custom development.",
            "Create a backlog of identified modernisation opportunities, prioritised by potential ROI and risk reduction.",
          ],
        },
      },
      {
        id: "coe-q21",
        text: "Is there a defined Business Continuity and Disaster Recovery (BCDR) plan specifically for critical Power Platform solutions?",
        type: "boolean",
        weight: 4,
        category: "Business Continuity",
        guidance:
          "Check for a documented BCDR plan that covers critical Power Platform assets. This should include backup strategies for apps and flows, Dataverse recovery procedures, dependency mapping, and defined Recovery Time Objectives (RTOs) and Recovery Point Objectives (RPOs).",
        bestPractice: {
          description:
            "A comprehensive BCDR plan is essential for ensuring that critical business processes supported by Power Platform can be restored in the event of a disaster. This plan must be documented, tested regularly, and include both technical recovery steps and business communication plans.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/backup-restore-environments",
          linkText: "Backup and restore environments",
          suggestedActions: [
            "Identify all business-critical applications and flows running on the Power Platform.",
            "Document the dependencies for each critical solution (e.g., data sources, APIs).",
            "Define and agree upon RTOs and RPOs for each critical solution.",
            "Establish and automate backup procedures for both Dataverse and non-Dataverse assets (apps, flows).",
            "Create and test a disaster recovery plan, including failover procedures and communication plans.",
          ],
        },
      },
      {
        id: "coe-q22",
        text: "Is there a formal process to discover, assess, and govern 'Shadow IT' solutions built on the Power Platform?",
        type: "boolean",
        weight: 3,
        category: "Shadow IT Governance",
        guidance:
          "Shadow IT (solutions built by business users without IT oversight) is common. Check for a proactive strategy to identify these solutions (e.g., using CoE Starter Kit tools), assess their risk, and either bring them into a governed model, support them, or retire them.",
        bestPractice: {
          description:
            "A mature governance model doesn't just block Shadow IT; it engages with it. The strategy should include regular discovery scans, a risk assessment framework, and a clear 'amnesty' program to help makers align their solutions with corporate governance and security standards.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/governance-components",
          linkText: "CoE Governance Components",
          suggestedActions: [
            "Use the CoE Starter Kit to regularly scan for new apps and flows, especially in the Default environment.",
            "Establish a risk assessment process for newly discovered solutions.",
            "Create a clear communication plan and process for engaging with citizen developers.",
            "Offer an 'amnesty' or support program to help makers bring their valuable solutions into a governed framework.",
          ],
        },
      },
    ],
  },
  {
    slug: "policy-governance-improvements",
    name: "Policy & Governance Improvements",
    weight: 10,
    description:
      "Identification of areas for policy and governance enhancements, including documentation and rulebooks.",
    questions: [
      {
        id: "gov-q1",
        text: "Is there a regular review cycle for all Power Platform governance policies, and is this process documented?",
        type: "boolean",
        weight: 4,
        category: "Governance Process",
        guidance:
          "Policies should be living documents, reviewed at least annually or when significant platform changes occur. This review should be informed by insights gathered from platform monitoring, Compliance Manager assessments, and Secure Score. Document the current review cycle, its inputs, and outputs. Identify any gaps in the review process itself.",
        bestPractice: {
          description:
            "Governance policies must be regularly reviewed and updated, informed by actionable insights from platform monitoring. This ensures policies remain relevant, effective, and aligned with business goals and security requirements.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/observability#governance-security-and-compliance",
          linkText: "Using insights for governance",
          suggestedActions: [
            "Create a comprehensive document containing practical and detailed policy and governance improvement suggestions, referencing specific frameworks (e.g., Zero Trust, CAF).",
            "Clearly link each suggestion to identified gaps, risks (quantified where possible, e.g., via Secure Score impact), or inefficiencies from this assessment.",
            "Write suggestions in a way that is easily understood and actionable by implementation teams, including estimated effort and potential risk reduction.",
            "Prioritise suggestions based on risk level, compliance impact (e.g., for GDPR, HIPAA), and implementation effort.",
            "Establish a formal, documented policy review cycle that incorporates inputs from platform monitoring, security assessments, and business strategy changes.",
          ],
        },
      },
      {
        id: "gov-q2",
        text: "Are naming conventions for apps, flows, environments, and other Power Platform components clearly documented and consistently enforced?",
        type: "boolean",
        weight: 3,
        category: "Governance Standards",
        guidance:
          "Look for a clear policy on naming conventions and evidence of its application, e.g., in the Power Platform Admin Centre or CoE toolkit. Consistent naming aids in monitoring and gaining insights into platform usage.",
      },
      {
        id: "gov-q3",
        text: "Upload and review the Power Platform governance rulebook or key policy documents. Note any issues, gaps, or areas for improvement in the annotations section.",
        type: "document-review",
        weight: 5,
        category: "Governance Document Review",
        guidance:
          "Collect and review all relevant policy documents. Use the annotation feature to note specific missing rules, unclear sections, or contradictions. Use the overall assessment text area to create a summary document outlining key areas for policy improvement.",
      },
      {
        id: "gov-q4",
        text: "Is there a formal, auditable process for approving deployments to production environments?",
        type: "boolean",
        weight: 4,
        category: "Compliance & Audit",
        guidance:
          "For compliance with regulations like SOX, a clear audit trail is essential. Check if there is a system (e.g., in Azure DevOps, ServiceNow) that records who requested, approved, and deployed changes to production, along with the justification.",
        bestPractice: {
          description:
            "All production deployments must go through a formal, tracked approval process. This ensures accountability, provides a clear audit trail for compliance, and helps prevent unauthorized changes. This process should be integrated into the ALM pipeline.",
          link: "https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals",
          linkText: "Approvals and checks in Azure Pipelines",
          suggestedActions: [
            "Integrate mandatory approval gates into your production deployment pipelines.",
            "Ensure that the approval history, including approver and justification, is retained for audit purposes (e.g., for 7 years).",
            "Define clear roles and responsibilities for who can request and approve production deployments.",
            "Track authorization for any required rollback procedures.",
          ],
        },
      },
    ],
  },
  {
    slug: "automation-alm",
    name: "Automation, ALM & Quality Assurance",
    weight: 15,
    description:
      "Assessment of automation needs, Application Lifecycle Management (ALM) practices, quality assurance, and advanced deployment strategies.",
    questions: [
      {
        id: "auto-q1",
        text: "Are there defined criteria for identifying and prioritising automation opportunities using Power Automate?",
        type: "boolean",
        weight: 2,
        category: "Automation Strategy",
        guidance:
          "Consider criteria like ROI, time savings, error reduction, and strategic alignment. Monitoring existing processes can help identify good candidates for automation.",
      },
      {
        id: "alm-q1",
        text: "Is the ALM Accelerator for Power Platform utilised for managing solution deployments between environments?",
        type: "boolean",
        weight: 4,
        category: "ALM & DevOps",
        guidance:
          "The ALM Accelerator provides a set of templates and tools to automate ALM processes using Azure DevOps or GitHub Actions. Check for its adoption for key solutions.",
        bestPractice: {
          description:
            "Implementing the ALM Accelerator streamlines and standardises solution deployment, improving reliability and reducing manual effort. It's a key component of mature ALM.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/alm-accelerator-components",
          linkText: "ALM Accelerator for Power Platform",
        },
      },
      {
        id: "alm-q2",
        text: "Are Power Platform Build Tools integrated into Azure DevOps or GitHub Actions for CI/CD pipelines?",
        type: "boolean",
        weight: 3,
        category: "ALM & DevOps",
        guidance:
          "These tools allow for automation of build, test, and deployment tasks within standard DevOps pipelines. Assess their usage for solution deployment health monitoring.",
        bestPractice: {
          description:
            "Power Platform Build Tools enable robust CI/CD pipelines, automating quality checks and deployments, and integrating Power Platform development with enterprise DevOps practices.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools",
          linkText: "Power Platform Build Tools",
        },
      },
      {
        id: "alm-q3",
        text: "Is automated application testing (e.g., using Test Studio, Test Engine, or third-party tools) implemented for critical Power Apps solutions?",
        type: "boolean",
        weight: 3,
        category: "Quality Assurance",
        guidance:
          "Automated testing, including UI testing for canvas apps and regression automation, is crucial for maintaining solution quality and enabling faster release cycles.",
        bestPractice: {
          description:
            "Automated testing ensures solution reliability and quality, reduces manual testing effort, and supports CI/CD integration. Test Studio and Test Engine are native Power Platform tools for this.",
          link: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/test-studio",
          linkText: "Overview of Test Studio",
        },
      },
      {
        id: "alm-q4",
        text: "Is Application Insights used for comprehensive monitoring and telemetry of custom Power Apps (canvas and model-driven) and Power Automate flows?",
        type: "boolean",
        weight: 3,
        category: "Monitoring & Observability",
        guidance:
          "Check if developers are instrumenting their solutions to send telemetry (performance, errors, usage patterns, custom business events) to Application Insights. This provides deeper visibility than standard platform logs and aids in proactive issue resolution, performance optimisation, and understanding user behaviour. Assess the coverage of Application Insights across critical applications and flows.",
        bestPractice: {
          description:
            "Integrating custom applications and flows with Application Insights enables rich telemetry collection, providing valuable data for performance monitoring, error diagnostics, and understanding user behaviour, which is key for operational excellence.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/app-insights",
          linkText: "Analyse model-driven apps and Microsoft Dataverse telemetry with Application Insights",
        },
      },
      {
        id: "alm-q5",
        text: "Are Power Platform Pipelines (the in-product ALM feature) being utilised for solution deployment and management?",
        type: "boolean",
        weight: 3,
        category: "ALM & DevOps",
        guidance:
          "Power Platform Pipelines provide a simplified, in-product experience for ALM, allowing makers and admins to set up deployment pipelines within the Power Platform. Assess its adoption for citizen-developer–led or simpler ALM scenarios, or as a complement to Azure DevOps–based ALM.",
        bestPractice: {
          description:
            "Power Platform Pipelines offer an accessible way to implement ALM for solutions, particularly suited for maker-driven initiatives or as an entry point to more structured deployment processes, promoting consistency and control.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/pipelines",
          linkText: "Overview of Power Platform Pipelines",
        },
      },
      {
        id: "alm-q6",
        text: "Is there a strategy for automating deployments across multiple tenants, if applicable (e.g., for ISVs or large enterprises with federated structures)?",
        type: "boolean",
        weight: 2,
        category: "Advanced ALM & Operations",
        guidance:
          "For scenarios requiring deployment to multiple Power Platform tenants (e.g., ISVs distributing solutions, or large enterprises with distinct tenants for subsidiaries), assess if there are automated processes or tools in place to manage these complex deployments.",
        bestPractice: {
          description:
            "Automating multi-tenant deployments requires robust scripting, configuration management, and often custom tooling or advanced use of DevOps practices to ensure consistency and efficiency across diverse environments.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/multi-tenant-alm",
          linkText: "Considerations for Multi-Tenant ALM",
        },
      },
      {
        id: "alm-q7",
        text: "Is a source-code-centric ALM approach adopted, where unpacked solution files are stored and versioned in a source control system (e.g., Git)?",
        type: "boolean",
        weight: 4,
        category: "Advanced ALM & DevOps",
        guidance:
          "Assess if solutions are unpacked (e.g., using Solution Packager) into a structured source code repository (e.g., Git). This enables detailed change tracking, code reviews, automated quality gates (e.g., solution checker integration in pipelines), and robust CI/CD processes, moving beyond storing solutions as opaque .zip files. Evaluate the consistency of this practice across development teams.",
        bestPractice: {
          description:
            "A source-code-centric approach is fundamental for mature ALM. It treats Power Platform solution components as code, enabling modern development practices like pull requests, versioning, and automated builds directly from source control.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/solution-api-alm",
          linkText: "Learn about Source Code-centric ALM",
        },
      },
      {
        id: "alm-q8",
        text: "Is a formal branching strategy (e.g., Git Flow, ALM Accelerator model) with enforced branch policies used for Power Platform development?",
        type: "boolean",
        weight: 3,
        category: "Advanced ALM & DevOps",
        guidance:
          "Check for a documented branching strategy and the use of branch policies (e.g., requiring pull requests, minimum approvers, build validation) in your Git repository to ensure code quality and controlled merges.",
        bestPractice: {
          description:
            "A disciplined branching strategy, supported by automated branch policies, is crucial for managing parallel development, ensuring code quality through reviews, and maintaining a stable production branch. This is a cornerstone of enterprise-grade source control.",
          link: "https://learn.microsoft.com/en-us/power-platform/guidance/coe/alm-accelerator-components-setup-branching-merging",
          linkText: "ALM Accelerator Branching Strategy",
        },
      },
      {
        id: "alm-q9",
        text: "Is the Configuration Migration Tool used within automated pipelines to deploy reference and configuration data between environments?",
        type: "boolean",
        weight: 3,
        category: "Advanced ALM & DevOps",
        guidance:
          "Assess if the deployment of configuration data (e.g., settings, reference lists) is automated using the Configuration Migration Tool as part of the CI/CD pipeline, rather than being a manual post-deployment step.",
        bestPractice: {
          description:
            "Automating the deployment of configuration data alongside solution deployment ensures consistency across environments, reduces manual errors, and makes the entire release process more reliable and repeatable.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools#configuration-migration-tool",
          linkText: "Using the Configuration Migration Tool in Pipelines",
        },
      },
      {
        id: "alm-q10",
        text: "Is there a defined ALM process for custom components (PCF controls, component libraries), including versioning, automated packaging, and dependency management?",
        type: "boolean",
        weight: 2,
        category: "Advanced ALM & DevOps",
        guidance:
          "Review the process for developing and deploying reusable components. Mature processes include semantic versioning, automated builds, and a strategy for deploying them in a separate, managed solution.",
        bestPractice: {
          description:
            "Treating custom components as first-class citizens with their own ALM process ensures they are reliable, reusable, and don't introduce breaking changes unexpectedly. This includes versioning, automated testing, and solution segmentation.",
          link: "https://learn.microsoft.com/en-us/power-apps/developer/component-framework/implement-alm-pcf",
          linkText: "ALM for PCF Controls",
        },
      },
      {
        id: "alm-q11",
        text: "Are deployment settings files and environment-specific variables used in pipelines to manage connection references and environment variables automatically?",
        type: "boolean",
        weight: 4,
        category: "Advanced ALM & DevOps",
        guidance:
          "Check if deployment pipelines use settings files (e.g., deployment-settings.json) to automatically map connection references and set environment variable values for the target environment, eliminating manual configuration post-deployment.",
        bestPractice: {
          description:
            "Automating the configuration of connection references and environment variables via deployment settings files is critical for true end-to-end CI/CD. It removes manual steps, reduces errors, and ensures environment independence.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/conn-ref-env-variables-pipelines",
          linkText: "Manage Connection References in Pipelines",
        },
      },
      {
        id: "alm-q12",
        text: "Is certificate-based authentication with automated secret rotation used for service principals in deployment pipelines?",
        type: "boolean",
        weight: 3,
        category: "ALM Security",
        guidance:
          "Assess the security of your CI/CD pipelines. The most secure method uses service principals with certificate-based credentials stored in a key vault, coupled with an automated process to rotate these certificates regularly.",
        bestPractice: {
          description:
            "Moving from client secrets to certificate-based authentication for service principals significantly enhances security. Automating the rotation of these certificates ensures long-term security of your ALM processes and aligns with modern DevOps security standards.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/powershell-create-sp-certs",
          linkText: "Service Principal with Certificate Authentication",
        },
      },
      {
        id: "alm-q13",
        text: "Are reusable, template-based YAML pipelines used to standardise build and deployment processes across the platform?",
        type: "boolean",
        weight: 3,
        category: "ALM Architecture",
        guidance:
          "Look for a 'pipelines-as-code' approach where YAML templates define reusable steps (e.g., build, pack, deploy, run tests). This ensures consistency, maintainability, and scalability of your CI/CD infrastructure.",
        bestPractice: {
          description:
            "A template-based YAML pipeline architecture promotes consistency and reusability ('Don't Repeat Yourself'). It allows for easier maintenance and governance of pipelines, ensuring all solutions follow a standardised, high-quality deployment process.",
          link: "https://learn.microsoft.com/en-us/azure/devops/pipelines/process/templates",
          linkText: "About YAML Pipeline Templates",
        },
      },
      {
        id: "alm-q14",
        text: "Is there a defined solution layering and segmentation strategy to manage dependencies and avoid monolithic solutions?",
        type: "boolean",
        weight: 4,
        category: "ALM Architecture",
        guidance:
          "Check for a strategy that breaks down functionality into logical, layered solutions (e.g., a base layer for data model, a departmental layer, an app-specific layer). This prevents large, unmanageable solutions and simplifies dependency management.",
        bestPractice: {
          description:
            "A robust solution segmentation strategy is key to scalable, enterprise-grade ALM. It involves creating smaller, layered, and managed solutions with clear dependencies, which simplifies updates, reduces deployment risks, and improves maintainability.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm#solution-layering",
          linkText: "Solution Layering",
          suggestedActions: [
            "Define and document a solution segmentation strategy (e.g., Base -> Department -> Application).",
            "Enforce the use of publisher prefixes to identify ownership and prevent conflicts.",
            "Mandate that all production-bound solutions are managed.",
            "Use solution upgrade mechanisms instead of updates for better control.",
          ],
        },
      },
    ],
  },
  {
    slug: "advanced-alm-devops",
    name: "Advanced ALM & DevOps",
    weight: 20,
    description:
      "Deep dive into Application Lifecycle Management, DevOps integration, solution architecture, and source control maturity.",
    questions: [
      {
        id: "alm-adv-q1",
        text: "Are unmanaged solutions deployed to production environments?",
        type: "boolean",
        weight: 5,
        category: "Solution Management",
        guidance:
          "Deploying unmanaged solutions to production makes rollbacks nearly impossible, creates solution layering conflicts, and breaks the chain of custody for changes. It is a primary indicator of low ALM maturity.",
        bestPractice: {
          description:
            "Production environments must exclusively contain managed solutions. All changes should be deployed via a managed solution upgrade, ensuring a clean, versioned, and rollback-capable state. This is a non-negotiable principle for enterprise-grade ALM.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm#managed-solutions",
          linkText: "Understand Managed Solutions",
          suggestedActions: [
            "Implement a policy immediately prohibiting unmanaged solutions in production.",
            "Begin a remediation project to convert all existing unmanaged solutions in production to managed.",
            "Configure deployment pipelines to block unmanaged solution imports into production environments.",
          ],
        },
        discovery: [
          "**Navigate to Power Apps:** Go to `make.powerapps.com` and select the production environment.",
          "**Check Solutions:** In the left navigation, click on 'Solutions'.",
          "**Filter for Unmanaged:** Add a filter to the 'Managed' column to show only 'Unmanaged' solutions. Any result here is a critical finding.",
        ],
      },
      {
        id: "alm-adv-q2",
        text: "Are all production-bound solutions stored and versioned in a source control system like Git?",
        type: "boolean",
        weight: 5,
        category: "Source Control",
        guidance:
          "Without source control, there is no single source of truth for your application's code. This leads to lost intellectual property when developers leave, no audit trail for changes, and an inability to collaborate effectively.",
        bestPractice: {
          description:
            "All Power Platform solutions must be unpacked and checked into a source control repository (e.g., Git) before they can be considered for production deployment. This enables versioning, peer reviews via pull requests, and automated builds.",
          link: "https://learn.microsoft.com/en-us/power-platform/alm/solution-api-alm",
          linkText: "Source Code-centric ALM",
          suggestedActions: [
            "Mandate Git integration for all new production-bound solutions.",
            "Establish a standardized repository structure for Power Platform solutions.",
            "Integrate `SolutionPackager` or `pac solution unpack` into your development workflow to decompose solution files.",
          ],
        },
      },
      {
        id: "alm-adv-q3",
        text: "Are branch protection policies (e.g., mandatory pull requests, status checks) enforced in your source control repository?",
        type: "boolean",
        weight: 4,
        category: "Source Control",
        guidance:
          "Without branch protection, developers can push untested or unreviewed code directly into the main branch, bypassing quality gates and introducing defects into the deployment pipeline.",
        bestPractice: {
          description:
            "The main branch must be protected. All changes must come through pull requests that require at least one peer review and a successful build validation (including solution checks) before merging.",
          link: "https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies",
          linkText: "About branch policies",
          suggestedActions: [
            "Configure branch policies for your `main` or `release` branches in Azure DevOps or GitHub.",
            "Require a minimum number of reviewers for pull requests.",
            "Integrate automated builds and solution checker validation as a required status check.",
          ],
        },
      },
      {
        id: "alm-adv-q4",
        text: "Is there a documented and tested rollback procedure for every critical production application?",
        type: "boolean",
        weight: 4,
        category: "Deployment & Operations",
        guidance:
          "If a deployment fails, the lack of a tested rollback plan can turn a minor issue into a multi-day outage, causing significant business disruption and revenue loss.",
        bestPractice: {
          description:
            "Every critical application must have a documented rollback procedure. This typically involves deploying a previous version of the managed solution. The procedure should be tested quarterly in a non-production environment.",
          suggestedActions: [
            "Identify all critical applications and document their rollback steps.",
            "Automate the rollback procedure within your deployment pipeline.",
            "Conduct and document quarterly rollback tests.",
          ],
        },
      },
    ],
  },
  {
    slug: "secrets-connections-security",
    name: "Secrets, Connections & App Security",
    weight: 25,
    description:
      "Assessment of how secrets, API keys, and connection credentials are managed, stored, and used across the platform.",
    questions: [
      {
        id: "sec-adv-q1",
        text: "Are all application secrets, connection strings, and API keys stored securely in Azure Key Vault instead of environment variables or code?",
        type: "boolean",
        weight: 5,
        category: "Secrets Management",
        guidance:
          "Storing secrets in plain text (in environment variables, Power Automate actions, or app source code) is a critical vulnerability. If exposed, it can lead to immediate, unauthorized access to critical systems and data breaches.",
        bestPractice: {
          description:
            "All secrets must be stored in Azure Key Vault. Power Platform solutions should use Key Vault-backed environment variables or retrieve secrets at runtime using a managed identity. Plain text secrets are forbidden in any environment.",
          link: "https://learn.microsoft.com/en-us/power-platform/admin/environment-variables-azure-key-vault",
          linkText: "Use Key Vault secrets in Power Platform",
          suggestedActions: [
            "Conduct an audit to find all hardcoded secrets and migrate them to Azure Key Vault immediately.",
            "Implement a policy that all new solutions must use Key Vault for secrets management.",
            "Use secret scanning tools in your DevOps pipeline to prevent new secrets from being committed to source control.",
          ],
        },
        discovery: [
          "**Review Power Automate Flows:** Check 'Initialize Variable' or 'Compose' actions for anything that looks like a password, API key, or connection string.",
          "**Check Custom Connectors:** Examine the security configuration of custom connectors for hardcoded credentials.",
          "**Scan Source Code:** Use tools like GitGuardian or `git-secrets` to scan your repositories for exposed credentials.",
          "**Review Environment Variables:** In the Power Apps portal, check the values of environment variables to see if they contain plain text secrets.",
        ],
      },
      {
        id: "sec-adv-q2",
        text: "Are App Registrations configured with least-privilege permissions?",
        type: "boolean",
        weight: 4,
        category: "Application Security",
        guidance:
          "Granting excessive permissions (e.g., Directory.ReadWrite.All when only User.Read is needed) dramatically increases the blast radius of a potential breach. A compromised app can lead to a full tenant compromise.",
        bestPractice: {
          description:
            "App Registrations must follow the principle of least privilege. Each permission must be justified and documented. Conduct quarterly reviews of all App Registration permissions to identify and remove excessive rights.",
          suggestedActions: [
            "Establish a formal review and approval process for all API permission grants.",
            "Audit all existing App Registrations and remediate overprivileged applications.",
            "Use tools like the Microsoft Graph Postman collection to test the minimal required permissions for a given task.",
          ],
        },
      },
      {
        id: "sec-adv-q3",
        text: "Is there an automated process for rotating all client secrets and certificates at least every 90 days?",
        type: "boolean",
        weight: 4,
        category: "Secrets Management",
        guidance:
          "Long-lived secrets are a major security risk. If a secret is compromised, a lack of rotation means an attacker has persistent access. Manual rotation processes are often forgotten or skipped.",
        bestPractice: {
          description:
            "Implement an automated rotation policy for all credentials. For production, secrets should be rotated every 30-90 days. This process should be fully automated using scripts and integrated with Azure Key Vault and your deployment pipelines.",
          suggestedActions: [
            "Develop PowerShell or Azure CLI scripts to automate the creation of new secrets and updating Key Vault.",
            "Integrate secret rotation into your CI/CD process.",
            "Set up monitoring to alert on secrets approaching their expiry date.",
          ],
        },
      },
      {
        id: "sec-adv-q4",
        text: "Are Azure Storage accounts secured using managed identities and private endpoints, with public access disabled?",
        type: "boolean",
        weight: 5,
        category: "Data Security",
        guidance:
          "Publicly accessible storage accounts or the use of long-lived account keys are common causes of major data breaches. This exposes all data in the storage account to potential theft or ransomware.",
        bestPractice: {
          description:
            "Storage accounts must have public access disabled. Access should be granted via managed identities for Power Platform services. If network isolation is required, use private endpoints. SAS tokens should be short-lived and used sparingly.",
          link: "https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security",
          linkText: "Azure Storage security guide",
          suggestedActions: [
            "Audit all storage accounts and disable public blob access.",
            "Configure storage account firewalls to restrict access to trusted networks.",
            "Refactor solutions to use managed identities instead of storage account keys.",
          ],
        },
      },
    ],
  },
  {
    slug: "business-continuity-ownership",
    name: "Business Continuity & Ownership",
    weight: 15,
    description: "Assessment of disaster recovery readiness and the governance of application and resource ownership.",
    questions: [
      {
        id: "bcdr-q1",
        text: "Are there automated backups for all critical Canvas Apps and Power Automate flows, in addition to Dataverse backups?",
        type: "boolean",
        weight: 5,
        category: "Business Continuity",
        guidance:
          "Dataverse has built-in backup capabilities, but Canvas Apps and flows do not. Without a specific backup strategy for these components, they can be permanently lost due to accidental deletion or corruption.",
        bestPractice: {
          description:
            "A comprehensive BCDR plan includes automated backups for all Power Platform components. This can be achieved by exporting solutions to a source control repository on a regular schedule via a DevOps pipeline.",
          suggestedActions: [
            "Use PowerShell scripts in an Azure DevOps pipeline to export critical solutions nightly.",
            "Store exported solution files in an artifact repository or source control.",
            "Document and test the process for restoring an app or flow from backup.",
          ],
        },
      },
      {
        id: "bcdr-q2",
        text: "Are all production applications and flows assigned at least two owners?",
        type: "boolean",
        weight: 4,
        category: "Ownership",
        guidance:
          "When a critical application has a single owner who leaves the company, the business process it supports can be completely stalled. The app becomes 'orphaned,' making it impossible to update or fix.",
        bestPractice: {
          description:
            "A mandatory co-ownership policy must be enforced for all production assets. Ownership should be regularly audited, and an automated process should be in place to handle ownership changes when an employee departs.",
          suggestedActions: [
            "Implement a Power Automate flow that runs quarterly to audit app ownership and flag single-owner apps.",
            "Integrate with your HR offboarding process to automatically trigger an ownership review for assets owned by a departing employee.",
            "Establish a governance team or a business unit lead as a default secondary owner for critical apps.",
          ],
        },
        discovery: [
          "**Use CoE Starter Kit:** The 'Power BI - Governance' dashboard has reports to identify orphaned and single-owner applications.",
          "**Use PowerShell:** Run `Get-AdminPowerApp | ForEach-Object { Get-AdminPowerAppRoleAssignment -AppName $_.AppName }` to audit owners for each app.",
        ],
      },
      {
        id: "bcdr-q3",
        text: "Is there a documented Business Continuity and Disaster Recovery (BCDR) plan that defines RTOs and RPOs for critical Power Platform solutions?",
        type: "boolean",
        weight: 4,
        category: "Business Continuity",
        guidance:
          "Without a formal BCDR plan, recovery from a major incident (like a regional outage or ransomware attack) is based on guesswork. This leads to extended downtime and a failure to meet business expectations.",
        bestPractice: {
          description:
            "A formal BCDR plan must be documented and tested. It should identify critical solutions, map their dependencies, and define the Recovery Time Objective (RTO) and Recovery Point Objective (RPO) agreed upon with the business.",
          suggestedActions: [
            "Conduct a Business Impact Analysis (BIA) to identify critical solutions and their required RTO/RPO.",
            "Document the step-by-step recovery procedures for each critical solution.",
            "Perform a tabletop exercise or a full DR test at least annually.",
          ],
        },
      },
    ],
  },
  {
    slug: "power-pages-governance",
    name: "Power Pages Governance",
    weight: 10,
    description: "Assessment of security, licensing, and capacity management for external-facing Power Pages websites.",
    questions: [
      {
        id: "pp-q1",
        text: "Are all Power Pages sites that expose sensitive data protected by a Web Application Firewall (WAF)?",
        type: "boolean",
        weight: 5,
        category: "Security",
        guidance:
          "Exposing a Power Pages site directly to the internet without a WAF leaves it vulnerable to common web attacks like SQL injection, cross-site scripting (XSS), and DDoS attacks.",
        bestPractice: {
          description:
            "All production Power Pages sites must be fronted by a WAF, such as Azure Front Door with a WAF policy. The WAF should be configured in 'Prevention' mode with the latest managed rule sets.",
          link: "https://learn.microsoft.com/en-us/power-pages/security/azure-front-door-power-pages",
          linkText: "Set up Azure Front Door with Power Pages",
          suggestedActions: [
            "Deploy Azure Front Door for all external-facing Power Pages sites.",
            "Enable and configure the WAF policy with Microsoft's managed rule sets.",
            "Regularly review WAF logs for potential threats and tune rules as needed.",
          ],
        },
      },
      {
        id: "pp-q2",
        text: "Is anonymous access to Dataverse tables strictly controlled and reviewed for all Power Pages sites?",
        type: "boolean",
        weight: 5,
        category: "Data Security",
        guidance:
          "Incorrectly configured table permissions are a common cause of data breaches in Power Pages, where sensitive data is accidentally exposed to anonymous, unauthenticated users.",
        bestPractice: {
          description:
            "Table permissions must be configured with the principle of least privilege. Anonymous access should be disabled by default. A formal review process must be in place to approve any table permissions that grant access to unauthenticated users.",
          link: "https://learn.microsoft.com/en-us/power-pages/security/table-permissions",
          linkText: "Configure table permissions",
          suggestedActions: [
            "Audit all table permissions for every Power Pages site.",
            "Remove all anonymous permissions unless there is a documented and approved business justification.",
            "Use the Power Platform CLI to script and version control table permission configurations.",
          ],
        },
      },
      {
        id: "pp-q3",
        text: "Is Power Pages capacity (authenticated and anonymous page views) actively monitored to prevent service disruptions?",
        type: "boolean",
        weight: 4,
        category: "Capacity & Licensing",
        guidance:
          "Running out of Power Pages capacity can cause your external website to become unavailable to users, leading to business disruption and reputational damage. This is often not monitored until it's too late.",
        bestPractice: {
          description:
            "Power Pages capacity should be monitored weekly via the Power Platform Admin Center. Set up proactive alerts (e.g., using a Power Automate flow) to notify administrators when consumption exceeds 80% of the allocated capacity.",
          suggestedActions: [
            "Establish a weekly review of the 'Capacity' reports in the PPAC.",
            "Create an automated flow that checks capacity usage via admin connectors and sends alerts.",
            "Forecast future capacity needs based on historical trends and upcoming events.",
          ],
        },
      },
    ],
  },
]

export const QUESTION_TYPES: QuestionType[] = [
  "boolean",
  "scale",
  "percentage",
  "text",
  "numeric",
  "multi-select",
  "file-upload",
  "document-review",
]
