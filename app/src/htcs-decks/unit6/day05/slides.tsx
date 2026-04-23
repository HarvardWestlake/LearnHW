import type { DeckSlideDefinition } from '../../runtime/types'
import { Callout } from '../../shared/patterns'
import { Body, Eyebrow, Numeral, Rule, SlideFrame, Subtitle, Title } from '../../shared/primitives'
import { COLORS, FONTS } from '../../shared/tokens'

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
              <line x1="380" y1="290" x2="120" y2="140" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line x1="380" y1="290" x2="640" y2="140" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line x1="380" y1="290" x2="120" y2="440" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line x1="380" y1="290" x2="640" y2="440" stroke="rgba(184,137,59,0.4)" strokeWidth="2.5" />
              <line x1="120" y1="140" x2="640" y2="140" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="120" y1="440" x2="640" y2="440" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="120" y1="140" x2="120" y2="440" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="640" y1="140" x2="640" y2="440" stroke="rgba(184,137,59,0.22)" strokeWidth="1.5" />
              <line x1="380" y1="50" x2="380" y2="290" stroke="rgba(184,137,59,0.28)" strokeWidth="1.5" />
              <line x1="380" y1="290" x2="380" y2="530" stroke="rgba(184,137,59,0.28)" strokeWidth="1.5" />
              <circle cx="380" cy="290" r="20" fill={COLORS.gold} opacity="0.9" />
              <circle cx="120" cy="140" r="13" fill="rgba(184,137,59,0.65)" />
              <circle cx="640" cy="140" r="13" fill="rgba(184,137,59,0.65)" />
              <circle cx="120" cy="440" r="13" fill="rgba(184,137,59,0.65)" />
              <circle cx="640" cy="440" r="13" fill="rgba(184,137,59,0.65)" />
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
  return (
    <SlideFrame>
      <Eyebrow>Bitcoin vs Visa</Eyebrow>
      <Title>
        a tale of <em style={{ fontStyle: 'italic', color: COLORS.accent }}>two speeds</em>
      </Title>
      <div style={{ marginTop: 52, flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div
          style={{
            border: `1px solid ${COLORS.rule}`,
            borderRadius: 8,
            padding: '48px 52px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.28em', textTransform: 'uppercase', color: COLORS.muted }}>Visa</div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 80, fontWeight: 400, lineHeight: 1, color: COLORS.ink }}>4,000</div>
          <Body size="bodyLg">transactions / second (avg)</Body>
          <Rule />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.ok }}>65,000 TPS</span>
            <Body size="body" style={{ color: COLORS.muted }}>peak capacity</Body>
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${COLORS.rule}`,
            borderRadius: 8,
            padding: '48px 52px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            background: COLORS.creamDark,
          }}
        >
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.28em', textTransform: 'uppercase', color: COLORS.muted }}>Bitcoin</div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 80, fontWeight: 400, lineHeight: 1, color: COLORS.accent }}>7</div>
          <Body size="bodyLg">transactions / second</Body>
          <Rule />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.accent }}>1 MB</span>
            <Body size="body" style={{ color: COLORS.muted }}>block size limit</Body>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideScalability() {
  return (
    <SlideFrame>
      <Eyebrow>The bottleneck</Eyebrow>
      <Title>
        every transaction waits for a <em style={{ fontStyle: 'italic', color: COLORS.accent }}>new block</em>
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        Bitcoin adds a block roughly every 10 minutes. With a 1 MB block size, the network handles about 7 transactions per second — a hard ceiling. Raising the limit seems obvious, but larger blocks mean fewer people can run full nodes, threatening decentralization.
      </Body>
      <Callout kicker="The trilemma" style={{ marginTop: 52, maxWidth: 1300 }}>
        Bitcoin deliberately chose decentralization and security over speed. To gain speed, we need a layer that doesn’t ask the blockchain to record every payment.
      </Callout>
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
  return (
    <SlideFrame>
      <Eyebrow>The solution</Eyebrow>
      <Title>
        Lightning moves payments <em style={{ fontStyle: 'italic', color: COLORS.accent }}>off-chain</em>
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        The Lightning Network is a second layer built on top of Bitcoin. Instead of writing every payment to the blockchain, two parties open a <em>payment channel</em> — a private, cryptographically secured ledger they update between themselves.
      </Body>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        The blockchain only records two events: the channel opening and the final closing balance. Everything in between is off-chain — instant and nearly free.
      </Body>
    </SlideFrame>
  )
}

export function SlideOpeningAChannel() {
  return (
    <SlideFrame>
      <Eyebrow>Step 1</Eyebrow>
      <Title>
        Bob opens a channel with the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>Coffeeshop</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="1100" height="260" viewBox="0 0 1100 260">
          <rect x="60" y="70" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="180" y="140" textAnchor="middle" fontFamily={FONTS.serif} fontSize="46" fill={COLORS.ink}>Bob</text>
          <line x1="300" y1="130" x2="760" y2="130" stroke={COLORS.accent} strokeWidth="6" strokeLinecap="round" />
          <polygon points="760,117 782,130 760,143" fill={COLORS.accent} />
          <polygon points="300,117 278,130 300,143" fill={COLORS.accent} />
          <text x="530" y="103" textAnchor="middle" fontFamily={FONTS.sans} fontSize="26" letterSpacing="0.12em" fill={COLORS.muted}>
            PAYMENT CHANNEL
          </text>
          <rect x="760" y="70" width="280" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="900" y="140" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Coffeeshop</text>
        </svg>
      </div>
      <Body size="bodyLg" style={{ maxWidth: 1300 }}>
        A payment channel is a direct, private connection between two parties. Before any trading begins, both agree to open it — establishing the cryptographic link that secures their transactions.
      </Body>
    </SlideFrame>
  )
}

export function SlideMultiSigFunding() {
  return (
    <SlideFrame>
      <Eyebrow>Funding the channel</Eyebrow>
      <Title>
        funds are locked in a <em style={{ fontStyle: 'italic', color: COLORS.accent }}>multi-sig address</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="960" height="340" viewBox="0 0 960 340">
          <rect x="330" y="16" width="300" height="110" rx="8" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="2.5" />
          <text x="480" y="62" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" letterSpacing="0.14em" fill={COLORS.gold}>
            2-OF-2 MULTI-SIG
          </text>
          <text x="480" y="100" textAnchor="middle" fontFamily={FONTS.serif} fontStyle="italic" fontSize="28" fill="rgba(245,239,227,0.7)">
            cryptographic escrow
          </text>
          <rect x="40" y="200" width="220" height="110" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="150" y="253" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Bob</text>
          <text x="150" y="292" textAnchor="middle" fontFamily={FONTS.mono} fontSize="28" fill={COLORS.accent}>0.05 BTC</text>
          <rect x="700" y="200" width="220" height="110" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="810" y="248" textAnchor="middle" fontFamily={FONTS.serif} fontSize="38" fill={COLORS.ink}>Coffeeshop</text>
          <text x="810" y="290" textAnchor="middle" fontFamily={FONTS.mono} fontSize="28" fill={COLORS.muted}>0 BTC</text>
          <line x1="200" y1="200" x2="395" y2="126" stroke={COLORS.accent} strokeWidth="2.5" />
          <polygon points="395,126 380,116 388,132" fill={COLORS.accent} />
          <line x1="760" y1="200" x2="565" y2="126" stroke={COLORS.rule} strokeWidth="2.5" />
          <polygon points="565,126 550,118 568,130" fill={COLORS.rule} />
        </svg>
      </div>
      <Body size="body" style={{ color: COLORS.inkSoft, maxWidth: 1300 }}>
        Neither party can withdraw without the other’s signature — the funds are in cryptographic escrow until the channel closes.
      </Body>
    </SlideFrame>
  )
}

export function SlideInitialBalanceSheet() {
  return (
    <SlideFrame>
      <Eyebrow>The ledger</Eyebrow>
      <Title>
        both parties sign an <em style={{ fontStyle: 'italic', color: COLORS.accent }}>initial balance sheet</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', gap: 80, alignItems: 'flex-start', marginTop: 52 }}>
        <div style={{ flex: 1 }}>
          <Body size="bodyLg" style={{ marginBottom: 36 }}>
            Before any transactions, both parties agree on the starting state. They each sign a balance sheet and keep a copy.
          </Body>
          <Body size="bodyLg">
            This signed document is legally binding in the blockchain sense: either party can submit it at any time to close the channel and claim the stated funds.
          </Body>
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
          <div style={{ marginTop: 36, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 24, color: 'rgba(245,239,227,0.5)' }}>
            signed by both parties
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideOnChainOpen() {
  return (
    <SlideFrame>
      <Eyebrow>On the blockchain</Eyebrow>
      <Title>
        opening the channel is <em style={{ fontStyle: 'italic', color: COLORS.accent }}>one transaction</em>
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        The funding transaction is broadcast to the Bitcoin network and confirmed in a block — this is the <em>only</em> on-chain event needed to open the channel. After confirmation, Bob and the Coffeeshop can trade back and forth as many times as they like.
      </Body>
      <Callout kicker="The key insight" style={{ marginTop: 52, maxWidth: 1300 }}>
        None of those intermediate payments ever touch the blockchain. The miner fee is paid once, not per coffee.
      </Callout>
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
  return (
    <SlideFrame>
      <Eyebrow>First transaction</Eyebrow>
      <Title>
        Bob buys a coffee <em style={{ fontStyle: 'italic', color: COLORS.accent }}>off-chain</em>
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        Bob wants to pay 0.005 BTC for a coffee. He and the Coffeeshop agree on an updated balance: Bob’s drops from 0.05 to 0.045 BTC; the Coffeeshop’s rises from 0 to 0.005 BTC.
      </Body>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300, color: COLORS.accent }}>
        No blockchain transaction. No miner fee. No waiting for block confirmation. The payment is instant.
      </Body>
      <Body size="bodyLg" style={{ marginTop: 36, maxWidth: 1300 }}>
        They can repeat this process for every coffee Bob buys — updating the private balance sheet each time without touching the chain.
      </Body>
    </SlideFrame>
  )
}

export function SlideUpdatedSheet() {
  return (
    <SlideFrame>
      <Eyebrow>New balance</Eyebrow>
      <Title>
        both parties sign the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>updated sheet</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', gap: 80, alignItems: 'flex-start', marginTop: 52 }}>
        <div style={{ flex: 1 }}>
          <Body size="bodyLg" style={{ marginBottom: 36 }}>
            The old balance sheet is superseded. Both parties agree on new figures and both sign the replacement.
          </Body>
          <Body size="bodyLg">
            Each party now holds the other’s signature on the new balance — a mutual, cryptographic commitment to the updated state.
          </Body>
        </div>
        <div style={{ width: 540, background: COLORS.ink, borderRadius: 8, padding: '40px 48px' }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 32 }}>
            Balance Sheet — Updated
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
            <div style={{ fontFamily: FONTS.mono, fontSize: 34, color: COLORS.muted, textDecoration: 'line-through', lineHeight: 1 }}>0.05 BTC</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 52, color: COLORS.paper, lineHeight: 1.1, marginTop: 6 }}>0.045 BTC</div>
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
            <div style={{ fontFamily: FONTS.mono, fontSize: 34, color: COLORS.muted, textDecoration: 'line-through', lineHeight: 1 }}>0.00 BTC</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 52, color: COLORS.paper, lineHeight: 1.1, marginTop: 6 }}>0.005 BTC</div>
          </div>
          <div style={{ marginTop: 36, fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 24, color: 'rgba(245,239,227,0.5)' }}>
            signed by both parties
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideExchangingSheets() {
  return (
    <SlideFrame>
      <Eyebrow>Mutual custody</Eyebrow>
      <Title>
        each party holds the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>other’s</em> signed copy
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        After every update, Bob and the Coffeeshop exchange signed copies of the new balance sheet. Bob holds the Coffeeshop’s signature; the Coffeeshop holds Bob’s.
      </Body>
      <Callout kicker="Why this matters" style={{ marginTop: 52, maxWidth: 1300 }}>
        If either party tries to close the channel with an older, more favorable balance sheet, the other can submit their signed copy of the newer state to override it. The blockchain always enforces the latest agreement.
      </Callout>
    </SlideFrame>
  )
}

export function SlideClosingChannel() {
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
        </div>
        <div style={{ background: COLORS.creamDark, borderRadius: 8, padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontFamily: FONTS.sans, fontSize: 22, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted }}>Final settlement</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${COLORS.ruleFaint}` }}>
            <span style={{ fontFamily: FONTS.serif, fontSize: 36, color: COLORS.ink }}>Bob receives</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.ink }}>0.045 BTC</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${COLORS.ruleFaint}` }}>
            <span style={{ fontFamily: FONTS.serif, fontSize: 36, color: COLORS.ink }}>Coffeeshop receives</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 36, color: COLORS.ink }}>0.005 BTC</span>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 28, color: COLORS.muted, marginTop: 8 }}>
            Total on-chain transactions: 2
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

export function SlideReducedLoad() {
  return (
    <SlideFrame>
      <Eyebrow>The benefit</Eyebrow>
      <Title>
        fewer transactions on the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>blockchain</em>
      </Title>
      <Callout kicker="100 coffees. 2 blockchain transactions." style={{ marginTop: 52, maxWidth: 1400 }}>
        No matter how many times Bob updates the balance sheet with the Coffeeshop, the blockchain sees exactly two transactions: open and close.
      </Callout>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        This is the throughput breakthrough. The bottleneck never applies because the chain is never involved. Fees are paid once. Confirmation latency is paid once. The channel can run indefinitely.
      </Body>
    </SlideFrame>
  )
}

export function SlideLatestSheetValid() {
  return (
    <SlideFrame>
      <Eyebrow>Cheating is expensive</Eyebrow>
      <Title>
        only the <em style={{ fontStyle: 'italic', color: COLORS.accent }}>latest</em> balance sheet is valid
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1300 }}>
        What stops Bob from broadcasting an older sheet where he had 0.05 BTC instead of 0.045?
      </Body>
      <Callout kicker="The penalty mechanism" style={{ marginTop: 36, maxWidth: 1300 }}>
        Every time both parties sign a new balance sheet, the previous one is revoked. If a revoked sheet is broadcast, the other party can submit a cryptographic proof and claim the <em>entire</em> channel balance as a penalty.
      </Callout>
      <Body size="body" style={{ marginTop: 36, color: COLORS.muted, maxWidth: 1300 }}>
        Cheating is self-defeating: the cheater loses everything. Honesty is the only rational strategy.
      </Body>
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
  return (
    <SlideFrame>
      <Eyebrow>Expanding the network</Eyebrow>
      <Title>
        Alice and Bob open their own <em style={{ fontStyle: 'italic', color: COLORS.accent }}>channel</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="1000" height="260" viewBox="0 0 1000 260">
          <rect x="40" y="70" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="160" y="140" textAnchor="middle" fontFamily={FONTS.serif} fontSize="46" fill={COLORS.ink}>Alice</text>
          <line x1="280" y1="130" x2="680" y2="130" stroke={COLORS.accent} strokeWidth="6" strokeLinecap="round" />
          <polygon points="680,117 702,130 680,143" fill={COLORS.accent} />
          <polygon points="280,117 258,130 280,143" fill={COLORS.accent} />
          <text x="480" y="103" textAnchor="middle" fontFamily={FONTS.sans} fontSize="26" letterSpacing="0.12em" fill={COLORS.muted}>
            PAYMENT CHANNEL
          </text>
          <rect x="700" y="70" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="820" y="140" textAnchor="middle" fontFamily={FONTS.serif} fontSize="46" fill={COLORS.ink}>Bob</text>
        </svg>
      </div>
      <Body size="bodyLg" style={{ maxWidth: 1300 }}>
        Alice funds her own payment channel with Bob. Bob, in turn, already has a channel with the Coffeeshop. The network is beginning to form.
      </Body>
    </SlideFrame>
  )
}

export function SlideAliceToShop() {
  return (
    <SlideFrame>
      <Eyebrow>Routing</Eyebrow>
      <Title>
        Alice can pay the Coffeeshop <em style={{ fontStyle: 'italic', color: COLORS.accent }}>through Bob</em>
      </Title>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="1560" height="240" viewBox="0 0 1560 240">
          <rect x="30" y="55" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.accent} strokeWidth="2.5" />
          <text x="150" y="118" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Alice</text>
          <text x="150" y="158" textAnchor="middle" fontFamily={FONTS.mono} fontSize="26" fill={COLORS.accent}>(has BTC)</text>
          <line x1="270" y1="115" x2="540" y2="115" stroke={COLORS.accent} strokeWidth="5" strokeLinecap="round" />
          <polygon points="540,102 562,115 540,128" fill={COLORS.accent} />
          <text x="405" y="95" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>channel</text>
          <rect x="562" y="55" width="240" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="682" y="118" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Bob</text>
          <text x="682" y="158" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>(routes)</text>
          <line x1="802" y1="115" x2="1072" y2="115" stroke={COLORS.rule} strokeWidth="5" strokeLinecap="round" strokeDasharray="14,7" />
          <polygon points="1072,102 1094,115 1072,128" fill={COLORS.rule} />
          <text x="937" y="95" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>channel</text>
          <rect x="1094" y="55" width="430" height="120" rx="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
          <text x="1309" y="118" textAnchor="middle" fontFamily={FONTS.serif} fontSize="42" fill={COLORS.ink}>Coffeeshop</text>
          <text x="1309" y="158" textAnchor="middle" fontFamily={FONTS.sans} fontSize="22" fill={COLORS.muted}>(destination)</text>
        </svg>
      </div>
      <Body size="bodyLg" style={{ maxWidth: 1300 }}>
        Alice has no direct channel with the Coffeeshop, but Bob is connected to both. Her payment routes through Bob’s existing channels — no new on-chain transaction needed.
      </Body>
    </SlideFrame>
  )
}

export function SlideRoutingPayment() {
  return (
    <SlideFrame>
      <Eyebrow>Atomic routing</Eyebrow>
      <Title>
        the payment hops <em style={{ fontStyle: 'italic', color: COLORS.accent }}>without trust</em>
      </Title>
      <Body size="bodyLg" style={{ marginTop: 48, maxWidth: 1400 }}>
        How does Alice know Bob won’t pocket her BTC instead of forwarding it? The answer is Hash Time-Locked Contracts (HTLCs):
      </Body>
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 36, maxWidth: 1560 }}>
        {[
          ['01', 'Alice locks the BTC', 'with a cryptographic hash that only the Coffeeshop can unlock.'],
          ['02', 'Coffeeshop reveals the secret', 'and claims the payment — proving delivery.'],
          ['03', 'Bob collects his routing fee', 'only if the secret propagates back through the chain.'],
        ].map(([n, title, description]) => (
          <div key={n} style={{ borderTop: `2px solid ${COLORS.accent}`, paddingTop: 22 }}>
            <Numeral n={n} style={{ fontSize: 44, marginBottom: 14 }} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 36, color: COLORS.ink, marginBottom: 12 }}>{title}</div>
            <Body size="body">{description}</Body>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}

export function SlideNetworkMap() {
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
        <div style={{ width: 580 }}>
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
            <line x1="100" y1="110" x2="290" y2="250" stroke={COLORS.accent} strokeWidth="4.5" />
            <line x1="290" y1="250" x2="480" y2="390" stroke={COLORS.accent} strokeWidth="4.5" />
            <circle cx="290" cy="250" r="17" fill={COLORS.ink} stroke={COLORS.gold} strokeWidth="3" />
            <circle cx="100" cy="110" r="15" fill={COLORS.accent} />
            <circle cx="480" cy="390" r="15" fill={COLORS.ok} />
            <circle cx="480" cy="110" r="10" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <circle cx="100" cy="390" r="10" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <circle cx="290" cy="40" r="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <circle cx="290" cy="460" r="8" fill={COLORS.creamDark} stroke={COLORS.rule} strokeWidth="2" />
            <text x="100" y="82" textAnchor="middle" fontFamily={FONTS.sans} fontSize="24" fill={COLORS.ink} fontWeight="600">Person A</text>
            <text x="480" y="422" textAnchor="middle" fontFamily={FONTS.sans} fontSize="24" fill={COLORS.ink} fontWeight="600">Person B</text>
          </svg>
        </div>
      </div>
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
  { label: 'Scalability', Component: SlideScalability },
  { label: 'Part 02', Component: SlidePart2Divider },
  { label: 'Lightning Intro', Component: SlideLightningIntro },
  { label: 'Opening a Channel', Component: SlideOpeningAChannel },
  { label: 'Multi-Sig Funding', Component: SlideMultiSigFunding },
  { label: 'Balance Sheet', Component: SlideInitialBalanceSheet },
  { label: 'On-chain Open', Component: SlideOnChainOpen },
  { label: 'Part 03', Component: SlidePart3Divider },
  { label: 'Bob Buys Coffee', Component: SlideBobBuysCoffee },
  { label: 'Updated Sheet', Component: SlideUpdatedSheet },
  { label: 'Exchanging Sheets', Component: SlideExchangingSheets },
  { label: 'Closing Channel', Component: SlideClosingChannel },
  { label: 'Reduced Load', Component: SlideReducedLoad },
  { label: 'Latest Sheet Valid', Component: SlideLatestSheetValid },
  { label: 'Part 04', Component: SlidePart4Divider },
  { label: 'Alice-Bob Channel', Component: SlideAliceBobChannel },
  { label: 'Alice to Coffeeshop', Component: SlideAliceToShop },
  { label: 'Routing Payment', Component: SlideRoutingPayment },
  { label: 'Network Map', Component: SlideNetworkMap },
  { label: 'Recap', Component: SlideRecap },
  { label: 'Next Class', Component: SlideNextClass },
]
