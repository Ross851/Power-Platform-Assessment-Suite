"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Target,
  Lightbulb,
  FileText,
  Users,
  Shield,
  TrendingUp,
  Info
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { InformationSourcesGuide } from "./information-sources-guide"
import { ScoringGuide } from "./scoring-guide"
import { DeveloperQuickGuide } from "./developer-quick-guide"

interface GuidanceSection {
  title: string
  icon: React.ReactNode
  content: string[]
  tips?: string[]
}

const guidanceSections: GuidanceSection[] = [
  {
    title: "Getting Started",
    icon: <BookOpen className="h-5 w-5" />,
    content: [
      "Begin by creating a new assessment project with a descriptive name (e.g., 'Q1 2024 Contoso Assessment').",
      "The assessment covers 10 key areas of Power Platform maturity, each with weighted questions.",
      "Answer each question honestly based on your current state, not aspirational goals.",
      "Use the evidence/notes field to document specific examples, links, or justifications for your answers.",
    ],
    tips: [
      "Schedule dedicated time blocks for each assessment section - expect to spend multiple sessions per section as you gather information.",
      "Create a project plan with realistic timelines - allow several days per section for research and validation.",
      "Gather relevant documentation and schedule stakeholder interviews well in advance.",
      "Save your progress frequently - the application auto-saves to your browser's local storage.",
      "Consider assigning different sections to subject matter experts who can dedicate the necessary time.",
    ]
  },
  {
    title: "Understanding RAG Status",
    icon: <Target className="h-5 w-5" />,
    content: [
      "RED: Critical gaps requiring immediate attention. These represent high-risk areas that could impact security, compliance, or platform stability.",
      "AMBER: Areas needing improvement but not critical. These should be addressed in your roadmap planning.",
      "GREEN: Good maturity level achieved. Continue monitoring and maintaining these areas.",
      "GREY: Not yet assessed or not applicable to your organization.",
    ],
    tips: [
      "Focus remediation efforts on RED items first, especially those in Security and Compliance sections.",
      "AMBER items often indicate opportunities for quick wins and process improvements.",
      "Document why certain questions might not be applicable to your organization.",
    ]
  },
  {
    title: "Evidence Collection Best Practices",
    icon: <FileText className="h-5 w-5" />,
    content: [
      "Document specific examples: Instead of 'We have DLP policies', write 'DLP Policy v2.1 implemented across all production environments on 2024-01-15'.",
      "Include links to relevant documentation, SharePoint sites, or policy documents.",
      "Note any exceptions or edge cases that affect your answer.",
      "For percentage or scale questions, explain how you arrived at your assessment.",
    ],
    tips: [
      "Take screenshots of key configurations or dashboards and reference them in your notes.",
      "Interview multiple stakeholders to get a complete picture before answering.",
      "Use the document upload feature for critical governance documents or architectural diagrams.",
    ]
  },
  {
    title: "Stakeholder Engagement",
    icon: <Users className="h-5 w-5" />,
    content: [
      "Platform Owners: Engage for governance, security, and architectural questions.",
      "Business Users: Consult for adoption, training, and business value questions.",
      "IT Security: Critical for DLP, compliance, and security-related assessments.",
      "CoE Team: Primary source for governance processes and platform management.",
      "Executive Sponsors: Important for strategic alignment and investment questions.",
    ],
    tips: [
      "Schedule brief interviews (15-30 min) with key stakeholders for each section.",
      "Prepare specific questions based on the assessment areas before meetings.",
      "Share preliminary findings with stakeholders for validation before finalizing.",
    ]
  },
  {
    title: "Common Pitfalls to Avoid",
    icon: <AlertCircle className="h-5 w-5" />,
    content: [
      "Overestimating Maturity: Be realistic about your current state vs. planned improvements.",
      "Skipping Evidence: Always provide context and justification for your answers.",
      "Working in Isolation: This assessment requires input from multiple teams and perspectives.",
      "Ignoring Dependencies: Consider how different areas interconnect (e.g., ALM depends on environment strategy).",
    ],
    tips: [
      "If unsure between two answers, choose the more conservative option and note your uncertainty.",
      "Review Microsoft's official best practices documentation for each area before assessing.",
      "Consider conducting a pilot assessment with a smaller scope first.",
    ]
  },
  {
    title: "Using Assessment Results",
    icon: <TrendingUp className="h-5 w-5" />,
    content: [
      "Executive Summary: Use the Word export for C-suite presentations focusing on risks and recommendations.",
      "Detailed Action Plan: Export to Excel to create a prioritized remediation roadmap.",
      "Progress Tracking: Re-run the assessment quarterly to measure improvement.",
      "Budget Planning: Use high-priority findings to justify investment in tools, training, or resources.",
    ],
    tips: [
      "Create a 90-day action plan focusing on quick wins from AMBER items.",
      "Assign risk owners to all RED items with clear accountability and timelines.",
      "Use the assessment to build your Power Platform Center of Excellence business case.",
    ]
  }
]

export function AssessmentGuidance({ standardSlug }: { standardSlug: string }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isScoringOpen, setIsScoringOpen] = useState(true)
  const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(true)

  return (
    <div className="space-y-6">
      {/* Developer Quick Guide - Show First */}
      <Collapsible open={isQuickGuideOpen} onOpenChange={setIsQuickGuideOpen}>
        <CollapsibleTrigger asChild>
          <Card>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Quick Start: Step-by-Step Data Collection Guide
                </div>
                <Button variant="ghost" size="sm">
                  {isQuickGuideOpen ? "Hide" : "Show"} Guide
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <DeveloperQuickGuide area={standardSlug} />
        </CollapsibleContent>
      </Collapsible>

      {/* Information Sources Guide - Show Second */}
      <InformationSourcesGuide area={standardSlug} />
      
      {/* Scoring Guide - Show Third */}
      <Collapsible open={isScoringOpen} onOpenChange={setIsScoringOpen}>
        <CollapsibleTrigger asChild>
          <Card>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  How to Answer Questions & Set Scores
                </div>
                <Button variant="ghost" size="sm">
                  {isScoringOpen ? "Hide" : "Show"} Guide
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScoringGuide />
        </CollapsibleContent>
      </Collapsible>
      
      {/* General Assessment Guidance */}
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  General Assessment Guidance & Best Practices
                </div>
                <Button variant="ghost" size="sm">
                  {isOpen ? "Hide" : "Show"} Guidance
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This assessment follows Microsoft&apos;s Power Platform best practices and the Center of Excellence (CoE) framework. 
                  <strong>Critical:</strong> This is a deep-dive enterprise assessment designed for organizations that may have 100,000+ people globally. 
                  A thorough assessment realistically requires <strong>several weeks to months</strong> of dedicated effort, as you&apos;ll need to:
                  <ul className="mt-2 ml-4 list-disc text-sm">
                    <li>Interview stakeholders across multiple regions, business units, and time zones</li>
                    <li>Review thousands of apps, flows, connections, and their interdependencies</li>
                    <li>Analyze years of usage data, audit logs, and compliance records</li>
                    <li>Validate technical configurations across dozens or hundreds of environments</li>
                    <li>Coordinate with security, compliance, legal, and IT teams globally</li>
                    <li>Document evidence for audit trails and regulatory requirements</li>
                    <li>Account for different business processes and regional regulations</li>
                  </ul>
                  This is NOT a 2-4 hour exercise. Plan for a multi-phase project with dedicated resources. Consider breaking the assessment into manageable phases by region or business unit.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="getting-started" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  {guidanceSections.map((section, index) => (
                    <TabsTrigger key={index} value={section.title.toLowerCase().replace(/\s+/g, '-')}>
                      <span className="hidden lg:inline">{section.title}</span>
                      <span className="lg:hidden">{section.icon}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {guidanceSections.map((section, index) => (
                  <TabsContent 
                    key={index} 
                    value={section.title.toLowerCase().replace(/\s+/g, '-')}
                    className="mt-4 space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {section.icon}
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                    </div>

                    <div className="space-y-2">
                      {section.content.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </div>

                    {section.tips && section.tips.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-sm">Pro Tips:</span>
                        </div>
                        <ul className="space-y-1">
                          {section.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground ml-6 list-disc">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Data Security & Privacy
                </h4>
                <p className="text-sm text-muted-foreground">
                  All assessment data is stored locally in your browser&apos;s storage. No data is transmitted to external servers. 
                  Use the export/import features to backup your assessments or share with colleagues. 
                  For sensitive assessments, ensure you&apos;re using a secure, company-managed device.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
} 