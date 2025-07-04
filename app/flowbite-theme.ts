import type { CustomFlowbiteTheme } from 'flowbite-react'

export const customTheme: CustomFlowbiteTheme = {
  // Badge customizations
  badge: {
    root: {
      base: "flex h-fit items-center gap-1 font-semibold",
      color: {
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        failure: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
        purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      },
    },
  },
  
  // Button customizations
  button: {
    base: "group flex items-stretch items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none transition-all duration-200",
    color: {
      dark: "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-800",
      gray: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700",
      info: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      light: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-blue-300 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700",
      purple: "text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900",
      success: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
      warning: "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-900",
      failure: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    },
  },
  
  // Card customizations
  card: {
    root: {
      base: "flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
      children: "flex h-full flex-col justify-center gap-4 p-6",
    },
  },
  
  // Progress bar customizations
  progress: {
    base: "w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
    label: "mb-1 flex justify-between font-medium dark:text-white",
    bar: "space-x-2 rounded-full text-center text-xs font-medium leading-none text-white",
    color: {
      dark: "bg-gray-600 dark:bg-gray-300",
      blue: "bg-blue-600",
      red: "bg-red-600 dark:bg-red-500",
      green: "bg-green-600 dark:bg-green-500",
      yellow: "bg-yellow-400",
      indigo: "bg-indigo-600 dark:bg-indigo-500",
      purple: "bg-purple-600 dark:bg-purple-500",
    },
  },
  
  // Alert customizations
  alert: {
    base: "flex flex-col gap-2 p-4 text-sm rounded-lg",
    borderAccent: "border-t-4",
    color: {
      info: "text-blue-800 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-300",
      gray: "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
      failure: "text-red-800 bg-red-50 dark:bg-red-900/50 dark:text-red-300",
      success: "text-green-800 bg-green-50 dark:bg-green-900/50 dark:text-green-300",
      warning: "text-yellow-800 bg-yellow-50 dark:bg-yellow-900/50 dark:text-yellow-300",
      purple: "text-purple-800 bg-purple-50 dark:bg-purple-900/50 dark:text-purple-300",
    },
  },
  
  // Sidebar customizations
  sidebar: {
    root: {
      base: "h-full",
      inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      active: "bg-gray-100 dark:bg-gray-700",
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-gray-700 dark:text-gray-100",
      },
    },
  },
  
  // Modal customizations
  modal: {
    root: {
      base: "fixed top-0 right-0 left-0 z-50 h-modal h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
      show: {
        on: "flex bg-gray-900 bg-opacity-50 dark:bg-opacity-80",
        off: "hidden",
      },
    },
    content: {
      base: "relative h-full w-full p-4 md:h-auto",
      inner: "relative rounded-lg bg-white shadow dark:bg-gray-800 flex flex-col max-h-[90vh]",
    },
  },
  
  // Tooltip customizations
  tooltip: {
    base: "absolute inline-block z-50 rounded-lg py-2 px-3 text-sm font-medium shadow-sm",
    style: {
      dark: "bg-gray-900 text-white dark:bg-gray-700",
      light: "border border-gray-200 bg-white text-gray-900",
      auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
    },
  },
  
  // Navbar customizations
  navbar: {
    root: {
      base: "bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4",
      bordered: {
        on: "border",
        off: "",
      },
    },
  },
  
  // Rating customizations
  rating: {
    root: {
      base: "flex items-center",
    },
    star: {
      empty: "text-gray-300 dark:text-gray-500",
      filled: "text-yellow-400",
      sizes: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
  },
  
  // Tabs customizations
  tabs: {
    base: "flex flex-col gap-2",
    tablist: {
      base: "flex text-center",
      styles: {
        default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
        underline: "flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700",
        pills: "flex-wrap font-medium text-sm text-gray-500 dark:text-gray-400 space-x-2",
        fullWidth: "w-full text-sm font-medium divide-x divide-gray-200 shadow grid grid-flow-col dark:divide-gray-700 dark:text-gray-400 rounded-none",
      },
      tabitem: {
        base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        styles: {
          default: {
            base: "rounded-t-lg",
            active: {
              on: "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500",
              off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
            },
          },
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "text-blue-600 rounded-t-lg border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
        },
      },
    },
  },
  
  // Toggle switch customizations
  toggleSwitch: {
    root: {
      base: "group relative flex items-center rounded-lg focus:outline-none",
      active: {
        on: "cursor-pointer",
        off: "cursor-not-allowed opacity-50",
      },
    },
    toggle: {
      base: "toggle-bg h-6 w-11 rounded-full border group-focus:ring-4 group-focus:ring-blue-500/25 transition-all duration-200",
      checked: {
        on: "bg-blue-600 border-blue-600",
        off: "bg-gray-200 dark:bg-gray-700 border-gray-200 dark:border-gray-600",
        color: {
          blue: "bg-blue-600 border-blue-600",
          dark: "bg-dark-700 border-dark-900",
          failure: "bg-red-700 border-red-900",
          gray: "bg-gray-500 border-gray-600",
          green: "bg-green-600 border-green-700",
          light: "bg-light-700 border-light-900",
          purple: "bg-purple-700 border-purple-900",
          success: "bg-green-500 border-green-500",
          warning: "bg-yellow-400 border-yellow-400",
        },
      },
    },
  },
  
  // Dropdown customizations
  dropdown: {
    floating: {
      animation: "transition-opacity",
      base: "z-50 w-fit rounded divide-y divide-gray-100 shadow focus:outline-none",
      content: "py-1 text-sm text-gray-700 dark:text-gray-200",
      header: "block py-2 px-4 text-sm text-gray-700 dark:text-gray-200",
      item: {
        base: "flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
      },
      style: {
        dark: "bg-gray-900 text-white dark:bg-gray-700",
        light: "border border-gray-200 bg-white text-gray-900",
        auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
      },
    },
  },
}