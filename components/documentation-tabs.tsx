"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExecutiveSummaryView } from "./executive-summary-view"
import { TechnicalDocumentationView } from "./technical-documentation-view"
import { Users, Code } from "lucide-react"

export function DocumentationTabs() {
  return (
    <Tabs defaultValue="executive" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="executive" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Executive Summary</span>
        </TabsTrigger>
        <TabsTrigger value="technical" className="flex items-center space-x-2">
          <Code className="h-4 w-4" />
          <span>Technical Guide</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="executive" className="mt-6">
        <ExecutiveSummaryView />
      </TabsContent>
      <TabsContent value="technical" className="mt-6">
        <TechnicalDocumentationView />
      </TabsContent>
    </Tabs>
  )
}
