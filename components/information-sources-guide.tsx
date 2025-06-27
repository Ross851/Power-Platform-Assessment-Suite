"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Globe, 
  Users, 
  Settings, 
  Shield, 
  Database,
  GitBranch,
  BarChart,
  Lock,
  Workflow,
  ExternalLink
} from "lucide-react"

interface InformationSource {
  name: string
  description: string
  locations: string[]
  icon: React.ReactNode
  tips?: string[]
}

const informationSources: Record<string, InformationSource[]> = {
  "documentation-rulebooks": [
    {
      name: "Microsoft Power Platform Admin Documentation",
      description: "Official comprehensive admin guide covering all aspects",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/",
        "Admin overview and concepts",
        "Environment management guides",
        "Security and governance documentation",
        "Best practices and recommendations"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Start with the 'Get started' section for overview",
        "Use the table of contents to find specific topics",
        "Check 'Create and manage environments' for governance",
        "Review 'Manage security and users' for access control"
      ]
    },
    {
      name: "SharePoint/Teams Sites",
      description: "Organization's documentation repositories",
      locations: [
        "IT Governance SharePoint site",
        "Power Platform Center of Excellence Teams channel",
        "Corporate Wiki or Knowledge Base",
        "IT Standards and Procedures library"
      ],
      icon: <FileText className="h-4 w-4" />,
      tips: [
        "Look for 'Power Platform Governance' or 'CoE' sites",
        "Check for documentation templates and standards",
        "Review any existing rulebooks or guidelines"
      ]
    },
    {
      name: "Power Platform Admin Center",
      description: "Official admin portal for Power Platform",
      locations: [
        "https://admin.powerplatform.microsoft.com",
        "Policies section",
        "Governance settings",
        "Environment strategies"
      ],
      icon: <Settings className="h-4 w-4" />
    }
  ],
  "dlp-policy": [
    {
      name: "Microsoft Learn - DLP Policies",
      description: "Official documentation for Data Loss Prevention",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/wp-data-loss-prevention",
        "DLP policy creation and management",
        "Connector classification guide",
        "Policy enforcement and monitoring"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review 'Create a data loss prevention policy' guide",
        "Check connector reference documentation",
        "Understand policy evaluation order"
      ]
    },
    {
      name: "Power Platform Admin Center - Policies",
      description: "DLP policy configuration and management",
      locations: [
        "https://admin.powerplatform.microsoft.com → Data policies",
        "Environment-level DLP settings",
        "Tenant-level DLP policies",
        "Policy violation reports"
      ],
      icon: <Shield className="h-4 w-4" />,
      tips: [
        "Screenshot existing DLP policies",
        "Document connector classifications",
        "Note any policy exemptions"
      ]
    },
    {
      name: "Azure AD & Compliance Center",
      description: "Additional security and compliance settings",
      locations: [
        "Azure AD Conditional Access policies",
        "Microsoft Purview compliance center",
        "Information protection labels",
        "Data classification policies"
      ],
      icon: <Lock className="h-4 w-4" />
    }
  ],
  "administration-governance": [
    {
      name: "Microsoft Learn - Environment Strategy",
      description: "Official guidance on environment management",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/environment-strategy",
        "Environment types and licensing",
        "Capacity management",
        "Environment lifecycle management"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review environment strategy best practices",
        "Understand production vs sandbox environments",
        "Check capacity allocation guidance"
      ]
    },
    {
      name: "Power Platform Admin Center - Environments",
      description: "Environment management and settings",
      locations: [
        "Environment list and details",
        "Security groups and roles",
        "Capacity allocation",
        "Environment creation policies"
      ],
      icon: <Database className="h-4 w-4" />
    },
    {
      name: "Azure AD Groups & Teams",
      description: "User and group management",
      locations: [
        "Power Platform admin groups",
        "Environment security groups",
        "Maker security groups",
        "CoE team membership"
      ],
      icon: <Users className="h-4 w-4" />
    }
  ],
  "automation-alm": [
    {
      name: "Microsoft Learn - ALM Guide",
      description: "Application lifecycle management documentation",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/alm/",
        "Solution concepts and strategies",
        "Development lifecycle guidance",
        "Deployment pipeline setup"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Start with 'Overview of ALM'",
        "Review solution layering concepts",
        "Check automated deployment guides"
      ]
    },
    {
      name: "Azure DevOps / GitHub",
      description: "Source control and pipelines",
      locations: [
        "Power Platform solution repositories",
        "Build and release pipelines",
        "Solution deployment history",
        "Branch policies and approvals"
      ],
      icon: <GitBranch className="h-4 w-4" />,
      tips: [
        "Look for solution export/import pipelines",
        "Check for automated testing",
        "Review deployment approvals"
      ]
    },
    {
      name: "Power Platform Pipelines",
      description: "Native deployment pipelines",
      locations: [
        "Deployment pipelines in maker portal",
        "Environment routes configuration",
        "Deployment history",
        "Pipeline run logs"
      ],
      icon: <Workflow className="h-4 w-4" />
    }
  ],
  "monitoring-analytics": [
    {
      name: "Microsoft Learn - Analytics & Monitoring",
      description: "Official monitoring and analytics documentation",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/analytics-common-data-service",
        "Platform analytics overview",
        "Capacity analytics",
        "Performance monitoring"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review available analytics reports",
        "Understand capacity metrics",
        "Check API usage monitoring"
      ]
    },
    {
      name: "Power Platform Admin Center - Analytics",
      description: "Built-in analytics and reports",
      locations: [
        "Analytics → Power Apps/Automate/BI",
        "Usage reports",
        "Performance metrics",
        "Capacity reports"
      ],
      icon: <BarChart className="h-4 w-4" />
    },
    {
      name: "CoE Starter Kit Dashboard",
      description: "Center of Excellence analytics",
      locations: [
        "Power BI CoE dashboard",
        "Maker activity reports",
        "App/flow inventory",
        "Compliance tracking"
      ],
      icon: <BarChart className="h-4 w-4" />,
      tips: [
        "Check if CoE Starter Kit is deployed",
        "Review custom monitoring solutions",
        "Look for adoption metrics"
      ]
    }
  ],
  "security-compliance": [
    {
      name: "Microsoft Learn - Security & Compliance",
      description: "Comprehensive security documentation",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/security/",
        "Security roles and privileges",
        "Data security and encryption",
        "Compliance and certifications"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review security best practices",
        "Understand role-based security",
        "Check compliance requirements"
      ]
    },
    {
      name: "Microsoft Purview Compliance Center",
      description: "Compliance and data governance",
      locations: [
        "https://compliance.microsoft.com",
        "Data classification policies",
        "Retention policies",
        "Audit logs"
      ],
      icon: <Shield className="h-4 w-4" />
    },
    {
      name: "Azure Security Center",
      description: "Security posture and recommendations",
      locations: [
        "Security recommendations",
        "Compliance dashboard",
        "Threat protection status",
        "Security alerts"
      ],
      icon: <Lock className="h-4 w-4" />
    }
  ],
  "training-adoption": [
    {
      name: "Microsoft Learn - Training Resources",
      description: "Official training and adoption resources",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/nurture-community",
        "https://learn.microsoft.com/training/powerplatform/",
        "Power Platform adoption center",
        "Training paths and modules",
        "Certification programs"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Check 'Nurture your community' guide",
        "Review available learning paths",
        "Track certification completions"
      ]
    },
    {
      name: "Microsoft Learn & Documentation",
      description: "Official training resources",
      locations: [
        "https://learn.microsoft.com/power-platform",
        "Power Platform adoption center",
        "Training completion reports",
        "Certification tracking"
      ],
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Internal Training Systems",
      description: "Organization's learning management",
      locations: [
        "LMS training completion data",
        "Internal wiki or knowledge base",
        "Teams training channels",
        "User feedback surveys"
      ],
      icon: <Users className="h-4 w-4" />
    }
  ],
  "support-community": [
    {
      name: "Microsoft Learn - Support Resources",
      description: "Official support and community guidance",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/admin/get-help-support",
        "Support ticket management",
        "Community resources",
        "Troubleshooting guides"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review support options available",
        "Check service health dashboard",
        "Understand support SLAs"
      ]
    },
    {
      name: "Internal Support Channels",
      description: "Organization's support structure",
      locations: [
        "IT Service Desk tickets",
        "Power Platform support team",
        "Teams support channels",
        "Support documentation"
      ],
      icon: <Users className="h-4 w-4" />
    },
    {
      name: "Community Resources",
      description: "User communities and forums",
      locations: [
        "Internal Power Platform community",
        "Yammer groups",
        "Teams communities",
        "User group meeting notes"
      ],
      icon: <Globe className="h-4 w-4" />
    }
  ],
  "innovation-optimization": [
    {
      name: "Microsoft Learn - Best Practices",
      description: "Innovation and optimization guidance",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/guidance/",
        "Architecture best practices",
        "Performance optimization",
        "Innovation patterns"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review architecture guidance",
        "Check performance best practices",
        "Look for innovation case studies"
      ]
    },
    {
      name: "Innovation Hub/Lab",
      description: "Innovation tracking and experiments",
      locations: [
        "Innovation project repository",
        "POC and pilot documentation",
        "Business case templates",
        "ROI tracking spreadsheets"
      ],
      icon: <Workflow className="h-4 w-4" />
    },
    {
      name: "Performance Metrics",
      description: "Optimization and efficiency data",
      locations: [
        "App performance dashboards",
        "Process automation metrics",
        "Time savings calculations",
        "User satisfaction scores"
      ],
      icon: <BarChart className="h-4 w-4" />
    }
  ],
  "business-value": [
    {
      name: "Microsoft Learn - Business Value",
      description: "ROI and business value resources",
      locations: [
        "https://learn.microsoft.com/en-us/power-platform/guidance/adoption/business-value",
        "Business value framework",
        "ROI calculation guides",
        "Success metrics"
      ],
      icon: <Globe className="h-4 w-4" />,
      tips: [
        "Review business value toolkit",
        "Use ROI calculator templates",
        "Check success story examples"
      ]
    },
    {
      name: "Financial Systems",
      description: "ROI and cost tracking",
      locations: [
        "Cost center reports",
        "License utilization data",
        "Project ROI calculations",
        "Budget allocation documents"
      ],
      icon: <BarChart className="h-4 w-4" />
    },
    {
      name: "Business Impact Documentation",
      description: "Value realization tracking",
      locations: [
        "Business case studies",
        "Success stories repository",
        "KPI dashboards",
        "Executive presentations"
      ],
      icon: <FileText className="h-4 w-4" />
    }
  ]
}

export function InformationSourcesGuide({ area }: { area?: string }) {
  const allAreas = Object.keys(informationSources)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Where to Find Information
        </CardTitle>
        <CardDescription>
          Key locations and resources for gathering assessment information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {area && informationSources[area] ? (
          // Show specific area
          <div className="space-y-4">
            {informationSources[area].map((source, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{source.icon}</div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium">{source.name}</h4>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                    <div className="space-y-1">
                      {source.locations.map((location, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-muted-foreground">•</span>
                          {location.includes('http') ? (
                            <a 
                              href={location.split(' → ')[0]} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                            >
                              {location}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            location
                          )}
                        </div>
                      ))}
                    </div>
                    {source.tips && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-md">
                        <p className="text-xs font-medium mb-1">💡 Tips:</p>
                        {source.tips.map((tip, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            • {tip}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Show all areas in tabs
          <Tabs defaultValue={allAreas[0]} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-5 h-auto">
              {allAreas.map((areaKey) => (
                <TabsTrigger key={areaKey} value={areaKey} className="text-xs">
                  {areaKey.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </TabsTrigger>
              ))}
            </TabsList>
            {allAreas.map((areaKey) => (
              <TabsContent key={areaKey} value={areaKey} className="space-y-4 mt-4">
                {informationSources[areaKey]?.map((source, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{source.icon}</div>
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{source.name}</h4>
                        <p className="text-sm text-muted-foreground">{source.description}</p>
                        <div className="space-y-1">
                          {source.locations.map((location, idx) => (
                            <div key={idx} className="text-sm flex items-center gap-2">
                              <span className="text-muted-foreground">•</span>
                              {location.includes('http') ? (
                                <a 
                                  href={location.split(' → ')[0]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                                >
                                  {location}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                location
                              )}
                            </div>
                          ))}
                        </div>
                        {source.tips && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-md">
                            <p className="text-xs font-medium mb-1">💡 Tips:</p>
                            {source.tips.map((tip, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground">
                                • {tip}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            General Information Gathering Tips
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="font-semibold">• Start with Microsoft Learn documentation at <a href="https://learn.microsoft.com/en-us/power-platform/admin/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">learn.microsoft.com/power-platform/admin</a> - it covers most assessment areas comprehensively</li>
            <li>• Schedule meetings with IT administrators and Power Platform champions</li>
            <li>• Request read-only access to admin centers for assessment purposes</li>
            <li>• Take screenshots of configurations and policies for documentation</li>
            <li>• Interview key stakeholders about current processes and pain points</li>
            <li>• Review any existing documentation, even if outdated</li>
            <li>• Check Microsoft Teams channels for informal documentation</li>
            <li>• Use the Microsoft Learn search to find specific topics quickly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 