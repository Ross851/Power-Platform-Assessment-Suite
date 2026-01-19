# Power Platform Governance Workshop: Interactive Discussion Guide

**Version:** 1.0 | **Last Updated:** January 2026 | **Audience:** Consultants, Pre-Sales

> **Related Documents:**
> - [Environmental Strategy](./Power_Platform_Environmental_Strategy.md) - Full implementation brief
> - [Governance Top Tips](./Governance_Top_Tips_and_Talking_Points.md) - Quick wins and talking points
> - [Implementation Workbook](./Governance_Implementation_Workbook.md) - Configuration templates
> - [Justification & Citations](./Justification_and_Citations.md) - Microsoft evidence for recommendations

**Purpose:** This guide is designed to lead a discovery and strategy conversation with the client. It is broken into chapters that follow a logical narrative: identifying the pain, stabilizing the foundation, and building a scalable future.

**How to use:**
- **Ask:** Start with the discovery questions to gauge their maturity.
- **Listen:** Note their specific pain points.
- **Lead:** Use the "Talking Points" to educate them on *why* the recommended strategy solves their problem.

**Workshop Timing Guide:**
| Chapter | Topic | Duration |
|---------|-------|----------|
| 0 | Maturity Assessment | 10 min |
| 1 | Reality Check (Current State) | 15 min |
| 1b | Tenant Settings | 10 min |
| 2 | Default Environment | 10 min |
| 3 | Personal Environments | 10 min |
| 3a | Environment Creation | 10 min |
| 3b | Maker Experience | 10 min |
| 4 | Identity & Access | 10 min |
| 4b | ALM Path to Production | 15 min |
| 5 | Connectors & DLP | 15 min |
| 6 | COE Starter Kit | 15 min |
| 6b-6f | Advanced Topics | 20 min |
| 7 | Data Security | 10 min |
| **Total** | | **~2.5 hours** |

---

## Chapter 0: The Maturity Assessment (10 min)
*Goal: Baseline the client's current state to set realistic expectations.*

### 🗣️ Leading the Conversation (The 5 Levels)
*   **Level 0 (Chaos):** >10 Environments, No DLP, "Default" is used for everything. (Most common starting point).
*   **Level 1 (Reactive):** "Block by Default" DLP exists. Manual environment creation.
*   **Level 2 (Proactive):** Environment Routing enabled. App Makers have their own space. COE Kit installed.
*   **Level 3 (Optimized):** Automated Pipelines (ALM). Self-service Maker requests.
*   **Level 4 (Strategic):** Governance drives business KPIs. AI-driven monitoring.

*"Where do you see yourself today? And where do you reasonably want to be in 6 months? (Targeting Level 2 is usually the sweet spot for Phase 1)."*

---

## Chapter 1: The Reality Check (Current State) (15 min)
*Goal: Validate the "Sprawl Crisis" and align on the urgency of the problem.*

### ❓ Discovery Questions
*   "If I asked you right now—'How many apps do you have, and who owns them?'—could you answer with 100% confidence?"
*   "Do you currently have a way to distinguish between a 'test' app and a critical business process running in your Default environment?"
*   "What keeps you up at night regarding the platform? Is it data leakage, licensing costs, or just the fear of the unknown?"

### 🗣️ Leading the Conversation (The "Why")
*   **The Sprawl Trap:** Explain that without governance, the Default Environment becomes a "wild west".
*   **The Root Cause:** Most organizations fail because they treat Power Platform like Office (personal) rather than Azure (enterprise dev).
*   **The Risk:** Highlight that unknown data connections and "Shadow IT" are the biggest risks to their compliance posture.

---

## Chapter 1b: The Invisible Perimeter (Tenant Settings) (10 min)
*Goal: Discuss the "On/Off" switches that immediately reduce risk.*

### ❓ Discovery Questions
*   "Are you aware that by default, any user can connect their corporate Power Automate flow to a personal OneDrive in another tenant?"
*   "Who controls your AI budget? Do you let users spend 'credits' freely until they run out, or is it allocated?"
*   "If a maker uses a 'Preview' feature, are you comfortable with that data potentially leaving the UK/EU to go to US servers?"

### 🗣️ Leading the Conversation (The "Why")
*   **Tenant Isolation (The Firewalls):**
    *   *The Concept:* You can configure **Inbound** and **Outbound** restrictions.
    *   *The Risk:* Without this, a malicious actor (or just a helpful user) could move files from your Corporate Tenant to their Personal Tenant via a simple flow.
*   **The "Credit Race" (AI Builder):**
    *   *The Problem:* AI Builder credits reset monthly. If you allow "Unassigned usage," users will race to consume them.
    *   *The Scenario:* "Imagine User A executes a massive job on Day 1 and eats all the credits. User B's critical invoice processing app fails on Day 2 because the pot is empty."
    *   *The Fix:* Turn off unassigned usage. Allocate credits effectively.
*   **Data Residency (Preview Features):**
    *   *The Warning:* "Preview" often means "Hosted in the US." Even if your tenant is strictly UK-based, enabling Preview features (like Copilot in some regions) might violate your data residency laws.
*   **Capacity Control:**
    *   *The Leak:* If you leave "Production Environment Creation" open to everyone, users will create databases that eat your storage capacity, leading to surprise bills. Restrict this to Admins immediately.

---

## Chapter 2: Taming the "Default" Environment (10 min)
*Goal: Shift the Default Environment from a development hub to a "Personal Productivity" space.*

### ❓ Discovery Questions
*   "How do your users currently know *where* to build their apps? Do they just click 'Create'?"
*   "If a user leaves the company tomorrow, what happens to the apps they built in the Default environment?"
*   "Are you comfortable with every user in the company having 'Maker' access to the same shared space?"

### 🗣️ Leading the Conversation (The "Why")
*   **The Recommendation:** We need to rename "Default" to "**Personal Productivity**".
*   **The Logic:** We can't delete the Default environment, but we can change its purpose. It should be for personal, non-critical tasks only (like Microsoft Lists integrations).
*   **The Solution:** Introduce **Default Environment Routing**. Instead of training 5,000 users, we flip a switch. When they try to build in Default, they are automatically routed to their own safe, private space.
*   **The "Managed" Upsell:** "If you have premium licenses, we can make the Default environment 'Managed'. This allows us to strictly limit sharing (e.g., you can only share with 5 people). This effectively kills 'Shadow IT' because an app can never go viral if it can't be shared."

---

## Chapter 3: Empowering Makers (The "Personal" Space) (10 min)
*Goal: Define where innovation should actually happen.*

### ❓ Discovery Questions
*   "Do you have makers stepping on each other's toes? (e.g., Overwriting flows, breaking connections?)"
*   "How do you handle 'cleanup'? If someone experiments for a week and stops, does that junk stay forever?"

### 🗣️ Leading the Conversation (The "Why")
*   **The Pivot:** Move away from "Shared Playgrounds." They become just as messy as the Default environment.
*   **The Best Practice:** **Personal Developer Environments**.
    *   *Why?* Total isolation. If John breaks his environment, Mary is unaffected.
    *   **The "Keys to the Kingdom":** Explain that in a Personal Environment, the user is technically a "System Admin". This sounds scary.
    *   **The Guardrails:** Explain **Environment Groups**. "We can group all these personal environments together and apply **Rules** (like blocking custom code/PCF) that override the user's admin rights. We trust them, but we verify automatically."

---

## Chapter 3a: The Art of Environment Creation (10 min)
*Goal: Move beyond "Click New" to a strategic provisioning process.*

### ❓ Discovery Questions
*   "If I look at your environment list today, can I tell which ones are Finance vs. HR, and which ones are Dev vs. Prod, just by the name?"
*   "Do you manually configure every new environment? What happens if you forget to add the Security Group?"
*   "Do you have a 'Time Machine' environment? One where you can see features that are coming next month?"

### 🗣️ Leading the Conversation (The "Why")
*   **Naming is Strategy (Not just Semantics):**
    *   *The Trap:* "Test Environment 1" means nothing.
    *   *The Fix:* Use a strict naming convention (e.g., `[Org]-[Dept]-[Stage]` -> `PowerSquared-Fin-Dev`).
    *   *The Benefit:* This sounds pedantic, but it's the only way to enable **Automation** later. If you want a script to "Backup all Dev environments," the script needs to know which ones are Dev.
*   **The "Bleeding Edge" Trick:**
    *   *The Secret:* Create one Sandbox environment in the **United States** region.
    *   *Why?* You can check a box called "Get new features early."
    *   *The Value:* Features hit the US weeks before the UK/EU. This gives you a "Crystal Ball" to spot breaking changes before they hit your real production apps.
*   **Pay-As-You-Go:**
    *   *The Option:* If you have an app used by 500 people once a year, buying 500 licenses is a waste.
    *   *The Fix:* Link the environment to an Azure Subscription (Pay-As-You-Go). You only pay for what you use.

---

## Chapter 3b: The Maker Experience (Enablement) (10 min)
*Goal: Flip the script from "Restriction" to "Support". Governance is a service, not a police force.*

### ❓ Discovery Questions
*   "If I am a Maker and I want to build a serious app, how do I ask for a Production Environment?"
*   "Do your makers see IT as a blocker or a partner?"
*   "Does your 'No' come with a 'How To'?"

### 🗣️ Leading the Conversation (Objection Handling)
*   **"This slows us down!":**
    *   *Response:* "Yes, it adds 5 minutes to the start. But it saves 5 weeks of fixing broken permissions later. Proper ALM reduces bugs by 60%."
*   **The "Golden Path":**
    *   We don't just block things. We provide a **"Maker Request App"** (part of COE).
    *   *Workflow:* Maker requests a connector/environment -> Admin reviews -> Automated provisioning.
    *   *The Promise:* "If you follow the rules (Golden Path), you get your environment in 2 hours. If you go rogue, you get blocked."

---

## Chapter 4: Identity & Access Management (10 min)
*Goal: Stop using personal accounts for business-critical processes.*

### ❓ Discovery Questions
*   "How do you control who can access each environment? Individual users or groups?"
*   "Do you have service accounts for automated processes, or do flows run under personal accounts?"
*   "What happens when a key maker leaves the company? Do their flows keep running?"

### 🗣️ Leading the Conversation (The "Why")
*   **The Recommendation:** Always assign a **Security Group** to every environment.
*   **The Hidden Risk:** "Did you know that if you don't assign a Security Group, every single user in your Active Directory is automatically added to the environment's user table?"
*   **The "Zero Trust" Fix:** Assigning a group (even an empty one) flushes that table. It is the only way to ensure "Zero Trust" access control.
*   **Service Accounts:** Critical flows should use Connection References tied to service accounts, not personal credentials. This prevents "John left and everything broke" scenarios.

---

## Chapter 4b: The Path to Production (ALM) (15 min)
*Goal: Establish a professional lifecycle for business-critical applications.*

### ❓ Discovery Questions
*   "When a critical app breaks in production, how do you roll it back to the version that worked yesterday?"
*   "Do you have a 'testing' phase, or do users test directly on the live version?"
*   "How do you currently move an app from 'Idea' to 'Live'?"

### 🗣️ Leading the Conversation (The "Why")
*   **The "One-Way Street" Rule:** Development uses **Unmanaged** solutions; Production uses **Managed** solutions. Never mix them.
*   **The Rollback Problem:** Without version control (Git/Azure DevOps), you have no history. If v2 breaks, you can't easily restore v1.
*   **The Pipeline Promise:** Automated CI/CD means consistent deployments. No more "I forgot to include the connection reference" errors.
*   **The BUILD Environment:** A dedicated clean environment for packaging solutions ensures no "gremlins" (leftover connections, test data) sneak into Production.

---

## Chapter 5: The "Lifeblood" of the Platform (Connectors & Data Policies) (15 min)
*Goal: Move from "blocking everything" to "intelligent routing" of data.*

### ❓ Discovery Questions
*   "Do you know the difference between 'Business' and 'Non-Business' data groups? Or is everything just in one bucket?"
*   "If I tried to use an HTTP connector to send your customer list to a random server, would the platform stop me?"
*   "How do you handle 'Custom Connectors'? Do you block them, or do you use pattern matching to allow only your internal APIs?"

### 🗣️ Leading the Conversation (The "Why")
*   **The Concept:** Connectors are the "Lifeblood" of the platform. Without them, you just have a blank screen.
*   **The Strategy:** We don't want to stop blood flow, we want to stop *bleeding*.
    *   **The Baseline:** Create a "Catch-All" policy applied to *All Environments*.
    *   **The Rule:** Set the "Default Group" for new connectors to **Blocked**.
    *   *Why?* Microsoft releases new connectors constantly. If you don't block by default, a new "FilesRUs" connector is open to everyone the day it launches.
*   **The "Lego" Grouping:**
    *   **Business Group:** "Trust Circle" (SharePoint, Outlook, Dataverse).
    *   **Non-Business Group:** "Untrusted" (Twitter, RSS, External tools).
    *   *The Magic:* These two groups *cannot talk to each other*. You can't pull data from SharePoint (Business) and tweet it (Non-Business).
*   **Advanced Tactics (Endpoint Filtering):**
    *   *The Problem:* The "HTTP" connector is powerful but dangerous. It can talk to anything.
    *   *The Fix:* We can use **Endpoint Filtering** to say "You can use HTTP, BUT only to `api.myorg.com`."
    *   *The Caveat:* (Technical deep dive) Be careful with the "Compose" loophole in Power Automate. Sophisticated users can sometimes bypass filters using dynamic variables, so we often prefer to block HTTP entirely in the Default environment.
*   **The "Conflict" Rule:**
    *   "If you have two policies, and one allows a connector while the other blocks it... **The Block Always Wins**."

---

## Chapter 6: The "Beast" (Center of Excellence Starter Kit) (15 min)
*Goal: Explain that the COE Kit is a tool, not a magic wand, and requires specific care.*

### ❓ Discovery Questions
*   "If an employee leaves today, how do you find every app they owned and reassign it to their manager?"
*   "Do you have a way to spot 'Orphanned' apps (apps with no active owner) before they break?"
*   "Are you ready to dedicate a 'Service Account' with a Premium License just to run your governance tools?"

### 🗣️ Leading the Conversation (The "Why")
*   **The Concept:** The COE Kit is a collection of apps and flows that scrape your tenant to build an inventory.
*   **The "Gotchas" (War Stories):**
    *   *The Identity Trap:* "I've seen installs fail because the Admin Role was assigned via PIM or a Group. The installer account needs **Direct Assignment** of the Power Platform Admin role."
    *   *The Licensing Trap:* "It's free to download, but not free to run. You need a Power Apps Premium, Power Automate Premium, and Power BI Pro license for the service account."
*   **The "Admin View" App:**
    *   *The Value:* This is your "Daily Driver." It's a Model-Driven App where you can search "John Smith" and see every app, flow, and connector he owns.
    *   *The Quarantine Reality:* "We can click a button to 'Quarantine' a Canvas App (blocking access). Crucially, **we cannot do this for Model-Driven Apps** due to platform limitations."

---

## Chapter 6b: The Toolset (Beyond just "Inventory") (5 min)
*Goal: Showcase the specific apps that solve the "Sprawl" and "Orphan" problems.*

### 🗣️ Leading the Conversation (The "Apps")
*   **The "Data Policy Impact Analysis" App:**
    *   *The Scenario:* "You want to block the 'Dropbox' connector. But if you do, will you break the CEO's favorite app?"
    *   *The Solution:* This app tells you exactly which apps/flows are using a connector *before* you block it. It prevents "Scream Tests."
*   **The "Manage Permissions" App:**
    *   *The Scenario:* "John leaves the company. His flows stop working. You can't edit them because you aren't the owner."
    *   *The Fix:* This app lets you search for "John", select his flows, and add yourself (or a service account) as the owner in two clicks.
*   **The "Developer Compliance Center" (The Synergy):**
    *   *The Pivot:* "We don't want IT to fill in spreadsheets. We want Makers to Self-Certify."
    *   *The Workflow:* The COE sends an automated email: "Hey, you built an app. Please log in and tell us what it does."
    *   *The Result:* The maker fills in "Business Justification" and "Risk Level" in the Developer Compliance Center. This data instantly syncs to your Admin View.

---

## Chapter 6c: The "Hidden" Configuration Gap (5 min)
*Goal: Reveal the limitations of standard tools and introduce "Configuration Drift."*

### ❓ Discovery Questions
*   "If you wanted to disable 'Copilot' in 500 environments tomorrow, would you click the box 500 times?"
*   "How do you ensure a local Admin hasn't turned 'Inactivity Timeout' off for their convenience?"
*   "Do you know which settings are missing from your 'Environment Groups'?"

### 🗣️ Leading the Conversation (The "Settings Enforcer")
*   **The Problem:** Many critical security settings (like AI toggles or Session Timeouts) live in the **Organization Table** of Dataverse.
*   **The "Admin Center Lie":** You might think "Managed Environments" handle everything. They handle *a lot*, but not everything (e.g., granular AI settings often lag behind).
*   **The "Drift" Risk:**
    *   *Scenario:* You set a 30-minute timeout for security.
    *   *The "Cheeky Admin":* A local admin finds it annoying and changes it back to 24 hours.
    *   *Result:* You are non-compliant and don't know it.
*   **The Automation Solution:**
    *   We recommend tools (like the community "Settings Enforcer") that define a **Policy** (JSON) and re-apply it every 24 hours.
    *   It effectively "Resets" any cheeky changes made by local admins, ensuring the environment stays in the desired state (Bronze/Silver/Gold standard).

---

## Chapter 6d: The "HTTP Black Box" & Secrets (5 min)
*Goal: Address the most dangerous connector: HTTP.*

### ❓ Discovery Questions
*   "You allow the HTTP connector... do you know *where* it is sending data?"
*   "If a developer leaves today, do you know how many Flows have hard-coded passwords pasted in plain text?"
*   "How do you stop a user from bypassing your firewall by hiding a URL inside a variable?"

### 🗣️ Leading the Conversation (The "Endpoint" Gap)
*   **The Problem:** The COE Kit tells you "John used the HTTP connector." It *does not* tell you if he called `api.mysompany.com` (Good) or `hacker-site.com` (Bad).
*   **The "Secret" Risk:**
    *   *Scenario:* Makers often hard-code API Keys and Passwords directly into the Flow action.
    *   *Risk:* Anyone with "Edit" access (or a Co-Owner) can see that password in plain text.
    *   *Solution:* We need a scanner that parses Flow Definitions to flag these "Secrets" and force makers to use Azure Key Vault.
*   **The "Dynamic URI" Loophole:**
    *   *The Exploit:* You block `google.com` in your DLP. A smart developer puts `google.com` into a **Variable** and passes that variable to the HTTP action.
    *   *The Result:* The DLP often checks "Design Time" values. Runtime variables can sometimes bypass these checks.
    *   *Verdict:* For high security, we must treat "Dynamic URIs" as high-risk anomalies that require manual code review.

---

## Chapter 6e: The "Safe Deployment" (ALM) (5 min)
*Goal: Move from "It works on my machine" to "It works everywhere."*

### ❓ Discovery Questions
*   "When you test a new feature, how do you make sure you don't accidentally email all your real customers?"
*   "Do you have 'Test Data' mixed in with your 'Real Data' in the same SharePoint List?"
*   "If you deploy a bug to Production, can you 'Undo' it in 5 minutes?"

### 🗣️ Leading the Conversation (Environment Variables)
*   **The "Safety Switch":**
    *   *Scenario:* You hardcode `AllStaff@company.com` in your app. You move it to Test. You click a button. You just spammed the whole company.
    *   *The Fix:* Use an **Environment Variable**. In Dev, it points to `Me`. In Test, it points to `QA Team`. In Prod, it points to `All Staff`. The app code never touches the address directly.
*   **The "Clean Data" Rule:**
    *   *The Problem:* Developers testing in Production create dummy records ("Test 1", "asdf"). They forget to delete them. Reports become inaccurate.
    *   *The Fix:* Use variables to point to a "Dev List" and a "Prod List". Same app, different data buckets.
*   **The "Pro Tip" (The Default Solution Hack):**
    *   *Panic Moment:* "I deployed to Production but the variable is wrong! I can't edit it because it's a Managed Solution!"
    *   *The Secret:* You *can* change it without redeploying. Go to the **Default Solution** -> **Environment Variables**. It allows you to edit the "Current Value" even for managed solutions. It is the only "Back Door" intended for Admins.

---

## Chapter 6f: The Future of Inventory (Preview) (5 min)
*Goal: Acknowledge the "Native Inventory" while defending the need for the COE Kit.*

### ❓ Discovery Questions
*   "Have you seen the new 'Inventory' tab in the Admin Center? It looks great, right?"
*   "But... can you *do* anything with it? Can you click a button to email the owner?"
*   "Are you ready for the 'Beginning of the End' of the COE Kit (but not yet)?"

### 🗣️ Leading the Conversation (Native vs. COE)
*   **The "Native Inventory" (The New Shiny):**
    *   *What it is:* A built-in Power BI report inside the Admin Center. It loads instantly and shows you Top Apps and Unique Users.
    *   *The Win:* You don't need to install anything. It works out of the box. It even tracks **Model Driven Apps Usage**, which the COE Kit struggles with.
    *   *The "Vibe" Apps:* It correctly identifies new "Vibe" (AI-generated) apps as Code-First apps.
*   **The Gap (Why we still need COE):**
    *   *Actionability:* The Native Inventory is "Look but don't touch." You can see a risky app, but you can't click to "Quarantine" or "Email Owner" or "Change Permissions."
    *   *The Verdict:* We use **Native Inventory** for quick insights ("How many apps do we have?") but we use the **COE Kit** for Operations ("I need to fix this app").
*   **The Preview Warning:**
    *   It is in Preview. The "Modified Date" is often just the "Saved Date" (not Published).
    *   It evolves weekly (e.g., "Agent Flows" appeared and disappeared). Do not build critical compliance processes on top of it yet.

---

## Chapter 7: Data Security & Implementation (10 min)
*Goal: Lock down the boundaries and discuss licensing.*

### ❓ Discovery Questions
*   "Are you subject to data residency laws (GDPR, etc.)? Do you have users in other regions?"
*   "What is your policy on 'Premium' connectors? Are you ready to pay for SQL/Dataverse connections?"
*   "Have you reviewed your 'Block by Default' policy for new connectors?"

### 🗣️ Leading the Conversation (The "Why")
*   **The "Block by Default" Win:** Explain that Microsoft releases new connectors constantly. If your policy is "Open," you are exposed every week. We need to set new connectors to "Blocked" by default.
*   **The Licensing Trap:** Discuss **Managed Environments**.
    *   *Caution:* It offers great governance features, BUT... enabling it on the Default environment could trigger a licensing bill for every single employee.
    *   *Recommendation:* Use Managed Environments strategically (e.g., for Production workflows), not everywhere.

---

## Wrap Up: The Rationalization Plan
*   **Question:** "Based on what we've discussed, does the current state feel sustainable?"
*   **Next Step:** Propose a "Discovery & Assessment" phase to inventory what they have before turning on the new controls.
