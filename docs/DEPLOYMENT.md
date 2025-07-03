# Deployment Guide for Power Platform Assessment Suite

This guide covers deploying the Power Platform Assessment Suite to Vercel and other platforms.

## Table of Contents
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment Setup](#post-deployment-setup)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (free tier is sufficient)
- Node.js 18+ installed locally

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/power-platform-assessment-suite)

### Manual Deployment

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/power-platform-assessment-suite.git
   cd power-platform-assessment-suite
   ```

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Select the correct directory (.)
   - Override build settings if needed

### GitHub Integration

1. **Connect GitHub to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings

2. **Automatic Deployments**
   - Production: Deploys on push to `main` branch
   - Preview: Deploys on pull requests
   - Configure branch protection for production

## Environment Variables

### Required Variables
None - the app works with default settings

### Optional Variables

1. **Google Drive Integration**
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

2. **Analytics**
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING=your-connection-string
   ```

3. **Security**
   ```
   ALLOWED_DOMAINS=https://yourdomain.com,https://anotherdomain.com
   CSP_REPORT_URI=https://your-csp-reporter.com/report
   ```

### Setting Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope:
   - Production: Only for production deployments
   - Preview: For preview deployments
   - Development: For local development

## Post-Deployment Setup

### 1. Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

### 2. Google Drive Setup (Optional)
1. Create a Google Cloud Project
2. Enable Google Drive API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
   - `https://your-domain.com/google-drive-test`

### 3. Enable Analytics (Optional)
1. Set up Google Analytics 4
2. Add measurement ID to environment variables
3. Verify tracking in GA real-time view

## Performance Optimization

### Vercel Configuration
The `vercel.json` includes optimizations for:
- Edge caching for static assets
- Regional deployment (US East by default)
- Function memory and timeout limits
- Security headers

### Additional Optimizations

1. **Enable Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Image Optimization**
   - Images are automatically optimized by Next.js
   - Use WebP format when possible
   - Implement lazy loading (already configured)

3. **Bundle Size**
   - Monitor with `npm run analyze`
   - Use dynamic imports for large components
   - Tree-shake unused dependencies

## Security Considerations

### Headers
Security headers are configured in `vercel.json`:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricts camera, microphone, geolocation

### Content Security Policy
Add CSP header for production:
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.google-analytics.com *.googleapis.com"
}
```

### API Security
- Rate limiting configured via environment variables
- CORS restrictions for API endpoints
- Input validation on all user inputs

## Monitoring & Analytics

### Vercel Analytics
1. Enable in Vercel Dashboard
2. Provides Web Vitals and performance metrics
3. No additional configuration needed

### Application Insights
1. Create Application Insights resource in Azure
2. Add connection string to environment variables
3. Telemetry automatically collected for:
   - Page views
   - Errors
   - Performance metrics
   - Custom events

### Error Tracking
Consider adding Sentry for error tracking:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Run `npm install --legacy-peer-deps` locally
   - Verify all environment variables are set

2. **Google Drive Not Working**
   - Verify OAuth credentials
   - Check redirect URIs match exactly
   - Ensure GOOGLE_CLIENT_SECRET is in Vercel env vars

3. **Slow Performance**
   - Check Vercel Analytics for bottlenecks
   - Verify caching headers are working
   - Consider upgrading Vercel plan for more resources

4. **Export Features Not Working**
   - Increase function timeout in vercel.json
   - Check browser console for errors
   - Verify CORS settings if using custom domain

### Debug Mode
Enable debug mode for troubleshooting:
```
NEXT_PUBLIC_SHOW_DEBUG_INFO=true
```

### Support
- Create an issue on GitHub
- Check Vercel status page
- Review Next.js deployment docs

## Alternative Deployment Platforms

### Netlify
1. Use `netlify.toml` for configuration
2. Set build command: `npm run build`
3. Publish directory: `.next`

### Azure Static Web Apps
1. Use GitHub Actions workflow
2. Configure API routes for serverless functions
3. Set environment variables in Azure Portal

### Self-Hosted
1. Build locally: `npm run build`
2. Start production server: `npm start`
3. Use PM2 or similar for process management
4. Configure reverse proxy (nginx/Apache)

## Maintenance

### Regular Updates
1. Keep dependencies updated
2. Monitor security advisories
3. Test in preview environment first
4. Use semantic versioning for releases

### Backup Strategy
1. Export assessment data regularly
2. Use Git tags for releases
3. Keep environment variable backups
4. Document any custom configurations