"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  FileText, 
  Users, 
  AlertTriangle,
  Lightbulb,
  Clock,
  Shield,
  CheckCircle2,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function AssessmentGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessment
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Assessment Guide</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guidance for conducting Power Platform assessments
        </p>
      </div>

      {/* Critical Notice */}
      <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription>
          <strong>Important:</strong> This is a deep-dive enterprise assessment designed for organizations with 100,000+ people. 
          A thorough assessment requires several weeks to months of dedicated effort. This is NOT a 2-4 hour exercise.
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs defaultValue="quick-start" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
          <TabsTrigger value="where-to-find">Where to Find</TabsTrigger>
          <TabsTrigger value="how-to-score">How to Score</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        {/* Quick Start Tab */}
        <TabsContent value="quick-start">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Step-by-step process for beginning your assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Create Your Project Plan</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Break the assessment into phases by region or business unit. Allow several days per section.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Schedule Stakeholder Interviews</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Coordinate with IT admins, business users, security teams across all time zones.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Gather Documentation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Collect policies, architecture diagrams, usage reports, and compliance records.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Begin Assessment</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start with areas where you have the most complete information.
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Time Estimates:</strong> Plan for 2-5 days per assessment section for research, 
                  validation, and documentation. Total timeline: 4-12 weeks for comprehensive assessment.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Where to Find Information Tab */}
        <TabsContent value="where-to-find">
          <Card>
            <CardHeader>
              <CardTitle>Where to Find Information</CardTitle>
              <CardDescription>Key resources for gathering assessment data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Microsoft Documentation */}
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Microsoft Power Platform Admin Documentation
                  </h3>
                  <a 
                    href="https://learn.microsoft.com/en-us/power-platform/admin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    https://learn.microsoft.com/power-platform/admin/
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Admin overview and concepts</li>
                    <li>• Environment management guides</li>
                    <li>• Security and governance documentation</li>
                    <li>• Best practices and recommendations</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Start with the 'Get started' section for overview. Use the table of contents 
                        to find specific topics.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Admin Center */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Power Platform Admin Center
                  </h3>
                  <a 
                    href="https://admin.powerplatform.microsoft.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    https://admin.powerplatform.microsoft.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Policies section</li>
                    <li>• Governance settings</li>
                    <li>• Environment strategies</li>
                    <li>• Usage analytics</li>
                  </ul>
                </div>

                {/* Internal Resources */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Internal Resources
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• IT Governance SharePoint site</li>
                    <li>• Power Platform CoE Teams channel</li>
                    <li>• Corporate Wiki or Knowledge Base</li>
                    <li>• IT Standards and Procedures library</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How to Score Tab */}
        <TabsContent value="how-to-score">
          <Card>
            <CardHeader>
              <CardTitle>How to Answer Questions & Set Scores</CardTitle>
              <CardDescription>Step-by-step scoring methodology</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {[
                  {
                    step: 1,
                    title: "Understand the Question",
                    description: "Read carefully and identify what's being assessed",
                    points: [
                      "Note if it's asking about existence, maturity, or coverage",
                      "Check the question type for expected answer format",
                      "Review any provided guidance or context"
                    ]
                  },
                  {
                    step: 2,
                    title: "Gather Information",
                    description: "Collect evidence from multiple sources",
                    points: [
                      "Access admin centers for current configurations",
                      "Interview stakeholders across departments",
                      "Collect documents, screenshots, and reports"
                    ]
                  },
                  {
                    step: 3,
                    title: "Compare to Best Practices",
                    description: "Evaluate against Microsoft standards",
                    points: [
                      "Review Microsoft Learn documentation",
                      "Check compliance requirements",
                      "Identify gaps between current and target state"
                    ]
                  },
                  {
                    step: 4,
                    title: "Determine the Score",
                    description: "Select appropriate rating based on evidence",
                    points: [
                      "Be objective and evidence-based",
                      "Consider technical and business adoption",
                      "Factor in risk and impact of gaps"
                    ]
                  },
                  {
                    step: 5,
                    title: "Document Evidence",
                    description: "Record justification for your scoring",
                    points: [
                      "Write clear evidence notes",
                      "Upload supporting documents",
                      "Include links to relevant systems"
                    ]
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <ul className="space-y-1">
                        {item.points.map((point, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="best-practices">
          <Card>
            <CardHeader>
              <CardTitle>General Assessment Guidance</CardTitle>
              <CardDescription>Best practices for comprehensive assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Assessment Scope</h3>
                  <p className="text-sm text-muted-foreground">
                    This assessment follows Microsoft's Power Platform best practices and the 
                    Center of Excellence (CoE) framework. For enterprise organizations, expect to:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Interview stakeholders across multiple regions and time zones</li>
                    <li>• Review thousands of apps, flows, and connections</li>
                    <li>• Analyze years of usage data and audit logs</li>
                    <li>• Validate configurations across dozens of environments</li>
                    <li>• Coordinate with security, compliance, and legal teams</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pro Tips</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Target className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <strong>Focus on evidence:</strong> Answer based on current state, not aspirational goals
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Users className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <strong>Collaborate:</strong> Assign sections to subject matter experts
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <strong>Plan time:</strong> Schedule dedicated blocks for each section
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <strong>Security:</strong> Use company-managed devices for sensitive data
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Documentation:</strong> The assessment auto-saves to browser storage. 
                    Use export features regularly to backup your progress and share with colleagues.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/">Start Assessment</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/resources">View Resources</Link>
        </Button>
      </div>
    </div>
  )
}