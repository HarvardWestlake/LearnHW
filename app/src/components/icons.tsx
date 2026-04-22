type IconProps = { size?: number; color?: string; className?: string }

const defaults = { size: 32, color: 'currentColor' }

export function IconCpu({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="9" y="9" width="14" height="14" rx="2" />
      <rect x="12" y="12" width="8" height="8" rx="1" />
      <line x1="13" y1="9" x2="13" y2="5" /><line x1="19" y1="9" x2="19" y2="5" />
      <line x1="13" y1="23" x2="13" y2="27" /><line x1="19" y1="23" x2="19" y2="27" />
      <line x1="9" y1="13" x2="5" y2="13" /><line x1="9" y1="19" x2="5" y2="19" />
      <line x1="23" y1="13" x2="27" y2="13" /><line x1="23" y1="19" x2="27" y2="19" />
    </svg>
  )
}

export function IconMemory({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="4" y="8" width="24" height="16" rx="2" />
      <line x1="4" y1="14" x2="28" y2="14" />
      <line x1="4" y1="19" x2="28" y2="19" />
      <line x1="9" y1="8" x2="9" y2="24" />
      <line x1="16" y1="8" x2="16" y2="24" />
      <line x1="23" y1="8" x2="23" y2="24" />
      <line x1="9" y1="5" x2="9" y2="8" /><line x1="14" y1="5" x2="14" y2="8" />
      <line x1="18" y1="5" x2="18" y2="8" /><line x1="23" y1="5" x2="23" y2="8" />
    </svg>
  )
}

export function IconBinary({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="5" y="8" width="8" height="10" rx="2" />
      <line x1="9" y1="18" x2="9" y2="22" />
      <line x1="7" y1="22" x2="11" y2="22" />
      <line x1="19" y1="8" x2="19" y2="22" />
      <line x1="17" y1="8" x2="21" y2="8" />
      <line x1="17" y1="15" x2="21" y2="15" />
    </svg>
  )
}

export function IconStack({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="6" y="6"  width="20" height="6" rx="1.5" />
      <rect x="6" y="15" width="20" height="6" rx="1.5" />
      <line x1="6" y1="26" x2="26" y2="26" />
      <line x1="16" y1="21" x2="16" y2="26" />
    </svg>
  )
}

export function IconHash({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="11" y1="5"  x2="8"  y2="27" />
      <line x1="21" y1="5"  x2="18" y2="27" />
      <line x1="5"  y1="12" x2="27" y2="12" />
      <line x1="4"  y1="20" x2="26" y2="20" />
    </svg>
  )
}

export function IconKey({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="14" r="6" />
      <line x1="17" y1="17" x2="28" y2="28" />
      <line x1="22" y1="22" x2="22" y2="26" />
      <line x1="25" y1="25" x2="25" y2="28" />
    </svg>
  )
}

export function IconLock({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="7" y="15" width="18" height="13" rx="2" />
      <path d="M11 15v-4a5 5 0 0 1 10 0v4" />
      <circle cx="16" cy="22" r="2" fill={color} stroke="none" />
    </svg>
  )
}

export function IconGraph({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="8"  cy="24" r="3" />
      <circle cx="16" cy="8"  r="3" />
      <circle cx="26" cy="18" r="3" />
      <circle cx="24" cy="27" r="3" />
      <line x1="10.5" y1="21.5" x2="13.5" y2="10.5" />
      <line x1="18.5" y1="9.5"  x2="23.5" y2="15.5" />
      <line x1="25"   y1="21"   x2="25"   y2="24.2" />
      <line x1="10.5" y1="24"   x2="21"   y2="26.5" />
    </svg>
  )
}

export function IconGrid({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="4"  y="4"  width="10" height="10" rx="1.5" />
      <rect x="18" y="4"  width="10" height="10" rx="1.5" />
      <rect x="4"  y="18" width="10" height="10" rx="1.5" />
      <rect x="18" y="18" width="10" height="10" rx="1.5" />
    </svg>
  )
}

export function IconFunction({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M10 6c-3 0-4 1.5-4 4v4c0 2-1 3-3 3 2 0 3 1 3 3v4c0 2.5 1 4 4 4" />
      <path d="M22 6c3 0 4 1.5 4 4v4c0 2 1 3 3 3-2 0-3 1-3 3v4c0 2.5-1 4-4 4" />
      <line x1="13" y1="16" x2="19" y2="16" />
      <line x1="16" y1="13" x2="16" y2="19" />
    </svg>
  )
}

export function IconInbox({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="4" y="6" width="24" height="20" rx="2" />
      <path d="M4 19h6l2 3h8l2-3h6" />
      <line x1="16" y1="10" x2="16" y2="16" />
      <polyline points="12 14 16 18 20 14" />
    </svg>
  )
}

export function IconSearch({ size = defaults.size, color = defaults.color, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="14" cy="14" r="8" />
      <line x1="20" y1="20" x2="27" y2="27" />
      <line x1="11" y1="14" x2="17" y2="14" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}
