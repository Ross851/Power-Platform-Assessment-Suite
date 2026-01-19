# Governance Integration Modules

This directory contains TypeScript modules that integrate Power Platform governance assessment questions derived from comprehensive governance deliverables (January 2026).

## 📂 Files Overview

### Assessment Question Modules

#### `governance-workbook-questions.ts`
**Source:** [Governance Implementation Workbook](/docs/governance/Implementation_Workbook.md)

Contains assessment questions covering:
- **Tenant Configuration:** Tenant Isolation, Admin Digest, Cross-Tenant Restrictions
- **DLP Strategy:** Block-by-Default policy configuration
- **Environment Strategy:** Default Environment naming, Managed Environment licensing risks, Default Environment Routing

**Export:**
- `workbookTenantQuestions: Question[]`
- `workbookDlpQuestions: Question[]`
- `workbookEnvQuestions: Question[]`
- `workbookAssessmentStandard: AssessmentStandard`

---

#### `environmental-strategy-questions.ts`
**Source:** [Power Platform Environmental Strategy](/docs/governance/Environmental_Strategy.md)

Contains assessment questions covering:
- **Risk Assessment:** Compliance (data residency), Operational (rollback plans), Audit (deployment tracking)
- **Phase 1 Prerequisites:** Environment inventory, solution criticality classification

**Export:**
- `strategyRiskQuestions: Question[]`
- `strategyPhase1Questions: Question[]`
- `strategyAssessmentStandard: AssessmentStandard`

---

#### `pl600-governance-scenarios.ts`
**Source:** Multiple governance deliverables

Contains PL-600 exam-style scenario-based questions covering:
- **Scenario 1:** Default Environment security at scale (5,000 users) - balancing security, cost, and productivity
- **Scenario 2:** ALM maturity and solution layering - Managed vs Unmanaged solutions
- **Scenario 3:** Tenant Isolation for regulatory compliance

**Export:**
- `governanceScenarios` - Array of complex scenario questions with detailed explanations

---

## 🚀 Usage Examples

### Adding to Assessment Standards

To integrate these questions into the main assessment suite, import them into your constants file:

```typescript
// In lib/constants.ts or similar
import { workbookAssessmentStandard } from "./governance/integration/governance-workbook-questions"
import { strategyAssessmentStandard } from "./governance/integration/environmental-strategy-questions"

export const ASSESSMENT_STANDARDS: AssessmentStandard[] = [
  // ... existing standards
  workbookAssessmentStandard,
  strategyAssessmentStandard,
]
```

### Using Individual Question Sets

You can also import specific question groups for custom assessments:

```typescript
import {
  workbookTenantQuestions,
  workbookDlpQuestions
} from "./governance/integration/governance-workbook-questions"

// Create a security-focused assessment
const securityAssessment = {
  name: "Power Platform Security Assessment",
  questions: [
    ...workbookTenantQuestions,
    ...workbookDlpQuestions
  ]
}
```

### PL-600 Exam Tool Integration

For PL-600 exam preparation tools:

```typescript
import { governanceScenarios } from "./governance/integration/pl600-governance-scenarios"

// Add to your question bank
const allExamQuestions = [
  ...existingQuestions,
  ...governanceScenarios
]
```

---

## 🔗 Related Documentation

### Governance Documentation
All questions are derived from comprehensive governance documentation in `/docs/governance/`:

- [Implementation Workbook](/docs/governance/Implementation_Workbook.md) - 8-part implementation guide
- [Environmental Strategy](/docs/governance/Environmental_Strategy.md) - Three-container architecture
- [Top Tips and Talking Points](/docs/governance/Top_Tips_and_Talking_Points.md) - Strategic guidance
- [Junior Developer Guide](/docs/governance/Junior_Developer_Guide.md) - Maker onboarding
- [Justification and Citations](/docs/governance/Justification_and_Citations.md) - Evidence-based rationale
- [Glossary](/docs/governance/Glossary.md) - Terminology reference
- [Quick Reference Card](/docs/governance/Quick_Reference_Card.md) - Desk reference
- [Workshop Script](/docs/governance/Workshop_Script.md) - Discovery workshop guide

### Assessment Documentation
- [Main Assessment Suite README](../../../README.md)
- [Governance Documentation Index](/docs/governance/README.md)

---

## 📊 Assessment Standards Summary

### Governance Workbook Compliance (2026)
**Slug:** `implementation-workbook-compliance`
**Weight:** 20
**Questions:** 8 questions across Tenant, DLP, and Environment categories
**Focus:** Day-1 critical controls and configuration

### Environmental Strategy Alignment (2026)
**Slug:** `environmental-strategy-alignment`
**Weight:** 25
**Questions:** 5 questions covering risk mitigation and prerequisites
**Focus:** Strategic alignment and Phase 1 discovery

---

## 🎯 Key Topics Covered

### Tenant-Level Controls
- Tenant Isolation (Cross-Tenant Restrictions)
- Admin Digest email configuration
- AI Builder credits management

### DLP Strategy
- Block-by-Default connector policy
- Endpoint filtering
- Three-policy template approach

### Environment Strategy
- Default Environment securing and routing
- Personal Developer Environments
- Managed Environment licensing implications
- Geographic data residency

### ALM & Solutions
- Managed vs Unmanaged solutions
- Solution layering risks
- Environment Variables and Connection References
- CI/CD pipeline architecture

### Risk Management
- Compliance risks (data residency)
- Operational risks (rollback capability)
- Audit risks (deployment tracking)

---

## 📝 Question Metadata

All questions include:
- **ID:** Unique identifier
- **Text:** Question content
- **Type:** boolean, scale, percentage, etc.
- **Weight:** Scoring weight (1-5)
- **Importance:** Business criticality (1-5)
- **Category:** Topical grouping
- **Guidance:** Implementation advice
- **References:** Microsoft Learn URLs (where applicable)

---

## 🔄 Maintenance

These modules are based on January 2026 Microsoft guidance. As the Power Platform evolves:

1. Review questions quarterly for relevance
2. Update Microsoft Learn URLs if they change
3. Add new questions as governance best practices emerge
4. Deprecate outdated questions with clear migration notes

---

**Last Updated:** January 2026
**Source Documentation:** `/docs/governance/` deliverables
