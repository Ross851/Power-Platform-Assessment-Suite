// Environment-specific configuration for client testing
export const CLIENT_CONFIG = {
  // Demo mode settings
  DEMO_MODE: {
    ANONYMIZE_URLS: true,
    HIDE_SENSITIVE_DATA: true,
    SAMPLE_DATA_ONLY: true,
    READ_ONLY_MODE: true,
  },

  // Security settings
  SECURITY: {
    SESSION_TIMEOUT_MINUTES: 30,
    MAX_CONCURRENT_SESSIONS: 3,
    REQUIRE_EMAIL_VERIFICATION: true,
    ENABLE_AUDIT_LOGGING: true,
  },

  // Export settings
  EXPORT: {
    CLIENT_SAFE_MODE: true,
    INCLUDE_TECHNICAL_DETAILS: false,
    ANONYMIZE_DATA: true,
    WATERMARK_DOCUMENTS: true,
  },

  // Client access settings
  CLIENT_ACCESS: {
    DEFAULT_ROLE: "viewer" as const,
    ALLOW_SELF_REGISTRATION: false,
    REQUIRE_INVITATION: true,
    AUTO_EXPIRE_INVITATIONS_DAYS: 7,
  },
} as const

// Environment detection
export const isProduction = () => process.env.NODE_ENV === "production"
export const isDevelopment = () => process.env.NODE_ENV === "development"
export const isClientDemo = () => process.env.NEXT_PUBLIC_CLIENT_DEMO === "true"

// Client-safe data transformations
export const sanitizeForClient = (data: any) => {
  if (!CLIENT_CONFIG.DEMO_MODE.ANONYMIZE_URLS) return data

  // Replace sensitive URLs and server names
  const sensitivePatterns = [
    /https?:\/\/[a-zA-Z0-9.-]+\.internal/g,
    /https?:\/\/[a-zA-Z0-9.-]+\.local/g,
    /server-\d+/g,
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
  ]

  let sanitized = JSON.stringify(data)
  sensitivePatterns.forEach((pattern, index) => {
    sanitized = sanitized.replace(pattern, `[REDACTED-${index + 1}]`)
  })

  return JSON.parse(sanitized)
}
