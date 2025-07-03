// Safe storage utilities to handle SSR and localStorage errors

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('localStorage.getItem error:', error)
      return null
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.warn('localStorage.setItem error:', error)
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('localStorage.removeItem error:', error)
    }
  }
}

export const safeJsonParse = <T>(str: string | null, fallback: T): T => {
  if (!str) return fallback
  
  // Check if string is actually valid JSON-like
  const trimmed = str.trim()
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return fallback
  }
  
  // Check for common corrupted patterns
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
    console.warn('Invalid JSON format detected:', trimmed.substring(0, 50))
    return fallback
  }
  
  try {
    return JSON.parse(str)
  } catch (error) {
    console.warn('JSON parse error:', error)
    // Try to clear corrupted data
    if (typeof window !== 'undefined' && str.includes('assessment-store')) {
      try {
        localStorage.removeItem('assessment-store')
      } catch {}
    }
    return fallback
  }
}

export const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    console.warn('JSON stringify error:', error)
    return '{}'
  }
}