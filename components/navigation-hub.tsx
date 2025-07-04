'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  FileText,
  BookOpen,
  Settings,
  Cloud,
  TestTube,
  Sparkles,
  ClipboardCheck,
  TrendingUp,
  Download,
  HelpCircle,
  ExternalLink,
  Code,
  Shield,
  Users,
  Briefcase,
  ChevronRight,
  Home,
  Compass
} from 'lucide-react'
import Link from 'next/link'

interface NavigationItem {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  category: string
  tags: string[]
  isExternal?: boolean
}

const navigationItems: NavigationItem[] = [
  // Core Pages
  {
    title: 'Assessment Dashboard',
    description: 'Main dashboard with all assessment standards and project management',
    href: '/',
    icon: <Home className="h-4 w-4" />,
    category: 'core',
    tags: ['home', 'dashboard', 'overview', 'projects']
  },
  {
    title: 'Microsoft 2025 Framework',
    description: 'Strategic enterprise assessment for digital transformation',
    href: '/microsoft-2025-demo',
    icon: <Sparkles className="h-4 w-4" />,
    category: 'assessments',
    tags: ['strategic', 'enterprise', '2025', 'executive', 'transformation']
  },
  {
    title: 'Standard Assessments',
    description: 'Operational assessments across 10 key governance areas',
    href: '#standard-assessments',
    icon: <ClipboardCheck className="h-4 w-4" />,
    category: 'assessments',
    tags: ['operational', 'governance', 'compliance', 'technical']
  },
  {
    title: 'Enterprise Demo',
    description: 'Executive dashboards and board presentation tools',
    href: '/enterprise-demo',
    icon: <Briefcase className="h-4 w-4" />,
    category: 'demos',
    tags: ['executive', 'board', 'presentation', 'demo']
  },
  
  // Tools & Features
  {
    title: 'Setup Guide',
    description: 'Complete installation and configuration instructions',
    href: '/setup-guide',
    icon: <Settings className="h-4 w-4" />,
    category: 'help',
    tags: ['setup', 'install', 'guide', 'help', 'documentation']
  },
  {
    title: 'Google Drive Integration',
    description: 'Test cloud backup and synchronization features',
    href: '/google-drive-test',
    icon: <Cloud className="h-4 w-4" />,
    category: 'tools',
    tags: ['backup', 'cloud', 'sync', 'google', 'drive']
  },
  
  // Documentation
  {
    title: 'Microsoft Best Practices',
    description: 'Analysis of current Power Platform best practices',
    href: '/MICROSOFT-BEST-PRACTICES-ANALYSIS.md',
    icon: <BookOpen className="h-4 w-4" />,
    category: 'docs',
    tags: ['best practices', 'microsoft', 'documentation', 'guidance'],
    isExternal: true
  },
  {
    title: 'Enterprise Transformation Plan',
    description: 'Detailed roadmap for enterprise platform transformation',
    href: '/ENTERPRISE-TRANSFORMATION-PLAN.md',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'docs',
    tags: ['transformation', 'roadmap', 'enterprise', 'plan'],
    isExternal: true
  },
  {
    title: 'Integration Recommendations',
    description: 'Guidance for integrating with Microsoft ecosystem',
    href: '/INTEGRATION-RECOMMENDATIONS.md',
    icon: <Code className="h-4 w-4" />,
    category: 'docs',
    tags: ['integration', 'api', 'development', 'recommendations'],
    isExternal: true
  },
  {
    title: 'Deployment Guide',
    description: 'Instructions for deploying to production environments',
    href: '/docs/DEPLOYMENT.md',
    icon: <Download className="h-4 w-4" />,
    category: 'docs',
    tags: ['deployment', 'production', 'vercel', 'hosting'],
    isExternal: true
  },
  
  // External Resources
  {
    title: 'Power Platform CoE Kit',
    description: 'Microsoft\'s official Center of Excellence Starter Kit',
    href: 'https://github.com/microsoft/powerapps-tools/tree/master/Administration/CoEStarterKit',
    icon: <Shield className="h-4 w-4" />,
    category: 'external',
    tags: ['coe', 'microsoft', 'official', 'toolkit'],
    isExternal: true
  },
  {
    title: 'Power Platform Documentation',
    description: 'Official Microsoft Power Platform documentation',
    href: 'https://docs.microsoft.com/en-us/power-platform/',
    icon: <FileText className="h-4 w-4" />,
    category: 'external',
    tags: ['documentation', 'microsoft', 'official', 'reference'],
    isExternal: true
  },
  {
    title: 'Well-Architected Framework',
    description: 'Microsoft\'s architectural best practices',
    href: 'https://docs.microsoft.com/en-us/azure/well-architected/',
    icon: <Compass className="h-4 w-4" />,
    category: 'external',
    tags: ['architecture', 'framework', 'best practices', 'azure'],
    isExternal: true
  }
]

const categories = [
  { id: 'all', label: 'All Resources', icon: <Compass className="h-4 w-4" /> },
  { id: 'core', label: 'Core Features', icon: <Home className="h-4 w-4" /> },
  { id: 'assessments', label: 'Assessments', icon: <ClipboardCheck className="h-4 w-4" /> },
  { id: 'tools', label: 'Tools', icon: <Settings className="h-4 w-4" /> },
  { id: 'demos', label: 'Demos', icon: <TestTube className="h-4 w-4" /> },
  { id: 'help', label: 'Help', icon: <HelpCircle className="h-4 w-4" /> },
  { id: 'docs', label: 'Documentation', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'external', label: 'External', icon: <ExternalLink className="h-4 w-4" /> }
]

export function NavigationHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredItems = navigationItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const renderNavigationItem = (item: NavigationItem) => {
    const content = (
      <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {item.icon}
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {item.title}
                  {item.isExternal && <ExternalLink className="h-3 w-3" />}
                </CardTitle>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm mb-2">{item.description}</CardDescription>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    )

    if (item.isExternal) {
      return (
        <a 
          key={item.href} 
          href={item.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      )
    }

    return (
      <Link key={item.href} href={item.href} className="block">
        {content}
      </Link>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5" />
          Resource Navigation Hub
        </CardTitle>
        <CardDescription>
          Quick access to all features, documentation, and resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features, documentation, or resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="flex items-center gap-1 text-xs"
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No resources found matching your search.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map(renderNavigationItem)}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-6 p-4 rounded-lg bg-muted flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {navigationItems.length} resources
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">10 Standards</Badge>
            <Badge variant="outline">6 Pillars</Badge>
            <Badge variant="outline">60+ Questions</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}