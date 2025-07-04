// Safe JSON parsing and stringifying utilities
export function safeJsonParse<T>(str: string, fallback: T): T {
  if (!str || typeof str !== 'string') {
    return fallback
  }
  
  try {
    // Remove any BOM or weird characters
    const cleanStr = str.trim().replace(/^\uFEFF/, '')
    
    // Check if it's valid JSON structure
    if (!cleanStr.startsWith('{') && !cleanStr.startsWith('[')) {
      console.warn('Invalid JSON structure:', cleanStr.substring(0, 50))
      return fallback
    }
    
    return JSON.parse(cleanStr)
  } catch (error) {
    console.error('JSON parse error:', error)
    console.error('Failed to parse:', str.substring(0, 100))
    return fallback
  }
}

export function safeJsonStringify(obj: any): string {
  try {
    // Handle Date objects
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      // Handle undefined values
      if (value === undefined) {
        return null
      }
      // Handle functions
      if (typeof value === 'function') {
        return null
      }
      return value
    })
  } catch (error) {
    console.error('JSON stringify error:', error)
    return '{}'
  }
}