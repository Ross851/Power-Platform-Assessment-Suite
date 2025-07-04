// Power Platform Icon System
// Maps Power Platform concepts to appropriate icons from Flowbite and Lucide

import {
  HiDatabase,
  HiCube,
  HiPuzzle,
  HiCloud,
  HiDesktopComputer,
  HiLightningBolt,
  HiLink,
  HiShieldCheck,
  HiCheckCircle,
  HiExclamation,
  HiXCircle,
  HiInformationCircle,
  HiChartBar,
  HiDocumentReport,
  HiUserGroup,
  HiCog,
  HiAcademicCap,
  HiLockClosed,
  HiClipboardCheck,
  HiLightBulb,
  HiGlobe,
  HiServer,
  // HiTerminal,
  HiCode,
  HiCollection,
  HiTemplate,
  HiClock,
  HiRefresh,
  HiPlay,
  // HiPause,
  // HiStop,
  HiArrowRight,
  HiArrowUp,
  HiArrowDown,
  HiTrendingUp,
  HiTrendingDown,
  HiDownload,
  HiUpload,
  HiShare,
  HiPrinter,
  HiMail,
  HiCalendar,
  HiFilter,
  HiSearch,
  HiDotsVertical,
  HiMenu,
  HiX,
  HiHome,
  HiOfficeBuilding,
  HiCurrencyDollar,
  HiCalculator,
  HiPresentationChartBar,
  HiPresentationChartLine,
  HiDocumentText,
  HiClipboardList,
  HiBeaker,
  HiSparkles,
  HiFire,
  HiStar,
  HiBadgeCheck,
  HiQuestionMarkCircle,
  HiAnnotation,
  HiChatAlt,
  HiBell,
  HiSpeakerphone,
  HiFlag,
  // HiBookmark,
  // HiTag,
  // HiHashtag,
  HiViewGrid,
  // HiViewList,
  // HiPhotograph,
  HiFilm,
  // HiMicrophone,
  // HiVolumeUp,
  // HiWifi,
  HiStatusOnline,
  HiStatusOffline,
  HiSupport,
  HiTicket,
  HiLibrary,
  HiBookOpen,
  // HiNewspaper,
  HiPencilAlt,
  HiPencil,
  HiTrash,
  HiArchive,
  // HiFolderOpen,
  HiFolder,
  // HiDocument,
  // HiDocumentAdd,
  // HiDocumentDuplicate,
  // HiDocumentRemove,
  HiDocumentSearch,
  HiTable,
  // HiViewBoards,
  HiChartPie,
  HiChartSquareBar,
  // HiTruck,
  // HiShoppingCart,
  // HiCreditCard,
  // HiCash,
  // HiReceiptTax,
  HiBriefcase,
  HiUserAdd,
  HiUserRemove,
  HiUsers,
  HiUserCircle,
  HiIdentification,
  HiKey,
  HiFingerPrint,
  HiEye,
  HiEyeOff,
  HiBan,
  HiMinusCircle,
  HiPlusCircle,
  HiPlus,
  HiMinus,
  HiDuplicate,
  HiClipboard,
  HiClipboardCopy,
  HiSave,
  HiSaveAs,
  HiReply,
  HiForward,
  HiRewind,
  HiFastForward,
  HiSwitchHorizontal,
  HiSwitchVertical,
  HiArrowNarrowUp,
  HiArrowNarrowDown,
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiArrowsExpand,
  HiZoomIn,
  HiZoomOut,
  HiMap,
  HiLocationMarker,
  HiGlobeAlt,
  HiScale,
  HiColorSwatch,
  // HiAdjustments,
  HiSelector,
  // HiOutlineMenuAlt1,
  // HiOutlineMenuAlt2,
  // HiOutlineMenuAlt3,
  // HiOutlineMenuAlt4,
  // HiDotsHorizontal,
  // HiDotsCircleHorizontal
} from 'react-icons/hi'

export const PowerPlatformIcons = {
  // Power Apps Icons
  powerApps: {
    main: HiCube,
    canvas: HiTemplate,
    modelDriven: HiDatabase,
    component: HiPuzzle,
    pcf: HiCode,
    solution: HiCollection,
    environment: HiGlobe,
    connector: HiLink
  },
  
  // Power Automate Icons
  powerAutomate: {
    main: HiLightningBolt,
    cloudFlow: HiCloud,
    desktopFlow: HiDesktopComputer,
    trigger: HiPlay,
    action: HiLightningBolt,
    connector: HiLink,
    template: HiTemplate,
    schedule: HiClock,
    manual: HiPlay, // was HiCursorClick
    automated: HiRefresh
  },
  
  // Power Pages Icons
  powerPages: {
    main: HiGlobeAlt,
    template: HiTemplate,
    security: HiShieldCheck,
    performance: HiLightningBolt,
    accessibility: HiEye,
    design: HiColorSwatch,
    content: HiDocumentText,
    forms: HiClipboardList
  },
  
  // Power BI Icons
  powerBI: {
    main: HiChartBar,
    report: HiDocumentReport,
    dashboard: HiViewGrid,
    dataset: HiDatabase,
    dataflow: HiArrowRight,
    workspace: HiFolder,
    app: HiCube
  },
  
  // Assessment Status Icons
  assessment: {
    excellent: HiCheckCircle,
    good: HiBadgeCheck,
    needsImprovement: HiExclamation,
    critical: HiXCircle,
    info: HiInformationCircle,
    inProgress: HiClock,
    completed: HiCheckCircle,
    notStarted: HiMinusCircle,
    skipped: HiArrowRight
  },
  
  // Scoring Icons
  scoring: {
    high: HiTrendingUp,
    medium: HiArrowRight,
    low: HiTrendingDown,
    star: HiStar,
    trophy: HiSparkles,
    medal: HiBadgeCheck,
    warning: HiExclamation,
    critical: HiFire
  },
  
  // Navigation Icons
  navigation: {
    home: HiHome,
    dashboard: HiChartBar,
    assessments: HiClipboardCheck,
    reports: HiDocumentReport,
    settings: HiCog,
    users: HiUserGroup,
    help: HiQuestionMarkCircle,
    notifications: HiBell,
    menu: HiMenu,
    close: HiX,
    back: HiArrowNarrowLeft,
    forward: HiArrowNarrowRight
  },
  
  // Action Icons
  actions: {
    add: HiPlus,
    edit: HiPencil,
    delete: HiTrash,
    save: HiSave,
    cancel: HiX,
    refresh: HiRefresh,
    download: HiDownload,
    upload: HiUpload,
    share: HiShare,
    print: HiPrinter,
    export: HiDownload,
    import: HiUpload,
    copy: HiClipboardCopy,
    paste: HiClipboard,
    search: HiSearch,
    filter: HiFilter,
    sort: HiSwitchVertical,
    expand: HiArrowsExpand,
    collapse: HiMinus,
    more: HiDotsVertical
  },
  
  // Data Icons
  data: {
    database: HiDatabase,
    table: HiTable,
    chart: HiChartBar,
    pieChart: HiChartPie,
    barChart: HiChartSquareBar,
    lineChart: HiPresentationChartLine,
    report: HiDocumentReport,
    analytics: HiPresentationChartBar,
    metrics: HiCalculator,
    kpi: HiFlag
  },
  
  // Enterprise Icons
  enterprise: {
    organization: HiOfficeBuilding,
    department: HiBriefcase,
    team: HiUserGroup,
    role: HiIdentification,
    policy: HiClipboardCheck,
    compliance: HiShieldCheck,
    governance: HiScale,
    security: HiLockClosed,
    audit: HiDocumentSearch,
    risk: HiExclamation
  },
  
  // Microsoft Specific Icons
  microsoft: {
    azure: HiCloud,
    office365: HiOfficeBuilding,
    teams: HiUsers,
    sharepoint: HiLibrary,
    dynamics: HiCurrencyDollar,
    coe: HiAcademicCap,
    managedEnvironment: HiShieldCheck,
    dlp: HiLockClosed,
    connector: HiLink,
    dataverse: HiDatabase
  },
  
  // Status and State Icons
  status: {
    online: HiStatusOnline,
    offline: HiStatusOffline,
    active: HiCheckCircle,
    inactive: HiMinusCircle,
    pending: HiClock,
    approved: HiBadgeCheck,
    rejected: HiXCircle,
    draft: HiPencilAlt,
    published: HiSpeakerphone,
    archived: HiArchive
  },
  
  // Communication Icons
  communication: {
    message: HiAnnotation,
    chat: HiChatAlt,
    email: HiMail,
    notification: HiBell,
    announcement: HiSpeakerphone,
    feedback: HiAnnotation,
    comment: HiChatAlt,
    support: HiSupport,
    ticket: HiTicket
  },
  
  // Learning Icons
  learning: {
    course: HiAcademicCap,
    tutorial: HiBookOpen,
    documentation: HiBookOpen,
    video: HiFilm,
    webinar: HiPresentationChartBar,
    certification: HiBadgeCheck,
    training: HiLightBulb,
    knowledge: HiLibrary,
    bestPractice: HiStar
  }
}

// Helper function to get icon by path
export function getIcon(path: string): any {
  const parts = path.split('.')
  let icon = PowerPlatformIcons
  
  for (const part of parts) {
    icon = icon[part]
    if (!icon) return HiQuestionMarkCircle // Default fallback icon
  }
  
  return icon
}

// Icon size presets
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10'
}

// Icon color presets aligned with assessment scoring
export const iconColors = {
  excellent: 'text-green-600 dark:text-green-400',
  good: 'text-blue-600 dark:text-blue-400',
  needsImprovement: 'text-amber-600 dark:text-amber-400',
  critical: 'text-red-600 dark:text-red-400',
  neutral: 'text-gray-600 dark:text-gray-400',
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400'
}

// Fixed missing imports