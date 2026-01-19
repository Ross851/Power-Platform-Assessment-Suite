# Power Platform Governance - Quick Reference Card

**Version:** 1.0 | **Last Updated:** January 2026

*Print this page and keep it at your desk for quick governance decisions.*

---

## Day 1 Actions (Do These First)

| Action | Where | Why |
|--------|-------|-----|
| Set DLP default to **BLOCKED** | Admin Center > Data Policies | Prevents new risky connectors from auto-enabling |
| Restrict Production env creation | Admin Center > Tenant Settings | Prevents capacity sprawl |
| Enable Default Environment Routing | Admin Center > Tenant Settings | Auto-redirects makers to personal environments |
| Enable Weekly Digest emails | Admin Center > Tenant Settings | Passive visibility with zero effort |
| Assign Security Groups to all environments | Each environment settings | Prevents "everyone in AD" from appearing in user tables |

---

## The Three Containers

| Container | Purpose | Environment Type | Who Uses It |
|-----------|---------|------------------|-------------|
| **1. Default** | Personal productivity only | Standard (NOT Managed) | End users for simple SharePoint apps |
| **2. Personal Dev** | Individual maker sandbox | Standard or Managed | One maker per environment |
| **3. ALM Pipeline** | Production workloads | DEV > BUILD > UAT > PROD | IT-managed solutions |

---

## Environment Decision Tree

```
Is this for production use?
    |
    +-- NO --> Use Personal Developer Environment
    |
    +-- YES --> Does it need Managed Environment features?
                    |
                    +-- NO --> Standard Environment (lower cost)
                    |
                    +-- YES --> Managed Environment (ALL users need Premium license!)
```

---

## Solution Rules (Never Break These)

| Rule | Applies To |
|------|------------|
| Development = **UNMANAGED** | DEV environment |
| Production = **MANAGED** | UAT + PROD environments |
| Never edit Managed Solutions directly | PROD environment |
| Use Environment Variables for URLs/IDs | All environments |
| Use Connection References for credentials | All solutions |

---

## DLP Quick Reference

| Connector Group | Can Share Data With | Examples |
|-----------------|---------------------|----------|
| **Business** | Business only | Dataverse, SharePoint, Outlook |
| **Non-Business** | Non-Business only | Public APIs, External tools |
| **Blocked** | Nothing | HTTP, Social Media, File Sharing |

**Rule:** Block WINS. If blocked in ANY policy, it's blocked everywhere.

---

## Licensing Cheat Sheet

| Scenario | License Required |
|----------|------------------|
| Building in Personal Dev Environment | Developer Plan (FREE) |
| Running app in Standard Environment | Depends on connectors used |
| Running app in **Managed Environment** | Premium License (ALWAYS) |
| Using Premium Connector (SQL, Dataverse) | Premium License |

**Warning:** Managed Environment = Premium license for EVERY user, even for simple apps!

---

## CoE Starter Kit - What Can/Cannot Do

| Can Do | Cannot Do |
|--------|-----------|
| Quarantine Canvas Apps | Quarantine Model-Driven Apps |
| Inventory all apps/flows | Run without Premium licenses |
| Reassign orphaned resources | Work with PIM-elevated accounts (use direct role) |
| Send compliance emails | Replace Native Inventory for usage stats |

---

## Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Power Platform Admin | __________________ | __________________ |
| IT Security | __________________ | __________________ |
| Licensing Manager | __________________ | __________________ |

---

## Key Admin URLs

| Resource | URL |
|----------|-----|
| Admin Center | https://admin.powerplatform.microsoft.com |
| Maker Portal | https://make.powerapps.com |
| CoE Dashboard | https://[your-org].crm.dynamics.com |
| Azure DevOps | https://dev.azure.com/[your-org] |

---

## When to Escalate

| Situation | Action |
|-----------|--------|
| User requests blocked connector | Submit Connector Request form - don't just unblock |
| App has no owner (orphaned) | Use CoE "Manage Permissions" app |
| Production app breaking | Check Solution Layers for Active customizations |
| Licensing questions | Consult Licensing Manager before enabling Managed |
| Data residency concerns | Verify environment region matches compliance requirements |

---

*For detailed information, see the full [Environmental Strategy](./Power_Platform_Environmental_Strategy.md) document.*
