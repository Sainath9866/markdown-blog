/**
 * THE MOUNTED PATTERN - Why it's essential for SSR
 * 
 * PROBLEM: Server vs Client Mismatch
 * - Server: Doesn't know user's theme preference (no localStorage access)
 * - Client: Knows theme from localStorage
 * - Result: Hydration mismatch error!
 */

'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

// ❌ BAD: This will cause hydration mismatch
export function BadThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  // Server renders this as undefined/null
  // Client renders this as "dark" or "light"
  // = HYDRATION MISMATCH ERROR!
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current theme: {theme} {/* This causes the mismatch! */}
    </button>
  )
}

// ✅ GOOD: The mounted pattern prevents mismatch
export function GoodThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // This effect only runs on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show skeleton/placeholder until client is ready
  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
    )
  }

  // Now both server and client render the same thing initially
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '🌙' : '🌞'}
    </button>
  )
}

/**
 * DETAILED BREAKDOWN OF THE MOUNTING PROCESS:
 * 
 * 1. SERVER-SIDE RENDERING (SSR):
 *    - mounted = false (initial state)
 *    - useEffect doesn't run on server
 *    - Renders placeholder/skeleton
 * 
 * 2. CLIENT-SIDE HYDRATION:
 *    - mounted = false (matches server)
 *    - React hydrates successfully (no mismatch)
 *    - useEffect runs, sets mounted = true
 *    - Component re-renders with actual theme
 * 
 * 3. SUBSEQUENT RENDERS:
 *    - mounted = true
 *    - Shows real theme toggle
 *    - No more hydration issues
 */

export function MountingTimeline() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
      setStep(2)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 border rounded">
      <h3>Mounting Timeline Simulation:</h3>
      
      <div className="mt-4">
        <div className={step >= 1 ? 'text-green-600' : 'text-gray-400'}>
          Step 1: Server renders (mounted = false)
        </div>
        <div className={step >= 2 ? 'text-green-600' : 'text-gray-400'}>
          Step 2: Client mounts (mounted = true)
        </div>
      </div>

      <div className="mt-4 p-2 bg-gray-100 rounded">
        {!mounted ? (
          <div className="w-20 h-8 bg-gray-300 rounded animate-pulse">
            Loading...
          </div>
        ) : (
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Theme Toggle Ready!
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mt-2">
        mounted = {mounted.toString()}
      </p>
    </div>
  )
}

/**
 * HOW TO CHECK localStorage IN BROWSER:
 * 
 * 1. Open your site (localhost:3000)
 * 2. Toggle theme a few times
 * 3. Open DevTools (F12)
 * 4. Go to Application tab
 * 5. Expand "Local Storage"
 * 6. Click on "http://localhost:3000"
 * 7. Look for key "theme" with value "light", "dark", or "system"
 * 
 * Try it now! Toggle your theme, then check DevTools!
 */ 