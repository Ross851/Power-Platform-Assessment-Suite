// Google Drive Integration for Power Platform Assessment Suite
// This module provides optional cloud storage functionality
// It's designed to be completely safe and non-destructive to existing data

interface GoogleDriveFile {
  id: string
  name: string
  createdTime: string
  modifiedTime: string
  size?: string
}

interface SyncStatus {
  isSignedIn: boolean
  lastSync: string | null
  isEnabled: boolean
}

class GoogleDriveStorage {
  private static isInitialized = false
  private static gapi: any = null
  private static CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
  private static API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''
  private static DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  private static SCOPES = 'https://www.googleapis.com/auth/drive.file'

  static async initialize(): Promise<boolean> {
    if (this.isInitialized) return true

    try {
      // Load Google API client library
      await this.loadGoogleAPI()
      
      // Initialize the API client
      await new Promise<void>((resolve, reject) => {
        this.gapi.load('client:auth2', async () => {
          try {
            await this.gapi.client.init({
              apiKey: this.API_KEY,
              clientId: this.CLIENT_ID,
              discoveryDocs: this.DISCOVERY_DOCS,
              scope: this.SCOPES
            })
            this.isInitialized = true
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      })

      return true
    } catch (error) {
      console.error('Failed to initialize Google Drive:', error)
      return false
    }
  }

  private static loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Google Drive API only works in browser environment'))
        return
      }

      // Check if GAPI is already loaded
      if (window.gapi) {
        this.gapi = window.gapi
        resolve()
        return
      }

      // Load Google API script
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => {
        this.gapi = window.gapi
        resolve()
      }
      script.onerror = () => reject(new Error('Failed to load Google API'))
      document.head.appendChild(script)
    })
  }

  static async signIn(): Promise<boolean> {
    if (!this.isInitialized) {
      const initialized = await this.initialize()
      if (!initialized) return false
    }

    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      const user = await authInstance.signIn()
      return user.isSignedIn()
    } catch (error) {
      console.error('Sign in failed:', error)
      return false
    }
  }

  static async signOut(): Promise<void> {
    if (!this.isInitialized) return

    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      await authInstance.signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  static getSyncStatus(): SyncStatus {
    const lastSync = localStorage.getItem('last-google-drive-sync')
    const isEnabled = localStorage.getItem('google-drive-enabled') === 'true'
    
    return {
      isSignedIn: this.isInitialized && this.gapi?.auth2?.getAuthInstance()?.isSignedIn?.get() || false,
      lastSync,
      isEnabled
    }
  }

  static async saveToDrive(data: any): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Google Drive not initialized')
    }

    try {
      const fileName = `power-platform-assessment-${new Date().toISOString().split('T')[0]}.json`
      const fileContent = JSON.stringify(data, null, 2)
      
      // Check if file already exists
      const existingFiles = await this.listAssessmentFiles()
      const existingFile = existingFiles.find(f => f.name === fileName)
      
      let fileId: string
      
      if (existingFile) {
        // Update existing file
        await this.gapi.client.drive.files.update({
          fileId: existingFile.id,
          media: {
            mimeType: 'application/json',
            body: fileContent
          }
        })
        fileId = existingFile.id
      } else {
        // Create new file
        const response = await this.gapi.client.drive.files.create({
          resource: {
            name: fileName,
            mimeType: 'application/json'
          },
          media: {
            mimeType: 'application/json',
            body: fileContent
          }
        })
        fileId = response.result.id
      }

      return fileId
    } catch (error) {
      console.error('Save to drive failed:', error)
      throw error
    }
  }

  static async loadFromDrive(): Promise<any[]> {
    if (!this.isInitialized) {
      throw new Error('Google Drive not initialized')
    }

    try {
      const files = await this.listAssessmentFiles()
      const projects: any[] = []

      for (const file of files) {
        try {
          const response = await this.gapi.client.drive.files.get({
            fileId: file.id,
            alt: 'media'
          })
          
          const fileData = JSON.parse(response.body)
          if (fileData.projects) {
            projects.push(...fileData.projects)
          }
        } catch (error) {
          console.error(`Failed to load file ${file.name}:`, error)
        }
      }

      return projects
    } catch (error) {
      console.error('Load from drive failed:', error)
      throw error
    }
  }

  static async listAssessmentFiles(): Promise<GoogleDriveFile[]> {
    if (!this.isInitialized) {
      return []
    }

    try {
      const response = await this.gapi.client.drive.files.list({
        pageSize: 50,
        fields: 'files(id,name,createdTime,modifiedTime,size)',
        q: "name contains 'power-platform-assessment' and mimeType='application/json'"
      })

      return response.result.files || []
    } catch (error) {
      console.error('List files failed:', error)
      return []
    }
  }

  static async autoSync(data: any): Promise<void> {
    const status = this.getSyncStatus()
    if (!status.isEnabled) return

    try {
      await this.saveToDrive(data)
      const now = new Date().toISOString()
      localStorage.setItem('last-google-drive-sync', now)
    } catch (error) {
      console.error('Auto-sync failed:', error)
      // Don't throw - auto-sync failures shouldn't break the app
    }
  }

  static enableAutoSync(): void {
    localStorage.setItem('google-drive-enabled', 'true')
  }

  static disableAutoSync(): void {
    localStorage.setItem('google-drive-enabled', 'false')
  }

  static async deleteFile(fileId: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Google Drive not initialized')
    }

    try {
      await this.gapi.client.drive.files.delete({
        fileId
      })
    } catch (error) {
      console.error('Delete file failed:', error)
      throw error
    }
  }
}

// Declare global gapi for TypeScript
declare global {
  interface Window {
    gapi: any
  }
}

export { GoogleDriveStorage, type GoogleDriveFile, type SyncStatus } 