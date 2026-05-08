import { Fragment, useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useDeckRenderMode } from '../../runtime/context'
import type { DeckSlideDefinition } from '../../runtime/types'
import { Callout } from '../../shared/patterns'
import { Body, BulletList, Eyebrow, Numeral, Rule, SlideFrame, Subtitle, Title } from '../../shared/primitives'
import { COLORS, FONTS } from '../../shared/tokens'

// --- Ethereum-specific accent palette (scoped to Day 6) ----------------------
const ETH_PURPLE = '#627EEA'
const ETH_PURPLE_DARK = '#3C3C7A'
const ETH_LIGHT = '#ECF0F9'
const EASE_OUT_QUINT = 'cubic-bezier(0.22, 1, 0.36, 1)'

// --- Motion helpers ---------------------------------------------------------

function useIsStaticDeck() {
  return useDeckRenderMode() === 'static'
}

function motionClass(className: string, isStatic: boolean) {
  return isStatic ? undefined : className
}

function cssVars(values: Record<`--${string}`, string | number>): CSSProperties {
  return values as CSSProperties
}

function Day6MotionStyles() {
  return (
    <style>
      {`
        :root {
          --u6d6-ease-out-quint: ${EASE_OUT_QUINT};
        }

        .u6d6-reveal,
        .u6d6-pop {
          opacity: 0;
          will-change: transform, opacity;
        }

        .u6d6-reveal {
          transform: translateY(18px);
        }

        .u6d6-pop {
          transform: scale(0.94);
          transform-origin: center;
        }

        .u6d6-draw {
          stroke-dasharray: var(--dash, 1000);
          stroke-dashoffset: var(--dash, 1000);
        }

        section[data-deck-active] .u6d6-reveal {
          animation: u6d6-reveal 560ms var(--u6d6-ease-out-quint) both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d6-pop {
          animation: u6d6-pop 520ms var(--u6d6-ease-out-quint) both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d6-draw {
          animation: u6d6-draw 900ms var(--u6d6-ease-out-quint) both;
          animation-delay: var(--delay, 0ms);
        }

        section[data-deck-active] .u6d6-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: u6d6-pulse 1500ms var(--u6d6-ease-out-quint) 2 both;
          animation-delay: var(--delay, 0ms);
        }

        @keyframes u6d6-reveal {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes u6d6-pop {
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes u6d6-draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes u6d6-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          45% { transform: scale(1.12); opacity: 0.85; }
        }

        @media (prefers-reduced-motion: reduce) {
          .u6d6-reveal,
          .u6d6-pop {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }

          .u6d6-draw {
            stroke-dashoffset: 0 !important;
            animation: none !important;
          }

          .u6d6-pulse {
            animation: none !important;
          }
        }
      `}
    </style>
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

// --- Reusable bits -----------------------------------------------------------

function PartDivider({ part, title, subtitle }: { part: string; title: ReactNode; subtitle: ReactNode }) {
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

type CodeLine = { code: string; comment?: string }

function CodeBlock({ lines, title, language = 'solidity', animate = false, baseDelayMs = 240, perLineMs = 60 }: { lines: CodeLine[]; title?: string; language?: string; animate?: boolean; baseDelayMs?: number; perLineMs?: number }) {
  const isStatic = useIsStaticDeck()
  const shouldAnimate = animate && !isStatic
  return (
    <div
      style={{
        background: COLORS.ink,
        borderRadius: 10,
        padding: '22px 28px',
        fontFamily: FONTS.mono,
        fontSize: 20,
        lineHeight: 1.42,
        color: '#E6E1D2',
        boxShadow: '0 14px 32px rgba(15,31,58,0.18)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {title ? (
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 17,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            marginBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{title}</span>
          <span style={{ color: 'rgba(184,137,59,0.6)' }}>{language}</span>
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', columnGap: 16, rowGap: 2 }}>
        {lines.map((line, i) => {
          const className = shouldAnimate ? 'u6d6-reveal' : undefined
          const lineStyle = shouldAnimate ? cssVars({ '--delay': `${baseDelayMs + i * perLineMs}ms` }) : undefined
          return (
            <Fragment key={i}>
              <div className={className} style={{ ...(lineStyle || {}), color: 'rgba(230,225,210,0.32)', textAlign: 'right', userSelect: 'none' }}>
                {i + 1}
              </div>
              <div className={className} style={{ ...(lineStyle || {}), whiteSpace: 'pre' }}>
                <span>{line.code}</span>
                {line.comment ? (
                  <span style={{ color: 'rgba(184,137,59,0.7)', fontStyle: 'italic' }}>  {line.comment}</span>
                ) : null}
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  suffix,
  caption,
  accent = COLORS.accent,
  background,
}: {
  label: string
  value: ReactNode
  suffix?: ReactNode
  caption: ReactNode
  accent?: string
  background?: string
}) {
  return (
    <div
      style={{
        border: `1px solid ${COLORS.rule}`,
        borderRadius: 10,
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        background: background ?? COLORS.cream,
      }}
    >
      <div style={{ fontFamily: FONTS.sans, fontSize: 21, letterSpacing: '0.28em', textTransform: 'uppercase', color: COLORS.muted }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontFamily: FONTS.serif, fontSize: 96, fontWeight: 400, lineHeight: 1, color: accent }}>{value}</div>
        {suffix ? (
          <div style={{ fontFamily: FONTS.sans, fontSize: 24, color: COLORS.muted, letterSpacing: '0.08em' }}>{suffix}</div>
        ) : null}
      </div>
      <Rule />
      <Body size="bodyLg">{caption}</Body>
    </div>
  )
}

// --- Demo helpers ----------------------------------------------------------

function randomHex(prefixDigits = 8) {
  const chars = '0123456789abcdef'
  let out = '0x'
  for (let i = 0; i < prefixDigits; i++) out += chars[Math.floor(Math.random() * 16)]
  return out + '… hashing'
}

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    if (r < weights[i]) return i
    r -= weights[i]
  }
  return weights.length - 1
}

function DemoButton({
  children,
  onClick,
  disabled = false,
  tone = 'default',
  style = {},
}: {
  children: ReactNode
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
          : ETH_PURPLE
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
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '12px 22px',
        transition: `background 180ms ${EASE_OUT_QUINT}, color 180ms ${EASE_OUT_QUINT}, opacity 180ms ${EASE_OUT_QUINT}`,
        opacity: disabled ? 0.55 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// --- Slide 1: Cover ----------------------------------------------------------

function SlideCover() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame variant="bleed" footer={false} pad={false}>
      <Day6MotionStyles />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ padding: '100px 120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 24,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: ETH_PURPLE,
                marginBottom: 32,
              }}
            >
              Honors Topics in Computer Science
            </div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 40, color: COLORS.inkSoft, marginBottom: 28 }}>
              Day 06
            </div>
            <Title size="titleLg" style={{ fontSize: 110, lineHeight: 0.98 }}>
              Smart Contracts
              <br />
              <span style={{ fontStyle: 'italic', color: ETH_PURPLE }}>&amp; Ethereum</span>
            </Title>
            <Subtitle style={{ fontSize: 38, marginTop: 40 }}>
              An introduction to proof-of-stake consensus and to programs that run on the Ethereum blockchain.
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
            <span>HTCS · Unit 6 · Day 06</span>
            <span>lecture + demo</span>
          </div>
        </div>

        <div style={{ background: COLORS.ink, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 60, left: 60, right: 60, bottom: 220 }}>
            {/* Ethereum diamond (canonical octahedron logo) */}
            <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid meet">
              {/* Glow rings — drawn first */}
              <circle className={motionClass('u6d6-draw', isStatic)} style={cssVars({ '--dash': 1510, '--delay': '120ms' })} cx="200" cy="300" r="240" fill="none" stroke="rgba(98,126,234,0.18)" strokeWidth="1.5" />
              <circle className={motionClass('u6d6-draw', isStatic)} style={cssVars({ '--dash': 1130, '--delay': '300ms' })} cx="200" cy="300" r="180" fill="none" stroke="rgba(98,126,234,0.28)" strokeWidth="1" />
              {/* Top half */}
              <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '480ms' })} points="200,40 70,330 200,260" fill={ETH_PURPLE} opacity="0.95" />
              <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '560ms' })} points="200,40 330,330 200,260" fill={ETH_PURPLE_DARK} opacity="0.95" />
              {/* Bottom half */}
              <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '720ms' })} points="200,560 70,360 200,290" fill={ETH_PURPLE} opacity="0.7" />
              <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '800ms' })} points="200,560 330,360 200,290" fill={ETH_PURPLE_DARK} opacity="0.85" />
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
              color: 'rgba(245,239,227,0.85)',
              fontFamily: FONTS.serif,
              fontSize: 28,
              lineHeight: 1.35,
              background: COLORS.ink,
            }}
          >
            Ethereum is a blockchain whose nodes execute a shared programming environment. Any participant can deploy programs called smart contracts.
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 2: Agenda ---------------------------------------------------------

function SlideAgenda() {
  const isStatic = useIsStaticDeck()
  const items: Array<[string, string, string]> = [
    ['01', 'Limits of Proof of Work', "The energy cost of mining and the risk of mining-pool concentration."],
    ['02', 'Proof of Stake', "How Ethereum's consensus mechanism replaces mining with collateralized validation."],
    ['03', 'Smart Contracts', "Programs stored on the blockchain, written in Solidity, executed by the Ethereum Virtual Machine."],
    ['04', 'Applications', "Examples of systems built on smart contracts: exchanges, name services, lending."],
  ]

  return (
    <SlideFrame>
      <Eyebrow>Today&apos;s topics</Eyebrow>
      <Title>
        Four sections.
      </Title>
      <div style={{ marginTop: 50, flex: 1 }}>
        {items.map(([n, title, description], index) => (
          <div
            key={n}
            className={motionClass('u6d6-reveal', isStatic)}
            style={{
              ...cssVars({ '--delay': `${120 + index * 140}ms` }),
              display: 'grid',
              gridTemplateColumns: '90px 1.1fr 2fr',
              gap: 34,
              padding: '20px 0',
              borderTop: `1px solid ${COLORS.ruleFaint}`,
              borderBottom: index === items.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
            }}
          >
            <Numeral n={n} color={ETH_PURPLE} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 40 }}>{title}</div>
            <Body size="bodyLg">{description}</Body>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

// --- Slide 3: Part 1 Divider -------------------------------------------------

function SlidePart1Divider() {
  return (
    <PartDivider
      part="Part 01"
      title={
        <>
          Limits of
          <br />
          <em style={{ fontStyle: 'italic' }}>Proof of Work.</em>
        </>
      }
      subtitle="Bitcoin's mining-based security model has two significant limitations. Understanding them explains why Ethereum chose a different approach."
    />
  )
}

// --- Slide 5: PoW Recap ------------------------------------------------------

function randomHexChars(n: number) {
  const chars = '0123456789abcdef'
  let out = ''
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * 16)]
  return out
}

function MiningAnimation({ isStatic }: { isStatic: boolean }) {
  const [nonce, setNonce] = useState('00000000')
  const [hash, setHash] = useState('a3f5b21c…d70cf94e')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (isStatic) {
      setNonce('a47e93f1')
      setHash('00007a4b3e21…f1c903d2')
      setDone(true)
      return
    }
    setDone(false)
    let tick = 0
    const TICKS = 14
    const id = window.setInterval(() => {
      tick++
      if (tick < TICKS) {
        setNonce(randomHexChars(8))
        setHash(randomHexChars(8) + '…' + randomHexChars(8))
      } else {
        window.clearInterval(id)
        setNonce(randomHexChars(8))
        setHash('0000' + randomHexChars(4) + '…' + randomHexChars(8))
        setDone(true)
      }
    }, 180)
    return () => window.clearInterval(id)
  }, [isStatic])
  return (
    <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '22px 28px', background: COLORS.cream }}>
      <div style={{ fontFamily: FONTS.sans, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 12 }}>
        Block header
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 17, color: COLORS.muted, lineHeight: 1.7 }}>
        <div>prev_hash : 0x4f3a…d10c</div>
        <div>txs_root  : 0x9b1e…ef7c</div>
        <div>timestamp : 1736021840</div>
        <div style={{ color: COLORS.ink }}>
          nonce     : <span style={{ color: COLORS.accent, fontWeight: 600 }}>0x{nonce}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px 0 12px', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: COLORS.rule }} />
        <div style={{ fontFamily: FONTS.sans, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}>SHA-256</div>
        <div style={{ flex: 1, height: 1, background: COLORS.rule }} />
      </div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>
        Hash output
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          color: done ? COLORS.ok : COLORS.ink,
          background: done ? 'rgba(72,128,90,0.10)' : 'transparent',
          padding: '8px 12px',
          borderRadius: 6,
          transition: `background 280ms ${EASE_OUT_QUINT}, color 280ms ${EASE_OUT_QUINT}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span>0x{hash}</span>
        {done ? (
          <span style={{ marginLeft: 'auto', fontFamily: FONTS.sans, fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', background: COLORS.ok, color: COLORS.paper, padding: '3px 9px', borderRadius: 4 }}>
            valid
          </span>
        ) : null}
      </div>
      <div style={{ marginTop: 10, fontFamily: FONTS.sans, fontSize: 14, color: COLORS.muted, fontStyle: 'italic' }}>
        {done ? 'Hash starts with the required leading zeros.' : 'Trying nonces…'}
      </div>
    </div>
  )
}

function SlidePoWRecap() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>Recap from Day 3</Eyebrow>
      <Title>
        How <em style={{ fontStyle: 'italic', color: COLORS.accent }}>Proof of Work</em> mining functions.
      </Title>
      <div style={{ marginTop: 50, flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <Body size="bodyLg" style={{ marginBottom: 20 }}>
            Miners compete to find a number, the <em>nonce</em>, that hashes the block to a value starting with a target number of leading zeros.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 20 }}>
            Each miner tries billions of nonces per second on specialized ASIC hardware. The first to find a valid nonce earns the block reward.
          </Body>
          <Body size="bodyLg">
            Rewriting an old block would require redoing this work faster than the rest of the network combined. Security comes from the cost of the computation.
          </Body>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ReplayableDiagram>
            <MiningAnimation isStatic={isStatic} />
          </ReplayableDiagram>
          <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '18px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}>Average block time</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontFamily: FONTS.serif, fontSize: 52, fontWeight: 400, lineHeight: 1, color: COLORS.ink }}>~10</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 18, color: COLORS.muted, letterSpacing: '0.06em' }}>minutes</div>
            </div>
            <Body size="body">Difficulty adjusts every 2,016 blocks to keep this constant.</Body>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 6: Energy Problem -------------------------------------------------

function SlideEnergyProblem() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>Limitation 1: energy consumption</Eyebrow>
      <Title>
        The energy cost of <em style={{ fontStyle: 'italic', color: COLORS.accent }}>Proof of Work.</em>
      </Title>
      <div style={{ marginTop: 50, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
        <div className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '160ms' })}>
          <StatCard label="Bitcoin (current)" value="~150" suffix="TWh / yr" caption="Roughly Argentina's annual electricity consumption." accent={COLORS.accent} />
        </div>
        <div className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '420ms' })}>
          <StatCard label="Ethereum (before Sept 2022)" value="~78" suffix="TWh / yr" caption="Roughly Chile's annual electricity consumption." accent={COLORS.accent} />
        </div>
      </div>
      <Callout kicker="Energy and security" padding="18px 0" style={{ maxWidth: 1500, marginTop: 28 }}>
        Increasing the network&apos;s hashrate does not make the chain faster. It only raises the electricity required to maintain the same level of security. Energy cost grows in proportion to the security budget.
      </Callout>
    </SlideFrame>
  )
}

// --- Slide 7: The 51% Attack ------------------------------------------------

function Slide51PercentAttack() {
  const isStatic = useIsStaticDeck()
  const pools: Array<[string, number, string]> = [
    ['Foundry USA', 30, COLORS.accent],
    ['AntPool', 27, COLORS.gold],
    ['ViaBTC', 12, COLORS.muted],
    ['F2Pool', 9, COLORS.rule],
    ['Other', 22, COLORS.ruleFaint],
  ]
  const top3 = pools.slice(0, 3).reduce((sum, [, pct]) => sum + pct, 0)
  return (
    <SlideFrame>
      <Eyebrow>Limitation 2: mining-power concentration</Eyebrow>
      <Title>
        The <em style={{ fontStyle: 'italic', color: COLORS.accent }}>51% attack.</em>
      </Title>
      <div style={{ marginTop: 36, flex: 1, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 60, alignItems: 'center' }}>
        <div>
          <Body size="bodyLg" style={{ marginBottom: 20 }}>
            A party controlling more than 50% of the network&apos;s hashrate decides which blocks the network accepts.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 20 }}>
            That party can rewrite recent blocks, perform a <em>double-spend</em> (spending the same coins twice by replacing the block that recorded the first payment), or refuse to include certain transactions.
          </Body>
          <Body size="bodyLg">
            The protocol does not prevent concentration. Mining clusters where electricity is cheapest, so a small number of pools control most of Bitcoin&apos;s hashrate.
          </Body>
        </div>
        <div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 21, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 22 }}>
            Bitcoin hashrate by mining pool
          </div>
          {pools.map(([name, pct, color], i) => (
            <div
              key={name}
              className={motionClass('u6d6-reveal', isStatic)}
              style={{
                ...cssVars({ '--delay': `${220 + i * 110}ms` }),
                display: 'grid',
                gridTemplateColumns: '180px 1fr 80px',
                gap: 18,
                alignItems: 'center',
                padding: '12px 0',
              }}
            >
              <div style={{ fontFamily: FONTS.sans, fontSize: 22, fontWeight: 600, color: COLORS.ink }}>{name}</div>
              <div style={{ height: 14, background: 'rgba(15,31,58,0.06)', borderRadius: 7, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(pct / 30) * 100}%`, background: color }} />
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.ink, textAlign: 'right' }}>~{pct}%</div>
            </div>
          ))}
          <Rule style={{ marginTop: 16 }} />
          <div style={{ marginTop: 14, fontFamily: FONTS.serif, fontSize: 24, color: COLORS.accent }}>
            Top three pools: ~{top3}% of total hashrate.
          </div>
        </div>
      </div>
      <Callout kicker="What the security rests on" tone="warning" padding="18px 0" style={{ maxWidth: 1500, marginTop: 24 }}>
        Bitcoin&apos;s security against this attack depends on mining pools choosing to compete rather than collude. Decentralization is an assumption, not a property the protocol enforces.
      </Callout>
    </SlideFrame>
  )
}

// --- Slide 8: Real-World Case · Litecoin Reorg ------------------------------

function ReorgDiagram({ isStatic }: { isStatic: boolean }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    if (isStatic) {
      setPhase(5)
      return
    }
    setPhase(0)
    const timers = [
      window.setTimeout(() => setPhase(1), 900),
      window.setTimeout(() => setPhase(2), 1700),
      window.setTimeout(() => setPhase(3), 2700),
      window.setTimeout(() => setPhase(4), 3500),
      window.setTimeout(() => setPhase(5), 5400),
    ]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [isStatic])

  const W = 1500
  const H = 250
  const blockSize = 34
  const blockGap = 6
  const startX = 160
  const branchPoint = 5
  const honestExtra = 2
  const forkExtra = 7
  const honestY = 110
  const forkY = 190
  const branchX = startX + branchPoint * (blockSize + blockGap) - blockGap

  const phaseLabels = [
    'INITIAL CANONICAL CHAIN',
    'A FORK APPEARS AT BLOCK 5',
    'BOTH CHAINS EXTEND IN PARALLEL',
    'UPDATED POOLS KNOCKED OFFLINE',
    'FORK EXTENDS UNCONTESTED',
    'NETWORK ACCEPTS THE LONGER FORK',
  ]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
      <text x={W / 2} y={28} textAnchor="middle" fontFamily={FONTS.sans} fontSize="14" letterSpacing="0.26em" fill={COLORS.muted}>
        {phaseLabels[phase]}
      </text>

      {/* Track labels */}
      <text x={20} y={honestY + 5} fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.22em" fill={COLORS.accent}>HONEST</text>
      <text x={20} y={forkY + 5} fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.22em" fill={ETH_PURPLE}>BUG-POOL FORK</text>

      {/* Faint baseline rails */}
      <line x1={startX} y1={honestY} x2={startX + (branchPoint + honestExtra) * (blockSize + blockGap) - blockGap} y2={honestY} stroke="rgba(168,52,30,0.16)" strokeWidth={1} />
      <line x1={branchX + 24} y1={forkY} x2={branchX + 24 + forkExtra * (blockSize + blockGap)} y2={forkY} stroke="rgba(98,126,234,0.18)" strokeWidth={1} />

      {/* Common blocks 1..branchPoint */}
      {Array.from({ length: branchPoint }, (_, i) => (
        <g key={`common-${i}`} className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': `${100 + i * 110}ms` })}>
          <rect x={startX + i * (blockSize + blockGap)} y={honestY - blockSize / 2} width={blockSize} height={blockSize} rx={4} fill={COLORS.cream} stroke={COLORS.ink} strokeWidth={1.4} />
          <text x={startX + i * (blockSize + blockGap) + blockSize / 2} y={honestY + 5} textAnchor="middle" fontFamily={FONTS.mono} fontSize="13" fill={COLORS.muted}>{i + 1}</text>
        </g>
      ))}

      {/* Branch line down from block 5 to fork track */}
      {phase >= 1 ? (
        <line
          x1={branchX + 6}
          y1={honestY + blockSize / 2}
          x2={branchX + 24}
          y2={forkY - blockSize / 2 - 2}
          stroke={ETH_PURPLE}
          strokeWidth={1.6}
          strokeDasharray="3 3"
          style={{ opacity: 1 }}
        />
      ) : null}

      {/* Honest blocks 6, 7 */}
      {Array.from({ length: honestExtra }, (_, i) => {
        const visible = phase >= 1 + i
        const dim = phase >= 3
        const opacity = !visible ? 0 : dim ? 0.2 : 1
        const x = startX + (branchPoint + i) * (blockSize + blockGap)
        return (
          <g key={`honest-${i}`} style={{ opacity, transition: `opacity 520ms ${EASE_OUT_QUINT}` }}>
            <rect x={x} y={honestY - blockSize / 2} width={blockSize} height={blockSize} rx={4} fill={COLORS.cream} stroke={COLORS.accent} strokeWidth={1.4} />
            <text x={x + blockSize / 2} y={honestY + 5} textAnchor="middle" fontFamily={FONTS.mono} fontSize="13" fill={COLORS.accent}>{branchPoint + 1 + i}</text>
          </g>
        )
      })}

      {/* DDoS marker */}
      {phase >= 3 ? (
        <g style={{ opacity: 1, transition: `opacity 320ms ${EASE_OUT_QUINT}` }}>
          <line x1={startX + branchPoint * (blockSize + blockGap) - 4} y1={honestY - 32} x2={startX + (branchPoint + honestExtra) * (blockSize + blockGap)} y2={honestY - 32} stroke={COLORS.danger} strokeWidth={1} strokeDasharray="2 4" />
          <text x={startX + branchPoint * (blockSize + blockGap) + (honestExtra * (blockSize + blockGap)) / 2 - 4} y={honestY - 42} textAnchor="middle" fontFamily={FONTS.sans} fontSize="13" fontWeight="700" letterSpacing="0.2em" fill={COLORS.danger}>
            DDoS · UPDATED POOLS SILENCED
          </text>
        </g>
      ) : null}

      {/* Fork blocks */}
      {Array.from({ length: forkExtra }, (_, i) => {
        const earlyPair = i < honestExtra
        const visible = earlyPair ? phase >= 1 + i : phase >= 4
        const winning = phase >= 5
        const x = branchX + 24 + i * (blockSize + blockGap)
        const cssDelay = earlyPair ? `${i * 90}ms` : `${(i - honestExtra) * 140}ms`
        return (
          <g
            key={`fork-${i}`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 420ms ${EASE_OUT_QUINT} ${cssDelay}, transform 420ms ${EASE_OUT_QUINT} ${cssDelay}`,
            }}
          >
            <rect
              x={x}
              y={forkY - blockSize / 2}
              width={blockSize}
              height={blockSize}
              rx={4}
              fill={winning ? ETH_LIGHT : COLORS.paper}
              stroke={ETH_PURPLE}
              strokeWidth={winning ? 1.8 : 1.4}
              style={{ transition: `fill 520ms ${EASE_OUT_QUINT}, stroke-width 520ms ${EASE_OUT_QUINT}` }}
            />
            <text x={x + blockSize / 2} y={forkY + 5} textAnchor="middle" fontFamily={FONTS.mono} fontSize="13" fill={ETH_PURPLE_DARK}>
              {branchPoint + 1 + i}&apos;
            </text>
          </g>
        )
      })}

      {/* Canonical-chain pointer */}
      {phase >= 5 ? (
        <g style={{ opacity: 1, transition: `opacity 480ms ${EASE_OUT_QUINT}` }}>
          <text x={branchX + 24 + forkExtra * (blockSize + blockGap) + 12} y={forkY + 5} fontFamily={FONTS.serif} fontStyle="italic" fontSize="20" fill={ETH_PURPLE_DARK}>
            ← longest chain wins
          </text>
        </g>
      ) : null}
    </svg>
  )
}

function SlideLitecoinReorg() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>A real-world example · April 2026</Eyebrow>
      <Title>
        Litecoin&apos;s 13-block <em style={{ fontStyle: 'italic', color: COLORS.accent }}>reorg.</em>
      </Title>
      <div style={{ marginTop: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 1500 }}>
        <Body size="bodyLg">
          On April 25, 2026, Litecoin replaced its most recent 13 blocks with a different sequence. The largest <em>reorg</em> on a top-twenty cryptocurrency in five years.
        </Body>
        <Body size="bodyLg">
          A bug in <em>MWEB</em>, Litecoin&apos;s privacy layer, let outdated mining pools accept invalid transactions. A separate <em>denial-of-service</em> flood took the updated pools offline, giving the attacker an effective 51% without ever owning the majority of hashrate.
        </Body>
        <ReplayableDiagram>
          <ReorgDiagram isStatic={isStatic} />
        </ReplayableDiagram>
      </div>
      <Callout kicker="Read more" tone="gold" padding="12px 0" style={{ maxWidth: 1500, marginTop: 8 }}>
        Cryptopolitan, &ldquo;Bug or Attack? Litecoin sees 13-block Reorg.&rdquo;{' '}
        <a
          href="https://www.cryptopolitan.com/bug-or-attack-litecoin-sees-13-block-reorg/"
          target="_blank"
          rel="noreferrer"
          style={{ color: COLORS.accent, textDecoration: 'underline' }}
        >
          cryptopolitan.com
        </a>
      </Callout>
    </SlideFrame>
  )
}

// --- Slide 9: PoS Introduction -----------------------------------------------

function SlidePoSIntroduction() {
  const isStatic = useIsStaticDeck()
  const iconProps = { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', stroke: ETH_PURPLE, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const validatorIcon = (
    <svg {...iconProps}>
      <circle cx="12" cy="9" r="3.4" />
      <path d="M5.2 20c0-3.5 3-6 6.8-6s6.8 2.5 6.8 6" />
    </svg>
  )
  const stakeIcon = (
    <svg {...iconProps}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
  const proposerIcon = (
    <svg {...iconProps}>
      <rect x="3.5" y="7" width="10" height="10" rx="1" />
      <path d="M15.5 12h5.5M18.5 9l3 3-3 3" />
    </svg>
  )
  const attesterIcon = (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  )
  const finalityIcon = (
    <svg {...iconProps}>
      <path d="M12 3l8 3v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
  const rows: Array<[string, ReactNode, string]> = [
    ['Validator', validatorIcon, 'A participant who has locked ETH as collateral.'],
    ['Stake', stakeIcon, "The locked ETH. A solo validator stakes 32 ETH."],
    ['Proposer', proposerIcon, "The validator selected to propose the next block. One per 12-second slot."],
    ['Attester', attesterIcon, "A validator who votes that a proposed block is valid."],
    ['Finality', finalityIcon, "The point at which a block is treated as irreversible. Reached after two epochs (~12.8 min)."],
  ]
  return (
    <SlideFrame>
      <Eyebrow>Ethereum&apos;s alternative</Eyebrow>
      <Title>
        <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>Proof of Stake.</em>
      </Title>
      <div style={{ marginTop: 40, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'start' }}>
        <div>
          <Body size="bodyLg" style={{ marginBottom: 20 }}>
            Both PoW limitations share one cause: security depends on physical work.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 20 }}>
            In Proof of Stake, validators replace miners. A <em>validator</em> is a participant who has locked up ETH as collateral. The locked ETH is the validator&apos;s <em>stake</em>.
          </Body>
          <Body size="bodyLg">
            For each block, the protocol selects one validator at random to propose. Selection probability is proportional to stake. Other validators submit attestations confirming the block is valid.
          </Body>
        </div>
        <div>
          {rows.map(([label, icon, text], i) => (
            <div
              key={label}
              className={motionClass('u6d6-reveal', isStatic)}
              style={{
                ...cssVars({ '--delay': `${180 + i * 110}ms` }),
                display: 'grid',
                gridTemplateColumns: '46px 170px 1fr',
                gap: 20,
                padding: '16px 0',
                alignItems: 'center',
                borderTop: `1px solid ${COLORS.ruleFaint}`,
                borderBottom: i === rows.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 21, letterSpacing: '0.16em', textTransform: 'uppercase', color: ETH_PURPLE }}>
                {label}
              </div>
              <Body size="bodyLg">{text}</Body>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 10: PoS Lifecycle -------------------------------------------------

function SlidePoSLifecycle() {
  const isStatic = useIsStaticDeck()
  const steps: Array<{
    kicker: string
    title: string
    body: ReactNode
    terms: Array<{ term: string; def: string }>
  }> = [
    {
      kicker: '1 · Slot · 12 seconds',
      title: 'Proposer is chosen.',
      body: (
        <>One validator is picked at random to build the next block. A higher stake means a higher chance of being chosen.</>
      ),
      terms: [
        { term: 'Proposer', def: 'a validator randomly selected to bundle transactions into a new block.' },
        { term: 'Stake', def: 'the amount of ETH locked up as collateral to participate in the network.' },
      ],
    },
    {
      kicker: '2 · Block built',
      title: 'Proposer assembles the block.',
      body: (
        <>They pull pending transactions from the <em>mempool</em> (the queue of unconfirmed transactions), run them, and broadcast the result.</>
      ),
      terms: [
        { term: 'Mempool', def: 'a waiting area where unconfirmed transactions are held before being picked up.' },
      ],
    },
    {
      kicker: '3 · Committee attests',
      title: 'A subset of validators votes.',
      body: (
        <>A <em>committee</em> (about 1 in 32 of all validators) checks the block and votes (<em>attests</em>) on its validity. Vote weight scales with stake.</>
      ),
      terms: [
        { term: 'Committee', def: 'a subset of validators assigned to verify a block for a given slot.' },
        { term: 'Attestor', def: 'a validator voting to confirm a block is valid.' },
      ],
    },
    {
      kicker: '4 · Epoch · ~6.4 minutes',
      title: 'Votes accumulate.',
      body: (
        <>An <em>epoch</em> is 32 slots. Every active validator attests exactly once per epoch, in their assigned slot.</>
      ),
      terms: [
        { term: 'Slot', def: 'a 12-second window in which one block can be proposed.' },
        { term: 'Epoch', def: 'a period of 32 slots (~6.4 minutes).' },
      ],
    },
    {
      kicker: '5 · Finality · ~12.8 minutes',
      title: 'Block becomes permanent.',
      body: (
        <>Once 2/3 of all staked ETH has attested across two epochs, the block is <em>finalized</em>: it cannot be reversed. Bitcoin has no formal finality; users wait for ~6 confirmations (~60 min) by convention.</>
      ),
      terms: [
        { term: 'Finality', def: 'the point at which a block is treated as permanent and cannot be reversed.' },
      ],
    },
    {
      kicker: '6 · Slashing',
      title: 'A failed attack costs the attacker their own stake.',
      body: (
        <>An honest mistake is ignored. <em>Slashing</em> applies only to provable cheating, like signing two conflicting blocks: the protocol burns part of the stake and removes the validator. PoW: a failed attack costs spent electricity. PoS: it costs the same asset needed to attack.</>
      ),
      terms: [
        { term: 'Slashing', def: 'a penalty for provable offenses, resulting in a partial or full burn of staked ETH.' },
        { term: 'Double voting', def: 'signing two different blocks in the same slot.' },
      ],
    },
  ]
  return (
    <SlideFrame>
      <Eyebrow>From proposal to finality</Eyebrow>
      <Title>
        How a block is <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>added to the chain.</em>
      </Title>
      <div
        style={{
          marginTop: 32,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridAutoRows: '1fr',
          gap: 22,
          minHeight: 0,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className={motionClass('u6d6-reveal', isStatic)}
            style={{
              ...cssVars({ '--delay': `${160 + i * 90}ms` }),
              border: `1px solid ${COLORS.rule}`,
              borderRadius: 8,
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              background: COLORS.cream,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 15,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: ETH_PURPLE,
              }}
            >
              {step.kicker}
            </div>
            <div
              style={{
                fontFamily: FONTS.serif,
                fontSize: 24,
                lineHeight: 1.18,
                color: COLORS.ink,
              }}
            >
              {step.title}
            </div>
            <div
              style={{
                fontFamily: FONTS.serif,
                fontSize: 19,
                lineHeight: 1.35,
                color: COLORS.ink,
              }}
            >
              {step.body}
            </div>
            <div
              style={{
                marginTop: 6,
                paddingTop: 8,
                borderTop: `1px solid ${COLORS.rule}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {step.terms.map(({ term, def }) => (
                <div
                  key={term}
                  style={{
                    fontFamily: FONTS.serif,
                    fontSize: 15,
                    lineHeight: 1.3,
                    color: COLORS.ink,
                  }}
                >
                  <span style={{ fontWeight: 700 }}>{term}:</span>{' '}
                  <span style={{ color: COLORS.muted }}>{def}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

// --- Slide 8: PoW vs PoS demo (Phase 3) -------------------------------------

function SlideDemoPoWvsPoS() {
  const MINERS = ['Miner A', 'Miner B', 'Miner C']
  const VALIDATORS: Array<[string, number]> = [['Validator A', 64], ['Validator B', 32], ['Validator C', 128]]
  const STAKES = VALIDATORS.map(([, s]) => s)
  const TOTAL_STAKE = STAKES.reduce((a, b) => a + b, 0)
  const POW_ENERGY_PER_ROUND = 30_000
  const POS_ENERGY_PER_ROUND = 1

  const [round, setRound] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [hashes, setHashes] = useState<string[]>(() => MINERS.map(() => '0x… idle'))
  const [powWinner, setPowWinner] = useState<number | null>(null)
  const [posWinner, setPosWinner] = useState<number | null>(null)
  const [powEnergy, setPowEnergy] = useState(0)
  const [posEnergy, setPosEnergy] = useState(0)

  useEffect(() => {
    if (!isRunning) return
    let tick = 0
    const TICKS = 14
    const id = window.setInterval(() => {
      tick++
      if (tick < TICKS) {
        setHashes(MINERS.map(() => randomHex()))
      } else {
        window.clearInterval(id)
        const minerIndex = Math.floor(Math.random() * MINERS.length)
        setHashes((prev) => prev.map((_, i) => (i === minerIndex ? randomHex() : '0x… stopped')))
        setPowWinner(minerIndex)
        setPowEnergy((p) => p + POW_ENERGY_PER_ROUND)
        window.setTimeout(() => {
          const validatorIndex = weightedRandom(STAKES)
          setPosWinner(validatorIndex)
          setPosEnergy((p) => p + POS_ENERGY_PER_ROUND)
          setIsRunning(false)
        }, 220)
      }
    }, 100)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  const handleRun = () => {
    if (isRunning) return
    setRound((r) => r + 1)
    setPowWinner(null)
    setPosWinner(null)
    setHashes(MINERS.map(() => randomHex()))
    setIsRunning(true)
  }

  const handleReset = () => {
    setRound(0)
    setPowWinner(null)
    setPosWinner(null)
    setPowEnergy(0)
    setPosEnergy(0)
    setIsRunning(false)
    setHashes(MINERS.map(() => '0x… idle'))
  }

  return (
    <SlideFrame>
      <Eyebrow>Energy cost per block</Eyebrow>
      <Title>
        How much energy it takes to win a block versus to be chosen as validator.
      </Title>
      <div style={{ marginTop: 24, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, minHeight: 0 }}>
        {/* PoW interactive */}
        <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '18px 22px', background: COLORS.creamDark, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.26em', textTransform: 'uppercase', color: COLORS.accent }}>Proof of Work: miners hashing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MINERS.map((name, i) => {
              const isWinner = powWinner === i
              return (
                <div
                  key={name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 140px',
                    gap: 14,
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: isWinner ? 'rgba(168,52,30,0.12)' : 'transparent',
                    border: `1px solid ${isWinner ? COLORS.accent : 'transparent'}`,
                    transition: `background 200ms ${EASE_OUT_QUINT}, border-color 200ms ${EASE_OUT_QUINT}`,
                  }}
                >
                  <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 19 }}>{name}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: isWinner ? COLORS.ink : COLORS.muted, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hashes[i]}
                  </div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 16, fontWeight: 600, color: isWinner ? COLORS.accent : COLORS.muted, textAlign: 'right', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {isWinner ? 'Block found' : isRunning ? '~3 GH/s' : 'idle'}
                  </div>
                </div>
              )
            })}
          </div>
          <Rule />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 17, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted }}>Total energy</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 38, color: COLORS.danger }}>{powEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</div>
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.muted, textAlign: 'right' }}>
              ~30,000 kWh per block · pre-Merge Ethereum · ≈3 yrs of a US home
            </div>
          </div>
        </div>
        {/* PoS interactive */}
        <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '18px 22px', background: ETH_LIGHT, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.26em', textTransform: 'uppercase', color: ETH_PURPLE }}>Proof of Stake: validator selected</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {VALIDATORS.map(([name, stake], i) => {
              const isWinner = posWinner === i
              const sharePct = (stake / TOTAL_STAKE) * 100
              return (
                <div
                  key={name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr 110px',
                    gap: 14,
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: isWinner ? 'rgba(98,126,234,0.18)' : 'transparent',
                    border: `1px solid ${isWinner ? ETH_PURPLE : 'transparent'}`,
                    transition: `background 200ms ${EASE_OUT_QUINT}, border-color 200ms ${EASE_OUT_QUINT}`,
                  }}
                >
                  <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 19 }}>{name}</div>
                  <div style={{ height: 10, background: 'rgba(98,126,234,0.16)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${sharePct}%`, background: ETH_PURPLE }} />
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: ETH_PURPLE_DARK, textAlign: 'right' }}>{stake} ETH</div>
                </div>
              )
            })}
          </div>
          <Rule />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 17, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted }}>Total energy</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 38, color: ETH_PURPLE }}>{posEnergy.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh</div>
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 14, color: COLORS.muted, textAlign: 'right' }}>
              ~1 kWh per block · post-Merge Ethereum · ≈10 hours of a TV
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <DemoButton onClick={handleRun} disabled={isRunning}>
          {isRunning ? 'Running…' : round === 0 ? 'Run round' : 'Run another round'}
        </DemoButton>
        <div style={{ fontFamily: FONTS.sans, fontSize: 17, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted }}>
          Rounds completed: <span style={{ color: COLORS.ink, fontWeight: 600 }}>{round}</span>
        </div>
        <DemoButton tone="ghost" onClick={handleReset} disabled={isRunning}>Reset</DemoButton>
      </div>
    </SlideFrame>
  )
}

// --- Slide 9: Validator Lottery ---------------------------------------------

function SlideValidatorLottery() {
  const validators: Array<[string, number]> = [
    ['Aria', 32],
    ['Ben', 64],
    ['Cleo', 96],
    ['Diego', 32],
    ['Eve', 192],
    ['Finn', 64],
  ]
  const STAKES = validators.map(([, s]) => s)
  const TOTAL = STAKES.reduce((a, b) => a + b, 0)
  const MAX_STAKE = Math.max(...STAKES)

  const [counts, setCounts] = useState<number[]>(() => validators.map(() => 0))
  const [lastWinner, setLastWinner] = useState<number | null>(null)
  const totalSelections = counts.reduce((a, b) => a + b, 0)

  const handleSelect = () => {
    const idx = weightedRandom(STAKES)
    setLastWinner(idx)
    setCounts((prev) => prev.map((c, i) => (i === idx ? c + 1 : c)))
  }

  const handleSelect10 = () => {
    const draws: number[] = []
    for (let i = 0; i < 10; i++) draws.push(weightedRandom(STAKES))
    setLastWinner(draws[draws.length - 1])
    setCounts((prev) => prev.map((c, i) => c + draws.filter((d) => d === i).length))
  }

  const handleReset = () => {
    setCounts(validators.map(() => 0))
    setLastWinner(null)
  }

  return (
    <SlideFrame>
      <Eyebrow>How proposers are selected</Eyebrow>
      <Title>
        Selection probability is proportional to <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>stake.</em>
      </Title>
      <div style={{ marginTop: 30, flex: 1, display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 40, alignItems: 'start', minHeight: 0 }}>
        {/* Validator list with observed vs expected percentages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {validators.map(([name, stake], i) => {
            const isWinner = lastWinner === i
            const expectedPct = (stake / TOTAL) * 100
            const observedPct = totalSelections > 0 ? (counts[i] / totalSelections) * 100 : 0
            return (
              <div
                key={name}
                style={{
                  border: `1px solid ${isWinner ? ETH_PURPLE : COLORS.rule}`,
                  borderRadius: 8,
                  padding: '12px 20px',
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr 100px 130px',
                  gap: 16,
                  alignItems: 'center',
                  background: isWinner ? 'rgba(98,126,234,0.10)' : 'transparent',
                  transition: `background 240ms ${EASE_OUT_QUINT}, border-color 240ms ${EASE_OUT_QUINT}`,
                }}
              >
                <div style={{ fontFamily: FONTS.serif, fontSize: 26 }}>{name}</div>
                <div style={{ height: 10, background: 'rgba(98,126,234,0.16)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(stake / MAX_STAKE) * 100}%`, background: ETH_PURPLE }} />
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 19, color: ETH_PURPLE_DARK, textAlign: 'right' }}>{stake} ETH</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 17, color: COLORS.ink }}>
                    {observedPct.toFixed(1)}% <span style={{ color: COLORS.muted }}>· {counts[i]}</span>
                  </div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted }}>
                    expected {expectedPct.toFixed(1)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Right column: explanation + controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Body size="bodyLg">
            For each block, one validator is picked at random. Each validator&apos;s probability equals their stake divided by the total stake.
          </Body>
          <Body size="bodyLg">
            Eve has six times Aria&apos;s stake, so over many rounds Eve will be selected about six times as often.
          </Body>
          <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 8, padding: '16px 22px', background: COLORS.cream, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted }}>
              Total selections
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 44, color: ETH_PURPLE, lineHeight: 1.05 }}>{totalSelections}</div>
            {lastWinner !== null ? (
              <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 20, color: COLORS.muted }}>
                Last proposer: {validators[lastWinner][0]}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <DemoButton onClick={handleSelect}>Select proposer</DemoButton>
            <DemoButton onClick={handleSelect10}>+10 rounds</DemoButton>
            <DemoButton tone="ghost" onClick={handleReset}>Reset</DemoButton>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 11: Part 2 Divider -----------------------------------------------

function SlidePart2Divider() {
  return (
    <PartDivider
      part="Part 02"
      title={
        <>
          Comparing
          <br />
          <em style={{ fontStyle: 'italic' }}>the two.</em>
        </>
      }
      subtitle="Proof of Work and Proof of Stake achieve similar security goals through different physical and economic resources. The next two slides compare them directly."
    />
  )
}

// --- Slide 12: PoW vs PoS Table ---------------------------------------------

function SlidePoWvsPoSTable() {
  const isStatic = useIsStaticDeck()
  const rows: Array<[string, string, string]> = [
    ['Annual energy use', '~150 TWh (Bitcoin)', '~0.01 TWh (Ethereum, post-Merge)'],
    ['Hardware required', 'Specialized ASIC mining hardware', 'A consumer-grade computer running validator software'],
    ['Average block time', '~10 minutes (Bitcoin)', '12-second slots, finality after ~12.8 minutes (Ethereum)'],
    ['Finality', 'Probabilistic. Convention is to wait for ~6 confirmations.', 'Deterministic. Blocks are finalized after 2 epochs.'],
    ['Cost of a 51% attack', 'Acquire majority hashrate; estimated tens of billions of dollars for Bitcoin', 'Acquire and stake majority ETH; the protocol can then destroy that stake through slashing'],
    ['Decentralization concern', 'Hashrate concentrates in mining pools located near cheap electricity', 'Stake concentrates in entities that hold large amounts of ETH'],
  ]
  return (
    <SlideFrame>
      <Eyebrow>Direct comparison</Eyebrow>
      <Title>
        Proof of Work and Proof of Stake side by side.
      </Title>
      <div style={{ marginTop: 36, flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr 1fr', columnGap: 28, alignItems: 'start' }}>
        <div />
        <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.accent, paddingBottom: 16, borderBottom: `2px solid ${COLORS.accent}` }}>
          Proof of Work
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: ETH_PURPLE, paddingBottom: 16, borderBottom: `2px solid ${ETH_PURPLE}` }}>
          Proof of Stake
        </div>
        {rows.map(([label, pow, pos], i) => {
          const delay = `${160 + i * 110}ms`
          return (
            <Fragment key={label}>
              <div
                className={motionClass('u6d6-reveal', isStatic)}
                style={{
                  ...cssVars({ '--delay': delay }),
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: COLORS.muted,
                  padding: '20px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${COLORS.ruleFaint}`,
                }}
              >
                {label}
              </div>
              <div className={motionClass('u6d6-reveal', isStatic)} style={{ ...cssVars({ '--delay': delay }), fontFamily: FONTS.serif, fontSize: 26, lineHeight: 1.3, padding: '20px 0', borderTop: i === 0 ? 'none' : `1px solid ${COLORS.ruleFaint}`, color: COLORS.ink }}>
                {pow}
              </div>
              <div className={motionClass('u6d6-reveal', isStatic)} style={{ ...cssVars({ '--delay': delay }), fontFamily: FONTS.serif, fontSize: 26, lineHeight: 1.3, padding: '20px 0', borderTop: i === 0 ? 'none' : `1px solid ${COLORS.ruleFaint}`, color: COLORS.ink }}>
                {pos}
              </div>
            </Fragment>
          )
        })}
      </div>
    </SlideFrame>
  )
}

// --- Slide 13: The Merge ----------------------------------------------------

function MergeTimeline({ isStatic }: { isStatic: boolean }) {
  const W = 1500
  const H = 180
  const blockSize = 28
  const blockGap = 4
  const startX = 100
  const preMerge = 11
  const postMerge = 18
  const trackY1 = 60
  const trackY2 = 120
  const mergeX = startX + preMerge * (blockSize + blockGap) + 24
  const mergedY = (trackY1 + trackY2) / 2

  const powBlocks = Array.from({ length: preMerge }, (_, i) => i)
  const posBlocks = Array.from({ length: preMerge }, (_, i) => i)
  const mergedBlocks = Array.from({ length: postMerge }, (_, i) => i)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet">
      {/* Track labels */}
      <text x={20} y={trackY1 + 5} fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.22em" fill={COLORS.muted}>POW</text>
      <text x={20} y={trackY2 + 5} fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.22em" fill={ETH_PURPLE}>BEACON · POS</text>

      {/* Faint baseline rails */}
      <line x1={startX} y1={trackY1} x2={mergeX - 20} y2={trackY1} stroke="rgba(168,52,30,0.18)" strokeWidth={1} />
      <line x1={startX} y1={trackY2} x2={mergeX - 20} y2={trackY2} stroke="rgba(98,126,234,0.18)" strokeWidth={1} />
      <line x1={mergeX + 30} y1={mergedY} x2={W - 24} y2={mergedY} stroke="rgba(98,126,234,0.18)" strokeWidth={1} />

      {/* PoW blocks */}
      {powBlocks.map((i) => (
        <g key={`pow-${i}`} className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': `${120 + i * 38}ms` })}>
          <rect
            x={startX + i * (blockSize + blockGap)}
            y={trackY1 - blockSize / 2}
            width={blockSize}
            height={blockSize}
            rx={3}
            fill={i === preMerge - 1 ? COLORS.accent : COLORS.cream}
            stroke={i === preMerge - 1 ? COLORS.ink : COLORS.accent}
            strokeWidth={i === preMerge - 1 ? 1.8 : 1.2}
          />
        </g>
      ))}
      {/* Final-PoW block label */}
      <g className={motionClass('u6d6-reveal', isStatic)} style={cssVars({ '--delay': `${120 + (preMerge - 1) * 38 + 200}ms` })}>
        <text
          x={startX + (preMerge - 1) * (blockSize + blockGap) + blockSize / 2}
          y={trackY1 - blockSize / 2 - 8}
          textAnchor="middle"
          fontFamily={FONTS.mono}
          fontSize="13"
          fontWeight="600"
          fill={COLORS.ink}
        >
          15,537,393
        </text>
      </g>

      {/* PoS pre-merge blocks */}
      {posBlocks.map((i) => (
        <g key={`pos-${i}`} className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': `${260 + i * 38}ms` })}>
          <rect
            x={startX + i * (blockSize + blockGap)}
            y={trackY2 - blockSize / 2}
            width={blockSize}
            height={blockSize}
            rx={3}
            fill={ETH_LIGHT}
            stroke={ETH_PURPLE}
            strokeWidth={1.2}
          />
        </g>
      ))}

      {/* Convergence curves */}
      <path
        className={motionClass('u6d6-draw', isStatic)}
        style={cssVars({ '--dash': 120, '--delay': `${260 + preMerge * 38 + 80}ms` })}
        d={`M${mergeX - 20} ${trackY1} Q${mergeX + 8} ${trackY1} ${mergeX + 30} ${mergedY}`}
        stroke={COLORS.accent}
        strokeWidth={2.2}
        fill="none"
      />
      <path
        className={motionClass('u6d6-draw', isStatic)}
        style={cssVars({ '--dash': 120, '--delay': `${260 + preMerge * 38 + 80}ms` })}
        d={`M${mergeX - 20} ${trackY2} Q${mergeX + 8} ${trackY2} ${mergeX + 30} ${mergedY}`}
        stroke={ETH_PURPLE}
        strokeWidth={2.2}
        fill="none"
      />

      {/* Merge marker */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': `${260 + preMerge * 38 + 360}ms` })}>
        <line x1={mergeX + 30} y1={trackY1 - 24} x2={mergeX + 30} y2={trackY2 + 24} stroke={COLORS.gold} strokeWidth={1} strokeDasharray="3 3" />
        <text x={mergeX + 30} y={trackY1 - 32} textAnchor="middle" fontFamily={FONTS.sans} fontSize="13" letterSpacing="0.24em" fill={COLORS.gold}>
          SEPT 15, 2022
        </text>
        <text x={mergeX + 30} y={trackY2 + 42} textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="20" fill={ETH_PURPLE_DARK}>
          The Merge
        </text>
      </g>

      {/* Post-merge unified track */}
      {mergedBlocks.map((i) => (
        <g key={`merged-${i}`} className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': `${260 + preMerge * 38 + 600 + i * 50}ms` })}>
          <rect
            x={mergeX + 60 + i * (blockSize + blockGap)}
            y={mergedY - blockSize / 2}
            width={blockSize}
            height={blockSize}
            rx={3}
            fill={ETH_LIGHT}
            stroke={ETH_PURPLE}
            strokeWidth={1.4}
          />
        </g>
      ))}

      {/* Trailing label */}
      <text x={W - 24} y={mergedY + 5} textAnchor="end" fontFamily={FONTS.sans} fontStyle="italic" fontSize="13" fill={COLORS.muted}>
        validators only →
      </text>
    </svg>
  )
}

function SlideTheMerge() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>Ethereum&apos;s transition to Proof of Stake</Eyebrow>
      <Title>
        The <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>Merge:</em> September 15, 2022.
      </Title>
      <div style={{ marginTop: 28, flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <ReplayableDiagram>
          <MergeTimeline isStatic={isStatic} />
        </ReplayableDiagram>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}>
          <div className={motionClass('u6d6-reveal', isStatic)} style={cssVars({ '--delay': '120ms' })}>
            <Body size="bodyLg" style={{ marginBottom: 14 }}>
              On Merge day, Ethereum&apos;s Proof of Work chain and the parallel Beacon Chain (running since December 2020) combined. Mining stopped at block <span style={{ fontFamily: FONTS.mono, color: ETH_PURPLE_DARK }}>15,537,393</span>.
            </Body>
            <Body size="bodyLg">
              No downtime, no balance changes. Annual electricity use fell ~99.95%, from ~78 TWh to ~0.01 TWh.
            </Body>
          </div>
          <div className={motionClass('u6d6-pop', isStatic)} style={{ ...cssVars({ '--delay': '420ms' }), background: COLORS.ink, color: COLORS.paper, borderRadius: 12, padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.24em', textTransform: 'uppercase', color: COLORS.gold }}>Final Proof of Work block</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 38, color: ETH_PURPLE, lineHeight: 1 }}>15,537,393</div>
            <Rule color="rgba(245,239,227,0.2)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontFamily: FONTS.sans, fontSize: 13, color: 'rgba(245,239,227,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <div>
                <div>Date</div>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontStyle: 'italic', color: COLORS.paper, textTransform: 'none', letterSpacing: 'normal', marginTop: 2 }}>Sept 15, 2022</div>
              </div>
              <div>
                <div>Time</div>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontStyle: 'italic', color: COLORS.paper, textTransform: 'none', letterSpacing: 'normal', marginTop: 2 }}>06:42:42 UTC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 14: Part 3 Divider -----------------------------------------------

function SlidePart3Divider() {
  return (
    <PartDivider
      part="Part 03"
      title={
        <>
          Smart
          <br />
          <em style={{ fontStyle: 'italic' }}>Contracts.</em>
        </>
      }
      subtitle="A smart contract is a program stored on the Ethereum blockchain. The next several slides cover what smart contracts are, how they execute, and how they are written."
    />
  )
}

// --- Slide 15: Bitcoin vs Ethereum Scripts ----------------------------------

function BitcoinStackDiagram({ isStatic }: { isStatic: boolean }) {
  const ops = [
    { label: 'OP_CHECKSIG', shade: COLORS.accent },
    { label: '<pubKey>', shade: 'rgba(168,52,30,0.7)' },
    { label: 'OP_HASH160', shade: 'rgba(168,52,30,0.5)' },
    { label: '<sig>', shade: 'rgba(168,52,30,0.4)' },
  ]
  const W = 560
  const H = 320
  const boxH = 56
  const boxW = 420
  const baseY = H - 36
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 22, display: 'block', maxWidth: 480, maxHeight: 280, marginLeft: 'auto', marginRight: 'auto' }} preserveAspectRatio="xMidYMid meet">
      <text x={W / 2} y={26} textAnchor="middle" fontFamily={FONTS.sans} fontSize="16" letterSpacing="0.26em" fill={COLORS.muted}>STACK · BOTTOM-UP</text>
      <line x1={(W - boxW) / 2 - 12} y1={baseY} x2={(W + boxW) / 2 + 12} y2={baseY} stroke={COLORS.muted} strokeWidth={1.6} />
      {ops.map((op, i) => {
        const y = baseY - boxH - 8 - i * (boxH + 8)
        return (
          <g key={op.label} className={motionClass('u6d6-reveal', isStatic)} style={cssVars({ '--delay': `${320 + i * 200}ms` })}>
            <rect x={(W - boxW) / 2} y={y} width={boxW} height={boxH} rx={6} fill={COLORS.cream} stroke={op.shade} strokeWidth={2} />
            <text x={W / 2} y={y + boxH / 2 + 8} textAnchor="middle" fontFamily={FONTS.mono} fontSize="24" fill={COLORS.ink}>{op.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function EvmGraphDiagram({ isStatic }: { isStatic: boolean }) {
  const W = 560
  const H = 320
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ marginTop: 22, display: 'block', maxWidth: 540, maxHeight: 300, marginLeft: 'auto', marginRight: 'auto' }} preserveAspectRatio="xMidYMid meet">
      <text x={W / 2} y={26} textAnchor="middle" fontFamily={FONTS.sans} fontSize="16" letterSpacing="0.26em" fill={COLORS.muted}>CONTROL FLOW</text>
      {/* start node */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '280ms' })}>
        <rect x={28} y={120} width={108} height={48} rx={8} fill={ETH_LIGHT} stroke={ETH_PURPLE} strokeWidth={2} />
        <text x={82} y={150} textAnchor="middle" fontFamily={FONTS.mono} fontSize="20" fill={ETH_PURPLE_DARK}>start</text>
      </g>
      {/* arrow start → if (line + head) */}
      <line className={motionClass('u6d6-draw', isStatic)} style={cssVars({ '--dash': 80, '--delay': '560ms' })} x1={136} y1={144} x2={196} y2={144} stroke={ETH_PURPLE} strokeWidth={2.4} />
      <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '1240ms' })} points="186,138 196,144 186,150" fill={ETH_PURPLE} />
      {/* if diamond */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '1320ms' })}>
        <polygon points="252,104 320,144 252,184 184,144" fill={ETH_LIGHT} stroke={ETH_PURPLE} strokeWidth={2} />
        <text x={252} y={150} textAnchor="middle" fontFamily={FONTS.mono} fontSize="20" fill={ETH_PURPLE_DARK}>if(x)</text>
      </g>
      {/* arrow if → loop body */}
      <line className={motionClass('u6d6-draw', isStatic)} style={cssVars({ '--dash': 80, '--delay': '1700ms' })} x1={320} y1={144} x2={384} y2={144} stroke={ETH_PURPLE} strokeWidth={2.4} />
      <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '2380ms' })} points="374,138 384,144 374,150" fill={ETH_PURPLE} />
      {/* loop body */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '2460ms' })}>
        <rect x={384} y={120} width={96} height={48} rx={8} fill={ETH_LIGHT} stroke={ETH_PURPLE} strokeWidth={2} />
        <text x={432} y={150} textAnchor="middle" fontFamily={FONTS.mono} fontSize="20" fill={ETH_PURPLE_DARK}>loop</text>
      </g>
      {/* loop-back curved arrow */}
      <path className={motionClass('u6d6-draw', isStatic)} style={cssVars({ '--dash': 320, '--delay': '2820ms' })} d="M432 168 Q432 232 280 232 Q184 232 184 172" stroke={ETH_PURPLE} strokeWidth={2} strokeDasharray="6 4" fill="none" />
      <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '3680ms' })} points="178,164 184,174 190,164" fill={ETH_PURPLE} />
      <text x={310} y={252} textAnchor="middle" fontFamily={FONTS.sans} fontStyle="italic" fontSize="16" fill={COLORS.muted}>iterate</text>
      {/* branch down: revert */}
      <line className={motionClass('u6d6-draw', isStatic)} style={cssVars({ '--dash': 100, '--delay': '3700ms' })} x1={252} y1={184} x2={252} y2={264} stroke={ETH_PURPLE} strokeWidth={2.4} />
      <polygon className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '4400ms' })} points="246,254 252,264 258,254" fill={ETH_PURPLE} />
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '4500ms' })}>
        <rect x={196} y={266} width={112} height={42} rx={8} fill={COLORS.paper} stroke={COLORS.danger} strokeWidth={2} />
        <text x={252} y={294} textAnchor="middle" fontFamily={FONTS.mono} fontSize="18" fill={COLORS.danger}>revert</text>
      </g>
    </svg>
  )
}

function SlideBitcoinVsEthereumScripts() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>Comparing the two scripting environments</Eyebrow>
      <Title>
        Bitcoin Script and the <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>Ethereum Virtual Machine.</em>
      </Title>
      <div style={{ marginTop: 32, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'stretch' }}>
        <div style={{ borderTop: `4px solid ${COLORS.accent}`, paddingTop: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8 }}>
            Bitcoin Script
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 30, fontStyle: 'italic', lineHeight: 1.2, color: COLORS.accent, marginBottom: 18 }}>
            A stack-based instruction set, ~100 operations.
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: FONTS.serif, fontSize: 24, lineHeight: 1.4, color: COLORS.ink, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Validates ownership: signatures, hashes, time locks, multi-sig.</li>
            <li>No loops, no persistent storage, no inter-script calls.</li>
            <li>Built for the UTXO (unspent transaction output) model.</li>
          </ul>
          <ReplayableDiagram style={{ marginTop: 'auto' }}>
            <BitcoinStackDiagram isStatic={isStatic} />
          </ReplayableDiagram>
        </div>
        <div style={{ borderTop: `4px solid ${ETH_PURPLE}`, paddingTop: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8 }}>
            Ethereum Virtual Machine (EVM)
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 30, fontStyle: 'italic', lineHeight: 1.2, color: ETH_PURPLE_DARK, marginBottom: 18 }}>
            A Turing-complete execution environment.
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontFamily: FONTS.serif, fontSize: 24, lineHeight: 1.4, color: COLORS.ink, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Loops, conditionals, persistent storage, contract calls.</li>
            <li>Every opcode costs <em>gas</em>, paid by the transaction sender.</li>
            <li>Global consensus on every result.</li>
          </ul>
          <ReplayableDiagram style={{ marginTop: 'auto' }}>
            <EvmGraphDiagram isStatic={isStatic} />
          </ReplayableDiagram>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 16: What is a Smart Contract -------------------------------------

function VendingMachineDiagram({ isStatic }: { isStatic: boolean }) {
  const W = 260
  const H = 300
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380, display: 'block', margin: '0 auto', maxHeight: 440 }} preserveAspectRatio="xMidYMid meet">
      {/* Coin above the slot */}
      <g className={motionClass('u6d6-reveal', isStatic)} style={cssVars({ '--delay': '720ms' })}>
        <circle cx={W * 0.78} cy={28} r={14} fill={COLORS.gold} stroke={COLORS.ink} strokeWidth={1.4} />
        <text x={W * 0.78} y={33} textAnchor="middle" fontFamily={FONTS.serif} fontSize="14" fontWeight="700" fill={COLORS.ink}>Ξ</text>
        <text x={W * 0.78} y={56} textAnchor="middle" fontFamily={FONTS.sans} fontSize="9" letterSpacing="0.22em" fill={COLORS.muted}>0.01 ETH</text>
      </g>
      {/* Machine body */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '200ms' })}>
        <rect x={22} y={66} width={W - 44} height={H - 80} rx={10} fill={COLORS.ink} stroke={ETH_PURPLE_DARK} strokeWidth={2} />
        <text x={W / 2} y={92} textAnchor="middle" fontFamily={FONTS.sans} fontSize="11" letterSpacing="0.3em" fill={COLORS.gold}>SMART CONTRACT</text>
        {/* Display panel */}
        <rect x={40} y={108} width={W - 80} height={70} rx={5} fill={ETH_LIGHT} stroke={ETH_PURPLE} strokeWidth={1.2} />
        <text x={W / 2} y={138} textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="20" fill={ETH_PURPLE_DARK}>buyCoffee()</text>
        <text x={W / 2} y={160} textAnchor="middle" fontFamily={FONTS.mono} fontSize="11" fill={ETH_PURPLE}>require(msg.value &gt;= price)</text>
        {/* Coin slot */}
        <rect x={W - 90} y={194} width={56} height={6} rx={2} fill={ETH_PURPLE_DARK} />
        <text x={W - 96} y={199} textAnchor="end" fontFamily={FONTS.sans} fontSize="9" letterSpacing="0.22em" fill="rgba(245,239,227,0.55)">SLOT</text>
        {/* Output drawer */}
        <rect x={40} y={H - 78} width={W - 80} height={48} rx={4} fill="rgba(245,239,227,0.06)" stroke="rgba(245,239,227,0.22)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={W / 2} y={H - 22} textAnchor="middle" fontFamily={FONTS.sans} fontSize="10" letterSpacing="0.22em" fill="rgba(245,239,227,0.55)">OUTPUT</text>
      </g>
      {/* Coffee cup in output drawer */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '1240ms' })}>
        <path d={`M${W / 2 - 16},${H - 70} h32 v22 a10 10 0 0 1 -10 10 h-12 a10 10 0 0 1 -10 -10 z`} fill={COLORS.cream} stroke={ETH_PURPLE} strokeWidth={1.6} />
        <path d={`M${W / 2 + 16},${H - 64} a8 8 0 0 1 0 16`} fill="none" stroke={ETH_PURPLE} strokeWidth={1.6} />
        <path d={`M${W / 2 - 6},${H - 78} q-2,-6 1,-12`} fill="none" stroke={ETH_PURPLE} strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
        <path d={`M${W / 2 + 4},${H - 78} q2,-5 -1,-10`} fill="none" stroke={ETH_PURPLE} strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
      </g>
    </svg>
  )
}

function SlideWhatIsASmartContract() {
  const isStatic = useIsStaticDeck()
  const properties: Array<[string, string]> = [
    ['Public', 'Bytecode and current state are visible to anyone.'],
    ['Immutable', 'Once deployed, the code cannot be changed.'],
    ['Trustless', 'Execution is enforced by the protocol.'],
    ['Composable', 'Contracts can call other contracts.'],
  ]
  return (
    <SlideFrame>
      <Eyebrow>Definition and execution</Eyebrow>
      <Title>
        What is a <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>smart contract</em>, and how does it run?
      </Title>
      <div style={{ marginTop: 24, flex: 1, display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: 48, alignItems: 'center', minHeight: 0 }}>
        <ReplayableDiagram>
          <VendingMachineDiagram isStatic={isStatic} />
        </ReplayableDiagram>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Body size="body">
            A <em>smart contract</em> is a program stored on the Ethereum blockchain. It has its own address, can hold ETH, and is callable by any user. Informal analogy: a vending machine — supply the input, the contract produces the output.
          </Body>
          <Body size="body">
            Every node runs the same <em>EVM</em> (Ethereum Virtual Machine, a deterministic instruction set) on the same input, and must reach the same resulting state. That replicated execution is what makes the contract trustless.
          </Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {properties.map(([label, text]) => (
              <div
                key={label}
                style={{
                  padding: '10px 14px',
                  border: `1px solid ${COLORS.rule}`,
                  borderRadius: 6,
                  background: COLORS.cream,
                }}
              >
                <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ETH_PURPLE, fontWeight: 600, marginBottom: 2 }}>
                  {label}
                </div>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, lineHeight: 1.3, color: COLORS.inkSoft }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 18: Solidity #1 — SimpleStorage ----------------------------------

function SlideSolidity1() {
  const lines: CodeLine[] = [
    { code: '// SPDX-License-Identifier: MIT' },
    { code: 'pragma solidity ^0.8.20;', comment: '// pick the compiler version' },
    { code: '' },
    { code: 'contract SimpleStorage {', comment: '// like a Java class' },
    { code: '    uint256 private value;', comment: '// state variable (instance variable)' },
    { code: '' },
    { code: '    function set(uint256 newValue) public {' },
    { code: '        value = newValue;', comment: '// writes cost gas' },
    { code: '    }' },
    { code: '' },
    { code: '    function get() public view returns (uint256) {' },
    { code: '        return value;', comment: '// view = free, just reads' },
    { code: '    }' },
    { code: '}' },
  ]
  return (
    <SlideFrame>
      <Eyebrow>Solidity example 1</Eyebrow>
      <Title>
        A contract that stores a single <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>value.</em>
      </Title>
      <div style={{ marginTop: 40, flex: 1, display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: 50, alignItems: 'start' }}>
        <ReplayableDiagram>
          <CodeBlock title="SimpleStorage.sol" lines={lines} animate />
        </ReplayableDiagram>
        <div style={{ paddingTop: 8 }}>
          <Body size="bodyLg" style={{ marginBottom: 18 }}>
            Stores one number on chain. Exposes a setter (<span style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>set</span>) and a getter (<span style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>get</span>).
          </Body>
          <BulletList items={[
            <span><strong>contract</strong>: the unit of deployment. Like a Java <code style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>class</code>.</span>,
            <span><strong>uint256</strong>: 256-bit unsigned integer. Larger than Java&apos;s <code style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>long</code>.</span>,
            <span><strong>state variable</strong>: instance variable that persists on chain.</span>,
            <span><strong>public</strong>, <strong>private</strong>: same access modifiers as Java.</span>,
            <span><strong>view</strong>: function does not modify state. Costs no gas.</span>,
            <span><strong>pragma</strong>: selects the compiler version.</span>,
          ]} />
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 20: Solidity #3 — ERC-20 Excerpt ---------------------------------

function SlideSolidity3() {
  const lines: CodeLine[] = [
    { code: 'mapping(address => uint256) private balances;', comment: '// instance var' },
    { code: '' },
    { code: 'event Transfer(' },
    { code: '    address indexed from,' },
    { code: '    address indexed to,' },
    { code: '    uint256 value' },
    { code: ');' },
    { code: '' },
    { code: 'function transfer(address to, uint256 amount)' },
    { code: '    public returns (bool)' },
    { code: '{' },
    { code: '    require(balances[msg.sender] >= amount, "Insufficient");' },
    { code: '    balances[msg.sender] -= amount;' },
    { code: '    balances[to] += amount;' },
    { code: '    emit Transfer(msg.sender, to, amount);', comment: '// fire log event' },
    { code: '    return true;' },
    { code: '}' },
  ]
  return (
    <SlideFrame>
      <Eyebrow>Solidity example 3</Eyebrow>
      <Title>
        The <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>ERC-20</em> transfer function.
      </Title>
      <div style={{ marginTop: 36, flex: 1, display: 'grid', gridTemplateColumns: '1.3fr 0.9fr', gap: 50, alignItems: 'start' }}>
        <ReplayableDiagram>
          <CodeBlock title="ERC-20 transfer" lines={lines} animate />
        </ReplayableDiagram>
        <div style={{ paddingTop: 8 }}>
          <Body size="bodyLg" style={{ marginBottom: 18 }}>
            <em>ERC-20</em> is a standard token interface on Ethereum. USDC, DAI, UNI, and many others implement the same methods. Like Java&apos;s <code style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>List</code> interface: many implementations, one contract.
          </Body>
          <BulletList items={[
            <span>Three steps: validate (<code style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>require</code>), update state, log (<code style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>emit</code>). Same shape as a typical Java service method.</span>,
            <span><strong>event</strong>: a structured log entry. Like <code style={{ fontFamily: FONTS.mono, fontSize: '0.9em' }}>System.out.println</code>, but readable by any program watching the chain.</span>,
            <span><strong>emit</strong>: fires the event. Like publishing to a Java event bus.</span>,
            <span><strong>indexed</strong>: adds a search index to that field, like a database column index.</span>,
            <span>The shared interface is why any wallet can display any token.</span>,
          ]} />
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 21: Vending Machine Demo (Phase 3) -------------------------------

type CoffeeEvent = { id: number; kind: 'success' | 'revert'; message: string }

function SlideDemoVendingMachine() {
  const [isOwner, setIsOwner] = useState(true)
  const [contractBalance, setContractBalance] = useState(0)
  const [myCoffees, setMyCoffees] = useState(0)
  const [events, setEvents] = useState<CoffeeEvent[]>([])

  const pushEvent = (kind: 'success' | 'revert', message: string) => {
    setEvents((prev) => [{ id: Date.now() + Math.random(), kind, message }, ...prev].slice(0, 4))
  }

  const handleBuy = (amount: number) => {
    if (amount < 0.01) {
      pushEvent('revert', 'Reverted with reason "Not enough ETH". State unchanged.')
      return
    }
    setContractBalance((b) => b + amount)
    setMyCoffees((c) => c + 1)
    pushEvent('success', `buyCoffee() succeeded with ${amount} ETH. coffees[caller] now ${myCoffees + 1}.`)
  }

  const handleWithdraw = () => {
    if (!isOwner) {
      pushEvent('revert', 'Reverted with reason "Only owner". State unchanged.')
      return
    }
    if (contractBalance === 0) {
      pushEvent('revert', 'withdraw() succeeded, but contract balance was 0.')
      return
    }
    pushEvent('success', `withdraw() transferred ${contractBalance.toFixed(2)} ETH to owner.`)
    setContractBalance(0)
  }

  const handleReset = () => {
    setContractBalance(0)
    setMyCoffees(0)
    setEvents([])
    setIsOwner(true)
  }

  const codeLines: Array<{ code: string; comment?: string }> = [
    { code: 'contract CoffeeShop {' },
    { code: '  address owner;' },
    { code: '  uint256 coffeePrice = 0.01 ether;' },
    { code: '  mapping(address => uint256) coffees;', comment: '// like HashMap<Address, Long>' },
    { code: '' },
    { code: '  constructor() {', comment: '// runs once at deployment' },
    { code: '    owner = msg.sender;', comment: '// caller of the deploy tx' },
    { code: '  }' },
    { code: '' },
    { code: '  function buyCoffee() public payable {', comment: '// payable: receives ETH' },
    { code: '    require(msg.value >= coffeePrice, "Not enough ETH");' },
    { code: '    coffees[msg.sender] += 1;' },
    { code: '  }' },
    { code: '' },
    { code: '  function withdraw() public {' },
    { code: '    require(msg.sender == owner, "Only owner");', comment: '// reverts if false' },
    { code: '    payable(owner).transfer(address(this).balance);' },
    { code: '  }' },
    { code: '}' },
  ]
  return (
    <SlideFrame>
      <Eyebrow>Solidity example 2 · live demonstration</Eyebrow>
      <Title>
        A contract that <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>receives payment</em>: CoffeeShop.
      </Title>
      <div style={{ marginTop: 24, flex: 1, display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 36, alignItems: 'stretch', minHeight: 0 }}>
        {/* Left: deployed contract code */}
        <div style={{ background: COLORS.ink, borderRadius: 10, padding: '22px 26px', fontFamily: FONTS.mono, fontSize: 17, color: '#E6E1D2', lineHeight: 1.5 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span>Deployed contract</span>
            <span style={{ color: 'rgba(184,137,59,0.6)' }}>solidity</span>
          </div>
          {codeLines.map((line, i) => (
            <div key={i} style={{ whiteSpace: 'pre' }}>
              <span>{line.code || ' '}</span>
              {line.comment ? (
                <span style={{ color: 'rgba(184,137,59,0.7)', fontStyle: 'italic' }}>  {line.comment}</span>
              ) : null}
            </div>
          ))}
        </div>
        {/* Right: interactive UI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Balance and coffees */}
          <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 8, padding: '16px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, background: ETH_LIGHT }}>
            <div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: ETH_PURPLE_DARK, marginBottom: 4 }}>Contract balance</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 36, color: ETH_PURPLE }}>{contractBalance.toFixed(2)} ETH</div>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 4 }}>Your coffees</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 36, color: COLORS.ink }}>{myCoffees}</div>
            </div>
          </div>
          {/* Role toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.muted }}>You are</div>
            {(['owner', 'customer'] as const).map((role) => {
              const active = (role === 'owner') === isOwner
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setIsOwner(role === 'owner')}
                  style={{
                    border: `1px solid ${active ? ETH_PURPLE : COLORS.rule}`,
                    borderRadius: 6,
                    background: active ? ETH_PURPLE : 'transparent',
                    color: active ? COLORS.paper : COLORS.ink,
                    fontFamily: FONTS.sans,
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '6px 14px',
                    cursor: 'pointer',
                  }}
                >
                  {role}
                </button>
              )
            })}
            <button
              type="button"
              onClick={handleReset}
              style={{
                marginLeft: 'auto',
                border: `1px solid ${COLORS.rule}`,
                borderRadius: 6,
                background: 'transparent',
                color: COLORS.muted,
                fontFamily: FONTS.sans,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <button type="button" onClick={() => handleBuy(0.01)} style={actionBtn(ETH_PURPLE, COLORS.paper)}>
              buyCoffee(0.01 ETH)
            </button>
            <button type="button" onClick={() => handleBuy(0.005)} style={actionBtn(COLORS.danger, COLORS.paper)}>
              buyCoffee(0.005 ETH)
            </button>
            <button type="button" onClick={handleWithdraw} style={actionBtn(COLORS.ink, COLORS.paper)}>
              withdraw()
            </button>
          </div>
          {/* Event log */}
          <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 8, padding: '12px 16px', flex: 1, background: COLORS.cream, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted }}>Event log</div>
            {events.length === 0 ? (
              <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.muted, fontStyle: 'italic' }}>(call a function to log a result)</div>
            ) : (
              events.map((e) => (
                <div
                  key={e.id}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 14,
                    color: e.kind === 'success' ? COLORS.ok : COLORS.danger,
                    borderLeft: `3px solid ${e.kind === 'success' ? COLORS.ok : COLORS.danger}`,
                    paddingLeft: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {e.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

function actionBtn(bg: string, color: string): CSSProperties {
  return {
    border: `2px solid ${bg}`,
    borderRadius: 8,
    background: bg,
    color,
    cursor: 'pointer',
    fontFamily: FONTS.mono,
    fontSize: 14,
    fontWeight: 500,
    padding: '10px 12px',
    transition: `opacity 180ms ease`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}

// --- Slide 22: Gas and Fees -------------------------------------------------

function GasTankBar({ isStatic }: { isStatic: boolean }) {
  const segments: Array<{ name: string; cost: number; w: number; color: string }> = [
    { name: 'ADD', cost: 3, w: 4, color: 'rgba(98,126,234,0.45)' },
    { name: 'MLOAD', cost: 3, w: 4, color: 'rgba(98,126,234,0.65)' },
    { name: 'SLOAD', cost: 2_100, w: 28, color: ETH_PURPLE },
    { name: 'SSTORE', cost: 20_000, w: 266, color: ETH_PURPLE_DARK },
    { name: 'CREATE', cost: 32_000, w: 418, color: COLORS.ink },
  ]
  const TANK_WIDTH = 720
  const TANK_HEIGHT = 50
  const total = segments.reduce((sum, s) => sum + s.cost, 0)
  let cursor = 0
  return (
    <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '18px 22px', background: COLORS.cream }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted }}>
          Relative cost (linear scale)
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: COLORS.muted }}>{total.toLocaleString()} gas total</div>
      </div>
      <svg viewBox={`0 0 ${TANK_WIDTH} ${TANK_HEIGHT + 28}`} width="100%" preserveAspectRatio="xMidYMid meet">
        <rect x={0} y={0} width={TANK_WIDTH} height={TANK_HEIGHT} rx={6} fill="rgba(15,31,58,0.04)" stroke={COLORS.rule} strokeWidth={1} />
        {segments.map((s, i) => {
          const x = cursor
          cursor += s.w
          return (
            <g key={s.name} className={motionClass('u6d6-reveal', isStatic)} style={cssVars({ '--delay': `${480 + i * 100}ms` })}>
              <rect x={x} y={0} width={s.w} height={TANK_HEIGHT} fill={s.color} />
              {s.w > 60 ? (
                <text x={x + s.w / 2} y={TANK_HEIGHT / 2 + 5} textAnchor="middle" fontFamily={FONTS.sans} fontSize="14" letterSpacing="0.22em" fill={COLORS.paper}>
                  {s.name}
                </text>
              ) : null}
              {s.w <= 60 ? (
                <>
                  <line x1={x + s.w / 2} y1={TANK_HEIGHT} x2={x + s.w / 2} y2={TANK_HEIGHT + 8} stroke={COLORS.muted} strokeWidth={1} />
                  <text x={x + s.w / 2} y={TANK_HEIGHT + 22} textAnchor="middle" fontFamily={FONTS.sans} fontSize="11" letterSpacing="0.16em" fill={COLORS.muted}>
                    {s.name}
                  </text>
                </>
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function SlideGasAndFees() {
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>Computation costs on Ethereum</Eyebrow>
      <Title>
        <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>Gas</em> and transaction fees.
      </Title>
      <div style={{ marginTop: 50, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div className={motionClass('u6d6-pop', isStatic)} style={{ ...cssVars({ '--delay': '160ms' }), background: COLORS.ink, color: COLORS.paper, borderRadius: 10, padding: '32px 40px', fontFamily: FONTS.mono, fontSize: 26, marginBottom: 26, textAlign: 'center', lineHeight: 1.4 }}>
            <span style={{ color: ETH_PURPLE }}>gas units used</span>
            <span style={{ color: COLORS.gold }}>{' × '}</span>
            <span style={{ color: ETH_PURPLE }}>price per unit</span>
            <span style={{ color: COLORS.gold }}>{' = '}</span>
            <span style={{ color: COLORS.paper }}>fee in ETH</span>
          </div>
          <Body size="bodyLg" style={{ marginBottom: 14 }}>
            <em>Gas</em> measures the EVM work an operation requires. Every opcode has a fixed gas cost.
          </Body>
          <Body size="bodyLg" style={{ marginBottom: 22 }}>
            Gas prices are quoted in <em>gwei</em> (1 gwei = 10⁻⁹ ETH).
          </Body>
          <ReplayableDiagram>
            <GasTankBar isStatic={isStatic} />
          </ReplayableDiagram>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            ['ADD', '3 gas', 'simple arithmetic'],
            ['MLOAD', '3 gas', 'read from memory'],
            ['SLOAD', '2,100 gas', 'read from storage'],
            ['SSTORE', '20,000 gas', 'write a new storage slot'],
            ['CREATE', '32,000 gas', 'deploy a new contract'],
          ].map(([op, cost, desc], i) => (
            <div key={op} className={motionClass('u6d6-reveal', isStatic)} style={{ ...cssVars({ '--delay': `${480 + i * 100}ms` }), display: 'grid', gridTemplateColumns: '180px 160px 1fr', gap: 18, padding: '14px 20px', border: `1px solid ${COLORS.rule}`, borderRadius: 8, alignItems: 'center' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 24, color: ETH_PURPLE_DARK, fontWeight: 600 }}>{op}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.accent }}>{cost}</div>
              <Body size="body" style={{ color: COLORS.muted }}>{desc}</Body>
            </div>
          ))}
          <Callout kicker="Why gas exists" tone="default" padding="14px 0" style={{ marginTop: 8 }}>
            Bounds execution (running out reverts the transaction) and prices network demand.
          </Callout>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 23: Part 4 Divider -----------------------------------------------

function SlidePart4Divider() {
  return (
    <PartDivider
      part="Part 04"
      title={
        <>
          Applications on
          <br />
          <em style={{ fontStyle: 'italic' }}>Ethereum.</em>
        </>
      }
      subtitle="A short tour of systems that have been built using smart contracts. Each example shows how a familiar service is reconstructed without a central operator."
    />
  )
}

// --- Slide 24: ERC-20 + Etherscan Demo (Phase 3) ----------------------------

type Erc20Receipt = {
  status: 'success' | 'reverted'
  hash: string
  block: number
  fromLabel: string
  amount: number
  gasUsed: number
}

function SlideDemoERC20Etherscan() {
  const ALICE = { name: 'Alice', addr: '0xA1b2…F3c4' }
  const BOB = { name: 'Bob', addr: '0xB0b9…E1d2' }
  const REAL_TX_URL = 'https://etherscan.io/tx/0x6f4f2f5b48e2ad48b08c4daa0d2fd3a7ad8b95a2bb0a1e1dbd8d7e0e4c87a7e9'

  const [aliceBalance, setAliceBalance] = useState(1000)
  const [bobBalance, setBobBalance] = useState(0)
  const [amount, setAmount] = useState(50)
  const [receipt, setReceipt] = useState<Erc20Receipt | null>(null)

  const handleTransfer = () => {
    const blockBase = 21_438_201
    const block = blockBase + (receipt ? Math.floor(Math.random() * 50) : 0)
    const hash = '0x' + Math.random().toString(16).slice(2, 6) + '…' + Math.random().toString(16).slice(2, 6)
    if (amount > aliceBalance) {
      setReceipt({ status: 'reverted', hash, block, fromLabel: ALICE.name, amount, gasUsed: 23_510 })
      return
    }
    setAliceBalance((b) => b - amount)
    setBobBalance((b) => b + amount)
    setReceipt({ status: 'success', hash, block, fromLabel: ALICE.name, amount, gasUsed: 52_310 })
  }

  const handleReset = () => {
    setAliceBalance(1000)
    setBobBalance(0)
    setAmount(50)
    setReceipt(null)
  }

  const success = !receipt || receipt.status === 'success'
  const statusBg = success ? '#3B6E4A' : '#9B2A1B'
  const statusLabel = success ? 'Success' : 'Reverted'

  return (
    <SlideFrame>
      <Eyebrow>Live demonstration</Eyebrow>
      <Title>
        An <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>ERC-20</em> token transfer.
      </Title>
      <div style={{ marginTop: 28, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'stretch', minHeight: 0 }}>
        {/* Left: wallets and controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { name: ALICE.name, balance: aliceBalance, addr: ALICE.addr },
            { name: BOB.name, balance: bobBalance, addr: BOB.addr },
          ].map((w) => (
            <div key={w.name} style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '18px 24px', background: COLORS.cream }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 4 }}>{w.name}</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 40, color: ETH_PURPLE, transition: `color 240ms ${EASE_OUT_QUINT}` }}>
                {w.balance.toLocaleString()} TOKEN
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 15, color: COLORS.muted, marginTop: 4 }}>{w.addr}</div>
            </div>
          ))}
          {/* Slider */}
          <div style={{ border: `1px solid ${COLORS.rule}`, borderRadius: 10, padding: '14px 22px', background: COLORS.paper, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted }}>Transfer amount</div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 28, color: ETH_PURPLE_DARK }}>{amount} TOKEN</div>
            </div>
            <input
              type="range"
              min={0}
              max={1500}
              step={10}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: '100%', accentColor: ETH_PURPLE }}
            />
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: COLORS.muted }}>
              Drag past 1,000 to trigger the require revert (insufficient balance).
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <DemoButton onClick={handleTransfer} style={{ flex: 1 }}>
              Transfer {amount} TOKEN
            </DemoButton>
            <DemoButton tone="ghost" onClick={handleReset}>Reset</DemoButton>
          </div>
        </div>
        {/* Right: Etherscan-style receipt */}
        <div style={{ background: COLORS.ink, color: COLORS.paper, borderRadius: 10, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold }}>
              Etherscan · Transaction
            </div>
            <div style={{ background: statusBg, padding: '3px 12px', borderRadius: 14, fontFamily: FONTS.sans, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {statusLabel}
            </div>
          </div>
          <Rule color="rgba(245,239,227,0.18)" />
          {receipt === null ? (
            <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 22, color: 'rgba(245,239,227,0.55)', padding: '20px 0' }}>
              No transaction yet. Click <strong style={{ color: ETH_PURPLE }}>Transfer</strong> to submit.
            </div>
          ) : (
            <>
              {[
                ['Tx Hash', receipt.hash],
                ['Block', receipt.block.toLocaleString()],
                ['From', `${ALICE.addr} (${receipt.fromLabel})`],
                ['Method', 'transfer(address, uint256)'],
                ['Gas Used', `${receipt.gasUsed.toLocaleString()} (≈ $${(receipt.gasUsed * 0.000016).toFixed(2)})`],
                ['Event', receipt.status === 'success'
                  ? `Transfer(Alice, Bob, ${receipt.amount})`
                  : `require failed: balance(${aliceBalance}) < amount(${receipt.amount})`,
                ],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14 }}>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,227,0.55)' }}>{label}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: receipt.status === 'reverted' && label === 'Event' ? '#F0A89E' : COLORS.paper }}>
                    {value}
                  </div>
                </div>
              ))}
            </>
          )}
          <Rule color="rgba(245,239,227,0.18)" />
          <a
            href={REAL_TX_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: FONTS.sans, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: ETH_PURPLE, textDecoration: 'none' }}
          >
            View a real ERC-20 transfer on etherscan.io ↗
          </a>
        </div>
      </div>
    </SlideFrame>
  )
}

// --- Slide 25: Ecosystem Tour -----------------------------------------------

function SlideEcosystemTour() {
  const apps: Array<{ name: string; url: string; tagline: string; description: string; tone: string }> = [
    {
      name: 'Uniswap',
      url: 'https://uniswap.org',
      tagline: 'Decentralized exchange',
      description: "Users trade tokens directly through a contract. Prices are set by a formula on each pool's relative supply. No order book, no operator.",
      tone: '#FF007A',
    },
    {
      name: 'OpenSea',
      url: 'https://opensea.io',
      tagline: 'NFT marketplace',
      description: 'A marketplace for NFTs (non-fungible tokens). Each sale is a contract call that transfers ownership of a unique on-chain token.',
      tone: '#2081E2',
    },
    {
      name: 'ENS',
      url: 'https://ens.domains',
      tagline: 'Ethereum Name Service',
      description: 'Maps names like vitalik.eth to Ethereum addresses. Like DNS for the chain, implemented as smart contracts.',
      tone: '#5298FF',
    },
    {
      name: 'Aave',
      url: 'https://aave.com',
      tagline: 'Lending protocol',
      description: 'Users deposit tokens as collateral and borrow against them. Interest rates are set by the contract from supply and demand.',
      tone: '#B6509E',
    },
  ]
  const isStatic = useIsStaticDeck()
  return (
    <SlideFrame>
      <Eyebrow>Examples of Ethereum applications</Eyebrow>
      <Title>
        Four systems built on <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>smart contracts.</em>
      </Title>
      <div style={{ marginTop: 36, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 24 }}>
        {apps.map((app, i) => (
          <div
            key={app.name}
            className={motionClass('u6d6-pop', isStatic)}
            style={{
              ...cssVars({ '--delay': `${160 + i * 130}ms` }),
              border: `1px solid ${COLORS.rule}`,
              borderRadius: 10,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              background: COLORS.cream,
              borderTop: `5px solid ${app.tone}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontFamily: FONTS.serif, fontSize: 44, color: COLORS.ink }}>{app.name}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: COLORS.muted }}>{app.url.replace('https://', '')}</div>
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: app.tone, fontWeight: 600 }}>
              {app.tagline}
            </div>
            <Body size="body" style={{ marginTop: 4 }}>{app.description}</Body>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

// --- Slide 26: Real Risks ---------------------------------------------------

function ReentrancyDiagram({ isStatic }: { isStatic: boolean }) {
  const W = 440
  const H = 200
  const xA = 80
  const xV = 360
  const arrows: Array<{ y: number; dir: 'right' | 'left'; label: string; delay: number; danger?: boolean }> = [
    { y: 58, dir: 'right', label: 'withdraw()', delay: 220 },
    { y: 90, dir: 'left', label: 'transfer 1 ETH', delay: 720 },
    { y: 122, dir: 'right', label: 'withdraw() AGAIN', delay: 1240, danger: true },
    { y: 154, dir: 'left', label: 'transfer 1 ETH', delay: 1740, danger: true },
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', height: 'auto', maxHeight: 140 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="u6d6-rentry-arrow-ink" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={COLORS.ink} />
        </marker>
        <marker id="u6d6-rentry-arrow-danger" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 Z" fill={COLORS.danger} />
        </marker>
      </defs>
      {/* Headers */}
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '40ms' })}>
        <rect x={xA - 56} y={14} width={112} height={28} rx={4} fill={COLORS.paper} stroke={COLORS.danger} strokeWidth={1.4} />
        <text x={xA} y={33} textAnchor="middle" fontFamily={FONTS.sans} fontSize="12" letterSpacing="0.18em" fontWeight="600" fill={COLORS.danger}>ATTACKER</text>
      </g>
      <g className={motionClass('u6d6-pop', isStatic)} style={cssVars({ '--delay': '80ms' })}>
        <rect x={xV - 56} y={14} width={112} height={28} rx={4} fill={COLORS.paper} stroke={COLORS.ink} strokeWidth={1.4} />
        <text x={xV} y={33} textAnchor="middle" fontFamily={FONTS.sans} fontSize="12" letterSpacing="0.18em" fontWeight="600" fill={COLORS.ink}>VAULT</text>
      </g>
      {/* Lifelines */}
      <line x1={xA} y1={46} x2={xA} y2={H - 24} stroke="rgba(155,42,27,0.3)" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={xV} y1={46} x2={xV} y2={H - 24} stroke="rgba(15,31,58,0.3)" strokeWidth={1} strokeDasharray="3 3" />
      {/* Arrows */}
      {arrows.map((a, i) => {
        const color = a.danger ? COLORS.danger : COLORS.ink
        const x1 = a.dir === 'right' ? xA + 10 : xV - 10
        const x2 = a.dir === 'right' ? xV - 10 : xA + 10
        const markerId = a.danger ? 'u6d6-rentry-arrow-danger' : 'u6d6-rentry-arrow-ink'
        return (
          <g key={i}>
            <line
              className={motionClass('u6d6-draw', isStatic)}
              style={cssVars({ '--dash': 320, '--delay': `${a.delay}ms` })}
              x1={x1}
              y1={a.y}
              x2={x2}
              y2={a.y}
              stroke={color}
              strokeWidth={a.danger ? 2.2 : 1.6}
              markerEnd={`url(#${markerId})`}
            />
            <text
              x={(xA + xV) / 2}
              y={a.y - 6}
              textAnchor="middle"
              fontFamily={FONTS.mono}
              fontSize="12"
              fill={color}
              className={motionClass('u6d6-reveal', isStatic)}
              style={cssVars({ '--delay': `${a.delay + 280}ms` })}
            >
              {a.label}
            </text>
          </g>
        )
      })}
      {/* Footer */}
      <text
        x={W / 2}
        y={H - 6}
        textAnchor="middle"
        fontFamily={FONTS.sans}
        fontStyle="italic"
        fontSize="12"
        fill={COLORS.danger}
        className={motionClass('u6d6-reveal', isStatic)}
        style={cssVars({ '--delay': '2300ms' })}
      >
        balance never decremented in time · drained
      </text>
    </svg>
  )
}

type RiskCard = {
  label: string
  text: string
  diagram?: ReactNode
  reference: { title: string; year: string; source: string; href: string }
}

function SlideRealRisks() {
  const isStatic = useIsStaticDeck()
  const risks: RiskCard[] = [
    {
      label: 'Re-entrancy',
      text: 'A called contract re-enters its caller before state is updated. Funds can be withdrawn twice.',
      diagram: <ReentrancyDiagram isStatic={isStatic} />,
      reference: {
        title: 'The DAO drained ~$60M',
        year: '2016',
        source: 'Wikipedia',
        href: 'https://en.wikipedia.org/wiki/The_DAO',
      },
    },
    {
      label: 'Rug pulls',
      text: 'A team launches a token, attracts deposits, then drains the contract. The code runs as written; the deception is off-chain.',
      reference: {
        title: 'Squid Game token rug pull',
        year: '2021',
        source: 'Wikipedia',
        href: 'https://en.wikipedia.org/wiki/2021_Squid_Game_cryptocurrency_scam',
      },
    },
    {
      label: 'Immutability',
      text: 'Deployed code cannot be patched. Bugs are fixed only by deploying a new contract and migrating users.',
      reference: {
        title: 'Parity multi-sig freeze (~$300M)',
        year: '2017',
        source: 'TechCrunch',
        href: 'https://techcrunch.com/2017/11/07/a-major-vulnerability-has-frozen-hundreds-of-millions-of-dollars-of-ethereum/',
      },
    },
  ]
  return (
    <SlideFrame>
      <Eyebrow>Limitations and failure modes</Eyebrow>
      <Title>
        Risks of <em style={{ fontStyle: 'italic', color: COLORS.danger }}>smart contracts.</em>
      </Title>
      <div style={{ marginTop: 28, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, alignItems: 'stretch' }}>
        {risks.map((risk, i) => (
          <div
            key={risk.label}
            className={motionClass('u6d6-reveal', isStatic)}
            style={{
              ...cssVars({ '--delay': `${160 + i * 160}ms` }),
              border: `1px solid ${COLORS.danger}`,
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: 'rgba(155,42,27,0.04)',
            }}
          >
            <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.danger, fontWeight: 600 }}>
              {risk.label}
            </div>
            {risk.diagram ? (
              <ReplayableDiagram>
                {risk.diagram}
              </ReplayableDiagram>
            ) : null}
            <Body size="body">{risk.text}</Body>
            <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: `1px solid rgba(155,42,27,0.2)`, fontFamily: FONTS.sans, fontSize: 13, color: COLORS.muted, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 10, color: COLORS.danger, fontWeight: 600 }}>
                Real-world example · {risk.reference.year}
              </div>
              <a
                href={risk.reference.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: COLORS.ink, textDecoration: 'underline', fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 16, lineHeight: 1.25 }}
              >
                {risk.reference.title} · <span style={{ fontStyle: 'normal', color: COLORS.muted, fontSize: 12 }}>{risk.reference.source}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      <Callout kicker="The tradeoff" tone="warning" padding="16px 0" style={{ marginTop: 24, maxWidth: 1500 }}>
        A contract that cannot be censored or rewritten is also one whose mistakes are permanent.
      </Callout>
    </SlideFrame>
  )
}

// --- Slide 27: Recap --------------------------------------------------------

function SlideRecap() {
  const isStatic = useIsStaticDeck()
  const items: Array<[string, string, string]> = [
    ['01', 'Proof of Stake.', "Validators replace miners. Security depends on the value of staked ETH rather than electricity. The Merge of September 2022 reduced Ethereum's energy use by ~99.95%."],
    ['02', 'Smart contracts.', "Ethereum extends scripting into a Turing-complete environment. Solidity programs run identically on every node, which is what gives them global consensus."],
    ['03', 'Open deployment.', "Any account with enough ETH for gas can deploy a contract. The barrier to launching a financial application is much lower than for traditional equivalents."],
  ]
  return (
    <SlideFrame>
      <Eyebrow>Summary</Eyebrow>
      <Title>
        Today&apos;s <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>key concepts.</em>
      </Title>
      <div style={{ marginTop: 50, flex: 1, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {items.map(([n, head, body], i) => (
          <div
            key={n}
            className={motionClass('u6d6-reveal', isStatic)}
            style={{
              ...cssVars({ '--delay': `${180 + i * 200}ms` }),
              display: 'grid',
              gridTemplateColumns: '90px 1fr',
              gap: 30,
              padding: '20px 0',
              borderTop: `1px solid ${COLORS.ruleFaint}`,
            }}
          >
            <Numeral n={n} color={ETH_PURPLE} />
            <div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 38, marginBottom: 8 }}>{head}</div>
              <Body size="body">{body}</Body>
            </div>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

// --- Slide 28: Next Class ---------------------------------------------------

function SlideNextClass() {
  return (
    <SlideFrame variant="ink" footer={false}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, letterSpacing: '0.26em', textTransform: 'uppercase', color: COLORS.gold }}>Next class</div>
        <Title color={COLORS.paper} size="titleLg" style={{ marginTop: 24, fontSize: 110, lineHeight: 0.99 }}>
          Building <em style={{ fontStyle: 'italic', color: ETH_PURPLE }}>dApps.</em>
        </Title>
        <Subtitle color="rgba(245,239,227,0.78)" style={{ marginTop: 36, fontSize: 32, maxWidth: 1280, lineHeight: 1.4 }}>
          Day 7 focuses on <em>decentralized applications</em>. We will look at how a frontend connects to a smart contract through a wallet, the role of an RPC provider, and the shape of a typical dApp stack.
        </Subtitle>
      </div>
    </SlideFrame>
  )
}

// --- Export ------------------------------------------------------------------

export const DAY6_SLIDES: DeckSlideDefinition[] = [
  { label: 'Cover', Component: SlideCover },
  { label: 'Agenda', Component: SlideAgenda },
  { label: 'Part 01', Component: SlidePart1Divider },
  { label: 'PoW Recap', Component: SlidePoWRecap },
  { label: 'Energy Problem', Component: SlideEnergyProblem },
  { label: '51% Attack', Component: Slide51PercentAttack },
  { label: 'Litecoin Reorg (April 2026)', Component: SlideLitecoinReorg },
  { label: 'PoS Introduction', Component: SlidePoSIntroduction },
  { label: 'Validator Lottery', Component: SlideValidatorLottery },
  { label: 'PoS Lifecycle', Component: SlidePoSLifecycle },
  { label: 'PoW vs PoS Demo', Component: SlideDemoPoWvsPoS },
  { label: 'Part 02', Component: SlidePart2Divider },
  { label: 'PoW vs PoS Table', Component: SlidePoWvsPoSTable },
  { label: 'The Merge', Component: SlideTheMerge },
  { label: 'Part 03', Component: SlidePart3Divider },
  { label: 'BTC vs ETH Scripts', Component: SlideBitcoinVsEthereumScripts },
  { label: 'What Is a Smart Contract', Component: SlideWhatIsASmartContract },
  { label: 'Solidity 1', Component: SlideSolidity1 },
  { label: 'Vending Machine Demo', Component: SlideDemoVendingMachine },
  { label: 'Solidity 3', Component: SlideSolidity3 },
  { label: 'Gas and Fees', Component: SlideGasAndFees },
  { label: 'Part 04', Component: SlidePart4Divider },
  { label: 'ERC-20 + Etherscan Demo', Component: SlideDemoERC20Etherscan },
  { label: 'Ecosystem Tour', Component: SlideEcosystemTour },
  { label: 'Real Risks', Component: SlideRealRisks },
  { label: 'Recap', Component: SlideRecap },
  { label: 'Next Class', Component: SlideNextClass },
]
