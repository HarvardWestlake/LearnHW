import { useState, type CSSProperties, type ReactNode } from 'react'
import { useDeckRenderMode } from '../../runtime/context'
import type { DeckSlideDefinition } from '../../runtime/types'
import { Callout } from '../../shared/patterns'
import { Body, Eyebrow, Numeral, Rule, SlideFrame, Subtitle, Title } from '../../shared/primitives'
import { COLORS, FONTS } from '../../shared/tokens'

const EASE_OUT_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const BITCOIN_ORANGE = '#F7931A'
const EL_SALVADOR_BLUE = '#0F59A8'
const EL_SALVADOR_BLUE_DARK = '#0B376F'
const COFFEE_PRICE_MBTC = 5
const CHANNEL_START_MBTC = 50
const MAX_COFFEES = 9

function useIsStaticDeck() {
  return useDeckRenderMode() === 'static'
}

function motionClass(className: string, isStatic: boolean) {
  return isStatic ? undefined : className
}

function cssVars(values: Record<`--${string}`, string | number>): CSSProperties {
  return values as CSSProperties
}

function formatBtc(mbtc: number) {
  return `${(mbtc / 1000).toFixed(3)} BTC`
}

function IconStamp({ glyph, color }: { glyph: string; color: string }) {
  return (
    <div
      style={{
        width: 82,
        height: 82,
        borderRadius: 41,
        border: `2px solid ${color}`,
        background: COLORS.cream,
        display: 'grid',
        placeItems: 'center',
        fontFamily: FONTS.sans,
        fontSize: 37,
        fontWeight: 800,
        color,
        flex: '0 0 auto',
      }}
    >
      {glyph}
    </div>
  )
}

function CaseTimelineRow({
  marker,
  title,
  children,
  color = EL_SALVADOR_BLUE,
}: {
  marker: string
  title: string
  children: ReactNode
  color?: string
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '132px 1fr', gap: 24, alignItems: 'start' }}>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color,
          paddingTop: 4,
          borderTop: `3px solid ${color}`,
        }}
      >
        {marker}
      </div>
      <div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 28, fontWeight: 700, color: COLORS.ink }}>
          {title}
        </div>
        <Body size="small" style={{ marginTop: 8, fontSize: 28, lineHeight: 1.25 }}>
          {children}
        </Body>
      </div>
    </div>
  )
}

function CaseMetric({
  label,
  value,
  children,
  accent = BITCOIN_ORANGE,
}: {
  label: string
  value: ReactNode
  children: ReactNode
  accent?: string
}) {
  return (
    <div style={{ borderTop: `3px solid ${accent}`, paddingTop: 18 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontSize: 19,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: COLORS.muted,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: FONTS.serif, fontSize: 62, lineHeight: 1, color: COLORS.ink, marginTop: 12 }}>
        {value}
      </div>
      <Body size="small" style={{ marginTop: 12, fontSize: 25, lineHeight: 1.24 }}>
        {children}
      </Body>
    </div>
  )
}

function PaymentAppNode({
  glyph,
  title,
  children,
  accent,
}: {
  glyph: string
  title: string
  children: ReactNode
  accent: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
      <IconStamp glyph={glyph} color={accent} />
      <div style={{ fontFamily: FONTS.sans, fontSize: 31, fontWeight: 700, color: COLORS.ink }}>
        {title}
      </div>
      <Body size="small" style={{ fontSize: 28, lineHeight: 1.27 }}>
        {children}
      </Body>
    </div>
  )
}

function CustodyColumn({
  title,
  accent,
  rows,
}: {
  title: string
  accent: string
  rows: Array<[string, string]>
}) {
  return (
    <div
      style={{
        borderTop: `4px solid ${accent}`,
        paddingTop: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <IconStamp glyph={title === 'Custodial apps' ? 'ID' : 'KEY'} color={accent} />
        <div style={{ fontFamily: FONTS.sans, fontSize: 34, fontWeight: 700, color: COLORS.ink }}>
          {title}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '148px 1fr', gap: 18 }}>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 18,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: accent,
                paddingTop: 7,
              }}
            >
              {label}
            </div>
            <Body size="small" style={{ fontSize: 27, lineHeight: 1.22 }}>
              {value}
            </Body>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReplayableDiagram({
  children,
  buttonSide = 'right',
  style = {},
}: {
  children: ReactNode
  buttonSide?: 'left' | 'right'
  style?: CSSProperties
}) {
  const isStatic = useIsStaticDeck()
  const [replayKey, setReplayKey] = useState(0)

  return (
    <div style={{ position: 'relative', ...style }}>
      <div key={replayKey} style={{ display: 'contents' }}>
        {children}
      </div>
      {!isStatic ? (
        <button
          type="button"
          aria-label="Replay diagram animation"
          onClick={() => setReplayKey((current) => current + 1)}
          style={{
            position: 'absolute',
            top: 0,
            ...(buttonSide === 'left' ? { left: 0 } : { right: 0 }),
            border: `1px solid ${COLORS.rule}`,
            borderRadius: 8,
            background: COLORS.paper,
            color: COLORS.ink,
            cursor: 'pointer',
            fontFamily: FONTS.sans,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '9px 13px',
            boxShadow: '0 8px 18px rgba(15,31,58,0.08)',
            zIndex: 2,
          }}
        >
          Replay
        </button>
      ) : null}
    </div>
  )
}

function Day5MotionStyles() {
  return (
    <style>
      {`
        :root {
          --u6d5-ease-out-quint: ${EASE_OUT_QUINT};
        }

        .u6d5-reveal,
        .u6d5-pop,
        .u6d5-packet,
        .u6d5-signature {
          opacity: 0;
          will-change: transform, opacity;
        }

        .u6d5-reveal {
          transform: translateY(18px);
        }

        .u6d5-pop,
        .u6d5-signature {
          transform: scale(0.94);
          transform-origin: center;
        }

        .u6d5-draw {
          stroke-dasharray: var(--dash, 1000);
          stroke-dashoffset: var(--dash, 1000);
        }

        .u6d5-fly {
          opacity: 0;
          transform: translate(0, 0) scale(0.82);
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .u6d5-cross-copy {
          opacity: 0;
          transform: translate(0, 0) rotate(var(--rotate, 0deg));
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform, opacity;
        }

        section[data-deck-active] .u6d5-reveal {
          animation: u6d5-reveal 560ms var(--u6d5-ease-out-quint) both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d5-pop,
        section[data-deck-active] .u6d5-signature {
          animation: u6d5-pop 520ms var(--u6d5-ease-out-quint) both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d5-draw {
          animation: u6d5-draw 900ms var(--u6d5-ease-out-quint) both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d5-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: u6d5-pulse 1500ms var(--u6d5-ease-out-quint) 2 both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d5-fly {
          animation: u6d5-fly 1150ms var(--u6d5-ease-out-quint) both;
          animation-delay: var(--delay, 120ms);
        }

        section[data-deck-active] .u6d5-cross-copy {
          animation: u6d5-cross-copy 1100ms var(--u6d5-ease-out-quint) both;
          animation-delay: var(--delay, 120ms);
        }

        @keyframes u6d5-reveal {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes u6d5-pop {
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes u6d5-draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes u6d5-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          45% { transform: scale(1.18); opacity: 0.78; }
        }

        @keyframes u6d5-fly {
          0% { opacity: 0; transform: translate(0, 0) scale(0.82); }
          14% { opacity: 1; }
          78% { opacity: 1; transform: translate(var(--tx, 0), var(--ty, 0)) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx, 0), var(--ty, 0)) scale(0.78); }
        }

        @keyframes u6d5-cross-copy {
          0% { opacity: 0; transform: translate(0, 0) rotate(var(--rotate, 0deg)) scale(0.88); }
          15% { opacity: 1; }
          100% { opacity: 1; transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rotate, 0deg)) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .u6d5-reveal,
          .u6d5-pop,
          .u6d5-packet,
          .u6d5-signature,
          .u6d5-fly,
          .u6d5-cross-copy {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }

          .u6d5-draw {
            stroke-dashoffset: 0 !important;
            animation: none !important;
          }

          .u6d5-pulse {
            animation: none !important;
          }
        }
      `}
    </style>
  )
}

function DemoButton({
  children,
  onClick,
  disabled = false,
  tone = 'default',
  style = {},
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  tone?: 'default' | 'ghost' | 'danger' | 'ok'
  style?: CSSProperties
}) {
  const bg = disabled
    ? 'rgba(15,31,58,0.08)'
    : tone === 'danger'
      ? COLORS.danger
      : tone === 'ok'
        ? COLORS.ok
        : tone === 'ghost'
          ? 'transparent'
          : COLORS.ink
  const color = disabled ? COLORS.muted : tone === 'ghost' ? COLORS.ink : COLORS.paper
  const border = tone === 'ghost' ? COLORS.rule : bg

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        border: `2px solid ${border}`,
        borderRadius: 8,
        background: bg,
        color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONTS.sans,
        fontSize: 19,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '13px 22px',
        transition: `background 180ms ${EASE_OUT_QUINT}, color 180ms ${EASE_OUT_QUINT}, transform 140ms ${EASE_OUT_QUINT}, opacity 180ms ${EASE_OUT_QUINT}`,
        opacity: disabled ? 0.55 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function PartDivider({ part, title, subtitle }: { part: string; title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <SlideFrame variant="ink" footer={false}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 26,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            marginBottom: 36,
          }}
        >
          {part}
        </div>
        <Title color={COLORS.paper} size="display" style={{ lineHeight: 0.95, fontSize: 180 }}>
          {title}
        </Title>
        <Subtitle color="rgba(245,239,227,0.75)" style={{ fontSize: 40, marginTop: 48, maxWidth: 1100 }}>
          {subtitle}
        </Subtitle>
      </div>
    </SlideFrame>
  )
}

export function SlideCover() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame variant="bleed" footer={false} pad={false}>
      <Day5MotionStyles />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: '100px 120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 24,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: COLORS.accent,
                marginBottom: 32,
              }}
            >
              Honors Topics in Computer Science
            </div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 40, color: COLORS.inkSoft, marginBottom: 28 }}>
              Day 05
            </div>
            <Title size="titleLg" style={{ fontSize: 110, lineHeight: 0.98 }}>
              Lightning
              <br />
              <span style={{ fontStyle: 'italic', color: COLORS.accent }}>Networks</span>
            </Title>
            <Subtitle style={{ fontSize: 38, marginTop: 40 }}>
              How Bitcoin moves at the speed of light with off-chain payment channels.
            </Subtitle>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 48,
              fontFamily: FONTS.sans,
              fontSize: 24,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: COLORS.muted,
            }}
          >
            <span>HTCS · Unit 6 · Day 05</span>
            <span>lecture + demo</span>
          </div>
        </div>

        <div style={{ background: COLORS.ink, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 60, left: 60, right: 60, bottom: 260 }}>
            <svg width="100%" height="100%" viewBox="0 0 760 580" preserveAspectRatio="xMidYMid meet">
              <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 310, '--delay': '180ms' })} x1="380" y1="290" x2="120" y2="140" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 310, '--delay': '300ms' })} x1="380" y1="290" x2="640" y2="140" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 310, '--delay': '420ms' })} x1="380" y1="290" x2="120" y2="440" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 310, '--delay': '540ms' })} x1="380" y1="290" x2="640" y2="440" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line x1="120" y1="140" x2="640" y2="140" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="120" y1="440" x2="640" y2="440" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="120" y1="140" x2="120" y2="440" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="640" y1="140" x2="640" y2="440" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="380" y1="50" x2="380" y2="290" stroke="rgba(184,137,59,0.28)" strokeWidth="1.5" />
              <line x1="380" y1="290" x2="380" y2="530" stroke="rgba(184,137,59,0.28)" strokeWidth="1.5" />
              <circle className={motionClass('u6d5-pulse', isStatic)} style={cssVars({ '--delay': '720ms' })} cx="380" cy="290" r="20" fill={COLORS.gold} opacity="0.9" />
              <circle className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '820ms' })} cx="120" cy="140" r="13" fill="rgba(184,137,59,0.65)" />
              <circle className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '900ms' })} cx="640" cy="140" r="13" fill="rgba(184,137,59,0.65)" />
              <circle className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '980ms' })} cx="120" cy="440" r="13" fill="rgba(184,137,59,0.65)" />
              <circle className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '1060ms' })} cx="640" cy="440" r="13" fill="rgba(184,137,59,0.65)" />
              <circle cx="380" cy="50" r="9" fill="rgba(184,137,59,0.38)" />
              <circle cx="380" cy="530" r="9" fill="rgba(184,137,59,0.38)" />
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: 60,
              right: 60,
              borderTop: '1px solid rgba(245,239,227,0.35)',
              paddingTop: 24,
              color: COLORS.paper,
              fontFamily: FONTS.serif,
              fontStyle: 'italic',
              fontSize: 32,
              lineHeight: 1.3,
              background: COLORS.ink,
            }}
          >
            “The blockchain settles debts, not coffees.”
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideAgenda() {
  const items = [
    ['01', 'The Problem', 'Why is Bitcoin too slow for everyday payments?'],
    ['02', 'Payment Channels', 'How do two parties trade off-chain without trust?'],
    ['03', 'Channel Mechanics', 'How do signed balance sheets enforce honesty?'],
    ['04', 'The Network', 'How does routing let anyone pay anyone?'],
  ]

  return (
    <SlideFrame>
      <Eyebrow>Today’s agenda</Eyebrow>
      <Title>
        Four questions about <em style={{ fontStyle: 'italic', color: COLORS.accent }}>Lightning.</em>
      </Title>
      <div style={{ marginTop: 50, flex: 1 }}>
        {items.map(([n, title, description], index) => (
          <div
            key={n}
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1.1fr 2fr',
              gap: 34,
              padding: '20px 0',
              borderTop: `1px solid ${COLORS.ruleFaint}`,
              borderBottom: index === items.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
            }}
          >
            <Numeral n={n} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 40 }}>{title}</div>
            <Body size="bodyLg">{description}</Body>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

export function SlidePart1Divider() {
  return (
    <PartDivider
      part="Part 01"
      title={
        <>
          The
          <br />
          Problem.
        </>
      }
      subtitle="Bitcoin processes 7 transactions per second — why does that matter?"
    />
  )
}

export function SlideVisaVsBitcoin() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>Bitcoin vs Visa</Eyebrow>
      <Title>
        a tale of <em style={{ fontStyle: 'italic', color: COLORS.accent }}>two speeds</em>
      </Title>
      <div style={{ marginTop: 42, flex: 1, display: 'grid', gridTemplateRows: '1fr auto', gap: 30, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, minHeight: 0 }}>
          <div
            className={motionClass('u6d5-reveal', isStatic)}
            style={{
              ...cssVars({ '--delay': '80ms' }),
              border: `1px solid ${COLORS.rule}`,
              borderRadius: 8,
              padding: '34px 46px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ fontFamily: FONTS.sans, fontSize: 21, letterSpacing: '0.28em', textTransform: 'uppercase', color: COLORS.muted }}>Visa</div>
            <div className={motionClass('u6d5-pop', isStatic)} style={{ ...cssVars({ '--delay': '480ms' }), fontFamily: FONTS.serif, fontSize: 78, fontWeight: 400, lineHeight: 1, color: COLORS.ink }}>4,000</div>
            <Body size="bodyLg">transactions / second (avg)</Body>
            <Rule />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '720ms' }), fontFamily: FONTS.mono, fontSize: 34, color: COLORS.ok }}>65,000 TPS</span>
              <Body size="body" style={{ color: COLORS.muted }}>peak capacity</Body>
            </div>
          </div>

          <div
            className={motionClass('u6d5-reveal', isStatic)}
            style={{
              ...cssVars({ '--delay': '260ms' }),
              border: `1px solid ${COLORS.rule}`,
              borderRadius: 8,
              padding: '34px 46px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              background: COLORS.creamDark,
            }}
          >
            <div style={{ fontFamily: FONTS.sans, fontSize: 21, letterSpacing: '0.28em', textTransform: 'uppercase', color: COLORS.muted }}>Bitcoin</div>
            <div className={motionClass('u6d5-pop', isStatic)} style={{ ...cssVars({ '--delay': '580ms' }), fontFamily: FONTS.serif, fontSize: 78, fontWeight: 400, lineHeight: 1, color: COLORS.accent }}>7</div>
            <Body size="bodyLg">transactions / second</Body>
            <Rule />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '820ms' }), fontFamily: FONTS.mono, fontSize: 34, color: COLORS.accent }}>1 MB</span>
              <Body size="body" style={{ color: COLORS.muted }}>blocks roughly every 10 minutes</Body>
            </div>
          </div>
        </div>
        <Callout kicker="The bottleneck" padding="18px 0" style={{ maxWidth: 1460 }}>
          Raising the limit seems obvious, but larger blocks mean fewer people can run full nodes. Bitcoin chooses decentralization and security over speed, so faster payments need a layer that does not record every coffee on-chain.
        </Callout>
      </div>
    </SlideFrame>
  )
}

export function SlidePart2Divider() {
  return (
    <PartDivider
      part="Part 02"
      title={
        <>
          Payment
          <br />
          Channels.
        </>
      }
      subtitle="How two parties open a private off-chain ledger and touch the blockchain only to open and close it."
    />
  )
}

export function SlideLightningIntro() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>The solution</Eyebrow>
      <Title>
        Lightning moves payments <em style={{ fontStyle: 'italic', color: COLORS.accent }}>off-chain</em>
      </Title>
      <div style={{ marginTop: 46, flex: 1, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 64, alignItems: 'center', minHeight: 0 }}>
        <div>
          <Body size="bodyLg" style={{ marginBottom: 30 }}>
            The Lightning Network is a second layer built on top of Bitcoin. Instead of writing every payment to the blockchain, two parties open a <em>payment channel</em>: a private, cryptographically secured ledger they update between themselves.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 30 }}>
            To open the channel, Bob locks 0.05 BTC into a 2-of-2 multi-signature address. Neither Bob nor the Coffeeshop can withdraw alone.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 34 }}>
            The blockchain records the funding transaction and the final closing balance; everything in between is off-chain, instant, and nearly free. Think: run a tab, settle once.
          </Body>
        </div>
        <ReplayableDiagram style={{ minHeight: 430, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="430" viewBox="0 0 900 430" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="u6d5-lightning-funding-arrow-accent" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L12,6 L0,12 Z" fill={COLORS.accent} />
              </marker>
              <marker id="u6d5-lightning-funding-arrow-muted" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L12,6 L0,12 Z" fill={COLORS.rule} />
              </marker>
            </defs>

            <rect className={motionClass('u6d5-pulse', isStatic)} style={cssVars({ '--delay': '760ms' })} x="310" y="28" width="280" height="98" rx="8" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="2.5" />
            <text x="450" y="68" textAnchor="middle" fontFamily={FONTS.sans} fontSize="21" letterSpacing="0.14em" fill={COLORS.gold}>
              2-OF-2 MULTI-SIG
            </text>
            <text x="450" y="102" textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="26" fill="rgba(245,239,227,0.7)">
              on-chain escrow
            </text>

            <rect x="40" y="238" width="220" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="150" y="291" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Bob</text>
            <text x="150" y="330" textAnchor="middle" fontFamily={FONTS.mono} fontSize="26" fill={COLORS.accent}>0.05 BTC</text>
            <g className={motionClass('u6d5-fly', isStatic)} style={isStatic ? { opacity: 0 } : cssVars({ '--tx': '300px', '--ty': '-206px', '--delay': '220ms' })}>
              <circle cx="150" cy="254" r="18" fill={COLORS.gold} stroke={COLORS.ink} strokeWidth="2" />
              <text x="150" y="262" textAnchor="middle" fontFamily={FONTS.mono} fontSize="18" fontWeight="700" fill={COLORS.ink}>₿</text>
            </g>

            <rect x="640" y="238" width="220" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="750" y="288" textAnchor="middle" fontFamily={FONTS.serif} fontSize="36" fill={COLORS.ink}>Coffeeshop</text>
            <text x="750" y="328" textAnchor="middle" fontFamily={FONTS.mono} fontSize="26" fill={COLORS.muted}>0 BTC</text>

            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 210, '--delay': '420ms' })} x1="214" y1="222" x2="374" y2="138" stroke={COLORS.accent} strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#u6d5-lightning-funding-arrow-accent)" />
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 210, '--delay': '520ms' })} x1="690" y1="222" x2="526" y2="138" stroke={COLORS.rule} strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#u6d5-lightning-funding-arrow-muted)" />

            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 338, '--delay': '920ms' })} x1="292" y1="294" x2="608" y2="294" stroke={COLORS.accent} strokeWidth="6" strokeLinecap="round" />
            <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '1360ms' })} points="608,281 630,294 608,307" fill={COLORS.accent} />
            <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '1360ms' })} points="292,281 270,294 292,307" fill={COLORS.accent} />
            <text className={motionClass('u6d5-reveal', isStatic)} style={cssVars({ '--delay': '1120ms' })} x="450" y="266" textAnchor="middle" fontFamily={FONTS.sans} fontSize="21" letterSpacing="0.12em" fill={COLORS.muted}>
              PRIVATE PAYMENT CHANNEL
            </text>
            <text className={motionClass('u6d5-reveal', isStatic)} style={cssVars({ '--delay': '1480ms' })} x="450" y="384" textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="26" fill={COLORS.muted}>
              both signatures control the funding anchor
            </text>
          </svg>
        </ReplayableDiagram>
      </div>
    </SlideFrame>
  )
}

export function SlideInitialBalanceSheet() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>The ledger</Eyebrow>
      <Title>
        sign the first sheet, then <em style={{ fontStyle: 'italic', color: COLORS.accent }}>open on-chain</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', gap: 70, alignItems: 'flex-start', marginTop: 46 }}>
        <div style={{ flex: 1 }}>
          <Body size="bodyLg" style={{ marginBottom: 30 }}>
            Before any transactions, both parties agree on the starting state. They each sign a balance sheet and keep a copy.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 34 }}>
            This signed document is legally binding in the blockchain sense: either party can submit it at any time to close the channel and claim the stated funds.
          </Body>
          <Callout kicker="The on-chain event">
            Opening the channel is one Bitcoin transaction: the funding tx. After confirmation, Bob and the Coffeeshop can trade without touching the blockchain again until close.
          </Callout>
        </div>
        <div style={{ width: 540, background: COLORS.ink, borderRadius: 8, padding: '40px 48px' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 32 }}>
            Balance Sheet — Initial
          </div>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 20,
                color: 'rgba(245,239,227,0.55)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Bob will get
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 52, color: COLORS.paper, lineHeight: 1 }}>0.05 BTC</div>
          </div>
          <div style={{ height: 1, background: 'rgba(245,239,227,0.15)', marginBottom: 28 }} />
          <div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 20,
                color: 'rgba(245,239,227,0.55)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Coffeeshop will get
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 52, color: COLORS.paper, lineHeight: 1 }}>0.00 BTC</div>
          </div>
          <div style={{ marginTop: 36, display: 'flex', gap: 12 }}>
            {['Bob signature', 'Shop signature'].map((label, index) => (
              <div
                key={label}
                className={motionClass('u6d5-signature', isStatic)}
                style={{
                  ...cssVars({ '--delay': `${700 + index * 180}ms` }),
                  border: '1px solid rgba(245,239,227,0.26)',
                  borderRadius: 999,
                  padding: '9px 14px',
                  fontFamily: FONTS.sans,
                  fontSize: 17,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,239,227,0.72)',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlidePart3Divider() {
  return (
    <PartDivider
      part="Part 03"
      title={
        <>
          Channel
          <br />
          Mechanics.
        </>
      }
      subtitle="How off-chain balance sheets track state, and why only the latest one counts."
    />
  )
}

export function SlideBobBuysCoffee() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>First transaction</Eyebrow>
      <Title>
        Bob buys coffee, then both sign the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>new sheet</em>
      </Title>
      <div style={{ marginTop: 40, flex: 1, display: 'grid', gridTemplateColumns: '0.88fr 1.12fr', gap: 54, alignItems: 'center', minHeight: 0 }}>
        <div>
          <Body size="bodyLg" style={{ marginBottom: 28 }}>
            Bob wants to pay 0.005 BTC for a coffee. He and the Coffeeshop agree on an updated balance: Bob’s drops from 0.05 to 0.045 BTC; the Coffeeshop’s rises from 0 to 0.005 BTC.
          </Body>
          <Body size="bodyLg" style={{ color: COLORS.accent, marginBottom: 28 }}>
            No blockchain transaction. No miner fee. No waiting for block confirmation. The payment is instant.
          </Body>
          <Callout kicker="The replacement rule" padding="8px 0">
            The old balance sheet is superseded. Both parties write the new balances and sign the replacement.
          </Callout>
        </div>
        <ReplayableDiagram style={{ minHeight: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <svg width="100%" height="230" viewBox="0 0 760 230" preserveAspectRatio="xMidYMid meet">
            <rect x="30" y="42" width="230" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="145" y="94" textAnchor="middle" fontFamily={FONTS.serif} fontSize="40" fill={COLORS.ink}>Bob</text>
            <text x="145" y="132" textAnchor="middle" fontFamily={FONTS.mono} fontSize="27" fill={COLORS.accent}>0.050 → 0.045</text>
            <rect x="500" y="42" width="230" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="615" y="92" textAnchor="middle" fontFamily={FONTS.serif} fontSize="34" fill={COLORS.ink}>Coffeeshop</text>
            <text x="615" y="132" textAnchor="middle" fontFamily={FONTS.mono} fontSize="27" fill={COLORS.ok}>0.000 → 0.005</text>
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 188, '--delay': '180ms' })} x1="286" y1="98" x2="468" y2="98" stroke={COLORS.accent} strokeWidth="5" strokeLinecap="round" />
            <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '780ms' })} points="468,85 490,98 468,111" fill={COLORS.accent} />
            <g className={motionClass('u6d5-fly', isStatic)} style={isStatic ? { opacity: 0 } : cssVars({ '--tx': '470px', '--ty': '0px', '--delay': '250ms' })}>
              <circle cx="145" cy="190" r="22" fill={COLORS.gold} stroke={COLORS.ink} strokeWidth="2" />
              <text x="145" y="198" textAnchor="middle" fontFamily={FONTS.mono} fontSize="19" fontWeight="700" fill={COLORS.ink}>0.005</text>
            </g>
            <text className={motionClass('u6d5-reveal', isStatic)} style={cssVars({ '--delay': '920ms' })} x="380" y="200" textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="25" fill={COLORS.muted}>
              off-chain update, no block
            </text>
          </svg>
          <div style={{ width: 640, background: COLORS.ink, borderRadius: 8, padding: '28px 34px' }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 22 }}>
              Balance Sheet — Updated
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34 }}>
              <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 16, color: 'rgba(245,239,227,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Bob will get
                </div>
                <div className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '1020ms' }), fontFamily: FONTS.mono, fontSize: 27, color: COLORS.muted, textDecoration: 'line-through', lineHeight: 1 }}>0.050 BTC</div>
                <div className={motionClass('u6d5-pop', isStatic)} style={{ ...cssVars({ '--delay': '1260ms' }), fontFamily: FONTS.mono, fontSize: 40, color: COLORS.paper, lineHeight: 1.1, marginTop: 5 }}>0.045 BTC</div>
              </div>
              <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 16, color: 'rgba(245,239,227,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Coffeeshop will get
                </div>
                <div className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '1120ms' }), fontFamily: FONTS.mono, fontSize: 27, color: COLORS.muted, textDecoration: 'line-through', lineHeight: 1 }}>0.000 BTC</div>
                <div className={motionClass('u6d5-pop', isStatic)} style={{ ...cssVars({ '--delay': '1360ms' }), fontFamily: FONTS.mono, fontSize: 40, color: COLORS.paper, lineHeight: 1.1, marginTop: 5 }}>0.005 BTC</div>
              </div>
            </div>
            <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
              {['Bob signs', 'Shop signs'].map((label, index) => (
                <div
                  key={label}
                  className={motionClass('u6d5-signature', isStatic)}
                  style={{
                    ...cssVars({ '--delay': `${1520 + index * 160}ms` }),
                    border: '1px solid rgba(245,239,227,0.26)',
                    borderRadius: 999,
                    padding: '8px 13px',
                    fontFamily: FONTS.sans,
                    fontSize: 15,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,239,227,0.72)',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </ReplayableDiagram>
      </div>
    </SlideFrame>
  )
}

export function SlideExchangingSheets() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>Mutual custody</Eyebrow>
      <Title>
        each party holds the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>other’s</em> signed copy
      </Title>
      <div style={{ marginTop: 48, flex: 1, display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 58, alignItems: 'center' }}>
        <div>
          <Body size="bodyLg" style={{ marginBottom: 38 }}>
            After every update, Bob and the Coffeeshop exchange signed copies of the new balance sheet. Bob holds the Coffeeshop’s signature; the Coffeeshop holds Bob’s.
          </Body>
          <Callout kicker="Why this matters">
            If either party tries to close the channel with an older, more favorable balance sheet, the other can submit their signed copy of the newer state to override it.
          </Callout>
        </div>
        <ReplayableDiagram style={{ minHeight: 430, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="760" height="430" viewBox="0 0 760 430">
          <rect x="40" y="138" width="190" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="135" y="204" textAnchor="middle" fontFamily={FONTS.serif} fontSize="40" fill={COLORS.ink}>Bob</text>
          <rect x="530" y="138" width="190" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="625" y="200" textAnchor="middle" fontFamily={FONTS.serif} fontSize="32" fill={COLORS.ink}>Coffeeshop</text>
          <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 248, '--delay': '180ms' })} x1="256" y1="170" x2="504" y2="170" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" />
          <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 248, '--delay': '300ms' })} x1="504" y1="218" x2="256" y2="218" stroke={COLORS.ok} strokeWidth="4" strokeLinecap="round" />
          <g className={motionClass('u6d5-cross-copy', isStatic)} style={isStatic ? { transform: 'translate(360px, -42px) rotate(-5deg)' } : cssVars({ '--tx': '360px', '--ty': '-42px', '--rotate': '-5deg', '--delay': '340ms' })}>
            <rect x="205" y="260" width="124" height="88" rx="6" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="2" />
            <text x="267" y="296" textAnchor="middle" fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.08em" fill={COLORS.gold}>SHOP SIG</text>
            <text x="267" y="324" textAnchor="middle" fontFamily={FONTS.mono} fontSize="16" fill={COLORS.paper}>0.045 / .005</text>
          </g>
          <g className={motionClass('u6d5-cross-copy', isStatic)} style={isStatic ? { transform: 'translate(-360px, 42px) rotate(5deg)' } : cssVars({ '--tx': '-360px', '--ty': '42px', '--rotate': '5deg', '--delay': '460ms' })}>
            <rect x="432" y="40" width="124" height="88" rx="6" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="2" />
            <text x="494" y="76" textAnchor="middle" fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.08em" fill={COLORS.gold}>BOB SIG</text>
            <text x="494" y="104" textAnchor="middle" fontFamily={FONTS.mono} fontSize="16" fill={COLORS.paper}>0.045 / .005</text>
          </g>
          <text className={motionClass('u6d5-reveal', isStatic)} style={cssVars({ '--delay': '980ms' })} x="380" y="390" textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="28" fill={COLORS.muted}>
            both can prove the latest state
          </text>
        </svg>
        </ReplayableDiagram>
      </div>
    </SlideFrame>
  )
}

export function SlideClosingChannel() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>Settlement</Eyebrow>
      <Title>
        closing the channel <em style={{ fontStyle: 'italic', color: COLORS.accent }}>settles on-chain</em>
      </Title>
      <div style={{ marginTop: 48, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Body size="bodyLg">
            Either party broadcasts the latest signed balance sheet to Bitcoin. The 2-of-2 multi-signature address releases its funds in accordance with the agreed split.
          </Body>
          <Body size="bodyLg">
            The channel closes with one on-chain transaction — regardless of how many payments happened inside it.
          </Body>
          <ReplayableDiagram buttonSide="left" style={{ width: 620, height: 190 }}>
          <svg width="620" height="190" viewBox="0 0 620 190">
            <rect x="18" y="54" width="150" height="86" rx="8" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="2" />
            <text x="93" y="91" textAnchor="middle" fontFamily={FONTS.sans} fontSize="14" letterSpacing="0.1em" fill={COLORS.gold}>LATEST SHEET</text>
            <text x="93" y="119" textAnchor="middle" fontFamily={FONTS.mono} fontSize="17" fill={COLORS.paper}>0.045 / .005</text>
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 226, '--delay': '160ms' })} x1="192" y1="98" x2="418" y2="98" stroke={COLORS.accent} strokeWidth="5" strokeLinecap="round" />
            <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '760ms' })} points="418,84 442,98 418,112" fill={COLORS.accent} />
            <g className={motionClass('u6d5-reveal', isStatic)} style={cssVars({ '--delay': '820ms' })}>
              <rect x="454" y="36" width="140" height="124" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
              <text x="524" y="80" textAnchor="middle" fontFamily={FONTS.serif} fontSize="28" fill={COLORS.ink}>Bitcoin</text>
              <text x="524" y="112" textAnchor="middle" fontFamily={FONTS.sans} fontSize="16" letterSpacing="0.12em" fill={COLORS.muted}>SETTLES</text>
            </g>
          </svg>
          </ReplayableDiagram>
        </div>
        <div style={{ background: COLORS.creamDark, borderRadius: 8, padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted }}>Final settlement</div>
          <div className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '920ms' }), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${COLORS.ruleFaint}` }}>
            <span style={{ fontFamily: FONTS.serif, fontSize: 36, color: COLORS.ink }}>Bob receives</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.ink }}>0.045 BTC</span>
          </div>
          <div className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '1060ms' }), display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${COLORS.ruleFaint}` }}>
            <span style={{ fontFamily: FONTS.serif, fontSize: 36, color: COLORS.ink }}>Coffeeshop receives</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.ink }}>0.005 BTC</span>
          </div>
          <div className={motionClass('u6d5-pop', isStatic)} style={{ ...cssVars({ '--delay': '1220ms' }), fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 28, color: COLORS.muted, marginTop: 8 }}>
            Total on-chain transactions: 2
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideReducedLoad() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>The benefit</Eyebrow>
      <Title>
        fewer transactions on the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>blockchain</em>
      </Title>
      <Callout kicker="100 coffees. 2 blockchain transactions." style={{ marginTop: 52, maxWidth: 1400 }}>
        No matter how many times Bob updates the balance sheet with the Coffeeshop, the blockchain sees exactly two transactions: open and close.
      </Callout>
      <div style={{ marginTop: 44, display: 'grid', gridTemplateColumns: '1fr 220px 1fr', gap: 28, alignItems: 'center', maxWidth: 1360 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
          {Array.from({ length: 30 }, (_, index) => (
            <div
              key={index}
              className={motionClass('u6d5-pop', isStatic)}
              style={{
                ...cssVars({ '--delay': `${Math.min(index * 18, 420)}ms` }),
                height: 22,
                borderRadius: 999,
                background: index % 5 === 0 ? COLORS.gold : 'rgba(184,137,59,0.38)',
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 42, color: COLORS.accent }}>
          collapse to
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {['Open tx', 'Close tx'].map((label, index) => (
            <div
              key={label}
              className={motionClass('u6d5-reveal', isStatic)}
              style={{
                ...cssVars({ '--delay': `${640 + index * 180}ms` }),
                background: COLORS.ink,
                color: COLORS.paper,
                borderRadius: 8,
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 38, color: COLORS.gold }}>{String(index + 1).padStart(2, '0')}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 19, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        This is the throughput breakthrough. The bottleneck never applies because the chain is never involved. Fees are paid once. Confirmation latency is paid once. The channel can run indefinitely.
      </Body>
    </SlideFrame>
  )
}

export function SlideLatestSheetValid() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>Cheating is expensive</Eyebrow>
      <Title>
        only the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>latest</em> balance sheet is valid
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        What stops Bob from broadcasting an older sheet where he had 0.05 BTC instead of 0.045?
      </Body>
      <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1fr 160px 1fr', gap: 28, alignItems: 'center', maxWidth: 1300 }}>
        <div className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '120ms' }), border: `2px solid ${COLORS.danger}`, borderRadius: 8, padding: '22px 28px', background: 'rgba(155,42,27,0.08)' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.danger }}>canceled old sheet</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 34, color: COLORS.ink, marginTop: 10 }}>Bob: 0.050</div>
        </div>
        <div className={motionClass('u6d5-pop', isStatic)} style={{ ...cssVars({ '--delay': '520ms' }), textAlign: 'center', fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 46, color: COLORS.danger }}>rejected</div>
        <div className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': '760ms' }), border: `2px solid ${COLORS.ok}`, borderRadius: 8, padding: '22px 28px', background: 'rgba(59,110,74,0.09)' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.ok }}>penalty claim</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 34, color: COLORS.ink, marginTop: 10 }}>Other party: all channel funds</div>
        </div>
      </div>
      <Callout kicker="The penalty mechanism" style={{ marginTop: 36, maxWidth: 1300 }}>
        Every time both parties sign a new balance sheet, the previous one is revoked — meaning canceled by the newer signed sheet. If that canceled old sheet is broadcast, the other party can prove it and claim the <em>entire channel balance</em> as a penalty, not the cheater's outside wallet.
      </Callout>
    </SlideFrame>
  )
}

export function SlideChannelSimulator() {
  const isStatic = useIsStaticDeck()
  const [coffeeCount, setCoffeeCount] = useState(0)
  const [channelMode, setChannelMode] = useState<'open' | 'closed' | 'cheat'>('open')

  const count = isStatic ? 4 : coffeeCount
  const mode = isStatic ? 'open' : channelMode
  const bobBalance = CHANNEL_START_MBTC - count * COFFEE_PRICE_MBTC
  const shopBalance = count * COFFEE_PRICE_MBTC
  const onChainCount = mode === 'open' ? 1 : 2
  const latestState = `State ${String(count).padStart(2, '0')}`
  const recentRevokedCount = Math.min(Math.max(count - 1, 0), 3)
  const recentRevokedStates = Array.from({ length: recentRevokedCount }, (_, index) => count - recentRevokedCount + index)
  const revokedStates = count > 0 ? Array.from(new Set([0, ...recentRevokedStates])) : []
  const cheatState = 0
  const cheatStateLabel = `State ${String(cheatState).padStart(2, '0')}`
  const displayedState = mode === 'cheat' ? `Old ${cheatStateLabel}` : latestState
  const displayedBobBalance = mode === 'cheat' ? CHANNEL_START_MBTC : bobBalance
  const displayedShopBalance = mode === 'cheat' ? 0 : shopBalance

  const buyCoffee = () => {
    setCoffeeCount((current) => Math.min(current + 1, MAX_COFFEES))
    setChannelMode('open')
  }

  const reset = () => {
    setCoffeeCount(0)
    setChannelMode('open')
  }

  const statusTitle = mode === 'cheat'
    ? `Bob broadcasts old ${cheatStateLabel}`
    : mode === 'closed'
      ? 'Channel settled on-chain'
      : `${count} off-chain update${count === 1 ? '' : 's'}`
  const statusBody = mode === 'cheat'
    ? `He tries to close with a canceled old sheet that pays him ${formatBtc(CHANNEL_START_MBTC)} instead of the latest ${formatBtc(bobBalance)}.`
    : mode === 'closed'
      ? 'The latest signed state settles the channel. The chain saw open and close, not every coffee.'
      : 'The latest sheet is valid. Cheating would mean broadcasting a canceled old copy instead.'

  return (
    <SlideFrame footer={false}>
      <Eyebrow>Interactive demo</Eyebrow>
      <Title>
        run the channel, then try to <em style={{ fontStyle: 'italic', color: COLORS.accent }}>broadcast an old state.</em>
      </Title>

      <div style={{ marginTop: 24, flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr', gap: 34, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <div style={{ borderTop: `2px solid ${mode === 'cheat' ? COLORS.danger : mode === 'closed' ? COLORS.ok : COLORS.accent}`, borderBottom: `1px solid ${COLORS.rule}`, padding: '16px 0 18px' }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: mode === 'cheat' ? COLORS.danger : COLORS.muted }}>
              Channel state
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 42, lineHeight: 1.05, color: COLORS.ink, marginTop: 10 }}>{statusTitle}</div>
            <Body size="body" style={{ marginTop: 10, fontSize: 27, lineHeight: 1.22 }}>{statusBody}</Body>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `1px solid ${COLORS.ruleFaint}`, paddingTop: 12 }}>
              <span style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted }}>Blockchain tx count</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: onChainCount === 2 ? COLORS.ok : COLORS.accent }}>{onChainCount}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: COLORS.ink, color: COLORS.paper, borderRadius: 8, padding: '15px 18px' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 15, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.gold }}>Bob</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 26, marginTop: 6 }}>{formatBtc(bobBalance)}</div>
            </div>
            <div style={{ background: COLORS.ink, color: COLORS.paper, borderRadius: 8, padding: '15px 18px' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 15, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.gold }}>Coffeeshop</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 26, marginTop: 6 }}>{formatBtc(shopBalance)}</div>
            </div>
          </div>

          <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 8, padding: '12px 16px', background: count > 0 ? 'rgba(155,42,27,0.06)' : 'transparent' }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 15, letterSpacing: '0.16em', textTransform: 'uppercase', color: count > 0 ? COLORS.danger : COLORS.muted }}>
              Cheat attempt
            </div>
            <Body size="small" style={{ marginTop: 6, fontSize: 22, lineHeight: 1.16 }}>
              {count > 0
                ? `Bob submits canceled ${cheatStateLabel} on-chain, pretending the coffee payments never happened.`
                : 'Buy a coffee first, so there is an older state to misuse.'}
            </Body>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <DemoButton onClick={buyCoffee} disabled={isStatic || mode !== 'open' || count >= MAX_COFFEES} style={{ fontSize: 15, padding: '10px 12px' }}>Buy Coffee</DemoButton>
            <DemoButton onClick={() => setChannelMode('closed')} disabled={isStatic || mode !== 'open'} tone="ok" style={{ fontSize: 15, padding: '10px 12px' }}>Close Channel</DemoButton>
            <DemoButton onClick={() => setChannelMode('cheat')} disabled={isStatic || mode !== 'open' || count === 0} tone="danger" style={{ fontSize: 15, padding: '10px 12px' }}>Broadcast Old State</DemoButton>
            <DemoButton onClick={reset} disabled={isStatic} tone="ghost" style={{ fontSize: 15, padding: '10px 12px' }}>Reset</DemoButton>
          </div>

        </div>

        <div style={{ minHeight: 0, display: 'grid', gridTemplateRows: '280px 1fr', gap: 20 }}>
          <svg width="100%" height="280" viewBox="0 0 980 280" preserveAspectRatio="xMidYMid meet">
            <rect x="40" y="76" width="210" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="145" y="132" textAnchor="middle" fontFamily={FONTS.serif} fontSize="38" fill={COLORS.ink}>Bob</text>
            <text x="145" y="166" textAnchor="middle" fontFamily={FONTS.mono} fontSize="24" fill={COLORS.accent}>{formatBtc(bobBalance)}</text>

            <rect x="730" y="76" width="210" height="112" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="835" y="130" textAnchor="middle" fontFamily={FONTS.serif} fontSize="32" fill={COLORS.ink}>Coffeeshop</text>
            <text x="835" y="166" textAnchor="middle" fontFamily={FONTS.mono} fontSize="24" fill={COLORS.ok}>{formatBtc(shopBalance)}</text>

            <line x1="250" y1="132" x2="730" y2="132" stroke={mode === 'cheat' ? COLORS.danger : COLORS.accent} strokeWidth="6" strokeLinecap="round" />
            <text x="490" y="104" textAnchor="middle" fontFamily={FONTS.sans} fontSize="19" letterSpacing="0.14em" fill={mode === 'cheat' ? COLORS.danger : COLORS.muted}>
              {mode === 'cheat' ? 'BOB SUBMITS CANCELED COPY' : 'PRIVATE PAYMENT CHANNEL'}
            </text>

            {count > 0 ? (
              <g className={motionClass('u6d5-fly', isStatic)} style={isStatic ? { opacity: 0 } : cssVars({ '--tx': '690px', '--ty': '0px', '--delay': '80ms' })}>
                <circle cx="145" cy="222" r="20" fill={COLORS.gold} stroke={COLORS.ink} strokeWidth="2" />
                <text x="145" y="229" textAnchor="middle" fontFamily={FONTS.mono} fontSize="14" fontWeight="700" fill={COLORS.ink}>coffee</text>
              </g>
            ) : null}

            <g className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '540ms' })}>
              <rect x="370" y="172" width="240" height="68" rx="8" fill={mode === 'cheat' ? COLORS.danger : COLORS.ink} />
              <text x="490" y="201" textAnchor="middle" fontFamily={FONTS.sans} fontSize="15" letterSpacing="0.12em" fill={COLORS.gold}>{displayedState}</text>
              <text x="490" y="226" textAnchor="middle" fontFamily={FONTS.mono} fontSize="16" fill={COLORS.paper}>
                {formatBtc(displayedBobBalance)} / {formatBtc(displayedShopBalance)}
              </text>
            </g>
          </svg>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, minHeight: 0 }}>
            <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 8, padding: '20px 22px', minHeight: 0 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 17, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 14 }}>
                Revoked old states
              </div>
              <Body size="small" style={{ fontSize: 22, lineHeight: 1.16, marginBottom: 14, color: COLORS.muted }}>
                “Revoked” means canceled by a newer signed state.
              </Body>
              {revokedStates.length === 0 ? (
                <Body size="body" style={{ color: COLORS.muted }}>No revoked sheets yet. Buy a coffee to create a replacement state.</Body>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {revokedStates.map((state) => (
                    <div key={state} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.ruleFaint}`, paddingBottom: 8 }}>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted }}>State {String(state).padStart(2, '0')}</span>
                      <span style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.danger }}>
                        {mode === 'cheat' && state === cheatState ? 'attempted' : 'revoked'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ border: `2px solid ${mode === 'cheat' ? COLORS.danger : COLORS.ok}`, borderRadius: 8, padding: '20px 22px', background: mode === 'cheat' ? 'rgba(155,42,27,0.08)' : 'rgba(59,110,74,0.08)' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 17, letterSpacing: '0.16em', textTransform: 'uppercase', color: mode === 'cheat' ? COLORS.danger : COLORS.ok, marginBottom: 14 }}>
                Valid outcome
              </div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 36, lineHeight: 1.05, color: COLORS.ink }}>
                {mode === 'cheat' ? 'Penalty claim wins.' : 'Latest sheet wins.'}
              </div>
              <Body size="body" style={{ marginTop: 12 }}>
                {mode === 'cheat'
                  ? "The canceled old sheet is proof of cheating. The Coffeeshop can take all the funds locked in this channel, but not Bob's outside wallet."
                  : 'Only the newest mutually signed sheet can safely close the channel.'}
              </Body>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlidePart4Divider() {
  return (
    <PartDivider
      part="Part 04"
      title={
        <>
          The
          <br />
          Network.
        </>
      }
      subtitle="How channels chain together so anyone can pay anyone without a direct channel."
    />
  )
}

export function SlideAliceBobChannel() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>Expanding the network</Eyebrow>
      <Title>
        Alice and Bob open their own <em style={{ fontStyle: 'italic', color: COLORS.accent }}>channel</em>
      </Title>
      <ReplayableDiagram style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="1000" height="260" viewBox="0 0 1000 260">
          <rect x="40" y="70" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="160" y="140" textAnchor="middle" fontFamily={FONTS.serif} fontSize="46" fill={COLORS.ink}>Alice</text>
          <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 348, '--delay': '180ms' })} x1="316" y1="130" x2="664" y2="130" stroke={COLORS.accent} strokeWidth="6" strokeLinecap="round" />
          <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '780ms' })} points="664,117 686,130 664,143" fill={COLORS.accent} />
          <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '780ms' })} points="316,117 294,130 316,143" fill={COLORS.accent} />
          <text x="480" y="103" textAnchor="middle" fontFamily={FONTS.sans} fontSize="26" letterSpacing="0.12em" fill={COLORS.muted}>
            PAYMENT CHANNEL
          </text>
          <rect x="700" y="70" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="820" y="140" textAnchor="middle" fontFamily={FONTS.serif} fontSize="46" fill={COLORS.ink}>Bob</text>
        </svg>
      </ReplayableDiagram>
      <Body size="bodyLg" style={{ maxWidth: 1300, marginBottom: 28 }}>
        Alice funds her own payment channel with Bob. Bob, in turn, already has a channel with the Coffeeshop. The network is beginning to form.
      </Body>
    </SlideFrame>
  )
}

export function SlideAliceToShop() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>Routing</Eyebrow>
      <Title size="titleSm" style={{ fontSize: 66, maxWidth: 1500 }}>
        Alice can pay through Bob <em style={{ fontStyle: 'italic', color: COLORS.accent }}>without trusting Bob</em>
      </Title>
      <div style={{ marginTop: 34, flex: 1, display: 'grid', gridTemplateRows: '250px auto', gap: 30, minHeight: 0 }}>
        <ReplayableDiagram style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="1560" height="250" viewBox="0 0 1560 250">
            <rect x="30" y="55" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.accent} strokeWidth="2.5" />
            <text x="150" y="118" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Alice</text>
            <text x="150" y="158" textAnchor="middle" fontFamily={FONTS.mono} fontSize="26" fill={COLORS.accent}>(has BTC)</text>
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 228, '--delay': '120ms' })} x1="302" y1="115" x2="530" y2="115" stroke={COLORS.accent} strokeWidth="5" strokeLinecap="round" />
            <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '620ms' })} points="530,102 552,115 530,128" fill={COLORS.accent} />
            <text x="405" y="95" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>channel</text>
            <rect x="562" y="55" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="682" y="118" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Bob</text>
            <text x="682" y="158" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>(routes)</text>
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 228, '--delay': '720ms' })} x1="834" y1="115" x2="1062" y2="115" stroke={COLORS.accent} strokeWidth="5" strokeLinecap="round" strokeDasharray="14,7" />
            <polygon className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '1220ms' })} points="1062,102 1084,115 1062,128" fill={COLORS.accent} />
            <text x="937" y="95" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>channel</text>
            <g className={motionClass('u6d5-fly', isStatic)} style={isStatic ? { opacity: 0 } : cssVars({ '--tx': '1160px', '--ty': '0px', '--delay': '260ms' })}>
              <circle cx="150" cy="206" r="17" fill={COLORS.gold} stroke={COLORS.ink} strokeWidth="2" />
              <text x="150" y="212" textAnchor="middle" fontFamily={FONTS.mono} fontSize="14" fontWeight="700" fill={COLORS.ink}>pay</text>
            </g>
            <rect x="1094" y="55" width="430" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="1309" y="118" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Coffeeshop</text>
            <text x="1309" y="158" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>(destination)</text>
          </svg>
        </ReplayableDiagram>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 36, maxWidth: 1560 }}>
          {[
            ['01', 'Alice locks the BTC', 'with a hash that only the Coffeeshop can unlock.'],
            ['02', 'Coffeeshop reveals the secret', 'and proves the payment reached the destination.'],
            ['03', 'Bob earns the route fee', 'only if the secret propagates back through the path.'],
          ].map(([n, title, description], index) => (
            <div key={n} className={motionClass('u6d5-reveal', isStatic)} style={{ ...cssVars({ '--delay': `${1380 + index * 220}ms` }), borderTop: `2px solid ${COLORS.accent}`, paddingTop: 18 }}>
              <Numeral n={n} style={{ fontSize: 38, marginBottom: 10 }} />
              <div style={{ fontFamily: FONTS.serif, fontSize: 33, color: COLORS.ink, marginBottom: 10 }}>{title}</div>
              <Body size="body" style={{ fontSize: 25, lineHeight: 1.24 }}>{description}</Body>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}

const HTLC_STEPS = [
  ['Ready', 'Alice wants to pay the Coffeeshop, but Bob should not be trusted with the money.'],
  ['Lock forward', 'Alice locks the payment with a hash. Bob can only claim if he forwards the same locked payment.'],
  ['Reveal backward', 'The Coffeeshop reveals the secret preimage to claim payment, and that secret flows back.'],
  ['Settle', 'Bob forwards successfully, collects a tiny fee, and both channels update atomically.'],
] as const

export function SlideHtlcRoutingDemo() {
  const isStatic = useIsStaticDeck()
  const [step, setStep] = useState(0)
  const phase = isStatic ? HTLC_STEPS.length - 1 : step
  const paymentX = phase === 0 ? 0 : phase === 1 ? 350 : 690
  const secretX = phase < 2 ? 690 : phase === 2 ? 350 : 0

  return (
    <SlideFrame footer={false}>
      <Eyebrow>Interactive demo</Eyebrow>
      <Title>
        HTLCs make the route <em style={{ fontStyle: 'italic', color: COLORS.accent }}>atomic.</em>
      </Title>

      <div style={{ marginTop: 34, flex: 1, display: 'grid', gridTemplateColumns: '1fr 430px', gap: 36, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <svg width="100%" height="500" viewBox="0 0 1040 500" preserveAspectRatio="xMidYMid meet">
            <rect x="40" y="170" width="210" height="116" rx="8" fill={COLORS.creamDark} stroke={phase >= 1 ? COLORS.accent : COLORS.rule} strokeWidth="2.5" />
            <text x="145" y="228" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Alice</text>
            <text x="145" y="262" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={COLORS.muted}>sender</text>

            <rect x="415" y="170" width="210" height="116" rx="8" fill={COLORS.creamDark} stroke={phase >= 1 ? COLORS.gold : COLORS.rule} strokeWidth="2.5" />
            <text x="520" y="228" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Bob</text>
            <text x="520" y="262" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={COLORS.muted}>router</text>

            <rect x="790" y="170" width="210" height="116" rx="8" fill={COLORS.creamDark} stroke={phase >= 2 ? COLORS.ok : COLORS.rule} strokeWidth="2.5" />
            <text x="895" y="225" textAnchor="middle" fontFamily={FONTS.serif} fontSize="34" fill={COLORS.ink}>Coffeeshop</text>
            <text x="895" y="262" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={COLORS.muted}>receiver</text>

            <line x1="250" y1="218" x2="415" y2="218" stroke={phase >= 1 ? COLORS.accent : COLORS.ruleFaint} strokeWidth="6" strokeLinecap="round" />
            <line x1="625" y1="218" x2="790" y2="218" stroke={phase >= 1 ? COLORS.accent : COLORS.ruleFaint} strokeWidth="6" strokeLinecap="round" />
            <line x1="790" y1="254" x2="625" y2="254" stroke={phase >= 2 ? COLORS.ok : COLORS.ruleFaint} strokeWidth="5" strokeLinecap="round" strokeDasharray="12,8" />
            <line x1="415" y1="254" x2="250" y2="254" stroke={phase >= 2 ? COLORS.ok : COLORS.ruleFaint} strokeWidth="5" strokeLinecap="round" strokeDasharray="12,8" />

            <g
              style={{
                opacity: phase >= 1 ? 1 : 0.18,
                transform: `translateX(${paymentX}px)`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transition: `transform 420ms ${EASE_OUT_QUINT}, opacity 220ms ${EASE_OUT_QUINT}`,
              }}
            >
              <rect x="108" y="84" width="152" height="56" rx="28" fill={COLORS.ink} />
              <text x="184" y="119" textAnchor="middle" fontFamily={FONTS.sans} fontSize="17" letterSpacing="0.1em" fill={COLORS.gold}>HASH LOCK</text>
            </g>

            <g
              style={{
                opacity: phase >= 2 ? 1 : 0,
                transform: `translateX(${secretX}px)`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transition: `transform 420ms ${EASE_OUT_QUINT}, opacity 220ms ${EASE_OUT_QUINT}`,
              }}
            >
              <rect x="108" y="330" width="152" height="56" rx="28" fill={COLORS.ok} />
              <text x="184" y="365" textAnchor="middle" fontFamily={FONTS.sans} fontSize="17" letterSpacing="0.1em" fill={COLORS.paper}>SECRET</text>
            </g>

            {phase >= 3 ? (
              <g className={motionClass('u6d5-pop', isStatic)}>
                <rect x="435" y="56" width="170" height="62" rx="8" fill={COLORS.gold} />
                <text x="520" y="94" textAnchor="middle" fontFamily={FONTS.sans} fontSize="19" letterSpacing="0.12em" fill={COLORS.ink}>BOB FEE</text>
              </g>
            ) : null}

            <text x="332" y="194" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={phase >= 1 ? COLORS.accent : COLORS.muted}>same hash</text>
            <text x="708" y="194" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={phase >= 1 ? COLORS.accent : COLORS.muted}>same hash</text>
            <text x="332" y="292" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={phase >= 2 ? COLORS.ok : COLORS.muted}>preimage returns</text>
            <text x="708" y="292" textAnchor="middle" fontFamily={FONTS.sans} fontSize="18" fill={phase >= 2 ? COLORS.ok : COLORS.muted}>preimage returns</text>
          </svg>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 6 }}>
            <DemoButton onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={isStatic || phase === 0} tone="ghost">Back</DemoButton>
            <DemoButton onClick={() => setStep((current) => Math.min(HTLC_STEPS.length - 1, current + 1))} disabled={isStatic || phase === HTLC_STEPS.length - 1}>Next Step</DemoButton>
            <DemoButton onClick={() => setStep(0)} disabled={isStatic} tone="ghost">Reset</DemoButton>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          {HTLC_STEPS.map(([label, description], index) => {
            const active = index === phase
            const done = index < phase
            const color = active ? COLORS.accent : done ? COLORS.ok : COLORS.muted
            return (
              <div
                key={label}
                style={{
                  border: `2px solid ${active ? color : COLORS.ruleFaint}`,
                  borderRadius: 8,
                  padding: '12px 16px',
                  background: active ? 'rgba(168,52,30,0.08)' : done ? 'rgba(59,110,74,0.07)' : 'transparent',
                  transition: `background 180ms ${EASE_OUT_QUINT}, border-color 180ms ${EASE_OUT_QUINT}`,
                }}
              >
                <div style={{ fontFamily: FONTS.mono, fontSize: 15, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
                  {String(index + 1).padStart(2, '0')} {label}
                </div>
                <Body size="body" style={{ marginTop: 6, fontSize: 25, lineHeight: 1.25 }}>{description}</Body>
              </div>
            )
          })}

          <div style={{ borderTop: `1px solid ${COLORS.rule}`, paddingTop: 12, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 26, lineHeight: 1.2, color: COLORS.ink }}>
            Bob only gets paid if the Coffeeshop proves delivery.
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideNetworkMap() {
  const isStatic = useIsStaticDeck()

  return (
    <SlideFrame>
      <Eyebrow>At scale</Eyebrow>
      <Title>
        a web of channels routes <em style={{ fontStyle: 'italic', color: COLORS.accent }}>any payment</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', gap: 80, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <Body size="bodyLg" style={{ marginBottom: 36 }}>
            Every node opens channels with a few neighbors. Routing algorithms find a path through the web to deliver payments anywhere — instantly, with tiny fees.
          </Body>
          <Body size="bodyLg">
            Person A and Person B don’t need a direct channel. They just need a connected path. The blockchain never sees a single intermediate hop.
          </Body>
        </div>
        <ReplayableDiagram style={{ width: 580 }}>
          <svg width="580" height="500" viewBox="0 0 580 500">
            <line x1="290" y1="250" x2="100" y2="110" stroke="rgba(184,137,59,0.32)" strokeWidth="2" />
            <line x1="290" y1="250" x2="480" y2="110" stroke="rgba(184,137,59,0.32)" strokeWidth="2" />
            <line x1="290" y1="250" x2="100" y2="390" stroke="rgba(184,137,59,0.32)" strokeWidth="2" />
            <line x1="290" y1="250" x2="480" y2="390" stroke="rgba(184,137,59,0.32)" strokeWidth="2" />
            <line x1="100" y1="110" x2="480" y2="110" stroke="rgba(184,137,59,0.2)" strokeWidth="1.5" />
            <line x1="100" y1="390" x2="480" y2="390" stroke="rgba(184,137,59,0.2)" strokeWidth="1.5" />
            <line x1="100" y1="110" x2="100" y2="390" stroke="rgba(184,137,59,0.2)" strokeWidth="1.5" />
            <line x1="480" y1="110" x2="480" y2="390" stroke="rgba(184,137,59,0.2)" strokeWidth="1.5" />
            <line x1="290" y1="40" x2="290" y2="250" stroke="rgba(184,137,59,0.2)" strokeWidth="1.5" />
            <line x1="290" y1="250" x2="290" y2="460" stroke="rgba(184,137,59,0.2)" strokeWidth="1.5" />
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 240, '--delay': '160ms' })} x1="100" y1="110" x2="290" y2="250" stroke={COLORS.accent} strokeWidth="4.5" />
            <line className={motionClass('u6d5-draw', isStatic)} style={cssVars({ '--dash': 240, '--delay': '720ms' })} x1="290" y1="250" x2="480" y2="390" stroke={COLORS.accent} strokeWidth="4.5" />
            <circle className={motionClass('u6d5-pulse', isStatic)} style={cssVars({ '--delay': '620ms' })} cx="290" cy="250" r="17" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="3" />
            <circle className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '260ms' })} cx="100" cy="110" r="15" fill={COLORS.accent} />
            <circle className={motionClass('u6d5-pop', isStatic)} style={cssVars({ '--delay': '1260ms' })} cx="480" cy="390" r="15" fill={COLORS.ok} />
            <circle cx="480" cy="110" r="10" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <circle cx="100" cy="390" r="10" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <circle cx="290" cy="40" r="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <circle cx="290" cy="460" r="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="100" y="82" textAnchor="middle" fontFamily={FONTS.sans} fontSize="24" fill={COLORS.ink} fontWeight="600">Person A</text>
            <text x="480" y="422" textAnchor="middle" fontFamily={FONTS.sans} fontSize="24" fill={COLORS.ink} fontWeight="600">Person B</text>
          </svg>
        </ReplayableDiagram>
      </div>
    </SlideFrame>
  )
}

export function SlideElSalvadorStatus() {
  return (
    <SlideFrame>
      <Eyebrow color={EL_SALVADOR_BLUE}>Case study</Eyebrow>
      <Title size="titleSm" style={{ fontSize: 66, maxWidth: 1500 }}>
        El Salvador’s Bitcoin experiment changed shape
      </Title>

      <div style={{ marginTop: 38, display: 'grid', gridTemplateColumns: '1.13fr 0.87fr', gap: 74, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 26 }}>
          <CaseTimelineRow marker="2021" title="First national Bitcoin law" color={BITCOIN_ORANGE}>
            El Salvador adopted Bitcoin alongside the U.S. dollar, hoping to expand financial access, lower remittance costs, and attract investment.
          </CaseTimelineRow>
          <CaseTimelineRow marker="2025" title="IMF reforms narrow the experiment">
            Private-sector acceptance becomes voluntary, taxes are paid in USD, and the government’s Chivo role is being unwound.
          </CaseTimelineRow>
          <CaseTimelineRow marker="2026" title="Still visible, less everyday">
            Bitcoin remains part of the national story, but daily payments are still niche; most people price and pay in U.S. dollars.
          </CaseTimelineRow>
        </div>

        <div style={{ display: 'grid', gap: 32 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '26px 1fr',
              gap: 22,
              alignItems: 'stretch',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                background: `linear-gradient(${EL_SALVADOR_BLUE} 0 31%, ${COLORS.paper} 31% 69%, ${EL_SALVADOR_BLUE} 69% 100%)`,
                border: `1px solid ${COLORS.rule}`,
              }}
            />
            <CaseMetric label="Public reserve" value={<>~7,600 <span style={{ fontSize: 35 }}>BTC</span></>}>
              The public ONBTC wallet balance changes over time, so treat the number as a live snapshot.
            </CaseMetric>
          </div>

          <CaseMetric label="Everyday use" value="Niche" accent={EL_SALVADOR_BLUE}>
            Research and surveys show low, concentrated use after the initial Chivo launch push.
          </CaseMetric>
        </div>
      </div>

      <Callout kicker="Key takeaway" padding="20px 0" style={{ marginTop: 34 }}>
        Bold experiment, more pragmatic playbook.
      </Callout>
    </SlideFrame>
  )
}

export function SlideElSalvadorLightningApps() {
  return (
    <SlideFrame>
      <Eyebrow color={EL_SALVADOR_BLUE}>Lightning in practice</Eyebrow>
      <Title size="titleSm" style={{ fontSize: 66, maxWidth: 1500 }}>
        fast Bitcoin payments come from apps, not blocks
      </Title>

      <div style={{ marginTop: 46, position: 'relative' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 42,
            left: 64,
            right: 64,
            height: 3,
            background: `linear-gradient(90deg, ${BITCOIN_ORANGE}, ${EL_SALVADOR_BLUE})`,
            opacity: 0.35,
          }}
        />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 58 }}>
          <PaymentAppNode glyph="⚡" title="Lightning Network" accent={BITCOIN_ORANGE}>
            The practical payment layer: fast settlement, tiny fees, and no need to wait for a Bitcoin block.
          </PaymentAppNode>
          <PaymentAppNode glyph="S" title="Strike" accent={EL_SALVADOR_BLUE}>
            A major private Lightning app for remittances and merchant payments, especially where users want familiar logins.
          </PaymentAppNode>
          <PaymentAppNode glyph="CH" title="Chivo Wallet" accent={EL_SALVADOR_BLUE_DARK}>
            The government wallet still exists, but the IMF program pushes the public sector to unwind its role.
          </PaymentAppNode>
        </div>
      </div>

      <Callout kicker="Key takeaway" padding="20px 0" style={{ marginTop: 46 }}>
        Private apps now carry the practical user experience while the government role shrinks.
      </Callout>
    </SlideFrame>
  )
}

export function SlideElSalvadorCustody() {
  return (
    <SlideFrame>
      <Eyebrow color={BITCOIN_ORANGE}>Custody warning</Eyebrow>
      <Title size="titleSm" style={{ fontSize: 66, maxWidth: 1500 }}>
        convenient wallets are not the same as owning keys
      </Title>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 74, alignItems: 'start' }}>
        <CustodyColumn
          title="Custodial apps"
          accent={EL_SALVADOR_BLUE}
          rows={[
            ['Examples', 'Chivo and Strike balances are held through a provider-controlled account.'],
            ['Keys', 'The provider manages the private keys; users rely on account login and recovery.'],
            ['Seed', 'No 12-word seed phrase is issued for balances kept inside the app.'],
          ]}
        />
        <CustodyColumn
          title="Self-custody"
          accent={BITCOIN_ORANGE}
          rows={[
            ['Control', 'You hold the wallet seed or private keys, so you control spending.'],
            ['Recovery', 'The seed phrase is the backup; losing it can mean losing the bitcoin.'],
            ['Use case', 'Better for larger balances after the user learns secure backup habits.'],
          ]}
        />
      </div>

      <Callout kicker="Key takeaway" tone="warning" padding="20px 0" style={{ marginTop: 42 }}>
        “Not your keys, not your coins.” Apps are convenient for spending; self-custody is the control model.
      </Callout>
    </SlideFrame>
  )
}

export function SlideRecap() {
  return (
    <SlideFrame>
      <Eyebrow>Takeaways</Eyebrow>
      <Title>
        How to explain Lightning <em style={{ fontStyle: 'italic', color: COLORS.accent }}>in one minute.</em>
      </Title>
      <Callout kicker="Mental model" style={{ marginTop: 42 }}>
        Lightning opens a 2-of-2 multi-sig channel on-chain, then lets both parties exchange signed balance sheets off-chain indefinitely. Only the final close transaction settles on Bitcoin.
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 36 }}>
        The network of channels turns this into a payment layer for the entire world — anyone can pay anyone by routing through whoever is already connected, with HTLCs making each hop trustless.
      </Body>
    </SlideFrame>
  )
}

export function SlideNextClass() {
  return (
    <SlideFrame variant="ink" footer={false}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, letterSpacing: '0.26em', textTransform: 'uppercase', color: COLORS.gold }}>Next class</div>
        <Title color={COLORS.paper} size="titleLg" style={{ marginTop: 24, fontSize: 118, lineHeight: 0.97 }}>
          Smart Contracts
          <br />
          <em style={{ fontStyle: 'italic' }}>&amp; Ethereum</em>
        </Title>
        <Subtitle color="rgba(245,239,227,0.75)" style={{ marginTop: 36, fontSize: 36, maxWidth: 1200 }}>
          If Bitcoin scripts verify signatures, what happens when the script can do anything a programming language can express?
        </Subtitle>
      </div>
    </SlideFrame>
  )
}

export const DAY5_SLIDES: DeckSlideDefinition[] = [
  { label: 'Cover', Component: SlideCover },
  { label: 'Agenda', Component: SlideAgenda },
  { label: 'Part 01', Component: SlidePart1Divider },
  { label: 'Visa vs Bitcoin', Component: SlideVisaVsBitcoin },
  { label: 'Part 02', Component: SlidePart2Divider },
  { label: 'Lightning Intro', Component: SlideLightningIntro },
  { label: 'Balance Sheet', Component: SlideInitialBalanceSheet },
  { label: 'Part 03', Component: SlidePart3Divider },
  { label: 'Bob Buys Coffee', Component: SlideBobBuysCoffee },
  { label: 'Exchanging Sheets', Component: SlideExchangingSheets },
  { label: 'Closing Channel', Component: SlideClosingChannel },
  { label: 'Reduced Load', Component: SlideReducedLoad },
  { label: 'Latest Sheet Valid', Component: SlideLatestSheetValid },
  { label: 'Channel Simulator', Component: SlideChannelSimulator },
  { label: 'Part 04', Component: SlidePart4Divider },
  { label: 'Alice-Bob Channel', Component: SlideAliceBobChannel },
  { label: 'Alice to Coffeeshop', Component: SlideAliceToShop },
  { label: 'HTLC Routing Demo', Component: SlideHtlcRoutingDemo },
  { label: 'Network Map', Component: SlideNetworkMap },
  { label: 'El Salvador Status', Component: SlideElSalvadorStatus },
  { label: 'El Salvador Lightning', Component: SlideElSalvadorLightningApps },
  { label: 'El Salvador Custody', Component: SlideElSalvadorCustody },
  { label: 'Recap', Component: SlideRecap },
  { label: 'Next Class', Component: SlideNextClass },
]
