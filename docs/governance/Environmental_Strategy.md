# Power Platform Environmental Strategy - Implementation Brief

**Version:** 1.0 | **Last Updated:** January 2026 | **Audience:** IT Leadership, Architects

> **Related Documents:**
> - [Governance Top Tips](./Governance_Top_Tips_and_Talking_Points.md) - Quick wins and talking points
> - [Implementation Workbook](./Governance_Implementation_Workbook.md) - Configuration templates
> - [Justification & Citations](./Justification_and_Citations.md) - Microsoft evidence for recommendations
> - [Workshop Script](./Governance_Workshop_Script.md) - Client discovery conversation guide
> - [Junior Developer Guide](./Junior_Developer_Guide.md) - Maker onboarding resource

---

## How to Use This Document

| Audience | How to Use |
|----------|------------|
| **IT Leadership** | Read "Problem Statement" and "Environment Options for Executives" to understand risks and strategic choices |
| **Architects** | Focus on "Container Strategy" (1-3) and "CI/CD Pipeline Flow" for technical implementation |
| **Project Managers** | Use "Governance & Decision Framework" table to plan stakeholder engagement |
| **Finance** | Review "Environment Options" licensing implications before approving Managed Environments |

**Reading Order:**
1. Start with "Problem Statement" to understand urgency
2. Review "Container Strategy" for the target architecture
3. Check "Environment Options for Executives" for licensing decisions
4. Use "Decision Framework" to plan implementation phases

---

## Problem Statement: Why This Strategy is Urgent

### The Default Environment Sprawl Crisis
Many organizations experience uncontrolled Power Platform growth without proper governance, resulting in critical risks:

**Root Cause: No ALM Strategy**
- The Default Environment becomes the primary location for solution development
- Solutions go directly to production with no testing, versioning, or quality gates
- No clear promotion path from development to production
- No rollback capability when solutions fail
- Citizen developers create apps without understanding lifecycle management principles

**Common Symptoms** (illustrative examples):
- **Multiple unmanaged environments** scattered across the tenant
- **Hundreds of PowerApps** with unknown business criticality and ownership
- **Thousands of Flows** with unclear purpose and maintenance responsibility
- Solutions deployed directly in Default Environment (no Dev/UAT/Prod separation)
- Unknown data residency compliance status across regions
- No version control or deployment history
- Difficult to audit who deployed what, when, and why

**Business Risks:**
1. **Compliance Risk:** Cannot prove data residency compliance without environment-level controls and proper geographic isolation
2. **Security Risk:** Unknown data connections, ungoverned connector usage, inadequate DLP enforcement
3. **Operational Risk:** Production solutions break with no rollback plan, causing business disruption
4. **Audit Risk:** No deployment history, change tracking, or approval workflows to satisfy regulatory requirements
5. **Financial Risk:** Wasted licensing, duplicate solutions, abandoned apps consuming resources
6. **Strategic Risk:** Innovation blocked because IT leadership fears making sprawl worse

**The Core Problem:**
Without ALM discipline (Application Lifecycle Management), organizations cannot:
- Test solutions before production deployment
- Version and rollback changes safely
- Prove compliance during audits
- Scale Power Platform adoption confidently
- Distinguish critical business apps from experiments
- Maintain regional data residency requirements

**This Strategy Solves the Root Cause:**
By establishing proper environment containers with ALM workflows, organizations gain control, compliance, and confidence to scale Power Platform adoption safely.

---

## Overview
This document outlines a comprehensive Power Platform environmental strategy designed to transform unmanaged sprawl into a governed, compliant, and scalable platform architecture. The strategy establishes proper Application Lifecycle Management (ALM) discipline while maintaining geographic data residency compliance (e.g., UK, EU, US requirements). It uses a phased approach with clear decision points for business stakeholders.

---

## ⚠️ Critical Licensing Warning - Read First

> **STOP - Before implementing any environment strategy, understand this:**
>
> **Managed Environments trigger premium licensing for ALL users.**
>
> When you enable "Managed Environment" on ANY environment:
> - Every user who runs an app in that environment requires a **Power Apps Premium licence**
> - This applies even if the app only uses standard connectors (SharePoint, Outlook)
> - This applies even to simple apps that were previously free to run
>
> **Real-World Impact Example:**
> - You have 500 users running a simple leave request app in Production
> - You enable "Managed Environment" for better governance controls
> - Result: 500 users now require Premium licences = **£10,000+ per month**
>
> **Before enabling Managed Environments:**
> 1. Count ALL users who will run apps in that environment
> 2. Calculate: `Users × £20/month × 12 = Annual Cost`
> 3. Get budget approval BEFORE enabling
> 4. Consider the Hybrid Approach (see "Environment Options for Executives")
>
> **Safe Alternatives:**
> - Keep Default Environment as **Standard** (not Managed)
> - Use Managed only for Container 3 PROD where premium users already exist
> - Use DLP policies + Security Groups for governance in Standard environments

---

## Strategy Phases

### Phase 1: Discovery & Assessment (Prerequisites)
**Before implementing the strategy, we must complete:**

**Environment Inventory**
- Catalog all existing environments, apps, and flows
- Identify business owners and usage patterns
- Assess last modified dates and active user counts
- Map dependencies and integrations

**Business Impact Analysis**
- Classify solutions by criticality (Critical/Important/Low/Experimental)
- Determine alignment with current business strategy
- Identify compliance and audit requirements
- Calculate risk of downtime per solution

**Technical Assessment**
- Security and compliance gap analysis
- Data residency validation against requirements
- Technical debt and integration complexity scoring
- Licensing and capacity utilization review

**Output: Prioritized rationalization plan (Migrate/Consolidate/Decommission/Quarantine)**

---

### Phase 2: Tenant & Environment Strategy

This phase defines the target architecture with two main strategy layers:

#### Tenant Level Strategy
**CoE Kit - Model Driven App**
- License tracking and management
- Environment inventory and monitoring

**PowerPlatform Admin Center**
- Central governance and policy management
- Capacity and licensing oversight

**Entra/365 Integration**
- Access Groups for role-based permissions
- License assignment automation

**PowerPlatform DLP**
- Data Loss Prevention policies enforced at tenant level
- Connector governance (allowed/blocked/business)
- Applied across ALL environments except where overridden

**SharePoint Online**
- Considerations for integration patterns
- Document library connections and governance

**Azure Resources**
- Integration with Azure services
- Data residency alignment with Azure geography
- Geo-based resource deployment

#### Environment Level Strategy
The strategy uses **three container patterns** to organize environments:

### Container 1: Default Environment - Lock Down & Route Away
**Purpose:** Minimal usage container with automated routing to personal environments

**Critical Configuration Changes:**
1.  **Rename for Clarity:**
    - Rename Default Environment to "Personal Productivity" (cosmetic but helps set expectations)
    - Makes it clear this is for personal-use-only scenarios
2.  **Implement Default Environment Routing (CRITICAL):**
    - Enable Default Environment Routing at tenant level
    - When makers try to create apps in Default, they are automatically redirected to their Personal Developer Environment
    - This solves sprawl at the root cause without requiring user training
    - *Reference: Microsoft Default Environment Routing Documentation*
3.  **Restrict BUILD Permissions:**
    - Access Groups restrict who can create solutions
    - Read access for users, build restricted to admins only
    - Contains default data/apps that cannot be removed

**Result:**
- Default Environment no longer accumulates sprawl
- Makers are automatically routed to isolated personal environments
- Existing solutions can be gradually migrated to appropriate containers

---

### Container 2: Personal Developer Environments (NOT Shared Maker Playground)
**CRITICAL ARCHITECTURAL CHANGE:** The original concept of a "shared Maker Playground" creates the same problems as the Default Environment - it becomes "Shadow IT 2.0" where makers overwrite each other work, create dependency conflicts, and make cleanup impossible.

**Microsoft Best Practice: Individual Personal Developer Environments**
**Purpose:** Isolated innovation spaces for individual citizen developers

**Configuration:**
- Each maker gets their own private environment (e.g., "John-Dev-UK", "Mary-Dev-EU")
- Complete isolation - if one maker breaks their environment, it doesn't affect others
- **Auto-provisioned via Default Environment Routing** as Managed Environments (provides visibility)
- One environment per maker per region (for data residency compliance)

**Licensing Clarification:**
- Personal environments created via routing are automatically **Managed Environments**
- **Makers:** Covered by **Power Apps Developer Plan** (free) for individual building and testing.
- **Users (Sharing):** ANY user running an app in these environments requires a **Premium License** (Per User or **Per App**) because they are Managed.
- *Strategic Benefit:* This enforces "Personal means Personal". To share solutions without massive licensing costs, makers **MUST** deploy to Container 3 (PROD).

**Regional Implementation:**
- Personal environments must be created in the appropriate region
- Example: UK makers get UK-based personal environments
- Enforced through Default Environment Routing (see Container 1)

**Benefits Over Shared Playground:**
- **No collision:** Makers can't overwrite each other's connections or apps
- **Easy cleanup:** Inactive developer environments can be deleted without impacting others
- **Clear ownership:** Every environment has a single responsible owner
- **Forces export discipline:** Can't "camp" in a shared environment indefinitely
- **Lower cost:** Developer Plan (free) covers individual development

**Governance Controls:**
- DLP policies still apply to personal environments
- CoE Kit monitors usage and flags inactive environments
- Makers understand these are for experimentation only
- Production solutions must graduate to Container 3 (DEV/BUILD/UAT/PROD)

---

### Graduation to Container 3 (THE INTEGRATION GAP)
**Selected Strategy: Azure DevOps Pipelines (Enterprise ALM)**

**Configuration: Service Principal Authentication**
To ensure security and zero reliance on user credentials, we will use **Azure DevOps Pipelines** authenticated via **Service Principals** (App Registrations).

**Workflow:**
1.  **Commit:** Makers use `pac solution clone` (VS Code) to sync their Personal Environment work to Git (Azure DevOps Repo).
2.  **Build Pipeline:** Automatically triggers on commit.
    - Runs as **Service Principal**.
    - Packs solution and verifies quality.
    - Deploys Key to Container 3 DEV (Integration).
3.  **Release Pipeline:** Deploys Managed Solution to UAT/PROD.

**Benefits:**
- **Security:** "Headless" deployment using Service Principals (no user passwords).
- **Audit:** Full traceability in Azure DevOps.
- **Standards:** Enforces enterprise ALM consistent with Azure development.

**Alternative (Not Selected):**
- *Power Platform Pipelines (In-Product):* Lower complexity but less granular control than Azure DevOps.

---

### Container 3: Managed Environments (ALM Pipeline)
**Purpose:** Production-grade solution lifecycle management with proper testing and build isolation

**Four-Environment Strategy (Recommended):**

**Environment Breakdown:**
1.  **DEV** - Integration and formal development
    - Source-controlled environment (ideally read-only or heavily synchronized)
    - Acts as "Integration/Merge" environment for solutions graduating from Personal Environments
    - Solutions from multiple makers are integrated here
    - Formal development and refinement before BUILD
    - Only approved developers have access
2.  **BUILD** - Build and packaging only (no development)
    - Clean environment for building managed solutions
    - Separates build process from active development
    - Prevents "Gremlins" (connection references, environment variables) from interfering
    - No developers or end users have access - automation only
    - Fresh environment ensures repeatable builds
3.  **UAT** (User Acceptance Testing)
    - Managed Solutions deployed for testing
    - Subset of end users test functionality before production
    - User acceptance sign-off required before PROD release
4.  **PROD** - Production
    - Managed Solutions only
    - End user production workloads
    - Only released after UAT approval

**DEV as Source Control Integration Point:**
Container 3 DEV is where solutions from Personal Environments converge. It serves as the integration layer where:
- Solutions from multiple makers are merged
- Dependencies are resolved
- Code reviews occur
- Formal development refinement happens
- Source control (Git) is the single source of truth

**Why BUILD Environment Matters:** The BUILD environment is critical for clean, repeatable deployments. It ensures:
- Solutions are built in a pristine environment free from development artifacts
- Connection references and environment variables don't leak from DEV
- Consistent managed solution packaging every time
- Separation of concerns: developers work in DEV, automation works in BUILD

**Regional Deployment:**
- Each region maintains its own 4-environment set (DEV/BUILD/UAT/PROD)
- Example: UK-DEV, UK-BUILD, UK-UAT, UK-PROD
- Solutions are independently deployed per region (no cross-region promotion)
- **Scale consideration:** 4 environments × 3 regions = 12 environments to manage
- **CRITICAL:** Use **Terraform modules** for all environment provisioning - never create manually
- **Naming standards:** Enforce strict Entra ID group naming (e.g., `SGP-PowerPlatform-Admins-UK`) to prevent access creep

**CI/CD Pipeline Flow:**
```
Personal Developer Environment (Individual Maker)
    ↓
[Integration: Power Platform Pipelines OR pac CLI to Git]
    ↓
Container 3 DEV (Integration/Merge Environment - Source Controlled)
    ↓
[Pipeline 1: Export from DEV to Git]
    ↓
Azure DevOps Repo (Source Control - Single Source of Truth)
    ↓
[Pipeline 2: Build Managed Solution]
    ↓
BUILD (Clean Build Environment)
    ↓
Export as Managed Solution
    ↓
[Release Pipeline 1: Deploy to UAT]
    ↓
UAT (User Acceptance Testing)
    ↓ (after approval)
[Release Pipeline 2: Deploy to PROD]
    ↓
PROD (Production)
```

**Automation Stack:**
- **Azure DevOps** - CI/CD orchestration and source control
- **Power Platform Build Tools** - Solution export/import/pack/unpack tasks
- **Terraform** - Environment provisioning and configuration
- **Service Principal** - Authentication for automated deployments
- **YAML Pipelines** - Infrastructure as Code for pipeline definitions

---

## Data Residency & Geography Strategy

### Unified Data Governance - HARD COMPLIANCE BOUNDARIES
The strategy enforces data residency compliance across the Microsoft stack:

```
Azure Geography (Region1/Region2/Region3)
    ↕️ MUST align with
Power Platform Geography (environment placement)
    ↕️ enforced by
Geo-based Security Groups (Entra/365)
    ↕️ controlled by
Regional Power Admin boundaries
    ↕️ NO cross-region data movement permitted
```

**Critical Compliance Rule:**
- Data residency is a hard regulatory requirement in many jurisdictions
- Data cannot leave its designated region under any circumstances
- Cross-region integrations/data flows are prohibited
- Each region operates as an isolated island for compliance purposes

### Regional Architecture - HARD COMPLIANCE REQUIREMENT
**Data Residency Rules:**
- Data CANNOT move between regions under any circumstances
- Each region must maintain completely isolated environment sets
- Cross-region data sharing is prohibited by regulatory requirements
- Solutions must be independently deployed per region (no cross-region promotion)

**Environment Placement:**
- **Maker Playground (Container 2):** One per region (UK, EU, US, etc.)
- **Production Environments (Container 3):** One complete set (Dev/UAT/Prod) per region
- **Default Environment (Container 1):** Tenant-level, location fixed at tenant creation (check if compliant)

**Example: UK/EU/US Region Requirements**
If operating in regions with data residency laws (e.g., UK GDPR, EU data protection, US state regulations):
1.  Regional Maker Playground (Container 2) per geography
2.  Regional 4-environment set (Container 3): DEV, BUILD, UAT, PROD
3.  All regional data stays within geographic boundaries - no exceptions
4.  Each region operates independently with its own CI/CD pipelines

### Admin Structure - Geographic Boundaries
**Power Platform Admin Assignment:**
- Admins MUST be assigned based on geographic region
- Example: UK admins manage UK environments only
- Regional admins cannot access environments outside their geography
- *Enforced through Entra/365 Security Groups with geo-targeting*

**Security Group Structure:**
- `Region1-PowerPlatform-Admins` → Access to Region1 environments only
- `Region2-PowerPlatform-Admins` → Access to Region2 environments only
- `Region3-PowerPlatform-Admins` → Access to Region3 environments only

**Implications:**
- Central governance team can set tenant-level policies
- Regional admins implement and manage within their geography
- No single admin has cross-region environment access (except tenant admins)
- Audit trail shows geographic access boundaries

---

## Environment Options for Executives

> **[LICENSING ALERT - READ BEFORE DECIDING]**
>
> Managed Environments trigger premium licensing requirements for ALL users who run apps in that environment - not just makers. A single PROD environment with 500 users running a simple SharePoint app could cost 500 x Premium License fees monthly. Model your costs BEFORE enabling Managed Environments.
>
> **Quick Cost Formula:** `Number of App Users x Premium License Cost x 12 = Annual Impact`

### Option 1: Standard Environments + Strong Governance
- **Cost:** Lower (no premium licensing required)
- **Control:** Manual governance processes, DLP policies, access groups
- **Best For:** Budget-conscious organizations, smaller scale deployments
- **Admin Overhead:** Higher (manual environment request/approval)
- **Licensing Impact:** Users only need premium licenses if using premium connectors

### Option 2: Managed Environments + Routing
- **Cost:** Premium licensing per managed environment
- **Control:** Automated governance, advanced routing, maker controls
- **Features:** Automated DLP enforcement, Maker limit controls, Advanced routing
- **Licensing Impact:** ALL app users require premium licenses regardless of connector usage
- **Best For:** Enterprise scale, strict compliance requirements, multi-region complexity

> **[WARNING]** Do NOT enable Managed Environments on the Default Environment unless you are prepared to license every user in your organization.

### Option 3: Hybrid Approach (Recommended)
- **Cost:** Balanced - optimize licensing spend while maintaining governance
- **Configuration:**
    - Managed Environments for Container 3 PROD only (and possibly UAT)
    - Standard Environments for Personal Developer Environments and DEV/BUILD
- **Licensing Strategy:**
    - PROD users: Premium licenses (unavoidable for managed governance)
    - DEV/BUILD: Developer Plan (free) or existing licenses
    - Default Environment: Keep STANDARD to avoid mass licensing requirement

**Example Cost Comparison:**
| Scenario | Managed Envs | Users Impacted | Annual Cost Impact |
|----------|--------------|----------------|-------------------|
| All Managed | 12 | 500 | 500 x Premium |
| Hybrid (PROD only) | 3 | 200 | 200 x Premium |
| Standard Only | 0 | 0 | Existing licenses |

---

## Governance & Decision Framework

### Decisions Required from Business Stakeholders
| Decision Area | Decision Maker | Microsoft Best Practice | Timeline |
| :--- | :--- | :--- | :--- |
| **Maker innovation spaces** | IT Leadership + Governance | Personal Developer Environments (NOT shared playgrounds) | Phase 1 |
| **Default Environment strategy** | IT Leadership | Enable Default Environment Routing to personal environments | Phase 1 |
| **Personal → DEV integration method** | IT Leadership + Developer Experience | Power Platform Pipelines (simple) OR pac CLI + Git (enterprise) | Phase 2 |
| **App criticality classification** | Business Owners with IT input | Used to determine Container 3 migration priority | Phase 1 |
| **Managed vs Standard environment choice** | Budget Holder | Evaluate premium licensing impact carefully | Phase 2 |
| **Pipeline tooling** | IT Leadership | Azure DevOps for enterprise; Power Pipelines for simple scenarios | Phase 2 |
| **DLP Strategy** | Security + IT Leadership | "Block by Default" recommended over categorization | Phase 2 |
| **Terraform standardization** | IT Leadership | MANDATORY for multi-region to avoid manual creation errors | Phase 2 |
| **Rationalization plan** | Business Owners + Governance Committee | Business-led criticality assessment | Phase 1 |

### Implementation Tools & Automation
**Terraform**
- Infrastructure as Code for environment provisioning
- **MANDATORY for multi-region:** Use Terraform modules to ensure consistency
- Per-region deployment - each region maintains separate Terraform state
- Version-controlled environment definitions

**CI/CD Pipelines**
- Azure DevOps or GitHub Actions
- Region-specific pipelines - no cross-region promotion
- Automated testing and validation gates per geography

**DLP Policies**
- **"Block by Default" Strategy (Recommended):** Block every connector EXCEPT "Core 5" (Office 365, SharePoint, Microsoft Teams, OneDrive, Dataverse). Makers must request specific connectors.
- Automated enforcement and monitoring

**CoE Starter Kit (Free)**
- Environment and app inventory, usage analytics, maker onboarding

**Power Platform Catalog (Governance Feature)**
- Publish approved templates and PCF controls

---

## Success Metrics
- **Quantitative:** Risk reduction (X% env count reduction), 100% production apps in governed containers, Zero critical DLP violations.
- **Qualitative:** Clear ownership, Maker satisfaction, Reduced security risk, Improved audit readiness.

## Next Steps
1.  **Secure Executive Sponsorship**
2.  **Form Governance Committee**
3.  **Execute Discovery Phase**
4.  **Develop Rationalization Plan**
5.  **Implement Container Strategy**
6.  **Deploy Automation**
