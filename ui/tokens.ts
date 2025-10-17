export const tokens = {
  fontFamily: { 
    base: "Inter, system-ui, sans-serif", 
    rtl: "Tajawal, system-ui, sans-serif" 
  },
  radius: { 
    sm: 6, 
    md: 10, 
    lg: 16, 
    xl: 20 
  },
  spacing: { 
    xs: 4, 
    sm: 8, 
    md: 12, 
    lg: 16, 
    xl: 24, 
    "2xl": 32 
  },
  shadow: { 
    sm: "0 1px 2px rgba(0,0,0,.06)", 
    md: "0 6px 16px rgba(0,0,0,.08)",
    lg: "0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)"
  },
  color: {
    // Brand colors
    brand: "#2563eb",
    brandSoft: "#e6efff",
    brandHover: "#1d4ed8",
    
    // Status colors
    danger: "#ef4444",
    dangerSoft: "#fef2f2",
    dangerHover: "#dc2626",
    
    success: "#16a34a",
    successSoft: "#f0fdf4",
    successHover: "#15803d",
    
    warning: "#f59e0b",
    warningSoft: "#fffbeb",
    warningHover: "#d97706",
    
    info: "#0ea5e9",
    infoSoft: "#f0f9ff",
    infoHover: "#0284c7",
    
    // Neutral colors
    ink: "#0f172a",        // Primary text
    ink2: "#334155",       // Secondary text
    ink3: "#64748b",       // Tertiary text
    line: "#e2e8f0",       // Borders
    lineSoft: "#f1f5f9",   // Subtle borders
    bg: "#ffffff",         // Background
    bgSubtle: "#f8fafc",   // Subtle background
    bgCard: "#ffffff",     // Card background
    
    // Overlay
    overlay: "rgba(0, 0, 0, 0.5)",
    backdropBlur: "rgba(71, 85, 105, 0.2)"
  },
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem" // 30px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75"
  },
  zIndex: {
    dropdown: 50,
    sticky: 40,
    modal: 60,
    drawer: 50,
    tooltip: 70,
    toast: 80
  }
} as const;

// CSS Custom Properties for dynamic theming
export const cssVars = {
  '--font-family-base': tokens.fontFamily.base,
  '--font-family-rtl': tokens.fontFamily.rtl,
  '--color-brand': tokens.color.brand,
  '--color-brand-soft': tokens.color.brandSoft,
  '--color-danger': tokens.color.danger,
  '--color-success': tokens.color.success,
  '--color-warning': tokens.color.warning,
  '--color-ink': tokens.color.ink,
  '--color-ink2': tokens.color.ink2,
  '--color-line': tokens.color.line,
  '--color-bg': tokens.color.bg,
  '--color-bg-subtle': tokens.color.bgSubtle,
  '--radius-sm': `${tokens.radius.sm}px`,
  '--radius-md': `${tokens.radius.md}px`,
  '--radius-lg': `${tokens.radius.lg}px`,
  '--shadow-sm': tokens.shadow.sm,
  '--shadow-md': tokens.shadow.md,
} as const;

// Type definitions
export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radius;
export type ShadowToken = keyof typeof tokens.shadow;
export type FontSizeToken = keyof typeof tokens.fontSize;
export type FontWeightToken = keyof typeof tokens.fontWeight;