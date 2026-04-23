import { useEffect, useMemo, useRef, useState } from 'react'
import type { DeckDefinition } from './types'
import {
  createPresenterNavMessage,
  createPresenterReadyMessage,
  isDeckSyncMessage,
  type PresenterNavDirection,
} from './presenterSync'

type DeckPresenterProps = {
  deck: DeckDefinition
  storageKey?: string
  channelName?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function DeckPresenter({
  deck,
  storageKey = `htcs-deck:${deck.id}`,
  channelName = `htcs-deck:${deck.id}:presenter`,
}: DeckPresenterProps) {
  const [index, setIndex] = useState(0)
  const [total, setTotal] = useState(Math.max(deck.slides.length, 1))
  const [status, setStatus] = useState('Waiting for the audience deck to connect…')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const timerStartRef = useRef(0)
  const timerAccumRef = useRef(0)

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${deck.meta.deckTitle} — Presenter`
    return () => {
      document.title = previousTitle
    }
  }, [deck.meta.deckTitle])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      const next = raw == null ? 0 : Number.parseInt(raw, 10)
      if (Number.isFinite(next)) setIndex(clamp(next, 0, Math.max(deck.slides.length - 1, 0)))
    } catch (_) {
      // Ignore localStorage read failures.
    }
  }, [deck.slides.length, storageKey])

  useEffect(() => {
    let intervalId: number | null = null
    if (running) {
      timerStartRef.current = Date.now()
      intervalId = window.setInterval(() => {
        setElapsed(timerAccumRef.current + (Date.now() - timerStartRef.current))
      }, 250)
    }

    return () => {
      if (intervalId != null) window.clearInterval(intervalId)
    }
  }, [running])

  useEffect(() => {
    const handleMessage = (message: unknown) => {
      if (!isDeckSyncMessage(message, deck.id)) return
      if (message.type === 'slide') {
        setIndex(clamp(message.index, 0, Math.max(message.total - 1, 0)))
        setTotal(Math.max(message.total, 1))
        setStatus('')
      }
    }

    let channel: BroadcastChannel | null = null
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(channelName)
      channel.onmessage = (event) => handleMessage(event.data)
      channelRef.current = channel
    }

    const onWindowMessage = (event: MessageEvent) => {
      handleMessage(event.data)
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || event.newValue == null) return
      const next = Number.parseInt(event.newValue, 10)
      if (Number.isFinite(next)) {
        setIndex(clamp(next, 0, Math.max(deck.slides.length - 1, 0)))
        setStatus('')
      }
      announceReady()
    }

    const announceReady = () => {
      const ready = createPresenterReadyMessage(deck.id)
      channel?.postMessage(ready)
      if (window.opener && !window.opener.closed) {
        try { window.opener.postMessage(ready, '*') } catch (_) {}
      }
    }

    window.addEventListener('message', onWindowMessage)
    window.addEventListener('storage', onStorage)
    announceReady()
    window.setTimeout(announceReady, 250)

    return () => {
      window.removeEventListener('message', onWindowMessage)
      window.removeEventListener('storage', onStorage)
      channel?.close()
      if (channelRef.current === channel) channelRef.current = null
    }
  }, [channelName, deck.id, deck.slides.length, storageKey])

  const sendNav = (dir: PresenterNavDirection) => {
    const message = createPresenterNavMessage(deck.id, dir)
    channelRef.current?.postMessage(message)
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(message, '*')
        setStatus('')
        return
      } catch (_) {
        // Fall through to local status if opener messaging fails.
      }
    }

    if (!('BroadcastChannel' in window)) {
      setStatus('Audience deck not reachable — open the audience deck and press P to link it.')
    }
  }

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const key = event.key
      if (key === 'ArrowRight' || key === 'PageDown') {
        event.preventDefault()
        sendNav('next')
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        event.preventDefault()
        sendNav('prev')
      } else if (key === 'Home') {
        event.preventDefault()
        sendNav('first')
      } else if (key === 'End') {
        event.preventDefault()
        sendNav('last')
      } else if (key === ' ' || key === 'Spacebar') {
        event.preventDefault()
        if (running) {
          timerAccumRef.current += Date.now() - timerStartRef.current
          setElapsed(timerAccumRef.current)
          setRunning(false)
        } else {
          setRunning(true)
        }
      } else if (key === 'r' || key === 'R') {
        event.preventDefault()
        timerAccumRef.current = 0
        if (running) timerStartRef.current = Date.now()
        setElapsed(0)
        if (!running) setRunning(false)
      }
    }

    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [deck.id, running])

  const currentNote = useMemo(() => {
    const raw = deck.speakerNotes[index]
    return raw && raw.trim() ? raw : '(no notes for this slide)'
  }, [deck.speakerNotes, index])

  const nextNote = useMemo(() => {
    const raw = deck.speakerNotes[index + 1]
    if (raw && raw.trim()) return raw
    if (index + 1 >= total) return '(end of deck)'
    return '(no notes for next slide)'
  }, [deck.speakerNotes, index, total])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0c0e',
        color: '#f5f3ee',
        padding: '24px clamp(20px, 4vw, 56px) 28px',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto auto auto',
        gap: 16,
        fontFamily: '"Source Serif 4", Georgia, serif',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>
          {deck.meta.deckTitle} · Presenter
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFeatureSettings: '"tnum" 1' }}>
          <div style={{ fontSize: 15, opacity: 0.85 }}>
            Slide <b>{index + 1}</b> / <span>{total}</span>
          </div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 22,
              background: '#1a1a1f',
              padding: '6px 12px',
              minWidth: 92,
              textAlign: 'center',
            }}
          >
            {formatElapsed(elapsed)}
          </div>
          <button
            type="button"
            onClick={() => {
              if (running) {
                timerAccumRef.current += Date.now() - timerStartRef.current
                setElapsed(timerAccumRef.current)
                setRunning(false)
              } else {
                timerStartRef.current = Date.now()
                setRunning(true)
              }
            }}
            style={{
              fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif',
              fontSize: 12,
              letterSpacing: '0.04em',
              background: '#1a1a1f',
              color: '#f5f3ee',
              border: '1px solid #2a2a31',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            {running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Start'}
          </button>
          <button
            type="button"
            onClick={() => {
              timerAccumRef.current = 0
              if (running) timerStartRef.current = Date.now()
              setElapsed(0)
            }}
            style={{
              fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif',
              fontSize: 12,
              letterSpacing: '0.04em',
              background: '#1a1a1f',
              color: '#f5f3ee',
              border: '1px solid #2a2a31',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <section
        style={{
          background: '#14141a',
          padding: 'clamp(20px, 3vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{ fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55 }}>
          Now speaking
        </div>
        <div style={{ fontSize: 'clamp(22px, 2.4vw, 34px)', lineHeight: 1.45, overflowY: 'auto', paddingRight: 8 }}>
          {currentNote}
        </div>
      </section>

      <section style={{ background: '#101015', padding: '18px clamp(18px, 3vw, 30px)', opacity: 0.62, maxHeight: '22vh', overflow: 'hidden' }}>
        <div style={{ fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55 }}>
          Up next
        </div>
        <div style={{ fontSize: 'clamp(14px, 1.2vw, 18px)', lineHeight: 1.45, marginTop: 8 }}>
          {nextNote}
        </div>
      </section>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif' }}>
        {[
          ['first', '⏮ First'],
          ['prev', '◀ Prev'],
          ['next', 'Next ▶'],
          ['last', 'Last ⏭'],
        ].map(([dir, label]) => (
          <button
            key={dir}
            type="button"
            onClick={() => sendNav(dir as PresenterNavDirection)}
            style={{
              fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif',
              fontSize: 14,
              background: '#1a1a1f',
              color: '#f5f3ee',
              border: '1px solid #2a2a31',
              padding: '10px 22px',
              cursor: 'pointer',
              minWidth: 130,
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={{ textAlign: 'center', fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif', fontSize: 12, opacity: 0.5, minHeight: '1em' }}>
        {status}
      </div>
    </div>
  )
}
