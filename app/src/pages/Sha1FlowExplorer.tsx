import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * SHA-1 Flow Explorer
 *
 * The visualizations inside this page are produced imperatively (the original
 * hand-written script is preserved almost verbatim in the effect below). The
 * surrounding chrome — header, hero, toolbar, stage scaffolding, and overlays —
 * is styled with the Harvard-Westlake style-guide tokens instead of the
 * original dark-gradient design. All internal class names are scoped under
 * `.sha1-explorer` (see index.css).
 */
export default function Sha1FlowExplorer() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const glossary: Record<string, { title: string; body: string }> = {
      hash: {
        title: 'Cryptographic hash function',
        body: 'A recipe that turns any input into a fixed-size output fingerprint. The same input gives the same result every time.',
      },
      deterministic: {
        title: 'Deterministic',
        body: 'No randomness is involved. If you run the same input through the same hash function again, the output is exactly the same.',
      },
      oneway: {
        title: 'One-way',
        body: 'The recipe is designed so that going from input to fingerprint is easy, but recovering the original input from only the fingerprint is impractical.',
      },
      avalanche: {
        title: 'Avalanche effect',
        body: 'A tiny input change, even one flipped bit, should spread through the process so the output fingerprint changes in many places.',
      },
      fixedsize: {
        title: 'Fixed-size output',
        body: 'No matter how long the input is, the function always returns an output of the same length. SHA-1 always returns 160 bits.',
      },
      collision: {
        title: 'Collision resistance',
        body: 'This means it should be very hard to find two different inputs that end with the same output fingerprint. SHA-1 is no longer trusted enough here for modern high-security uses.',
      },
      utf8: {
        title: 'UTF-8',
        body: 'A common rule for turning text into bytes. Some characters use one byte, while others use several.',
      },
      byte: {
        title: 'Byte',
        body: 'A group of 8 bits. Many computer systems store and move data in bytes.',
      },
      padding: {
        title: 'Padding',
        body: 'Extra bits added so the data fits the exact shape the recipe expects. SHA-1 also stores the original length at the end.',
      },
      chunk: {
        title: '512-bit chunk',
        body: 'A 512-bit slice of the prepared input. SHA-1 processes one slice at a time.',
      },
      lane: {
        title: '32-bit lane',
        body: 'One 32-bit unit read from a chunk. SHA-1 begins each chunk with sixteen of these.',
      },
      constant: {
        title: 'Constant',
        body: 'A number baked into the recipe. It stays fixed for a section and does not depend on the input.',
      },
      bigendian: {
        title: 'Big-endian',
        body: 'A way to write multi-byte numbers where the most significant byte comes first.',
      },
      round: {
        title: 'Round',
        body: 'One pass through the repeating update recipe. SHA-1 uses 80 rounds for each 512-bit chunk.',
      },
      xor: {
        title: 'XOR',
        body: 'A bit-by-bit comparison. The result bit is 1 when the input bits differ, and 0 when they are the same.',
      },
      rotate: {
        title: 'Rotate left',
        body: 'Shift bits to the left in a circle so the bits that fall off the left side wrap around to the right side.',
      },
      choose: {
        title: 'Choose rule',
        body: 'For each bit position, one input acts like a selector. If that selector bit is 1, use the bit from one source. If it is 0, use the bit from the other source.',
      },
      majority: {
        title: 'Majority rule',
        body: 'For each bit position, the result is whichever bit value appears in at least two of the three inputs.',
      },
    }

    type Phase = {
      id: string
      label: string
      badge: string
      color: string
      glyph: string
      rule: string
      plain: string
      formula: string
      k: string
      range: [number, number]
      summary: string
    }

    const PHASES: Phase[] = [
      {
        id: 'phase0',
        label: 'Rounds 0-19',
        badge: 'Choose section',
        color: 'var(--phase0)',
        glyph: '⇄',
        rule: 'choose(B, C, D)',
        plain: 'Each bit of B chooses whether the matching bit comes from C or from D.',
        formula: '(B AND C) OR ((NOT B) AND D)',
        k: '0x5A827999',
        range: [0, 19],
        summary: 'selector mix',
      },
      {
        id: 'phase1',
        label: 'Rounds 20-39',
        badge: 'XOR section',
        color: 'var(--phase1)',
        glyph: '⊕',
        rule: 'B XOR C XOR D',
        plain: 'A bit becomes 1 when an odd number of B, C, and D have 1 in that position.',
        formula: 'B XOR C XOR D',
        k: '0x6ED9EBA1',
        range: [20, 39],
        summary: 'difference mix',
      },
      {
        id: 'phase2',
        label: 'Rounds 40-59',
        badge: 'Majority section',
        color: 'var(--phase2)',
        glyph: '⚖',
        rule: 'majority(B, C, D)',
        plain: 'A bit becomes 1 when at least two of B, C, and D have 1 there.',
        formula: '(B AND C) OR (B AND D) OR (C AND D)',
        k: '0x8F1BBCDC',
        range: [40, 59],
        summary: 'agreement mix',
      },
      {
        id: 'phase3',
        label: 'Rounds 60-79',
        badge: 'XOR reprise',
        color: 'var(--phase3)',
        glyph: '⊕',
        rule: 'B XOR C XOR D',
        plain: 'The XOR rule returns, but with a new section constant.',
        formula: 'B XOR C XOR D',
        k: '0xCA62C1D6',
        range: [60, 79],
        summary: 'final weave',
      },
    ]

    const MAX_BYTE_CARDS = 24
    const MAX_BINARY_BYTES = 18

    type Round = {
      t: number
      phaseIndex: number
      aBefore: number
      bBefore: number
      cBefore: number
      dBefore: number
      eBefore: number
      rotA: number
      fVal: number
      w: number
      k: number
      temp: number
      aAfter: number
      bAfter: number
      cAfter: number
      dAfter: number
      eAfter: number
      density: { rotA: number; fVal: number; w: number; temp: number }
      changedBits: number
    }
    type Chunk = {
      index: number
      byteStart: number
      byteEnd: number
      bytes: number[]
      initialWords: number[]
      schedule: number[]
      rounds: Round[]
      hBefore: number[]
      hAfter: number[]
    }
    type Trace = {
      sourceText: string
      bytes: Uint8Array
      paddedBytes: Uint8Array
      originalBitLength: number
      preparedBits: number
      zeroPadBits: number
      lengthFieldBytes: Uint8Array
      chunks: Chunk[]
      finalWords: number[]
      finalHex: string
    }

    const state: {
      trace: Trace | null
      honors: boolean
      selectedChunk: number
      pinnedDetail: boolean
      currentDetailKey: string | null
    } = {
      trace: null,
      honors: false,
      selectedChunk: 0,
      pinnedDetail: false,
      currentDetailKey: null,
    }

    const $ = (id: string) => document.getElementById(id)!
    const refs = {
      input: $('inputText') as HTMLTextAreaElement,
      heroByteCount: $('heroByteCount'),
      heroBitCount: $('heroBitCount'),
      heroPreparedBits: $('heroPreparedBits'),
      heroChunkCount: $('heroChunkCount'),
      heroHash: $('heroHash'),
      honorsToggle: $('honorsToggle') as HTMLInputElement,
      sha256Stub: $('sha256Stub'),
      scrollOverview: $('scrollOverview'),
      chunkToolbar: $('chunkToolbar'),
      chunkToolbarSummary: $('chunkToolbarSummary'),
      chunkToolbarButtons: $('chunkToolbarButtons'),
      overviewVisual: $('overviewVisual'),
      bytesVisual: $('bytesVisual'),
      paddingVisual: $('paddingVisual'),
      chunksVisual: $('chunksVisual'),
      scheduleVisual: $('scheduleVisual'),
      phase0Visual: $('phase0Visual'),
      phase1Visual: $('phase1Visual'),
      phase2Visual: $('phase2Visual'),
      phase3Visual: $('phase3Visual'),
      finalVisual: $('finalVisual'),
      avalancheVisual: $('avalancheVisual'),
      verificationVisual: $('verificationVisual'),
      glossaryTooltip: $('glossaryTooltip'),
      detailOverlay: $('detailOverlay'),
      detailBadge: $('detailBadge'),
      detailBadgeText: $('detailBadgeText'),
      detailTitle: $('detailTitle'),
      detailSubtitle: $('detailSubtitle'),
      detailChipStream: $('detailChipStream'),
      detailMetrics: $('detailMetrics'),
      detailFlowText: $('detailFlowText'),
      detailFootnote: $('detailFootnote'),
      detailClose: $('detailClose'),
    }

    const rol = (value: number, count: number) =>
      (((value << count) | (value >>> (32 - count))) >>> 0)

    const add32 = (...values: number[]) =>
      values.reduce((sum, value) => (sum + (value >>> 0)) >>> 0, 0) >>> 0

    const toHex32 = (value: number) => (value >>> 0).toString(16).padStart(8, '0')

    const groupHex = (str: string, group = 8) =>
      (str.match(new RegExp(`.{1,${group}}`, 'g')) ?? []).join(' ')

    const popcount32 = (value: number) => {
      value >>>= 0
      let count = 0
      while (value) {
        value &= value - 1
        count++
      }
      return count
    }

    const bytesToHex = (bytes: Uint8Array | number[]) =>
      Array.from(bytes as ArrayLike<number>, byte => byte.toString(16).padStart(2, '0')).join(' ')

    const byteToBits = (byte: number) =>
      byte.toString(2).padStart(8, '0').replace(/(.{4})/g, '$1 ').trim()

    const wordToBits = (value: number) =>
      (value >>> 0).toString(2).padStart(32, '0').replace(/(.{8})/g, '$1 ').trim()

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    const printableLabel = (byte: number) => {
      if (byte === 10) return '↵'
      if (byte === 13) return '␍'
      if (byte === 9) return '⇥'
      if (byte >= 32 && byte <= 126) return String.fromCharCode(byte)
      return '·'
    }

    const summarizeTextForUI = (text: string) => {
      if (text.length === 0) return 'empty input'
      const clean = text.replace(/\n/g, '↵')
      return clean.length > 44 ? `${clean.slice(0, 41)}…` : clean
    }

    function sha1Trace(bytes: Uint8Array, sourceText = ''): Trace {
      const originalBitLength = BigInt(bytes.length) * 8n
      const padded: number[] = Array.from(bytes)
      padded.push(0x80)
      while (padded.length % 64 !== 56) padded.push(0x00)
      for (let shift = 56n; shift >= 0n; shift -= 8n) {
        padded.push(Number((originalBitLength >> shift) & 0xffn))
      }

      let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
      const chunks: Chunk[] = []

      for (let offset = 0; offset < padded.length; offset += 64) {
        const chunkBytes = padded.slice(offset, offset + 64)
        const initialWords: number[] = []
        for (let i = 0; i < 16; i++) {
          const start = i * 4
          initialWords[i] =
            ((chunkBytes[start] << 24) |
              (chunkBytes[start + 1] << 16) |
              (chunkBytes[start + 2] << 8) |
              chunkBytes[start + 3]) >>> 0
        }
        const schedule = initialWords.slice()
        for (let t = 16; t < 80; t++) {
          schedule[t] = rol(
            schedule[t - 3] ^ schedule[t - 8] ^ schedule[t - 14] ^ schedule[t - 16],
            1,
          )
        }

        let [a, b, c, d, e] = h
        const rounds: Round[] = []

        for (let t = 0; t < 80; t++) {
          let f: number
          let k: number
          let phaseIndex: number
          if (t < 20) {
            f = ((b & c) | (~b & d)) >>> 0
            k = 0x5a827999
            phaseIndex = 0
          } else if (t < 40) {
            f = (b ^ c ^ d) >>> 0
            k = 0x6ed9eba1
            phaseIndex = 1
          } else if (t < 60) {
            f = ((b & c) | (b & d) | (c & d)) >>> 0
            k = 0x8f1bbcdc
            phaseIndex = 2
          } else {
            f = (b ^ c ^ d) >>> 0
            k = 0xca62c1d6
            phaseIndex = 3
          }

          const aBefore = a >>> 0
          const bBefore = b >>> 0
          const cBefore = c >>> 0
          const dBefore = d >>> 0
          const eBefore = e >>> 0
          const rotA = rol(aBefore, 5)
          const rotB30 = rol(bBefore, 30)
          const temp = add32(rotA, f, eBefore, schedule[t], k)

          rounds.push({
            t,
            phaseIndex,
            aBefore,
            bBefore,
            cBefore,
            dBefore,
            eBefore,
            rotA,
            fVal: f >>> 0,
            w: schedule[t] >>> 0,
            k: k >>> 0,
            temp,
            aAfter: temp >>> 0,
            bAfter: aBefore,
            cAfter: rotB30 >>> 0,
            dAfter: cBefore,
            eAfter: dBefore,
            density: {
              rotA: popcount32(rotA),
              fVal: popcount32(f),
              w: popcount32(schedule[t]),
              temp: popcount32(temp),
            },
            changedBits: popcount32(aBefore ^ temp),
          })

          e = dBefore
          d = cBefore
          c = rotB30
          b = aBefore
          a = temp
        }

        const hBefore = h.slice()
        h = [
          add32(h[0], a),
          add32(h[1], b),
          add32(h[2], c),
          add32(h[3], d),
          add32(h[4], e),
        ]

        chunks.push({
          index: offset / 64,
          byteStart: offset,
          byteEnd: offset + 63,
          bytes: chunkBytes,
          initialWords,
          schedule,
          rounds,
          hBefore,
          hAfter: h.slice(),
        })
      }

      const finalWords = h.slice()
      const finalHex = finalWords.map(toHex32).join('')
      const preparedBits = padded.length * 8
      const bitsBeforeLengthField = preparedBits - 64
      const zerosAfterMarker = bitsBeforeLengthField - Number(originalBitLength) - 1
      const lengthFieldBytes = padded.slice(-8)

      return {
        sourceText,
        bytes,
        paddedBytes: Uint8Array.from(padded),
        originalBitLength: Number(originalBitLength),
        preparedBits,
        zeroPadBits: zerosAfterMarker,
        lengthFieldBytes: Uint8Array.from(lengthFieldBytes),
        chunks,
        finalWords,
        finalHex,
      }
    }

    const sha1TraceFromText = (text: string) => {
      const bytes = new TextEncoder().encode(text)
      return sha1Trace(bytes, text)
    }

    function buildAvalanche(bytes: Uint8Array) {
      let base: Uint8Array
      let changed: Uint8Array
      let note: string
      let changedIndex: number
      if (bytes.length === 0) {
        base = new Uint8Array([0x00])
        changed = new Uint8Array([0x01])
        changedIndex = 0
        note = 'The original input is empty, so the comparison uses one byte 00 and the one-bit variant 01.'
      } else {
        base = new Uint8Array(bytes)
        changed = new Uint8Array(bytes)
        changedIndex = changed.length - 1
        changed[changedIndex] ^= 0x01
        note = `Only the least-significant bit of byte ${changedIndex} was flipped for the comparison.`
      }
      const baseTrace = sha1Trace(base)
      const changedTrace = sha1Trace(changed)
      const baseBits = (baseTrace.finalHex.match(/./g) ?? [])
        .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
        .join('')
      const changedBits = (changedTrace.finalHex.match(/./g) ?? [])
        .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
        .join('')
      const differences = Array.from({ length: 160 }, (_, i) => baseBits[i] !== changedBits[i])
      const diffCount = differences.filter(Boolean).length
      return { base, changed, changedIndex, note, baseTrace, changedTrace, differences, diffCount }
    }

    // -- Rendering ----------------------------------------------------------

    const flowCard = (number: number, title: string, body: string, accent: string) => `
      <div class="sha1-flow-card" style="--card-accent: ${accent};">
        <span class="sha1-step-number">${number}</span>
        <h4>${title}</h4>
        <p>${body}</p>
      </div>`

    function renderOverview(trace: Trace) {
      refs.overviewVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-stats-row">
            <div class="sha1-stat-box"><span class="label">Input bytes</span><strong>${trace.bytes.length}</strong></div>
            <div class="sha1-stat-box"><span class="label">Prepared bits</span><strong>${trace.preparedBits}</strong></div>
            <div class="sha1-stat-box"><span class="label">Chunks</span><strong>${trace.chunks.length}</strong></div>
            <div class="sha1-stat-box"><span class="label">Output bits</span><strong>160</strong></div>
          </div>
        </div>
        <div class="sha1-flow-grid">
          ${flowCard(1, 'Text → bytes', 'UTF-8 turns the visible text into bytes, and bytes into bits.', 'var(--encode)')}
          ${flowCard(2, 'Padding', 'Add one 1 bit, enough 0 bits, and a 64-bit copy of the original length.', 'var(--padding)')}
          ${flowCard(3, '512-bit chunks', 'The prepared message is sliced into equal chunks of 512 bits.', 'var(--chunk)')}
          ${flowCard(4, '80 round values', 'Each selected chunk grows from 16 starting lanes to 80 round values.', 'var(--schedule)')}
          ${flowCard(5, '80 rounds', 'Four color-coded sections of 20 rounds each keep updating A, B, C, D, and E.', 'var(--phase0)')}
          ${flowCard(6, '160-bit fingerprint', 'Five 32-bit words are written together as the final output.', 'var(--final)')}
        </div>
        <div class="sha1-surface">
          <h3>80 rounds, grouped into four sections</h3>
          <div class="sha1-flow-grid">
            ${PHASES.map((phase, idx) => `
              <div class="sha1-flow-card" style="--card-accent: ${phase.color};">
                <span class="sha1-step-number">${idx + 1}</span>
                <h4>${phase.label}</h4>
                <p>${phase.plain} Constant ${phase.k}. ${phase.range[1] - phase.range[0] + 1} rounds in this section.</p>
              </div>
            `).join('')}
          </div>
          <div class="sha1-note" style="margin-top: 14px;">
            <strong>Honors Student off:</strong> you see the big ideas first. <strong>Honors Student on:</strong> the detailed sections below reveal all 80 rounds as compact hoverable grids.
          </div>
        </div>`
    }

    function renderBytes(trace: Trace) {
      const byteCards = Array.from(trace.bytes.slice(0, MAX_BYTE_CARDS), (byte, index) => `
        <div class="sha1-byte-card">
          <div class="sha1-byte-char">byte ${index} · ${escapeHtml(printableLabel(byte))}</div>
          <div class="sha1-byte-hex">0x${byte.toString(16).padStart(2, '0')}</div>
          <div class="sha1-byte-bits">${byteToBits(byte)}</div>
        </div>`).join('')

      const binaryGroups = Array.from(trace.bytes.slice(0, MAX_BINARY_BYTES), byte =>
        `<span class="sha1-group">${byteToBits(byte)}</span>`).join('')
      const omittedBytes = trace.bytes.length > MAX_BYTE_CARDS ? trace.bytes.length - MAX_BYTE_CARDS : 0
      const omittedBinary = trace.bytes.length > MAX_BINARY_BYTES ? trace.bytes.length - MAX_BINARY_BYTES : 0

      refs.bytesVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-stats-row">
            <div class="sha1-stat-box"><span class="label">Characters typed</span><strong>${Array.from(refs.input.value).length}</strong></div>
            <div class="sha1-stat-box"><span class="label">UTF-8 bytes</span><strong>${trace.bytes.length}</strong></div>
            <div class="sha1-stat-box"><span class="label">Input bits</span><strong>${trace.originalBitLength}</strong></div>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Byte cards</h3>
          <div class="sha1-byte-grid">${byteCards || '<div class="sha1-byte-card"><div class="sha1-byte-char">empty</div><div class="sha1-byte-hex">no bytes</div><div class="sha1-byte-bits">The empty string still gets padded later.</div></div>'}</div>
          ${omittedBytes ? `<div class="sha1-honors-note" style="margin-top: 12px;">${omittedBytes} more byte${omittedBytes === 1 ? '' : 's'} exist in the full input but are omitted from these cards so the display stays readable.</div>` : ''}
        </div>
        <div class="sha1-surface sha1-binary-ribbon">
          <h3>Bit view of the first bytes</h3>
          <div class="sha1-binary-line mono">${binaryGroups || '<span class="sha1-group">(empty)</span>'}</div>
          ${omittedBinary ? `<div class="sha1-honors-note">${omittedBinary} later byte${omittedBinary === 1 ? '' : 's'} are not shown in this ribbon, but the hash computation still uses all of them.</div>` : ''}
        </div>`
    }

    function renderPadding(trace: Trace) {
      const originalBits = Math.max(trace.originalBitLength, 1)
      const oneBit = 1
      const zeroBits = Math.max(trace.zeroPadBits, 0)
      const lengthBits = 64
      const segmentFlex = (value: number) => Math.max(value, 8)

      const last16Bytes = Array.from(trace.paddedBytes.slice(-16), byte =>
        `<span class="sha1-group">${byte.toString(16).padStart(2, '0')}</span>`).join('')
      const lengthFieldBits = Array.from(trace.lengthFieldBytes, byte =>
        `<span class="sha1-group">${byteToBits(byte)}</span>`).join('')

      refs.paddingVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-stats-row">
            <div class="sha1-stat-box"><span class="label">Original bits</span><strong>${trace.originalBitLength}</strong></div>
            <div class="sha1-stat-box"><span class="label">Added 1 bit</span><strong>1</strong></div>
            <div class="sha1-stat-box"><span class="label">Added 0 bits</span><strong>${trace.zeroPadBits}</strong></div>
            <div class="sha1-stat-box"><span class="label">Length field</span><strong>64 bits</strong></div>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Prepared message shape</h3>
          <div class="sha1-padding-bar">
            <div class="sha1-padding-segment sha1-padding-original" style="--segment-flex: ${segmentFlex(originalBits)}"><span>original input<br>${trace.originalBitLength} bits</span></div>
            <div class="sha1-padding-segment sha1-padding-one" style="--segment-flex: ${segmentFlex(oneBit)}"><span>the first 1 bit</span></div>
            <div class="sha1-padding-segment sha1-padding-zeros" style="--segment-flex: ${segmentFlex(zeroBits)}"><span>extra 0 bits<br>${trace.zeroPadBits}</span></div>
            <div class="sha1-padding-segment sha1-padding-length" style="--segment-flex: ${segmentFlex(lengthBits)}"><span>length field<br>64 bits</span></div>
          </div>
        </div>
        <div class="sha1-surface sha1-binary-ribbon">
          <h3>The final bytes of the prepared message</h3>
          <div class="sha1-binary-line mono">${last16Bytes}</div>
          <div class="sha1-honors-note">The last 8 bytes are the original length written in big-endian form.</div>
          <div class="sha1-binary-line mono">${lengthFieldBits}</div>
        </div>`
    }

    function renderChunkToolbar(trace: Trace) {
      if (trace.chunks.length <= 1) {
        refs.chunkToolbar.classList.add('hidden')
        return
      }
      refs.chunkToolbar.classList.remove('hidden')
      refs.chunkToolbarSummary.textContent = `showing chunk ${state.selectedChunk + 1} of ${trace.chunks.length}`
      refs.chunkToolbarButtons.innerHTML = trace.chunks.map((chunk, index) => `
        <button class="sha1-chunk-btn ${index === state.selectedChunk ? 'active' : ''}" data-chunk-select="${index}">
          <strong>chunk ${index}</strong>
          <small>bytes ${chunk.byteStart}–${chunk.byteEnd}</small>
        </button>`).join('')
    }

    function renderChunks(trace: Trace) {
      const selected = trace.chunks[state.selectedChunk]
      refs.chunksVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-stats-row">
            <div class="sha1-stat-box"><span class="label">Prepared bytes</span><strong>${trace.paddedBytes.length}</strong></div>
            <div class="sha1-stat-box"><span class="label">Chunks</span><strong>${trace.chunks.length}</strong></div>
            <div class="sha1-stat-box"><span class="label">Selected chunk</span><strong>${state.selectedChunk}</strong></div>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Chunk list</h3>
          <div class="sha1-chunk-card-list">
            ${trace.chunks.map((chunk, index) => `
              <button class="sha1-mini-chunk-card ${index === state.selectedChunk ? 'active' : ''}" data-chunk-select="${index}">
                <strong>chunk ${index}</strong>
                <small>byte range: ${chunk.byteStart}–${chunk.byteEnd}</small>
                <small>first lane: ${toHex32(chunk.initialWords[0])}</small>
                <small>last lane: ${toHex32(chunk.initialWords[15])}</small>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Selected chunk ${state.selectedChunk}: sixteen starting 32-bit lanes</h3>
          <div class="sha1-lane-grid">
            ${selected.initialWords.map((word, index) => `
              <div class="sha1-lane-card">
                <span class="sha1-tag">lane ${index}</span>
                <strong>0x${toHex32(word)}</strong>
                <code>${wordToBits(word)}</code>
              </div>
            `).join('')}
          </div>
        </div>`
    }

    function renderSchedule(trace: Trace) {
      const chunk = trace.chunks[state.selectedChunk]
      const timeline = chunk.schedule.map((word, index) =>
        `<div class="sha1-schedule-strip-cell ${index < 16 ? 'direct' : 'derived'}" title="W[${index}] = ${toHex32(word)}"></div>`).join('')
      const honorsGrid = chunk.schedule.map((word, index) => {
        const direct = index < 16
        return `
          <button class="sha1-schedule-cell ${direct ? 'direct' : 'derived'}" data-detail-type="schedule" data-chunk="${state.selectedChunk}" data-word="${index}">
            <span class="sha1-idx">W[${index}]</span>
            <div class="sha1-cell-value">0x${toHex32(word)}</div>
            <span class="sha1-cell-subtitle">${direct ? 'comes directly from the chunk' : 'built from earlier values'}</span>
          </button>`
      }).join('')

      refs.scheduleVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-stats-row">
            <div class="sha1-stat-box"><span class="label">Direct values</span><strong>16</strong></div>
            <div class="sha1-stat-box"><span class="label">Derived values</span><strong>64</strong></div>
            <div class="sha1-stat-box"><span class="label">Selected chunk</span><strong>${state.selectedChunk}</strong></div>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>The 80-value timeline for chunk ${state.selectedChunk}</h3>
          <div class="sha1-schedule-timeline">${timeline}</div>
          <div class="sha1-honors-note" style="margin-top: 12px;">Teal cells are copied straight from the selected chunk. Purple cells are derived later with XOR and a 1-bit rotate.</div>
        </div>
        <div class="sha1-surface">
          <h3>How a later value is made</h3>
          <div class="sha1-shift-row" style="margin-bottom: 10px;">
            <span class="sha1-state-pill">W[t-3]</span>
            <span class="sha1-state-pill arrow">⊕</span>
            <span class="sha1-state-pill">W[t-8]</span>
            <span class="sha1-state-pill arrow">⊕</span>
            <span class="sha1-state-pill">W[t-14]</span>
            <span class="sha1-state-pill arrow">⊕</span>
            <span class="sha1-state-pill">W[t-16]</span>
            <span class="sha1-state-pill arrow">→</span>
            <span class="sha1-state-pill">rotate left by 1</span>
          </div>
          <div class="sha1-honors-note">Formula: <code class="mono">W[t] = rol1(W[t-3] XOR W[t-8] XOR W[t-14] XOR W[t-16])</code></div>
        </div>
        <div class="sha1-surface ${state.honors ? '' : 'hidden'}">
          <h3>Honors view · all 80 values for this chunk</h3>
          <div class="sha1-schedule-grid ${state.honors ? '' : 'hidden'}">${honorsGrid}</div>
        </div>`
    }

    function renderPhaseSection(phaseIndex: number, container: HTMLElement) {
      const trace = state.trace!
      const chunk = trace.chunks[state.selectedChunk]
      const meta = PHASES[phaseIndex]
      const rounds = chunk.rounds.slice(meta.range[0], meta.range[1] + 1)
      const avgChanged = Math.round(rounds.reduce((sum, r) => sum + r.changedBits, 0) / rounds.length)
      const avgOnes = Math.round(rounds.reduce((sum, r) => sum + r.density.temp, 0) / rounds.length)
      const strip = rounds.map(() =>
        `<div class="sha1-round-strip-cell" style="--phase-color: ${meta.color};"></div>`).join('')
      const honorsGrid = rounds.map(round => {
        const heights = [round.density.rotA, round.density.fVal, round.density.w, round.density.temp]
          .map(value => Math.max(18, Math.round((value / 32) * 100)))
        return `
          <button class="sha1-round-cell" style="--phase-color: ${meta.color};" data-detail-type="round" data-chunk="${state.selectedChunk}" data-round="${round.t}">
            <div class="sha1-round-topline">
              <span class="sha1-idx">${round.t.toString().padStart(2, '0')}</span>
              <span class="sha1-round-glyph">${meta.glyph}</span>
            </div>
            <div class="sha1-microbars">
              <span style="height:${heights[0]}%"></span>
              <span style="height:${heights[1]}%"></span>
              <span style="height:${heights[2]}%"></span>
              <span style="height:${heights[3]}%"></span>
            </div>
            <span class="sha1-round-caption">W[${round.t}] · temp 0x${toHex32(round.temp).slice(0, 4)}…</span>
          </button>`
      }).join('')

      container.innerHTML = `
        <div class="sha1-phase-panel">
          <div class="sha1-surface">
            <div class="sha1-phase-top">
              <div>
                <div class="sha1-phase-badge" style="--phase-color: ${meta.color};"><span class="sha1-phase-dot"></span>${meta.badge}</div>
                <h3 style="margin-top: 12px;">${meta.label} for chunk ${state.selectedChunk}</h3>
                <p style="margin-top: 10px;">${meta.plain}</p>
              </div>
              <div class="sha1-stat-box" style="min-width: 170px;">
                <span class="label">section constant</span>
                <code>${meta.k}</code>
              </div>
            </div>
          </div>
          <div class="sha1-surface">
            <div class="sha1-phase-ingredients">
              <div class="sha1-ingredient-card"><span class="label">Rule</span><strong>${meta.rule}</strong></div>
              <div class="sha1-ingredient-card"><span class="label">Formula</span><code>${meta.formula}</code></div>
              <div class="sha1-ingredient-card"><span class="label">Rounds in this section</span><strong>${meta.range[0]}–${meta.range[1]}</strong></div>
              <div class="sha1-ingredient-card"><span class="label">Average changed bits in A</span><strong>${avgChanged} / 32</strong></div>
              <div class="sha1-ingredient-card"><span class="label">Average 1-bits in temp</span><strong>${avgOnes} / 32</strong></div>
              <div class="sha1-ingredient-card"><span class="label">Current W[t] values</span><strong>W[${meta.range[0]}] … W[${meta.range[1]}]</strong></div>
            </div>
          </div>
          <div class="sha1-surface">
            <h3>One round’s data movement</h3>
            <div class="sha1-shift-diagram">
              <div class="sha1-shift-row">
                <span class="sha1-state-pill">rol5(A)</span>
                <span class="sha1-state-pill arrow">+</span>
                <span class="sha1-state-pill">section rule</span>
                <span class="sha1-state-pill arrow">+</span>
                <span class="sha1-state-pill">E</span>
                <span class="sha1-state-pill arrow">+</span>
                <span class="sha1-state-pill">W[t]</span>
                <span class="sha1-state-pill arrow">+</span>
                <span class="sha1-state-pill">K</span>
                <span class="sha1-state-pill arrow">→</span>
                <span class="sha1-state-pill">new A</span>
              </div>
              <div class="sha1-shift-row">
                <span class="sha1-state-pill">new B = old A</span>
                <span class="sha1-state-pill">new C = rol30(old B)</span>
                <span class="sha1-state-pill">new D = old C</span>
                <span class="sha1-state-pill">new E = old D</span>
              </div>
            </div>
          </div>
          <div class="sha1-surface">
            <h3>Section at a glance</h3>
            <div class="sha1-round-band" style="--phase-color: ${meta.color};">${strip}</div>
            <div class="sha1-honors-note ${state.honors ? 'hidden' : ''}" style="margin-top: 12px;">Turn on Honors Student to reveal the 10×2 round grid for this section.</div>
          </div>
          <div class="sha1-surface ${state.honors ? '' : 'hidden'}">
            <h3>Honors view · all ${rounds.length} rounds in ${meta.label}</h3>
            <div class="sha1-round-grid ${state.honors ? '' : 'hidden'}">${honorsGrid}</div>
            <div class="sha1-honors-note" style="margin-top: 12px;">Each tile shows one round. The four tiny bars show the bit density of rol5(A), the section rule output, W[t], and temp.</div>
          </div>
        </div>`
    }

    function renderFinal(trace: Trace) {
      const selectedChunk = trace.chunks[state.selectedChunk]
      const accumulationSteps = trace.chunks.map(chunk => `
        <div class="sha1-acc-step">
          <div class="sha1-acc-title">after chunk ${chunk.index}</div>
          <code>${chunk.hAfter.map(toHex32).join(' ')}</code>
        </div>`).join('')

      refs.finalVisual.innerHTML = `
        <div class="sha1-hash-banner">
          <span class="label">Final SHA-1 fingerprint</span>
          <code>${groupHex(trace.finalHex)}</code>
        </div>
        <div class="sha1-surface">
          <h3>Final five 32-bit words</h3>
          <div class="sha1-final-grid">
            ${trace.finalWords.map((word, index) => `
              <div class="sha1-final-word">
                <span class="sha1-tag">word ${index}</span>
                <strong>0x${toHex32(word)}</strong>
                <code>${wordToBits(word)}</code>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Running total across chunks</h3>
          <div class="sha1-accumulation-list">${accumulationSteps}</div>
          ${trace.chunks.length > 1
            ? `<div class="sha1-honors-note" style="margin-top: 12px;">Each chunk starts from the previous running total and leaves behind a new one.</div>`
            : `<div class="sha1-honors-note" style="margin-top: 12px;">With a one-chunk message, this running total is updated only once.</div>`}
        </div>
        <div class="sha1-surface">
          <h3>Selected chunk ${state.selectedChunk} ended with</h3>
          <div class="sha1-word-grid">
            ${selectedChunk.hAfter.map((word, index) => `
              <div class="sha1-word-card">
                <span class="sha1-tag">running word ${index}</span>
                <strong>0x${toHex32(word)}</strong>
                <code>${wordToBits(word)}</code>
              </div>
            `).join('')}
          </div>
        </div>`
    }

    function describeByteSequence(bytes: Uint8Array) {
      const arr = Array.from(bytes)
      const printable = arr.every(byte => byte >= 32 && byte <= 126)
      if (printable) {
        const text = arr.slice(0, 80).map(byte => String.fromCharCode(byte)).join('')
        const suffix = arr.length > 80 ? '…' : ''
        return `"${escapeHtml(text)}${suffix}"`
      }
      return bytesToHex(bytes)
    }

    function renderAvalanche(trace: Trace) {
      const avalanche = buildAvalanche(trace.bytes)
      const changedByteBefore = avalanche.base[avalanche.changedIndex]
      const changedByteAfter = avalanche.changed[avalanche.changedIndex]
      const bitGrid = avalanche.differences.map(diff =>
        `<div class="sha1-bit-cell ${diff ? 'changed' : ''}"></div>`).join('')

      refs.avalancheVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-stats-row">
            <div class="sha1-stat-box"><span class="label">Differing output bits</span><strong>${avalanche.diffCount} / 160</strong></div>
            <div class="sha1-stat-box"><span class="label">Bit changed in input</span><strong>1</strong></div>
            <div class="sha1-stat-box"><span class="label">Comparison note</span><strong>${escapeHtml(avalanche.note)}</strong></div>
          </div>
        </div>
        <div class="sha1-compare-layout">
          <div class="sha1-compare-card good">
            <div class="sha1-status">base input</div>
            <p>${describeByteSequence(avalanche.base)}</p>
            <code>${bytesToHex(avalanche.base)}</code>
            <p style="margin-top: 10px;">SHA-1</p>
            <code>${groupHex(avalanche.baseTrace.finalHex)}</code>
          </div>
          <div class="sha1-compare-card bad">
            <div class="sha1-status">one-bit variant</div>
            <p>${describeByteSequence(avalanche.changed)}</p>
            <code>${bytesToHex(avalanche.changed)}</code>
            <p style="margin-top: 10px;">SHA-1</p>
            <code>${groupHex(avalanche.changedTrace.finalHex)}</code>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>The changed input byte</h3>
          <div class="sha1-compare-layout">
            <div class="sha1-compare-card good">
              <span class="sha1-tag">before</span>
              <strong>byte ${avalanche.changedIndex}</strong>
              <code>${byteToBits(changedByteBefore)}</code>
            </div>
            <div class="sha1-compare-card bad">
              <span class="sha1-tag">after</span>
              <strong>byte ${avalanche.changedIndex}</strong>
              <code>${byteToBits(changedByteAfter)}</code>
            </div>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Which output bits changed?</h3>
          <div class="sha1-bit-diff-grid">${bitGrid}</div>
          <div class="sha1-bit-word-labels">
            <div>word 0 · bits 0–31</div>
            <div>word 1 · bits 32–63</div>
            <div>word 2 · bits 64–95</div>
            <div>word 3 · bits 96–127</div>
            <div>word 4 · bits 128–159</div>
          </div>
        </div>`
    }

    function renderVerification(trace: Trace) {
      const avalanche = buildAvalanche(trace.bytes)
      refs.verificationVisual.innerHTML = `
        <div class="sha1-surface">
          <div class="sha1-verification-flow">
            <div class="sha1-verify-card">
              <div class="sha1-verify-badge">stored content</div>
              <strong class="mono">${escapeHtml(summarizeTextForUI(refs.input.value))}</strong>
              <code>${groupHex(trace.finalHex)}</code>
            </div>
            <div class="sha1-verify-arrow">→</div>
            <div class="sha1-verify-card">
              <div class="sha1-verify-badge">later check</div>
              <strong class="mono">same bytes again</strong>
              <code>${groupHex(trace.finalHex)}</code>
              <div class="sha1-verify-badge" style="color: var(--ok);">match ✓</div>
            </div>
          </div>
        </div>
        <div class="sha1-surface">
          <div class="sha1-verification-flow">
            <div class="sha1-verify-card">
              <div class="sha1-verify-badge">changed content</div>
              <strong class="mono">${escapeHtml(summarizeTextForUI(refs.input.value))}</strong>
              <code>${groupHex(trace.finalHex)}</code>
            </div>
            <div class="sha1-verify-arrow">→</div>
            <div class="sha1-verify-card">
              <div class="sha1-verify-badge">later check</div>
              <strong class="mono">one-bit change</strong>
              <code>${groupHex(avalanche.changedTrace.finalHex)}</code>
              <div class="sha1-verify-badge" style="color: var(--bad);">mismatch ✗</div>
            </div>
          </div>
        </div>
        <div class="sha1-surface">
          <h3>Why this matters</h3>
          <p>Once a tool keeps a stored fingerprint, it can later recompute the fingerprint from the content it sees now. If the two match, the content matches. If they differ, the content changed. That is the integrity-checking idea this whole page has been building toward.</p>
        </div>`
    }

    function updateHero(trace: Trace) {
      refs.heroByteCount.textContent = `${trace.bytes.length}`
      refs.heroBitCount.textContent = `${trace.originalBitLength} bits`
      refs.heroPreparedBits.textContent = `${trace.preparedBits} bits`
      refs.heroChunkCount.textContent = `${trace.chunks.length}`
      refs.heroHash.textContent = groupHex(trace.finalHex)
    }

    function renderAll() {
      const trace = sha1TraceFromText(refs.input.value)
      state.trace = trace
      if (state.selectedChunk > trace.chunks.length - 1) {
        state.selectedChunk = trace.chunks.length - 1
      }
      updateHero(trace)
      renderChunkToolbar(trace)
      renderOverview(trace)
      renderBytes(trace)
      renderPadding(trace)
      renderChunks(trace)
      renderSchedule(trace)
      renderPhaseSection(0, refs.phase0Visual)
      renderPhaseSection(1, refs.phase1Visual)
      renderPhaseSection(2, refs.phase2Visual)
      renderPhaseSection(3, refs.phase3Visual)
      renderFinal(trace)
      renderAvalanche(trace)
      renderVerification(trace)
      if (state.currentDetailKey) refreshPinnedDetail()
    }

    // -- Glossary tooltip --------------------------------------------------

    function showGlossary(target: HTMLElement) {
      const key = target.dataset.term
      if (!key) return
      const entry = glossary[key]
      if (!entry) return
      refs.glossaryTooltip.innerHTML = `<strong>${entry.title}</strong><p>${entry.body}</p>`
      refs.glossaryTooltip.classList.add('visible')
      refs.glossaryTooltip.setAttribute('aria-hidden', 'false')
      positionGlossaryTooltip(target)
    }

    function positionGlossaryTooltip(target: HTMLElement) {
      const rect = target.getBoundingClientRect()
      const tooltip = refs.glossaryTooltip
      const margin = 12
      const width = tooltip.offsetWidth || 320
      const height = tooltip.offsetHeight || 120
      let left = rect.left + rect.width / 2 - width / 2
      left = Math.max(margin, Math.min(window.innerWidth - width - margin, left))
      let top = rect.top - height - 12
      if (top < margin) top = rect.bottom + 12
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    }

    function hideGlossary() {
      refs.glossaryTooltip.classList.remove('visible')
      refs.glossaryTooltip.setAttribute('aria-hidden', 'true')
    }

    // -- Detail overlay ----------------------------------------------------

    type Detail = {
      type: 'round' | 'schedule'
      badge: string
      color: string
      title: string
      subtitle: string
      chips: { label: string; tone: string }[]
      metrics: [string, string][]
      flowText: string
      footnote: string
    }

    function getRoundDetail(chunkIndex: number, roundIndex: number): Detail {
      const round = state.trace!.chunks[chunkIndex].rounds[roundIndex]
      const phase = PHASES[round.phaseIndex]
      return {
        type: 'round',
        badge: phase.badge,
        color: phase.color,
        title: `Round ${round.t} · ${phase.label}`,
        subtitle: `${phase.plain} The section constant here is ${phase.k}.`,
        chips: [
          { label: 'rol5(A)', tone: phase.color },
          { label: 'mix(B,C,D)', tone: phase.color },
          { label: 'E', tone: phase.color },
          { label: `W[${round.t}]`, tone: 'var(--schedule)' },
          { label: 'K', tone: phase.color },
          { label: 'new A', tone: 'var(--final)' },
        ],
        metrics: [
          ['old A', `0x${toHex32(round.aBefore)}`],
          ['old B', `0x${toHex32(round.bBefore)}`],
          ['old C', `0x${toHex32(round.cBefore)}`],
          ['old D', `0x${toHex32(round.dBefore)}`],
          ['old E', `0x${toHex32(round.eBefore)}`],
          ['rol5(A)', `0x${toHex32(round.rotA)}`],
          ['rule output', `0x${toHex32(round.fVal)}`],
          [`W[${round.t}]`, `0x${toHex32(round.w)}`],
          ['constant K', `0x${toHex32(round.k)}`],
          ['new A (temp)', `0x${toHex32(round.temp)}`],
        ],
        flowText: `This round spins A left by 5 bits, applies the section rule to B, C, and D, adds E, adds W[${round.t}], adds the section constant K, keeps only the lowest 32 bits, then shifts the temporary values forward.`,
        footnote: `After this round: new B = old A, new C = rol30(old B), new D = old C, and new E = old D. Changed bits in A this round: ${round.changedBits} of 32.`,
      }
    }

    function getScheduleDetail(chunkIndex: number, wordIndex: number): Detail {
      const chunk = state.trace!.chunks[chunkIndex]
      const value = chunk.schedule[wordIndex]
      if (wordIndex < 16) {
        return {
          type: 'schedule',
          badge: 'Round-value source',
          color: 'var(--chunk)',
          title: `W[${wordIndex}] comes directly from the selected chunk`,
          subtitle: `This is one of the first 16 values, copied straight from 32 bits inside chunk ${chunkIndex}.`,
          chips: [
            { label: `chunk lane ${wordIndex}`, tone: 'var(--chunk)' },
            { label: `W[${wordIndex}]`, tone: 'var(--schedule)' },
          ],
          metrics: [
            ['chunk lane', `${wordIndex}`],
            ['hex value', `0x${toHex32(value)}`],
            ['bit pattern', wordToBits(value)],
          ],
          flowText: `The first 16 schedule values are copied directly from the 512-bit chunk, 32 bits at a time.`,
          footnote: `Later values are not copied. They are derived by combining earlier schedule values.`,
        }
      }

      const a = chunk.schedule[wordIndex - 3]
      const b = chunk.schedule[wordIndex - 8]
      const c = chunk.schedule[wordIndex - 14]
      const d = chunk.schedule[wordIndex - 16]
      return {
        type: 'schedule',
        badge: 'Derived round value',
        color: 'var(--schedule)',
        title: `W[${wordIndex}] is built from earlier schedule values`,
        subtitle: `SHA-1 combines four earlier values with XOR, then rotates the result left by 1 bit.`,
        chips: [
          { label: `W[${wordIndex - 3}]`, tone: 'var(--schedule)' },
          { label: `W[${wordIndex - 8}]`, tone: 'var(--schedule)' },
          { label: `W[${wordIndex - 14}]`, tone: 'var(--schedule)' },
          { label: `W[${wordIndex - 16}]`, tone: 'var(--schedule)' },
          { label: 'XOR + rol1', tone: 'var(--encode)' },
          { label: `W[${wordIndex}]`, tone: 'var(--final)' },
        ],
        metrics: [
          [`W[${wordIndex - 3}]`, `0x${toHex32(a)}`],
          [`W[${wordIndex - 8}]`, `0x${toHex32(b)}`],
          [`W[${wordIndex - 14}]`, `0x${toHex32(c)}`],
          [`W[${wordIndex - 16}]`, `0x${toHex32(d)}`],
          ['final value', `0x${toHex32(value)}`],
          ['bit pattern', wordToBits(value)],
        ],
        flowText: `For W[${wordIndex}], SHA-1 takes W[${wordIndex - 3}], W[${wordIndex - 8}], W[${wordIndex - 14}], and W[${wordIndex - 16}], XORs them together, then rotates the result left by 1 bit.`,
        footnote: `That reuse is why earlier chunk bits continue to influence much later rounds.`,
      }
    }

    function renderDetail(detail: Detail) {
      refs.detailBadge.style.setProperty('--badge-color', detail.color)
      refs.detailBadgeText.textContent = detail.badge
      refs.detailTitle.textContent = detail.title
      refs.detailSubtitle.textContent = detail.subtitle
      refs.detailChipStream.innerHTML = detail.chips.map((chip, index) => `
        <span class="sha1-op-chip" style="--chip-color: ${chip.tone}; background: color-mix(in srgb, ${chip.tone} 14%, white); box-shadow: inset 0 0 0 1px color-mix(in srgb, ${chip.tone} 26%, transparent); ${index === detail.chips.length - 1 ? 'font-weight: 800;' : ''}">${chip.label}</span>
      `).join('<span class="sha1-op-chip arrow">→</span>')
      refs.detailMetrics.innerHTML = detail.metrics.map(([label, value]) => `
        <div class="sha1-detail-metric">
          <span class="label">${label}</span>
          <code>${value}</code>
        </div>`).join('')
      refs.detailFlowText.textContent = detail.flowText
      refs.detailFootnote.textContent = detail.footnote
      refs.detailOverlay.classList.add('visible')
    }

    function showDetailFromTarget(target: HTMLElement, pin = false) {
      const type = target.dataset.detailType
      const chunkIndex = Number(target.dataset.chunk)
      let detail: Detail
      let key: string
      if (type === 'round') {
        const roundIndex = Number(target.dataset.round)
        detail = getRoundDetail(chunkIndex, roundIndex)
        key = `round:${chunkIndex}:${roundIndex}`
      } else {
        const wordIndex = Number(target.dataset.word)
        detail = getScheduleDetail(chunkIndex, wordIndex)
        key = `schedule:${chunkIndex}:${wordIndex}`
      }
      state.currentDetailKey = key
      state.pinnedDetail = pin
      renderDetail(detail)
    }

    function refreshPinnedDetail() {
      if (!state.currentDetailKey) return
      const [type, chunkIndexText, valueText] = state.currentDetailKey.split(':')
      const chunkIndex = Number(chunkIndexText)
      const value = Number(valueText)
      if (!state.trace || chunkIndex < 0 || chunkIndex >= state.trace.chunks.length) {
        closeDetail()
        return
      }
      const detail = type === 'round'
        ? getRoundDetail(chunkIndex, value)
        : getScheduleDetail(chunkIndex, value)
      renderDetail(detail)
    }

    function closeDetail() {
      state.pinnedDetail = false
      state.currentDetailKey = null
      refs.detailOverlay.classList.remove('visible')
    }

    // -- Event wiring ------------------------------------------------------

    const onInput = () => renderAll()
    const onHonorsChange = () => {
      state.honors = refs.honorsToggle.checked
      renderAll()
    }
    const onStubClick = (event: Event) => {
      event.preventDefault()
      const target = refs.sha256Stub
      target.textContent = 'SHA-256 · coming next'
      const entry = {
        title: 'SHA-256 stub',
        body: 'This page currently animates SHA-1 only. The top selector is present so a future SHA-256 mode can reuse the same layout.',
      }
      refs.glossaryTooltip.innerHTML = `<strong>${entry.title}</strong><p>${entry.body}</p>`
      refs.glossaryTooltip.classList.add('visible')
      const rect = target.getBoundingClientRect()
      const width = refs.glossaryTooltip.offsetWidth || 320
      refs.glossaryTooltip.style.left = `${Math.max(12, rect.left + rect.width / 2 - width / 2)}px`
      refs.glossaryTooltip.style.top = `${rect.bottom + 10}px`
      window.setTimeout(hideGlossary, 2200)
    }
    const onScrollOverview = () => {
      document.getElementById('stage-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const root = rootRef.current
    if (!root) return

    const onRootClick = (event: Event) => {
      const evt = event as MouseEvent
      const target = evt.target as HTMLElement
      const preset = target.closest<HTMLElement>('[data-preset]')
      if (preset) {
        refs.input.value = preset.dataset.preset ?? ''
        renderAll()
      }
      const chunkButton = target.closest<HTMLElement>('[data-chunk-select]')
      if (chunkButton) {
        state.selectedChunk = Number(chunkButton.dataset.chunkSelect)
        renderAll()
      }
      const detailTarget = target.closest<HTMLElement>('[data-detail-type]')
      if (detailTarget) {
        showDetailFromTarget(detailTarget, true)
      } else if (!target.closest('#detailOverlay')) {
        if (!state.pinnedDetail) refs.detailOverlay.classList.remove('visible')
      }
    }

    const onRootMouseOver = (event: Event) => {
      const evt = event as MouseEvent
      const target = evt.target as HTMLElement
      const glossTarget = target.closest<HTMLElement>('.sha1-glossary-term')
      if (glossTarget) showGlossary(glossTarget)
      const detailTarget = target.closest<HTMLElement>('[data-detail-type]')
      if (detailTarget && !state.pinnedDetail) showDetailFromTarget(detailTarget, false)
    }

    const onRootMouseOut = (event: Event) => {
      const evt = event as MouseEvent
      const target = evt.target as HTMLElement
      const rel = evt.relatedTarget as HTMLElement | null
      const fromGloss = target.closest('.sha1-glossary-term')
      if (fromGloss && !rel?.closest('.sha1-glossary-term')) hideGlossary()
      const detailTarget = target.closest<HTMLElement>('[data-detail-type]')
      if (detailTarget && !state.pinnedDetail && !rel?.closest('#detailOverlay')) {
        refs.detailOverlay.classList.remove('visible')
      }
    }

    const onRootFocusIn = (event: Event) => {
      const target = (event.target as HTMLElement)
      const glossTarget = target.closest<HTMLElement>('.sha1-glossary-term')
      if (glossTarget) showGlossary(glossTarget)
      const detailTarget = target.closest<HTMLElement>('[data-detail-type]')
      if (detailTarget) showDetailFromTarget(detailTarget, true)
    }

    const onRootFocusOut = (event: Event) => {
      const target = (event.target as HTMLElement)
      const glossTarget = target.closest('.sha1-glossary-term')
      if (glossTarget) hideGlossary()
    }

    const onScroll = () => hideGlossary()
    const onResize = () => {
      hideGlossary()
      if (state.currentDetailKey) refreshPinnedDetail()
    }
    const onDetailClose = () => closeDetail()
    const onDetailMouseLeave = () => {
      if (!state.pinnedDetail) refs.detailOverlay.classList.remove('visible')
    }

    refs.input.addEventListener('input', onInput)
    refs.honorsToggle.addEventListener('change', onHonorsChange)
    refs.sha256Stub.addEventListener('click', onStubClick)
    refs.scrollOverview.addEventListener('click', onScrollOverview)
    root.addEventListener('click', onRootClick)
    root.addEventListener('mouseover', onRootMouseOver)
    root.addEventListener('mouseout', onRootMouseOut)
    root.addEventListener('focusin', onRootFocusIn)
    root.addEventListener('focusout', onRootFocusOut)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    refs.detailClose.addEventListener('click', onDetailClose)
    refs.detailOverlay.addEventListener('mouseleave', onDetailMouseLeave)

    renderAll()

    return () => {
      refs.input.removeEventListener('input', onInput)
      refs.honorsToggle.removeEventListener('change', onHonorsChange)
      refs.sha256Stub.removeEventListener('click', onStubClick)
      refs.scrollOverview.removeEventListener('click', onScrollOverview)
      root.removeEventListener('click', onRootClick)
      root.removeEventListener('mouseover', onRootMouseOver)
      root.removeEventListener('mouseout', onRootMouseOut)
      root.removeEventListener('focusin', onRootFocusIn)
      root.removeEventListener('focusout', onRootFocusOut)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      refs.detailClose.removeEventListener('click', onDetailClose)
      refs.detailOverlay.removeEventListener('mouseleave', onDetailMouseLeave)
    }
  }, [])

  return (
    <main ref={rootRef} className="page sha1-explorer">
      <div className="container container--wide">
        <div className="sha1-backnav">
          <div className="sha1-toolbar">
            <div className="sha1-selector" role="tablist" aria-label="Hash selector">
              <button className="sha1-selector-btn active" role="tab" aria-selected="true">SHA-1</button>
              <button
                className="sha1-selector-btn"
                role="tab"
                aria-selected="false"
                aria-disabled="true"
                id="sha256Stub"
              >
                SHA-256 · coming next
              </button>
            </div>
            <label className="sha1-honors" htmlFor="honorsToggle">
              <input type="checkbox" id="honorsToggle" />
              <span className="sha1-honors-slider" aria-hidden="true" />
              <span>Honors Student</span>
            </label>
          </div>
        </div>

        <section className="panel sha1-hero">
          <div className="eyebrow">Cryptographic hashing</div>
          <h1 className="h1" id="heroTitle">
            Type text in the middle, then scroll. The same bits are traced all the way through SHA-1.
          </h1>
          <p className="lead">
            This page stays teaching-first by default. Turn on <strong>Honors Student</strong> at the top when
            you want the denser per-round grids. Hover any dotted term or any round tile for a
            plain-language explanation.
          </p>
          <div className="alert alert--warning" role="note">
            <strong>Teaching example, not a modern security recommendation.</strong> SHA-1 is historically
            important and very useful for learning how a hash function moves bits around, but newer designs
            such as SHA-256 are preferred for new security-sensitive uses.
          </div>

          <div className="sha1-input-banner">
            <div>
              <h2 className="h4">Put your input here</h2>
              <p className="muted">
                The field below is the center of the whole lesson. Change it, and every stage below
                recomputes immediately.
              </p>
            </div>
            <button className="btn btn--outline" id="scrollOverview" type="button">
              Start the walkthrough ↓
            </button>
          </div>

          <div className="sha1-hero-grid">
            <div className="sha1-input-panel">
              <label className="label" htmlFor="inputText">Your input text</label>
              <textarea
                id="inputText"
                className="textarea"
                spellCheck={false}
                defaultValue="git"
                rows={3}
              />
              <div className="sha1-preset-row" aria-label="Example inputs">
                <button className="sha1-preset-btn" type="button" data-preset="git">git</button>
                <button className="sha1-preset-btn" type="button" data-preset="abc">abc</button>
                <button className="sha1-preset-btn" type="button" data-preset="OpenAI">OpenAI</button>
                <button className="sha1-preset-btn" type="button" data-preset="hello world">hello world</button>
                <button
                  className="sha1-preset-btn"
                  type="button"
                  data-preset="The quick brown fox jumps over the lazy dog"
                >
                  quick brown fox
                </button>
              </div>
              <div className="sha1-metric-grid">
                <div className="sha1-metric-card">
                  <span className="label">UTF-8 bytes</span>
                  <strong id="heroByteCount">3</strong>
                </div>
                <div className="sha1-metric-card">
                  <span className="label">Original length</span>
                  <strong id="heroBitCount">24 bits</strong>
                </div>
                <div className="sha1-metric-card">
                  <span className="label">Prepared size</span>
                  <strong id="heroPreparedBits">512 bits</strong>
                </div>
                <div className="sha1-metric-card">
                  <span className="label">512-bit chunks</span>
                  <strong id="heroChunkCount">1</strong>
                </div>
              </div>
              <div className="sha1-hash-preview" aria-live="polite">
                <span className="label">SHA-1 fingerprint (160 bits)</span>
                <code id="heroHash">00000000 00000000 00000000 00000000 00000000</code>
              </div>
            </div>

            <div className="sha1-hero-side">
              <div className="sha1-rule-grid">
                <div className="sha1-rule-card">
                  <div className="sha1-rule-title">
                    <span className="sha1-rule-icon">↺</span>
                    <span className="sha1-glossary-term" tabIndex={0} data-term="deterministic">Deterministic</span>
                  </div>
                  <p>The same input always produces the same fingerprint. There is no randomness inside the recipe.</p>
                </div>
                <div className="sha1-rule-card">
                  <div className="sha1-rule-title"><span className="sha1-rule-icon">⚡</span>Fast to compute</div>
                  <p>A hash function should be quick to run so software can check lots of data without much delay.</p>
                </div>
                <div className="sha1-rule-card">
                  <div className="sha1-rule-title">
                    <span className="sha1-rule-icon">↩</span>
                    <span className="sha1-glossary-term" tabIndex={0} data-term="oneway">One-way</span>
                  </div>
                  <p>Given only the output fingerprint, it should be impractical to work backward and recover the original input.</p>
                </div>
                <div className="sha1-rule-card">
                  <div className="sha1-rule-title">
                    <span className="sha1-rule-icon">✸</span>
                    <span className="sha1-glossary-term" tabIndex={0} data-term="avalanche">Avalanche effect</span>
                  </div>
                  <p>A tiny input change should spread widely so the final fingerprint looks unrelated to the old one.</p>
                </div>
                <div className="sha1-rule-card">
                  <div className="sha1-rule-title">
                    <span className="sha1-rule-icon">◎</span>
                    <span className="sha1-glossary-term" tabIndex={0} data-term="fixedsize">Fixed-size output</span>
                  </div>
                  <p>Whether the input is short or long, SHA-1 always finishes with the same 160-bit output length.</p>
                </div>
                <div className="sha1-rule-card">
                  <div className="sha1-rule-title">
                    <span className="sha1-rule-icon">≠</span>
                    <span className="sha1-glossary-term" tabIndex={0} data-term="collision">Collision resistance</span>
                  </div>
                  <p>This is a design goal for secure hash functions. SHA-1 is no longer trusted here for modern high-security uses.</p>
                </div>
              </div>

              <div className="sha1-legend-panel">
                <h3 className="h6">Color key for the walkthrough</h3>
                <div className="sha1-legend-grid">
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--encode)' }} />Representation</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--padding)' }} />Padding and length</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--chunk)' }} />512-bit chunks</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--schedule)' }} />80 round values</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--phase0)' }} />Rounds 0-19</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--phase1)' }} />Rounds 20-39</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--phase2)' }} />Rounds 40-59</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--phase3)' }} />Rounds 60-79</div>
                  <div className="sha1-legend-item"><span className="sha1-legend-swatch" style={{ background: 'var(--final)' }} />Final fingerprint</div>
                </div>
              </div>
            </div>
          </div>

          <div className="sha1-scroll-prompt">
            <span className="sha1-scroll-arrow">↓</span>
            Scroll down to elaborate the process layer by layer
          </div>
        </section>

        <div className="sha1-content">
          <div className="panel sha1-chunk-toolbar hidden" id="chunkToolbar">
            <div className="sha1-chunk-toolbar-header">
              <div>
                <h3 className="h6">Chunk selector for the detailed middle stages</h3>
                <p className="muted">
                  When the prepared input needs more than one 512-bit chunk, pick which chunk you want the
                  detailed middle views to show.
                </p>
              </div>
              <div className="mono" id="chunkToolbarSummary" />
            </div>
            <div className="sha1-chunk-pill-row" id="chunkToolbarButtons" />
          </div>

          {renderStage({
            id: 'stage-overview',
            accent: 'var(--encode)',
            kicker: '1 · High-level overview',
            title: 'The whole path, before the dense details',
            body: (
              <>
                <p>
                  A <span className="sha1-glossary-term" tabIndex={0} data-term="hash">cryptographic hash function</span> turns an input into a fixed-size output fingerprint. For SHA-1, that fingerprint is always 160 bits long.
                </p>
                <p>The idea stays simple even though the inner machinery is exact:</p>
                <ul>
                  <li>Turn the text into bytes and bits.</li>
                  <li>Add <span className="sha1-glossary-term" tabIndex={0} data-term="padding">padding</span> so the total length fits the recipe.</li>
                  <li>Split the prepared bits into 512-bit <span className="sha1-glossary-term" tabIndex={0} data-term="chunk">chunks</span>.</li>
                  <li>Grow each chunk from 16 starting 32-bit <span className="sha1-glossary-term" tabIndex={0} data-term="lane">lanes</span> into 80 round values.</li>
                  <li>Run 80 <span className="sha1-glossary-term" tabIndex={0} data-term="round">rounds</span> in four color-coded sections.</li>
                  <li>Write the final five 32-bit words together to form the 160-bit fingerprint.</li>
                </ul>
                <div className="sha1-note">
                  <strong>Default view:</strong> the page starts with the big phases.{' '}
                  <strong>Honors Student:</strong> turn it on to reveal dense per-round grids and a full
                  80-value schedule grid wherever those details would help.
                </div>
              </>
            ),
            visualId: 'overviewVisual',
          })}

          {renderStage({
            id: 'stage-bytes',
            accent: 'var(--encode)',
            kicker: '2 · Text becomes bits',
            title: 'SHA-1 hashes bytes, not letters',
            body: (
              <>
                <p>
                  The text you typed is first turned into bytes using{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="utf8">UTF-8</span>. Each{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="byte">byte</span> is 8 bits.
                  Only after that does SHA-1 begin its own work.
                </p>
                <p>
                  This matters because one visible character is not always one byte. Plain ASCII letters
                  often take one byte each, but other characters can take more. The recipe always follows
                  the bytes, not your visual intuition.
                </p>
                <div className="sha1-note">
                  <strong>Try this:</strong> enter an emoji or a character from another language. The byte
                  count may grow faster than the character count.
                </div>
              </>
            ),
            visualId: 'bytesVisual',
          })}

          {renderStage({
            id: 'stage-padding',
            accent: 'var(--padding)',
            kicker: '3 · Length-aware padding',
            title: 'Before the mixing starts, SHA-1 marks the end and records the original length',
            body: (
              <>
                <p>
                  SHA-1 appends one <strong>1</strong> bit, then enough <strong>0</strong> bits to leave
                  exactly 64 bits free at the end. Those final 64 bits store the original length as a{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="bigendian">big-endian</span> number.
                </p>
                <p>
                  That means the same visible letters arranged with a different length history cannot
                  quietly sneak into the same prepared bit pattern. The length is part of the story.
                </p>
                <div className="sha1-note">
                  <strong>Keep in mind:</strong> the single byte <code className="mono">10000000</code> is
                  how this page begins the padding in byte-oriented form. That one byte contains the
                  required first <strong>1</strong> bit and then seven <strong>0</strong> bits.
                </div>
              </>
            ),
            visualId: 'paddingVisual',
          })}

          {renderStage({
            id: 'stage-chunks',
            accent: 'var(--chunk)',
            kicker: '4 · 512-bit chunks',
            title: 'The prepared bit stream is sliced into fixed-size chunks',
            body: (
              <>
                <p>
                  Once the padding is added, the message is cut into 512-bit{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="chunk">chunks</span>. Each
                  chunk becomes the unit SHA-1 processes through its 80 rounds.
                </p>
                <p>
                  Inside one chunk, the 512 bits are read as sixteen 32-bit{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="lane">lanes</span>. Those
                  sixteen lanes are only the start: the next stage stretches them into eighty round values.
                </p>
                <div className="sha1-note">
                  <strong>If you entered a longer input:</strong> use the chunk selector that appears
                  above the middle stages to inspect one chunk at a time.
                </div>
              </>
            ),
            visualId: 'chunksVisual',
          })}

          {renderStage({
            id: 'stage-schedule',
            accent: 'var(--schedule)',
            kicker: '5 · 80 round values',
            title: 'Sixteen starting lanes are expanded into eighty round values',
            body: (
              <>
                <p>
                  SHA-1 needs one 32-bit value for each round. The first sixteen come directly from the
                  chunk. Every later value is built from earlier ones using{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="xor">XOR</span> and{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="rotate">rotate left</span>.
                </p>
                <p>
                  That recycling step helps bits from earlier positions keep influencing later rounds. It
                  is one reason a small local change can spread so widely.
                </p>
                <div className="sha1-note">
                  <strong>Hover detail:</strong> in Honors Student mode, every value cell becomes
                  hoverable so you can inspect exactly which earlier values were combined to make it.
                </div>
              </>
            ),
            visualId: 'scheduleVisual',
          })}

          {renderStage({
            id: 'stage-rounds-0',
            accent: 'var(--phase0)',
            kicker: '6 · Rounds 0-19',
            title: 'The first 20 rounds use a “choose” rule',
            body: (
              <>
                <p>
                  In this section, one working value acts like a selector: each bit of <strong>B</strong>{' '}
                  chooses whether the matching output bit comes from <strong>C</strong> or from{' '}
                  <strong>D</strong>. This is often called the{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="choose">choose rule</span>.
                </p>
                <p>
                  Each round also spins <strong>A</strong> left by 5 bits, adds the current round value{' '}
                  <strong>W[t]</strong>, adds a fixed{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="constant">constant</span>{' '}
                  <strong>K</strong>, and then shifts the five temporary values forward.
                </p>
                <div className="sha1-note">
                  <strong>Read the colors:</strong> every round section below uses a different accent
                  color because the mixing rule or section constant changes.
                </div>
              </>
            ),
            visualId: 'phase0Visual',
          })}

          {renderStage({
            id: 'stage-rounds-1',
            accent: 'var(--phase1)',
            kicker: '7 · Rounds 20-39',
            title: 'The next 20 rounds switch to XOR mixing',
            body: (
              <>
                <p>
                  Here the section rule becomes simply <strong>B XOR C XOR D</strong>. At each bit
                  position, the result is <strong>1</strong> when an odd number of those input bits are{' '}
                  <strong>1</strong>.
                </p>
                <p>
                  The overall round recipe stays the same. What changes is the section rule and the
                  baked-in{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="constant">constant</span>{' '}
                  <strong>K</strong>. That gives the second 20-round stretch a different mixing rhythm.
                </p>
                <div className="sha1-note">
                  <strong>Hover a tile:</strong> the overlay shows the actual values for one chosen round
                  from your current input.
                </div>
              </>
            ),
            visualId: 'phase1Visual',
          })}

          {renderStage({
            id: 'stage-rounds-2',
            accent: 'var(--phase2)',
            kicker: '8 · Rounds 40-59',
            title: 'The third 20-round stretch uses a majority rule',
            body: (
              <>
                <p>
                  This time the round rule asks which bit value appears in at least two of{' '}
                  <strong>B</strong>, <strong>C</strong>, and <strong>D</strong>. If two or three of them
                  agree on <strong>1</strong>, the output bit is <strong>1</strong>. Otherwise it is{' '}
                  <strong>0</strong>.
                </p>
                <p>
                  That is why this stage is often called a{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="majority">majority</span>{' '}
                  mix. It rewards agreement between the three inputs bit by bit.
                </p>
                <div className="sha1-note">
                  <strong>What stays the same:</strong> five temporary values keep cycling forward every
                  round. Only the section rule and section constant change.
                </div>
              </>
            ),
            visualId: 'phase2Visual',
          })}

          {renderStage({
            id: 'stage-rounds-3',
            accent: 'var(--phase3)',
            kicker: '9 · Rounds 60-79',
            title: 'The last 20 rounds return to XOR, but with a new constant',
            body: (
              <>
                <p>
                  The rule becomes XOR again, yet the section{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="constant">constant</span>{' '}
                  changes one last time. By now the original input bits have already been pulled through
                  many rotations, additions, and reuses of earlier round values.
                </p>
                <p>
                  These last rounds keep stirring the state before SHA-1 folds the results back into its
                  running total.
                </p>
                <div className="sha1-note">
                  <strong>Honors Student:</strong> the dense grid below contains all 20 rounds for this
                  final section, so the full page covers all 80 rounds in four compact grids.
                </div>
              </>
            ),
            visualId: 'phase3Visual',
          })}

          {renderStage({
            id: 'stage-final',
            accent: 'var(--final)',
            kicker: '10 · Final 160-bit fingerprint',
            title: 'Five final 32-bit words are written together',
            body: (
              <>
                <p>
                  After one{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="chunk">chunk</span> finishes
                  its 80 rounds, the five temporary values are added back into the running total. If
                  there is another chunk, the updated total becomes the starting point for the next one.
                </p>
                <p>
                  After the last chunk, SHA-1 writes five 32-bit words together. That is the final
                  160-bit fingerprint you see near the top of the page.
                </p>
                <div className="sha1-note">
                  <strong>Important contrast:</strong> input length can vary, but output length does not.
                  SHA-1 always finishes with 160 bits.
                </div>
              </>
            ),
            visualId: 'finalVisual',
          })}

          {renderStage({
            id: 'stage-avalanche',
            accent: 'var(--phase3)',
            kicker: '11 · Avalanche',
            title: 'Flip one input bit and watch the output change almost everywhere',
            body: (
              <>
                <p>
                  To demonstrate the{' '}
                  <span className="sha1-glossary-term" tabIndex={0} data-term="avalanche">avalanche effect</span>,
                  this section compares your current input with a version where just one bit in the last
                  byte has been flipped.
                </p>
                <p>
                  The output should not look like a small local edit. A good hash function spreads that
                  tiny change widely across the final 160-bit fingerprint.
                </p>
                <div className="sha1-note">
                  <strong>If your current input is empty:</strong> the demo uses a one-byte comparison
                  instead, because an empty input has no existing byte in which to flip a bit.
                </div>
              </>
            ),
            visualId: 'avalancheVisual',
          })}

          {renderStage({
            id: 'stage-verification',
            accent: 'var(--chunk)',
            kicker: '12 · Verification idea',
            title: 'Why a fingerprint helps with integrity checks',
            body: (
              <>
                <p>
                  If a tool stores a fingerprint next to some content, it can later recompute the
                  fingerprint and compare the two. Same content means the same fingerprint. Changed
                  content means a different fingerprint.
                </p>
                <p>
                  This is the basic idea behind content verification and why systems like Git found hash
                  fingerprints so useful. We do not need bigger vocabulary yet: matching content gives a
                  matching fingerprint, and changed content does not.
                </p>
                <div className="sha1-note">
                  <strong>The key harmony:</strong> deterministic behavior makes repeat checks possible,
                  and avalanche behavior makes even small changes stand out clearly.
                </div>
              </>
            ),
            visualId: 'verificationVisual',
          })}
        </div>

        <div className="panel sha1-footer-note">
          <h3 className="h5">Why this page teaches with SHA-1 first</h3>
          <p className="muted">
            SHA-1 is compact enough that you can inspect all 80 rounds without the page collapsing into
            noise. That makes it useful for teaching the inner mechanics of a hash function, even though
            modern security-sensitive systems now prefer stronger choices such as SHA-256 or SHA-3.
          </p>
        </div>
      </div>

      <div className="sha1-tooltip" id="glossaryTooltip" role="tooltip" aria-hidden="true" />

      <aside
        className="sha1-detail-overlay"
        id="detailOverlay"
        aria-live="polite"
        aria-label="Hover detail panel"
      >
        <div className="sha1-detail-header">
          <div className="sha1-detail-title-wrap">
            <div className="sha1-detail-badge" id="detailBadge">
              <span className="sha1-detail-badge-dot" />
              <span id="detailBadgeText">Detail</span>
            </div>
            <h3 className="sha1-detail-title" id="detailTitle">Hover a round tile or value cell</h3>
            <p className="sha1-detail-subtitle" id="detailSubtitle">
              This overlay will explain one specific step using your current input.
            </p>
          </div>
          <button className="sha1-detail-close" id="detailClose" aria-label="Close detail panel" type="button">
            ×
          </button>
        </div>
        <div className="sha1-detail-animation" id="detailAnimation">
          <div className="sha1-chip-stream" id="detailChipStream" />
          <div className="sha1-detail-footnote" id="detailFlowText">
            Move your pointer over a tile to inspect that exact step.
          </div>
        </div>
        <div className="sha1-detail-metrics" id="detailMetrics" />
        <div className="sha1-detail-footnote" id="detailFootnote">
          Tip: click a tile to pin this panel open while you read it.
        </div>
      </aside>
    </main>
  )
}

type StageProps = {
  id: string
  accent: string
  kicker: string
  title: string
  body: ReactNode
  visualId: string
}

function renderStage({ id, accent, kicker, title, body, visualId }: StageProps) {
  return (
    <section
      key={id}
      className="panel sha1-stage"
      id={id}
      style={{ ['--accent' as string]: accent } as CSSProperties}
    >
      <div className="sha1-stage-shell">
        <div className="sha1-stage-copy">
          <div className="eyebrow sha1-kicker">{kicker}</div>
          <h2 className="h3">{title}</h2>
          {body}
        </div>
        <div className="sha1-stage-visual" id={visualId} />
      </div>
    </section>
  )
}
