"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Target,
  TrendingUp,
  Users,
  Shield,
  Zap,
  BookOpen,
  Code,
  GitBranch,
  Database,
  Cloud,
  Lock,
  FileCode,
  Lightbulb
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SuccessCriteria {
  title: string
  description: string
  mustHave: string[]
  shouldHave: string[]
  niceToHave: string[]
  redFlags: string[]
  metrics: {
    name: string
    target: string
    why: string
  }[]
}

interface BestPractice {
  category: string
  icon: React.ReactNode
  practices: {
    title: string
    do: string[]
    dont: string[]
    example?: string
    impact: "critical" | "high" | "medium"
  }[]
}

const successCriteria: Record<string, SuccessCriteria> = {
  dlp: {
    title: "Data Loss Prevention Success Criteria",
    description: "Protecting sensitive data while enabling productivity",
    mustHave: [
      "Tenant-wide baseline DLP policy covering all environments",
      "Explicit classification for ALL connectors (no unclassified)",
      "Environment-specific policies for production/sensitive data",
      "Regular review process (at least quarterly)",
      "Documented exception request process"
    ],
    shouldHave: [
      "Automated monitoring and alerting for policy violations",
      "Integration with Microsoft Purview for data classification",
      "Gradual rollout process (simulation → tips → enforcement)",
      "User training on DLP implications",
      "Policy effectiveness metrics and reporting"
    ],
    niceToHave: [
      "Custom connectors with built-in DLP compliance",
      "Automated policy updates based on new connector releases",
      "Self-service DLP impact analysis tools",
      "Integration with SIEM for security monitoring"
    ],
    redFlags: [
      "❌ No DLP policies in production environments",
      "❌ Default/unclassified connectors in use",
      "❌ No review process or outdated policies (>6 months)",
      "❌ Overly restrictive policies blocking legitimate work",
      "❌ No exception/waiver process defined"
    ],
    metrics: [
      {
        name: "Policy Coverage",
        target: "100% of environments",
        why: "Unprotected environments are security vulnerabilities"
      },
      {
        name: "Connector Classification",
        target: "100% explicitly classified",
        why: "Unclassified connectors bypass security controls"
      },
      {
        name: "Policy Review Frequency",
        target: "Monthly for critical, Quarterly for others",
        why: "New connectors and threats emerge constantly"
      }
    ]
  },
  environments: {
    title: "Environment Strategy Success Criteria",
    description: "Structured approach to environment management and ALM",
    mustHave: [
      "Clear environment types defined (Dev/Test/UAT/Prod)",
      "Documented provisioning process and approval workflow",
      "Environment naming convention enforced",
      "Separate DLP policies per environment type",
      "Regular cleanup of unused environments"
    ],
    shouldHave: [
      "Automated environment provisioning",
      "Environment limits and quotas defined",
      "Cost allocation and chargeback model",
      "Environment health monitoring",
      "Backup and recovery procedures"
    ],
    niceToHave: [
      "Self-service environment provisioning portal",
      "Automated environment lifecycle management",
      "Integration with DevOps pipelines",
      "Environment templates for common scenarios"
    ],
    redFlags: [
      "❌ Production work in default environment",
      "❌ No separation between dev/test/prod",
      "❌ Unlimited environment creation",
      "❌ No naming standards or conventions",
      "❌ Orphaned environments consuming resources"
    ],
    metrics: [
      {
        name: "Environment Ratio",
        target: "1:3 (Prod:Non-Prod)",
        why: "Proper testing requires multiple non-prod environments"
      },
      {
        name: "Environment Utilization",
        target: ">60% active usage",
        why: "Unused environments waste resources and create security risks"
      },
      {
        name: "Provisioning Time",
        target: "<24 hours for standard requests",
        why: "Delays impact developer productivity"
      }
    ]
  },
  alm: {
    title: "Application Lifecycle Management Success Criteria",
    description: "Professional development practices for Power Platform",
    mustHave: [
      "Source control for all production solutions",
      "Automated deployment pipelines (CI/CD)",
      "Solution versioning strategy",
      "Environment promotion process (Dev→Test→Prod)",
      "Rollback procedures documented and tested"
    ],
    shouldHave: [
      "Automated testing for critical apps",
      "Code review process for customizations",
      "Solution checker integration in pipelines",
      "Performance testing procedures",
      "Change management process"
    ],
    niceToHave: [
      "Automated UI testing with Power Automate",
      "Performance baselines and monitoring",
      "Feature flags for gradual rollouts",
      "Blue-green deployment capabilities"
    ],
    redFlags: [
      "❌ Manual deployments to production",
      "❌ No source control usage",
      "❌ Direct editing in production",
      "❌ No versioning or rollback capability",
      "❌ No testing before production deployment"
    ],
    metrics: [
      {
        name: "Deployment Success Rate",
        target: ">95%",
        why: "Failed deployments impact business operations"
      },
      {
        name: "Time to Production",
        target: "<2 weeks for standard changes",
        why: "Slow delivery impacts business agility"
      },
      {
        name: "Rollback Time",
        target: "<1 hour",
        why: "Quick recovery minimizes business impact"
      }
    ]
  },
  security: {
    title: "Security & Compliance Success Criteria",
    description: "Protecting data and meeting regulatory requirements",
    mustHave: [
      "MFA enforced for all makers and admins",
      "Regular security reviews and audits",
      "Data residency requirements documented",
      "Privileged access management (PAM)",
      "Security incident response procedures"
    ],
    shouldHave: [
      "Integration with SIEM/SOC",
      "Automated compliance reporting",
      "Regular penetration testing",
      "Security training for citizen developers",
      "Data classification and handling procedures"
    ],
    niceToHave: [
      "Zero-trust architecture implementation",
      "Advanced threat protection",
      "Automated security remediation",
      "Security champions program"
    ],
    redFlags: [
      "❌ No MFA requirement",
      "❌ Shared accounts or credentials",
      "❌ No security review process",
      "❌ Unencrypted sensitive data",
      "❌ No incident response plan"
    ],
    metrics: [
      {
        name: "MFA Adoption",
        target: "100% of privileged users",
        why: "Primary defense against account compromise"
      },
      {
        name: "Security Review Coverage",
        target: "100% of production apps annually",
        why: "Identifies vulnerabilities before exploitation"
      },
      {
        name: "Incident Response Time",
        target: "<4 hours for critical",
        why: "Fast response limits damage"
      }
    ]
  }
}

const bestPractices: BestPractice[] = [
  {
    category: "Architecture & Design",
    icon: <Database className="h-5 w-5" />,
    practices: [
      {
        title: "Solution Architecture",
        do: [
          "Design for scale from day one",
          "Use solution components and dependencies",
          "Implement proper error handling",
          "Design for monitoring and diagnostics",
          "Follow naming conventions religiously"
        ],
        dont: [
          "Hardcode environment-specific values",
          "Create monolithic solutions",
          "Ignore performance implications",
          "Skip documentation",
          "Use personal connections in solutions"
        ],
        example: "Use environment variables for URLs, not hardcoded values",
        impact: "critical"
      },
      {
        title: "Data Architecture",
        do: [
          "Use Dataverse for complex data relationships",
          "Implement proper security roles",
          "Design efficient data models",
          "Plan for data migration and archival",
          "Use virtual tables for external data"
        ],
        dont: [
          "Store everything in SharePoint lists",
          "Ignore row-level security needs",
          "Create unnecessary duplicate data",
          "Use Excel as a production database",
          "Bypass security for convenience"
        ],
        impact: "critical"
      }
    ]
  },
  {
    category: "Development Practices",
    icon: <Code className="h-5 w-5" />,
    practices: [
      {
        title: "Power Apps Development",
        do: [
          "Use components for reusability",
          "Implement proper navigation and back buttons",
          "Optimize formulas for performance",
          "Use concurrent functions where possible",
          "Test on multiple devices and browsers"
        ],
        dont: [
          "Use complex nested formulas",
          "Ignore accessibility requirements",
          "Load all data on app start",
          "Use too many screens (>20-30)",
          "Forget offline scenarios"
        ],
        example: "Use ClearCollect with filters instead of loading entire tables",
        impact: "high"
      },
      {
        title: "Power Automate Development",
        do: [
          "Use proper error handling and retry logic",
          "Implement logging and monitoring",
          "Use child flows for reusability",
          "Set appropriate timeouts and limits",
          "Use service accounts for connections"
        ],
        dont: [
          "Create infinite loops",
          "Ignore throttling limits",
          "Use personal accounts for production",
          "Skip error notifications",
          "Hardcode sensitive information"
        ],
        example: "Always use Try-Catch-Finally pattern in critical flows",
        impact: "high"
      }
    ]
  },
  {
    category: "Governance & Control",
    icon: <Shield className="h-5 w-5" />,
    practices: [
      {
        title: "Center of Excellence",
        do: [
          "Establish clear governance policies",
          "Create and maintain training materials",
          "Monitor platform usage and adoption",
          "Provide maker support and office hours",
          "Celebrate successes and share best practices"
        ],
        dont: [
          "Be overly restrictive",
          "Ignore maker feedback",
          "Focus only on control, not enablement",
          "Skip regular policy reviews",
          "Work in isolation from business"
        ],
        impact: "critical"
      },
      {
        title: "Change Management",
        do: [
          "Document all production changes",
          "Use approval workflows for deployments",
          "Maintain change calendars",
          "Communicate changes to stakeholders",
          "Plan rollback procedures"
        ],
        dont: [
          "Deploy on Fridays or before holidays",
          "Skip testing in lower environments",
          "Make multiple changes at once",
          "Ignore user feedback",
          "Rush emergency changes"
        ],
        impact: "high"
      }
    ]
  },
  {
    category: "Performance & Scale",
    icon: <Zap className="h-5 w-5" />,
    practices: [
      {
        title: "Performance Optimization",
        do: [
          "Monitor app performance metrics",
          "Use delegation where possible",
          "Optimize data calls and queries",
          "Implement caching strategies",
          "Regular performance testing"
        ],
        dont: [
          "Load unnecessary data",
          "Use non-delegable functions on large datasets",
          "Ignore connector limits",
          "Skip performance testing",
          "Assume it will scale"
        ],
        example: "Use StartsWith instead of Search for better delegation",
        impact: "high"
      },
      {
        title: "Capacity Management",
        do: [
          "Monitor capacity consumption",
          "Plan for growth and peaks",
          "Implement archival strategies",
          "Use premium capacity wisely",
          "Regular capacity reviews"
        ],
        dont: [
          "Ignore capacity limits",
          "Wait until limits are hit",
          "Waste premium capacity",
          "Skip capacity planning",
          "Assume unlimited resources"
        ],
        impact: "medium"
      }
    ]
  }
]

export function DeveloperSuccessGuide() {
  const [selectedCategory, setSelectedCategory] = useState("dlp")

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6" />
          Developer Success Guide - The Clear Path to Excellence
        </CardTitle>
        <CardDescription>
          Your comprehensive guide to Power Platform success. Follow these criteria and practices to build secure, scalable, and maintainable solutions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="success-criteria" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="success-criteria">Success Criteria</TabsTrigger>
            <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
            <TabsTrigger value="quick-wins">Quick Wins</TabsTrigger>
          </TabsList>

          <TabsContent value="success-criteria" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
              {Object.entries(successCriteria).map(([key, criteria]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className="justify-start"
                >
                  {criteria.title.split(" ")[0]}
                </Button>
              ))}
            </div>

            {selectedCategory && successCriteria[selectedCategory] && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {successCriteria[selectedCategory].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {successCriteria[selectedCategory].description}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Must Have (Non-negotiable)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {successCriteria[selectedCategory].mustHave.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        Should Have (Important)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {successCriteria[selectedCategory].shouldHave.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      Red Flags - Immediate Action Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {successCriteria[selectedCategory].redFlags.map((item, idx) => (
                        <li key={idx} className="text-sm text-red-600 dark:text-red-400">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Metrics & Targets
                  </h4>
                  <div className="grid gap-3">
                    {successCriteria[selectedCategory].metrics.map((metric, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{metric.name}</span>
                          <Badge variant="outline">{metric.target}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{metric.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {bestPractices.map((category, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.category}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-4">
                      {category.practices.map((practice, pidx) => (
                        <div key={pidx} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{practice.title}</h4>
                            <Badge 
                              variant={
                                practice.impact === "critical" ? "destructive" : 
                                practice.impact === "high" ? "default" : 
                                "secondary"
                              }
                            >
                              {practice.impact} impact
                            </Badge>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-green-600">✅ DO</p>
                              <ul className="space-y-1">
                                {practice.do.map((item, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium text-red-600">❌ DON'T</p>
                              <ul className="space-y-1">
                                {practice.dont.map((item, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <XCircle className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {practice.example && (
                            <Alert>
                              <Lightbulb className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Example:</strong> {practice.example}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="quick-wins" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚀 30-Day Quick Wins</CardTitle>
                  <CardDescription>
                    High-impact improvements you can implement quickly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge className="mt-0.5">Week 1</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Security Foundations</p>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          <li>• Enable MFA for all Power Platform makers</li>
                          <li>• Implement basic DLP policy for Microsoft connectors</li>
                          <li>• Review and remove unused environments</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge className="mt-0.5">Week 2</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Governance Quick Wins</p>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          <li>• Deploy CoE Starter Kit core components</li>
                          <li>• Create environment request form/process</li>
                          <li>• Document naming conventions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge className="mt-0.5">Week 3</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Developer Enablement</p>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          <li>• Set up source control for top 5 apps</li>
                          <li>• Create first automated deployment pipeline</li>
                          <li>• Schedule weekly office hours</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Badge className="mt-0.5">Week 4</Badge>
                      <div className="flex-1">
                        <p className="font-medium">Monitoring & Optimization</p>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          <li>• Enable performance monitoring</li>
                          <li>• Review top 10 apps for optimization</li>
                          <li>• Create first executive dashboard</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Success Tip:</strong> Focus on one area at a time. It's better to fully implement security 
                  before moving to ALM than to partially implement everything. Measure progress weekly and celebrate wins!
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 