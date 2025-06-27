"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronRight, Copy, ExternalLink, Terminal, MousePointer, FileText, CheckCircle2 } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface QuickGuideProps {
  area: string
}

interface StepInstruction {
  id: string
  title: string
  steps: {
    action: string
    details?: string
    code?: string
    output?: string
    screenshot?: string
  }[]
  tips?: string[]
}

const areaInstructions: Record<string, StepInstruction[]> = {
  // Main assessment areas with correct slugs from constants
  "environment-usage": [
    {
      id: "check-environments",
      title: "Check Environment Strategy",
      steps: [
        {
          action: "Open Power Platform Admin Center",
          details: "https://admin.powerplatform.microsoft.com"
        },
        {
          action: "Click 'Environments' in left navigation"
        },
        {
          action: "Count and categorize environments",
          details: "Look for: Production, Development, Test, Personal productivity"
        },
        {
          action: "For each environment, click to view details",
          details: "Note: Type, Purpose, Region, Created date"
        },
        {
          action: "Run this PowerShell to export list",
          code: `Get-AdminPowerAppEnvironment | Select-Object DisplayName, EnvironmentType, CreatedTime, Region | Export-Csv "environments.csv"`
        }
      ],
      tips: [
        "Take screenshots of the environments list",
        "Document any environments without clear naming conventions",
        "Note which environments have database enabled"
      ]
    },
    {
      id: "check-dlp-policies",
      title: "Review DLP Policies",
      steps: [
        {
          action: "In Admin Center, click 'Policies' → 'Data policies'"
        },
        {
          action: "Screenshot the list of policies"
        },
        {
          action: "For each policy, click to open",
          details: "Document: Name, Scope (environments), Connectors in Business/Non-business"
        },
        {
          action: "Run PowerShell to export DLP policies",
          code: `Get-DlpPolicy | ForEach-Object {
    $policy = $_
    Get-DlpPolicyConnectorConfigurations -PolicyName $policy.PolicyName
} | Export-Csv "dlp-policies.csv"`
        }
      ]
    }
  ],
  "dlp-policy": [
    {
      id: "analyze-dlp-coverage",
      title: "Analyze DLP Policy Coverage",
      steps: [
        {
          action: "Navigate to Power Platform Admin Center",
          details: "https://admin.powerplatform.microsoft.com"
        },
        {
          action: "Go to Policies → Data policies"
        },
        {
          action: "Create a matrix of policies vs environments",
          details: "Note which environments are covered by which policies"
        },
        {
          action: "For each policy, document",
          details: "1. Business connectors\n2. Non-business connectors\n3. Blocked connectors"
        },
        {
          action: "Run this script to check policy effectiveness",
          code: `# Get all policies and their configurations
$policies = Get-DlpPolicy
foreach ($policy in $policies) {
    Write-Host "Policy: $($policy.DisplayName)"
    $connectors = Get-DlpPolicyConnectorConfigurations -PolicyName $policy.PolicyName
    $connectors | Group-Object Classification | Format-Table
}`
        }
      ],
      tips: [
        "Look for gaps where environments have no DLP policy",
        "Check if default connectors like SharePoint and Office 365 are properly classified",
        "Document any custom connectors and their classifications"
      ]
    }
  ],
  // These sections are kept for backward compatibility but mapped to new areas
  "admin-governance": [
    {
      id: "audit-admin-roles",
      title: "Audit Administrative Roles",
      steps: [
        {
          action: "Open Microsoft 365 Admin Center",
          details: "https://admin.microsoft.com"
        },
        {
          action: "Navigate to Users → Active users"
        },
        {
          action: "Click 'Filter' → 'Global administrators'",
          details: "Screenshot and count global admins"
        },
        {
          action: "Go to Azure AD Portal",
          details: "https://portal.azure.com → Azure Active Directory → Roles and administrators"
        },
        {
          action: "Search for these Power Platform roles",
          details: "- Power Platform Administrator\n- Dynamics 365 Administrator\n- Power Apps Administrator"
        },
        {
          action: "For each role, click and view assignments",
          details: "Document: User name, Assignment date, Assignment type (Permanent/Eligible)"
        },
        {
          action: "Run audit report script",
          code: `# Connect to Azure AD
Connect-AzureAD

# Get Power Platform related role assignments
$roles = @(
    "Power Platform Administrator",
    "Dynamics 365 Administrator", 
    "Global Administrator"
)

foreach ($roleName in $roles) {
    $role = Get-AzureADDirectoryRole | Where-Object {$_.DisplayName -eq $roleName}
    if ($role) {
        Write-Host "Role: $roleName"
        Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId | 
            Select-Object DisplayName, UserPrincipalName, UserType
    }
}`
        }
      ],
      tips: [
        "Flag any service accounts with admin roles",
        "Note if MFA is enabled for admin accounts",
        "Check last sign-in dates for admin accounts"
      ]
    }
  ],
  "monitoring-compliance": [
    {
      id: "setup-activity-logging",
      title: "Check Activity Logging Configuration",
      steps: [
        {
          action: "Open Microsoft Purview Compliance Portal",
          details: "https://compliance.microsoft.com"
        },
        {
          action: "Navigate to Audit → Search"
        },
        {
          action: "Run a test search for last 7 days",
          details: "Activities: All Power Apps and Power Automate activities"
        },
        {
          action: "Document what events are being captured"
        },
        {
          action: "Check Office 365 Security & Compliance PowerShell",
          code: `# Connect to Security & Compliance Center
Connect-IPPSSession

# Check audit log configuration
Get-AdminAuditLogConfig | Select-Object UnifiedAuditLogIngestionEnabled

# Search recent Power Platform activities
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-7) -EndDate (Get-Date) -RecordType PowerAppsApp -ResultSize 100`
        },
        {
          action: "Navigate to Power Platform Admin Center Analytics",
          details: "Admin Center → Analytics → Power Apps/Power Automate"
        },
        {
          action: "Screenshot available reports and dashboards"
        }
      ],
      tips: [
        "Verify audit retention period meets compliance requirements",
        "Check if automated alerts are configured",
        "Document any gaps in monitoring coverage"
      ]
    }
  ],
  "automation-alm": [
    {
      id: "check-solution-management",
      title: "Assess Solution Management",
      steps: [
        {
          action: "In each environment, go to Solutions",
          details: "Power Apps maker portal → Solutions"
        },
        {
          action: "Document solution structure",
          details: "- Managed vs Unmanaged\n- Publisher information\n- Version numbers\n- Dependencies"
        },
        {
          action: "Check for ALM practices",
          code: `# Export solution list from environment
pac solution list --environment [environment-id]

# Check solution history
pac solution history --solution-name [solution-name]`
        },
        {
          action: "Review deployment pipelines",
          details: "Admin Center → Environments → Pipelines"
        },
        {
          action: "Document source control integration",
          details: "Check if solutions are stored in Git/Azure DevOps"
        }
      ]
    }
  ],
  "capacity-licensing": [
    {
      id: "analyze-capacity-usage",
      title: "Analyze Capacity and Usage",
      steps: [
        {
          action: "Open Power Platform Admin Center",
          details: "Navigate to Resources → Capacity"
        },
        {
          action: "Screenshot capacity summary",
          details: "Document: Database, File, Log capacity"
        },
        {
          action: "Click 'Capacity allocation'",
          details: "Note how capacity is distributed across environments"
        },
        {
          action: "Go to Billing → Licenses",
          details: "Document all Power Platform related licenses"
        },
        {
          action: "Run usage analysis",
          code: `# Get capacity details
Get-AdminPowerAppEnvironment | ForEach-Object {
    $env = $_
    Write-Host "Environment: $($env.DisplayName)"
    # Get capacity metrics
    Get-AdminPowerAppEnvironmentCapacity -EnvironmentName $env.EnvironmentName
}`
        },
        {
          action: "Check license assignments",
          details: "Microsoft 365 Admin Center → Billing → Licenses"
        }
      ]
    }
  ],
  "user-experience": [
    {
      id: "assess-app-quality",
      title: "Evaluate App Quality and Standards",
      steps: [
        {
          action: "Navigate to Power Apps maker portal",
          details: "https://make.powerapps.com"
        },
        {
          action: "Go to Apps and sort by 'Modified on'",
          details: "Identify most used/recent apps"
        },
        {
          action: "For top 5-10 apps, run App Checker",
          details: "Open app → Settings → App Checker → Run"
        },
        {
          action: "Document App Checker results",
          details: "Note: Performance issues, Accessibility warnings, Formula errors"
        },
        {
          action: "Check for UI/UX consistency",
          details: "Look for: Consistent branding, Navigation patterns, Responsive design"
        },
        {
          action: "Run performance analysis",
          code: `# Monitor API calls and performance
Monitor-PowerAppsUsage -AppId [app-id] -StartTime (Get-Date).AddDays(-7)`
        }
      ],
      tips: [
        "Test apps on different devices (mobile, tablet, desktop)",
        "Check loading times for data-heavy screens",
        "Review error handling and user feedback mechanisms"
      ]
    }
  ],
  "adoption-training": [
    {
      id: "measure-adoption-metrics",
      title: "Gather Adoption and Usage Metrics",
      steps: [
        {
          action: "Open Power Platform Admin Center",
          details: "Navigate to Analytics → Power Apps"
        },
        {
          action: "Export usage report for last 30 days",
          details: "Look for: Active users, App launches, Unique makers"
        },
        {
          action: "Go to Analytics → Power Automate",
          details: "Document: Flow runs, Success rate, Active flows"
        },
        {
          action: "Check training resources",
          details: "Document available training materials, wikis, videos"
        },
        {
          action: "Survey key users",
          details: "Ask about: Training needs, Support quality, Feature requests"
        },
        {
          action: "Generate adoption report",
          code: `# Get app usage statistics
Get-AdminPowerApp | ForEach-Object {
    $app = $_
    Get-AdminPowerAppUsage -AppName $app.AppName -StartDate (Get-Date).AddDays(-30)
} | Export-Csv "app-usage-report.csv"`
        }
      ]
    }
  ],
  "security-compliance": [
    {
      id: "security-assessment",
      title: "Perform Security Assessment",
      steps: [
        {
          action: "Check Azure AD Conditional Access",
          details: "Azure Portal → Azure AD → Security → Conditional Access"
        },
        {
          action: "Review policies affecting Power Platform",
          details: "Look for policies targeting Power Apps/Automate"
        },
        {
          action: "Audit privileged access",
          details: "Document who has environment admin rights"
        },
        {
          action: "Check data encryption settings",
          details: "Admin Center → Environments → [Select] → Settings → Encryption"
        },
        {
          action: "Review security alerts",
          details: "Microsoft 365 Security Center → Alerts"
        },
        {
          action: "Run security audit script",
          code: `# Audit environment security settings
Get-AdminPowerAppEnvironment | ForEach-Object {
    $env = $_
    Write-Host "Environment: $($env.DisplayName)"
    # Check security settings
    Get-AdminPowerAppEnvironmentSecuritySettings -EnvironmentName $env.EnvironmentName
    # Check user permissions
    Get-AdminPowerAppEnvironmentRoleAssignment -EnvironmentName $env.EnvironmentName
}`
        }
      ],
      tips: [
        "Document any exemptions from security policies",
        "Check for service accounts with excessive permissions",
        "Verify MFA is enabled for all admin accounts"
      ]
    }
  ],
  "documentation-rulebooks": [
    {
      id: "documentation-inventory",
      title: "Inventory Documentation and Standards",
      steps: [
        {
          action: "Locate documentation repository",
          details: "Check: SharePoint, Teams, Wiki, GitHub"
        },
        {
          action: "List all Power Platform documentation",
          details: "Categories: Architecture, Standards, Procedures, Training"
        },
        {
          action: "Check documentation currency",
          details: "Note last updated dates and version numbers"
        },
        {
          action: "Review naming conventions",
          details: "Document standards for: Apps, Flows, Environments, Solutions"
        },
        {
          action: "Verify runbooks exist for",
          details: "- Incident response\n- New app deployment\n- User onboarding\n- Environment provisioning"
        },
        {
          action: "Export documentation list",
          code: `# If docs are in SharePoint, use PnP PowerShell
Connect-PnPOnline -Url "https://[tenant].sharepoint.com/sites/PowerPlatformCoE"
Get-PnPListItem -List "Documents" | Where-Object {$_.FieldValues.Title -like "*Power*"} | 
    Select-Object Title, Modified, Author | Export-Csv "documentation-inventory.csv"`
        }
      ]
    }
  ],
  // Map old names to new for backward compatibility
  "environment-strategy": [
    {
      id: "environment-structure-review",
      title: "Review Environment Structure and Strategy",
      steps: [
        {
          action: "Open Power Platform Admin Center",
          details: "Navigate to Environments section"
        },
        {
          action: "Document environment tiers",
          details: "Map out: Production, UAT, Development, Sandbox environments"
        },
        {
          action: "Check environment purposes",
          details: "For each environment note:\n- Business purpose\n- Owner/admin\n- Created date\n- Database enabled (Yes/No)\n- Type (Production/Sandbox/Trial)"
        },
        {
          action: "Review environment settings",
          details: "Click each environment → Settings → Features\nDocument which features are enabled/disabled"
        },
        {
          action: "Export environment configuration",
          code: `# Get detailed environment information
Get-AdminPowerAppEnvironment | Select-Object @{
    Name='EnvironmentName'; Expression={$_.DisplayName}
}, @{
    Name='Type'; Expression={$_.EnvironmentType}
}, @{
    Name='Region'; Expression={$_.Location}
}, @{
    Name='Created'; Expression={$_.CreatedTime}
}, @{
    Name='State'; Expression={$_.EnvironmentState}
} | Export-Csv "environment-strategy.csv"`
        },
        {
          action: "Check data residency",
          details: "Note which region each environment is in"
        },
        {
          action: "Review backup settings",
          details: "Settings → Backup and restore → Check backup frequency"
        }
      ],
      tips: [
        "Look for environments that haven't been used in 90+ days",
        "Check if production environments have appropriate security",
        "Verify naming convention compliance"
      ]
    }
  ],
  "center-excellence": [
    {
      id: "coe-starter-kit-assessment",
      title: "Assess Center of Excellence Implementation",
      steps: [
        {
          action: "Check for CoE Starter Kit",
          details: "Look for 'Center of Excellence' solution in environments"
        },
        {
          action: "If CoE exists, review components",
          details: "- Admin apps (DLP Editor, App Catalog)\n- Power BI reports\n- Automation flows (compliance, cleanup)"
        },
        {
          action: "Check CoE database",
          details: "Look for CDS/Dataverse database with CoE tables"
        },
        {
          action: "Review governance processes",
          code: `# Check if CoE flows are running
Get-AdminFlow | Where-Object {$_.DisplayName -like "*CoE*" -or $_.DisplayName -like "*Center of Excellence*"} | 
    Select-Object DisplayName, State, CreatedTime | Format-Table`
        },
        {
          action: "Document CoE team structure",
          details: "Identify:\n- CoE lead\n- Technical admins\n- Business champions\n- Training team"
        },
        {
          action: "Review adoption dashboard",
          details: "If Power BI reports exist, check:\n- App inventory\n- Maker activity\n- Compliance status"
        },
        {
          action: "Check training programs",
          details: "Document:\n- Maker training schedule\n- Certification programs\n- Office hours/support"
        }
      ],
      tips: [
        "If no CoE exists, document this as a critical gap",
        "Look for informal governance processes that could be formalized",
        "Check if there's executive sponsorship for CoE"
      ]
    }
  ],
  "data-management": [
    {
      id: "data-architecture-review",
      title: "Review Data Architecture and Management",
      steps: [
        {
          action: "Navigate to each environment",
          details: "Power Apps → Data → Tables"
        },
        {
          action: "Document data sources",
          details: "List all:\n- Dataverse tables\n- SharePoint lists\n- SQL connections\n- Other connectors"
        },
        {
          action: "Check data retention policies",
          details: "Settings → Data management → Data retention"
        },
        {
          action: "Review data loss prevention",
          details: "Verify DLP policies cover data connectors appropriately"
        },
        {
          action: "Audit data connections",
          code: `# Get all connections across environments
Get-AdminPowerAppEnvironment | ForEach-Object {
    $env = $_
    Write-Host "Environment: $($env.DisplayName)"
    Get-AdminPowerAppConnection -EnvironmentName $env.EnvironmentName | 
        Select-Object DisplayName, ConnectorName, CreatedBy | Format-Table
}`
        },
        {
          action: "Check data gateway configuration",
          details: "Power Platform Admin Center → Data → Data gateways"
        },
        {
          action: "Review data security",
          details: "For Dataverse: Check security roles and field-level security"
        }
      ]
    }
  ],
  "solution-architecture": [
    {
      id: "architecture-assessment",
      title: "Assess Solution Architecture Standards",
      steps: [
        {
          action: "Review solution structure",
          details: "For each major solution document:\n- Components included\n- Dependencies\n- Version history"
        },
        {
          action: "Check architectural patterns",
          details: "Look for:\n- Reusable components\n- Shared libraries\n- Common data models"
        },
        {
          action: "Analyze solution dependencies",
          code: `# Check solution dependencies
pac solution list --environment [environment-url]
pac solution dependency show --solution-name [solution-name]`
        },
        {
          action: "Review integration patterns",
          details: "Document:\n- API usage\n- Custom connectors\n- Webhook implementations"
        },
        {
          action: "Check performance optimization",
          details: "Look for:\n- Delegation in apps\n- Indexed columns\n- Batch processing in flows"
        },
        {
          action: "Document technical debt",
          details: "Identify:\n- Legacy components\n- Deprecated features\n- Areas needing refactoring"
        }
      ]
    }
  ],
  "security-access": [
    {
      id: "security-roles-review",
      title: "Review Security Roles and Access Control",
      steps: [
        {
          action: "Open Power Platform Admin Center",
          details: "Navigate to Environments → Select each environment"
        },
        {
          action: "Click 'Settings' → 'Users + permissions' → 'Security roles'",
          details: "Document all custom and default security roles"
        },
        {
          action: "For each role, click to view permissions",
          details: "Note: Entity permissions, App permissions, Miscellaneous privileges"
        },
        {
          action: "Check Azure AD integration",
          details: "Settings → 'Users + permissions' → 'Application users'"
        },
        {
          action: "Audit privileged users",
          code: `# Get users with System Administrator role
Get-AdminPowerAppEnvironmentRoleAssignment -EnvironmentName [env-id] | 
Where-Object {$_.RoleName -eq "System Administrator"} | 
Select-Object PrincipalDisplayName, PrincipalEmail, RoleName`
        },
        {
          action: "Review Power Pages security",
          details: "For each portal: Settings → Security → Web roles, Table permissions"
        },
        {
          action: "Check conditional access policies",
          details: "Azure AD → Security → Conditional Access → Policies affecting Power Platform"
        }
      ],
      tips: [
        "Look for overly permissive roles",
        "Check for service accounts with admin access",
        "Verify MFA is enforced for privileged users",
        "Document any shared accounts"
      ]
    }
  ],
  "licensing-cost-management": [
    {
      id: "license-inventory",
      title: "Inventory Licenses and Analyze Costs",
      steps: [
        {
          action: "Open Microsoft 365 Admin Center",
          details: "https://admin.microsoft.com → Billing → Licenses"
        },
        {
          action: "Document Power Platform licenses",
          details: "Count: Power Apps per user/per app, Power Automate per user/per flow, Power BI Pro/Premium"
        },
        {
          action: "Check license assignments",
          details: "Users → Active users → Filter by license type"
        },
        {
          action: "Review capacity consumption",
          details: "Power Platform Admin Center → Resources → Capacity"
        },
        {
          action: "Analyze usage vs licenses",
          code: `# Get licensed users vs active users
$licensedUsers = Get-MsolUser -All | Where-Object {$_.Licenses.ServiceStatus -match "PowerApps"}
$activeUsers = Get-AdminPowerAppActiveUser -StartDate (Get-Date).AddDays(-30)
Write-Host "Licensed: $($licensedUsers.Count), Active: $($activeUsers.Count)"`
        },
        {
          action: "Check AI Builder credits",
          details: "Admin Center → Resources → AI Builder credits"
        },
        {
          action: "Review pay-as-you-go setup",
          details: "Admin Center → Billing → Pay-as-you-go"
        }
      ],
      tips: [
        "Look for unused licenses that can be reclaimed",
        "Identify users who need premium features",
        "Check if per-app licenses would be more cost-effective"
      ]
    }
  ],
  "management-coe": [
    {
      id: "coe-maturity-assessment",
      title: "Assess Center of Excellence Maturity",
      steps: [
        {
          action: "Check for CoE Starter Kit installation",
          details: "Look for 'Center of Excellence - Core' solution in environments"
        },
        {
          action: "Review CoE team structure",
          details: "Document: CoE lead, Technical admins, Business champions, Training team"
        },
        {
          action: "Assess CoE processes",
          details: "Check for: App approval process, Environment provisioning, Training programs, Community engagement"
        },
        {
          action: "Review CoE Power BI reports",
          details: "If installed: Check adoption dashboard, Compliance reports, Maker activity"
        },
        {
          action: "Check automation flows",
          code: `# List CoE automation flows
Get-AdminFlow -EnvironmentName [coe-env-id] | 
Where-Object {$_.DisplayName -like "*CoE*"} | 
Select-Object DisplayName, State, LastModifiedTime`
        },
        {
          action: "Document governance maturity",
          details: "Rate: Policies defined, Policies enforced, Policies automated, Continuous improvement"
        },
        {
          action: "Review training materials",
          details: "Check: Wiki/SharePoint, Video library, Office hours schedule, Certification paths"
        }
      ],
      tips: [
        "Compare against Microsoft's CoE maturity model",
        "Look for gaps in automation",
        "Check if CoE metrics align with business goals"
      ]
    }
  ],
  "policy-governance-improvements": [
    {
      id: "governance-gaps-analysis", 
      title: "Identify Governance Improvement Opportunities",
      steps: [
        {
          action: "Review existing policies",
          details: "Document all Power Platform policies: DLP, Environment, Connector, Sharing"
        },
        {
          action: "Check policy enforcement",
          details: "For each policy, verify: How it's enforced, Exceptions process, Compliance monitoring"
        },
        {
          action: "Analyze policy violations",
          code: `# Check for DLP policy violations
Get-AdminPowerAppDlpPolicyViolation -StartDate (Get-Date).AddDays(-30) | 
Group-Object PolicyName | Select-Object Name, Count`
        },
        {
          action: "Review approval processes",
          details: "Check: New app approval, Premium connector requests, Environment creation"
        },
        {
          action: "Assess automation opportunities",
          details: "Identify manual processes that could be automated with Power Automate"
        },
        {
          action: "Document compliance gaps",
          details: "Compare current state against: Industry regulations, Company policies, Microsoft best practices"
        }
      ]
    }
  ],
  "monitoring-analytics": [
    {
      id: "monitoring-setup-review",
      title: "Review Monitoring and Analytics Setup",
      steps: [
        {
          action: "Check Application Insights integration",
          details: "Look for App Insights keys in app settings"
        },
        {
          action: "Review available analytics",
          details: "Power Platform Admin Center → Analytics\nDocument what reports are available"
        },
        {
          action: "Check alert configuration",
          details: "Look for:\n- Email alerts\n- Teams notifications\n- Automated responses"
        },
        {
          action: "Export usage metrics",
          code: `# Get app performance metrics
Get-AdminPowerApp | ForEach-Object {
    $app = $_
    Write-Host "App: $($app.DisplayName)"
    # Get performance data
    Get-AdminPowerAppPerformance -AppName $app.AppName -Period 30
} | Export-Csv "app-performance.csv"`
        },
        {
          action: "Review error tracking",
          details: "Check:\n- Error logs location\n- Error notification process\n- Resolution tracking"
        },
        {
          action: "Document KPIs being tracked",
          details: "List all metrics being monitored and their targets"
        }
      ]
    }
  ],
  // Additional assessment areas from constants that were missing
  "tenant-admin-model": [
    {
      id: "admin-model-review",
      title: "Review Tenant Administration Model",
      steps: [
        {
          action: "Open Microsoft 365 Admin Center",
          details: "https://admin.microsoft.com"
        },
        {
          action: "Navigate to Settings → Org settings → Power Platform",
          details: "Review all tenant-level Power Platform settings"
        },
        {
          action: "Check admin hierarchy",
          details: "Document: Global admins, Power Platform admins, Environment admins"
        },
        {
          action: "Review delegation model",
          details: "Check if environment admin roles are properly delegated"
        },
        {
          action: "Audit admin activities",
          code: `# Get recent admin activities
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-30) -EndDate (Get-Date) -UserIds [admin-email] -RecordType PowerPlatformAdministration`
        },
        {
          action: "Document admin procedures",
          details: "Check for: Admin onboarding process, Change management procedures, Emergency access procedures"
        }
      ]
    }
  ],
  "innovation-automation": [
    {
      id: "innovation-assessment",
      title: "Assess Innovation and Automation Capabilities",
      steps: [
        {
          action: "Review AI Builder usage",
          details: "Power Platform Admin Center → Resources → AI Builder"
        },
        {
          action: "Check automation patterns",
          details: "Look for: RPA usage, Process mining, Automated workflows"
        },
        {
          action: "Document innovation initiatives",
          details: "List: Pilot projects, POCs, Innovation labs"
        },
        {
          action: "Review custom connectors",
          details: "Check for custom APIs and integrations built by the organization"
        },
        {
          action: "Assess automation maturity",
          code: `# Get automation statistics
Get-AdminFlow | Where-Object {$_.State -eq "Started"} | 
Group-Object CreatedBy | Select-Object Name, Count | Sort-Object Count -Descending`
        }
      ]
    }
  ]
}

export function DeveloperQuickGuide({ area }: QuickGuideProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const instructions = areaInstructions[area] || []

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  if (instructions.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Quick guide not yet available for this assessment area.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Developer Quick Start Guide
        </CardTitle>
        <CardDescription>
          Step-by-step instructions to gather the information needed for this assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {instructions.map((instruction) => {
          const isExpanded = expandedSections.has(instruction.id)
          const stepsCompleted = instruction.steps.filter((_, idx) => 
            completedSteps.has(`${instruction.id}-${idx}`)
          ).length

          return (
            <Collapsible
              key={instruction.id}
              open={isExpanded}
              onOpenChange={() => toggleSection(instruction.id)}
            >
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    {instruction.title}
                  </span>
                  <Badge variant="secondary" className={stepsCompleted === instruction.steps.length ? "bg-green-100 text-green-800" : ""}>
                    {stepsCompleted}/{instruction.steps.length} steps
                  </Badge>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="space-y-3 pl-6">
                  {instruction.steps.map((step, stepIndex) => {
                    const stepId = `${instruction.id}-${stepIndex}`
                    const isCompleted = completedSteps.has(stepId)

                    return (
                      <div
                        key={stepIndex}
                        className={`space-y-2 p-3 rounded-lg border ${
                          isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleStepComplete(stepId)}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2" />
                            )}
                          </Button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <MousePointer className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">Step {stepIndex + 1}: {step.action}</span>
                            </div>
                            
                            {step.details && (
                              <div className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                                {step.details.includes('http') ? (
                                  <a
                                    href={step.details}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
                                  >
                                    {step.details}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ) : (
                                  step.details
                                )}
                              </div>
                            )}

                            {step.code && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">PowerShell / CLI Command:</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(step.code!, stepId)}
                                  >
                                    {copiedCode === stepId ? (
                                      <span className="text-xs text-green-600">Copied!</span>
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                                <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
                                  <code>{step.code}</code>
                                </pre>
                              </div>
                            )}

                            {step.output && (
                              <div className="mt-2">
                                <span className="text-xs text-muted-foreground">Expected Output:</span>
                                <pre className="bg-muted p-2 rounded text-xs mt-1">
                                  {step.output}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {instruction.tips && instruction.tips.length > 0 && (
                    <Alert className="mt-4">
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Pro Tips:</strong>
                        <ul className="mt-2 space-y-1">
                          {instruction.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm">• {tip}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Need more help?</strong> Check the official{" "}
            <a
              href="https://learn.microsoft.com/en-us/power-platform/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Power Platform Admin documentation
            </a>{" "}
            for detailed guidance.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
} 