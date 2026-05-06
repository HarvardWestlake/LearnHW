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
              How twelve words become money - and why one secret may not be enough.
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
    ['01', 'Create a wallet', 'How randomness becomes 12 recovery words, keys, and addresses.'],
    ['02', 'Live wallet demo', 'Use a real Bitcoin extension and prove the words are the wallet.'],
    ['03', 'Multi-sig wallets', 'How multiple keys share control over one address.'],
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
      title="Twelve Words."
      subtitle="How does a Bitcoin wallet get created?"
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

function SlideWalletCreationFlow() {
  const steps = [
    ['01', 'Random secret', 'The wallet creates a strong random secret on your device. That secret is the starting point.'],
    ['02', '12-word backup', 'The secret is encoded as words so a human can write it down and restore it later.'],
    ['03', 'Seed', 'The words are hashed and stretched into a seed. Same words, same seed, every time.'],
    ['04', 'Key tree', 'The seed deterministically generates many private keys, public keys, and addresses.'],
    ['05', 'Address', 'An address is safe to share for receiving. The words and private keys are never safe to share.'],
  ]

  return (
    <SlideFrame>
      <Eyebrow>Wallet creation</Eyebrow>
      <Title style={{ maxWidth: 1280 }}>
        a wallet is a <em style={{ fontStyle: 'italic', color: COLORS.accent }}>key machine</em> with a human backup.
      </Title>
      <div style={{ marginTop: 38, flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 34, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map(([n, stepTitle, body]) => (
            <div
              key={n}
              style={{
                display: 'grid',
                gridTemplateColumns: '76px 220px 1fr',
                gap: 22,
                alignItems: 'center',
                borderTop: `1px solid ${COLORS.ruleFaint}`,
                paddingTop: 14,
              }}
            >
              <Numeral n={n} style={{ fontSize: 46 }} />
              <div style={{ fontFamily: FONTS.serif, fontSize: 34, lineHeight: 1.05, color: COLORS.ink }}>{stepTitle}</div>
              <Body style={{ fontSize: 25, lineHeight: 1.25 }}>{body}</Body>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.ink, borderRadius: 12, padding: '34px 36px', color: COLORS.paper, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 22 }}>
              Key idea
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 50, lineHeight: 1.05 }}>
              Same words,
              <br />
              same wallet.
            </div>
          </div>
          <Body color="rgba(245,239,227,0.78)" style={{ fontSize: 30, marginTop: 32 }}>
            Determinism is the magic trick and the danger. The phrase can rebuild your wallet on a new computer, or on
            someone else&apos;s.
          </Body>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlidePhantomDemo() {
  const steps = [
    ['01', 'Install', 'Go to phantom.com/download and add the Chrome extension.'],
    ['02', 'Create', 'Choose Create New Wallet with a Secret Recovery Phrase.'],
    ['03', 'Enable Bitcoin', 'Open Active Networks and make sure Bitcoin is turned on.'],
  ]

  return (
    <SlideFrame>
      <Eyebrow>Live demo</Eyebrow>
      <Title style={{ maxWidth: 1260 }}>
        create a real Bitcoin wallet with <em style={{ fontStyle: 'italic', color: COLORS.accent }}>Phantom.</em>
      </Title>
      <div style={{ marginTop: 46, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {steps.map(([n, stepTitle, body]) => (
          <div key={n} style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 10, padding: '32px 34px', background: COLORS.paper }}>
            <Numeral n={n} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.05, marginTop: 20, color: COLORS.ink }}>
              {stepTitle}
            </div>
            <Body style={{ marginTop: 20 }}>{body}</Body>
          </div>
        ))}
      </div>
      <Callout kicker="Class rule" tone="danger" style={{ marginTop: 44 }}>
        Use today&apos;s fresh class wallet only. Never type a personal recovery phrase into a classroom computer,
        projected screen, website, chat, or form.
      </Callout>
    </SlideFrame>
  )
}

function SlideFundWalletDemo() {
  const steps = [
    ['01', 'Find your address', 'Open Receive and copy your Bitcoin address. This is safe to share.'],
    ['02', 'Send BTC', 'Use a small transfer to watch money arrive at a Bitcoin address.'],
    ['03', 'Find your seed phrase', 'Open the backup or security area and locate the recovery words.'],
  ]

  return (
    <SlideFrame variant="ink" footer={false}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 70, alignItems: 'center' }}>
        <div>
          <Eyebrow color={COLORS.gold}>Student Checklist</Eyebrow>
          <Title color={COLORS.paper} size="titleLg" style={{ fontSize: 108, lineHeight: 0.96 }}>
            Exploring your bitcoin wallet
          </Title>
          <Subtitle color="rgba(245,239,227,0.75)" style={{ fontSize: 36, marginTop: 34 }}>
            Follow along in the browser extension. We will use a tiny real transfer so the wallet feels real.
          </Subtitle>
        </div>

        <div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 18 }}>
            In Phantom
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {steps.map(([n, stepTitle, body]) => (
              <div key={n} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 24, alignItems: 'start', border: '1px solid rgba(245,239,227,0.24)', borderRadius: 12, padding: '24px 28px' }}>
                <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 46, lineHeight: 1, color: COLORS.gold }}>{n}</div>
                <div>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 42, lineHeight: 1.05, color: COLORS.paper }}>{stepTitle}</div>
                  <Body color="rgba(245,239,227,0.72)" style={{ fontSize: 27, lineHeight: 1.25, marginTop: 10 }}>{body}</Body>
                </div>
              </div>
            ))}
          </div>
          <Body color="rgba(245,239,227,0.78)" style={{ marginTop: 30 }}>
            Your address is for receiving. Your seed phrase is for recovery. Notice how differently the wallet treats
            those two pieces of information.
          </Body>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlideCustodialRisk() {
  return (
    <SlideFrame>
      <Eyebrow>Exposure vs ownership</Eyebrow>
      <Title style={{ maxWidth: 1200 }}>
        buying bitcoin exposure is not the same as <em style={{ fontStyle: 'italic', color: COLORS.accent }}>holding bitcoin.</em>
      </Title>
      <div style={{ marginTop: 44, flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        <div style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 12, padding: '36px 44px' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 20 }}>
            Wallet
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.05, marginBottom: 24 }}>You hold the keys.</div>
          <Body>
            You can send bitcoin on-chain. You are responsible for the seed phrase. If the words leak, the wallet can
            be restored elsewhere.
          </Body>
        </div>

        <div style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 12, padding: '36px 44px', background: COLORS.creamDark }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 20 }}>
            Exchange
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.05, marginBottom: 24 }}>Coinbase holds the keys.</div>
          <Body>
            You have an account balance and an IOU-like claim. It is convenient, but you rely on the company&apos;s custody,
            security, rules, and withdrawal access.
          </Body>
        </div>

        <div style={{ border: `1px solid ${COLORS.gold}`, borderRadius: 12, padding: '36px 44px', background: COLORS.paper }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 20 }}>
            Bitcoin ETF / ETP
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.05, marginBottom: 24 }}>You own shares.</div>
          <Body>
            You get price exposure through a brokerage account. You cannot use those shares to sign a Bitcoin
            transaction or recover coins with a seed phrase.
          </Body>
        </div>
      </div>
    </SlideFrame>
  )
}

function SlideMultisigSetup() {
  const signers = [
    { n: '01', name: 'Alice', key: 'phone wallet', note: 'daily signer' },
    { n: '02', name: 'Bob', key: 'offline backup', note: 'recovery signer' },
    { n: '03', name: 'Carol', key: 'trusted co-signer', note: 'separate failure point' },
  ]

  return (
    <SlideFrame>
      <Eyebrow>Multisig setup</Eyebrow>
      <Title style={{ maxWidth: 1260 }}>
        a <em style={{ fontStyle: 'italic', color: COLORS.accent }}>2-of-3</em> wallet spreads control across three keys.
      </Title>
      <div style={{ marginTop: 46, display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 36, alignItems: 'stretch' }}>
        <div style={{ background: COLORS.ink, color: COLORS.paper, borderRadius: 12, padding: '42px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 86, lineHeight: 1 }}>
              2 <span style={{ color: COLORS.gold }}>of</span> 3
            </div>
            <Body color="rgba(245,239,227,0.78)" style={{ marginTop: 28, fontSize: 34 }}>
              Any two registered keys can spend. One key alone cannot move the bitcoin.
            </Body>
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 20, color: COLORS.gold, marginTop: 44, lineHeight: 1.5 }}>
            OP_2 Alice Bob Carol OP_3
            <br />
            OP_CHECKMULTISIG
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {signers.map(({ n, name, key, note }, index) => (
            <div
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 180px 1fr 220px',
                gap: 22,
                alignItems: 'center',
                padding: '24px 0',
                borderTop: `1px solid ${COLORS.ruleFaint}`,
                borderBottom: index === signers.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
              }}
            >
              <Numeral n={n} style={{ fontSize: 46 }} />
              <div style={{ fontFamily: FONTS.serif, fontSize: 40, lineHeight: 1.05, color: COLORS.ink }}>{name}</div>
              <Body size="bodyLg">{key}</Body>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{note}</div>
            </div>
          ))}
        </div>
      </div>
      <Body style={{ marginTop: 28, color: COLORS.muted, fontStyle: 'italic' }}>
        The public keys are combined into the spending rule. The private keys and seed phrases stay separate.
      </Body>
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

function SlideMofNExplained() {
  const setups = [
    ['2-of-2', 'Both keys must sign. Strong agreement, but one lost key can lock the wallet.'],
    ['2-of-3', 'Any two keys can sign. A common balance: one backup can be lost without losing funds.'],
    ['3-of-5', 'Useful for teams. More resilient, but more coordination before spending.'],
  ]

  return (
    <SlideFrame>
      <Eyebrow>M-of-N</Eyebrow>
      <Title style={{ maxWidth: 1280 }}>
        multisig turns ownership into a <em style={{ fontStyle: 'italic', color: COLORS.accent }}>threshold rule.</em>
      </Title>
      <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'stretch' }}>
        <div style={{ background: COLORS.ink, borderRadius: 12, padding: '40px 46px', color: COLORS.paper }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 84, lineHeight: 1 }}>
            M <span style={{ color: COLORS.gold }}>of</span> N
          </div>
          <Body color="rgba(245,239,227,0.78)" style={{ marginTop: 28, fontSize: 34 }}>
            N is the total set of allowed signers. M is the minimum number of those signers required to authorize a
            transaction.
          </Body>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {setups.map(([name, body], index) => (
            <div
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: '170px 1fr',
                gap: 28,
                alignItems: 'center',
                padding: '26px 0',
                borderTop: `1px solid ${COLORS.ruleFaint}`,
                borderBottom: index === setups.length - 1 ? `1px solid ${COLORS.ruleFaint}` : 'none',
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 32, color: COLORS.accent, fontWeight: 600 }}>{name}</div>
              <Body>{body}</Body>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
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
              <div style={arrowStyle}>↓ derive root seed</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>
                Private key <span style={{ color: COLORS.danger, fontSize: 11 }}>- never shared</span>
              </div>
              <div style={rowStyle(false)}>{priv}</div>
              <div style={arrowStyle}>↓ derive public key</div>
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
  const checkRows = [
    {
      n: '01',
      label: 'Public key is registered',
      status: !anySelected ? 'waiting' : hasEve ? 'fail' : 'pass',
      detail: !anySelected
        ? 'Waiting for selected signatures.'
        : hasEve
          ? "Eve's public key is not in this wallet script."
          : 'Every selected signature comes from a registered public key.',
    },
    {
      n: '02',
      label: 'Signature matches that key',
      status: !anySelected ? 'waiting' : validCount > 0 ? 'pass' : 'fail',
      detail: !anySelected
        ? 'The network checks signature math against public keys.'
        : validCount > 0
          ? `${validCount} signature${validCount !== 1 ? 's' : ''} match registered public keys.`
          : 'No selected signature matches a registered public key.',
    },
    {
      n: '03',
      label: `At least ${threshold} valid signature${threshold !== 1 ? 's' : ''}`,
      status: !anySelected ? 'waiting' : approved ? 'pass' : 'fail',
      detail: !anySelected
        ? 'The threshold has not been tested yet.'
        : approved
          ? `${validCount}/${threshold} valid signatures. The transaction can broadcast.`
          : `${validCount}/${threshold} valid signatures. The transaction cannot move yet.`,
    },
  ] as const

  return (
    <SlideFrame>
      <Eyebrow style={{ marginBottom: 10 }}>Multi-signature verification</Eyebrow>
      <Title style={{ marginBottom: 14 }}>
        the network checks <em>public keys, signatures,</em> and the threshold.
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
        <div style={{ fontFamily: FONTS.sans, fontSize: 20, color: 'rgba(245,239,227,0.72)', flex: 1, lineHeight: 1.3 }}>
          Wallet script contains Alice, Bob, and Carol&apos;s public keys. {desc[0]}
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
            Network verification checklist
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flexShrink: 0 }}>
            {checkRows.map((check) => {
              const color = check.status === 'pass' ? COLORS.ok : check.status === 'fail' ? COLORS.danger : COLORS.muted
              const bg = check.status === 'pass' ? 'rgba(59,110,74,0.10)' : check.status === 'fail' ? 'rgba(155,42,27,0.10)' : 'rgba(15,31,58,0.04)'
              return (
                <div key={check.n} style={{ border: `2px solid ${color}`, borderRadius: 9, padding: '12px 12px', background: bg, minHeight: 118 }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 13, color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 7 }}>
                    Check {check.n}
                  </div>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 22, lineHeight: 1.05, color: COLORS.ink, fontWeight: 600 }}>
                    {check.label}
                  </div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 15, color: COLORS.muted, lineHeight: 1.25, marginTop: 7 }}>
                    {check.detail}
                  </div>
                </div>
              )
            })}
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
    { n: '03', location: 'Trusted co-signer or service', role: 'A second human, device, or provider that can approve only when needed.' },
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
        If one person controls every key in one place, the wallet is multi-sig in name only.
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
    { label: 'CO-SIGNER', sub: 'sign with KEY_02', highlight: true },
    { arrow: true },
    { label: 'BROADCAST', sub: 'threshold met', ok: true },
  ]

  return (
    <SlideFrame>
      <Eyebrow color={COLORS.gold}>Step 02 - Co-signer</Eyebrow>
      <Title style={{ maxWidth: 1200 }}>
        another signer <em style={{ fontStyle: 'italic', color: COLORS.accent }}>co-signs</em> to complete it.
      </Title>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        The partially signed transaction is sent to another co-signer by file, QR code, or a coordinating service. If
        they agree, they add their signature. Two valid signatures: threshold met. The transaction can broadcast.
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

function SlideMultisigTransaction() {
  const steps = [
    ['01', 'Propose', 'The wallet creates a transaction: where the bitcoin should go and how much to send.'],
    ['02', 'Sign once', 'One signer reviews the details and adds a signature. The transaction is still incomplete.'],
    ['03', 'Co-sign', 'A second registered signer adds another signature. The 2-of-3 threshold is now met.'],
    ['04', 'Broadcast', 'The completed transaction can be sent to the Bitcoin network.'],
  ]

  return (
    <SlideFrame>
      <Eyebrow>Spending from multisig</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        a multisig transaction <em style={{ fontStyle: 'italic', color: COLORS.accent }}>collects signatures</em> before it can move.
      </Title>
      <div style={{ marginTop: 52, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
        {steps.map(([n, stepTitle, body], index) => (
          <div key={n} style={{ border: `1px solid ${index === 2 ? COLORS.accent : COLORS.ruleFaint}`, borderRadius: 10, padding: '28px 26px', background: index === 2 ? 'rgba(168,52,30,0.06)' : COLORS.paper }}>
            <Numeral n={n} style={{ fontSize: 46 }} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 38, lineHeight: 1.05, marginTop: 18, color: COLORS.ink }}>
              {stepTitle}
            </div>
            <Body style={{ marginTop: 18, fontSize: 28, lineHeight: 1.3 }}>{body}</Body>
          </div>
        ))}
      </div>
      <Callout kicker="Key idea" style={{ marginTop: 42 }}>
        A partially signed transaction is harmless until enough valid signatures from registered keys are attached.
      </Callout>
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
        (KEY_02) and co-signer key (KEY_03) are untouched. What happens?
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
            with another co-signer &mdash; are unreachable by the thief. Your funds are safe. And you can still access
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
      <Eyebrow>The trade-off</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        multi-sig reduces single-key risk. it does <em style={{ fontStyle: 'italic', color: COLORS.accent }}>not</em> remove all risk.
      </Title>
      <Callout kicker="What gets better" style={{ marginTop: 44, maxWidth: 1400 }}>
        One stolen key may not be enough to steal funds. One lost key may not permanently lock everyone out, depending
        on the threshold.
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        What still matters: backups, independent storage, honest signers, and a threshold that matches the group. Bad
        setup can still lock users out or give one person practical control.
      </Body>
    </SlideFrame>
  )
}

function SlideMultisigThreatModel() {
  return (
    <SlideFrame>
      <Eyebrow>Threat model</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        multisig helps when failures are <em style={{ fontStyle: 'italic', color: COLORS.accent }}>independent.</em>
      </Title>
      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, flex: 1 }}>
        <div style={{ border: `1px solid ${COLORS.ok}`, borderRadius: 12, padding: '38px 44px', background: 'rgba(59,110,74,0.05)' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.ok, marginBottom: 22 }}>
            Helps with
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 42, lineHeight: 1.08, color: COLORS.ink, marginBottom: 26 }}>
            One stolen or lost key.
          </div>
          <Body>
            If your phone key is compromised, the attacker still needs another registered key. If one backup disappears,
            the remaining two keys can still recover a 2-of-3 wallet.
          </Body>
        </div>

        <div style={{ border: `1px solid ${COLORS.danger}`, borderRadius: 12, padding: '38px 44px', background: COLORS.paper }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.danger, marginBottom: 22 }}>
            Does not fix
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 42, lineHeight: 1.08, color: COLORS.ink, marginBottom: 26 }}>
            Bad setup.
          </div>
          <Body>
            If all keys live in one backpack, one person controls every key, or co-signers collude, the threshold rule
            stops being meaningful.
          </Body>
        </div>
      </div>
      <Body style={{ marginTop: 26, color: COLORS.muted, fontStyle: 'italic' }}>
        Multisig is not magic. It is a way to avoid one fragile point of failure.
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

function SlideBitcoinVsSmartContract() {
  return (
    <SlideFrame>
      <Eyebrow>Implementation detail</Eyebrow>
      <Title style={{ maxWidth: 1300 }}>
        same idea, <em style={{ fontStyle: 'italic', color: COLORS.accent }}>different machinery.</em>
      </Title>
      <div style={{ marginTop: 54, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 12, padding: '38px 44px', background: COLORS.paper }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 22 }}>
            Bitcoin
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.05, color: COLORS.ink, marginBottom: 24 }}>
            Enforced by scripts.
          </div>
          <Body>
            The spending rule names public keys and requires enough valid signatures before the coins can move.
            Partially signed transactions can be passed between co-signers.
          </Body>
        </div>

        <div style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 12, padding: '38px 44px', background: COLORS.creamDark }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.inkSoft, marginBottom: 22 }}>
            Ethereum-style systems
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.05, color: COLORS.ink, marginBottom: 24 }}>
            Often enforced by smart contracts.
          </div>
          <Body>
            A smart account, such as a Safe, can store owners, thresholds, and policy logic in contract code. Similar
            threshold idea, different execution environment.
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
        A recovery phrase can recreate a wallet. A multi-signature wallet requires M-of-N registered keys to authorize
        a spend.
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1400 }}>
        The security comes from independence: separate keys, separate backups, and signers who do not all fail in the
        same way at the same time.
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

function SlideJoinBitcoinSoftware() {
  const paths = [
    {
      n: '01',
      title: 'Node',
      kicker: 'verifier + relay',
      body: 'Bitcoin Core connects to peers, downloads blocks, verifies the rules, and relays valid data. That is the node job.',
      code: 'Is this Bitcoin history valid?',
    },
    {
      n: '02',
      title: 'Wallet',
      kicker: 'keychain + signer',
      body: 'A wallet creates addresses, tracks coins controlled by your keys, and signs transactions. Bitcoin Core can have a wallet, but a node is not automatically a wallet.',
      code: 'Can I spend these coins?',
    },
    {
      n: '03',
      title: 'Apps + mining',
      kicker: 'software on top',
      body: 'Apps can query a node with JSON-RPC or explorer APIs. Mining software asks a node or pool for block templates, then sends work to ASIC hardware.',
      code: 'RPC / REST / getblocktemplate',
    },
  ]

  return (
    <SlideFrame>
      <Eyebrow>Practical bridge</Eyebrow>
      <Title style={{ maxWidth: 1260 }}>
        installing Bitcoin Core is not the same as <em style={{ fontStyle: 'italic', color: COLORS.accent }}>having a wallet.</em>
      </Title>

      <div style={{ marginTop: 46, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {paths.map(({ n, title, kicker, body, code }) => (
          <div key={n} style={{ border: `1px solid ${COLORS.ruleFaint}`, borderRadius: 10, padding: '30px 30px', background: COLORS.paper, display: 'flex', flexDirection: 'column', minHeight: 430 }}>
            <Numeral n={n} style={{ fontSize: 46 }} />
            <div style={{ fontFamily: FONTS.sans, fontSize: 18, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginTop: 20 }}>
              {kicker}
            </div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 44, lineHeight: 1.05, marginTop: 12, color: COLORS.ink }}>
              {title}
            </div>
            <Body style={{ marginTop: 20, fontSize: 28, lineHeight: 1.28 }}>{body}</Body>
            <div style={{ marginTop: 'auto', borderTop: `1px solid ${COLORS.ruleFaint}`, paddingTop: 20, fontFamily: FONTS.mono, fontSize: 20, lineHeight: 1.35, color: COLORS.inkSoft }}>
              {code}
            </div>
          </div>
        ))}
      </div>

      <Callout kicker="Reality check" style={{ marginTop: 38 }}>
        A node is your rule-checking copy of the network. A wallet is your keychain. Bitcoin Core can be both, but those
        are two different jobs.
      </Callout>
    </SlideFrame>
  )
}

function SlideBitcoinWebsites() {
  const sites = [
    ['github.com/bitcoin/bitcoin', 'Bitcoin Core source code: the rules are software students can inspect.'],
    ['mempool.space', 'Live blocks, mempool backlog, fee estimates, and recent transactions.'],
    ['blockstream.info', 'Clean block explorer for a specific transaction, address, or block.'],
    ['dashboard.clarkmoody.com', 'Big-picture dashboard: supply, halving, hash rate, fees, nodes, and Lightning.'],
    ['bitnodes.io/nodes/network-map', 'Map of reachable Bitcoin nodes and where network peers are visible.'],
    ['txstreet.com/v/btc', 'Animated view of transactions waiting for block space.'],
  ]

  const checklist = [
    'Open the latest block: height, timestamp, miner or pool, subsidy, and fees.',
    'Click one transaction: inputs, outputs, fee rate, and confirmations.',
    'Compare mempool congestion with the recommended sat/vB fee.',
    'Find supply issued, next halving estimate, hash rate, and difficulty.',
    'GitHub: Litecoin src/chainparams.cpp:87 changed the block target spacing.',
    'Show the node map: decentralization is computers running software, not one company.',
  ]

  return (
    <SlideFrame>
      <Eyebrow>Live data tour</Eyebrow>
      <Title style={{ maxWidth: 1280, fontSize: 66, lineHeight: 1 }}>
        interesting websites for <em style={{ fontStyle: 'italic', color: COLORS.accent }}>seeing Bitcoin happen.</em>
      </Title>

      <div style={{ marginTop: 28, flex: 1, display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 26, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          {sites.map(([site, body], index) => (
            <div
              key={site}
              style={{
                display: 'grid',
                gridTemplateColumns: '58px 340px 1fr',
                gap: 18,
                alignItems: 'center',
                border: `1px solid ${index === 0 ? COLORS.accent : COLORS.ruleFaint}`,
                borderRadius: 10,
                padding: '10px 18px',
                background: index === 0 ? 'rgba(168,52,30,0.06)' : COLORS.paper,
              }}
            >
              <Numeral n={String(index + 1).padStart(2, '0')} style={{ fontSize: 36 }} />
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: index === 0 ? COLORS.accent : COLORS.ink, lineHeight: 1.15 }}>
                {site}
              </div>
              <Body style={{ fontSize: 22, lineHeight: 1.18 }}>{body}</Body>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.ink, color: COLORS.paper, borderRadius: 12, padding: '24px 30px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 17, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 16 }}>
            What to show them
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {checklist.map((item, index) => (
              <div key={item} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14, alignItems: 'start' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: `2px solid ${COLORS.gold}`,
                    color: COLORS.gold,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.mono,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <Body color="rgba(245,239,227,0.82)" style={{ fontSize: 22, lineHeight: 1.15 }}>
                  {item}
                </Body>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

void [
  SlidePart1Divider,
  SlidePart2Divider,
  SlideMofNExplained,
  SlideMultipleKeys,
  SlideKeyDistribution,
  SlidePart3Divider,
  SlideSigningStep1,
  SlideSigningStep2,
  SlidePart4Divider,
  SlideLostPhone,
  SlideRedundancy,
  SlideFraudProtection,
  SlideNoSingleAuthority,
]

export const DAY4_SLIDES: DeckSlideDefinition[] = [
  { label: 'Cover', Component: SlideCover },
  { label: 'Agenda', Component: SlideAgenda },
  { label: 'Node vs wallet', Component: SlideJoinBitcoinSoftware },
  { label: 'Seed phrase', Component: SlideSeedPhrase },
  { label: 'Wallet flow', Component: SlideWalletCreationFlow },
  { label: 'Phantom demo', Component: SlidePhantomDemo },
  { label: 'Fund wallet', Component: SlideFundWalletDemo },
  { label: 'Wallet vs ETF', Component: SlideCustodialRisk },
  { label: 'Multisig setup', Component: SlideMultisigSetup },
  { label: 'Verify keys', Component: SlideMultisigVerification },
  { label: 'Transaction', Component: SlideMultisigTransaction },
  { label: 'Threat model', Component: SlideMultisigThreatModel },
  { label: 'Bitcoin vs contracts', Component: SlideBitcoinVsSmartContract },
  { label: 'Recap', Component: SlideRecap },
  { label: 'Next Class', Component: SlideNextClass },
  { label: 'Bitcoin websites', Component: SlideBitcoinWebsites },
]
