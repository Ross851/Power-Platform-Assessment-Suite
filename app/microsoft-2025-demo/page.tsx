import Microsoft2025BeautifulPage from './beautiful-page'
import { ThemeProvider } from '@/lib/governance/theme-provider'

export default function Microsoft2025DemoPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pp-assessment-theme">
      <Microsoft2025BeautifulPage />
    </ThemeProvider>
  )
}