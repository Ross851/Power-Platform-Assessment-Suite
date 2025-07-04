'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  ChevronRight, 
  HelpCircle, 
  Target, 
  Users, 
  Calendar, 
  BarChart3,
  Sparkles,
  ClipboardCheck,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  options: {
    value: string
    label: string
    points: { strategic: number; operational: number }
  }[]
}

const questions: Question[] = [
  {
    id: 'role',
    text: 'What is your primary role?',
    options: [
      { value: 'executive', label: 'C-Suite/Executive Leadership', points: { strategic: 3, operational: 0 } },
      { value: 'it-manager', label: 'IT Manager/Director', points: { strategic: 1, operational: 2 } },
      { value: 'coe-lead', label: 'CoE Lead/Platform Owner', points: { strategic: 1, operational: 3 } },
      { value: 'developer', label: 'Developer/Technical Lead', points: { strategic: 0, operational: 3 } }
    ]
  },
  {
    id: 'goal',
    text: 'What is your primary goal?',
    options: [
      { value: 'transformation', label: 'Plan digital transformation strategy', points: { strategic: 3, operational: 0 } },
      { value: 'compliance', label: 'Ensure compliance and governance', points: { strategic: 1, operational: 2 } },
      { value: 'optimization', label: 'Optimize current operations', points: { strategic: 0, operational: 3 } },
      { value: 'troubleshoot', label: 'Fix issues and improve quality', points: { strategic: 0, operational: 3 } }
    ]
  },
  {
    id: 'timeline',
    text: 'What is your planning horizon?',
    options: [
      { value: 'strategic', label: 'Next 1-3 years', points: { strategic: 3, operational: 0 } },
      { value: 'tactical', label: 'Next 3-12 months', points: { strategic: 1, operational: 2 } },
      { value: 'immediate', label: 'Current quarter', points: { strategic: 0, operational: 3 } },
      { value: 'urgent', label: 'This week/month', points: { strategic: 0, operational: 3 } }
    ]
  },
  {
    id: 'audience',
    text: 'Who will review the results?',
    options: [
      { value: 'board', label: 'Board/Executive Committee', points: { strategic: 3, operational: 0 } },
      { value: 'leadership', label: 'Senior Leadership Team', points: { strategic: 2, operational: 1 } },
      { value: 'it-team', label: 'IT Team/CoE Members', points: { strategic: 0, operational: 3 } },
      { value: 'mixed', label: 'Mixed stakeholders', points: { strategic: 2, operational: 2 } }
    ]
  }
]

export function AssessmentDecisionHelper() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [scores, setScores] = useState({ strategic: 0, operational: 0 })

  const handleAnswer = (value: string) => {
    const question = questions[currentQuestion]
    const option = question.options.find(o => o.value === value)
    
    if (option) {
      const newAnswers = { ...answers, [question.id]: value }
      setAnswers(newAnswers)
      
      // Calculate scores
      const newScores = { strategic: 0, operational: 0 }
      questions.forEach(q => {
        const answer = newAnswers[q.id]
        if (answer) {
          const opt = q.options.find(o => o.value === answer)
          if (opt) {
            newScores.strategic += opt.points.strategic
            newScores.operational += opt.points.operational
          }
        }
      })
      setScores(newScores)
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResult(true)
      }
    }
  }

  const restart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResult(false)
    setScores({ strategic: 0, operational: 0 })
  }

  const getRecommendation = () => {
    const { strategic, operational } = scores
    const total = strategic + operational
    const strategicPercentage = total > 0 ? (strategic / total) * 100 : 0
    
    if (strategicPercentage >= 60) {
      return {
        type: 'strategic',
        title: 'Microsoft 2025 Framework',
        description: 'Based on your responses, the Microsoft 2025 Framework is ideal for your strategic planning needs.',
        icon: Sparkles,
        color: 'purple',
        link: '/microsoft-2025-demo'
      }
    } else if (strategicPercentage <= 40) {
      return {
        type: 'operational',
        title: 'Standard Assessments',
        description: 'The Standard Assessments will help you evaluate and improve your current Power Platform operations.',
        icon: ClipboardCheck,
        color: 'blue',
        link: '#standard-assessments'
      }
    } else {
      return {
        type: 'both',
        title: 'Both Assessments Recommended',
        description: 'Your needs span both strategic and operational areas. Consider starting with Standard Assessments for baseline, then use Microsoft 2025 for planning.',
        icon: Target,
        color: 'green',
        link: null
      }
    }
  }

  if (showResult) {
    const recommendation = getRecommendation()
    const Icon = recommendation.icon
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Icon className={`h-6 w-6 text-${recommendation.color}-600`} />
            Your Recommended Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">{recommendation.title}</h3>
            <p className="text-muted-foreground">{recommendation.description}</p>
            
            <div className="flex justify-center gap-8 my-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{scores.strategic}</div>
                <div className="text-sm text-muted-foreground">Strategic Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{scores.operational}</div>
                <div className="text-sm text-muted-foreground">Operational Points</div>
              </div>
            </div>
            
            {recommendation.type === 'both' ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#standard-assessments">
                  <Button variant="outline">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Start with Standard
                  </Button>
                </Link>
                <Link href="/microsoft-2025-demo">
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Explore 2025 Framework
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={restart}>
                  Try Again
                </Button>
                <Link href={recommendation.link!}>
                  <Button>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Assessment
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-3">Your Assessment Profile:</h4>
            <div className="space-y-2 text-sm">
              {questions.map(q => {
                const answer = q.options.find(o => o.value === answers[q.id])
                return (
                  <div key={q.id} className="flex justify-between">
                    <span className="text-muted-foreground">{q.text}</span>
                    <span className="font-medium">{answer?.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={restart}>
            Start Over
          </Button>
        </div>
        <CardTitle className="text-xl">{question.text}</CardTitle>
        <CardDescription>This helps us recommend the right assessment for your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={handleAnswer} className="space-y-3">
          {question.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full ${
                  index < currentQuestion
                    ? 'bg-primary'
                    : index === currentQuestion
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}