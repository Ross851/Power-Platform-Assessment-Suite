import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
export type AriaLiveLevel = 'polite' | 'assertive' | 'off';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: () => void;
  description: string;
}

export interface FocusTrapOptions {
  initialFocus?: string;
  returnFocus?: boolean;
  allowOutsideClick?: boolean;
}

// Keyboard Navigation Hooks

/**
 * Hook for managing keyboard navigation in assessment forms
 */
export function useFormKeyboardNavigation() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const form = formRef.current;
      if (!form) return;

      const focusableElements = form.querySelectorAll<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const elements = Array.from(focusableElements);
      const currentIndex = elements.findIndex(el => el === document.activeElement);

      switch (e.key) {
        case 'Enter':
          if (e.ctrlKey && document.activeElement?.tagName !== 'TEXTAREA') {
            // Ctrl+Enter submits the form
            const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
            submitButton?.click();
            e.preventDefault();
          }
          break;

        case 'Tab':
          // Tab navigation is handled by browser, but we can enhance it
          if (e.shiftKey && currentIndex === 0) {
            // Wrap to last element
            elements[elements.length - 1]?.focus();
            e.preventDefault();
          } else if (!e.shiftKey && currentIndex === elements.length - 1) {
            // Wrap to first element
            elements[0]?.focus();
            e.preventDefault();
          }
          break;

        case 'Escape':
          // Clear current field or close modal/dropdown
          if (document.activeElement instanceof HTMLInputElement || 
              document.activeElement instanceof HTMLTextAreaElement) {
            document.activeElement.value = '';
            e.preventDefault();
          }
          break;
      }
    };

    form.addEventListener('keydown', handleKeyDown);
    return () => form.removeEventListener('keydown', handleKeyDown);
  }, []);

  return formRef;
}

/**
 * Hook for registering global keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const modifiersMatch = 
          (!!shortcut.ctrl === (e.ctrlKey || e.metaKey)) &&
          (!!shortcut.shift === e.shiftKey) &&
          (!!shortcut.alt === e.altKey) &&
          (!!shortcut.meta === e.metaKey);

        if (e.key === shortcut.key && modifiersMatch) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Screen Reader Announcements

/**
 * Hook for announcing RAG status changes to screen readers
 */
export function useRAGStatusAnnouncement() {
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((status: 'red' | 'amber' | 'green', itemName: string) => {
    if (!announcementRef.current) return;

    const statusText = {
      red: 'Critical',
      amber: 'Warning',
      green: 'Good'
    }[status];

    const message = `${itemName} status changed to ${statusText}`;
    announcementRef.current.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  const AriaLiveRegion = () => (
    <div
      ref={announcementRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return { announce, AriaLiveRegion };
}

/**
 * Generic screen reader announcement utility
 */
export function announceToScreenReader(message: string, level: AriaLiveLevel = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', level);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus Management Utilities

/**
 * Focus trap hook for modals and dialogs
 */
export function useFocusTrap(isActive: boolean, options: FocusTrapOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store current focus
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (options.initialFocus) {
      const initialElement = container.querySelector<HTMLElement>(options.initialFocus);
      initialElement?.focus();
    } else {
      firstElement?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement?.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement?.focus();
        e.preventDefault();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!options.allowOutsideClick && !container.contains(e.target as Node)) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside, true);

      // Restore focus
      if (options.returnFocus !== false && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, options]);

  return containerRef;
}

/**
 * Focus management utilities
 */
export const focusManager = {
  /**
   * Move focus to an element by selector
   */
  focus(selector: string): boolean {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      element.focus();
      return true;
    }
    return false;
  },

  /**
   * Move focus to the first error in a form
   */
  focusFirstError(formSelector?: string): boolean {
    const form = formSelector ? document.querySelector(formSelector) : document;
    const errorElement = form?.querySelector<HTMLElement>(
      '[aria-invalid="true"], .error input, .error textarea, .error select'
    );
    if (errorElement) {
      errorElement.focus();
      announceToScreenReader('Please correct the errors in the form', 'assertive');
      return true;
    }
    return false;
  },

  /**
   * Move focus to main content
   */
  focusMain(): boolean {
    return this.focus('main, [role="main"], #main-content');
  },

  /**
   * Create a focus guard that prevents focus from leaving a container
   */
  createFocusGuard(container: HTMLElement) {
    const guard = document.createElement('div');
    guard.tabIndex = 0;
    guard.setAttribute('aria-hidden', 'true');
    guard.style.position = 'absolute';
    guard.style.width = '1px';
    guard.style.height = '1px';
    guard.style.padding = '0';
    guard.style.margin = '-1px';
    guard.style.overflow = 'hidden';
    guard.style.clip = 'rect(0, 0, 0, 0)';
    guard.style.whiteSpace = 'nowrap';
    guard.style.border = '0';

    guard.addEventListener('focus', () => {
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    });

    return guard;
  }
};

// ARIA Live Region Helpers

/**
 * Hook for creating and managing ARIA live regions
 */
export function useAriaLiveRegion(level: AriaLiveLevel = 'polite') {
  const regionRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const announce = useCallback((message: string, delay = 100) => {
    if (!regionRef.current) return;

    // Clear any pending announcements
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay announcement slightly to ensure it's picked up
    timeoutRef.current = setTimeout(() => {
      if (regionRef.current) {
        regionRef.current.textContent = message;
        
        // Clear after announcement
        timeoutRef.current = setTimeout(() => {
          if (regionRef.current) {
            regionRef.current.textContent = '';
          }
        }, 1000);
      }
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const AriaLiveRegion = () => (
    <div
      ref={regionRef}
      role={level === 'assertive' ? 'alert' : 'status'}
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    />
  );

  return { announce, AriaLiveRegion };
}

// Common Keyboard Shortcuts

/**
 * Default keyboard shortcuts for the application
 */
export function useDefaultKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      handler: () => focusManager.focus('[type="search"], input[placeholder*="search" i]'),
      description: 'Focus search'
    },
    {
      key: 'g',
      shift: true,
      handler: () => router.push('/'),
      description: 'Go to home'
    },
    {
      key: 'g',
      ctrl: true,
      handler: () => router.push('/assessment'),
      description: 'Go to assessment'
    },
    {
      key: 's',
      ctrl: true,
      handler: () => {
        const saveButton = document.querySelector<HTMLButtonElement>('button[type="submit"], button:has([data-save])');
        saveButton?.click();
      },
      description: 'Save current form'
    },
    {
      key: '?',
      shift: true,
      handler: () => {
        // Show keyboard shortcuts help
        announceToScreenReader('Keyboard shortcuts: Slash for search, Shift+G for home, Ctrl+G for assessment, Ctrl+S to save');
      },
      description: 'Show keyboard shortcuts'
    },
    {
      key: 'Escape',
      handler: () => {
        // Close any open modals or dropdowns
        const closeButton = document.querySelector<HTMLButtonElement>('[aria-label*="close" i], [data-dismiss], .modal.open button');
        closeButton?.click();
      },
      description: 'Close modal or dropdown'
    }
  ];

  useKeyboardShortcuts(shortcuts);
  return shortcuts;
}

// Utility function for screen reader only text
export function srOnly(text: string) {
  return <span className="sr-only">{text}</span>;
}

// Export all types
export type {
  KeyboardShortcut,
  FocusTrapOptions,
  AriaLiveLevel
};