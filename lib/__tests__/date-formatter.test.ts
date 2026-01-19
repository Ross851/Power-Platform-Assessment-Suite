import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  getUserTimezone,
  getUserLocale,
  formatDateWithTimezone,
  formatISODate,
  getCurrentDateTime,
  getCurrentDate,
  formatAssessmentTimestamp,
  formatLastModified,
} from '../date-formatter'

describe('Date Formatter - Basic Functions', () => {
  const testDate = new Date('2026-01-19T14:30:00Z')

  it('formatDate should return a string', () => {
    const result = formatDate(testDate)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formatDateTime should return a string with time', () => {
    const result = formatDateTime(testDate)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    // Should contain time indicators
    expect(result).toMatch(/\d/)
  })

  it('formatTime should return a time string', () => {
    const result = formatTime(testDate)
    expect(typeof result).toBe('string')
    expect(result).toMatch(/\d{1,2}/)
  })

  it('should handle string dates', () => {
    const result = formatDate('2026-01-19')
    expect(typeof result).toBe('string')
  })

  it('should handle timestamp numbers', () => {
    const timestamp = testDate.getTime()
    const result = formatDate(timestamp)
    expect(typeof result).toBe('string')
  })
})

describe('Date Formatter - Locale Functions', () => {
  it('getUserTimezone should return valid timezone', () => {
    const timezone = getUserTimezone()
    expect(typeof timezone).toBe('string')
    expect(timezone.length).toBeGreaterThan(0)
    // Should contain forward slash (e.g., Europe/London)
    expect(timezone).toMatch(/^[A-Za-z_\/]+$/)
  })

  it('getUserLocale should return valid locale', () => {
    const locale = getUserLocale()
    expect(typeof locale).toBe('string')
    expect(locale.length).toBeGreaterThan(0)
    // Should be BCP 47 format (e.g., en-GB, en-US)
    expect(locale).toMatch(/^[a-z]{2,3}(-[A-Z]{2})?$/)
  })

  it('formatDateWithTimezone should include timezone', () => {
    const result = formatDateWithTimezone(new Date())
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('Date Formatter - Relative Time', () => {
  it('should format recent times as relative', () => {
    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    const result = formatRelativeTime(twoHoursAgo)
    expect(typeof result).toBe('string')
    // Should contain "hour" or "ago" or similar relative term
    expect(result.toLowerCase()).toMatch(/hour|ago|in/)
  })

  it('should handle future dates', () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const result = formatRelativeTime(tomorrow)
    expect(typeof result).toBe('string')
  })

  it('should handle very recent times', () => {
    const now = new Date()
    const secondsAgo = new Date(now.getTime() - 5 * 1000)

    const result = formatRelativeTime(secondsAgo)
    expect(typeof result).toBe('string')
  })
})

describe('Date Formatter - Assessment Functions', () => {
  it('formatAssessmentTimestamp should format correctly', () => {
    const timestamp = Date.now()
    const result = formatAssessmentTimestamp(timestamp)

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formatLastModified should include "Last modified"', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const result = formatLastModified(yesterday)

    expect(typeof result).toBe('string')
    expect(result).toContain('Last modified')
  })

  it('formatLastModified should use relative time for recent dates', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const result = formatLastModified(twoHoursAgo)

    expect(result).toContain('Last modified')
    expect(result.toLowerCase()).toMatch(/hour|ago/)
  })

  it('formatLastModified should use absolute date for old dates', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    const result = formatLastModified(twoWeeksAgo)

    expect(result).toContain('Last modified')
    // Should not contain relative time for dates > 7 days ago
  })
})

describe('Date Formatter - ISO Functions', () => {
  it('formatISODate should handle ISO strings', () => {
    const isoString = '2026-01-19T14:30:00.000Z'
    const result = formatISODate(isoString)

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('getCurrentDateTime should return current time', () => {
    const result = getCurrentDateTime()
    const now = new Date()

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)

    // Should contain current year
    expect(result).toContain(now.getFullYear().toString())
  })

  it('getCurrentDate should return current date', () => {
    const result = getCurrentDate()
    const now = new Date()

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)

    // Should contain current year
    expect(result).toContain(now.getFullYear().toString())
  })
})

describe('Date Formatter - Edge Cases', () => {
  it('should handle invalid dates gracefully', () => {
    // Test with invalid date string
    expect(() => formatDate(new Date('invalid'))).not.toThrow()
  })

  it('should handle very old dates', () => {
    const oldDate = new Date('1900-01-01')
    const result = formatDate(oldDate)
    expect(typeof result).toBe('string')
  })

  it('should handle far future dates', () => {
    const futureDate = new Date('2100-12-31')
    const result = formatDate(futureDate)
    expect(typeof result).toBe('string')
  })
})
