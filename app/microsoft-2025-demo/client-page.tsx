'use client'

import React, { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { HiInformationCircle } from 'react-icons/hi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Rocket, Shield, Target, TrendingUp } from 'lucide-react'
import { enhancedGovernanceQuestions } from '@/lib/microsoft-2025-assessment-enhanced'

// Dynamic import with no SSR
const Microsoft2025Dashboard = dynamic(
  () => import('@/components/assessment/microsoft-2025-dashboard').then(mod => mod.Microsoft2025Dashboard),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment framework...</p>
        </div>
      </div>
    )
  }
)

export default function Microsoft2025DemoClient() {
  const [responses, setResponses] = useState<Record<string, any>>({})

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // Pre-populate some responses for demo purposes
  const loadDemoData = () => {
    setResponses({
      'gov-2025-1': 4, // CoE deployed
      'gov-2025-2': 3, // Managed Environments partially configured
      'gov-2025-3': 2, // Security Hub not fully monitored
      'gov-2025-4': 4, // DLP policies configured
      'gov-2025-5': 3, // Bulk governance partially configured
      'sec-2025-1': 2, // Data exfiltration needs work
      'sec-2025-2': 3, // CAE partially enabled
      'sec-2025-3': 1, // CMK not configured
      'sec-2025-4': true, // Clickjacking protection enabled
      'sec-2025-5': 3, // Sensitivity labels partially implemented
      'rel-2025-1': 4, // Health checks configured
      'rel-2025-2': 3, // Backup testing done semi-annually
      'rel-2025-3': 3, // Dependencies partially documented
      'perf-2025-1': 2, // Performance baselines need work
      'perf-2025-2': 3, // Connector control partially configured
      'ops-2025-1': 4, // Email digests configured
      'ops-2025-2': 2, // Cleanup partially automated
      'ops-2025-3': 3, // Resource governance in progress
      'exp-2025-1': 5, // WCAG compliance achieved
      'exp-2025-2': 3, // Copilot governance in progress
      'exp-2025-3': 4, // Adoption tracking implemented
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Microsoft 2025 Assessment Demo
              </h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadDemoData} variant="outline" size="sm">
                <Rocket className="mr-2 h-4 w-4" />
                Load Sample Data
              </Button>
              <Link href="/enterprise-demo">
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Enterprise Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Introduction Card */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <HiInformationCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">Welcome to the Microsoft 2025 Power Platform Assessment</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This assessment framework is based on the latest Microsoft Power Platform guidance for 2025, 
                  incorporating the Well-Architected Framework, Security Hub scoring, and enterprise governance standards.
                </p>
                <Alert className="mt-4">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>New:</strong> Each question now includes Microsoft best practices guidance, tenant location information, and implementation steps. Click "Show Detailed Guidance" on any question to access this information.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">Security Hub Scoring</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aligns with Microsoft's Low/Medium/High scoring system for security posture assessment
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold">Gap Analysis</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visual comparison against Microsoft's expected baseline scores for mature organizations
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold">Best Practices</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Direct links to Microsoft documentation and implementation guidance for each topic
            </p>
          </Card>
        </div>

        {/* Assessment Dashboard */}
        <Suspense fallback={<div>Loading...</div>}>
          <Microsoft2025Dashboard 
            responses={responses} 
            onResponseChange={handleResponseChange} 
          />
        </Suspense>
      </div>
    </div>
  )
}