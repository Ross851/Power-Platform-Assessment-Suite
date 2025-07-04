/**
 * Governance Controls Manager
 * Handles tenant-level vs environment-level governance controls
 * Provides policy inheritance, scope management, and control enforcement
 */

export interface GovernanceControl {
  id: string
  name: string
  description: string
  type: 'policy' | 'security' | 'compliance' | 'cost' | 'data'
  scope: 'tenant' | 'environment' | 'both'
  level: 'tenant' | 'environment'
  status: 'enabled' | 'disabled' | 'inherited'
  priority: 'critical' | 'high' | 'medium' | 'low'
  enforcement: 'strict' | 'warn' | 'audit'
  inheritanceAllowed: boolean
  overrideAllowed: boolean
  requiredAtTenant: boolean
  appliesTo: {
    environmentTypes: ('prod' | 'test' | 'dev' | 'sandbox')[]
    regions: string[]
    userRoles: string[]
  }
  configuration: Record<string, any>
  metadata: {
    createdBy: string
    createdAt: Date
    lastModified: Date
    version: string
    compliance: string[]
  }
}

export interface PolicyInheritance {
  controlId: string
  tenantPolicy: GovernanceControl
  environmentOverrides: Map<string, Partial<GovernanceControl>>
  effectivePolicy: GovernanceControl
  inheritanceChain: string[]
  conflicts: Array<{
    environmentId: string
    conflictType: 'scope' | 'enforcement' | 'configuration'
    description: string
    resolution: 'tenant_wins' | 'environment_wins' | 'merge' | 'error'
  }>
}

export interface EnvironmentContext {
  id: string
  name: string
  type: 'prod' | 'test' | 'dev' | 'sandbox'
  region: string
  parentTenant: string
  complianceLevel: 'strict' | 'standard' | 'relaxed'
  businessCriticality: 'critical' | 'important' | 'standard' | 'low'
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted'
  userCount: number
  appCount: number
  lastAudit: Date
}

export class GovernanceControlsManager {
  private tenantControls: Map<string, GovernanceControl> = new Map()
  private environmentControls: Map<string, Map<string, GovernanceControl>> = new Map()
  private inheritanceRules: Map<string, PolicyInheritance> = new Map()
  private environments: Map<string, EnvironmentContext> = new Map()

  constructor() {
    this.initializeDefaultControls()
    this.initializeEnvironments()
  }

  /**
   * Initialize default governance controls
   * Governance: Define standard tenant and environment-level controls
   */
  private initializeDefaultControls(): void {
    const defaultTenantControls: GovernanceControl[] = [
      {
        id: 'global-security-baseline',
        name: 'Global Security Baseline',
        description: 'Mandatory security controls applied across all environments',
        type: 'security',
        scope: 'tenant',
        level: 'tenant',
        status: 'enabled',
        priority: 'critical',
        enforcement: 'strict',
        inheritanceAllowed: false,
        overrideAllowed: false,
        requiredAtTenant: true,
        appliesTo: {
          environmentTypes: ['prod', 'test', 'dev', 'sandbox'],
          regions: ['*'],
          userRoles: ['*']
        },
        configuration: {
          mfaRequired: true,
          sessionTimeout: 8, // hours
          privilegedAccessReview: 30, // days
          passwordComplexity: 'strong',
          auditLogging: 'all',
          encryptionAtRest: true,
          encryptionInTransit: true
        },
        metadata: {
          createdBy: 'system',
          createdAt: new Date('2024-01-01'),
          lastModified: new Date(),
          version: '1.0',
          compliance: ['SOX', 'GDPR', 'ISO27001']
        }
      },
      {
        id: 'global-cost-controls',
        name: 'Global Cost Management',
        description: 'Organization-wide cost controls and budgets',
        type: 'cost',
        scope: 'tenant',
        level: 'tenant',
        status: 'enabled',
        priority: 'high',
        enforcement: 'warn',
        inheritanceAllowed: true,
        overrideAllowed: true,
        requiredAtTenant: true,
        appliesTo: {
          environmentTypes: ['prod', 'test', 'dev'],
          regions: ['*'],
          userRoles: ['admin', 'finance']
        },
        configuration: {
          monthlyBudgetLimit: 50000,
          alertThresholds: [50, 75, 90, 100],
          autoShutdownEnabled: false,
          approvalRequired: true,
          costCenter: 'IT-001'
        },
        metadata: {
          createdBy: 'finance-admin',
          createdAt: new Date('2024-01-15'),
          lastModified: new Date(),
          version: '1.2',
          compliance: ['Financial Controls']
        }
      },
      {
        id: 'global-data-governance',
        name: 'Global Data Governance',
        description: 'Enterprise data classification and protection policies',
        type: 'data',
        scope: 'tenant',
        level: 'tenant',
        status: 'enabled',
        priority: 'critical',
        enforcement: 'strict',
        inheritanceAllowed: true,
        overrideAllowed: false,
        requiredAtTenant: true,
        appliesTo: {
          environmentTypes: ['prod', 'test'],
          regions: ['*'],
          userRoles: ['*']
        },
        configuration: {
          dataClassificationRequired: true,
          dlpPoliciesEnabled: true,
          dataRetentionPeriods: {
            'personal': 24,
            'financial': 84,
            'audit': 84,
            'operational': 36
          },
          crossBorderTransferRestricted: true,
          encryptionRequired: true,
          backupRequired: true
        },
        metadata: {
          createdBy: 'data-governance-team',
          createdAt: new Date('2024-01-01'),
          lastModified: new Date(),
          version: '2.1',
          compliance: ['GDPR', 'CCPA', 'SOX']
        }
      }
    ]

    const defaultEnvironmentControls: GovernanceControl[] = [
      {
        id: 'env-access-controls',
        name: 'Environment Access Controls',
        description: 'Environment-specific access and permission controls',
        type: 'security',
        scope: 'environment',
        level: 'environment',
        status: 'enabled',
        priority: 'high',
        enforcement: 'strict',
        inheritanceAllowed: true,
        overrideAllowed: true,
        requiredAtTenant: false,
        appliesTo: {
          environmentTypes: ['prod', 'test', 'dev'],
          regions: ['*'],
          userRoles: ['admin', 'developer', 'user']
        },
        configuration: {
          maxUsers: 100,
          guestAccessAllowed: false,
          apiAccessControls: true,
          timeBasedAccess: false,
          ipWhitelisting: false,
          deviceCompliance: true
        },
        metadata: {
          createdBy: 'environment-admin',
          createdAt: new Date('2024-01-01'),
          lastModified: new Date(),
          version: '1.0',
          compliance: ['Access Controls']
        }
      },
      {
        id: 'env-resource-limits',
        name: 'Environment Resource Limits',
        description: 'Environment-specific resource quotas and limits',
        type: 'cost',
        scope: 'environment',
        level: 'environment',
        status: 'enabled',
        priority: 'medium',
        enforcement: 'warn',
        inheritanceAllowed: true,
        overrideAllowed: true,
        requiredAtTenant: false,
        appliesTo: {
          environmentTypes: ['test', 'dev', 'sandbox'],
          regions: ['*'],
          userRoles: ['admin']
        },
        configuration: {
          maxApps: 50,
          maxFlows: 100,
          maxConnections: 200,
          storageQuotaGB: 100,
          apiCallLimit: 10000, // per day
          computeHours: 200 // per month
        },
        metadata: {
          createdBy: 'resource-admin',
          createdAt: new Date('2024-01-01'),
          lastModified: new Date(),
          version: '1.1',
          compliance: ['Resource Management']
        }
      },
      {
        id: 'env-data-retention',
        name: 'Environment Data Retention',
        description: 'Environment-specific data retention and cleanup policies',
        type: 'data',
        scope: 'environment',
        level: 'environment',
        status: 'enabled',
        priority: 'medium',
        enforcement: 'audit',
        inheritanceAllowed: true,
        overrideAllowed: true,
        requiredAtTenant: false,
        appliesTo: {
          environmentTypes: ['dev', 'test'],
          regions: ['*'],
          userRoles: ['admin']
        },
        configuration: {
          autoCleanupEnabled: true,
          retentionPeriodDays: 90,
          archiveBeforeDelete: true,
          notifyBeforeCleanup: 7, // days
          excludePatterns: ['prod-*', 'baseline-*'],
          backupBeforeCleanup: true
        },
        metadata: {
          createdBy: 'data-admin',
          createdAt: new Date('2024-01-01'),
          lastModified: new Date(),
          version: '1.0',
          compliance: ['Data Management']
        }
      }
    ]

    // Store tenant controls
    defaultTenantControls.forEach(control => {
      this.tenantControls.set(control.id, control)
    })

    // Store environment controls (initialize empty maps for each environment)
    defaultEnvironmentControls.forEach(control => {
      // These will be applied per environment as needed
      console.log(`[Governance] Default environment control available: ${control.name}`)
    })
  }

  /**
   * Initialize sample environments
   * Governance: Create representative environment contexts
   */
  private initializeEnvironments(): void {
    const environments: EnvironmentContext[] = [
      {
        id: 'env-prod-001',
        name: 'Production',
        type: 'prod',
        region: 'East US',
        parentTenant: 'tenant-main',
        complianceLevel: 'strict',
        businessCriticality: 'critical',
        dataClassification: 'confidential',
        userCount: 500,
        appCount: 25,
        lastAudit: new Date('2024-01-15')
      },
      {
        id: 'env-test-001',
        name: 'Testing',
        type: 'test',
        region: 'East US',
        parentTenant: 'tenant-main',
        complianceLevel: 'standard',
        businessCriticality: 'important',
        dataClassification: 'internal',
        userCount: 100,
        appCount: 15,
        lastAudit: new Date('2024-01-10')
      },
      {
        id: 'env-dev-001',
        name: 'Development',
        type: 'dev',
        region: 'East US',
        parentTenant: 'tenant-main',
        complianceLevel: 'relaxed',
        businessCriticality: 'standard',
        dataClassification: 'internal',
        userCount: 50,
        appCount: 30,
        lastAudit: new Date('2024-01-05')
      },
      {
        id: 'env-sandbox-001',
        name: 'Developer Sandbox',
        type: 'sandbox',
        region: 'West US',
        parentTenant: 'tenant-main',
        complianceLevel: 'relaxed',
        businessCriticality: 'low',
        dataClassification: 'public',
        userCount: 20,
        appCount: 45,
        lastAudit: new Date('2024-01-01')
      }
    ]

    environments.forEach(env => {
      this.environments.set(env.id, env)
      this.environmentControls.set(env.id, new Map())
    })
  }

  /**
   * Get all tenant-level controls
   * Governance: Retrieve organization-wide policies
   */
  getTenantControls(filter?: {
    type?: GovernanceControl['type']
    priority?: GovernanceControl['priority']
    status?: GovernanceControl['status']
  }): GovernanceControl[] {
    let controls = Array.from(this.tenantControls.values())

    if (filter) {
      if (filter.type) controls = controls.filter(c => c.type === filter.type)
      if (filter.priority) controls = controls.filter(c => c.priority === filter.priority)
      if (filter.status) controls = controls.filter(c => c.status === filter.status)
    }

    return controls
  }

  /**
   * Get environment-specific controls
   * Governance: Retrieve environment-level policies
   */
  getEnvironmentControls(environmentId: string, filter?: {
    type?: GovernanceControl['type']
    includeInherited?: boolean
  }): GovernanceControl[] {
    const envControls = this.environmentControls.get(environmentId) || new Map()
    let controls = Array.from(envControls.values())

    // Include inherited tenant controls if requested
    if (filter?.includeInherited) {
      const tenantControls = this.getTenantControls()
      const inheritedControls = tenantControls.filter(tc => 
        tc.inheritanceAllowed && 
        this.isControlApplicableToEnvironment(tc, environmentId)
      )
      controls = [...controls, ...inheritedControls]
    }

    if (filter?.type) {
      controls = controls.filter(c => c.type === filter.type)
    }

    return controls
  }

  /**
   * Get effective controls for an environment
   * Governance: Calculate final policy after inheritance and overrides
   */
  getEffectiveControls(environmentId: string): GovernanceControl[] {
    const environment = this.environments.get(environmentId)
    if (!environment) return []

    const effectiveControls: GovernanceControl[] = []
    const processedControlIds = new Set<string>()

    // Start with tenant controls
    const tenantControls = this.getTenantControls({ status: 'enabled' })
    
    for (const tenantControl of tenantControls) {
      if (this.isControlApplicableToEnvironment(tenantControl, environmentId)) {
        const envControls = this.environmentControls.get(environmentId)
        const envOverride = envControls?.get(tenantControl.id)

        if (envOverride && tenantControl.overrideAllowed) {
          // Environment override exists and is allowed
          const effectiveControl = this.mergeControls(tenantControl, envOverride)
          effectiveControls.push(effectiveControl)
        } else {
          // Use tenant control as-is
          effectiveControls.push({ ...tenantControl, level: 'tenant' })
        }
        
        processedControlIds.add(tenantControl.id)
      }
    }

    // Add environment-only controls
    const envControls = this.environmentControls.get(environmentId)
    if (envControls) {
      for (const [controlId, control] of envControls) {
        if (!processedControlIds.has(controlId)) {
          effectiveControls.push(control)
        }
      }
    }

    return effectiveControls
  }

  /**
   * Add or update tenant control
   * Governance: Manage organization-wide policies
   */
  setTenantControl(control: GovernanceControl): void {
    control.level = 'tenant'
    control.scope = control.scope === 'environment' ? 'both' : control.scope
    
    this.tenantControls.set(control.id, control)
    
    // Update inheritance rules if needed
    if (control.inheritanceAllowed) {
      this.updateInheritanceRules(control.id)
    }

    console.log(`[Governance] Tenant control updated: ${control.name}`)
  }

  /**
   * Add or update environment control
   * Governance: Manage environment-specific policies
   */
  setEnvironmentControl(environmentId: string, control: GovernanceControl): void {
    control.level = 'environment'
    
    let envControls = this.environmentControls.get(environmentId)
    if (!envControls) {
      envControls = new Map()
      this.environmentControls.set(environmentId, envControls)
    }
    
    envControls.set(control.id, control)
    
    // Check for conflicts with tenant controls
    const tenantControl = this.tenantControls.get(control.id)
    if (tenantControl && !tenantControl.overrideAllowed) {
      console.warn(`[Governance] Conflict: Environment override not allowed for ${control.id}`)
    }

    console.log(`[Governance] Environment control updated: ${control.name} for ${environmentId}`)
  }

  /**
   * Check if control applies to environment
   * Governance: Determine policy applicability based on context
   */
  private isControlApplicableToEnvironment(control: GovernanceControl, environmentId: string): boolean {
    const environment = this.environments.get(environmentId)
    if (!environment) return false

    // Check environment type
    if (!control.appliesTo.environmentTypes.includes('*') && 
        !control.appliesTo.environmentTypes.includes(environment.type)) {
      return false
    }

    // Check region
    if (!control.appliesTo.regions.includes('*') && 
        !control.appliesTo.regions.includes(environment.region)) {
      return false
    }

    return true
  }

  /**
   * Merge tenant and environment controls
   * Governance: Resolve policy conflicts and create effective control
   */
  private mergeControls(tenantControl: GovernanceControl, envOverride: GovernanceControl): GovernanceControl {
    const merged: GovernanceControl = { ...tenantControl }

    // Override allowed fields
    if (envOverride.enforcement && tenantControl.enforcement !== 'strict') {
      merged.enforcement = envOverride.enforcement
    }

    if (envOverride.configuration) {
      merged.configuration = { 
        ...tenantControl.configuration, 
        ...envOverride.configuration 
      }
    }

    // Mark as environment level since it has overrides
    merged.level = 'environment'
    merged.status = envOverride.status || tenantControl.status

    return merged
  }

  /**
   * Update inheritance rules
   * Governance: Maintain policy inheritance chains
   */
  private updateInheritanceRules(controlId: string): void {
    const tenantControl = this.tenantControls.get(controlId)
    if (!tenantControl) return

    const inheritance: PolicyInheritance = {
      controlId,
      tenantPolicy: tenantControl,
      environmentOverrides: new Map(),
      effectivePolicy: tenantControl,
      inheritanceChain: ['tenant'],
      conflicts: []
    }

    // Check each environment for overrides
    for (const [envId, envControls] of this.environmentControls) {
      const envOverride = envControls.get(controlId)
      if (envOverride) {
        inheritance.environmentOverrides.set(envId, envOverride)
        inheritance.inheritanceChain.push(envId)

        // Check for conflicts
        if (!tenantControl.overrideAllowed) {
          inheritance.conflicts.push({
            environmentId: envId,
            conflictType: 'scope',
            description: 'Environment override not allowed by tenant policy',
            resolution: 'tenant_wins'
          })
        }
      }
    }

    this.inheritanceRules.set(controlId, inheritance)
  }

  /**
   * Validate governance compliance
   * Governance: Check compliance across tenant and environments
   */
  validateGovernanceCompliance(): {
    overall: {
      compliant: boolean
      score: number
      criticalViolations: number
    }
    tenant: {
      compliant: boolean
      missingRequired: string[]
      configurationIssues: string[]
    }
    environments: Record<string, {
      compliant: boolean
      violations: Array<{
        controlId: string
        severity: 'critical' | 'high' | 'medium' | 'low'
        description: string
      }>
    }>
  } {
    const result = {
      overall: {
        compliant: true,
        score: 100,
        criticalViolations: 0
      },
      tenant: {
        compliant: true,
        missingRequired: [] as string[],
        configurationIssues: [] as string[]
      },
      environments: {} as Record<string, {
        compliant: boolean
        violations: Array<{
          controlId: string
          severity: 'critical' | 'high' | 'medium' | 'low'
          description: string
        }>
      }>
    }

    // Check tenant compliance
    const tenantControls = this.getTenantControls()
    const requiredControls = tenantControls.filter(c => c.requiredAtTenant)
    const enabledRequired = requiredControls.filter(c => c.status === 'enabled')
    
    if (enabledRequired.length < requiredControls.length) {
      result.tenant.compliant = false
      result.tenant.missingRequired = requiredControls
        .filter(c => c.status !== 'enabled')
        .map(c => c.name)
    }

    // Check environment compliance
    for (const [envId, environment] of this.environments) {
      const envResult = {
        compliant: true,
        violations: [] as Array<{
          controlId: string
          severity: 'critical' | 'high' | 'medium' | 'low'
          description: string
        }>
      }

      const effectiveControls = this.getEffectiveControls(envId)
      
      // Check critical controls
      const criticalControls = effectiveControls.filter(c => c.priority === 'critical')
      const disabledCritical = criticalControls.filter(c => c.status === 'disabled')
      
      if (disabledCritical.length > 0) {
        envResult.compliant = false
        disabledCritical.forEach(control => {
          envResult.violations.push({
            controlId: control.id,
            severity: 'critical',
            description: `Critical control '${control.name}' is disabled`
          })
          result.overall.criticalViolations++
        })
      }

      // Check environment-specific requirements
      if (environment.type === 'prod' && environment.complianceLevel !== 'strict') {
        envResult.compliant = false
        envResult.violations.push({
          controlId: 'compliance-level',
          severity: 'high',
          description: 'Production environment should have strict compliance level'
        })
      }

      result.environments[envId] = envResult
      
      if (!envResult.compliant) {
        result.overall.compliant = false
      }
    }

    // Calculate overall score
    const totalViolations = Object.values(result.environments)
      .reduce((sum, env) => sum + env.violations.length, 0) + 
      result.tenant.missingRequired.length

    const totalChecks = Object.keys(result.environments).length * 3 + 
      requiredControls.length

    result.overall.score = Math.max(0, Math.round(((totalChecks - totalViolations) / totalChecks) * 100))

    return result
  }

  /**
   * Get environments
   * Governance: Retrieve environment contexts
   */
  getEnvironments(): EnvironmentContext[] {
    return Array.from(this.environments.values())
  }

  /**
   * Get environment by ID
   * Governance: Retrieve specific environment context
   */
  getEnvironment(environmentId: string): EnvironmentContext | null {
    return this.environments.get(environmentId) || null
  }

  /**
   * Update environment context
   * Governance: Modify environment metadata
   */
  updateEnvironment(environmentId: string, updates: Partial<EnvironmentContext>): boolean {
    const environment = this.environments.get(environmentId)
    if (!environment) return false

    const updated = { ...environment, ...updates }
    this.environments.set(environmentId, updated)

    console.log(`[Governance] Environment updated: ${environmentId}`)
    return true
  }

  /**
   * Generate governance summary
   * Governance: Executive dashboard metrics
   */
  getGovernanceSummary(): {
    tenantControls: number
    environmentControls: number
    totalEnvironments: number
    complianceScore: number
    criticalViolations: number
    controlsByType: Record<string, number>
    controlsByPriority: Record<string, number>
  } {
    const validation = this.validateGovernanceCompliance()
    
    const allControls = [
      ...this.getTenantControls(),
      ...Array.from(this.environmentControls.values())
        .flatMap(envControls => Array.from(envControls.values()))
    ]

    const controlsByType = allControls.reduce((acc, control) => {
      acc[control.type] = (acc[control.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const controlsByPriority = allControls.reduce((acc, control) => {
      acc[control.priority] = (acc[control.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      tenantControls: this.tenantControls.size,
      environmentControls: Array.from(this.environmentControls.values())
        .reduce((sum, envControls) => sum + envControls.size, 0),
      totalEnvironments: this.environments.size,
      complianceScore: validation.overall.score,
      criticalViolations: validation.overall.criticalViolations,
      controlsByType,
      controlsByPriority
    }
  }
}

// Singleton instance for global access
export const governanceControlsManager = new GovernanceControlsManager()