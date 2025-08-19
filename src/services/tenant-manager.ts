export interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  customDomain?: string
  logo?: string
  favicon?: string
  theme: TenantTheme
  settings: TenantSettings
  subscription: TenantSubscription
  limits: TenantLimits
  metadata: TenantMetadata
  createdAt: string
  updatedAt: string
}

export interface TenantTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily?: string
  customCSS?: string
  darkMode?: boolean
}

export interface TenantSettings {
  language: string
  timezone: string
  dateFormat: string
  currency: string
  emailNotifications: boolean
  twoFactorAuth: boolean
  ssoEnabled: boolean
  ssoProvider?: 'google' | 'microsoft' | 'okta' | 'auth0' | 'custom'
  apiAccess: boolean
  webhooksEnabled: boolean
  dataRetentionDays: number
  auditLogEnabled: boolean
  ipWhitelist?: string[]
  allowedDomains?: string[]
}

export interface TenantSubscription {
  plan: 'free' | 'starter' | 'professional' | 'enterprise' | 'custom'
  status: 'active' | 'trial' | 'suspended' | 'cancelled'
  billingCycle: 'monthly' | 'yearly'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEndsAt?: string
  cancelledAt?: string
  seats: number
  addons: string[]
  customFeatures?: string[]
}

export interface TenantLimits {
  maxUsers: number
  maxStorage: number // in GB
  maxApiRequests: number
  maxWorkflows: number
  maxIntegrations: number
  maxAITokens: number
  maxDataRetention: number // in days
  maxConcurrentSessions: number
  customLimits?: Record<string, number>
}

export interface TenantMetadata {
  industry: string
  companySize: 'small' | 'medium' | 'large' | 'enterprise'
  country: string
  contactEmail: string
  contactPhone?: string
  billingEmail?: string
  technicalContact?: string
  notes?: string
  tags?: string[]
  customFields?: Record<string, any>
}

export interface Organization {
  id: string
  tenantId: string
  name: string
  description?: string
  parentId?: string // For hierarchical organizations
  settings: OrganizationSettings
  limits?: OrganizationLimits
  metadata: OrganizationMetadata
  createdAt: string
  updatedAt: string
}

export interface OrganizationSettings {
  visibility: 'public' | 'private'
  joinApproval: boolean
  memberCanInvite: boolean
  dataSharing: boolean
  crossOrgCollaboration: boolean
}

export interface OrganizationLimits {
  maxMembers?: number
  maxProjects?: number
  maxStorage?: number
}

export interface OrganizationMetadata {
  department?: string
  costCenter?: string
  manager?: string
  location?: string
  customFields?: Record<string, any>
}

export interface User {
  id: string
  tenantId: string
  organizationIds: string[]
  email: string
  name: string
  avatar?: string
  role: UserRole
  permissions: Permission[]
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  preferences: UserPreferences
  metadata: UserMetadata
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  id: string
  name: string
  level: 'super_admin' | 'tenant_admin' | 'org_admin' | 'manager' | 'member' | 'guest'
  permissions: string[]
  customPermissions?: string[]
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete' | 'execute' | 'approve')[]
  conditions?: PermissionCondition[]
}

export interface PermissionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'in' | 'not_in'
  value: any
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  notifications: NotificationPreferences
  dashboard: DashboardPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  digest: 'realtime' | 'hourly' | 'daily' | 'weekly'
  categories: Record<string, boolean>
}

export interface DashboardPreferences {
  layout: string
  widgets: string[]
  defaultView: string
  shortcuts: string[]
}

export interface UserMetadata {
  department?: string
  jobTitle?: string
  manager?: string
  phoneNumber?: string
  location?: string
  employeeId?: string
  customFields?: Record<string, any>
}

export interface AuditLog {
  id: string
  tenantId: string
  organizationId?: string
  userId: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, { old: any; new: any }>
  ipAddress: string
  userAgent: string
  status: 'success' | 'failure'
  errorMessage?: string
  timestamp: string
}

export interface TenantInvitation {
  id: string
  tenantId: string
  organizationId?: string
  email: string
  role: string
  invitedBy: string
  acceptedAt?: string
  expiresAt: string
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  createdAt: string
}

export interface ResourceQuota {
  tenantId: string
  organizationId?: string
  userId?: string
  resource: string
  used: number
  limit: number
  period: 'hourly' | 'daily' | 'monthly' | 'total'
  resetAt?: string
  updatedAt: string
}

export class TenantManager {
  private tenants: Map<string, Tenant> = new Map()
  private organizations: Map<string, Organization[]> = new Map()
  private users: Map<string, User[]> = new Map()
  private auditLogs: Map<string, AuditLog[]> = new Map()
  private invitations: Map<string, TenantInvitation[]> = new Map()
  private quotas: Map<string, ResourceQuota[]> = new Map()
  private currentTenant: Tenant | null = null
  private currentUser: User | null = null

  constructor() {
    this.initializeDefaultTenants()
  }

  // Tenant Management
  async createTenant(
    tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Tenant> {
    const id = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullTenant: Tenant = {
      ...tenant,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.tenants.set(id, fullTenant)
    
    // Create default organization
    await this.createOrganization({
      tenantId: id,
      name: `${tenant.name} Main`,
      settings: {
        visibility: 'private',
        joinApproval: true,
        memberCanInvite: false,
        dataSharing: true,
        crossOrgCollaboration: false
      },
      metadata: {}
    })

    // Log tenant creation
    await this.logAuditEvent({
      tenantId: id,
      userId: 'system',
      action: 'tenant.create',
      resource: 'tenant',
      resourceId: id,
      ipAddress: '0.0.0.0',
      userAgent: 'system',
      status: 'success'
    })

    return fullTenant
  }

  async getTenant(tenantId: string): Promise<Tenant | undefined> {
    return this.tenants.get(tenantId)
  }

  async updateTenant(
    tenantId: string,
    updates: Partial<Tenant>
  ): Promise<Tenant | undefined> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) return undefined

    const oldTenant = { ...tenant }
    const updatedTenant: Tenant = {
      ...tenant,
      ...updates,
      id: tenant.id,
      createdAt: tenant.createdAt,
      updatedAt: new Date().toISOString()
    }

    this.tenants.set(tenantId, updatedTenant)

    // Log the update
    await this.logAuditEvent({
      tenantId,
      userId: this.currentUser?.id || 'system',
      action: 'tenant.update',
      resource: 'tenant',
      resourceId: tenantId,
      changes: this.getChanges(oldTenant, updatedTenant),
      ipAddress: '0.0.0.0',
      userAgent: 'system',
      status: 'success'
    })

    return updatedTenant
  }

  async deleteTenant(tenantId: string): Promise<boolean> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) return false

    // Check if tenant can be deleted
    const users = this.users.get(tenantId) || []
    if (users.length > 0) {
      throw new Error('Cannot delete tenant with active users')
    }

    this.tenants.delete(tenantId)
    this.organizations.delete(tenantId)
    this.auditLogs.delete(tenantId)
    this.invitations.delete(tenantId)
    this.quotas.delete(tenantId)

    return true
  }

  // Organization Management
  async createOrganization(
    org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Organization> {
    const id = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const fullOrg: Organization = {
      ...org,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const tenantOrgs = this.organizations.get(org.tenantId) || []
    tenantOrgs.push(fullOrg)
    this.organizations.set(org.tenantId, tenantOrgs)

    await this.logAuditEvent({
      tenantId: org.tenantId,
      organizationId: id,
      userId: this.currentUser?.id || 'system',
      action: 'organization.create',
      resource: 'organization',
      resourceId: id,
      ipAddress: '0.0.0.0',
      userAgent: 'system',
      status: 'success'
    })

    return fullOrg
  }

  async getOrganizations(tenantId: string): Promise<Organization[]> {
    return this.organizations.get(tenantId) || []
  }

  async getOrganization(
    tenantId: string,
    organizationId: string
  ): Promise<Organization | undefined> {
    const orgs = this.organizations.get(tenantId) || []
    return orgs.find(org => org.id === organizationId)
  }

  // User Management
  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Check tenant limits
    await this.checkResourceLimit(user.tenantId, 'users', 1)

    const fullUser: User = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const tenantUsers = this.users.get(user.tenantId) || []
    tenantUsers.push(fullUser)
    this.users.set(user.tenantId, tenantUsers)

    // Update resource usage
    await this.updateResourceUsage(user.tenantId, 'users', 1)

    await this.logAuditEvent({
      tenantId: user.tenantId,
      userId: this.currentUser?.id || 'system',
      action: 'user.create',
      resource: 'user',
      resourceId: id,
      ipAddress: '0.0.0.0',
      userAgent: 'system',
      status: 'success'
    })

    return fullUser
  }

  async getUsers(tenantId: string, organizationId?: string): Promise<User[]> {
    const users = this.users.get(tenantId) || []
    
    if (organizationId) {
      return users.filter(user => user.organizationIds.includes(organizationId))
    }
    
    return users
  }

  async getUser(tenantId: string, userId: string): Promise<User | undefined> {
    const users = this.users.get(tenantId) || []
    return users.find(user => user.id === userId)
  }

  async updateUser(
    tenantId: string,
    userId: string,
    updates: Partial<User>
  ): Promise<User | undefined> {
    const users = this.users.get(tenantId) || []
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) return undefined

    const oldUser = { ...users[userIndex] }
    const updatedUser: User = {
      ...users[userIndex],
      ...updates,
      id: users[userIndex].id,
      tenantId: users[userIndex].tenantId,
      createdAt: users[userIndex].createdAt,
      updatedAt: new Date().toISOString()
    }

    users[userIndex] = updatedUser
    this.users.set(tenantId, users)

    await this.logAuditEvent({
      tenantId,
      userId: this.currentUser?.id || userId,
      action: 'user.update',
      resource: 'user',
      resourceId: userId,
      changes: this.getChanges(oldUser, updatedUser),
      ipAddress: '0.0.0.0',
      userAgent: 'system',
      status: 'success'
    })

    return updatedUser
  }

  // Permission Management
  async checkPermission(
    userId: string,
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'approve'
  ): Promise<boolean> {
    const user = await this.getUserById(userId)
    if (!user) return false

    // Super admin has all permissions
    if (user.role.level === 'super_admin') return true

    // Check role permissions
    if (user.role.permissions.includes(`${resource}:${action}`)) return true
    if (user.role.permissions.includes(`${resource}:*`)) return true
    if (user.role.permissions.includes('*:*')) return true

    // Check individual permissions
    const permission = user.permissions.find(p => p.resource === resource)
    if (permission && permission.actions.includes(action)) {
      // Check conditions if any
      if (permission.conditions && permission.conditions.length > 0) {
        // Implement condition evaluation logic
        return this.evaluateConditions(permission.conditions)
      }
      return true
    }

    return false
  }

  async grantPermission(
    userId: string,
    permission: Permission
  ): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const existingPermission = user.permissions.find(p => p.resource === permission.resource)
    
    if (existingPermission) {
      // Merge actions
      existingPermission.actions = Array.from(new Set([
        ...existingPermission.actions,
        ...permission.actions
      ]))
      existingPermission.conditions = permission.conditions
    } else {
      user.permissions.push(permission)
    }

    await this.updateUser(user.tenantId, userId, { permissions: user.permissions })
  }

  async revokePermission(
    userId: string,
    resource: string,
    actions?: ('create' | 'read' | 'update' | 'delete' | 'execute' | 'approve')[]
  ): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) throw new Error('User not found')

    if (actions) {
      // Remove specific actions
      const permission = user.permissions.find(p => p.resource === resource)
      if (permission) {
        permission.actions = permission.actions.filter(a => !actions.includes(a))
        if (permission.actions.length === 0) {
          // Remove permission if no actions left
          user.permissions = user.permissions.filter(p => p.resource !== resource)
        }
      }
    } else {
      // Remove entire permission for resource
      user.permissions = user.permissions.filter(p => p.resource !== resource)
    }

    await this.updateUser(user.tenantId, userId, { permissions: user.permissions })
  }

  // Invitation Management
  async inviteUser(
    tenantId: string,
    email: string,
    role: string,
    organizationId?: string
  ): Promise<TenantInvitation> {
    const id = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const invitation: TenantInvitation = {
      id,
      tenantId,
      organizationId,
      email,
      role,
      invitedBy: this.currentUser?.id || 'system',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const tenantInvitations = this.invitations.get(tenantId) || []
    tenantInvitations.push(invitation)
    this.invitations.set(tenantId, tenantInvitations)

    await this.logAuditEvent({
      tenantId,
      userId: this.currentUser?.id || 'system',
      action: 'invitation.create',
      resource: 'invitation',
      resourceId: id,
      ipAddress: '0.0.0.0',
      userAgent: 'system',
      status: 'success'
    })

    return invitation
  }

  async acceptInvitation(invitationId: string): Promise<User | undefined> {
    // Find invitation
    let invitation: TenantInvitation | undefined
    let tenantId: string | undefined

    for (const [tid, invitations] of this.invitations.entries()) {
      const found = invitations.find(i => i.id === invitationId)
      if (found) {
        invitation = found
        tenantId = tid
        break
      }
    }

    if (!invitation || !tenantId) {
      throw new Error('Invitation not found')
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation already processed')
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      invitation.status = 'expired'
      throw new Error('Invitation has expired')
    }

    // Create user from invitation
    const user = await this.createUser({
      tenantId,
      organizationIds: invitation.organizationId ? [invitation.organizationId] : [],
      email: invitation.email,
      name: invitation.email.split('@')[0], // Default name from email
      role: this.getDefaultRole(invitation.role),
      permissions: [],
      status: 'active',
      preferences: this.getDefaultPreferences(),
      metadata: {}
    })

    // Update invitation status
    invitation.status = 'accepted'
    invitation.acceptedAt = new Date().toISOString()

    return user
  }

  // Resource Management
  async checkResourceLimit(
    tenantId: string,
    resource: string,
    requestedAmount: number
  ): Promise<boolean> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) throw new Error('Tenant not found')

    const quotas = this.quotas.get(tenantId) || []
    const quota = quotas.find(q => q.resource === resource && q.period === 'total')

    if (!quota) {
      // Create quota tracking
      const limit = this.getResourceLimit(tenant, resource)
      const newQuota: ResourceQuota = {
        tenantId,
        resource,
        used: 0,
        limit,
        period: 'total',
        updatedAt: new Date().toISOString()
      }
      quotas.push(newQuota)
      this.quotas.set(tenantId, quotas)
      return requestedAmount <= limit
    }

    return quota.used + requestedAmount <= quota.limit
  }

  async updateResourceUsage(
    tenantId: string,
    resource: string,
    amount: number
  ): Promise<void> {
    const quotas = this.quotas.get(tenantId) || []
    const quota = quotas.find(q => q.resource === resource && q.period === 'total')

    if (quota) {
      quota.used += amount
      quota.updatedAt = new Date().toISOString()
    }
  }

  async getResourceUsage(
    tenantId: string,
    resource?: string
  ): Promise<ResourceQuota[]> {
    const quotas = this.quotas.get(tenantId) || []
    
    if (resource) {
      return quotas.filter(q => q.resource === resource)
    }
    
    return quotas
  }

  // Audit Logging
  async logAuditEvent(
    event: Omit<AuditLog, 'id' | 'timestamp'>
  ): Promise<void> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const auditLog: AuditLog = {
      ...event,
      id,
      timestamp: new Date().toISOString()
    }

    const tenantLogs = this.auditLogs.get(event.tenantId) || []
    tenantLogs.push(auditLog)
    
    // Keep only last 10000 logs per tenant
    if (tenantLogs.length > 10000) {
      tenantLogs.splice(0, tenantLogs.length - 10000)
    }
    
    this.auditLogs.set(event.tenantId, tenantLogs)
  }

  async getAuditLogs(
    tenantId: string,
    filters?: {
      userId?: string
      action?: string
      resource?: string
      startDate?: string
      endDate?: string
      limit?: number
    }
  ): Promise<AuditLog[]> {
    let logs = this.auditLogs.get(tenantId) || []

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId)
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action)
      }
      if (filters.resource) {
        logs = logs.filter(log => log.resource === filters.resource)
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.timestamp <= filters.endDate!)
      }
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (filters?.limit) {
      logs = logs.slice(0, filters.limit)
    }

    return logs
  }

  // Session Management
  async setCurrentTenant(tenantId: string): Promise<void> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) throw new Error('Tenant not found')
    
    this.currentTenant = tenant
  }

  async setCurrentUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId)
    if (!user) throw new Error('User not found')
    
    this.currentUser = user
    this.currentTenant = this.tenants.get(user.tenantId) || null
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenant
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  // Private Methods
  private initializeDefaultTenants(): void {
    // Create demo tenant
    this.createTenant({
      name: 'Demo Company',
      slug: 'demo',
      theme: {
        primaryColor: '#06D6A0',
        secondaryColor: '#118AB2',
        accentColor: '#A855F7',
        backgroundColor: '#0A0A0A',
        textColor: '#FFFFFF',
        darkMode: true
      },
      settings: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        emailNotifications: true,
        twoFactorAuth: false,
        ssoEnabled: false,
        apiAccess: true,
        webhooksEnabled: true,
        dataRetentionDays: 90,
        auditLogEnabled: true
      },
      subscription: {
        plan: 'professional',
        status: 'active',
        billingCycle: 'monthly',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        seats: 50,
        addons: ['advanced_analytics', 'priority_support']
      },
      limits: {
        maxUsers: 50,
        maxStorage: 100,
        maxApiRequests: 100000,
        maxWorkflows: 100,
        maxIntegrations: 20,
        maxAITokens: 1000000,
        maxDataRetention: 90,
        maxConcurrentSessions: 50
      },
      metadata: {
        industry: 'Technology',
        companySize: 'medium',
        country: 'US',
        contactEmail: 'admin@demo.com'
      }
    })
  }

  private async getUserById(userId: string): Promise<User | undefined> {
    for (const users of this.users.values()) {
      const user = users.find(u => u.id === userId)
      if (user) return user
    }
    return undefined
  }

  private getChanges(oldObj: any, newObj: any): Record<string, { old: any; new: any }> {
    const changes: Record<string, { old: any; new: any }> = {}
    
    for (const key in newObj) {
      if (oldObj[key] !== newObj[key]) {
        changes[key] = {
          old: oldObj[key],
          new: newObj[key]
        }
      }
    }
    
    return changes
  }

  private evaluateConditions(conditions: PermissionCondition[]): boolean {
    // Implement condition evaluation logic
    // This would typically check against current context
    return true
  }

  private getResourceLimit(tenant: Tenant, resource: string): number {
    switch (resource) {
      case 'users': return tenant.limits.maxUsers
      case 'storage': return tenant.limits.maxStorage
      case 'api_requests': return tenant.limits.maxApiRequests
      case 'workflows': return tenant.limits.maxWorkflows
      case 'integrations': return tenant.limits.maxIntegrations
      case 'ai_tokens': return tenant.limits.maxAITokens
      default: return 0
    }
  }

  private getDefaultRole(roleName: string): UserRole {
    const roles: Record<string, UserRole> = {
      admin: {
        id: 'role_admin',
        name: 'Admin',
        level: 'tenant_admin',
        permissions: [
          'users:*',
          'organizations:*',
          'integrations:*',
          'workflows:*',
          'settings:*'
        ]
      },
      manager: {
        id: 'role_manager',
        name: 'Manager',
        level: 'manager',
        permissions: [
          'users:read',
          'users:update',
          'organizations:read',
          'integrations:*',
          'workflows:*'
        ]
      },
      member: {
        id: 'role_member',
        name: 'Member',
        level: 'member',
        permissions: [
          'users:read',
          'organizations:read',
          'integrations:read',
          'workflows:read',
          'workflows:execute'
        ]
      }
    }

    return roles[roleName] || roles.member
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: false,
        inApp: true,
        digest: 'daily',
        categories: {
          security: true,
          billing: true,
          updates: true,
          marketing: false
        }
      },
      dashboard: {
        layout: 'default',
        widgets: ['overview', 'recent_activity', 'quick_actions'],
        defaultView: 'dashboard',
        shortcuts: []
      }
    }
  }
}

export const tenantManager = new TenantManager()