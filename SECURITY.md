# Security Policy

## 🚨 Current Security Status

**Version:** 0.1.0 (Development/Demo Phase)
**Enterprise Readiness:** ⚠️ NOT PRODUCTION READY
**Last Security Review:** 2026-01-19

---

## ⚠️ Known Security Limitations

This application is currently in **development/demo phase** and has **known security limitations** that prevent enterprise deployment. Please review carefully before use.

### 1. Client-Side Only Architecture (CRITICAL)

**Issue:** The application has NO backend server and NO API routes.

**Impact:**
- All assessment data is stored in browser `localStorage` only
- If a user clears browser cache, ALL data is permanently lost
- No backup, no recovery, no data persistence
- Not suitable for multi-user or team deployments

**Mitigation Required:**
- ✅ **Local Demo Use Only** - Acceptable for single-user demos and templates
- ❌ **Enterprise Deployment** - Requires backend implementation

**Recommendation for Production:**
```
Implement one of:
1. Next.js API routes with Azure SQL/Cosmos DB
2. Power Platform Dataverse integration
3. Azure Storage Account (Blob Storage) for JSON exports
4. Microsoft Graph API integration
```

---

### 2. XSS Vulnerability via localStorage (HIGH)

**Issue:** All assessment data accessible via JavaScript `localStorage.getItem()`.

**Impact:**
- Any Cross-Site Scripting (XSS) vulnerability could expose all assessment data
- Malicious browser extensions could read data
- No encryption at rest
- No access controls

**Mitigation Required:**
- For sensitive assessments, use server-side storage
- Implement Content Security Policy (CSP)
- Consider encryption for sensitive fields

**Current CSP Status:** ⚠️ Not implemented

---

### 3. Google Drive Integration (CRITICAL - DISABLED)

**Issue:** Previous implementation exposed API keys in client bundle.

**Status:** ✅ **DISABLED** as of 2026-01-19

**Previous Risk:**
```
NEXT_PUBLIC_GOOGLE_API_KEY exposed to browser
Any user can extract key from JavaScript bundle
Keys must be restricted by HTTP Referrer in Google Cloud Console
```

**Current Mitigation:**
- Google Drive integration code remains but keys are NOT configured
- Users see download button for JSON export instead
- .env.example includes security warnings

**Recommendation for Production:**
```
If Google Drive integration needed:
1. Create app/api/google-drive/[...route].ts
2. Store credentials in server-side environment variables (NO NEXT_PUBLIC_ prefix)
3. Implement OAuth 2.0 user authentication
4. Use service account with domain-wide delegation
5. Implement rate limiting
```

---

### 4. No Authentication Layer (HIGH)

**Issue:** Application has no user authentication or identity verification.

**Impact:**
- Anyone with URL can access application
- No audit trail of who created assessments
- Cannot enforce organizational policies
- "Assessor Info" dialog is cosmetic only

**Mitigation Required for Enterprise:**
```
Implement one of:
1. Microsoft Entra ID (formerly Azure AD) with MSAL
2. Next-Auth with Microsoft provider
3. Power Platform custom connector with authentication
```

**Example:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import MicrosoftEntraIDProvider from "next-auth/providers/microsoft-entra-id"

export default NextAuth({
  providers: [
    MicrosoftEntraIDProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
})
```

---

### 5. No Rate Limiting (MEDIUM)

**Issue:** No protection against automated abuse or DoS.

**Impact:**
- Single user could create thousands of projects
- No API throttling (because no API exists)
- Browser-based throttling can be bypassed

**Mitigation:**
- Acceptable for demo/local use
- Requires backend + Redis/rate limiting library for production

---

## ✅ Security Features Implemented

### 1. Type Safety
- ✅ TypeScript throughout application
- ✅ Zod validation for form inputs
- ✅ Type-safe exports (Excel, Word, JSON)

### 2. Secure Defaults
- ✅ No NEXT_PUBLIC_ API keys in codebase
- ✅ ExtensionBlocker removed (accessibility improvement)
- ✅ Phantom code files removed
- ✅ .env.example with security warnings

### 3. MIT License
- ✅ Clear licensing terms
- ✅ No legal ambiguity

---

## 🎯 Security Roadmap

### Phase 1: Demo/Template Use (CURRENT)
- ✅ Remove critical anti-patterns
- ✅ Add security documentation
- ✅ Warn about limitations
- ⚠️ Accept localStorage risk for local demos

### Phase 2: Backend Implementation (PLANNED)
- [ ] Implement Next.js API routes
- [ ] Add Microsoft Entra ID authentication
- [ ] Store data in Azure SQL or Cosmos DB
- [ ] Implement audit logging

### Phase 3: Enterprise Hardening (FUTURE)
- [ ] Implement CSP headers
- [ ] Add rate limiting
- [ ] Encrypt sensitive fields at rest
- [ ] Implement role-based access control (RBAC)
- [ ] Add Security Incident Response plan
- [ ] Penetration testing

---

## 📊 Risk Assessment Matrix

| Risk | Severity | Likelihood | Impact | Mitigation Status |
|------|----------|------------|---------|-------------------|
| Data loss (localStorage cleared) | HIGH | MEDIUM | HIGH | ⚠️ Documented, acceptable for demos |
| XSS data exfiltration | HIGH | LOW | HIGH | ⚠️ Documented, requires CSP |
| No authentication | HIGH | N/A | MEDIUM | ⚠️ Documented, demo use only |
| API key exposure (Google Drive) | CRITICAL | N/A | CRITICAL | ✅ **DISABLED** |
| No audit trail | MEDIUM | N/A | MEDIUM | ⚠️ Documented, requires backend |
| Rate limiting bypass | LOW | LOW | LOW | ⚠️ Acceptable for demos |

---

## 🛡️ Deployment Guidance

### ✅ Acceptable Use Cases (Current State)
- Local demos and proof-of-concepts
- Template generation for customer reports
- Training and education
- Single-user assessments with manual export/backup

### ❌ NOT Acceptable Use Cases
- Multi-user team deployments
- Production enterprise assessments
- Storing sensitive or regulated data
- Public internet deployments without authentication
- Long-term data retention requirements

---

## 🔒 Secure Development Practices

### For Contributors

1. **Never commit secrets**
   - Use .env.local (gitignored)
   - Never use NEXT_PUBLIC_ for sensitive data
   - Rotate any accidentally committed keys

2. **Validate all inputs**
   - Use Zod schemas for all forms
   - Sanitize user input before rendering
   - Use React's JSX (auto-escapes by default)

3. **Test security changes**
   - Run `npm audit` before commits
   - Update dependencies regularly
   - Review OWASP Top 10 before major releases

---

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@bytessoftware.co.uk (if applicable)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

**Expected Response Time:** 48 hours

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Status:** ⚠️ **DEVELOPMENT PHASE - NOT PRODUCTION READY**

**Safe for:** Demos, templates, local assessments with manual backups

**NOT safe for:** Enterprise deployment, sensitive data, multi-user teams

**Last Updated:** 2026-01-19
**Reviewed By:** Development Team + Claude Sonnet 4.5

---

*This security policy reflects the current state of the application accurately. It is designed to be transparent about limitations while the application is in development/demo phase.*
