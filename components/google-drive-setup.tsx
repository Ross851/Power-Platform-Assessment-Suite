"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Cloud, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Download, 
  RefreshCw,
  Settings,
  Shield,
  Clock
} from "lucide-react"
import { GoogleDriveStorage } from "@/lib/google-drive"
import { useAssessmentStore } from "@/store/assessment-store"
import { useToast } from "@/hooks/use-toast"

export function GoogleDriveSetup() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [files, setFiles] = useState<any[]>([])
  const [showSetup, setShowSetup] = useState(false)

  const { projects } = useAssessmentStore()
  const { toast } = useToast()

  useEffect(() => {
    initializeGoogleDrive()
  }, [])

  const initializeGoogleDrive = async () => {
    setIsLoading(true)
    try {
      const initialized = await GoogleDriveStorage.initialize()
      setIsInitialized(initialized)
      
      if (initialized) {
        const status = GoogleDriveStorage.getSyncStatus()
        setIsSignedIn(status.isSignedIn)
        setLastSync(status.lastSync || null)
        
        if (status.isSignedIn) {
          await loadFileList()
        }
      }
    } catch (error) {
      console.error("Failed to initialize Google Drive:", error)
      toast({
        title: "Setup Error",
        description: "Failed to initialize Google Drive. Please check your internet connection.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const success = await GoogleDriveStorage.signIn()
      setIsSignedIn(success)
      
      if (success) {
        toast({
          title: "Success",
          description: "Successfully signed in to Google Drive!",
        })
        await loadFileList()
        await autoSync()
      } else {
        toast({
          title: "Sign In Failed",
          description: "Failed to sign in to Google Drive. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Sign in failed:", error)
      toast({
        title: "Sign In Error",
        description: "An error occurred during sign in. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await GoogleDriveStorage.signOut()
      setIsSignedIn(false)
      setFiles([])
      setLastSync(null)
      
      toast({
        title: "Signed Out",
        description: "Successfully signed out from Google Drive.",
      })
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFileList = async () => {
    try {
      const fileList = await GoogleDriveStorage.listAssessmentFiles()
      setFiles(fileList)
    } catch (error) {
      console.error("Failed to load file list:", error)
    }
  }

  const autoSync = async () => {
    try {
      await GoogleDriveStorage.autoSync(projects)
      const now = new Date().toISOString()
      localStorage.setItem("last-google-drive-sync", now)
      setLastSync(now)
      
      toast({
        title: "Sync Complete",
        description: "Your assessment data has been synced to Google Drive.",
      })
    } catch (error) {
      console.error("Auto-sync failed:", error)
      toast({
        title: "Sync Failed",
        description: "Failed to sync to Google Drive. Your data is still saved locally.",
        variant: "destructive"
      })
    }
  }

  const uploadToDrive = async () => {
    setIsLoading(true)
    try {
      await GoogleDriveStorage.saveToDrive(projects)
      const now = new Date().toISOString()
      localStorage.setItem("last-google-drive-sync", now)
      setLastSync(now)
      
      toast({
        title: "Upload Complete",
        description: "Assessment data uploaded to Google Drive successfully.",
      })
      
      await loadFileList()
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload to Google Drive. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadFromDrive = async () => {
    setIsLoading(true)
    try {
      const driveProjects = await GoogleDriveStorage.loadFromDrive()
      
      // This would need to be implemented in the store to merge projects
      toast({
        title: "Download Complete",
        description: `Downloaded ${driveProjects.length} projects from Google Drive.`,
      })
    } catch (error) {
      console.error("Download failed:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download from Google Drive. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!showSetup) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Google Drive Sync
          </CardTitle>
          <CardDescription>
            Automatically save your assessment data to Google Drive for backup and access from anywhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSignedIn ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Connected to Google Drive</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Not connected</span>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Google Drive Setup
        </CardTitle>
        <CardDescription>
          Connect your Google account to automatically sync assessment data to Google Drive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <div className="flex items-center gap-2">
            {isInitialized ? (
              <Badge variant="secondary">Ready</Badge>
            ) : (
              <Badge variant="destructive">Not Ready</Badge>
            )}
            {isSignedIn ? (
              <Badge variant="default">Connected</Badge>
            ) : (
              <Badge variant="outline">Not Connected</Badge>
            )}
          </div>
        </div>

        {/* Last Sync */}
        {lastSync && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Last Sync</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(lastSync).toLocaleString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {!isSignedIn ? (
            <Button
              onClick={handleSignIn}
              disabled={!isInitialized || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Cloud className="h-4 w-4 mr-2" />
              )}
              Sign in to Google Drive
            </Button>
          ) : (
            <>
              <Button
                onClick={uploadToDrive}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload to Drive
              </Button>
              <Button
                onClick={downloadFromDrive}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download from Drive
              </Button>
              <Button
                onClick={handleSignOut}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                Sign Out
              </Button>
            </>
          )}
        </div>

        {/* File List */}
        {isSignedIn && files.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Assessment Files in Drive</h4>
              <div className="space-y-2">
                {files.slice(0, 5).map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                  >
                    <span className="truncate">{file.name}</span>
                    <span className="text-muted-foreground">
                      {new Date(file.modifiedTime).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {files.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{files.length - 5} more files
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Setup Instructions */}
        {!isInitialized && (
          <Alert>
            <AlertDescription>
              <p className="mb-2">
                To use Google Drive sync, you need to set up Google API credentials:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>Create a new project or select existing one</li>
                <li>Enable Google Drive API</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add your domain to authorized origins</li>
                <li>Set environment variables in your .env.local file</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setShowSetup(false)}
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 