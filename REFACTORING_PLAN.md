# Power Platform Assessment Suite - Refactoring Plan

**Based On:** EXPERT_REVIEW.md findings
**Date:** 2026-01-19
**Priority:** CRITICAL
**Estimated Effort:** 4-6 hours

---

## 🎯 Objectives

1. **Migrate to Microsoft-Aligned Questions** - Switch from `constants.ts` to `microsoft-aligned-questions.ts` as primary data source
2. **Add Testing Framework** - Implement Vitest with comprehensive unit tests
3. **Clean Codebase** - Remove experimental artifacts
4. **Validate Integration** - Ensure governance modules work with new structure

---

## 🔍 Problem Analysis

### Critical Issue: Data Source Disconnect

**Current State:**
```
assessment-store.ts → lib/constants.ts (older, basic questions)
                   ↓
               RAG scoring, maturity calculations
```

**Better Data Available:**
```
lib/microsoft-aligned-questions.ts (richer metadata, unused)
  ↓
  - aiSuggestion
  - bestPractice
  - guidance
  - tags
  - required flag
```

**Impact:** Users are assessed against inferior criteria while better data exists unused.

---

## 📋 Phase 1: Data Migration (Priority 1)

### Step 1.1: Analyze Type Compatibility

**Current `Question` type (from constants.ts):**
```typescript
interface Question {
  id: string;
  text: string;
  type: QuestionType;
  weight: number;
  importance?: number;
  category: string;
  guidance?: string;
  references?: Reference[];
  bestPractice?: BestPractice;
  options?: string[];
}
```

**Microsoft-Aligned `Question` additions:**
```typescript
{
  description?: string;      // NEW
  aiSuggestion?: string;      // NEW
  tags?: string[];            // NEW
  required?: boolean;         // NEW
  // ... existing fields
}
```

**Action:** Update `lib/types.ts` to include all new optional fields.

### Step 1.2: Create Migration Strategy

**Option A: Replace constants.ts entirely** (Recommended)
- ✅ Clean break from old data
- ✅ Forces full adoption of better structure
- ⚠️ Requires updating all existing questions

**Option B: Merge both sources**
- ✅ Preserves existing work
- ⚠️ Creates confusion about source of truth
- ❌ Not recommended

**Decision:** Proceed with Option A

### Step 1.3: Migration Steps

1. **Backup current constants.ts**
   ```bash
   cp lib/constants.ts lib/constants.ts.backup
   ```

2. **Analyze microsoft-aligned-questions.ts structure**
   - Count total questions
   - Identify categories
   - Map to existing assessment standards

3. **Create new constants.ts from microsoft-aligned-questions**
   ```typescript
   import { microsoftAlignedQuestions } from './microsoft-aligned-questions'

   export const ASSESSMENT_STANDARDS: AssessmentStandard[] = [
     {
       slug: "managed-environments",
       name: "Managed Environments Assessment",
       weight: 25,
       description: "...",
       questions: microsoftAlignedQuestions.managedEnvironments
     },
     {
       slug: "coe-implementation",
       name: "Center of Excellence Implementation",
       weight: 25,
       description: "...",
       questions: microsoftAlignedQuestions.coeImplementation
     },
     // ... map all categories
   ]
   ```

4. **Add governance standards from our integration**
   ```typescript
   import { workbookAssessmentStandard } from "./governance/integration/governance-workbook-questions"
   import { strategyAssessmentStandard } from "./governance/integration/environmental-strategy-questions"

   export const ASSESSMENT_STANDARDS: AssessmentStandard[] = [
     // Microsoft-aligned standards
     ...microsoftAlignedStandards,

     // Governance standards (January 2026)
     workbookAssessmentStandard,
     strategyAssessmentStandard,
   ]
   ```

5. **Update types.ts with new fields**

6. **Test in UI** - Verify questions display correctly

---

## 📋 Phase 2: Testing Framework (Priority 1)

### Step 2.1: Install Vitest

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom happy-dom
```

### Step 2.2: Configure Vitest

**Create `vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Create `vitest.setup.ts`:**
```typescript
import '@testing-library/jest-dom'
```

**Update `package.json`:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Step 2.3: Create Core Tests

**Priority Test Files:**

1. **`lib/__tests__/constants.test.ts`** - Validate question structure
```typescript
import { describe, it, expect } from 'vitest'
import { ASSESSMENT_STANDARDS } from '../constants'

describe('Assessment Standards', () => {
  it('should have valid structure', () => {
    expect(ASSESSMENT_STANDARDS).toBeDefined()
    expect(ASSESSMENT_STANDARDS.length).toBeGreaterThan(0)
  })

  it('each standard should have required fields', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      expect(standard).toHaveProperty('slug')
      expect(standard).toHaveProperty('name')
      expect(standard).toHaveProperty('weight')
      expect(standard).toHaveProperty('questions')
      expect(standard.questions.length).toBeGreaterThan(0)
    })
  })

  it('all questions should have unique IDs', () => {
    const allIds = ASSESSMENT_STANDARDS.flatMap(s =>
      s.questions.map(q => q.id)
    )
    const uniqueIds = new Set(allIds)
    expect(uniqueIds.size).toBe(allIds.length)
  })

  it('all weights should be positive numbers', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      expect(standard.weight).toBeGreaterThan(0)
      standard.questions.forEach(question => {
        expect(question.weight).toBeGreaterThan(0)
      })
    })
  })
})
```

2. **`store/__tests__/assessment-store.test.ts`** - Test scoring logic
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useAssessmentStore } from '../assessment-store'

describe('Assessment Store - Scoring Logic', () => {
  beforeEach(() => {
    const store = useAssessmentStore.getState()
    store.clearAllProjects()
  })

  it('should calculate correct total score', () => {
    const store = useAssessmentStore.getState()

    store.createProject({
      name: 'Test Project',
      description: 'Test',
      createdAt: Date.now(),
    })

    // Add test answers and verify scoring
    // ...
  })

  it('should calculate RAG status correctly', () => {
    // Test RED threshold
    // Test AMBER threshold
    // Test GREEN threshold
  })

  it('should handle missing answers gracefully', () => {
    // Ensure partial assessments don't break scoring
  })
})
```

3. **`lib/__tests__/date-formatter.test.ts`** - Test our new utility
```typescript
import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getUserTimezone
} from '../date-formatter'

describe('Date Formatter', () => {
  it('should format dates correctly', () => {
    const date = new Date('2026-01-19T14:30:00Z')
    const formatted = formatDate(date)
    expect(formatted).toBeDefined()
    expect(typeof formatted).toBe('string')
  })

  it('should detect user timezone', () => {
    const timezone = getUserTimezone()
    expect(timezone).toBeDefined()
    expect(typeof timezone).toBe('string')
  })

  it('should format relative time correctly', () => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const relative = formatRelativeTime(twoHoursAgo)
    expect(relative).toContain('hour')
  })
})
```

4. **`lib/governance/integration/__tests__/governance-questions.test.ts`**
```typescript
import { describe, it, expect } from 'vitest'
import {
  workbookAssessmentStandard,
  workbookTenantQuestions
} from '../governance-workbook-questions'

describe('Governance Workbook Questions', () => {
  it('should have valid assessment standard', () => {
    expect(workbookAssessmentStandard.slug).toBe('implementation-workbook-compliance')
    expect(workbookAssessmentStandard.weight).toBe(20)
    expect(workbookAssessmentStandard.questions.length).toBeGreaterThan(0)
  })

  it('all questions should have Microsoft Learn references', () => {
    const questionsWithRefs = workbookTenantQuestions.filter(q => q.references)
    expect(questionsWithRefs.length).toBeGreaterThan(0)
  })
})
```

### Step 2.4: Coverage Targets

- **Minimum:** 60% code coverage
- **Target:** 80% code coverage
- **Focus Areas:**
  - Scoring algorithms (100% coverage)
  - Data validation (100% coverage)
  - Utility functions (90% coverage)

---

## 📋 Phase 3: Cleanup (Priority 2)

### Step 3.1: Remove Experimental Artifacts

**Files to Delete:**
```bash
rm -rf app/google-drive-test/
```

**Files to Review for Cleanup:**
- Any `.backup` or `.old` files
- Unused demo pages (keep only if documented)
- Duplicate type definitions

### Step 3.2: Organize File Structure

**Proposed Structure:**
```
lib/
├── __tests__/           # Unit tests
├── governance/
│   ├── integration/
│   │   ├── __tests__/  # Governance tests
│   │   └── ...
├── constants.ts         # NEW: Uses microsoft-aligned-questions
├── microsoft-aligned-questions.ts  # Keep as source
├── types.ts            # UPDATED: Include new fields
├── date-formatter.ts
└── ...
```

---

## 📋 Phase 4: Integration Validation (Priority 2)

### Step 4.1: Test New Constants with Governance

1. **Verify imports work**
   ```typescript
   // In constants.ts
   import { microsoftAlignedQuestions } from './microsoft-aligned-questions'
   import { workbookAssessmentStandard } from './governance/integration/...'

   // Should compile without errors
   ```

2. **Test in UI**
   - Start dev server
   - Create new assessment
   - Verify all standards appear
   - Complete sample questions
   - Verify scoring works

3. **Test exports**
   - Export to Excel
   - Export to Word
   - Export to JSON
   - Verify all new fields included

### Step 4.2: Update Store Logic (if needed)

If `assessment-store.ts` has hardcoded expectations about question structure, update to handle new optional fields.

---

## 📋 Phase 5: Documentation Updates (Priority 3)

### Step 5.1: Update IMPLEMENTATION_TRACKING.md

Add section:
```markdown
## 🔄 Refactoring (2026-01-19)

### Data Migration
- ✅ Migrated to microsoft-aligned-questions.ts as primary source
- ✅ Added aiSuggestion, tags, required fields to Question type
- ✅ Integrated governance standards with Microsoft-aligned content

### Testing Framework
- ✅ Implemented Vitest with comprehensive test suite
- ✅ Achieved XX% code coverage
- ✅ Added automated testing to CI/CD pipeline

### Cleanup
- ✅ Removed google-drive-test experimental folder
- ✅ Organized test structure
- ✅ Updated all documentation
```

### Step 5.2: Create TESTING.md

Document:
- How to run tests (`npm test`)
- How to view coverage (`npm run test:coverage`)
- How to add new tests
- Testing best practices

---

## 🎯 Success Criteria

### Must Have (Blocking)
- [ ] All questions from microsoft-aligned-questions.ts integrated into constants.ts
- [ ] Vitest installed and configured
- [ ] At least 10 unit tests passing
- [ ] google-drive-test folder removed
- [ ] Application builds without errors
- [ ] Governance modules still work

### Should Have (Important)
- [ ] 60%+ code coverage
- [ ] All scoring logic tested
- [ ] Date formatter tested
- [ ] Documentation updated

### Nice to Have (Optional)
- [ ] 80%+ code coverage
- [ ] Integration tests for full assessment flow
- [ ] E2E tests with Playwright

---

## ⚠️ Risk Mitigation

### Risk 1: Breaking Changes from Migration
**Mitigation:**
- Keep constants.ts.backup
- Test thoroughly in dev before committing
- Use feature flag if needed for gradual rollout

### Risk 2: Type Conflicts
**Mitigation:**
- Update types.ts FIRST
- Make all new fields optional
- Add TypeScript checks to tests

### Risk 3: Store Logic Breaks
**Mitigation:**
- Write store tests BEFORE migration
- Test scoring logic independently
- Have rollback plan ready

---

## 📅 Implementation Timeline

### Day 1 (Today)
- [ ] Phase 1: Data Migration (2-3 hours)
- [ ] Phase 2: Testing Setup (1-2 hours)

### Day 2
- [ ] Phase 2: Write Tests (2-3 hours)
- [ ] Phase 3: Cleanup (30 min)
- [ ] Phase 4: Validation (1 hour)

### Day 3
- [ ] Phase 5: Documentation (1 hour)
- [ ] Final testing and commit
- [ ] Update Pull Request

---

## 🚀 Execution Order

1. **Create branch:** `git checkout -b refactor/microsoft-aligned-migration`
2. **Backup:** `cp lib/constants.ts lib/constants.ts.backup`
3. **Update types.ts** with new fields
4. **Install Vitest** and configure
5. **Write baseline tests** (to catch regressions)
6. **Migrate constants.ts** to use microsoft-aligned-questions
7. **Run tests** - fix any breaks
8. **Add comprehensive tests**
9. **Remove experimental code**
10. **Update documentation**
11. **Commit and merge**

---

**Status:** 📋 Plan Ready
**Next Step:** Begin Phase 1 - Data Migration
**Assigned To:** Development Team
**Review By:** Technical Lead

---

*This refactoring addresses critical technical debt identified in EXPERT_REVIEW.md and positions the Assessment Suite for enterprise deployment.*
