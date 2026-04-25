// Color combinations for daily rotation
export const colorCombos = [
  {
    name: 'Warm Sunset',
    primary: '#EA8C55',
    secondary: '#C75146',
    accent: '#AD2E24',
    dark: '#81171B',
    darker: '#540804',
  },
  {
    name: 'Golden Harvest',
    primary: '#85123',
    secondary: '#eec170',
    accent: '#f2a65a',
    dark: '#f58549',
    darker: '#772f1a',
  },
  {
    name: 'Ocean Deep',
    primary: '#012622',
    secondary: '#003b36',
    accent: '#ece5f0',
    dark: '#e98a15',
    darker: '#59114d',
  },
  {
    name: 'Forest Meadow',
    primary: '#cbe896',
    secondary: '#aac0aa',
    accent: '#fcdfa6',
    dark: '#a18276',
    darker: '#f4b886',
  },
  {
    name: 'Elegant Dusk',
    primary: '#483d3f',
    secondary: '#058ed9',
    accent: '#f4ebd9',
    dark: '#a39a92',
    darker: '#77685d',
  },
  {
    name: 'Deep Space',
    primary: '#000022',
    secondary: '#001242',
    accent: '#0094c6',
    dark: '#005e7c',
    darker: '#040f16',
  },
  {
    name: 'Vibrant Rose',
    primary: '#0e0004',
    secondary: '#31081f',
    accent: '#6b0f1a',
    dark: '#b91372',
    darker: '#fa198b',
  },
]

// Layout variations for daily rotation
export const layoutVariations = [
  'centered', // Centered with centered content
  'hero', // Hero with large banner
  'grid', // Grid layout
  'sidebar', // Sidebar layout
  'card-grid', // Card grid layout
  'minimal', // Minimal centered
  'split', // Split screen layout
]

// Font combinations for daily rotation
export const fontCombinations = [
  {
    name: 'Classic',
    serif: 'Playfair Display',
    sans: 'Geist',
  },
  {
    name: 'Modern',
    serif: 'Georgia',
    sans: 'Inter',
  },
  {
    name: 'Elegant',
    serif: 'Cormorant',
    sans: 'Poppins',
  },
  {
    name: 'Bold',
    serif: 'Fraunces',
    sans: 'Montserrat',
  },
  {
    name: 'Minimal',
    serif: 'EB Garamond',
    sans: 'Sohne',
  },
  {
    name: 'Creative',
    serif: 'Spectral',
    sans: 'Raleway',
  },
  {
    name: 'Artistic',
    serif: 'Bodoni Moda',
    sans: 'DM Sans',
  },
]

/**
 * Get the color combo for today based on day of year
 */
export function getDailyColorCombo() {
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  // Cycle through the color combos
  const comboIndex = dayOfYear % colorCombos.length
  return colorCombos[comboIndex]
}

/**
 * Get the layout variation for today
 */
export function getDailyLayout() {
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  const layoutIndex = dayOfYear % layoutVariations.length
  return layoutVariations[layoutIndex]
}

/**
 * Get the font combination for today
 */
export function getDailyFontCombo() {
  const today = new Date()
  const start = new Date(today.getFullYear(), 0, 0)
  const diff = today.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  const fontIndex = dayOfYear % fontCombinations.length
  return fontCombinations[fontIndex]
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

/**
 * Generate CSS variables for theme
 */
export function generateThemeCss(combo: (typeof colorCombos)[0]) {
  return `
    :root {
      --color-primary: ${combo.primary};
      --color-secondary: ${combo.secondary};
      --color-accent: ${combo.accent};
      --color-dark: ${combo.dark};
      --color-darker: ${combo.darker};
    }
  `
}
