"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Shield, Users, Database, Cloud, Settings, CheckCircle } from "lucide-react"
import Link from "next/link"

const assessmentStandards = [
  {
    id: "security",
    title: "Security Assessment",
    description: "Comprehensive security evaluation of your Power Platform environment",
    icon: Shield,
    color: "bg-red-500",
    questions: 45,
    estimatedTime: "30-45 minutes",
    categories: ["Identity & Access", "Data Protection", "Network Security", "Compliance"],
  },
  {
    id: "governance",
    title: "Governance & Compliance",
    description: "Assess governance policies and regulatory compliance",
    icon: FileText,
    color: "bg-blue-500",
    questions: 38,
    estimatedTime: "25-35 minutes",
    categories: ["Policy Management", "Compliance", "Audit Trail", "Documentation"],
  },
  {
    id: "architecture",
    title: "Architecture Review",
    description: "Evaluate technical architecture and best practices",
    icon: Database,
    color: "bg-green-500",
    questions: 52,
    estimatedTime: "40-60 minutes",
    categories: ["Solution Design", "Integration", "Performance", "Scalability"],
  },
  {
    id: "user-adoption",
    title: "User Adoption & Training",
    description: "Assess user readiness and training effectiveness",
    icon: Users,
    color: "bg-purple-500",
    questions: 28,
    estimatedTime: "20-30 minutes",
    categories: ["User Training", "Change Management", "Support", "Feedback"],
  },
  {
    id: "cloud-readiness",
    title: "Cloud Readiness",
    description: "Evaluate cloud migration and optimization strategies",
    icon: Cloud,
    color: "bg-orange-500",
    questions: 35,
    estimatedTime: "25-40 minutes",
    categories: ["Migration Strategy", "Cloud Security", "Cost Optimization", "Performance"],
  },
  {
    id: "operations",
    title: "Operations & Maintenance",
    description: "Review operational processes and maintenance procedures",
    icon: Settings,
    color: "bg-indigo-500",
    questions: 42,
    estimatedTime: "30-45 minutes",
    categories: ["Monitoring", "Backup & Recovery", "Updates", "Support Processes"],
  },
]

export default function AssessmentPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Assessment Standards</h1>
            </div>
            <div className="text-sm text-gray-600">Signed in as {user.email}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Assessment Standard</h2>
          <p className="text-gray-600 max-w-3xl">
            Select an assessment standard to begin evaluating your Power Platform environment. Each assessment is
            designed to provide comprehensive insights into different aspects of your implementation.
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentStandards.map((standard) => {
            const IconComponent = standard.icon
            return (
              <Card key={standard.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${standard.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {standard.questions} questions
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {standard.title}
                  </CardTitle>
                  <CardDescription className="text-sm">{standard.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Time Estimate */}
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Estimated time: {standard.estimatedTime}
                  </div>

                  {/* Categories */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Assessment Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {standard.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/assessment/${standard.id}`}>
                    <Button className="w-full mt-4 group-hover:bg-blue-600 transition-colors">
                      Start {standard.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Need Help Getting Started?</CardTitle>
              <CardDescription>
                Here are some tips to help you choose the right assessment for your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">For New Implementations</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Start with <strong>Security Assessment</strong> and <strong>Governance & Compliance</strong>
                    to establish a solid foundation.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">For Existing Environments</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Consider <strong>Architecture Review</strong> and <strong>Operations & Maintenance</strong>
                    to optimize your current setup.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">For Cloud Migration</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Focus on <strong>Cloud Readiness</strong> and <strong>Architecture Review</strong>
                    to ensure a smooth transition.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">For User Experience</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Use <strong>User Adoption & Training</strong> to improve user engagement and satisfaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
