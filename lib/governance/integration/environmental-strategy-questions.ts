import type { AssessmentStandard, Question } from "../../types"

// QUESTIONS DERIVED FROM POWER_PLATFORM_ENVIRONMENTAL_STRATEGY.MD (JAN 2026)

export const strategyRiskQuestions: Question[] = [
  {
    id: "strat-risk-1",
    text: "Can you prove data residency compliance with specific environment-level geographic controls?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "Compliance Risk",
    guidance: "Strategy 'Business Risks' #1: Without geographic isolation, you cannot guarantee data remains within required borders (e.g., UK/EU/US).",
  },
  {
    id: "strat-risk-2",
    text: "Do you have a clear 'Rollback Plan' for production solutions that fail?",
    type: "boolean",
    weight: 5,
    importance: 5,
    category: "Operational Risk",
    guidance: "Strategy 'Business Risks' #3: Solutions deployed without ALM/Rollback capabilities cause business disruption that cannot be quickly fixed.",
  },
  {
    id: "strat-risk-3",
    text: "Is there an audit trail of WHO deployed WHAT, WHEN, and approved by WHOM?",
    type: "boolean",
    weight: 4,
    importance: 4,
    category: "Audit Risk",
    guidance: "Strategy 'Business Risks' #4: Regulatory requirements often demand deployment history and change tracking which manual deployments lack.",
  },
]

export const strategyPhase1Questions: Question[] = [
  {
    id: "strat-p1-1",
    text: "Has a full 'Environment Inventory' been completed (cataloging all apps/flows/owners)?",
    type: "boolean",
    weight: 3,
    importance: 5,
    category: "Prerequisites",
    guidance: "Phase 1: You cannot govern what you cannot see. Inventory must include business owners, usage patterns, and last modified dates.",
  },
  {
    id: "strat-p1-2",
    text: "Have solutions been classified by criticality (Critical vs Important vs Low)?",
    type: "scale",
    weight: 3,
    importance: 4,
    category: "Prerequisites",
    guidance: "Phase 1 Business Impact Analysis: Not all apps need the same level of governance. Classification allows for tiered ALM strategies.",
  },
]

// New Standard Definition to merge into constants.ts
export const strategyAssessmentStandard: AssessmentStandard = {
  slug: "environmental-strategy-alignment",
  name: "Environmental Strategy Alignment (2026)",
  weight: 25,
  description: "Assessment against the 'Power Platform Environmental Strategy' document, focusing on Risk Mitigation and Phase 1 Discovery prerequisites.",
  questions: [
    ...strategyRiskQuestions,
    ...strategyPhase1Questions
  ],
}
