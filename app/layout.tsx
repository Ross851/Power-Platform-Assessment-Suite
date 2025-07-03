import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "@/lib/init-storage"

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
  metadataBase: new URL("https://power-platform-assessment.vercel.app"),
  openGraph: {
    title: "Power Platform Assessment Suite",
    description: "Evaluate your organisation's Power Platform maturity against Microsoft best practices",
    type: "website",
    locale: "en_US",
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
