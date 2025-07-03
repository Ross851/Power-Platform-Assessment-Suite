'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { focusManager } from '@/lib/accessibility';

interface SkipLink {
  href: string;
  text: string;
  target?: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

/**
 * Skip navigation links for keyboard users and screen readers
 * These links become visible when focused via keyboard navigation
 */
export function SkipLinks({ links, className = '' }: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Default skip links if none provided
  const defaultLinks: SkipLink[] = [
    { href: '#main-content', text: 'Skip to main content', target: 'main' },
    { href: '#primary-navigation', text: 'Skip to navigation', target: 'nav' },
    { href: '#search', text: 'Skip to search', target: '[type="search"]' },
  ];

  const skipLinks = links || defaultLinks;

  useEffect(() => {
    // Add IDs to target elements if they don't exist
    skipLinks.forEach(link => {
      if (link.href.startsWith('#') && link.target) {
        const targetElement = document.querySelector(link.target);
        if (targetElement && !targetElement.id) {
          targetElement.id = link.href.substring(1);
        }
      }
    });
  }, [skipLinks]);

  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>, link: SkipLink) => {
    e.preventDefault();
    
    if (link.href.startsWith('#')) {
      const targetId = link.href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Set tabindex if not focusable
        if (!targetElement.hasAttribute('tabindex')) {
          targetElement.setAttribute('tabindex', '-1');
        }
        
        targetElement.focus();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (link.target) {
        // Fallback to using the target selector
        focusManager.focus(link.target);
      }
    }
  };

  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  return (
    <nav
      className={`skip-links ${className}`}
      aria-label="Skip navigation"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <ul className="skip-links__list">
        {skipLinks.map((link, index) => (
          <li key={index} className="skip-links__item">
            <a
              href={link.href}
              className={`skip-links__link ${isVisible ? 'skip-links__link--visible' : ''}`}
              onClick={(e) => handleSkipClick(e, link)}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .skip-links {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9999;
          width: 100%;
        }

        .skip-links__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 1rem;
          justify-content: center;
          background-color: var(--background, #ffffff);
          border-bottom: 1px solid var(--border, #e5e7eb);
          transform: translateY(-100%);
          transition: transform 0.3s ease-in-out;
        }

        .skip-links:focus-within .skip-links__list {
          transform: translateY(0);
        }

        .skip-links__item {
          margin: 0;
        }

        .skip-links__link {
          display: inline-block;
          padding: 1rem 1.5rem;
          color: var(--foreground, #000000);
          background-color: var(--background, #ffffff);
          text-decoration: none;
          font-weight: 500;
          border: 2px solid transparent;
          border-radius: 0.375rem;
          transition: all 0.2s ease-in-out;
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        .skip-links__link:focus,
        .skip-links__link--visible {
          position: static;
          width: auto;
          height: auto;
          overflow: visible;
          clip: auto;
          white-space: normal;
          left: auto;
          background-color: var(--primary, #0066cc);
          color: white;
          border-color: var(--primary-dark, #0052a3);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .skip-links__link:hover {
          background-color: var(--primary-dark, #0052a3);
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .skip-links__link:active {
          transform: translateY(0);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        @media (prefers-reduced-motion: reduce) {
          .skip-links__list {
            transition: none;
          }
          
          .skip-links__link {
            transition: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .skip-links__link:focus,
          .skip-links__link--visible {
            outline: 3px solid currentColor;
            outline-offset: 2px;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .skip-links__list {
            background-color: var(--background-dark, #1a1a1a);
            border-bottom-color: var(--border-dark, #333333);
          }

          .skip-links__link {
            background-color: var(--background-dark, #1a1a1a);
            color: var(--foreground-dark, #ffffff);
          }

          .skip-links__link:focus,
          .skip-links__link--visible {
            background-color: var(--primary-dark, #3b82f6);
            border-color: var(--primary-darker, #2563eb);
          }
        }
      `}</style>
    </nav>
  );
}

/**
 * Skip to main content link - simplified version for single use
 */
export function SkipToMain({ text = 'Skip to main content' }: { text?: string }) {
  return (
    <a
      href="#main-content"
      className="skip-to-main"
      onClick={(e) => {
        e.preventDefault();
        focusManager.focusMain();
      }}
    >
      {text}
      <style jsx>{`
        .skip-to-main {
          position: absolute;
          left: -9999px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
          z-index: 9999;
          padding: 1rem 1.5rem;
          background-color: var(--primary, #0066cc);
          color: white;
          text-decoration: none;
          font-weight: 500;
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .skip-to-main:focus {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: auto;
          height: auto;
          overflow: visible;
          clip: auto;
          white-space: normal;
          outline: 3px solid var(--primary-dark, #0052a3);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .skip-to-main {
            transition: none;
          }
        }
      `}</style>
    </a>
  );
}

// Export helper function to add skip links to layout
export function withSkipLinks<P extends object>(
  Component: React.ComponentType<P>,
  skipLinks?: SkipLink[]
) {
  return function WithSkipLinksComponent(props: P) {
    return (
      <>
        <SkipLinks links={skipLinks} />
        <Component {...props} />
      </>
    );
  };
}