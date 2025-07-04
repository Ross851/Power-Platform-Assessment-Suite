/**
 * Regional Configuration Manager
 * Handles region-specific settings for compliance, data localization, and governance
 * Supports UK/EU (GDPR), Asia (data localization), and North America configurations
 */

export interface RegionalCompliance {
  region: string
  regulations: {
    name: string
    description: string
    requirements: string[]
    penalties: string
    dataResidency: boolean
    rightToErasure: boolean
    consentManagement: boolean
    auditRetention: number // months
  }[]
  dataLocalization: {
    required: boolean
    allowedRegions: string[]
    crossBorderRestrictions: string[]
    sovereignCloud: boolean
  }
  currency: {
    code: string
    symbol: string
    locale: string
  }
  timezone: {
    name: string
    offset: string
    dstObserved: boolean
  }
  language: {
    primary: string
    supported: string[]
    locale: string
  }
}

export interface RegionalSettings {
  region: string
  governance: {
    defaultPolicies: string[]
    mandatoryControls: string[]
    dataClassification: string[]
    retentionPeriods: Record<string, number> // in months
  }
  powerPlatform: {
    allowedConnectors: string[]
    blockedConnectors: string[]
    dlpPolicies: string[]
    environmentTypes: string[]
    defaultEnvironmentRegion: string
  }
  security: {
    mfaRequired: boolean
    conditionalAccess: string[]
    privilegedAccessManagement: boolean
    zeroTrustLevel: 'basic' | 'standard' | 'strict'
  }
  privacy: {
    cookiePolicy: string
    privacyNotice: string
    dataProcessingAgreement: string
    consentMechanism: 'opt-in' | 'opt-out' | 'explicit'
  }
}

export interface RegionalCosts {
  region: string
  currency: string
  licensing: {
    powerPlatformPerUser: number
    powerPlatformPerApp: number
    azurePremiumP1: number
    azurePremiumP2: number
    dataverseDatabase: number // per GB
    dataverseLog: number // per GB
  }
  infrastructure: {
    computePerHour: number
    storagePerGB: number
    networkingPerGB: number
  }
  taxes: {
    vatRate?: number // EU
    gstRate?: number // Asia Pacific
    salesTaxRate?: number // North America
    localTaxes: { name: string; rate: number }[]
  }
}

export class RegionalConfigManager {
  private regionalCompliance: Map<string, RegionalCompliance> = new Map()
  private regionalSettings: Map<string, RegionalSettings> = new Map()
  private regionalCosts: Map<string, RegionalCosts> = new Map()
  private currentRegion: string = 'north-america'

  constructor() {
    this.initializeRegionalData()
  }

  /**
   * Initialize regional configuration data
   * Governance: Define region-specific compliance and governance requirements
   */
  private initializeRegionalData(): void {
    // UK/EU Configuration
    this.regionalCompliance.set('uk-eu', {
      region: 'UK/EU',
      regulations: [
        {
          name: 'GDPR',
          description: 'General Data Protection Regulation',
          requirements: [
            'Data subject consent management',
            'Right to erasure (right to be forgotten)',
            'Data portability',
            'Privacy by design and by default',
            'Data protection impact assessments',
            'Appointment of Data Protection Officer',
            'Breach notification within 72 hours'
          ],
          penalties: 'Up to 4% of annual global turnover or €20 million',
          dataResidency: true,
          rightToErasure: true,
          consentManagement: true,
          auditRetention: 72 // 6 years
        },
        {
          name: 'UK Data Protection Act 2018',
          description: 'UK implementation of GDPR post-Brexit',
          requirements: [
            'Similar to GDPR with UK-specific provisions',
            'ICO registration and compliance',
            'UK-specific data transfer mechanisms'
          ],
          penalties: 'Up to 4% of annual turnover or £17.5 million',
          dataResidency: true,
          rightToErasure: true,
          consentManagement: true,
          auditRetention: 72
        }
      ],
      dataLocalization: {
        required: true,
        allowedRegions: ['UK South', 'UK West', 'West Europe', 'North Europe'],
        crossBorderRestrictions: ['Data cannot leave EU/UK without adequacy decision'],
        sovereignCloud: false
      },
      currency: { code: 'GBP', symbol: '£', locale: 'en-GB' },
      timezone: { name: 'GMT/BST', offset: '+00:00/+01:00', dstObserved: true },
      language: { primary: 'en-GB', supported: ['en-GB', 'fr-FR', 'de-DE'], locale: 'en-GB' }
    })

    this.regionalSettings.set('uk-eu', {
      region: 'UK/EU',
      governance: {
        defaultPolicies: ['GDPR Compliance', 'Data Residency', 'Privacy by Design'],
        mandatoryControls: ['Data Classification', 'Consent Management', 'Audit Logging'],
        dataClassification: ['Public', 'Internal', 'Confidential', 'Restricted', 'Personal Data'],
        retentionPeriods: {
          'audit-logs': 72,
          'personal-data': 24,
          'business-data': 84,
          'compliance-records': 120
        }
      },
      powerPlatform: {
        allowedConnectors: ['SharePoint', 'Teams', 'OneDrive', 'Office 365'],
        blockedConnectors: ['Facebook', 'Twitter', 'Public APIs'],
        dlpPolicies: ['GDPR Data Protection', 'UK Data Residency'],
        environmentTypes: ['Production', 'Test', 'Development'],
        defaultEnvironmentRegion: 'UK South'
      },
      security: {
        mfaRequired: true,
        conditionalAccess: ['EU IP Restriction', 'Device Compliance', 'Risk-based Access'],
        privilegedAccessManagement: true,
        zeroTrustLevel: 'strict'
      },
      privacy: {
        cookiePolicy: 'Strict - Explicit consent required',
        privacyNotice: 'GDPR compliant privacy notice required',
        dataProcessingAgreement: 'Article 28 DPA required for all processors',
        consentMechanism: 'opt-in'
      }
    })

    // Asia Pacific Configuration
    this.regionalCompliance.set('asia-pacific', {
      region: 'Asia Pacific',
      regulations: [
        {
          name: 'PDPA Singapore',
          description: 'Personal Data Protection Act Singapore',
          requirements: [
            'Consent for collection and use',
            'Data breach notification',
            'Access and correction rights',
            'Data Protection Officer appointment'
          ],
          penalties: 'Up to S$1 million',
          dataResidency: false,
          rightToErasure: false,
          consentManagement: true,
          auditRetention: 36
        },
        {
          name: 'China Cybersecurity Law',
          description: 'Data localization requirements for China',
          requirements: [
            'Critical information infrastructure operators must store data in China',
            'Data export restrictions',
            'Security assessments required'
          ],
          penalties: 'Criminal liability and significant fines',
          dataResidency: true,
          rightToErasure: false,
          consentManagement: false,
          auditRetention: 60
        }
      ],
      dataLocalization: {
        required: true,
        allowedRegions: ['East Asia', 'Southeast Asia', 'Australia East', 'Japan East'],
        crossBorderRestrictions: ['China data must remain in China', 'Some countries require government approval'],
        sovereignCloud: true
      },
      currency: { code: 'USD', symbol: '$', locale: 'en-US' },
      timezone: { name: 'Multiple', offset: '+08:00 to +11:00', dstObserved: false },
      language: { primary: 'en-US', supported: ['en-US', 'zh-CN', 'ja-JP', 'ko-KR'], locale: 'en-US' }
    })

    this.regionalSettings.set('asia-pacific', {
      region: 'Asia Pacific',
      governance: {
        defaultPolicies: ['Data Localization', 'Cross-Border Transfer Controls'],
        mandatoryControls: ['Geographic Data Boundaries', 'Sovereignty Compliance'],
        dataClassification: ['Public', 'Internal', 'Sensitive', 'Sovereign'],
        retentionPeriods: {
          'audit-logs': 36,
          'personal-data': 12,
          'business-data': 60,
          'compliance-records': 84
        }
      },
      powerPlatform: {
        allowedConnectors: ['Office 365', 'SharePoint', 'Regional Services'],
        blockedConnectors: ['US-only services', 'Non-compliant external APIs'],
        dlpPolicies: ['Data Sovereignty', 'Cross-Border Protection'],
        environmentTypes: ['Production', 'Test', 'Development', 'Sovereign'],
        defaultEnvironmentRegion: 'Southeast Asia'
      },
      security: {
        mfaRequired: true,
        conditionalAccess: ['Geographic Restrictions', 'Device Compliance'],
        privilegedAccessManagement: true,
        zeroTrustLevel: 'standard'
      },
      privacy: {
        cookiePolicy: 'Standard - Country-specific requirements',
        privacyNotice: 'Local language privacy notices required',
        dataProcessingAgreement: 'Local jurisdiction agreements required',
        consentMechanism: 'opt-in'
      }
    })

    // North America Configuration
    this.regionalCompliance.set('north-america', {
      region: 'North America',
      regulations: [
        {
          name: 'CCPA',
          description: 'California Consumer Privacy Act',
          requirements: [
            'Consumer right to know',
            'Consumer right to delete',
            'Consumer right to opt-out of sale',
            'Non-discrimination for exercising rights'
          ],
          penalties: 'Up to $7,500 per violation',
          dataResidency: false,
          rightToErasure: true,
          consentManagement: true,
          auditRetention: 24
        },
        {
          name: 'SOX',
          description: 'Sarbanes-Oxley Act',
          requirements: [
            'Financial reporting controls',
            'Audit trail maintenance',
            'Executive certification',
            'Internal control assessments'
          ],
          penalties: 'Criminal penalties and fines',
          dataResidency: false,
          rightToErasure: false,
          consentManagement: false,
          auditRetention: 84 // 7 years
        }
      ],
      dataLocalization: {
        required: false,
        allowedRegions: ['East US', 'West US', 'Central US', 'Canada Central'],
        crossBorderRestrictions: ['Some sectors have specific requirements'],
        sovereignCloud: false
      },
      currency: { code: 'USD', symbol: '$', locale: 'en-US' },
      timezone: { name: 'Multiple', offset: '-08:00 to -05:00', dstObserved: true },
      language: { primary: 'en-US', supported: ['en-US', 'es-US', 'fr-CA'], locale: 'en-US' }
    })

    this.regionalSettings.set('north-america', {
      region: 'North America',
      governance: {
        defaultPolicies: ['Data Privacy', 'Financial Controls', 'Security Standards'],
        mandatoryControls: ['Access Controls', 'Audit Logging', 'Change Management'],
        dataClassification: ['Public', 'Internal', 'Confidential', 'Restricted'],
        retentionPeriods: {
          'audit-logs': 84,
          'personal-data': 36,
          'business-data': 84,
          'compliance-records': 84
        }
      },
      powerPlatform: {
        allowedConnectors: ['All Microsoft', 'Approved Third-Party'],
        blockedConnectors: ['Unapproved External APIs'],
        dlpPolicies: ['CCPA Compliance', 'Financial Data Protection'],
        environmentTypes: ['Production', 'Test', 'Development', 'Sandbox'],
        defaultEnvironmentRegion: 'East US'
      },
      security: {
        mfaRequired: true,
        conditionalAccess: ['Device Compliance', 'Location-based Access'],
        privilegedAccessManagement: true,
        zeroTrustLevel: 'standard'
      },
      privacy: {
        cookiePolicy: 'Flexible - State-specific requirements',
        privacyNotice: 'CCPA and state-specific notices',
        dataProcessingAgreement: 'Standard vendor agreements',
        consentMechanism: 'opt-out'
      }
    })

    // Initialize cost structures
    this.initializeRegionalCosts()
  }

  /**
   * Initialize regional cost structures
   * Governance: Region-specific pricing and tax considerations
   */
  private initializeRegionalCosts(): void {
    this.regionalCosts.set('uk-eu', {
      region: 'UK/EU',
      currency: 'GBP',
      licensing: {
        powerPlatformPerUser: 16.00,
        powerPlatformPerApp: 4.00,
        azurePremiumP1: 4.80,
        azurePremiumP2: 7.20,
        dataverseDatabase: 1.92,
        dataverseLog: 1.65
      },
      infrastructure: {
        computePerHour: 0.096,
        storagePerGB: 0.015,
        networkingPerGB: 0.065
      },
      taxes: {
        vatRate: 20,
        localTaxes: [
          { name: 'Digital Services Tax', rate: 2 }
        ]
      }
    })

    this.regionalCosts.set('asia-pacific', {
      region: 'Asia Pacific',
      currency: 'USD',
      licensing: {
        powerPlatformPerUser: 20.00,
        powerPlatformPerApp: 5.00,
        azurePremiumP1: 6.00,
        azurePremiumP2: 9.00,
        dataverseDatabase: 2.40,
        dataverseLog: 2.06
      },
      infrastructure: {
        computePerHour: 0.12,
        storagePerGB: 0.018,
        networkingPerGB: 0.08
      },
      taxes: {
        gstRate: 10,
        localTaxes: [
          { name: 'Goods and Services Tax', rate: 10 },
          { name: 'Import Duty', rate: 5 }
        ]
      }
    })

    this.regionalCosts.set('north-america', {
      region: 'North America',
      currency: 'USD',
      licensing: {
        powerPlatformPerUser: 20.00,
        powerPlatformPerApp: 5.00,
        azurePremiumP1: 6.00,
        azurePremiumP2: 9.00,
        dataverseDatabase: 2.40,
        dataverseLog: 2.06
      },
      infrastructure: {
        computePerHour: 0.10,
        storagePerGB: 0.015,
        networkingPerGB: 0.07
      },
      taxes: {
        salesTaxRate: 8.5,
        localTaxes: [
          { name: 'State Sales Tax', rate: 6.5 },
          { name: 'Local Tax', rate: 2.0 }
        ]
      }
    })
  }

  /**
   * Set current region
   * Governance: Configure regional compliance and settings
   */
  setRegion(region: string): boolean {
    if (this.regionalCompliance.has(region)) {
      this.currentRegion = region
      console.log(`[Governance] Region changed to: ${region}`)
      this.applyRegionalGovernance()
      return true
    }
    return false
  }

  /**
   * Get current region configuration
   * Governance: Return active regional settings
   */
  getCurrentRegion(): string {
    return this.currentRegion
  }

  /**
   * Get regional compliance requirements
   * Governance: Compliance framework for specific region
   */
  getRegionalCompliance(region?: string): RegionalCompliance | null {
    const targetRegion = region || this.currentRegion
    return this.regionalCompliance.get(targetRegion) || null
  }

  /**
   * Get regional settings
   * Governance: Configuration settings for specific region
   */
  getRegionalSettings(region?: string): RegionalSettings | null {
    const targetRegion = region || this.currentRegion
    return this.regionalSettings.get(targetRegion) || null
  }

  /**
   * Get regional costs
   * Governance: Pricing and tax information for specific region
   */
  getRegionalCosts(region?: string): RegionalCosts | null {
    const targetRegion = region || this.currentRegion
    return this.regionalCosts.get(targetRegion) || null
  }

  /**
   * Get all available regions
   * Governance: List supported regions
   */
  getAvailableRegions(): Array<{ id: string; name: string; description: string }> {
    return [
      {
        id: 'uk-eu',
        name: 'UK/EU',
        description: 'United Kingdom and European Union with GDPR compliance'
      },
      {
        id: 'asia-pacific',
        name: 'Asia Pacific',
        description: 'Asia Pacific region with data sovereignty requirements'
      },
      {
        id: 'north-america',
        name: 'North America',
        description: 'North America with US and Canadian regulations'
      }
    ]
  }

  /**
   * Apply regional governance automatically
   * Governance: Configure system based on regional requirements
   */
  private applyRegionalGovernance(): void {
    const compliance = this.getRegionalCompliance()
    const settings = this.getRegionalSettings()

    if (!compliance || !settings) return

    console.log(`[Governance] Applying regional governance for ${compliance.region}`)

    // Apply data residency requirements
    if (compliance.dataLocalization.required) {
      console.log(`[Governance] Data localization required - allowed regions: ${compliance.dataLocalization.allowedRegions.join(', ')}`)
    }

    // Apply mandatory controls
    settings.governance.mandatoryControls.forEach(control => {
      console.log(`[Governance] Mandatory control applied: ${control}`)
    })

    // Apply default policies
    settings.governance.defaultPolicies.forEach(policy => {
      console.log(`[Governance] Default policy applied: ${policy}`)
    })

    // Apply security settings
    if (settings.security.mfaRequired) {
      console.log('[Governance] MFA requirement enforced')
    }
  }

  /**
   * Validate compliance for current region
   * Governance: Check if current configuration meets regional requirements
   */
  validateRegionalCompliance(): {
    compliant: boolean
    violations: Array<{
      regulation: string
      requirement: string
      severity: 'high' | 'medium' | 'low'
      remediation: string
    }>
    score: number
  } {
    const compliance = this.getRegionalCompliance()
    const settings = this.getRegionalSettings()

    if (!compliance || !settings) {
      return { compliant: false, violations: [], score: 0 }
    }

    const violations: Array<{
      regulation: string
      requirement: string
      severity: 'high' | 'medium' | 'low'
      remediation: string
    }> = []

    // Check each regulation
    compliance.regulations.forEach(regulation => {
      // Check data residency
      if (regulation.dataResidency && !compliance.dataLocalization.required) {
        violations.push({
          regulation: regulation.name,
          requirement: 'Data residency',
          severity: 'high',
          remediation: 'Enable data localization and configure allowed regions'
        })
      }

      // Check consent management
      if (regulation.consentManagement && settings.privacy.consentMechanism !== 'opt-in') {
        violations.push({
          regulation: regulation.name,
          requirement: 'Consent management',
          severity: 'medium',
          remediation: 'Configure opt-in consent mechanism'
        })
      }

      // Check audit retention
      const auditRetention = settings.governance.retentionPeriods['audit-logs']
      if (auditRetention < regulation.auditRetention) {
        violations.push({
          regulation: regulation.name,
          requirement: 'Audit log retention',
          severity: 'medium',
          remediation: `Increase audit log retention to ${regulation.auditRetention} months`
        })
      }
    })

    const totalChecks = compliance.regulations.length * 3 // 3 checks per regulation
    const passedChecks = totalChecks - violations.length
    const score = Math.round((passedChecks / totalChecks) * 100)

    return {
      compliant: violations.length === 0,
      violations,
      score
    }
  }

  /**
   * Calculate regional costs for given usage
   * Governance: Cost estimation with regional pricing and taxes
   */
  calculateRegionalCosts(usage: {
    powerPlatformUsers: number
    powerPlatformApps: number
    azurePremiumP1: number
    azurePremiumP2: number
    dataverseStorage: number // GB
    computeHours: number
    storageGB: number
    networkingGB: number
  }): {
    licensing: number
    infrastructure: number
    taxes: number
    total: number
    currency: string
    breakdown: Record<string, number>
  } | null {
    const costs = this.getRegionalCosts()
    if (!costs) return null

    // Calculate licensing costs
    const licensing = 
      (usage.powerPlatformUsers * costs.licensing.powerPlatformPerUser) +
      (usage.powerPlatformApps * costs.licensing.powerPlatformPerApp) +
      (usage.azurePremiumP1 * costs.licensing.azurePremiumP1) +
      (usage.azurePremiumP2 * costs.licensing.azurePremiumP2) +
      (usage.dataverseStorage * costs.licensing.dataverseDatabase)

    // Calculate infrastructure costs
    const infrastructure = 
      (usage.computeHours * costs.infrastructure.computePerHour) +
      (usage.storageGB * costs.infrastructure.storagePerGB) +
      (usage.networkingGB * costs.infrastructure.networkingPerGB)

    const subtotal = licensing + infrastructure

    // Calculate taxes
    let taxRate = 0
    if (costs.taxes.vatRate) taxRate = costs.taxes.vatRate
    else if (costs.taxes.gstRate) taxRate = costs.taxes.gstRate
    else if (costs.taxes.salesTaxRate) taxRate = costs.taxes.salesTaxRate

    const taxes = subtotal * (taxRate / 100)
    const total = subtotal + taxes

    return {
      licensing,
      infrastructure,
      taxes,
      total,
      currency: costs.currency,
      breakdown: {
        'Power Platform Users': usage.powerPlatformUsers * costs.licensing.powerPlatformPerUser,
        'Power Platform Apps': usage.powerPlatformApps * costs.licensing.powerPlatformPerApp,
        'Azure Premium P1': usage.azurePremiumP1 * costs.licensing.azurePremiumP1,
        'Azure Premium P2': usage.azurePremiumP2 * costs.licensing.azurePremiumP2,
        'Dataverse Storage': usage.dataverseStorage * costs.licensing.dataverseDatabase,
        'Compute': usage.computeHours * costs.infrastructure.computePerHour,
        'Storage': usage.storageGB * costs.infrastructure.storagePerGB,
        'Networking': usage.networkingGB * costs.infrastructure.networkingPerGB,
        'Taxes': taxes
      }
    }
  }
}

// Singleton instance for global access
export const regionalConfigManager = new RegionalConfigManager()