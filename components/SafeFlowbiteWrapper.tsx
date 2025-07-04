'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Wrapper to handle dynamic imports safely
export const SafeCard = dynamic(
  () => import('flowbite-react').then(mod => ({ default: mod.Card || (() => null) })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32" />
  }
)

export const SafeBadge = dynamic(
  () => import('flowbite-react').then(mod => ({ default: mod.Badge || (() => null) })),
  { 
    ssr: false,
    loading: () => <span className="animate-pulse bg-gray-200 rounded h-6 w-16 inline-block" />
  }
)

export const SafeProgress = dynamic(
  () => import('flowbite-react').then(mod => ({ default: mod.Progress || (() => null) })),
  { ssr: false }
)

export const SafeAlert = dynamic(
  () => import('flowbite-react').then(mod => ({ default: mod.Alert || (() => null) })),
  { ssr: false }
)

export const SafeButton = dynamic(
  () => import('flowbite-react').then(mod => ({ default: mod.Button || (() => null) })),
  { ssr: false }
)

export const SafeTabs = dynamic(
  () => import('flowbite-react').then(mod => ({ default: mod.Tabs || (() => null) })),
  { ssr: false }
)