'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useExamStore } from '@/lib/store/exam-store'

interface AntiCheatOptions {
  onViolation: (reason: string) => void
  onForceSubmit: () => void
  maxViolations?: number
}

export function useAntiCheat({ onViolation, onForceSubmit, maxViolations = 2 }: AntiCheatOptions) {
  const { addCheatingAttempt, cheatingAttempts } = useExamStore()
  const violationCount = useRef(0)
  const isActiveTab = useRef(true)

  const handleViolation = useCallback((reason: string) => {
    violationCount.current++
    addCheatingAttempt(reason)
    onViolation(reason)

    if (violationCount.current >= maxViolations) {
      onForceSubmit()
    }
  }, [addCheatingAttempt, onViolation, onForceSubmit, maxViolations])

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      handleViolation('Right-click attempted')
    }

    // Disable copy-paste
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault()
        handleViolation('Developer tools access attempted')
        return false
      }

      // Disable Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X
      if (e.ctrlKey && ['c', 'v', 'a', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        handleViolation('Copy/paste/select-all attempted')
        return false
      }

      // Disable Ctrl+R, F5 (refresh)
      if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault()
        handleViolation('Page refresh attempted')
        return false
      }

      // Disable Alt+Tab
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        handleViolation('Alt+Tab attempted')
        return false
      }
    }

    // Detect tab switch / focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActiveTab.current = false
        handleViolation('Tab switched or window lost focus')
      } else {
        isActiveTab.current = true
      }
    }

    const handleBlur = () => {
      if (isActiveTab.current) {
        handleViolation('Window lost focus')
      }
    }

    const handleFocus = () => {
      isActiveTab.current = true
    }

    // Prevent page navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      handleViolation('Attempted to leave page')
      e.returnValue = ''
    }

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault()
      return false
    }

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Disable CSS that might allow text selection
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    document.body.style.msUserSelect = 'none'

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      // Restore default styles
      document.body.style.userSelect = 'auto'
      document.body.style.webkitUserSelect = 'auto'
      document.body.style.msUserSelect = 'auto'
    }
  }, [handleViolation])

  // Detect developer tools
  useEffect(() => {
    let devtools = {
      open: false,
      orientation: null
    }

    const setDevtoolsState = (state: boolean) => {
      if (state && !devtools.open) {
        devtools.open = true
        handleViolation('Developer tools opened')
      }
    }

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        setDevtoolsState(true)
      }
    }, 500)

    // Additional check for console
    let element = new Image()
    Object.defineProperty(element, 'id', {
      get: function() {
        setDevtoolsState(true)
      }
    })

    setInterval(() => {
      console.clear()
      console.log(element)
    }, 1000)
  }, [handleViolation])

  return {
    violationCount: violationCount.current,
    cheatingAttempts
  }
}