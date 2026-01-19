import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import "@/lib/init-storage"
import { ClientLayout } from './client-layout'
// ExtensionBlocker removed - anti-pattern that interferes with password managers and accessibility tools

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
}

export const metadata: Metadata = {
  title: "Power Platform Assessment Suite",
  description: "Comprehensive assessment tool for evaluating Power Platform maturity against Microsoft best practices",
  keywords: ["Power Platform", "Assessment", "Microsoft", "Governance", "CoE", "DLP", "Security"],
  authors: [{ name: "Power Platform Assessment Suite" }],
  creator: "Power Platform Assessment Suite",
  publisher: "Power Platform Assessment Suite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // metadataBase should be set via environment variable for different deployments
  // metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
    : undefined, // Will use default behaviour in development
  openGraph: {
    title: "Power Platform Assessment Suite",
    description: "Evaluate your organisation's Power Platform maturity against Microsoft best practices",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power Platform Assessment Suite",
    description: "Evaluate your organisation's Power Platform maturity against Microsoft best practices",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            <div className="min-h-screen bg-background font-sans antialiased">
              {children}
            </div>
            <Toaster />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
