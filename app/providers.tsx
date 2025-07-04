'use client'

import { ThemeProvider } from 'next-themes'
import { ClientOnly } from '@/components/client-only'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClientOnly>
        {children}
      </ClientOnly>
    </ThemeProvider>
  )
}