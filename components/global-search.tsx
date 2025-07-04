'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  X,
  FileText,
  ClipboardCheck,
  Settings,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Home,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  title: string
  description: string
  href: string
  type: 'page' | 'assessment' | 'documentation' | 'feature' | 'external'
  icon: React.ReactNode
}

const searchableContent: SearchResult[] = [
  // Pages
  {
    title: 'Home Dashboard',
    description: 'Main dashboard with project overview',
    href: '/',
    type: 'page',
    icon: <Home className="h-4 w-4" />
  },
  {
    title: 'Microsoft 2025 Framework',
    description: 'Strategic enterprise assessment',
    href: '/microsoft-2025-demo',
    type: 'page',
    icon: <Sparkles className="h-4 w-4" />
  },
  {
    title: 'Enterprise Demo',
    description: 'Executive dashboards and presentations',
    href: '/enterprise-demo',
    type: 'page',
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: 'Setup Guide',
    description: 'Installation and configuration help',
    href: '/setup-guide',
    type: 'page',
    icon: <Settings className="h-4 w-4" />
  },
  
  // Assessments
  {
    title: 'Documentation Review',
    description: 'Review documentation and rulebooks',
    href: '/assessment/documentation-rulebooks',
    type: 'assessment',
    icon: <ClipboardCheck className="h-4 w-4" />
  },
  {
    title: 'DLP Policy Assessment',
    description: 'Data Loss Prevention evaluation',
    href: '/assessment/dlp-policy',
    type: 'assessment',
    icon: <ClipboardCheck className="h-4 w-4" />
  },
  {
    title: 'Security Assessment',
    description: 'Security and threat detection review',
    href: '/assessment/security-access',
    type: 'assessment',
    icon: <ClipboardCheck className="h-4 w-4" />
  },
  {
    title: 'CoE & Adoption',
    description: 'Center of Excellence maturity',
    href: '/assessment/management-coe',
    type: 'assessment',
    icon: <ClipboardCheck className="h-4 w-4" />
  },
  
  // Features
  {
    title: 'Export to Excel',
    description: 'Export assessment data to Excel',
    href: '/#export',
    type: 'feature',
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: 'Google Drive Backup',
    description: 'Cloud backup integration',
    href: '/google-drive-test',
    type: 'feature',
    icon: <Settings className="h-4 w-4" />
  },
  {
    title: 'Version Control',
    description: 'Track assessment versions',
    href: '/#versions',
    type: 'feature',
    icon: <Settings className="h-4 w-4" />
  },
  
  // Documentation
  {
    title: 'Best Practices',
    description: 'Microsoft Power Platform best practices',
    href: '/MICROSOFT-BEST-PRACTICES-ANALYSIS.md',
    type: 'documentation',
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: 'Transformation Plan',
    description: 'Enterprise transformation roadmap',
    href: '/ENTERPRISE-TRANSFORMATION-PLAN.md',
    type: 'documentation',
    icon: <FileText className="h-4 w-4" />
  },
  
  // External
  {
    title: 'Power Platform Docs',
    description: 'Official Microsoft documentation',
    href: 'https://docs.microsoft.com/power-platform/',
    type: 'external',
    icon: <ExternalLink className="h-4 w-4" />
  },
  {
    title: 'CoE Starter Kit',
    description: 'Microsoft CoE toolkit',
    href: 'https://github.com/microsoft/powerapps-tools',
    type: 'external',
    icon: <ExternalLink className="h-4 w-4" />
  }
]

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
      
      // Arrow navigation
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % results.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          const selected = results[selectedIndex]
          if (selected) {
            if (selected.type === 'external') {
              window.open(selected.href, '_blank')
            } else {
              router.push(selected.href)
            }
            setIsOpen(false)
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, router])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchableContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  const typeColors = {
    page: 'blue',
    assessment: 'green',
    documentation: 'purple',
    feature: 'amber',
    external: 'red'
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative w-full max-w-sm mx-auto"
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <span className="ml-8 text-muted-foreground">Search...</span>
        <kbd className="absolute right-3 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[20%] max-h-[60vh] w-[90vw] max-w-2xl translate-x-[-50%] overflow-hidden rounded-lg border bg-background shadow-lg">
        <div className="flex items-center border-b p-3">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, assessments, features..."
            className="flex-1 border-0 bg-transparent p-0 focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {results.map((result, index) => (
              <Link
                key={index}
                href={result.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg p-3 hover:bg-accent ${
                  index === selectedIndex ? 'bg-accent' : ''
                }`}
              >
                <div className="flex-shrink-0">{result.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
        
        {query.length > 0 && results.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Search className="mx-auto mb-4 h-12 w-12 opacity-20" />
            <p>No results found for "{query}"</p>
          </div>
        )}
        
        <div className="border-t p-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between px-2">
            <div className="flex gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>esc Close</span>
            </div>
            <span>{results.length} results</span>
          </div>
        </div>
      </div>
    </div>
  )
}