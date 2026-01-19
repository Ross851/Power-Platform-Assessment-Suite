# Power Platform Governance & Administration: Personal Implementation Guide

**Version:** 1.0 | **Last Updated:** January 2026 | **Audience:** IT Admins, Governance Teams

> **Related Documents:**
> - [Environmental Strategy](./Power_Platform_Environmental_Strategy.md) - Full implementation brief
> - [Governance Top Tips](./Governance_Top_Tips_and_Talking_Points.md) - Quick wins and talking points
> - [Justification & Citations](./Justification_and_Citations.md) - Microsoft evidence for recommendations
> - [Workshop Script](./Governance_Workshop_Script.md) - Client discovery conversation guide
> - [Junior Developer Guide](./Junior_Developer_Guide.md) - Maker onboarding resource

---

## How to Use This Workbook

**Purpose:** This is a working document to capture your organization's specific governance decisions and configurations. Fill in the blanks, check the boxes, and use it as your single source of truth.

**Instructions:**
1. **Print or copy** this document for your organization
2. **Complete each section** during governance planning sessions
3. **Review quarterly** using the schedule in Part 6
4. **Update dates** whenever configurations change

**Field Guide:**
| Symbol | Meaning |
|--------|---------|
| `[ ]` | Checkbox - mark with `[x]` when complete |
| `__________________________` | Fill-in field - replace with your value |
| `YYYY-MM-DD` | Date field - use ISO format |
| *(Italics in parentheses)* | Guidance notes - do not include in final |

**Quick Start:** If you're short on time, prioritize:
- Part 1.1 (Tenant Isolation) - Critical security setting
- Part 2.1 (DLP Baseline) - Block by Default
- Part 3.1 (Naming Convention) - Enables automation

---

## Table of Contents
This document is your working reference for Power Platform governance.

*   **Part 1:** Tenant Configuration
*   **Part 2:** Data Policy Strategy (DLP)
*   **Part 3:** Environment Strategy & Inventory
*   **Part 4:** Solutions & ALM
*   **Part 5:** Monitoring & COE Starter Kit Strategy
*   **Part 6:** Governance Operations
*   **Part 7:** Commercial Strategy & Licensing
*   **Part 8:** Disaster Recovery & Continuity

---

## Part 1: Tenant Configuration
*Tenant-level settings establish your security foundation. Document your decisions here and review quarterly.*

### 1.1 Tenant Isolation
*Prevents cross-tenant data sharing through Entra ID connectors.*

**⚙️ Configuration**
*   **Restrict Cross-Tenant Connections:** [ ] On / [ ] Off
*   **Inbound Strategy:** [ ] Block All / [ ] Allow Specific / [ ] Open
*   **Outbound Strategy:** [ ] Block All / [ ] Allow Specific / [ ] Open
*   **Exception Tenant IDs:**
    > *(List allowed tenant IDs here - e.g., partner organizations)*
*   **Rationale:**
    > *(Why was this configured? Default is Open. Recommend: Block All or strict Allow-list to prevent data exfiltration to personal/external tenants)*
*   **Last Reviewed:** `YYYY-MM-DD`

### 1.2 Environment Creation Assignments
*Control who can spawn new capacity-consuming resources.*

**⚙️ Configuration**
*   **Production Environment Creation:** [ ] Specific Admins Only (Recommended) / [ ] Everyone
*   **Trial Environment Creation:** [ ] Specific Admins Only (Recommended) / [ ] Everyone
*   **Developer Environment Creation:** [ ] Specific Admins Only / [ ] Everyone
*   **Rationale:**
    > *(Limit Production/Trial creation to Admins to prevent database capacity exhaustion and "Sprawl" of unmanaged resources)*

### 1.3 Developer Environment Strategy
**⚙️ Configuration**
*   **Environment Routing:** [ ] Enabled / [ ] Disabled
    *   *Note: Requires Premium Licenses/Dataverse*
*   **Target Group:** [ ] All Makers / [ ] Specific Security Group
*   **Rationale:**
    > *(Enabled Routing ensures new makers are automatically directed to a safe, personal space rather than the Default environment)*

### 1.4 Feature Usage & Credits
**⚙️ Configuration**
*   **AI Builder Credit Consumption:** [ ] Block Unassigned Usage (Recommended) / [ ] Allow Users to Consume
    *   *Risk:* Users may consume all credits in a "race condition," breaking critical apps when credits reset monthly.
*   **Flow Run Resubmission:** [ ] Off (Recommended) / [ ] On
    *   *Risk:* Resubmitting flows can duplicate data transactions or cause inconsistency.
*   **Preview Features:** [ ] Off / [ ] On
    *   *Risk:* Preview features may send data to US servers (Data Residency drift) even if your tenant is in UK/EU.

### 1.5 Compliance & Privacy
**⚙️ Configuration**
*   **Customer Lockbox:** [ ] Enabled (if licensed) / [ ] Disabled
*   **Weekly Digest:** [ ] Enabled
    *   *Additional Recipients:* __________________________ (e.g., CISO, CIO)


---

## Part 2: Data Policy Strategy (formerly DLP)
*Control the "Lifeblood" of the platform: Connectors.*

### 2.1 Baseline Configuration
**⚙️ Setup**
*   **Default Group for New Connectors:** [ ] Blocked (Strongly Recommended) / [ ] Non-Business
*   **Custom Connectors:** [ ] Block All / [ ] Allow Specific Patterns
    *   *Pattern Matching Rules:* __________________________ (e.g., `https://*.myorg.com`)
*   **Policy Precedence:** "The most restrictive policy always wins."
    *   *Note: If a connector is allowed in Policy A but blocked in Policy B, it is BLOCKED.*

### 2.2 Endpoint Filtering (Preview Feature)
*Granular control for HTTP/SQL connectors.*

**⚙️ Rules**
*   **HTTP Connector:** [ ] Blocked Context / [ ] Configured
    *   *Allowed Endpoint:* `https://api.mycompany.com`
    *   *Allowed Endpoint:* `https://graph.microsoft.com`
    *   *Caveat:* Be aware of the "Compose" loophole in Power Automate where dynamic URLs can bypass validation.
*   **SQL Connector:** [ ] Blocked Context / [ ] Configured
    *   *Allowed Server:* `sql-prod-01.privatelink...`

### 2.3 Your Data Policies

#### Policy #1: Tenant Baseline (Catch-All)
*Purpose: Default policy applied to ALL environments unless explicitly excluded.*

| Field | Configuration |
|-------|---------------|
| **Policy Name** | __________________________ (e.g., `DLP-Tenant-Baseline`) |
| **Scope** | [ ] All Environments / [ ] Exclude Specific |
| **Excluded Environments** | __________________________ |
| **Default Group for New Connectors** | [ ] Blocked (Recommended) / [ ] Non-Business |

**Connector Classifications:**

| Classification | Connectors Included | Rationale |
|----------------|---------------------|-----------|
| **Business (Trusted)** | Dataverse, SharePoint, Outlook, Microsoft Teams, OneDrive, Approvals | Core M365 connectors - sensitive data allowed |
| **Non-Business (Untrusted)** | __________________________ | External/public connectors - cannot mix with Business |
| **Blocked** | HTTP (unless filtered), Custom Connectors, Social Media, File Sharing (Dropbox, Box, Google Drive) | High-risk data exfiltration vectors |

*Created Date:* `YYYY-MM-DD` | *Last Reviewed:* `YYYY-MM-DD`

---

#### Policy #2: Development Environment Override (Optional)
*Purpose: More permissive policy for DEV environments only.*

| Field | Configuration |
|-------|---------------|
| **Policy Name** | __________________________ (e.g., `DLP-Dev-Permissive`) |
| **Scope** | [ ] Specific Environments Only |
| **Included Environments** | __________________________ (DEV environments only) |
| **Default Group for New Connectors** | [ ] Non-Business / [ ] Blocked |

**Additional Connectors Allowed in DEV:**

| Connector | Classification | Justification |
|-----------|----------------|---------------|
| __________________________ | Non-Business | __________________________ |
| __________________________ | Non-Business | __________________________ |

*Created Date:* `YYYY-MM-DD` | *Last Reviewed:* `YYYY-MM-DD`

---

#### Policy #3: Production Lockdown (Optional)
*Purpose: Stricter policy for PROD environments with minimal connector access.*

| Field | Configuration |
|-------|---------------|
| **Policy Name** | __________________________ (e.g., `DLP-Prod-Strict`) |
| **Scope** | [ ] Specific Environments Only |
| **Included Environments** | __________________________ (PROD environments only) |
| **Default Group for New Connectors** | [ ] Blocked (Required) |

**Approved Production Connectors Only:**

| Connector | Classification | Business Justification |
|-----------|----------------|------------------------|
| Dataverse | Business | Core data platform |
| SharePoint | Business | Document storage |
| Outlook | Business | Email notifications |
| __________________________ | __________________________ | __________________________ |

*Created Date:* `YYYY-MM-DD` | *Last Reviewed:* `YYYY-MM-DD`

> **Note:** Remember the "Block Wins" rule - if a connector is blocked in ANY policy that applies to an environment, it is blocked regardless of other policies.

---

## Part 3: Environment Strategy & Inventory
*Document every environment and your ALM pipeline.*

### 3.1 Naming & URL Strategy
*Consistency is critical for future automation.*

**⚙️ Standards**
*   **Environment Naming Convention:**
    > *(Format: e.g., `[Purpose]-[Dept]-[Org]` -> `Dev-Finance-PowerSquared`)*
    > *Defined Pattern:* __________________________
*   **URL Prefix Strategy:**
    > *(Format: e.g., `[Dept]-[Purpose]` -> `fin-dev`)*
    > *Defined Pattern:* __________________________
*   **Rationale:**
    > *(Consistent naming allows for programmatic management via CLI/PowerShell. Random names break automation.)*

### 3.2 Special Use Cases
**⚙️ Configuration**
*   **"Bleeding Edge" Environment:** [ ] Yes / [ ] No
    *   *Region:* United States (enables "Get new features early")
    *   *Purpose:* Test preview features before they hit local production (UK/EU).
*   **Pay-As-You-Go (Azure Plan):** [ ] Enabled for specific environments
    *   *Use Case:* High-value, low-frequency apps where per-user licensing is too expensive.

### 3.3 Environment Inventory

#### Environment #1: __________________________
*   **Name:** __________________________ (e.g., `Dev-Finance-PowerSquared`)
*   **Type:** [ ] Production / [ ] Sandbox / [ ] Developer / [ ] Default
*   **Region:** __________________________
*   **Dataverse:** [ ] Yes / [ ] No
*   **URL Prefix:** `________________`.crmX.dynamics.com
*   **Managed Environment:** [ ] Yes / [ ] No
*   **Pay-As-You-Go:** [ ] Yes / [ ] No
*   **Security Group:** __________________________
*   **Purpose:** __________________________
*   **Key Applications:** __________________________
*   **Owners:** __________________________
*   **Created Date:** `YYYY-MM-DD`

> *[Copy and paste the template above for each environment]*

### 3.4 ALM Pipeline
*Development → Test → Production*

*   **Dev Environment(s):** ___________________________
*   **Test Environment(s):** ___________________________
*   **Production Environment(s):** ___________________________

---

## Part 4: Solutions & ALM Process

### 4.1 Solution Publisher
*   **Publisher Name:** __________________________
*   **Prefix:** `________` (e.g., `acme_`)
*   **Used For:** [ ] All Solutions / [ ] Production Only / [ ] Specific Projects
*   **Created Date:** `YYYY-MM-DD`

### 4.2 Deployment Process
*Standard steps for moving solutions through the pipeline:*

1.  **Development:** Build in Unmanaged Solution in Dev environment.
2.  **Export:** Export as **Managed** Solution.
3.  **Import to Test:** Import Managed Solution into UAT/Test Environment.
4.  **Validation:** Perform user acceptance testing.
5.  **Import to Production:** Import Managed Solution into Production.
6.  **Verification:** Post-deployment sanity check.

### 4.3 Environment Variables Strategy
*Document common environment variables:*

| Variable Name | Type | Purpose |
| :--- | :--- | :--- |
| `Site_URL` | Data Source | Stores SharePoint Site URL to avoid hardcoding |
| `Admin_Email` | Text | Emergency contact email for error handling |
| `API_Endpoint` | Text | External API URL for integration |

---

## Part 5: Monitoring & COE Starter Kit Strategy
*The "Beast" of governance requires a strategy, not just an install.*

### 5.1 Installation Readiness (Gotchas)
**⚙️ Prerequisites Check**
*   **Identity:** [ ] Dedicated Service Account (Recommended)
    *   *Warning:* Installing User must have **DIRECT** Power Platform Admin role (PIM/Group assignment often fails during install).
*   **Licensing (Per Admin User):**
    *   [ ] Power Apps Premium (Required for Model-Driven Apps)
    *   [ ] Power Automate Premium (Required for "Cloud Flow" inventory)
    *   [ ] Power BI Pro (Required for Dashboards)

### 5.2 COE Configuration
**⚙️ Setup**
*   **Inventory Method:** [ ] Cloud Flows (Standard) / [ ] Data Export (Advanced/Deprecated)
    *   *Note:* Cloud Flows method is quota-heavy. Ensure the service account has high limits.
*   **Environment Strategy:** [ ] Dedicated COE Environment (Treat as expendable/re-installable)

### 5.3 COE Component Selection
**⚙️ Components to Deploy**
*   **Core Components:** [ ] Yes (Required) / [ ] No
    *   *Includes:* Inventory sync, Admin apps, basic reporting
*   **Governance Components:** [ ] Yes / [ ] No
    *   *Includes:* Compliance processes, archival flows, cleanup automation
*   **Nurture Components:** [ ] Yes / [ ] No
    *   *Includes:* Maker welcome emails, training materials, community features
*   **Innovation Backlog:** [ ] Yes / [ ] No
    *   *Includes:* Idea submission, app request workflows
*   **Rationale:**
    > *(Start with Core + Governance. Add Nurture once stabilized. Innovation Backlog is optional.)*

### 5.4 Operational Process (The "Synergy")
*How Admins and Makers work together to maintain data quality.*

*   **App: "Admin View" (The Truth):**
    *   *Role:* Admin
    *   *Action:* View inventory, assess risk, quarantine apps.
    *   *Key Feature:* "Data Policy Impact Analysis" (Check before you block).
*   **App: "Developer Compliance Center" (The Justification):**
    *   *Role:* Maker
    *   *Action:* Provide business justification, risk classification, and support details.
    *   *Trigger:* Automated email requests additional info for new/high-risk apps.
*   **App: "Manage Permissions" (The Fixer):**
    *   *Role:* Admin
    *   *Action:* Reassign orphaned apps/flows when users leave.
    *   *Feature:* Can add new owners or just "Viewer" access for auditing.

### 5.5 Health Checks & Maintenance (Monthly Checklist)
*Governance is not a "Set and Forget" activity.*

*   [ ] **Service Account Check:**
    *   Verify credentials (password expiry?).
    *   Verify license assignment (Premium + Power BI).
    *   *Redundancy:* [ ] Secondary Break-glass Admin Account exists.
*   **COE Operations:**
    *   [ ] **Sync Flows:** Check for failures in "Core Components".
    *   [ ] **Inventory Freshness:** Confirm "Last Run" date is < 24 hours.
    *   [ ] **Updates:** Check GitHub for new COE Kit release (Upgrade quarterly).
*   **App:** "COE Command Center" (Use this to monitor health).

### 5.6 Platform Inventory (Native)
*   **Enabled:** [ ] Yes / [ ] No
*   **Primary Use:** [ ] Inventory / [ ] Reports / [ ] Both
*   **Review Frequency:** [ ] Daily / [ ] Weekly / [ ] Monthly

### 5.7 Key Metrics to Monitor
*   [ ] Failed flow runs (threshold: ____)
*   [ ] Orphaned apps (apps with departed owners)
*   [ ] DLP policy violations
*   [ ] Capacity consumption trends (Database/File/Log)
*   [ ] New environment creation rate

### 5.8 Advanced: The "Settings Enforcer" Strategy
*Managing the "Hidden" settings that standard tools miss.*

**The Problem:**
*   Many critical settings (e.g., Inactivity Timeout, AI Copilot toggles, Guest Access) are stored in the Dataverse `organization` table.
*   "Environment Groups" do not cover 100% of these settings.
*   **Drift:** Admins may manually re-enable settings you blocked.

**The Solution: Settings Enforcer (or equivalent automation)**
*   **Mechanism:** An automated flow that writes to the `organization` table daily.
*   **Target Settings to Enforce:**
    *   [ ] **Inactivity Timeout:** Force logout after X minutes (Security requirement).
    *   [ ] **Copilot/AI Prompts:** Disable in specific sensitive regions/environments.
    *   [ ] **AI Models:** Block preview models in Production.
    *   [ ] **Guest Access:** Restrict guest permissions at the environment level.
*   **Policy Strategy:**
    *   Define "Bronze/Silver/Gold" policies (e.g., Gold = Strict Timeout, No AI).
    *   Apply policies to groups of environments.
    *   **Monitor for Reversion:** Detect if a local admin undoes your setting (flow runs daily to re-apply).

### 5.11 Inventory Strategy (Hybrid)
*   **Primary Source for "Counts":** [ ] Native Admin Center Inventory (Faster/Built-in)
*   **Primary Source for "Actions":** [ ] COE Starter Kit (Quarantine/Email/Archive)
*   **Gap Analysis:**
    *   *Model Driven App Usage:* Use **Native Inventory** (COE is often inaccurate here).
    *   *Flow Runs:* Use **Native Inventory** (Good visual breakdown of failures).
    *   *Orphan Management:* Use **COE** (Native has no "Reassign" button).

---

## Part 6: Governance Operations

### 6.1 Decision Log
*Record major governance decisions:*

| Date | Decision | Rationale | Stakeholders |
| :--- | :--- | :--- | :--- |
| `2026-01-16` | Inventory Strategy | Hybrid Approach: Use Native Inventory for "Quick Looks" and COE for "Deep Action". | IT Admin, CISO |
| | | | |
| | | | |

### 6.2 Review Schedule
| Item | Frequency | Last Reviewed |
| :--- | :--- | :--- |
| **Tenant Settings** | Quarterly | |
| **DLP Policies** | Monthly | |
| **Environment Inventory** | Monthly | |
| **Solution Publisher** | Annually | |
| **Center of Excellence Update** | Quarterly | |
| **Security Group Members** | Monthly | |
| **Capacity Usage** | Monthly | |
| **Power Platform Inventory (Preview)** | Monthly | *Check for new columns/features* |

### 6.3 Contact Information
*   **Power Platform Admin:** __________________________
*   **IT Security Contact:** __________________________
*   **Compliance Officer:** __________________________
*   **Emergency Escalation:** __________________________
*   **Microsoft Support:** [support.microsoft.com](https://support.microsoft.com)

---

## Part 7: Commercial Strategy & Licensing
*Preventing "Bill Shock" while enabling innovation.*

### 7.1 Licensing Model Selection
**Decision Matrix**
*   **Per User Strategy:** [ ] Implemented
    *   *Use Case:* Heavy users accessing multiple apps/flows.
    *   *Cost Control:* Predictable monthly spend.
*   **Per App Strategy:** [ ] Implemented
    *   *Use Case:* Light users accessing a single critical solution.
    *   *Cost Control:* Higher management overhead but lower unit cost.
*   **Pay-As-You-Go (Azure Plan):** [ ] Implemented
    *   *Use Case:* Occasional users (e.g., "Once a month" Timesheet submission).
    *   *Benefit:* No upfront commitment, billed via Azure subscription.

### 7.2 Adoption Incentives
*   [ ] **Developer Plan:** Promote the *free* Developer Plan for individual learning (Preventing trial abuse).
*   [ ] **Auto-Claim:** [ ] Enabled / [ ] Disabled (Control if users can auto-claim licenses).

---

## Part 8: Disaster Recovery & Continuity
*When things go wrong, do we have a plan?*

### 8.1 Backup & Restore
*   **Production Environment Strategy:**
    *   *Backup Type:* [ ] System (Automatic) / [ ] Manual (Pre-deployment)
    *   *Retention:* Microsoft Default (7-28 days) or Custom? ____________
    *   *Restore SLA:* Target time to restore: ____ hours.
*   **Service Account Continuity:**
    *   [ ] **"Bus Factor" Check:** If the primary Admin leaves, who has the password?
    *   [ ] **Connection References:** Documented list of generic accounts used in flows (e.g., `svc-sharepoint@acme.com`).

---

## Quick Reference Guide

### Common Admin Tasks
*   **Create Environment:** Admin Center → Environments → New
*   **Create DLP Policy:** Admin Center → Data policies → New policy
*   **View Inventory:** Admin Center → Manage → Inventory
*   **Export Solution:** make.powerapps.com → Solutions → Select → Export
*   **Manage Capacity:** Admin Center → Resources → Capacity

### Useful PowerShell Commands
```powershell
# Install the module
Install-Module -Name Microsoft.PowerApps.Administration.PowerShell

# Get all environments
Get-AdminPowerAppEnvironment

# Get all apps in the tenant
Get-AdminPowerApp

# Get all flows in the tenant
Get-AdminFlow
```

### Key Resources
*   **Admin Center:** [admin.powerplatform.microsoft.com](https://admin.powerplatform.microsoft.com)
*   **Maker Portal:** [make.powerapps.com](https://make.powerapps.com)
*   **Documentation:** [learn.microsoft.com/power-platform](https://learn.microsoft.com/power-platform)
*   **COE Starter Kit:** [github.com/microsoft/coe-starter-kit](https://github.com/microsoft/coe-starter-kit)
