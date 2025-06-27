import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/user-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Power Platform Assessment Suite",
  description: "Comprehensive assessment tool for Power Platform implementations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <header className="border-b">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  <h1 className="text-xl font-semibold">Power Platform Assessment Suite</h1>
                  <UserMenu />
                </div>
              </header>
              <ProtectedRoute>
                <main className="container mx-auto px-4 py-6">{children}</main>
              </ProtectedRoute>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
