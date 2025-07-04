'use client'

import React, { useState } from 'react'
import { Sidebar, DarkThemeToggle, Navbar, Avatar, Dropdown, Badge, Tooltip } from 'flowbite-react'
import { 
  HiHome,
  HiChartBar,
  HiClipboardCheck,
  HiDocumentReport,
  HiUserGroup,
  HiCog,
  HiAcademicCap,
  HiShieldCheck,
  HiLightBulb,
  HiSupport,
  HiBell,
  HiSearch,
  HiMenu,
  HiX,
  HiLogout,
  HiUser,
  HiCurrencyDollar,
  HiOfficeBuilding,
  HiGlobe,
  HiLockClosed,
  HiCollection,
  HiPresentationChartBar,
  HiQuestionMarkCircle,
  HiBookOpen,
  HiExclamation,
  HiCheckCircle
} from 'react-icons/hi'
import { PowerPlatformIcons } from '@/lib/icon-system'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function EnterpriseDashboardLayout({ children, currentPath = '/' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      group: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: HiHome, badge: null },
        { name: 'Assessments', href: '/assessments', icon: HiClipboardCheck, badge: '3 Active' },
        { name: 'Reports', href: '/reports', icon: HiDocumentReport, badge: null },
        { name: 'Analytics', href: '/analytics', icon: HiChartBar, badge: 'New' }
      ]
    },
    {
      group: 'Power Platform',
      items: [
        { name: 'Power Apps', href: '/power-apps', icon: PowerPlatformIcons.powerApps.main },
        { name: 'Power Automate', href: '/power-automate', icon: PowerPlatformIcons.powerAutomate.main },
        { name: 'Power Pages', href: '/power-pages', icon: PowerPlatformIcons.powerPages.main },
        { name: 'Power BI', href: '/power-bi', icon: PowerPlatformIcons.powerBI.main }
      ]
    },
    {
      group: 'Governance',
      items: [
        { name: 'Center of Excellence', href: '/coe', icon: HiAcademicCap },
        { name: 'Security & Compliance', href: '/security', icon: HiShieldCheck },
        { name: 'Risk Management', href: '/risk', icon: HiExclamation },
        { name: 'Investment Strategy', href: '/investment', icon: HiCurrencyDollar }
      ]
    },
    {
      group: 'Organization',
      items: [
        { name: 'Teams', href: '/teams', icon: HiUserGroup },
        { name: 'Environments', href: '/environments', icon: HiGlobe },
        { name: 'Policies', href: '/policies', icon: HiLockClosed },
        { name: 'Settings', href: '/settings', icon: HiCog }
      ]
    }
  ]

  const notifications = [
    {
      id: 1,
      title: 'Assessment Complete',
      message: 'Q4 2024 Power Platform assessment has been completed',
      time: '5 minutes ago',
      type: 'success',
      icon: HiCheckCircle
    },
    {
      id: 2,
      title: 'Risk Alert',
      message: 'High risk identified in Production environment',
      time: '1 hour ago',
      type: 'warning',
      icon: HiExclamation
    },
    {
      id: 3,
      title: 'New Best Practices',
      message: 'Microsoft released new governance guidelines',
      time: '2 hours ago',
      type: 'info',
      icon: HiLightBulb
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar className="h-full">
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <HiOfficeBuilding className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  PP Assessment
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise Suite</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
          
          <Sidebar.Items>
            {navigationItems.map((section) => (
              <Sidebar.ItemGroup key={section.group}>
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.group}
                </p>
                {section.items.map((item) => (
                  <Sidebar.Item
                    key={item.name}
                    href={item.href}
                    icon={item.icon}
                    active={currentPath === item.href}
                    className="group"
                  >
                    <span className="flex items-center justify-between w-full">
                      {item.name}
                      {item.badge && (
                        <Badge size="xs" color={item.badge === 'New' ? 'purple' : 'info'}>
                          {item.badge}
                        </Badge>
                      )}
                    </span>
                  </Sidebar.Item>
                ))}
              </Sidebar.ItemGroup>
            ))}
            
            <Sidebar.ItemGroup>
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resources
              </p>
              <Sidebar.Item href="/documentation" icon={HiBookOpen}>
                Documentation
              </Sidebar.Item>
              <Sidebar.Item href="/support" icon={HiSupport}>
                Support
              </Sidebar.Item>
              <Sidebar.Item href="/help" icon={HiQuestionMarkCircle}>
                Help Center
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  rounded
                  size="sm"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enterprise</p>
                </div>
              </div>
              <Tooltip content="Sign out">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HiLogout className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </Tooltip>
            </div>
          </div>
        </Sidebar>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar className="border-b dark:border-gray-700">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <HiMenu className="w-5 h-5" />
              </button>
              
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-sm"
                  placeholder="Search assessments, reports, teams..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <DarkThemeToggle />
              
              {/* Notifications */}
              <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                  <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <HiBell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                )}
              >
                <Dropdown.Header>
                  <span className="block text-sm font-semibold">Notifications</span>
                  <span className="block text-xs text-gray-500">You have {notifications.length} unread messages</span>
                </Dropdown.Header>
                
                {notifications.map((notification) => (
                  <Dropdown.Item key={notification.id} className="flex items-start space-x-3 p-3">
                    <notification.icon className={cn(
                      "w-5 h-5 mt-0.5",
                      notification.type === 'success' && "text-green-500",
                      notification.type === 'warning' && "text-yellow-500",
                      notification.type === 'info' && "text-blue-500"
                    )} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </Dropdown.Item>
                ))}
                
                <Dropdown.Divider />
                <Dropdown.Item className="text-center text-sm">
                  View all notifications
                </Dropdown.Item>
              </Dropdown>
              
              {/* User Menu */}
              <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Avatar
                      img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      rounded
                      size="sm"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-900 dark:text-white">
                      Admin User
                    </span>
                  </button>
                )}
              >
                <Dropdown.Header>
                  <span className="block text-sm">Admin User</span>
                  <span className="block truncate text-sm font-medium">admin@company.com</span>
                </Dropdown.Header>
                <Dropdown.Item icon={HiUser}>Profile</Dropdown.Item>
                <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
                <Dropdown.Item icon={HiCurrencyDollar}>Billing</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item icon={HiLogout}>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </Navbar>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}