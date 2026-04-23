export const COLORS = {
  cream: '#F5EFE3',
  creamDark: '#ECE4D2',
  paper: '#FBF7EE',
  ink: '#0F1F3A',
  inkSoft: '#2B3A5B',
  rule: '#C9BFA7',
  ruleFaint: '#E2D9C3',
  accent: '#A8341E',
  accentSoft: '#C96A52',
  gold: '#B8893B',
  muted: '#7E7560',
  danger: '#9B2A1B',
  ok: '#3B6E4A',
} as const

export const TYPE_SCALE = {
  eyebrow: 26,
  small: 26,
  body: 32,
  bodyLg: 36,
  subtitle: 44,
  titleSm: 56,
  title: 72,
  titleLg: 96,
  display: 140,
} as const

export const SPACING = {
  paddingTop: 100,
  paddingBottom: 90,
  paddingX: 120,
  titleGap: 52,
  itemGap: 28,
  sectionGap: 64,
} as const

export const DENSITY = {
  maxBodyWidth: 1300,
  maxWideBodyWidth: 1500,
  maxDiagramWidth: 1560,
  maxCardsPerRow: 3,
  recapGap: 36,
} as const

export const FONTS = {
  serif: '"Source Serif 4", "Source Serif Pro", "Iowan Old Style", Georgia, "Times New Roman", serif',
  sans: '"Inter Tight", "Söhne", "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", "SF Mono", Menlo, Consolas, monospace',
} as const

export const HTCS_TOKENS = { COLORS, TYPE_SCALE, SPACING, DENSITY, FONTS }
