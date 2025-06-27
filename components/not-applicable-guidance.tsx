"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Lightbulb, 
  TrendingUp, 
  Calendar,
  Info,
  BookOpen,
  Target,
  Zap,
  Users
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface NotApplicableArea {
  area: string
  reason: string
  readinessSteps: string[]
  benefits: string[]
  timeline: string
  resources: {
    title: string
    url: string
    type: "documentation" | "training" | "video" | "template"
  }[]
}

const notApplicableGuidance: Record<string, NotApplicableArea> = {
  "power-automate": {
    area: "Power Automate (Flows)",
    reason: "Organization hasn't started using Power Automate yet",
    readinessSteps: [
      "Identify manual, repetitive processes that could be automated",
      "Start with simple approval workflows or notifications",
      "Train 2-3 pilot users on Power Automate basics",
      "Establish governance before widespread adoption",
      "Create templates for common scenarios"
    ],
    benefits: [
      "Reduce manual work by 40-60%",
      "Improve process consistency and compliance",
      "Enable 24/7 operations for critical processes",
      "Free staff for higher-value activities",
      "Better audit trails and visibility"
    ],
    timeline: "3-6 months to initial adoption",
    resources: [
      {
        title: "Power Automate Getting Started",
        url: "https://learn.microsoft.com/en-us/power-automate/getting-started",
        type: "documentation"
      },
      {
        title: "Power Automate Learning Path",
        url: "https://learn.microsoft.com/en-us/training/paths/automate-process-power-automate/",
        type: "training"
      }
    ]
  },
  "power-apps": {
    area: "Power Apps",
    reason: "Organization hasn't built any Power Apps yet",
    readinessSteps: [
      "Identify paper-based or Excel-based processes to digitize",
      "Start with a simple data collection or approval app",
      "Set up a development environment for experimentation",
      "Train citizen developers on app building basics",
      "Establish app governance and standards early"
    ],
    benefits: [
      "Rapid application development (10x faster)",
      "Reduce shadow IT and Excel sprawl",
      "Mobile-enable business processes",
      "Integrate with existing systems easily",
      "Lower development costs by 70%"
    ],
    timeline: "2-4 months to first production app",
    resources: [
      {
        title: "Create your first app",
        url: "https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/get-started-test-drive",
        type: "documentation"
      },
      {
        title: "Power Apps Training",
        url: "https://learn.microsoft.com/en-us/training/powerplatform/power-apps",
        type: "training"
      }
    ]
  },
  "power-bi": {
    area: "Power BI",
    reason: "Organization hasn't adopted Power BI for analytics",
    readinessSteps: [
      "Audit current reporting tools and processes",
      "Identify key metrics and KPIs to visualize",
      "Set up Power BI workspace and capacity",
      "Train report developers and analysts",
      "Create governance for data models and reports"
    ],
    benefits: [
      "Self-service analytics for business users",
      "Real-time dashboards and insights",
      "Reduced reporting time by 80%",
      "Better data-driven decision making",
      "Unified view of organizational data"
    ],
    timeline: "1-3 months to first dashboards",
    resources: [
      {
        title: "Power BI Documentation",
        url: "https://learn.microsoft.com/en-us/power-bi/",
        type: "documentation"
      },
      {
        title: "Power BI Guided Learning",
        url: "https://learn.microsoft.com/en-us/power-bi/guided-learning/",
        type: "training"
      }
    ]
  },
  "dataverse": {
    area: "Dataverse",
    reason: "Organization uses SharePoint/Excel instead of Dataverse",
    readinessSteps: [
      "Assess data complexity and relationship needs",
      "Plan data migration from current sources",
      "Design proper security model with roles",
      "Train on Dataverse concepts and benefits",
      "Start with one business-critical dataset"
    ],
    benefits: [
      "Enterprise-grade security and compliance",
      "Built-in business logic and validation",
      "Scalability for millions of records",
      "Rich integration capabilities",
      "Audit trails and version history"
    ],
    timeline: "3-6 months for migration",
    resources: [
      {
        title: "Introduction to Dataverse",
        url: "https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro",
        type: "documentation"
      },
      {
        title: "Dataverse for Teams vs Full",
        url: "https://learn.microsoft.com/en-us/power-platform/admin/about-teams-environment",
        type: "documentation"
      }
    ]
  },
  "custom-connectors": {
    area: "Custom Connectors",
    reason: "No custom connectors developed yet",
    readinessSteps: [
      "Identify APIs that need Power Platform integration",
      "Learn custom connector development basics",
      "Set up API documentation and testing",
      "Establish security and authentication standards",
      "Create a connector certification process"
    ],
    benefits: [
      "Integrate any system with Power Platform",
      "Standardize API access across organization",
      "Enable citizen developers safely",
      "Reduce dependency on IT for integrations",
      "Reusable across all Power Platform services"
    ],
    timeline: "1-2 months per connector",
    resources: [
      {
        title: "Create a custom connector",
        url: "https://learn.microsoft.com/en-us/connectors/custom-connectors/create-logic-apps-connector",
        type: "documentation"
      },
      {
        title: "Custom Connector Tutorial",
        url: "https://learn.microsoft.com/en-us/connectors/custom-connectors/",
        type: "training"
      }
    ]
  }
}

interface NotApplicableGuidanceProps {
  area: string
  onReadinessUpdate?: (timeline: string) => void
}

export function NotApplicableGuidance({ area, onReadinessUpdate }: NotApplicableGuidanceProps) {
  const guidance = notApplicableGuidance[area]
  
  if (!guidance) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This area is not currently in use. Consider exploring its potential benefits for your organization.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Future Opportunity: {guidance.area}
        </CardTitle>
        <CardDescription>
          {guidance.reason}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            <strong>Why Consider This?</strong> Organizations using {guidance.area} report significant improvements 
            in efficiency and user satisfaction. This could be a valuable addition to your Power Platform strategy.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="benefits">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Expected Benefits
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {guidance.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="readiness">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Getting Started Steps
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{guidance.timeline}</Badge>
                </div>
                <ol className="space-y-2">
                  {guidance.readinessSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-sm">{idx + 1}.</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Learning Resources
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {guidance.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded border hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{resource.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {resource.type}
                    </Badge>
                  </a>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            When do you plan to explore {guidance.area}?
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReadinessUpdate?.("next-quarter")}
            >
              Next Quarter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReadinessUpdate?.("6-months")}
            >
              Within 6 Months
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReadinessUpdate?.("next-year")}
            >
              Next Year
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReadinessUpdate?.("no-plans")}
            >
              No Current Plans
            </Button>
          </div>
        </div>

        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> Many organizations start small with a pilot project. 
            Consider identifying one team or process that could benefit from {guidance.area} as a proof of concept.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
} 