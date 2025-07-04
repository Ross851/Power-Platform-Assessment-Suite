/**
 * Power Platform Licensing Management System
 * Tracks and monitors license usage across Microsoft and third-party tools
 * Provides compliance audit trails and usage analytics
 */

export interface License {
  id: string
  name: string
  type: 'power_platform' | 'azure' | 'third_party'
  provider: string
  sku: string
  totalAllocated: number
  totalUsed: number
  costPerLicense: number
  currency: string
  renewalDate: Date
  region: string
  complianceStatus: 'compliant' | 'warning' | 'violation'
  lastAuditDate: Date
  environment?: 'tenant' | 'dev' | 'test' | 'prod'
}

export interface LicenseUsage {
  licenseId: string
  userId: string
  userEmail: string
  assignedDate: Date
  lastActiveDate: Date
  usageHours: number
  features: string[]
  environment: string
  costCenter?: string
}

export interface ComplianceAudit {
  id: string
  licenseId: string
  auditDate: Date
  auditor: string
  complianceStatus: 'pass' | 'fail' | 'warning'
  violations: string[]
  remediation: string[]
  nextAuditDate: Date
}

export class LicensingManager {
  private licenses: Map<string, License> = new Map()
  private usage: Map<string, LicenseUsage[]> = new Map()
  private auditTrail: ComplianceAudit[] = []

  constructor() {
    // Initialize with default Power Platform licenses
    this.initializeDefaultLicenses()
  }

  /**
   * Initialize default Microsoft Power Platform licenses
   * Governance: Define standard SKUs for enterprise use
   */
  private initializeDefaultLicenses(): void {
    const defaultLicenses: License[] = [
      {
        id: 'pp-per-user',
        name: 'Power Platform Per User Plan',
        type: 'power_platform',
        provider: 'Microsoft',
        sku: 'POWER_PLATFORM_P2',
        totalAllocated: 100,
        totalUsed: 65,
        costPerLicense: 20,
        currency: 'USD',
        renewalDate: new Date('2024-12-31'),
        region: 'global',
        complianceStatus: 'compliant',
        lastAuditDate: new Date(),
        environment: 'tenant'
      },
      {
        id: 'pp-per-app',
        name: 'Power Platform Per App Plan',
        type: 'power_platform',
        provider: 'Microsoft',
        sku: 'POWER_PLATFORM_PER_APP',
        totalAllocated: 50,
        totalUsed: 32,
        costPerLicense: 5,
        currency: 'USD',
        renewalDate: new Date('2024-12-31'),
        region: 'global',
        complianceStatus: 'warning',
        lastAuditDate: new Date(),
        environment: 'prod'
      },
      {
        id: 'azure-premium',
        name: 'Azure Premium P2',
        type: 'azure',
        provider: 'Microsoft',
        sku: 'AAD_PREMIUM_P2',
        totalAllocated: 200,
        totalUsed: 145,
        costPerLicense: 9,
        currency: 'USD',
        renewalDate: new Date('2024-11-30'),
        region: 'global',
        complianceStatus: 'compliant',
        lastAuditDate: new Date(),
        environment: 'tenant'
      },
      {
        id: 'dataverse-storage',
        name: 'Dataverse Database Storage',
        type: 'power_platform',
        provider: 'Microsoft',
        sku: 'DATAVERSE_DB_STORAGE',
        totalAllocated: 1000, // GB
        totalUsed: 750,
        costPerLicense: 2.40, // per GB
        currency: 'USD',
        renewalDate: new Date('2024-12-31'),
        region: 'global',
        complianceStatus: 'warning',
        lastAuditDate: new Date(),
        environment: 'tenant'
      }
    ]

    defaultLicenses.forEach(license => {
      this.licenses.set(license.id, license)
    })
  }

  /**
   * Get all licenses with filtering options
   * Governance: Support tenant vs environment level filtering
   */
  getLicenses(filter?: {
    type?: License['type']
    environment?: License['environment']
    region?: string
    complianceStatus?: License['complianceStatus']
  }): License[] {
    let licenses = Array.from(this.licenses.values())

    if (filter) {
      if (filter.type) {
        licenses = licenses.filter(l => l.type === filter.type)
      }
      if (filter.environment) {
        licenses = licenses.filter(l => l.environment === filter.environment)
      }
      if (filter.region) {
        licenses = licenses.filter(l => l.region === filter.region)
      }
      if (filter.complianceStatus) {
        licenses = licenses.filter(l => l.complianceStatus === filter.complianceStatus)
      }
    }

    return licenses
  }

  /**
   * Calculate license utilization percentage
   * Critical governance metric for cost optimization
   */
  getLicenseUtilization(licenseId: string): number {
    const license = this.licenses.get(licenseId)
    if (!license) return 0
    
    return Math.round((license.totalUsed / license.totalAllocated) * 100)
  }

  /**
   * Get licenses approaching renewal (next 90 days)
   * Governance: Proactive license management
   */
  getLicensesApproachingRenewal(): License[] {
    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

    return Array.from(this.licenses.values()).filter(
      license => license.renewalDate <= ninetyDaysFromNow
    )
  }

  /**
   * Get compliance violations
   * Governance: Track and remediate license compliance issues
   */
  getComplianceViolations(): License[] {
    return Array.from(this.licenses.values()).filter(
      license => license.complianceStatus === 'violation'
    )
  }

  /**
   * Calculate total licensing costs by region/environment
   * Governance: Cost allocation and budgeting
   */
  calculateCosts(groupBy: 'region' | 'environment' | 'type'): Record<string, number> {
    const costs: Record<string, number> = {}

    Array.from(this.licenses.values()).forEach(license => {
      const key = license[groupBy] || 'unknown'
      const totalCost = license.totalUsed * license.costPerLicense
      
      costs[key] = (costs[key] || 0) + totalCost
    })

    return costs
  }

  /**
   * Add new license to tracking
   * Governance: Standardized license onboarding
   */
  addLicense(license: Omit<License, 'id'>): string {
    const id = `license-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newLicense: License = {
      ...license,
      id,
      lastAuditDate: new Date()
    }
    
    this.licenses.set(id, newLicense)
    
    // Governance audit log
    console.log(`[Governance] New license added: ${license.name} (${id}) at ${new Date().toISOString()}`)
    
    return id
  }

  /**
   * Update license usage
   * Governance: Real-time usage tracking
   */
  updateLicenseUsage(licenseId: string, newUsedCount: number): boolean {
    const license = this.licenses.get(licenseId)
    if (!license) return false

    const oldUsage = license.totalUsed
    license.totalUsed = newUsedCount

    // Check for over-allocation
    if (newUsedCount > license.totalAllocated) {
      license.complianceStatus = 'violation'
      console.warn(`[Governance] License over-allocation detected: ${license.name} (${newUsedCount}/${license.totalAllocated})`)
    } else if (newUsedCount / license.totalAllocated > 0.9) {
      license.complianceStatus = 'warning'
    } else {
      license.complianceStatus = 'compliant'
    }

    // Governance audit log
    console.log(`[Governance] License usage updated: ${license.name} ${oldUsage} → ${newUsedCount}`)
    
    this.licenses.set(licenseId, license)
    return true
  }

  /**
   * Perform compliance audit
   * Governance: Regular compliance verification
   */
  performComplianceAudit(licenseId: string, auditor: string): ComplianceAudit {
    const license = this.licenses.get(licenseId)
    if (!license) {
      throw new Error(`License ${licenseId} not found`)
    }

    const violations: string[] = []
    const remediation: string[] = []

    // Check over-allocation
    if (license.totalUsed > license.totalAllocated) {
      violations.push(`Over-allocated: ${license.totalUsed}/${license.totalAllocated} licenses used`)
      remediation.push('Purchase additional licenses or reassign unused licenses')
    }

    // Check renewal timeline
    const daysToRenewal = Math.ceil((license.renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysToRenewal < 30) {
      violations.push(`License expires in ${daysToRenewal} days`)
      remediation.push('Initiate renewal process immediately')
    }

    // Check audit frequency (should be monthly)
    const daysSinceLastAudit = Math.ceil((Date.now() - license.lastAuditDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceLastAudit > 30) {
      violations.push(`No audit performed in ${daysSinceLastAudit} days`)
      remediation.push('Schedule regular monthly audits')
    }

    const audit: ComplianceAudit = {
      id: `audit-${Date.now()}`,
      licenseId,
      auditDate: new Date(),
      auditor,
      complianceStatus: violations.length === 0 ? 'pass' : violations.length <= 2 ? 'warning' : 'fail',
      violations,
      remediation,
      nextAuditDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }

    this.auditTrail.push(audit)
    license.lastAuditDate = new Date()
    license.complianceStatus = audit.complianceStatus === 'pass' ? 'compliant' : 
                             audit.complianceStatus === 'warning' ? 'warning' : 'violation'

    // Governance audit log
    console.log(`[Governance] Compliance audit completed: ${license.name} - ${audit.complianceStatus}`)

    return audit
  }

  /**
   * Get audit history for a license
   * Governance: Audit trail for compliance reporting
   */
  getAuditHistory(licenseId?: string): ComplianceAudit[] {
    if (licenseId) {
      return this.auditTrail.filter(audit => audit.licenseId === licenseId)
    }
    return this.auditTrail
  }

  /**
   * Generate governance dashboard metrics
   * Governance: Executive reporting and KPIs
   */
  getDashboardMetrics(): {
    totalLicenses: number
    totalCost: number
    averageUtilization: number
    complianceScore: number
    renewalsNext90Days: number
    violations: number
    costByType: Record<string, number>
  } {
    const licenses = Array.from(this.licenses.values())
    
    const totalCost = licenses.reduce((sum, license) => 
      sum + (license.totalUsed * license.costPerLicense), 0)
    
    const totalUtilization = licenses.reduce((sum, license) => 
      sum + this.getLicenseUtilization(license.id), 0)
    
    const averageUtilization = licenses.length > 0 ? totalUtilization / licenses.length : 0
    
    const compliantLicenses = licenses.filter(l => l.complianceStatus === 'compliant').length
    const complianceScore = licenses.length > 0 ? (compliantLicenses / licenses.length) * 100 : 100
    
    return {
      totalLicenses: licenses.length,
      totalCost: Math.round(totalCost * 100) / 100,
      averageUtilization: Math.round(averageUtilization),
      complianceScore: Math.round(complianceScore),
      renewalsNext90Days: this.getLicensesApproachingRenewal().length,
      violations: this.getComplianceViolations().length,
      costByType: this.calculateCosts('type')
    }
  }
}

// Singleton instance for global access
export const licensingManager = new LicensingManager()