'use client'

import dynamic from 'next/dynamic'

// Dynamically import the enhanced question component to avoid SSR issues
export const ClientEnhancedQuestionWithGuidance = dynamic(
  () => import('./enhanced-question-with-guidance').then(mod => mod.EnhancedQuestionWithGuidance),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }
)