'use client'

import { useEffect } from 'react'
import { getDailyColorCombo, getDailyLayout, getDailyFontCombo, hexToRgb } from '@/lib/theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Get daily color combo
    const combo = getDailyColorCombo()
    const layout = getDailyLayout()
    const fontCombo = getDailyFontCombo()

    // Apply color variables to document root
    const root = document.documentElement
    
    // Set color variables
    root.style.setProperty('--daily-primary', combo.primary)
    root.style.setProperty('--daily-secondary', combo.secondary)
    root.style.setProperty('--daily-accent', combo.accent)
    root.style.setProperty('--daily-dark', combo.dark)
    root.style.setProperty('--daily-darker', combo.darker)

    // Set layout attribute for CSS to use
    root.setAttribute('data-layout', layout)
    
    // Set font combination attribute
    root.setAttribute('data-font', fontCombo.name.toLowerCase())

    // Store in session storage for debugging
    sessionStorage.setItem('daily-theme', JSON.stringify({ combo: combo.name, layout, fontCombo: fontCombo.name }))
  }, [])

  return <>{children}</>
}
