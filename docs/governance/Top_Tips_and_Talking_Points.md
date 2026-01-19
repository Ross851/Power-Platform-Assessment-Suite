# Power Platform Governance: Top Tips & Talking Points

**Version:** 1.0 | **Last Updated:** January 2026 | **Audience:** Consultants, IT Admins

> **Related Documents:**
> - [Environmental Strategy](./Power_Platform_Environmental_Strategy.md) - Full implementation brief
> - [Implementation Workbook](./Governance_Implementation_Workbook.md) - Configuration templates
> - [Justification & Citations](./Justification_and_Citations.md) - Microsoft evidence for recommendations
> - [Workshop Script](./Governance_Workshop_Script.md) - Client discovery conversation guide

---

## Executive Summary
This document consolidates key "top tips" and strategic talking points derived from expert discussions and Microsoft best practices. It is designed to guide client conversations around governance, security, and environment strategy.

---

## 1. Quick Wins & "Must Dos"
*Immediate actions that provide high value with low effort.*

### [CRITICAL] "Block by Default" Strategy
*   **The Tip:** Change your Data Loss Prevention (DLP) policy to treat *new* connectors as **Blocked** by default.
*   **Why:** Microsoft releases new connectors constantly. If your default policy is "Non-Business" (the standard setting), any new connector - even a risky one - is instantly available to all makers until an admin manually blocks it.
*   **How:** Admin Center > Data Policies > "Set default group" > Select **Blocked**.

### [ACTION] Secure the Environment Creation Process
*   **The Tip:** Restrict who can create specific environment types.
*   **Talking Point:** "By default, any user can create a Developer, Trial, or even Production environment (depending on license). We must restrict this to Admins only."
*   **Action:**
    *   **Production/Sandbox:** Restrict to specific Admin groups via Tenant Settings.
    *   **Trial:** Restrict to Admins to prevent "shadow trials" that expire and break apps.
    *   **Developer:** Restrict to Admins (or rely on the "Personal Productivity" routing strategy below).

### [TIP] Weekly Digest Emails
*   **The Tip:** Ensure the "Weekly Digest" setting is enabled for Admins.
*   **Benefit:** Provides a zero-effort passive visibility report on what is happening in the tenant (active apps, new flows) delivered directly to your inbox.

---

## 2. Environment Strategy & Architecture

### [STRATEGY] The "Personal Productivity" Container (Default Environment)
*   **The Tip:** Do **NOT** enable "Managed Environments" on the Default Environment unless you have a comprehensive licensing strategy.
*   **The "Gotcha":**
    *   Standard (E3/E5) users can build SharePoint apps in the Default Environment for free.
    *   If you make it "Managed," **EVERY** user running those simple apps suddenly requires a Premium License.
    *   *Recommendation:* Keep it standard, but rename it "Personal Productivity" and use DLP policies to restrict it to O365 connectors only.

### [GAME CHANGER] Default Environment Routing
*   **The Tip:** Turn on **Default Environment Routing**.
*   **Talking Point:** "Instead of trying to train 5,000 users not to build in the Default Environment, let the platform enforce it."
*   **How it works:** When a maker tries to create an app in Default, they are automatically redirected to their own, private "Personal Developer Environment."
*   **Benefit:** Stops accidental sprawl in the shared Default environment instantly.

### [SECURITY] Tenant Isolation
*   **The Tip:** Enable Tenant Isolation to restrict cross-tenant connections (e.g., preventing your users from connecting to an external vendor's SQL database using their corporate credentials).
*   **Nuance:** It works on an "Allow List" basis. You block everything by default and explicitly allow specific trusted partner tenants (Inbound/Outbound).

---

## 3. Developer Best Practices (ALM)

### [RULE] Managed vs. Unmanaged
*   **The Tip:** "One Way Street".
    *   **Development:** Always **Unmanaged**.
    *   **Production:** Always **Managed**.
*   **Why:** Managed solutions are "locked." This prevents "Cowboy Coding" in production where someone makes a quick hotfix that gets overwritten by the next deployment.

### [BEST PRACTICE] Connection References & Environment Variables
*   **The Tip:** Never hardcode email addresses, SharePoint URLs, or Lists IDs in your apps/flows.
*   **Talking Point:** "If you hardcode a URL, you have to edit the app to move it from Dev to Prod. That breaks ALM."
*   **Solution:**
    *   Use **Environment Variables** for data sources (e.g., "SiteURL").
    *   Use **Connection References** to abstract the user credentials from the flow logic.

### [WARNING] Solution Layering
*   **The Tip:** Avoid "Active Layering."
*   **Explanation:** If a user manually edits a Managed Solution in Production, they create an "Active Layer" that sits *on top* of your managed solution. Future updates from IT will be hidden behind this manual layer.
*   **Fix:** Always verify "Solution Layers" before deploying updates to ensure no unmanaged changes are blocking your deployment.

---

## 4. Advanced Governance

*These are more advanced topics for organizations with mature governance needs.*

### [FEATURE] Native Inventory vs. CoE Starter Kit
*   **The Tip:** You might not need the full CoE Starter Kit immediately.
*   **New Feature:** Check out the **"Power Platform Inventory (Preview)"** in the Admin Center.
*   **Talking Point:** "The CoE Kit is fantastic but heavy to maintain. Microsoft is building a native 'Inventory' view that gives 80% of the visibility (widely shared apps, orphaned flows) with 0% of the maintenance overhead."

### [COST CONTROL] AI Builder & Credit Management
*   **The Tip:** Review the "AI Builder" tenant settings.
*   **Risk:** Default settings often allow makers to consume tenant-wide credits for features like document processing or chatbots.
*   **Action:** Restrict credit allocation to specific environments to prevent a single POC from draining the company's entire AI budget.

### [COMPLIANCE] Customer Lockbox
*   **The Tip:** For highly regulated industries, enable Customer Lockbox.
*   **Benefit:** This ensures that even Microsoft Support engineers cannot access your data to solve a ticket without your explicit, time-bound approval.

---

## Pre-Meeting Checklist
1.  [ ] **Confirm DLP "Block by Default" is On.**
2.  [ ] **Check who can create Production Environments.**
3.  [ ] **Discuss the "Default Environment Routing" strategy.**
4.  [ ] **Verify if "Native Inventory" meets their immediate needs before deploying CoE.**
