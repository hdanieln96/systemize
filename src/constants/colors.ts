/**
 * Color palette for LifePlanner
 * Deep Ocean Blue Theme - Professional, calm, and focused
 */

export const Colors = {
  // Primary Colors (Deep Ocean Blue)
  primary: {
    main: '#4A90E2',           // Deep ocean blue
    light: '#7DB3F5',          // Lighter blue
    lighter: '#A8CFFF',        // Very light blue
    dark: '#2E5C8A',           // Darker ocean blue
    gradient: ['#4A90E2', '#5CA9FB'], // Blue gradient
  },

  // Accent Colors
  accent: {
    orange: '#FFA726',         // Warm accent for energy
    teal: '#26A69A',          // Alternative accent
    purple: '#9575CD',        // Secondary accent
  },

  // Semantic Colors
  success: '#66BB6A',          // Green (slightly deeper for better contrast)
  warning: '#FFB74D',
  error: '#FF6B6B',            // Softer red
  info: '#5CA9FB',             // Light blue

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    mediumGray: '#E0E0E0',
    gray: '#BDBDBD',
    darkGray: '#757575',
    black: '#333333',
  },

  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    gradient: ['#E8F4FD', '#D1E8FA'], // Light blue gradient for backgrounds
    blueLight: '#F0F7FF',      // Very light blue tint
  },

  // Text
  text: {
    primary: '#333333',
    secondary: '#757575',
    tertiary: '#BDBDBD',       // Tertiary/muted text
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    blue: '#4A90E2',           // Blue text for links/emphasis
  },

  // Component-specific
  timeline: {
    connector: '#E0E0E0',
    nodeBorder: '#4A90E2',
    nodeGradient: ['#4A90E2', '#5CA9FB'],
    completedOverlay: 'rgba(102, 187, 106, 0.15)',
    currentTime: '#FFA726',    // Orange for "current time" indicator
  },

  habit: {
    streakFire: '#FF6E40',
    completed: '#66BB6A',
    incomplete: '#FF6B6B',
    upcoming: '#E0E0E0',
  },

  navigation: {
    active: '#4A90E2',         // Blue for active tab
    inactive: '#757575',
    fabGradient: ['#4A90E2', '#5CA9FB'], // Blue gradient for FAB
    fabShadow: 'rgba(74, 144, 226, 0.4)',
  },

  // Modal & Overlays
  modal: {
    backdrop: 'rgba(0, 0, 0, 0.3)',
    background: 'rgba(255, 255, 255, 0.95)',
    handle: '#E0E0E0',
  },

  // Task Cards
  card: {
    background: '#FFFFFF',
    backgroundBlue: 'rgba(74, 144, 226, 0.06)',
    border: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
} as const;

export type ColorKey = keyof typeof Colors;
