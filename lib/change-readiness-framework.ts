// Organizational Change Readiness Framework for Power Platform

export interface ChangeReadinessAssessment {
  organizationName: string
  assessmentDate: Date
  overallReadinessScore: number // 0-100
  dimensions: ChangeReadinessDimension[]
  stakeholderAnalysis: StakeholderGroup[]
  changeCapacity: ChangeCapacity
  recommendations: ChangeRecommendation[]
  transformationRoadmap: TransformationPhase[]
}

export interface ChangeReadinessDimension {
  name: string
  description: string
  score: number // 0-100
  maturityLevel: "Initial" | "Developing" | "Defined" | "Managed" | "Optimized"
  strengths: string[]
  gaps: string[]
  criticalSuccessFactors: string[]
}

export interface StakeholderGroup {
  name: string
  impactLevel: "High" | "Medium" | "Low"
  influenceLevel: "High" | "Medium" | "Low"
  currentEngagement: "Champion" | "Supporter" | "Neutral" | "Skeptic" | "Blocker"
  desiredEngagement: "Champion" | "Supporter" | "Neutral"
  engagementStrategy: string
  keyMessages: string[]
  communicationChannels: string[]
}

export interface ChangeCapacity {
  currentChangeLoad: number // Number of concurrent initiatives
  changeCapacityScore: number // 0-100
  changeFatigue: "Low" | "Medium" | "High"
  previousChangeSuccess: number // Success rate percentage
  keyConstraints: string[]
  enablers: string[]
}

export interface ChangeRecommendation {
  priority: "Critical" | "High" | "Medium" | "Low"
  dimension: string
  recommendation: string
  expectedImpact: string
  requiredInvestment: {
    time: string
    budget: string
    resources: string
  }
  quickWins: string[]
}

export interface TransformationPhase {
  phase: string
  duration: string
  objectives: string[]
  keyActivities: string[]
  milestones: string[]
  successMetrics: string[]
  risks: string[]
}

// Change Readiness Dimensions
export const changeReadinessDimensions: ChangeReadinessDimension[] = [
  {
    name: "Leadership Commitment",
    description: "Executive and management support for Power Platform transformation",
    score: 0,
    maturityLevel: "Initial",
    strengths: [],
    gaps: [
      "Limited visible executive sponsorship",
      "Inconsistent messaging from leadership",
      "Lack of dedicated change budget"
    ],
    criticalSuccessFactors: [
      "CEO/Board champion identified",
      "Executive steering committee established",
      "Leaders modeling desired behaviors",
      "Change integrated into performance goals"
    ]
  },
  {
    name: "Culture & Mindset",
    description: "Organizational culture supporting innovation and citizen development",
    score: 0,
    maturityLevel: "Initial",
    strengths: [],
    gaps: [
      "Risk-averse culture",
      "Siloed working practices",
      "Limited innovation mindset"
    ],
    criticalSuccessFactors: [
      "Innovation is rewarded and celebrated",
      "Failure is treated as learning",
      "Cross-functional collaboration is norm",
      "Digital-first mindset prevalent"
    ]
  },
  {
    name: "Skills & Capabilities",
    description: "Digital skills and Power Platform competencies across the organization",
    score: 0,
    maturityLevel: "Initial",
    strengths: [],
    gaps: [
      "Low digital literacy baseline",
      "Limited Power Platform expertise",
      "Insufficient change management capability"
    ],
    criticalSuccessFactors: [
      "Comprehensive training program in place",
      "Power Platform champions identified",
      "Career paths for citizen developers",
      "Continuous learning culture"
    ]
  },
  {
    name: "Communication & Engagement",
    description: "Effectiveness of change communication and stakeholder engagement",
    score: 0,
    maturityLevel: "Initial",
    strengths: [],
    gaps: [
      "One-way communication dominant",
      "Limited feedback mechanisms",
      "Inconsistent messaging"
    ],
    criticalSuccessFactors: [
      "Multi-channel communication strategy",
      "Regular two-way dialogue",
      "Success stories widely shared",
      "Clear and compelling vision communicated"
    ]
  },
  {
    name: "Governance & Structure",
    description: "Organizational structures and governance supporting Power Platform adoption",
    score: 0,
    maturityLevel: "Initial",
    strengths: [],
    gaps: [
      "Unclear roles and responsibilities",
      "Traditional IT-centric governance",
      "Limited business-IT collaboration"
    ],
    criticalSuccessFactors: [
      "Federated governance model implemented",
      "Clear RACI for citizen development",
      "Business-led innovation governance",
      "Agile decision-making processes"
    ]
  },
  {
    name: "Technology Readiness",
    description: "Technical infrastructure and integration readiness for Power Platform",
    score: 0,
    maturityLevel: "Initial",
    strengths: [],
    gaps: [
      "Legacy system constraints",
      "Data quality issues",
      "Limited API availability"
    ],
    criticalSuccessFactors: [
      "Modern integration architecture",
      "Clean and accessible data",
      "Cloud-first infrastructure",
      "Security by design"
    ]
  }
]

// Stakeholder Analysis Framework
export const stakeholderGroups: StakeholderGroup[] = [
  {
    name: "C-Suite Executives",
    impactLevel: "High",
    influenceLevel: "High",
    currentEngagement: "Neutral",
    desiredEngagement: "Champion",
    engagementStrategy: "Executive briefings on strategic value, competitive advantage, and ROI",
    keyMessages: [
      "Power Platform as strategic enabler for digital transformation",
      "Competitive advantage through citizen development",
      "Measurable business value and ROI"
    ],
    communicationChannels: ["Board presentations", "Executive dashboards", "1:1 briefings"]
  },
  {
    name: "Middle Management",
    impactLevel: "High",
    influenceLevel: "High",
    currentEngagement: "Skeptic",
    desiredEngagement: "Supporter",
    engagementStrategy: "Address concerns about control and quality, showcase success stories",
    keyMessages: [
      "Empowerment, not replacement",
      "Enhanced team productivity and innovation",
      "Maintained governance and control"
    ],
    communicationChannels: ["Manager workshops", "Team meetings", "Success showcases"]
  },
  {
    name: "IT Department",
    impactLevel: "High",
    influenceLevel: "Medium",
    currentEngagement: "Skeptic",
    desiredEngagement: "Supporter",
    engagementStrategy: "Position as enablers and architects of citizen development",
    keyMessages: [
      "Evolution from gatekeepers to enablers",
      "Focus on high-value technical work",
      "Maintained security and governance"
    ],
    communicationChannels: ["Technical forums", "Architecture reviews", "CoE collaboration"]
  },
  {
    name: "Business Users",
    impactLevel: "High",
    influenceLevel: "Medium",
    currentEngagement: "Neutral",
    desiredEngagement: "Champion",
    engagementStrategy: "Demonstrate personal value and career growth opportunities",
    keyMessages: [
      "Solve your own business problems",
      "Build valuable digital skills",
      "Career advancement opportunities"
    ],
    communicationChannels: ["Training sessions", "Hackathons", "Community forums"]
  },
  {
    name: "Risk & Compliance",
    impactLevel: "Medium",
    influenceLevel: "High",
    currentEngagement: "Blocker",
    desiredEngagement: "Supporter",
    engagementStrategy: "Demonstrate robust governance and compliance frameworks",
    keyMessages: [
      "Enhanced compliance through automation",
      "Improved audit trails and controls",
      "Risk reduction through standardization"
    ],
    communicationChannels: ["Compliance reviews", "Risk workshops", "Audit demonstrations"]
  }
]

// Change Capacity Assessment
export function assessChangeCapacity(
  currentInitiatives: number,
  recentChangeSuccesses: number,
  recentChangeFailures: number,
  employeeSentiment: number // 1-5 scale
): ChangeCapacity {
  // Calculate change capacity score
  const initiativeLoad = Math.max(0, 100 - (currentInitiatives * 10))
  const successRate = recentChangeSuccesses + recentChangeFailures > 0
    ? (recentChangeSuccesses / (recentChangeSuccesses + recentChangeFailures)) * 100
    : 50
  const sentimentScore = (employeeSentiment / 5) * 100
  
  const changeCapacityScore = Math.round((initiativeLoad + successRate + sentimentScore) / 3)

  // Determine change fatigue level
  let changeFatigue: ChangeCapacity["changeFatigue"] = "Low"
  if (currentInitiatives > 5 || sentimentScore < 40) {
    changeFatigue = "High"
  } else if (currentInitiatives > 3 || sentimentScore < 60) {
    changeFatigue = "Medium"
  }

  const keyConstraints: string[] = []
  const enablers: string[] = []

  // Identify constraints
  if (currentInitiatives > 5) {
    keyConstraints.push("High concurrent change load")
  }
  if (successRate < 50) {
    keyConstraints.push("History of change failures")
  }
  if (sentimentScore < 60) {
    keyConstraints.push("Low employee morale")
  }

  // Identify enablers
  if (successRate > 70) {
    enablers.push("Strong track record of successful change")
  }
  if (sentimentScore > 80) {
    enablers.push("High employee engagement")
  }
  if (currentInitiatives < 3) {
    enablers.push("Available change capacity")
  }

  return {
    currentChangeLoad: currentInitiatives,
    changeCapacityScore,
    changeFatigue,
    previousChangeSuccess: Math.round(successRate),
    keyConstraints,
    enablers
  }
}

// Generate Change Recommendations
export function generateChangeRecommendations(
  dimensions: ChangeReadinessDimension[]
): ChangeRecommendation[] {
  const recommendations: ChangeRecommendation[] = []

  dimensions.forEach(dimension => {
    if (dimension.score < 40) {
      // Critical recommendations for low-scoring dimensions
      recommendations.push({
        priority: "Critical",
        dimension: dimension.name,
        recommendation: `Urgent action required to address ${dimension.name} gaps`,
        expectedImpact: "Foundation for successful transformation",
        requiredInvestment: {
          time: "3-6 months",
          budget: "$100K-$500K",
          resources: "Dedicated change team required"
        },
        quickWins: dimension.criticalSuccessFactors.slice(0, 2)
      })
    } else if (dimension.score < 70) {
      // High priority recommendations for medium-scoring dimensions
      recommendations.push({
        priority: "High",
        dimension: dimension.name,
        recommendation: `Strengthen ${dimension.name} to support scaled adoption`,
        expectedImpact: "Accelerated adoption and value realization",
        requiredInvestment: {
          time: "2-4 months",
          budget: "$50K-$200K",
          resources: "Part-time change resources"
        },
        quickWins: dimension.criticalSuccessFactors.slice(0, 1)
      })
    }
  })

  return recommendations.sort((a, b) => {
    const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// Transformation Roadmap Generator
export function generateTransformationRoadmap(
  readinessScore: number,
  changeCapacity: ChangeCapacity
): TransformationPhase[] {
  const roadmap: TransformationPhase[] = []

  // Phase 1: Foundation (Always required)
  roadmap.push({
    phase: "Foundation Building",
    duration: "3-4 months",
    objectives: [
      "Establish executive sponsorship and governance",
      "Build core change team and capabilities",
      "Define vision and success metrics",
      "Address critical readiness gaps"
    ],
    keyActivities: [
      "Executive alignment workshops",
      "Change team formation and training",
      "Stakeholder analysis and engagement planning",
      "Quick wins identification and delivery"
    ],
    milestones: [
      "Executive steering committee formed",
      "Change management plan approved",
      "First quick wins delivered",
      "Baseline metrics established"
    ],
    successMetrics: [
      "Executive sponsor engagement score > 80%",
      "Change team fully staffed and trained",
      "3+ quick wins delivered",
      "Stakeholder engagement plan activated"
    ],
    risks: [
      "Lack of executive commitment",
      "Insufficient change resources",
      "Competing priorities"
    ]
  })

  // Phase 2: Pilot (Adjusted based on readiness)
  if (readinessScore >= 40) {
    roadmap.push({
      phase: "Controlled Pilot",
      duration: "4-6 months",
      objectives: [
        "Validate approach with controlled pilot groups",
        "Build success stories and champions",
        "Refine governance and support models",
        "Develop citizen developer capabilities"
      ],
      keyActivities: [
        "Select and launch pilot projects",
        "Citizen developer training program",
        "Success story capture and communication",
        "Governance model refinement"
      ],
      milestones: [
        "5-10 pilot projects launched",
        "First citizen developers certified",
        "Governance framework operational",
        "Success stories documented"
      ],
      successMetrics: [
        "80% pilot project success rate",
        "20+ certified citizen developers",
        "Positive stakeholder feedback > 70%",
        "Measurable business value delivered"
      ],
      risks: [
        "Pilot failures damaging credibility",
        "Insufficient support for pilots",
        "Governance bottlenecks"
      ]
    })
  }

  // Phase 3: Scale (Only if ready)
  if (readinessScore >= 60 && changeCapacity.changeFatigue !== "High") {
    roadmap.push({
      phase: "Scaled Adoption",
      duration: "6-12 months",
      objectives: [
        "Scale to enterprise-wide adoption",
        "Embed into business as usual",
        "Realize significant business value",
        "Build sustainable capability"
      ],
      keyActivities: [
        "Enterprise rollout plan execution",
        "Scaled training and certification",
        "CoE maturation and scaling",
        "Value tracking and optimization"
      ],
      milestones: [
        "100+ active citizen developers",
        "50+ production solutions",
        "CoE fully operational",
        "ROI targets achieved"
      ],
      successMetrics: [
        "30% of target users actively engaged",
        "$5M+ annual value delivered",
        "90% user satisfaction",
        "Self-sustaining community established"
      ],
      risks: [
        "Scale complexity overwhelming governance",
        "Quality issues at scale",
        "Benefits realization gaps"
      ]
    })
  }

  // Phase 4: Optimize (For mature organizations)
  if (readinessScore >= 80) {
    roadmap.push({
      phase: "Optimization & Innovation",
      duration: "Ongoing",
      objectives: [
        "Continuous improvement and innovation",
        "Advanced capabilities development",
        "Strategic competitive advantage",
        "Next-generation transformation"
      ],
      keyActivities: [
        "Innovation lab establishment",
        "Advanced use case development",
        "External partnership exploration",
        "Next-gen technology adoption"
      ],
      milestones: [
        "Innovation lab operational",
        "Industry recognition achieved",
        "Strategic partnerships formed",
        "Next-gen capabilities deployed"
      ],
      successMetrics: [
        "Industry-leading maturity scores",
        "Breakthrough innovations delivered",
        "Competitive advantage demonstrated",
        "Cultural transformation complete"
      ],
      risks: [
        "Innovation fatigue",
        "Complacency risk",
        "Technology disruption"
      ]
    })
  }

  return roadmap
}

// Executive Change Readiness Summary
export interface ExecutiveChangeReadinessSummary {
  overallReadiness: "Not Ready" | "Emerging" | "Developing" | "Ready" | "Advanced"
  readinessScore: number
  keyStrengths: string[]
  criticalGaps: string[]
  recommendedApproach: string
  estimatedTimeToReadiness: string
  investmentRequired: {
    lowEstimate: number
    highEstimate: number
  }
  expectedROI: string
  executiveActions: string[]
}

export function generateExecutiveChangeReadinessSummary(
  assessment: ChangeReadinessAssessment
): ExecutiveChangeReadinessSummary {
  const score = assessment.overallReadinessScore

  let overallReadiness: ExecutiveChangeReadinessSummary["overallReadiness"]
  let recommendedApproach: string
  let estimatedTimeToReadiness: string

  if (score < 30) {
    overallReadiness = "Not Ready"
    recommendedApproach = "Foundation building required before Power Platform adoption"
    estimatedTimeToReadiness = "12-18 months"
  } else if (score < 50) {
    overallReadiness = "Emerging"
    recommendedApproach = "Targeted capability building with limited pilots"
    estimatedTimeToReadiness = "6-12 months"
  } else if (score < 70) {
    overallReadiness = "Developing"
    recommendedApproach = "Phased rollout with continuous capability building"
    estimatedTimeToReadiness = "3-6 months"
  } else if (score < 85) {
    overallReadiness = "Ready"
    recommendedApproach = "Full adoption with focus on optimization"
    estimatedTimeToReadiness = "Ready now"
  } else {
    overallReadiness = "Advanced"
    recommendedApproach = "Innovation and transformation leadership"
    estimatedTimeToReadiness = "Ready for advanced scenarios"
  }

  // Extract key strengths and gaps
  const keyStrengths = assessment.dimensions
    .filter(d => d.score >= 70)
    .map(d => d.name)
    .slice(0, 3)

  const criticalGaps = assessment.dimensions
    .filter(d => d.score < 50)
    .map(d => d.name)
    .slice(0, 3)

  // Calculate investment required
  const investmentRequired = {
    lowEstimate: criticalGaps.length * 100000 + (6 - keyStrengths.length) * 50000,
    highEstimate: criticalGaps.length * 300000 + (6 - keyStrengths.length) * 150000
  }

  // Executive actions
  const executiveActions = [
    "Appoint executive sponsor and steering committee",
    "Allocate dedicated change management budget",
    "Communicate vision and commitment organization-wide",
    "Establish success metrics and review cadence",
    "Remove organizational barriers to adoption"
  ]

  return {
    overallReadiness,
    readinessScore: score,
    keyStrengths,
    criticalGaps,
    recommendedApproach,
    estimatedTimeToReadiness,
    investmentRequired,
    expectedROI: "200-400% based on industry benchmarks",
    executiveActions
  }
}