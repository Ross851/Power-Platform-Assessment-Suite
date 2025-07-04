'use client'

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "What's the main difference between the two assessment types?",
    answer: "The Microsoft 2025 Framework focuses on strategic planning and enterprise transformation for the next 1-3 years, while Standard Assessments evaluate your current operational health and immediate governance needs.",
    category: "general"
  },
  {
    question: "Can I use both assessments?",
    answer: "Absolutely! Many organizations benefit from using both. Start with Standard Assessments to establish your current baseline, then use the Microsoft 2025 Framework to plan your transformation journey.",
    category: "general"
  },
  {
    question: "Which assessment should executives use?",
    answer: "Executives and board members should primarily use the Microsoft 2025 Framework as it provides strategic insights, ROI metrics, and transformation roadmaps suitable for high-level decision making.",
    category: "roles"
  },
  {
    question: "Which assessment is best for IT teams?",
    answer: "IT teams and CoE managers should focus on Standard Assessments for day-to-day governance, security configurations, and operational excellence. These provide actionable technical recommendations.",
    category: "roles"
  },
  {
    question: "How long does each assessment take?",
    answer: "The Microsoft 2025 Framework takes about 30-45 minutes with 30+ strategic questions. Standard Assessments are more comprehensive with 60+ questions across 8 categories, typically taking 1-2 hours total.",
    category: "practical"
  },
  {
    question: "What kind of report do I get from each assessment?",
    answer: "Microsoft 2025 Framework generates executive dashboards with maturity scores and strategic roadmaps. Standard Assessments provide detailed technical reports with specific remediation steps and compliance checklists.",
    category: "practical"
  },
  {
    question: "Do I need technical knowledge for the Microsoft 2025 Framework?",
    answer: "No, the Microsoft 2025 Framework is designed for business leaders and focuses on strategic outcomes rather than technical details. Questions are framed around business impact and organizational readiness.",
    category: "requirements"
  },
  {
    question: "Can I save progress and continue later?",
    answer: "Yes, both assessment types automatically save your progress locally. You can also use the Google Drive integration to sync across devices and create named project versions.",
    category: "practical"
  },
  {
    question: "How often should I repeat assessments?",
    answer: "Standard Assessments should be conducted quarterly or after major changes. The Microsoft 2025 Framework is typically reviewed annually or during strategic planning cycles.",
    category: "timing"
  },
  {
    question: "Which assessment helps with compliance?",
    answer: "Both help with compliance but differently. Standard Assessments check current compliance status with detailed controls. Microsoft 2025 Framework ensures your strategy aligns with future Microsoft compliance requirements.",
    category: "compliance"
  }
]

const categories = [
  { id: 'general', label: 'General Questions', color: 'default' },
  { id: 'roles', label: 'Role-Based Questions', color: 'secondary' },
  { id: 'practical', label: 'Practical Information', color: 'outline' },
  { id: 'requirements', label: 'Requirements', color: 'secondary' },
  { id: 'timing', label: 'Timing & Frequency', color: 'outline' },
  { id: 'compliance', label: 'Compliance', color: 'secondary' }
]

export function AssessmentFAQ() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  
  const filteredFaqs = selectedCategory 
    ? faqs.filter(faq => faq.category === selectedCategory)
    : faqs

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription>
          Common questions about choosing between assessment types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All Questions ({faqs.length})
          </Badge>
          {categories.map(cat => {
            const count = faqs.filter(f => f.category === cat.id).length
            return (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label} ({count})
              </Badge>
            )
          })}
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}