import type { CSSProperties, ReactNode } from 'react'
import { Eyebrow } from './primitives'
import { COLORS, FONTS, TYPE_SCALE } from './tokens'

function toneColor(tone: 'default' | 'danger' | 'warning' | 'ok' | 'success' | 'gold' = 'default') {
  if (tone === 'danger' || tone === 'warning') return COLORS.danger
  if (tone === 'ok' || tone === 'success') return COLORS.ok
  if (tone === 'gold') return COLORS.gold
  return COLORS.accent
}

type CalloutProps = {
  kicker?: ReactNode
  children: ReactNode
  tone?: 'default' | 'danger' | 'warning' | 'ok' | 'success' | 'gold'
  style?: CSSProperties
  padding?: CSSProperties['padding']
}

export function Callout({ kicker, children, tone = 'default', style = {}, padding = '28px 0' }: CalloutProps) {
  const accent = toneColor(tone)

  return (
    <div
      style={{
        borderTop: `1px solid ${COLORS.rule}`,
        borderBottom: `1px solid ${COLORS.rule}`,
        padding,
        ...style,
      }}
    >
      {kicker ? <Eyebrow color={accent} style={{ marginBottom: 14 }}>{kicker}</Eyebrow> : null}
      <div style={{ fontFamily: FONTS.serif, fontSize: TYPE_SCALE.bodyLg, color: COLORS.ink, lineHeight: 1.3 }}>
        {children}
      </div>
    </div>
  )
}
