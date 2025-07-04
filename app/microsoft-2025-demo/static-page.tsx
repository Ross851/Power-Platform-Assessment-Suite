'use client'

import React, { useState, useEffect } from 'react'
import './demo.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Rocket, 
  Shield, 
  Target, 
  TrendingUp,
  ChevronRight,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  FileText,
  MapPin,
  Code,
  AlertTriangle
} from 'lucide-react'
import { enhancedGovernanceQuestions } from '@/lib/microsoft-2025-assessment-enhanced'
import { assessmentPillars } from '@/lib/microsoft-2025-assessment-framework'

export default function Microsoft2025StaticPage() {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  // Calculate scores
  const calculatePillarScore = (pillarId: string) => {
    const pillar = assessmentPillars.find(p => p.id === pillarId)
    if (!pillar) return 0
    
    let total = 0
    let count = 0
    
    pillar.questions.forEach(q => {
      if (responses[q.id]) {
        total += (responses[q.id] / 5) * 100
        count++
      }
    })
    
    return count > 0 ? Math.round(total / count) : 0
  }

  const toggleQuestionExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const loadDemoData = () => {
    setResponses({
      'gov-2025-1': 4,
      'gov-2025-2': 3,
      'gov-2025-3': 2,
      'gov-2025-4': 4,
      'gov-2025-5': 3
    })
  }

  const getStatusIcon = (value: number) => {
    if (value >= 4) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (value >= 3) return <AlertCircle className="w-5 h-5 text-blue-600" />
    if (value >= 2) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Microsoft 2025 Assessment</h1>
            </div>
            <Button onClick={loadDemoData} variant="outline" size="sm">
              <Rocket className="mr-2 h-4 w-4" />
              Load Demo Data
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Scores Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {assessmentPillars.slice(0, 3).map(pillar => {
                const score = calculatePillarScore(pillar.id)
                const expectedScore = pillar.id === 'governance' ? 80 : 75
                const gap = expectedScore - score
                
                return (
                  <Card key={pillar.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{pillar.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{score}%</div>
                      <div className="text-sm text-muted-foreground">
                        Expected: {expectedScore}%
                      </div>
                      {gap > 0 && (
                        <Badge variant="outline" className="mt-2">
                          Gap: -{gap}%
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This assessment helps evaluate your Power Platform implementation against Microsoft's 2025 standards.
                Each question includes best practices guidance and tenant location information.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            {enhancedGovernanceQuestions.map(question => {
              const value = responses[question.id] || 0
              const isExpanded = expandedQuestions.has(question.id)
              
              return (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {question.text}
                          {question.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.description}
                        </p>
                      </div>
                      {value > 0 && getStatusIcon(value)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Scale Input */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Not at all</span>
                        <span>Completely</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value || 1}
                        onChange={(e) => setResponses(prev => ({
                          ...prev,
                          [question.id]: parseInt(e.target.value)
                        }))}
                        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-xs mt-1">
                        {[1, 2, 3, 4, 5].map(n => (
                          <span key={n}>{n}</span>
                        ))}
                      </div>
                    </div>

                    {/* Best Practice */}
                    {question.bestPractice && (
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Best Practice:</strong> {question.bestPractice}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Expandable Guidance */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleQuestionExpanded(question.id)}
                      className="w-full"
                    >
                      {isExpanded ? 'Hide' : 'Show'} Detailed Guidance
                      <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </Button>

                    {isExpanded && (
                      <Tabs defaultValue="location" className="mt-4">
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="location">
                            <MapPin className="h-3 w-3 mr-1" />
                            Location
                          </TabsTrigger>
                          <TabsTrigger value="steps">
                            <Code className="h-3 w-3 mr-1" />
                            Steps
                          </TabsTrigger>
                          <TabsTrigger value="docs">
                            <FileText className="h-3 w-3 mr-1" />
                            Docs
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="location" className="mt-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Where to find in tenant:</p>
                            {question.tenantLocation?.map((loc, idx) => (
                              <div key={idx} className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                                {loc}
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="steps" className="mt-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Implementation steps:</p>
                            {question.implementationSteps?.map((step, idx) => (
                              <div key={idx} className="text-sm flex gap-2">
                                <span className="font-medium">{idx + 1}.</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="docs" className="mt-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Microsoft documentation:</p>
                            {question.microsoftDocs?.map((doc, idx) => (
                              <a
                                key={idx}
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline block"
                              >
                                {doc.replace('https://learn.microsoft.com/', 'MS Learn: ')}
                              </a>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}