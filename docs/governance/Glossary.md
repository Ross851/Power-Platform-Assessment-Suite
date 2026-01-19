# Power Platform Governance Glossary

**Version:** 1.0 | **Last Updated:** January 2026

> **Related Documents:**
> - [Environmental Strategy](./Power_Platform_Environmental_Strategy.md)
> - [Implementation Workbook](./Governance_Implementation_Workbook.md)
> - [Junior Developer Guide](./Junior_Developer_Guide.md)

---

## Environment Terms

| Term | Definition |
|------|------------|
| **Default Environment** | The automatically-created environment in every tenant. Cannot be deleted. Should be locked down and renamed to "Personal Productivity". |
| **Personal Developer Environment** | An isolated environment provisioned for individual makers to build and test solutions without affecting others. |
| **Managed Environment** | An environment with enhanced governance features enabled. Triggers premium licensing requirements for ALL users who run apps in it. |
| **Sandbox Environment** | A non-production environment used for development, testing, or training. Can be reset. |
| **Production Environment** | A live environment running business-critical workloads. Should only contain Managed Solutions. |

---

## Solution & ALM Terms

| Term | Definition |
|------|------------|
| **Solution** | A container for Power Platform components (apps, flows, tables) that can be exported and imported between environments. |
| **Unmanaged Solution** | A solution used during development. Components can be edited directly. Deleting an unmanaged solution leaves components behind. |
| **Managed Solution** | A "sealed" solution for production. Cannot be edited directly. Deleting removes all components cleanly. |
| **Active Layer** | An unwanted customization layer created when someone manually edits a Managed Solution in Production. Blocks future updates. |
| **Solution Layering** | The stack of solution versions applied to an environment. Managed layers are "sealed"; unmanaged layers sit on top. |
| **ALM** | Application Lifecycle Management - the practice of managing apps through Dev > Test > Production stages with version control. |
| **CI/CD** | Continuous Integration / Continuous Deployment - automated pipelines that build, test, and deploy solutions. |

---

## Connector & DLP Terms

| Term | Definition |
|------|------------|
| **Connector** | A pre-built integration that allows Power Platform to communicate with external services (e.g., SharePoint, SQL, Salesforce). |
| **Premium Connector** | A connector that requires a premium license (e.g., SQL Server, Dataverse, HTTP). |
| **Standard Connector** | A connector included with basic licensing (e.g., SharePoint, Outlook, OneDrive). |
| **Custom Connector** | A user-created connector for APIs not covered by standard connectors. |
| **DLP (Data Loss Prevention)** | Policies that control which connectors can be used together and where. Prevents data exfiltration. |
| **Business Group** | DLP classification for trusted connectors handling sensitive data. Cannot share data with Non-Business connectors. |
| **Non-Business Group** | DLP classification for external/untrusted connectors. Data cannot flow to/from Business group. |
| **Blocked Group** | DLP classification for prohibited connectors. Cannot be used at all in environments where the policy applies. |
| **Block by Default** | Best practice DLP setting where new connectors are automatically blocked until explicitly approved. |

---

## Security & Access Terms

| Term | Definition |
|------|------------|
| **Tenant Isolation** | Setting that restricts cross-tenant data connections. Prevents data flowing to/from external organizations. |
| **Security Group** | An Entra ID (Azure AD) group used to control who can access an environment. |
| **Connection Reference** | A placeholder in a solution that abstracts the actual connection. Allows using different credentials in Dev vs Prod. |
| **Environment Variable** | A configurable value stored outside app code. Changes automatically between environments (e.g., Dev URL vs Prod URL). |
| **Service Account** | A dedicated user account for running automated processes. Not tied to an individual employee. |
| **Service Principal** | An Azure AD identity for applications to authenticate without user credentials. Used in CI/CD pipelines. |

---

## Licensing Terms

| Term | Definition |
|------|------------|
| **Power Apps Premium** | Per-user license providing access to premium connectors and Managed Environments. |
| **Power Apps Per App** | License granting access to a single app. Lower cost for light users. |
| **Developer Plan** | Free license for individual makers to build and test in isolated environments. Cannot share with others. |
| **Pay-As-You-Go** | Azure-based billing model where you pay per app run rather than per user. Good for infrequent use. |
| **Capacity Add-On** | Additional storage, API calls, or AI Builder credits purchased separately from user licenses. |

---

## CoE & Monitoring Terms

| Term | Definition |
|------|------------|
| **CoE Starter Kit** | Free Microsoft toolkit providing inventory, governance automation, and admin apps for Power Platform. |
| **Power Platform Inventory** | Native Admin Center feature (Preview) showing apps, flows, and usage without installing CoE. |
| **Quarantine** | CoE feature to block access to a Canvas App pending review. Does not work for Model-Driven Apps. |
| **Orphaned App/Flow** | An app or flow whose owner has left the organization or been deactivated. |
| **Weekly Digest** | Automated email report summarizing Power Platform activity in the tenant. |

---

## Pipeline Terms

| Term | Definition |
|------|------------|
| **DEV Environment** | Integration environment where solutions from personal environments are merged and refined. |
| **BUILD Environment** | Clean environment used solely for packaging solutions. No development occurs here. |
| **UAT Environment** | User Acceptance Testing environment where business users validate functionality before production. |
| **PROD Environment** | Production environment running live business workloads. |
| **Power Platform Pipelines** | In-product deployment feature for moving solutions between environments. Simpler than Azure DevOps. |
| **Azure DevOps Pipelines** | Enterprise CI/CD platform for automated builds and deployments. More control than in-product pipelines. |

---

## Abbreviations

| Abbreviation | Full Term |
|--------------|-----------|
| ALM | Application Lifecycle Management |
| CI/CD | Continuous Integration / Continuous Deployment |
| CoE | Center of Excellence |
| DLP | Data Loss Prevention |
| PCF | Power Apps Component Framework (custom code components) |
| UAT | User Acceptance Testing |
| RBAC | Role-Based Access Control |
| SPN | Service Principal Name |
| PIM | Privileged Identity Management |
