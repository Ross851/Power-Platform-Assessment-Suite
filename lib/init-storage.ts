// Initialize and validate storage on app startup

export function initializeStorage() {
  if (typeof window === 'undefined') return

  try {
    // Check for corrupted localStorage data
    const storageKey = 'assessment-store'
    const data = localStorage.getItem(storageKey)
    
    if (data) {
      // Try to parse the data
      try {
        const parsed = JSON.parse(data)
        
        // Validate basic structure
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid storage structure')
        }
        
        // Check if it's the zustand format
        if (parsed.state && typeof parsed.state === 'object') {
          // Valid zustand format, check for projects array
          if (!Array.isArray(parsed.state.projects)) {
            parsed.state.projects = []
          }
          if (typeof parsed.state.activeProjectName !== 'string' && parsed.state.activeProjectName !== null) {
            parsed.state.activeProjectName = null
          }
          
          // Re-save the cleaned data
          localStorage.setItem(storageKey, JSON.stringify(parsed))
        }
      } catch (error) {
        console.error('Storage validation failed, clearing corrupted data:', error)
        localStorage.removeItem(storageKey)
        
        // Also clear any other potentially corrupted keys
        const keysToCheck = ['h1-check', 'theme', 'google-drive-auth']
        keysToCheck.forEach(key => {
          try {
            const value = localStorage.getItem(key)
            if (value) {
              JSON.parse(value) // This will throw if invalid
            }
          } catch {
            localStorage.removeItem(key)
          }
        })
      }
    }
  } catch (error) {
    console.error('Storage initialization error:', error)
  }
}

// Run on module load
initializeStorage()