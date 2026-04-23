import type { CSSProperties, ReactNode } from 'react'
import { useDeckMeta } from '../runtime/context'
import { COLORS, FONTS, SPACING, TYPE_SCALE } from './tokens'

type SlideVariant = 'page' | 'paper' | 'ink' | 'bleed'

type SlideFrameProps = {
  variant?: SlideVariant
  pad?: boolean
  footer?: boolean
  children: ReactNode
  style?: CSSProperties
}

type SlideFooterProps = {
  variant?: SlideVariant
  courseLabel?: string
  deckLabel?: string
}

type TextProps = {
  children: ReactNode
  color?: string
  style?: CSSProperties
}

type TitleProps = TextProps & {
  size?: keyof typeof TYPE_SCALE
}

type BodyProps = TextProps & {
  size?: keyof typeof TYPE_SCALE
}

type NumeralProps = {
  n: string | number
  color?: string
  style?: CSSProperties
}

type BulletListProps = {
  items?: ReactNode[]
  children?: ReactNode
  style?: CSSProperties
  gap?: number
}

export function SlideFrame({ variant = 'page', pad = true, footer = true, children, style = {} }: SlideFrameProps) {
  const background = variant === 'ink'
    ? COLORS.ink
    : variant === 'paper'
      ? COLORS.paper
      : COLORS.cream
  const color = variant === 'ink' ? COLORS.paper : COLORS.ink

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background,
        color,
        fontFamily: FONTS.serif,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: pad ? `${SPACING.paddingTop}px ${SPACING.paddingX}px ${SPACING.paddingBottom}px` : 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
      {footer ? <SlideFooter variant={variant} /> : null}
    </div>
  )
}

export function SlideFooter({ variant = 'page', courseLabel, deckLabel }: SlideFooterProps) {
  const meta = useDeckMeta()
  const dim = variant === 'ink' ? 'rgba(245,239,227,0.45)' : COLORS.muted
  const rule = variant === 'ink' ? 'rgba(245,239,227,0.18)' : COLORS.ruleFaint

  return (
    <div
      style={{
        position: 'absolute',
        left: SPACING.paddingX,
        right: SPACING.paddingX,
        bottom: 36,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: FONTS.sans,
        fontSize: 24,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: dim,
        borderTop: `1px solid ${rule}`,
        paddingTop: 18,
      }}
    >
      <span>{courseLabel || meta.courseLabel || 'HTCS'}</span>
      <span>{deckLabel || meta.deckTitle || meta.deckLabel || ''}</span>
    </div>
  )
}

export function Eyebrow({ children, color, style = {} }: TextProps) {
  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        fontSize: TYPE_SCALE.eyebrow,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: color || COLORS.accent,
        marginBottom: 24,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Title({ children, size = 'title', color, style = {} }: TitleProps) {
  const fontSize = TYPE_SCALE[size] || TYPE_SCALE.title

  return (
    <h1
      style={{
        fontFamily: FONTS.serif,
        fontWeight: 500,
        fontSize,
        lineHeight: 1.05,
        letterSpacing: '-0.015em',
        color: color || COLORS.ink,
        margin: 0,
        textAlign: 'left',
        textWrap: 'balance',
        ...style,
      }}
    >
      {children}
    </h1>
  )
}

export function Subtitle({ children, color, style = {} }: TextProps) {
  return (
    <div
      style={{
        fontFamily: FONTS.serif,
        fontStyle: 'italic',
        fontSize: TYPE_SCALE.subtitle,
        lineHeight: 1.2,
        color: color || COLORS.inkSoft,
        margin: 0,
        marginTop: 20,
        textWrap: 'balance',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Body({ children, size = 'body', color, style = {} }: BodyProps) {
  return (
    <div
      style={{
        fontFamily: FONTS.serif,
        fontSize: TYPE_SCALE[size] || TYPE_SCALE.body,
        lineHeight: 1.38,
        color: color || COLORS.inkSoft,
        textWrap: 'pretty',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function Rule({ color, style = {} }: { color?: string; style?: CSSProperties }) {
  return <div style={{ height: 1, background: color || COLORS.rule, width: '100%', ...style }} />
}

export function Mono({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: '0.88em',
        letterSpacing: '-0.01em',
        color: COLORS.ink,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export function Numeral({ n, color, style = {} }: NumeralProps) {
  return (
    <div
      style={{
        fontFamily: FONTS.serif,
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 56,
        color: color || COLORS.accent,
        lineHeight: 1,
        ...style,
      }}
    >
      {String(n).padStart(2, '0')}
    </div>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return <li style={{ marginBottom: 14 }}>{children}</li>
}

export function BulletList({ items, children, style = {}, gap = 14 }: BulletListProps) {
  const renderedChildren = items
    ? items.map((item, index) => <Bullet key={index}>{item}</Bullet>)
    : children

  return (
    <ul
      style={{
        margin: 0,
        paddingLeft: 32,
        display: 'flex',
        flexDirection: 'column',
        gap,
        ...style,
      }}
    >
      {renderedChildren}
    </ul>
  )
}
