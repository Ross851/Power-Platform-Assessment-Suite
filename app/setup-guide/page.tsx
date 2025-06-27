"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, GitBranch, Globe, Play, Settings, Terminal, Zap } from "lucide-react"
import Link from "next/link"

export default function SetupGuidePage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground min-h-screen">
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">🚀 Setup Guide</h1>
        <p className="text-muted-foreground text-lg">
          Complete idiot's guide to run this app on any computer
        </p>
      </header>

      <div className="grid gap-8">
        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Start (5 minutes)
            </CardTitle>
            <CardDescription>
              The fastest way to get this app running on any computer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Install Node.js</h4>
                <p className="text-sm text-muted-foreground">
                  Download and install Node.js from nodejs.org
                </p>
                <Button asChild size="sm" className="w-full">
                  <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download Node.js
                  </a>
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">2. Install Git</h4>
                <p className="text-sm text-muted-foreground">
                  Download and install Git from git-scm.com
                </p>
                <Button asChild size="sm" className="w-full">
                  <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer">
                    <GitBranch className="mr-2 h-4 w-4" />
                    Download Git
                  </a>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">3. Clone & Run</h4>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div className="text-green-600"># Clone the repository</div>
                <div>git clone https://github.com/Ross851/Power-Platform-Assessment-Suite.git</div>
                <div className="text-green-600 mt-2"># Go to the folder</div>
                <div>cd Power-Platform-Assessment-Suite</div>
                <div className="text-green-600 mt-2"># Install dependencies</div>
                <div>npm install</div>
                <div className="text-green-600 mt-2"># Start the app</div>
                <div>npm run dev</div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm">
                <strong>🎉 That's it!</strong> Open your browser and go to{" "}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">http://localhost:3000</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Detailed Setup Instructions
            </CardTitle>
            <CardDescription>
              Step-by-step guide with screenshots and troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Step 1</Badge>
                <h3 className="font-semibold">Install Node.js</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>1. Go to <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nodejs.org</a></p>
                <p>2. Click the big green "LTS" button to download</p>
                <p>3. Run the installer and follow the prompts</p>
                <p>4. Open Command Prompt/Terminal and type: <code className="bg-muted px-1 rounded">node --version</code></p>
                <p>5. You should see something like "v18.17.0"</p>
              </div>
            </div>

            <Separator />

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Step 2</Badge>
                <h3 className="font-semibold">Install Git</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>1. Go to <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">git-scm.com</a></p>
                <p>2. Click "Download for Windows" (or your OS)</p>
                <p>3. Run the installer with default settings</p>
                <p>4. Open Command Prompt/Terminal and type: <code className="bg-muted px-1 rounded">git --version</code></p>
                <p>5. You should see something like "git version 2.40.0"</p>
              </div>
            </div>

            <Separator />

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Step 3</Badge>
                <h3 className="font-semibold">Download the App</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>1. Open Command Prompt/Terminal</p>
                <p>2. Navigate to where you want the app (e.g., Desktop):</p>
                <div className="bg-muted p-2 rounded font-mono text-xs">
                  cd Desktop
                </div>
                <p>3. Copy and paste this command:</p>
                <div className="bg-muted p-2 rounded font-mono text-xs">
                  git clone https://github.com/Ross851/Power-Platform-Assessment-Suite.git
                </div>
                <p>4. Wait for it to finish downloading</p>
              </div>
            </div>

            <Separator />

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Step 4</Badge>
                <h3 className="font-semibold">Install Dependencies</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>1. Go into the app folder:</p>
                <div className="bg-muted p-2 rounded font-mono text-xs">
                  cd Power-Platform-Assessment-Suite
                </div>
                <p>2. Install the required packages:</p>
                <div className="bg-muted p-2 rounded font-mono text-xs">
                  npm install
                </div>
                <p>3. Wait for it to finish (this might take a few minutes)</p>
                <p>4. You'll see a lot of text scrolling - that's normal!</p>
              </div>
            </div>

            <Separator />

            {/* Step 5 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Step 5</Badge>
                <h3 className="font-semibold">Start the App</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p>1. Start the development server:</p>
                <div className="bg-muted p-2 rounded font-mono text-xs">
                  npm run dev
                </div>
                <p>2. Wait for it to say "Ready" and show a URL</p>
                <p>3. Open your web browser</p>
                <p>4. Go to: <code className="bg-muted px-1 rounded">http://localhost:3000</code></p>
                <p>5. 🎉 You should see the Power Platform Assessment Suite!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-orange-500" />
              Troubleshooting
            </CardTitle>
            <CardDescription>
              Common problems and how to fix them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ "npm is not recognized"</h4>
              <p className="text-sm">You need to install Node.js. Go back to Step 1.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ "git is not recognized"</h4>
              <p className="text-sm">You need to install Git. Go back to Step 2.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ "Port 3000 is already in use"</h4>
              <p className="text-sm">The app will automatically try port 3001, 3002, etc. Just use the URL it shows you.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ "Cannot find module" errors</h4>
              <p className="text-sm">Try deleting the <code className="bg-muted px-1 rounded">node_modules</code> folder and running <code className="bg-muted px-1 rounded">npm install</code> again.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">❌ "Permission denied"</h4>
              <p className="text-sm">On Mac/Linux, you might need to use <code className="bg-muted px-1 rounded">sudo</code> before commands, or run as administrator on Windows.</p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              What You Get
            </CardTitle>
            <CardDescription>
              All the features included in this app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">✅ Assessment Tools</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Power Platform standards assessment</li>
                  <li>• Multiple assessment areas</li>
                  <li>• Scoring and recommendations</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">✅ Data Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Export/Import assessments</li>
                  <li>• Local data storage</li>
                  <li>• Backup and restore</li>
                  <li>• Google Drive integration (optional)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">✅ Reports</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Executive summaries</li>
                  <li>• Detailed reports</li>
                  <li>• Word document export</li>
                  <li>• PDF generation</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">✅ User Experience</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Modern, responsive design</li>
                  <li>• Mobile-friendly interface</li>
                  <li>• Dark/light theme</li>
                  <li>• Intuitive navigation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <a href="https://github.com/Ross851/Power-Platform-Assessment-Suite" target="_blank" rel="noopener noreferrer">
              <GitBranch className="mr-2 h-5 w-5" />
              View on GitHub
            </a>
          </Button>
          
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <Play className="mr-2 h-5 w-5" />
              Back to App
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 