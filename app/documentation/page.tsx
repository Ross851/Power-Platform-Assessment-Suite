import { DocumentationTabs } from "@/components/documentation-tabs"

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Assessment Documentation</h1>
        <p className="text-muted-foreground mt-2">
          View and export comprehensive assessment reports for executives and technical teams.
        </p>
      </div>
      <DocumentationTabs />
    </div>
  )
}
