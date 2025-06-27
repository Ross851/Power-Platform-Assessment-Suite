"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Target,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  FileSearch,
  Users,
  Shield,
  BarChart,
  Info
} from "lucide-react"

interface ScoringCriteria {
  score: string
  color: string
  criteria: string[]
  examples?: string[]
}

interface QuestionTypeGuide {
  type: string
  icon: React.ReactNode
  description: string
  howToAnswer: string[]
  scoringTips: string[]
}

const scoringCriteria: Record<string, ScoringCriteria> = {
  "0-25": {
    score: "0-25% (Red)",
    color: "destructive",
    criteria: [
      "No formal process or documentation exists",
      "Ad-hoc implementation with significant gaps",
      "High risk to security, compliance, or operations",
      "No awareness or training in place",
      "Critical best practices not followed"
    ],
    examples: [
      "No DLP policies configured",
      "No environment strategy documented",
      "No ALM process in place"
    ]
  },
  "26-50": {
    score: "26-50% (Amber)",
    color: "warning",
    criteria: [
      "Basic processes exist but not consistently followed",
      "Some documentation but outdated or incomplete",
      "Moderate risk with several gaps identified",
      "Limited training or awareness",
      "Some best practices followed but inconsistently"
    ],
    examples: [
      "DLP policies exist but don't cover all connectors",
      "Environment strategy documented but not enforced",
      "Manual ALM process without automation"
    ]
  },
  "51-75": {
    score: "51-75% (Amber/Green)",
    color: "warning",
    criteria: [
      "Processes documented and mostly followed",
      "Regular reviews and updates in place",
      "Low to moderate risk with minor gaps",
      "Good training coverage with some gaps",
      "Most best practices implemented"
    ],
    examples: [
      "DLP policies cover most scenarios with exceptions documented",
      "Environment strategy enforced with some flexibility",
      "Partially automated ALM with manual approvals"
    ]
  },
  "76-100": {
    score: "76-100% (Green)",
    color: "success",
    criteria: [
      "Mature, well-documented processes consistently followed",
      "Regular audits and continuous improvement",
      "Minimal risk with proactive monitoring",
      "Comprehensive training and certification program",
      "Industry best practices fully implemented"
    ],
    examples: [
      "Comprehensive DLP policies with regular reviews",
      "Automated environment provisioning with governance",
      "Fully automated ALM with quality gates"
    ]
  }
}

const questionTypeGuides: QuestionTypeGuide[] = [
  {
    type: "Yes/No Questions",
    icon: <CheckCircle className="h-5 w-5" />,
    description: "Binary questions about capability existence",
    howToAnswer: [
      "Check if the capability/process exists in any form",
      "Look for documented evidence or system configurations",
      "Interview stakeholders to confirm implementation",
      "Consider partial implementations as 'Yes' but note limitations"
    ],
    scoringTips: [
      "Yes = capability exists (score based on maturity)",
      "No = capability doesn't exist (typically 0-25%)",
      "Use evidence notes to justify partial implementations"
    ]
  },
  {
    type: "Percentage Questions",
    icon: <BarChart className="h-5 w-5" />,
    description: "Questions asking for coverage or adoption rates",
    howToAnswer: [
      "Gather quantitative data from systems or reports",
      "Calculate actual percentages (e.g., 45 of 60 users = 75%)",
      "Document your calculation method in evidence",
      "Consider both quantity and quality of adoption"
    ],
    scoringTips: [
      "Use actual calculated percentages when available",
      "Estimate conservatively if exact data unavailable",
      "Factor in quality, not just quantity"
    ]
  },
  {
    type: "Scale Questions (1-5)",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Maturity level questions on a 1-5 scale",
    howToAnswer: [
      "1 = Non-existent, 2 = Initial, 3 = Developing, 4 = Managed, 5 = Optimized",
      "Compare current state against maturity model criteria",
      "Look for evidence of process repeatability and measurement",
      "Consider automation and continuous improvement"
    ],
    scoringTips: [
      "Map scale to percentage: 1=0-20%, 2=21-40%, 3=41-60%, 4=61-80%, 5=81-100%",
      "Be realistic - few organizations achieve level 5",
      "Document specific examples for each level claimed"
    ]
  },
  {
    type: "Document Review Questions",
    icon: <FileSearch className="h-5 w-5" />,
    description: "Questions requiring document analysis",
    howToAnswer: [
      "Request and review relevant documentation",
      "Check document currency (last updated date)",
      "Verify documentation matches actual practice",
      "Upload key documents as evidence"
    ],
    scoringTips: [
      "No documentation = 0-25%",
      "Outdated documentation = 26-50%",
      "Current but incomplete = 51-75%",
      "Comprehensive and current = 76-100%"
    ]
  }
]

const stepByStepProcess = [
  {
    step: 1,
    title: "Understand the Question",
    actions: [
      "Read the question carefully and identify what's being assessed",
      "Note if it's asking about existence, maturity, or coverage",
      "Check the question type to understand expected answer format",
      "Review any provided guidance or context"
    ]
  },
  {
    step: 2,
    title: "Gather Information",
    actions: [
      "Use the 'Where to Find Information' guide for relevant sources",
      "Access admin centers and dashboards for current configurations",
      "Interview stakeholders (IT admins, business users, developers)",
      "Collect relevant documents, screenshots, and reports"
    ]
  },
  {
    step: 3,
    title: "Compare to Best Practices",
    actions: [
      "Review Microsoft Learn documentation for the specific area",
      "Check industry standards and compliance requirements",
      "Compare your findings against the maturity criteria",
      "Identify gaps between current state and best practices"
    ]
  },
  {
    step: 4,
    title: "Determine the Score",
    actions: [
      "Use the scoring criteria guide to select appropriate range",
      "Be objective and evidence-based in your assessment",
      "Consider both technical implementation and business adoption",
      "Factor in risk and impact of any gaps identified"
    ]
  },
  {
    step: 5,
    title: "Document Evidence",
    actions: [
      "Write clear evidence notes explaining your score",
      "Upload supporting documents and screenshots",
      "Add code snippets for technical implementations",
      "Include links to relevant policies or systems"
    ]
  }
]

export function ScoringGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          How to Answer Questions & Set Scores
        </CardTitle>
        <CardDescription>
          Comprehensive guide for conducting accurate assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="process" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="process">Process</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="types">Question Types</TabsTrigger>
            <TabsTrigger value="tips">Best Practices</TabsTrigger>
          </TabsList>

          <TabsContent value="process" className="space-y-4 mt-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Follow this step-by-step process for each question to ensure accurate and consistent assessments.
              </AlertDescription>
            </Alert>

            {stepByStepProcess.map((step) => (
              <Card key={step.step} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{step.title}</h4>
                    <ul className="space-y-1">
                      {step.actions.map((action, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="scoring" className="space-y-4 mt-4">
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                Use these criteria to determine the appropriate score based on your findings.
              </AlertDescription>
            </Alert>

            {Object.entries(scoringCriteria).map(([range, criteria]) => (
              <Card key={range} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{criteria.score}</h4>
                    <Badge variant={criteria.color as any}>
                      {criteria.color === "destructive" ? "High Risk" : 
                       criteria.color === "warning" ? "Medium Risk" : "Low Risk"}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Criteria:</p>
                    <ul className="space-y-1">
                      {criteria.criteria.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {criteria.examples && (
                    <div>
                      <p className="text-sm font-medium mb-2">Examples:</p>
                      <ul className="space-y-1">
                        {criteria.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground italic flex items-start gap-2">
                            <span className="text-muted-foreground">→</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="types" className="space-y-4 mt-4">
            <Alert>
              <FileSearch className="h-4 w-4" />
              <AlertDescription>
                Different question types require different approaches. Here's how to handle each type.
              </AlertDescription>
            </Alert>

            {questionTypeGuides.map((guide, idx) => (
              <Card key={idx} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {guide.icon}
                    <h4 className="font-medium">{guide.type}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">How to Answer:</p>
                    <ul className="space-y-1">
                      {guide.howToAnswer.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Scoring Tips:</p>
                    <ul className="space-y-1">
                      {guide.scoringTips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Target className="h-3 w-3 mt-0.5 text-blue-600 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-4 mt-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Follow these best practices to ensure high-quality, defensible assessments.
              </AlertDescription>
            </Alert>

            <Card className="p-4">
              <h4 className="font-medium mb-3">Assessment Best Practices</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Be Thorough
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li className="text-sm text-muted-foreground">• Don't rely on assumptions - verify everything</li>
                    <li className="text-sm text-muted-foreground">• Check multiple sources for consistency</li>
                    <li className="text-sm text-muted-foreground">• Interview multiple stakeholders</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Be Objective
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li className="text-sm text-muted-foreground">• Base scores on evidence, not opinions</li>
                    <li className="text-sm text-muted-foreground">• Avoid inflating scores to look good</li>
                    <li className="text-sm text-muted-foreground">• Document both strengths and weaknesses</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileSearch className="h-4 w-4" />
                    Be Specific
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li className="text-sm text-muted-foreground">• Provide detailed evidence notes</li>
                    <li className="text-sm text-muted-foreground">• Include dates, versions, and specifics</li>
                    <li className="text-sm text-muted-foreground">• Upload supporting documentation</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Be Collaborative
                  </p>
                  <ul className="space-y-1 ml-6">
                    <li className="text-sm text-muted-foreground">• Involve relevant stakeholders</li>
                    <li className="text-sm text-muted-foreground">• Validate findings with experts</li>
                    <li className="text-sm text-muted-foreground">• Share draft results for feedback</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 dark:bg-blue-950">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Common Pitfalls to Avoid
              </h4>
              <ul className="space-y-1">
                <li className="text-sm flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 text-red-600 flex-shrink-0" />
                  Scoring based on future plans instead of current state
                </li>
                <li className="text-sm flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 text-red-600 flex-shrink-0" />
                  Skipping questions that seem difficult or unclear
                </li>
                <li className="text-sm flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 text-red-600 flex-shrink-0" />
                  Not documenting evidence for scores given
                </li>
                <li className="text-sm flex items-start gap-2">
                  <XCircle className="h-3 w-3 mt-0.5 text-red-600 flex-shrink-0" />
                  Rushing through without proper investigation
                </li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 