'use client'

import React from 'react'

// Minimal Flowbite theme provider for build compatibility
export function FlowbiteThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}