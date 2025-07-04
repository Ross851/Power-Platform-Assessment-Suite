'use client'

import React, { useState, useRef } from 'react'
import { 
  Card, 
  TextInput, 
  Textarea, 
  Select, 
  Progress, 
  Tooltip, 
  Badge,
  Button,
  Rating,
  ToggleSwitch,
  Radio,
  Checkbox,
  Label,
  Alert,
  Tabs
} from 'flowbite-react'
import type { CustomFlowbiteTheme } from 'flowbite-react'
import { 
  HiInformationCircle,
  HiCheckCircle,
  HiExclamation,
  HiXCircle,
  HiLightBulb,
  HiSparkles,
  HiClock,
  HiChartBar,
  HiShieldCheck,
  HiLockClosed,
  HiCloud,
  HiDatabase,
  HiPencil,
  HiAnnotation,
  HiDocumentText,
  HiLocationMarker,
  HiCode,
  HiExternalLink,
  HiPaperClip,
  HiUpload
} from 'react-icons/hi'
import { PowerPlatformIcons, iconColors } from '@/lib/icon-system'
import { cn } from '@/lib/utils'
import type { Question } from '@/types/assessment'
import type { EnhancedQuestion } from '@/lib/microsoft-2025-assessment-enhanced'

interface EnhancedQuestionWithGuidanceProps {
  question: EnhancedQuestion
  value: any
  onChange: (value: any) => void
  onAddNote?: (note: string) => void
  showGuidance?: boolean
  showBestPractice?: boolean
  readonly?: boolean
}

export function EnhancedQuestionWithGuidance({ 
  question, 
  value, 
  onChange, 
  onAddNote,
  showGuidance = true,
  showBestPractice = true,
  readonly = false
}: EnhancedQuestionWithGuidanceProps) {
  // Safety check for question object
  if (!question || !question.id) {
    return null
  }
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState('')
  const [expandedGuidance, setExpandedGuidance] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getStatusIcon = (val: any) => {
    if (!val || val === 0) return null
    
    const score = typeof val === 'number' ? val : 3
    
    if (score >= 4) {
      return <HiCheckCircle className={cn("w-5 h-5", iconColors.excellent)} />
    } else if (score >= 3) {
      return <HiCheckCircle className={cn("w-5 h-5", iconColors.good)} />
    } else if (score >= 2) {
      return <HiExclamation className={cn("w-5 h-5", iconColors.needsImprovement)} />
    } else {
      return <HiXCircle className={cn("w-5 h-5", iconColors.critical)} />
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'Security': HiShieldCheck,
      'Compliance': HiLockClosed,
      'Cloud': HiCloud,
      'Data': HiDatabase,
      'Performance': HiChartBar,
      'Governance': HiShieldCheck
    }
    
    const Icon = iconMap[category] || HiInformationCircle
    return <Icon className="w-5 h-5" />
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Not at all</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Completely</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={value || 1}
              onChange={(e) => onChange(parseInt(e.target.value))}
              disabled={readonly}
              className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - 1) / 4) * 100}%, #e5e7eb ${((value - 1) / 4) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        )
        
      case 'rating':
        return (
          <div className="flex items-center space-x-4">
            <Rating size="lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <Rating.Star
                  key={star}
                  filled={star <= (value || 0)}
                  onClick={() => !readonly && onChange(star)}
                  className={readonly ? 'cursor-default' : 'cursor-pointer'}
                />
              ))}
            </Rating>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {value || 0} out of 5
            </span>
          </div>
        )
        
      case 'multipleChoice':
        return (
          <fieldset className="space-y-3">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <Radio
                  id={`${question.id}-${option.value}`}
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => !readonly && onChange(option.value)}
                  disabled={readonly}
                />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                  disabled={readonly}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </fieldset>
        )
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-4">
            <ToggleSwitch
              checked={value || false}
              onChange={onChange}
              disabled={readonly}
              label=""
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {value ? 'Yes' : 'No'}
            </span>
          </div>
        )
        
      case 'text':
        return (
          <TextInput
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={readonly}
            placeholder="Enter your response..."
            className="w-full"
          />
        )
        
      case 'longText':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={readonly}
            placeholder="Provide detailed information..."
            rows={4}
            className="w-full"
          />
        )
        
      default:
        return null
    }
  }

  return (
    <Card className="transition-all hover:shadow-lg">
      <div className="space-y-4">
        {/* Question Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {getCategoryIcon(question.category)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {question.text}
                  {question.required && (
                    <Badge color="red" size="xs">Required</Badge>
                  )}
                </h3>
                {question.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {question.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {getStatusIcon(value)}
            {showGuidance && question.guidance && (
              <Tooltip
                content={
                  <div className="max-w-xs">
                    <p className="font-semibold mb-1">Guidance</p>
                    <p className="text-sm">{question.guidance}</p>
                  </div>
                }
                placement="left"
              >
                <HiInformationCircle className="w-5 h-5 text-blue-500 cursor-help" />
              </Tooltip>
            )}
          </div>
        </div>

        {/* Question Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge color="gray" size="xs">
            Weight: {question.weight}
          </Badge>
          <Badge color="purple" size="xs">
            Impact: {question.importance}/5
          </Badge>
          {question.tags?.map((tag) => (
            <Badge key={tag} color="info" size="xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Question Input */}
        <div className="py-2">
          {renderQuestionInput()}
        </div>

        {/* Best Practice Alert */}
        {showBestPractice && question.bestPractice && (
          <Alert color="info" icon={HiLightBulb}>
            <span className="font-medium">Best Practice:</span> {question.bestPractice}
          </Alert>
        )}

        {/* Expanded Guidance Section */}
        {(question.microsoftDocs || question.tenantLocation || question.implementationSteps || question.commonIssues) && (
          <div className="border-t pt-3 dark:border-gray-700">
            <Button
              size="xs"
              color="gray"
              onClick={() => setExpandedGuidance(!expandedGuidance)}
            >
              <HiDocumentText className="w-3 h-3 mr-1" />
              {expandedGuidance ? 'Hide' : 'Show'} Detailed Guidance
            </Button>
            
            {expandedGuidance && (
              <div className="mt-4">
                <Tabs style="underline">
                  {question.tenantLocation && question.tenantLocation.length > 0 && (
                    <Tabs.Item active={true} title="Where to Find" icon={HiLocationMarker}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tenant Locations:
                        </p>
                        <ul className="space-y-1">
                          {question.tenantLocation.map((location, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="mr-2">•</span>
                              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                                {location}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Tabs.Item>
                  )}
                  
                  {question.implementationSteps && question.implementationSteps.length > 0 && (
                    <Tabs.Item title="How to Implement" icon={HiCode}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Implementation Steps:
                        </p>
                        <ol className="space-y-2">
                          {question.implementationSteps.map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                              <span className="mr-2 font-medium">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </Tabs.Item>
                  )}
                  
                  {question.commonIssues && question.commonIssues.length > 0 && (
                    <Tabs.Item title="Common Issues" icon={HiExclamation}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Known Issues & Solutions:
                        </p>
                        <ul className="space-y-2">
                          {question.commonIssues.map((issue, idx) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                              <HiExclamation className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Tabs.Item>
                  )}
                  
                  {question.microsoftDocs && question.microsoftDocs.length > 0 && (
                    <Tabs.Item title="Documentation" icon={HiDocumentText}>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Microsoft Documentation:
                        </p>
                        <ul className="space-y-1">
                          {question.microsoftDocs.map((doc, idx) => (
                            <li key={idx}>
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
                              >
                                <HiExternalLink className="w-3 h-3 mr-1" />
                                {doc.replace('https://learn.microsoft.com/', 'MS Learn: ').replace('https://github.com/', 'GitHub: ')}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Tabs.Item>
                  )}
                </Tabs>
              </div>
            )}
          </div>
        )}

        {/* Progress Indicator for Scale Questions */}
        {question.type === 'scale' && value > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium">{((value - 1) / 4 * 100).toFixed(0)}%</span>
            </div>
            <Progress
              progress={((value - 1) / 4 * 100)}
              size="sm"
              color={
                value >= 4 ? 'green' :
                value >= 3 ? 'blue' :
                value >= 2 ? 'yellow' : 'red'
              }
            />
          </div>
        )}

        {/* Note Section */}
        <div className="border-t pt-3 dark:border-gray-700">
          {!showNoteInput ? (
            <Button
              size="xs"
              color="gray"
              onClick={() => setShowNoteInput(true)}
              disabled={readonly}
            >
              <HiAnnotation className="w-3 h-3 mr-1" />
              Add Note
            </Button>
          ) : (
            <div className="space-y-3">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add additional context or notes..."
                rows={2}
                className="text-sm"
              />
              
              {/* File Upload Section */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setUploadedFiles(prev => [...prev, ...files])
                  }}
                  className="hidden"
                />
                <Button
                  size="xs"
                  color="light"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <HiPaperClip className="w-3 h-3 mr-1" />
                  Attach Evidence
                </Button>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-1">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <HiDocumentText className="w-3 h-3" />
                        <span>{file.name}</span>
                        <button
                          onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="xs"
                  onClick={() => {
                    if (onAddNote && (note || uploadedFiles.length > 0)) {
                      const fullNote = note + (uploadedFiles.length > 0 ? `\n\nAttached files: ${uploadedFiles.map(f => f.name).join(', ')}` : '')
                      onAddNote(fullNote)
                      setNote('')
                      setUploadedFiles([])
                      setShowNoteInput(false)
                    }
                  }}
                  disabled={!note && uploadedFiles.length === 0}
                >
                  Save Note & Evidence
                </Button>
                <Button
                  size="xs"
                  color="gray"
                  onClick={() => {
                    setNote('')
                    setUploadedFiles([])
                    setShowNoteInput(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Suggestion (if available) */}
        {question.aiSuggestion && (
          <Alert color="purple" icon={HiSparkles}>
            <div>
              <span className="font-medium">AI Insight:</span>
              <p className="text-sm mt-1">{question.aiSuggestion}</p>
            </div>
          </Alert>
        )}
      </div>
    </Card>
  )
}