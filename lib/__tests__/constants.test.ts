import { describe, it, expect } from 'vitest'
import { ASSESSMENT_STANDARDS, QUESTION_TYPES } from '../constants'

describe('Assessment Standards', () => {
  it('should have valid structure', () => {
    expect(ASSESSMENT_STANDARDS).toBeDefined()
    expect(Array.isArray(ASSESSMENT_STANDARDS)).toBe(true)
    expect(ASSESSMENT_STANDARDS.length).toBeGreaterThan(0)
  })

  it('each standard should have required fields', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      expect(standard).toHaveProperty('slug')
      expect(standard).toHaveProperty('name')
      expect(standard).toHaveProperty('weight')
      expect(standard).toHaveProperty('description')
      expect(standard).toHaveProperty('questions')

      // Validate types
      expect(typeof standard.slug).toBe('string')
      expect(typeof standard.name).toBe('string')
      expect(typeof standard.weight).toBe('number')
      expect(typeof standard.description).toBe('string')
      expect(Array.isArray(standard.questions)).toBe(true)
      expect(standard.questions.length).toBeGreaterThan(0)
    })
  })

  it('all question IDs should be unique across all standards', () => {
    const allIds = ASSESSMENT_STANDARDS.flatMap(s =>
      s.questions.map(q => q.id)
    )
    const uniqueIds = new Set(allIds)

    if (uniqueIds.size !== allIds.length) {
      const duplicates = allIds.filter((id, index) =>
        allIds.indexOf(id) !== index
      )
      console.error('Duplicate question IDs found:', duplicates)
    }

    expect(uniqueIds.size).toBe(allIds.length)
  })

  it('all weights should be positive numbers', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      expect(standard.weight).toBeGreaterThan(0)
      expect(standard.weight).toBeLessThanOrEqual(100)

      standard.questions.forEach(question => {
        expect(question.weight).toBeGreaterThan(0)
        expect(question.weight).toBeLessThanOrEqual(10)
      })
    })
  })

  it('all questions should have valid types', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      standard.questions.forEach(question => {
        expect(QUESTION_TYPES).toContain(question.type)
      })
    })
  })

  it('scale questions should have options', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      standard.questions.forEach(question => {
        if (question.type === 'scale') {
          expect(question.options).toBeDefined()
          expect(Array.isArray(question.options)).toBe(true)
          expect(question.options!.length).toBeGreaterThan(0)
        }
      })
    })
  })

  it('governance standards should be included', () => {
    const governanceSlugs = [
      'implementation-workbook-compliance',
      'environmental-strategy-alignment'
    ]

    governanceSlugs.forEach(slug => {
      const found = ASSESSMENT_STANDARDS.find(s => s.slug === slug)
      expect(found).toBeDefined()
      expect(found?.questions.length).toBeGreaterThan(0)
    })
  })

  it('governance questions should have Microsoft Learn references', () => {
    const workbookStandard = ASSESSMENT_STANDARDS.find(
      s => s.slug === 'implementation-workbook-compliance'
    )

    expect(workbookStandard).toBeDefined()

    const questionsWithRefs = workbookStandard!.questions.filter(
      q => q.references && q.references.length > 0
    )

    expect(questionsWithRefs.length).toBeGreaterThan(0)

    questionsWithRefs.forEach(question => {
      question.references!.forEach(ref => {
        expect(ref).toHaveProperty('title')
        expect(ref).toHaveProperty('url')
        expect(ref.url).toMatch(/^https?:\/\//)
      })
    })
  })

  it('all categories should be non-empty strings', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      standard.questions.forEach(question => {
        expect(typeof question.category).toBe('string')
        expect(question.category.length).toBeGreaterThan(0)
      })
    })
  })

  it('importance levels should be between 1 and 5', () => {
    ASSESSMENT_STANDARDS.forEach(standard => {
      standard.questions.forEach(question => {
        if (question.importance) {
          expect(question.importance).toBeGreaterThanOrEqual(1)
          expect(question.importance).toBeLessThanOrEqual(5)
        }
      })
    })
  })
})

describe('Question Types', () => {
  it('should have all expected question types', () => {
    const expectedTypes = [
      'boolean',
      'scale',
      'percentage',
      'text',
      'numeric',
      'multi-select',
      'file-upload',
      'document-review'
    ]

    expectedTypes.forEach(type => {
      expect(QUESTION_TYPES).toContain(type)
    })
  })

  it('should not have duplicates', () => {
    const uniqueTypes = new Set(QUESTION_TYPES)
    expect(uniqueTypes.size).toBe(QUESTION_TYPES.length)
  })
})
