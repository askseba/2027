'use client'

import { useEffect, useRef, RefObject } from 'react'

/**
 * Hook to trap focus within a modal or dialog
 * Prevents focus from escaping to background elements when Tab is pressed
 * 
 * @param isActive - Whether the focus trap should be active
 * @param containerRef - Ref to the container element (modal/dialog)
 * 
 * @example
 * const modalRef = useRef<HTMLDivElement>(null)
 * useFocusTrap(isOpen, modalRef)
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  isActive: boolean,
  containerRef: RefObject<T | null>
): void {
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current

    // Save the currently focused element before opening modal
    previousActiveElementRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ')

      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter(
        (el) => {
          // Filter out hidden elements
          const style = window.getComputedStyle(el)
          return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            !el.hasAttribute('disabled') &&
            !el.hasAttribute('aria-hidden')
          )
        }
      )
    }

    const focusableElements = getFocusableElements()

    // If no focusable elements, don't set up trap
    if (focusableElements.length === 0) return

    // Focus the first element when modal opens
    const firstElement = focusableElements[0]
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Tab key
      if (e.key !== 'Tab') return

      // If no focusable elements, prevent default
      if (focusableElements.length === 0) {
        e.preventDefault()
        return
      }

      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      )

      // If current element is not in the list, focus first element
      if (currentIndex === -1) {
        e.preventDefault()
        firstElement?.focus()
        return
      }

      // Handle Tab (forward)
      if (!e.shiftKey) {
        // If at last element, wrap to first
        if (currentIndex === focusableElements.length - 1) {
          e.preventDefault()
          firstElement?.focus()
        }
        // Otherwise, let browser handle it (focus next)
      }
      // Handle Shift+Tab (backward)
      else {
        // If at first element, wrap to last
        if (currentIndex === 0) {
          e.preventDefault()
          focusableElements[focusableElements.length - 1]?.focus()
        }
        // Otherwise, let browser handle it (focus previous)
      }
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown)

    // Cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      
      // Restore focus to previous element when modal closes
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isActive, containerRef])
}
