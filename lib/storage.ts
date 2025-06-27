import type { Project } from "./types"

// Enhanced storage utilities for desktop/local use
export class AssessmentStorage {
  private static STORAGE_KEY = "power-platform-assessments"
  private static BACKUP_KEY = "power-platform-assessments-backup"
  private static VERSION = "1.0.0"

  // Save assessment data with automatic backup
  static saveAssessment(projects: Project[]): void {
    try {
      // Create backup of previous data
      const currentData = localStorage.getItem(this.STORAGE_KEY)
      if (currentData) {
        localStorage.setItem(this.BACKUP_KEY, currentData)
      }

      // Save new data with metadata
      const dataToSave = {
        version: this.VERSION,
        lastSaved: new Date().toISOString(),
        projects: projects,
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error("Failed to save assessment data:", error)
      throw new Error("Unable to save assessment data. Please check your browser storage settings.")
    }
  }

  // Load assessment data with migration support
  static loadAssessment(): Project[] {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY)
      if (!savedData) return []

      const parsed = JSON.parse(savedData)
      
      // Handle version migrations if needed
      if (parsed.version !== this.VERSION) {
        // Future migration logic here
      }

      return parsed.projects || []
    } catch (error) {
      console.error("Failed to load assessment data:", error)
      // Try to restore from backup
      return this.restoreFromBackup()
    }
  }

  // Restore from backup
  static restoreFromBackup(): Project[] {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY)
      if (!backupData) return []

      const parsed = JSON.parse(backupData)
      return parsed.projects || []
    } catch (error) {
      console.error("Failed to restore from backup:", error)
      return []
    }
  }

  // Export all data as JSON file
  static exportToFile(projects: Project[]): void {
    const dataToExport = {
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      projects: projects,
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `PowerPlatform-Assessment-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import data from file
  static async importFromFile(file: File): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const parsed = JSON.parse(content)
          
          if (!parsed.projects || !Array.isArray(parsed.projects)) {
            throw new Error("Invalid file format")
          }

          // Validate and migrate if needed
          const projects = parsed.projects.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            lastModifiedAt: new Date(p.lastModifiedAt),
          }))

          resolve(projects)
        } catch (error) {
          reject(new Error("Failed to import file. Please ensure it's a valid assessment export."))
        }
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  // Clear all data (with confirmation)
  static clearAllData(): void {
    if (confirm("Are you sure you want to clear all assessment data? This cannot be undone.")) {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.BACKUP_KEY)
    }
  }

  // Get storage size info
  static getStorageInfo(): { used: number; available: number } {
    const used = new Blob([localStorage.getItem(this.STORAGE_KEY) || ""]).size
    // Estimate available (5MB typical localStorage limit)
    const available = 5 * 1024 * 1024 - used
    
    return { used, available }
  }
} 