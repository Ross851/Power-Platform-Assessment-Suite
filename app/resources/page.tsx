"use client"

import { NavigationHub } from "@/components/navigation-hub"
import { ResourcesSection } from "@/components/resources-section"
import { AssessmentFAQ } from "@/components/assessment-faq"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Resources & Documentation</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to succeed with Power Platform governance
        </p>
      </div>

      {/* Navigation Hub */}
      <NavigationHub />

      {/* Resources Section */}
      <ResourcesSection />

      {/* FAQ */}
      <div className="mt-12">
        <AssessmentFAQ />
      </div>
    </div>
  )
}