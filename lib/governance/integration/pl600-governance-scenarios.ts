// PL-600 QUESTIONS DERIVED FROM CONSULTING ENGAGEMENT (JAN 2026)
// Focus Area: Solution Architecture - Environment Strategy & Security

export const governanceScenarios = [
  // SCENARIO 1: DEFAULT ENVIRONMENT RISK (From Top Tips & Strategy)
  {
    id: "PL600-GOV-001",
    question_text: "You are the Solution Architect for a large enterprise with 5,000 users. The IT Security Director demands that the Default Environment be secured immediately without blocking personal productivity. You need to implement a strategy that prevents accidental data leaks while avoiding massive licensing costs. \n\nWhich three actions should you perform? (Choose three)",
    question_type: "multiple-choice", // Note: Multi-select logic would be 'multiple-choice' in this tool's schema, often with specialized options
    options: [
      { id: "a", text: "Rename the Default Environment to 'Personal Productivity'", isCorrect: true },
      { id: "b", text: "Enable 'Managed Environments' on the Default Environment", isCorrect: false },
      { id: "c", text: "Configure Default Environment Routing to direct makers to personal developer environments", isCorrect: true },
      { id: "d", text: "Set the Default DLP Policy to block all new connectors by default", isCorrect: true },
      { id: "e", text: "Remove the 'Environment Maker' role from all users in the Default Environment", isCorrect: false }
    ],
    explanation: {
      correct: "Renaming clarifies intent (A). Routing clears clutter (C). Blocking new connectors prevents zero-day leaks (D).",
      incorrect: {
        "b": "Enabling 'Managed Environments' on Default would trigger premium licensing for ALL 5,000 users running any app, costing thousands.",
        "e": "You cannot remove the 'Environment Maker' role from the Default Environment; it is assigned to 'Everyone' by design."
      },
      question_breakdown: {
        key_phrases: [
          { phrase: "without blocking personal productivity", significance: "Means we can't just disable the environment completely" },
          { phrase: "avoiding massive licensing costs", significance: "Strong hint to avoid Managed Environments on Default" }
        ],
        critical_thinking: {
           trade_offs_to_evaluate: [
             "Security vs Cost: Managed Env is more secure but expensive.",
             "Usability vs Control: Routing changes maker behavior."
           ]
        }
      }
    },
    exam_area: "architecture",
    difficulty: 4,
    tags: ["environment-strategy", "licensing", "security"],
    microsoft_learn_url: "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/secure-default-environment"
  },

  // SCENARIO 2: ALM MATURITY (From Junior Dev Guide)
  {
    id: "PL600-GOV-002",
    question_text: "A development team is deploying a solution to Production. They are currently using 'Unmanaged Solutions' for all environments because they find it easier to make quick fixes in Production. You observe that 'Environment Rot' is occurring, and deleted components remain in the system.\n\nWhat architecture change must you enforce to fix this?",
    question_type: "multiple-choice",
    options: [
      { id: "a", text: "Continue using Unmanaged Solutions but delete components manually", isCorrect: false },
      { id: "b", text: "Use Managed Solutions for Production to ensure 'sealed' deployments and clean differentiation", isCorrect: true },
      { id: "c", text: "Use Unmanaged Solutions but export them as 'Managed' before importing", isCorrect: false },
      { id: "d", text: "Restrict access to the Default Environment", isCorrect: false }
    ],
    explanation: {
      correct: "Managed Solutions act as a 'Sealed Box'. When deleted, they remove all their components, preventing environment rot. They also prevent direct editing in Prod (B).",
      incorrect: {
        "a": "Manual cleanup is error-prone and not scalable.",
        "c": "This is logically the same as B but phrased confusingly; the key is deploying *as* Managed.",
        "d": "Irrelevant to the solution layering issue."
      }
    },
    exam_area: "implementation",
    difficulty: 3,
    tags: ["alm", "solutions", "governance"],
    microsoft_learn_url: "https://learn.microsoft.com/en-us/power-platform/alm/solution-concepts-alm"
  },

   // SCENARIO 3: TENANT ISOLATION (From Workbook)
  {
    id: "PL600-GOV-003",
    question_text: "Your organization has a strict regulatory requirement to prevent users from connecting to Power Platform resources in unauthorized external tenants (e.g., a user connecting to their personal trial tenant from a corporate device).\n\nWhich feature should you implement?",
    question_type: "multiple-choice",
    options: [
      { id: "a", text: "Data Loss Prevention (DLP) Policies", isCorrect: false },
      { id: "b", text: "Tenant Isolation (Cross-Tenant Restrictions)", isCorrect: true },
      { id: "c", text: "Conditional Access Policies", isCorrect: false },
      { id: "d", text: "Environment Security Groups", isCorrect: false }
    ],
    explanation: {
      correct: "Tenant Isolation (Cross-Tenant Restrictions) specifically controls inbound and outbound connections to other Azure AD tenants (B).",
      incorrect: {
        "a": "DLP controls *connectors* (e.g., Twitter, SQL), not *tenants*.",
        "c": "Conditional Access is for Identity/Device compliance, not specifically tenant-to-tenant isolation logic (though related).",
        "d": "Security groups control access *within* your tenant environments."
      }
    },
    exam_area: "architecture",
    difficulty: 4,
    tags: ["security", "tenant-level", "compliance"],
    microsoft_learn_url: "https://learn.microsoft.com/en-us/power-platform/admin/cross-tenant-restrictions"
  }
];
