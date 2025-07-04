// Design Tokens Configuration
// Centralized design system tokens aligned with Flowbite

export const designTokens = {
  // Color palette aligned with Flowbite and Power Platform branding
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93bbfd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    },
    
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16'
    },
    
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006'
    },
    
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    
    // Power Platform brand colors
    powerPlatform: {
      powerApps: '#742774', // Purple
      powerAutomate: '#0066ff', // Blue
      powerBI: '#f2c811', // Yellow
      powerPages: '#00bcf2', // Light Blue
      dataverse: '#00546b', // Dark Teal
      copilot: '#7c3aed' // AI Purple
    }
  },
  
  // Typography system
  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }]
    },
    
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },
  
  // Spacing system
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
    '4xl': '8rem',
    '5xl': '10rem'
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  
  // Shadows aligned with Flowbite
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none'
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms'
    },
    
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Z-index scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070'
  }
}

// Semantic color tokens
export const semanticColors = {
  // Assessment scoring colors
  scoring: {
    excellent: designTokens.colors.green[600],
    good: designTokens.colors.blue[600],
    fair: designTokens.colors.yellow[600],
    poor: designTokens.colors.red[600],
    notApplicable: designTokens.colors.gray[400]
  },
  
  // Status colors
  status: {
    success: designTokens.colors.green[600],
    warning: designTokens.colors.yellow[600],
    error: designTokens.colors.red[600],
    info: designTokens.colors.blue[600],
    neutral: designTokens.colors.gray[600]
  },
  
  // Interactive states
  interactive: {
    hover: designTokens.colors.primary[700],
    active: designTokens.colors.primary[800],
    focus: designTokens.colors.primary[500],
    disabled: designTokens.colors.gray[300]
  },
  
  // Background colors
  background: {
    primary: designTokens.colors.gray[50],
    secondary: designTokens.colors.gray[100],
    tertiary: designTokens.colors.gray[200],
    inverse: designTokens.colors.gray[900],
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  
  // Text colors
  text: {
    primary: designTokens.colors.gray[900],
    secondary: designTokens.colors.gray[600],
    tertiary: designTokens.colors.gray[500],
    inverse: designTokens.colors.gray[50],
    link: designTokens.colors.primary[600],
    error: designTokens.colors.red[600],
    success: designTokens.colors.green[600]
  }
}

// Component-specific tokens
export const componentTokens = {
  button: {
    padding: {
      sm: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
      md: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
      lg: `${designTokens.spacing.md} ${designTokens.spacing.lg}`
    },
    
    fontSize: {
      sm: designTokens.typography.fontSize.sm,
      md: designTokens.typography.fontSize.base,
      lg: designTokens.typography.fontSize.lg
    }
  },
  
  card: {
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    shadow: designTokens.shadows.base
  },
  
  input: {
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    borderRadius: designTokens.borderRadius.md,
    borderColor: designTokens.colors.gray[300],
    focusBorderColor: designTokens.colors.primary[500]
  },
  
  modal: {
    padding: designTokens.spacing.lg,
    borderRadius: designTokens.borderRadius.lg,
    maxWidth: '42rem',
    shadow: designTokens.shadows.xl
  }
}

// Export convenience classes
export const utilityClasses = {
  // Transitions
  transition: {
    all: 'transition-all duration-200 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    opacity: 'transition-opacity duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out'
  },
  
  // Focus styles
  focus: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  
  // Hover effects
  hover: {
    scale: 'hover:scale-105',
    shadow: 'hover:shadow-lg',
    brightness: 'hover:brightness-110'
  },
  
  // Container styles
  container: {
    sm: 'max-w-screen-sm mx-auto px-4',
    md: 'max-w-screen-md mx-auto px-4',
    lg: 'max-w-screen-lg mx-auto px-4',
    xl: 'max-w-screen-xl mx-auto px-4',
    '2xl': 'max-w-screen-2xl mx-auto px-4'
  }
}