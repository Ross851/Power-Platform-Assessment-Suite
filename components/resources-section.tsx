'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  BookOpen,
  Video,
  Download,
  ExternalLink,
  Github,
  MessageSquare,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface ResourceCard {
  title: string
  description: string
  icon: React.ReactNode
  links: {
    label: string
    href: string
    isExternal?: boolean
    badge?: string
  }[]
  color: string
}

const resources: ResourceCard[] = [
  {
    title: 'Learning Resources',
    description: 'Educational materials and training guides',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'blue',
    links: [
      {
        label: 'Setup Guide',
        href: '/setup-guide',
        badge: 'Interactive'
      },
      {
        label: 'Power Platform Learning Path',
        href: 'https://learn.microsoft.com/en-us/training/powerplatform/',
        isExternal: true,
        badge: 'Official'
      },
      {
        label: 'CoE Starter Kit Guide',
        href: 'https://learn.microsoft.com/en-us/power-platform/guidance/coe/starter-kit',
        isExternal: true
      },
      {
        label: 'Best Practices Analysis',
        href: '/MICROSOFT-BEST-PRACTICES-ANALYSIS.md',
        badge: 'In-App Doc'
      }
    ]
  },
  {
    title: 'Technical Documentation',
    description: 'Architecture guides and API references',
    icon: <FileText className="h-5 w-5" />,
    color: 'green',
    links: [
      {
        label: 'Power Platform Docs',
        href: 'https://docs.microsoft.com/en-us/power-platform/',
        isExternal: true,
        badge: 'Microsoft'
      },
      {
        label: 'Well-Architected Framework',
        href: 'https://docs.microsoft.com/en-us/power-platform/well-architected/',
        isExternal: true
      },
      {
        label: 'Integration Guide',
        href: '/INTEGRATION-RECOMMENDATIONS.md',
        badge: 'Local'
      },
      {
        label: 'Deployment Guide',
        href: '/docs/DEPLOYMENT.md'
      }
    ]
  },
  {
    title: 'Community & Support',
    description: 'Connect with experts and get help',
    icon: <Users className="h-5 w-5" />,
    color: 'purple',
    links: [
      {
        label: 'Power Platform Community',
        href: 'https://powerusers.microsoft.com/',
        isExternal: true,
        badge: 'Forum'
      },
      {
        label: 'GitHub - CoE Starter Kit',
        href: 'https://github.com/microsoft/powerapps-tools',
        isExternal: true,
        badge: 'Open Source'
      },
      {
        label: 'Power CAT Team Blog',
        href: 'https://powerapps.microsoft.com/en-us/blog/',
        isExternal: true
      },
      {
        label: 'Stack Overflow',
        href: 'https://stackoverflow.com/questions/tagged/powerapps',
        isExternal: true
      }
    ]
  },
  {
    title: 'Tools & Templates',
    description: 'Accelerators and productivity tools',
    icon: <Zap className="h-5 w-5" />,
    color: 'amber',
    links: [
      {
        label: 'Assessment Templates',
        href: '#standard-assessments',
        badge: '10 Standards'
      },
      {
        label: 'Microsoft 2025 Framework',
        href: '/microsoft-2025-demo',
        badge: 'NEW'
      },
      {
        label: 'Power Platform CLI',
        href: 'https://docs.microsoft.com/en-us/power-platform/developer/cli/introduction',
        isExternal: true
      },
      {
        label: 'ALM Toolkit',
        href: 'https://github.com/microsoft/PowerApps-Toolbox/tree/master/Administration/ALMAcceleratorForAdvancedMakers',
        isExternal: true
      }
    ]
  },
  {
    title: 'Governance & Security',
    description: 'Compliance and security resources',
    icon: <Shield className="h-5 w-5" />,
    color: 'red',
    links: [
      {
        label: 'Security Documentation',
        href: 'https://docs.microsoft.com/en-us/power-platform/admin/security/',
        isExternal: true,
        badge: 'Critical'
      },
      {
        label: 'DLP Policy Guide',
        href: 'https://docs.microsoft.com/en-us/power-platform/admin/dlp-policies',
        isExternal: true
      },
      {
        label: 'Compliance Center',
        href: 'https://compliance.microsoft.com/',
        isExternal: true
      },
      {
        label: 'Trust Center',
        href: 'https://www.microsoft.com/en-us/trust-center',
        isExternal: true
      }
    ]
  },
  {
    title: 'Success Stories',
    description: 'Case studies and implementation examples',
    icon: <Award className="h-5 w-5" />,
    color: 'indigo',
    links: [
      {
        label: 'Customer Stories',
        href: 'https://customers.microsoft.com/en-us/search?sq=power%20platform',
        isExternal: true,
        badge: 'Inspiring'
      },
      {
        label: 'Enterprise Demo',
        href: '/enterprise-demo',
        badge: 'See it Live'
      },
      {
        label: 'ROI Calculator',
        href: 'https://roi.dynamics.com/power-platform/',
        isExternal: true
      },
      {
        label: 'Adoption Guide',
        href: 'https://adoption.microsoft.com/en-us/power-platform/',
        isExternal: true
      }
    ]
  }
]

export function ResourcesSection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Resources & Documentation</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Everything you need to succeed with Power Platform governance and assessment
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index} className={`border-t-4 border-t-${resource.color}-600`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-${resource.color}-100 text-${resource.color}-600`}>
                  {resource.icon}
                </div>
                {resource.title}
              </CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resource.links.map((link, linkIndex) => (
                  <div key={linkIndex}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{link.label}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {link.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {link.badge}
                            </Badge>
                          )}
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{link.label}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {link.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {link.badge}
                            </Badge>
                          )}
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Need more resources?</h3>
            <p className="text-muted-foreground">
              Visit the Microsoft Learn platform for comprehensive Power Platform training
            </p>
          </div>
          <Button asChild>
            <a href="https://learn.microsoft.com/training/powerplatform/" target="_blank" rel="noopener noreferrer">
              Browse All Courses
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}