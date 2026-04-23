import { useState, type CSSProperties, type ReactNode } from 'react'
import type { DeckSlideDefinition } from '../../runtime/types'
import { Callout } from '../../shared/patterns'
import { Body, Eyebrow, Numeral, SlideFrame, Subtitle, Title } from '../../shared/primitives'
import { COLORS, FONTS } from '../../shared/tokens'

type ThresholdValue = 1 | 2 | 3

type DemoSigner = {
  id: string
  label: string
  initial: string
  role: string
  pub: string
  auth: boolean
  intruder?: boolean
}

function PartDivider({
  part,
  title,
  subtitle,
}: {
  part: string
  title: ReactNode
  subtitle: ReactNode
}) {
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

function SlideCover() {
  return (
    <SlideFrame variant="bleed" footer={false} pad={false}>
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
              Day 04
            </div>
            <Title size="titleLg" style={{ fontSize: 108, lineHeight: 0.97 }}>
              Bitcoin Wallets
              <br />
              <span style={{ fontStyle: 'italic', color: COLORS.accent }}>&amp;</span> Multi-Signatures
            </Title>
            <Subtitle style={{ fontSize: 36, marginTop: 40 }}>
              When one secret isn&apos;t enough to protect serious value.
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
            <span>HTCS · Unit 6 · Day 04</span>
            <span>lecture + demo</span>
          </div>
        </div>

        <div style={{ background: COLORS.ink, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 80, left: 64, right: 64, bottom: 260 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                fontFamily: FONTS.mono,
                fontSize: 80,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ color: 'rgba(245,239,227,0.20)' }}>KEY_01</span>
              <span style={{ color: 'rgba(245,239,227,0.20)' }}>KEY_02</span>
              <span style={{ color: 'rgba(245,239,227,0.07)' }}>KEY_03</span>
            </div>
            <div style={{ marginTop: 52, fontFamily: FONTS.sans, fontSize: 72, color: COLORS.gold, letterSpacing: '-0.02em', fontWeight: 600, lineHeight: 1 }}>
              2 of 3
            </div>
            <div style={{ marginTop: 12, fontFamily: FONTS.sans, fontSize: 22, color: 'rgba(245,239,227,0.45)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              threshold
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: 64,
              right: 64,
              borderTop: '1px solid rgba(245,239,227,0.35)',
              paddingTop: 24,
              color: COLORS.paper,
              fontFamily: FONTS.serif,
              fontStyle: 'italic',
              fontSize: 30,
              lineHeight: 1.35,
              background: COLORS.ink,
            }}
          >
            &ldquo;Your keys, your bitcoin - until your keys are someone else&apos;s problem.&rdquo;
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlideAgenda() {
  const items = [
    ['01', 'The single-key problem', 'Why protecting one secret is harder than it sounds.'],
    ['02', 'Multi-sig wallets', 'How multiple keys share control over one address.'],
    ['03', 'Signing transactions', 'What happens step by step when you spend.'],
    ['04', 'Security trade-offs', "What multi-sig protects against - and what it doesn't."],
  ]

  return (
    <SlideFrame>
      <Eyebrow>Today&apos;s agenda</Eyebrow>
      <Title>
        Four questions about <em style={{ fontStyle: 'italic', color: COLORS.accent }}>securing Bitcoin.</em>
      </Title>
      <div style={{ marginTop: 44, flex: 1 }}>
        {items.map(([n, t, d], i) => (
          <div
            key={n}
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1.2fr 2fr',
              gap: 32,
              padding: '18px 0',
              borderTop: `1px solid ${COLORS.ruleFaint}`,
              borderBottom: i === items.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
            }}
          >
            <Numeral n={n} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 38, lineHeight: 1.1, alignSelf: 'center' }}>{t}</div>
            <Body size="bodyLg" style={{ alignSelf: 'center' }}>{d}</Body>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

function SlidePart1Divider() {
  return (
    <PartDivider
      part="Part 01"
      title="One Key."
      subtitle="Why is a single private key a single point of failure?"
    />
  )
}

function SlideSeedPhrase() {
  const words = ['witch', 'collapse', 'practice', 'feed', 'shame', 'open', 'despair', 'creek', 'road', 'again', 'ice', 'least']

  return (
    <SlideFrame>
      <Eyebrow>The vulnerability</Eyebrow>
      <Title style={{ maxWidth: 1100 }}>
        twelve words stand between you and <em style={{ fontStyle: 'italic', color: COLORS.accent }}>everything.</em>
      </Title>
      <div style={{ marginTop: 48, background: COLORS.ink, borderRadius: 12, padding: '36px 48px' }}>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 20,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            marginBottom: 20,
          }}
        >
          Seed phrase (example only)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px 24px' }}>
          {words.map((word, index) => (
            <div key={word} style={{ fontFamily: FONTS.mono, fontSize: 28, color: COLORS.paper }}>
              <span style={{ color: 'rgba(245,239,227,0.4)', fontSize: 20, marginRight: 8 }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {word}
            </div>
          ))}
        </div>
      </div>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        Your private key is derived from this seed phrase. Whoever holds these words controls your wallet
        &mdash; instantly, irreversibly, with no appeals process.
      </Body>
    </SlideFrame>
  )
}

function SlideCustodialRisk() {
  return (
    <SlideFrame>
      <Eyebrow>The custodial trade-off</Eyebrow>
      <Title style={{ maxWidth: 1200 }}>
        trusting a service means <em style={{ fontStyle: 'italic', color: COLORS.accent }}>trusting their security.</em>
      </Title>
      <div style={{ marginTop: 48, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 12, padding: '36px 44px' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 20 }}>
            Self-custody
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.05, marginBottom: 28 }}>You hold the key.</div>
          <Body>
            No third party can freeze, seize, or lose your funds. But if you lose the seed phrase &mdash; or someone
            finds it &mdash; there is no recovery.
          </Body>
        </div>

        <div style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 12, padding: '36px 44px', background: COLORS.creamDark }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 20 }}>
            Custodial (Coinbase, etc.)
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.05, marginBottom: 28 }}>They hold the key.</div>
          <Body>
            Convenient to use, easier to recover. But you are trusting the company&apos;s security engineers to protect
            your funds from hackers, insiders, and regulators.
          </Body>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlidePart2Divider() {
  return (
    <PartDivider
      part="Part 02"
      title="Multi-Sig."
      subtitle="What if ownership required more than one signature?"
    />
  )
}

function SlideMultipleKeys() {
  const signers = [
    { initial: 'A', name: 'Alice', seed: 'witch collapse…', priv: '5KJvsn…e8Wz', pub: '02a3f8…d91c4e' },
    { initial: 'B', name: 'Bob', seed: 'vessel ladder…', priv: 'KwDiBf…n7Pm', pub: '03c72b…a5f019' },
    { initial: 'C', name: 'Carol', seed: 'olympic cricket…', priv: 'L4rK21…qPm9', pub: '0291de…7b3c82' },
  ]

  const rowStyle = (highlight: boolean): CSSProperties => ({
    fontFamily: FONTS.mono,
    fontSize: 22,
    color: highlight ? COLORS.inkSoft : COLORS.muted,
    background: highlight ? COLORS.creamDark : 'transparent',
    border: `1px solid ${COLORS.ruleFaint}`,
    borderRadius: 6,
    padding: '10px 14px',
    lineHeight: 1.3,
  })

  const arrowStyle: CSSProperties = {
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 20,
    color: COLORS.rule,
    margin: '4px 0',
  }

  return (
    <SlideFrame>
      <Eyebrow>Where the keys come from</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        three signers, <em style={{ fontStyle: 'italic', color: COLORS.accent }}>three independent</em> key pairs.
      </Title>
      <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {signers.map(({ initial, name, seed, priv, pub }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ background: COLORS.ink, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: COLORS.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONTS.sans,
                  fontWeight: 700,
                  fontSize: 20,
                  color: COLORS.ink,
                  flexShrink: 0,
                }}
              >
                {initial}
              </div>
              <div style={{ fontFamily: FONTS.serif, fontSize: 32, color: COLORS.paper }}>{name}</div>
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', background: COLORS.paper }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>
                Own seed phrase
              </div>
              <div style={rowStyle(true)}>{seed}</div>
              <div style={arrowStyle}>↓ hashed once</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>
                Private key <span style={{ color: COLORS.danger, fontSize: 11 }}>- never shared</span>
              </div>
              <div style={rowStyle(false)}>{priv}</div>
              <div style={arrowStyle}>↓ elliptic curve multiply</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>
                Public key <span style={{ color: COLORS.ok, fontSize: 11 }}>- shared openly</span>
              </div>
              <div style={{ ...rowStyle(false), color: COLORS.ok, borderColor: COLORS.ok }}>{pub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: COLORS.ink, borderRadius: 8, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 14, letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.gold, flexShrink: 0 }}>
          Wallet script
        </div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.paper }}>
          OP_2 <span style={{ color: COLORS.gold }}>02a3f8…</span> <span style={{ color: COLORS.gold }}>03c72b…</span>{' '}
          <span style={{ color: COLORS.gold }}>0291de…</span> OP_3 OP_CHECKMULTISIG
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 18, color: 'rgba(245,239,227,0.6)', marginLeft: 'auto', flexShrink: 0 }}>
          three public keys baked in; 2-of-3 to spend
        </div>
      </div>
    </SlideFrame>
  )
}

const MULTISIG_SIGNERS: DemoSigner[] = [
  { id: 'alice', label: 'Alice', initial: 'A', role: 'authorized signer', pub: 'PK: 02a3f8…d91c4e', auth: true },
  { id: 'bob', label: 'Bob', initial: 'B', role: 'authorized signer', pub: 'PK: 03c72b…a5f019', auth: true },
  { id: 'carol', label: 'Carol', initial: 'C', role: 'authorized signer', pub: 'PK: 0291de…7b3c82', auth: true },
  { id: 'eve', label: 'Eve', initial: '?', role: 'unknown - not registered', pub: 'PK: 04ff39…2a9b00', auth: false, intruder: true },
]

const THRESHOLD_DESCS: Record<ThresholdValue, [string, string, string]> = {
  1: ['Any ', '1', ' of the 3 registered keys can authorize this transaction.'],
  2: ['At least ', '2', ' of the 3 registered keys must sign - neither alone is enough.'],
  3: ['All ', '3', ' registered keys must sign - unanimous approval required.'],
}

function SlideMultisigVerification() {
  const [threshold, setThreshold] = useState<ThresholdValue>(2)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const validCount = [...selected].filter((id) => MULTISIG_SIGNERS.find((signer) => signer.id === id)?.auth).length
  const hasEve = selected.has('eve')
  const approved = validCount >= threshold
  const anySelected = selected.size > 0

  const resultState = !anySelected ? 'idle' : approved ? 'success' : 'failure'
  const resultBorder = resultState === 'success' ? COLORS.ok : resultState === 'failure' ? COLORS.danger : 'transparent'
  const resultBg = resultState === 'success' ? 'rgba(59,110,74,0.10)' : resultState === 'failure' ? 'rgba(155,42,27,0.10)' : 'rgba(15,31,58,0.05)'

  let resultTitle = 'Select signers to begin'
  let resultSub = 'Watch the checks update in real time'
  if (anySelected) {
    if (approved) {
      resultTitle = 'Approved - threshold met'
      resultSub = `${validCount} valid signature${validCount !== 1 ? 's' : ''} from registered keys. Threshold: ${threshold}. Broadcasting to the network.`
    } else if (validCount === 0 && hasEve) {
      resultTitle = "Rejected - Eve's key is not in the wallet script"
      resultSub = 'The network only checks against the public keys registered at wallet creation.'
    } else if (hasEve && validCount > 0) {
      resultTitle = "Rejected - Eve's key cannot substitute for a registered signer"
      resultSub = `${validCount} valid signature${validCount !== 1 ? 's' : ''} found, but Eve's public key isn't registered.`
    } else {
      resultTitle = `Rejected - need ${threshold} signature${threshold !== 1 ? 's' : ''}, have ${validCount}`
      resultSub = `${threshold - validCount} more valid signature${threshold - validCount !== 1 ? 's' : ''} required.`
    }
  }

  const desc = THRESHOLD_DESCS[threshold]

  return (
    <SlideFrame>
      <Eyebrow style={{ marginBottom: 10 }}>Multi-signature verification</Eyebrow>
      <Title style={{ marginBottom: 14 }}>
        how does the network verify the <em>right keys</em> signed?
      </Title>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexShrink: 0,
          background: COLORS.ink,
          borderRadius: 10,
          padding: '12px 28px',
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            whiteSpace: 'nowrap',
          }}
        >
          Spending rule
        </div>
        <div style={{ fontFamily: FONTS.sans, fontSize: 20, color: 'rgba(245,239,227,0.65)', flex: 1, lineHeight: 1.3 }}>
          {desc[0]}
          <strong style={{ color: 'rgba(245,239,227,0.95)', fontWeight: 700 }}>{desc[1]}</strong>
          {desc[2]}
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {[1, 2, 3].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setThreshold(count as ThresholdValue)}
              style={{
                fontFamily: FONTS.mono,
                fontSize: 24,
                fontWeight: 600,
                padding: '10px 28px',
                borderRadius: 8,
                letterSpacing: '0.04em',
                border: `2.5px solid ${threshold === count ? COLORS.gold : 'rgba(255,255,255,0.28)'}`,
                background: threshold === count ? COLORS.gold : 'transparent',
                color: threshold === count ? COLORS.ink : 'rgba(245,239,227,0.6)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {count}-of-3
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 16,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: COLORS.muted,
              marginBottom: 10,
              flexShrink: 0,
            }}
          >
            Click to select signers
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0 }}>
            {MULTISIG_SIGNERS.map((signer) => {
              const isOn = selected.has(signer.id)
              const borderColor = isOn
                ? signer.auth ? COLORS.ok : COLORS.danger
                : signer.intruder ? 'rgba(155,42,27,0.32)' : COLORS.rule
              const bg = isOn ? signer.auth ? 'rgba(59,110,74,0.10)' : 'rgba(155,42,27,0.10)' : 'transparent'
              const avatarBg = isOn ? signer.auth ? COLORS.ok : COLORS.danger : signer.intruder ? 'rgba(155,42,27,0.10)' : 'rgba(15,31,58,0.10)'
              const avatarColor = isOn ? '#fff' : signer.intruder ? COLORS.danger : COLORS.ink

              return (
                <div key={signer.id} style={{ display: 'contents' }}>
                  {signer.intruder ? (
                    <div
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 13,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: COLORS.danger,
                        marginTop: 2,
                        marginBottom: 2,
                        opacity: 0.7,
                        flexShrink: 0,
                      }}
                    >
                      WARNING: not in wallet script
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => toggle(signer.id)}
                    style={{
                      border: `3px solid ${borderColor}`,
                      borderStyle: signer.intruder && !isOn ? 'dashed' : 'solid',
                      borderRadius: 9,
                      padding: '12px 20px',
                      cursor: 'pointer',
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 40px',
                      alignItems: 'center',
                      gap: 16,
                      background: bg,
                      transition: 'border-color 0.15s, background 0.15s',
                      flex: 1,
                      minHeight: 0,
                      userSelect: 'none',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 28,
                        background: avatarBg,
                        color: avatarColor,
                        flexShrink: 0,
                      }}
                    >
                      {signer.initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: FONTS.serif, fontSize: 26, fontWeight: 600, lineHeight: 1.15, color: signer.intruder ? COLORS.danger : COLORS.ink }}>
                        {signer.label}
                      </div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.muted, marginTop: 2 }}>{signer.role}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.muted, marginTop: 3 }}>{signer.pub}</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        flexShrink: 0,
                        border: `3px solid ${isOn ? signer.auth ? COLORS.ok : COLORS.danger : COLORS.rule}`,
                        background: isOn ? signer.auth ? COLORS.ok : COLORS.danger : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: isOn ? '#fff' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isOn ? signer.auth ? '✓' : '✕' : ''}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 16,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: COLORS.muted,
              flexShrink: 0,
            }}
          >
            Signature verification
          </div>

          <div style={{ background: COLORS.ink, borderRadius: 9, padding: '12px 20px', flexShrink: 0 }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 8 }}>
              Pending Transaction
            </div>
            {[
              ['From', 'bc1q…9e4f  (this multisig wallet)'],
              ['To', 'bc1q…3a72'],
              ['Amount', '0.5 BTC'],
            ].map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.mono, fontSize: 18, color: 'rgba(245,239,227,0.5)', lineHeight: 1.8 }}>
                <span>{key}</span>
                <span style={{ color: 'rgba(245,239,227,0.9)' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {MULTISIG_SIGNERS.map((signer, index) => {
              const isOn = selected.has(signer.id)
              const state = !isOn ? 'abs' : signer.auth ? 'pass' : 'fail'
              const iconBg = state === 'abs' ? 'rgba(15,31,58,0.05)' : state === 'pass' ? 'rgba(59,110,74,0.15)' : 'rgba(155,42,27,0.15)'
              const iconColor = state === 'abs' ? 'rgba(15,31,58,0.2)' : state === 'pass' ? COLORS.ok : COLORS.danger
              const verdictColor = state === 'pass' ? COLORS.ok : state === 'fail' ? COLORS.danger : COLORS.muted

              return (
                <div
                  key={signer.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '48px 1fr auto',
                    alignItems: 'center',
                    gap: 14,
                    flex: 1,
                    minHeight: 0,
                    borderTop: index === 0 ? `1px solid ${COLORS.rule}` : 'none',
                    borderBottom: `1px solid ${COLORS.rule}`,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: iconBg,
                      color: iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >
                    {state === 'abs' ? '—' : state === 'pass' ? '✓' : '✕'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.ink, lineHeight: 1.2 }}>{signer.label}&apos;s signature</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
                      {signer.pub} - {signer.auth ? 'in wallet script' : 'NOT in wallet script'}
                    </div>
                  </div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: state !== 'abs' ? 600 : 400, color: verdictColor, whiteSpace: 'nowrap' }}>
                    {state === 'abs' ? 'waiting' : state === 'pass' ? '✓ verified' : '✕ rejected'}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            style={{
              borderRadius: 9,
              padding: '12px 20px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              border: `3px solid ${resultBorder}`,
              background: resultBg,
              transition: 'background 0.2s, border-color 0.2s',
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 26,
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: resultState === 'success' ? COLORS.ok : resultState === 'failure' ? COLORS.danger : COLORS.muted,
                }}
              >
                {resultTitle}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 18, color: COLORS.muted, marginTop: 4, lineHeight: 1.4 }}>
                {resultSub}
              </div>
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 56,
                fontWeight: 700,
                flexShrink: 0,
                color: resultState === 'success' ? COLORS.ok : resultState === 'failure' ? COLORS.danger : 'rgba(15,31,58,0.15)',
              }}
            >
              {!anySelected ? '—' : `${validCount}/${threshold}`}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelected(new Set())}
            style={{
              alignSelf: 'flex-end',
              fontFamily: FONTS.mono,
              fontSize: 16,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '10px 24px',
              borderRadius: 6,
              border: `2px solid ${COLORS.rule}`,
              background: 'transparent',
              color: COLORS.muted,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlideKeyDistribution() {
  const keys = [
    { n: '01', location: 'Phone or hardware wallet', role: 'Daily use - signs transactions on the go.' },
    { n: '02', location: 'Offline safe', role: 'Cold backup - never touches the internet.' },
    { n: '03', location: 'Multi-sig provider server', role: 'Remote co-signer - adds fraud detection layer.' },
  ]

  return (
    <SlideFrame>
      <Eyebrow>Distributed storage</Eyebrow>
      <Title style={{ maxWidth: 1200 }}>
        keys in <em style={{ fontStyle: 'italic', color: COLORS.accent }}>different places</em> mean no single point of failure.
      </Title>
      <div style={{ marginTop: 52, flex: 1 }}>
        {keys.map(({ n, location, role }, index) => (
          <div
            key={n}
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 380px 1fr',
              gap: 36,
              alignItems: 'center',
              padding: '24px 0',
              borderTop: `1px solid ${COLORS.ruleFaint}`,
              borderBottom: index === keys.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
            }}
          >
            <Numeral n={n} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.1, color: COLORS.ink }}>{location}</div>
            <Body size="bodyLg">{role}</Body>
          </div>
        ))}
      </div>
      <Body style={{ marginTop: 32, color: COLORS.muted, fontStyle: 'italic', fontSize: 28 }}>
        Storing all three keys in the same location defeats the purpose - it&apos;s equivalent to a single key again.
      </Body>
    </SlideFrame>
  )
}

function SlidePart3Divider() {
  return (
    <PartDivider
      part="Part 03"
      title="The Transaction."
      subtitle="What actually happens when you spend from a multi-sig wallet?"
    />
  )
}

function SlideSigningStep1() {
  const items = [
    { label: 'YOU', sub: 'sign with KEY_01', highlight: true },
    { arrow: true },
    { label: 'PARTIAL TX', sub: '1 of 2 signatures' },
    { arrow: true, faint: true },
    { label: 'BROADCAST', sub: 'needs 2nd signature', faint: true },
  ]

  return (
    <SlideFrame>
      <Eyebrow color={COLORS.gold}>Step 01 - User</Eyebrow>
      <Title style={{ maxWidth: 1200 }}>
        you sign the transaction <em style={{ fontStyle: 'italic', color: COLORS.accent }}>with your key.</em>
      </Title>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        When you tap &ldquo;pay,&rdquo; your wallet app constructs a transaction and signs it with the private key on your
        phone. The signature proves your intent &mdash; but it isn&apos;t enough on its own.
      </Body>

      <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 0 }}>
        {items.map((item, index) => {
          if ('arrow' in item) {
            return (
              <div key={index} style={{ flex: 1, height: 2, background: item.faint ? COLORS.ruleFaint : COLORS.rule, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    right: -10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: `14px solid ${item.faint ? COLORS.ruleFaint : COLORS.rule}`,
                  }}
                />
              </div>
            )
          }

          return (
            <div key={index} style={{ border: `1px solid ${item.highlight ? COLORS.accent : item.faint ? COLORS.ruleFaint : COLORS.rule}`, borderRadius: 10, padding: '24px 36px', minWidth: 260, textAlign: 'center', opacity: item.faint ? 0.5 : 1 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 28, color: item.highlight ? COLORS.accent : COLORS.inkSoft, letterSpacing: '0.1em', marginBottom: 8 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: COLORS.muted, letterSpacing: '0.08em' }}>{item.sub}</div>
            </div>
          )
        })}
      </div>
    </SlideFrame>
  )
}

function SlideSigningStep2() {
  const items = [
    { label: 'PARTIAL TX', sub: '1 signature', faint: true },
    { arrow: true },
    { label: 'PROVIDER', sub: 'sign with KEY_02', highlight: true },
    { arrow: true },
    { label: 'BROADCAST', sub: 'threshold met', ok: true },
  ]

  return (
    <SlideFrame>
      <Eyebrow color={COLORS.gold}>Step 02 - Provider</Eyebrow>
      <Title style={{ maxWidth: 1200 }}>
        the provider <em style={{ fontStyle: 'italic', color: COLORS.accent }}>co-signs</em> to complete it.
      </Title>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        The partially signed transaction is sent to your multi-sig provider. They run fraud checks, and if everything
        looks valid, they add their signature. Two signatures: threshold met. The transaction broadcasts to the network.
      </Body>

      <div style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 0 }}>
        {items.map((item, index) => {
          if ('arrow' in item) {
            return (
              <div key={index} style={{ flex: 1, height: 2, background: COLORS.rule, position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    right: -10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: `14px solid ${COLORS.rule}`,
                  }}
                />
              </div>
            )
          }

          return (
            <div
              key={index}
              style={{
                border: `1px solid ${item.highlight ? COLORS.accent : item.ok ? COLORS.ok : COLORS.rule}`,
                borderRadius: 10,
                padding: '24px 36px',
                minWidth: 260,
                textAlign: 'center',
                opacity: item.faint ? 0.5 : 1,
                background: item.ok ? 'rgba(59,110,74,0.08)' : 'transparent',
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 28, color: item.highlight ? COLORS.accent : item.ok ? COLORS.ok : COLORS.inkSoft, letterSpacing: '0.1em', marginBottom: 8 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: COLORS.muted, letterSpacing: '0.08em' }}>{item.sub}</div>
            </div>
          )
        })}
      </div>
    </SlideFrame>
  )
}

function SlidePart4Divider() {
  return (
    <PartDivider
      part="Part 04"
      title="The Security."
      subtitle="What does multi-sig actually protect against?"
    />
  )
}

function SlideLostPhone() {
  return (
    <SlideFrame>
      <Eyebrow>Scenario</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        your phone is stolen. the attacker has <em style={{ fontStyle: 'italic', color: COLORS.accent }}>one key.</em>
      </Title>
      <Callout kicker="The question" style={{ marginTop: 48, maxWidth: 1400 }}>
        In a standard single-key Bitcoin wallet, this is catastrophic &mdash; the attacker controls everything. Does the
        same hold for a multi-sig wallet?
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 40, maxWidth: 1300 }}>
        Your phone held KEY_01. The attacker now has one valid signature. The threshold requires two. Your offline safe
        (KEY_02) and provider server (KEY_03) are untouched. What happens?
      </Body>
    </SlideFrame>
  )
}

function SlideRedundancy() {
  return (
    <SlideFrame variant="ink" footer={false}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow color={COLORS.gold}>The answer</Eyebrow>
        <Title color={COLORS.paper} size="titleLg" style={{ fontSize: 120, lineHeight: 0.97, maxWidth: 1300 }}>
          one key <em style={{ fontStyle: 'italic' }}>isn&apos;t enough</em> to drain the wallet.
        </Title>
        <div style={{ marginTop: 48, borderTop: '1px solid rgba(245,239,227,0.25)', borderBottom: '1px solid rgba(245,239,227,0.25)', padding: '32px 0', maxWidth: 1300 }}>
          <Body size="bodyLg" color="rgba(245,239,227,0.85)">
            The attacker holds one signature. The threshold requires two. Your remaining keys &mdash; in the safe and
            on the provider server &mdash; are unreachable by the thief. Your funds are safe. And you can still access
            them using KEY_02 and KEY_03.
          </Body>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlideFraudProtection() {
  return (
    <SlideFrame>
      <Eyebrow>The analogy</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        multi-sig recreates <em style={{ fontStyle: 'italic', color: COLORS.accent }}>credit card protection</em> for your wallet.
      </Title>
      <Callout kicker="How it works" style={{ marginTop: 44, maxWidth: 1400 }}>
        Every credit card transaction requires the issuer to co-authorize the purchase. Multi-sig does the same for
        Bitcoin: every transaction needs a second party&apos;s signature.
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        Unlike credit cards, this protection is enforced by cryptography &mdash; not corporate policy. The provider
        cannot reverse a transaction after the fact, but they can refuse to co-sign a suspicious one before it
        broadcasts.
      </Body>
    </SlideFrame>
  )
}

function SlideNoSingleAuthority() {
  return (
    <SlideFrame>
      <Eyebrow>The guarantee</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        no single key has <em style={{ fontStyle: 'italic', color: COLORS.accent }}>full authority.</em>
      </Title>
      <div style={{ marginTop: 48, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ border: `1px solid ${COLORS.danger}`, borderRadius: 12, padding: '36px 44px', opacity: 0.8 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.danger, marginBottom: 20 }}>
            Single-key wallet
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.1, color: COLORS.ink, marginBottom: 24 }}>
            One key = total control.
          </div>
          <Body>
            Theft, coercion, or accidental loss of the key means permanent loss of funds. No recovery path.
          </Body>
        </div>

        <div style={{ border: `1px solid ${COLORS.ok}`, borderRadius: 12, padding: '36px 44px', background: 'rgba(59,110,74,0.04)' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.ok, marginBottom: 20 }}>
            Multi-sig wallet
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.1, color: COLORS.ink, marginBottom: 24 }}>
            Threshold = distributed control.
          </div>
          <Body>
            No single party can drain the wallet unilaterally. Theft of one key is survivable. Loss of one key is
            recoverable with the remaining two.
          </Body>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlideRecap() {
  return (
    <SlideFrame>
      <Eyebrow>Takeaways</Eyebrow>
      <Title>
        How to explain <em style={{ fontStyle: 'italic', color: COLORS.accent }}>multi-sig</em> in one minute.
      </Title>
      <Callout kicker="Mental model" style={{ marginTop: 42 }}>
        A multi-signature wallet requires M-of-N private keys to authorize any transaction &mdash; eliminating single
        points of failure without relying on a trusted intermediary.
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1400 }}>
        The same principle protects corporate bank accounts: no single employee should be able to wire funds alone.
        Bitcoin can enforce this natively, in the protocol, with no bank required.
      </Body>
    </SlideFrame>
  )
}

function SlideNextClass() {
  return (
    <SlideFrame variant="ink" footer={false}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONTS.sans, fontSize: 24, letterSpacing: '0.26em', textTransform: 'uppercase', color: COLORS.gold }}>
          Next class
        </div>
        <Title color={COLORS.paper} size="titleLg" style={{ marginTop: 24, fontSize: 118, lineHeight: 0.97 }}>
          Smart Contracts
          <br />
          <em style={{ fontStyle: 'italic' }}>&amp; Ethereum</em>
        </Title>
        <Subtitle color="rgba(245,239,227,0.75)" style={{ marginTop: 36, fontSize: 36, maxWidth: 1200 }}>
          If Bitcoin scripts verify signatures, what happens when the script can do anything a programming language can
          express?
        </Subtitle>
      </div>
    </SlideFrame>
  )
}

export const DAY4_SLIDES: DeckSlideDefinition[] = [
  { label: 'Cover', Component: SlideCover },
  { label: 'Agenda', Component: SlideAgenda },
  { label: 'Part 01', Component: SlidePart1Divider },
  { label: 'Seed phrase', Component: SlideSeedPhrase },
  { label: 'Custodial risk', Component: SlideCustodialRisk },
  { label: 'Part 02', Component: SlidePart2Divider },
  { label: 'Multiple keys', Component: SlideMultipleKeys },
  { label: 'Verify keys', Component: SlideMultisigVerification },
  { label: 'Key storage', Component: SlideKeyDistribution },
  { label: 'Part 03', Component: SlidePart3Divider },
  { label: 'Sign: Step 1', Component: SlideSigningStep1 },
  { label: 'Sign: Step 2', Component: SlideSigningStep2 },
  { label: 'Part 04', Component: SlidePart4Divider },
  { label: 'Lost phone', Component: SlideLostPhone },
  { label: 'Redundancy', Component: SlideRedundancy },
  { label: 'Fraud protection', Component: SlideFraudProtection },
  { label: 'No single key', Component: SlideNoSingleAuthority },
  { label: 'Recap', Component: SlideRecap },
  { label: 'Next Class', Component: SlideNextClass },
]
