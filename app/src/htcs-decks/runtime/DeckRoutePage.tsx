import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import DeckPresenter from './DeckPresenter'
import DeckScreen from './DeckScreen'
import {
  createSlideSyncMessage,
  isDeckSyncMessage,
  type PresenterNavDirection,
} from './presenterSync'
import type { DeckDefinition, DeckRenderMode } from './types'

type DeckRoutePageProps = {
  deck: DeckDefinition
  basePath: string
  backTo?: string
}

const barLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  font: 'inherit',
  padding: '0 2px',
}

const barButtonStyle = {
  appearance: 'none' as const,
  border: 0,
  background: 'transparent',
  color: '#fff',
  font: 'inherit',
  cursor: 'pointer',
  padding: '0 2px',
}

function readMode(raw: string | null): DeckRenderMode {
  return raw === 'static' ? 'static' : 'interactive'
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function applyNav(current: number, total: number, dir: PresenterNavDirection) {
  const max = Math.max(total - 1, 0)
  if (dir === 'prev') return clamp(current - 1, 0, max)
  if (dir === 'next') return clamp(current + 1, 0, max)
  if (dir === 'first') return 0
  return max
}

function readInitialIndex(slideParam: number, total: number, storageKey: string) {
  if (Number.isFinite(slideParam) && slideParam > 0) {
    return clamp(slideParam - 1, 0, Math.max(total - 1, 0))
  }

  try {
    const saved = Number(window.localStorage.getItem(storageKey))
    if (!Number.isNaN(saved)) return clamp(saved, 0, Math.max(total - 1, 0))
  } catch (_) {
    // Ignore localStorage failures.
  }

  return 0
}

export default function DeckRoutePage({
  deck,
  basePath,
  backTo = '/code/htcs-lessons',
}: DeckRoutePageProps) {
  const [searchParams] = useSearchParams()
  const inPresenter = searchParams.has('presenter')
  const mode = readMode(searchParams.get('mode'))
  const slideParam = Number(searchParams.get('slide'))
  const storageKey = `htcs-deck:${deck.id}`
  const channelName = `htcs-deck:${deck.id}:presenter`
  const total = deck.slides.length

  const [index, setIndex] = useState(() => readInitialIndex(slideParam, total, storageKey))
  const [hint, setHint] = useState('')
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (inPresenter) return
    setIndex(readInitialIndex(slideParam, total, storageKey))
  }, [inPresenter, slideParam, storageKey, total])

  useEffect(() => {
    if (inPresenter) return
    const previousTitle = document.title
    document.title = `${deck.meta.deckTitle} · React Deck`
    return () => {
      document.title = previousTitle
    }
  }, [deck.meta.deckTitle, inPresenter])

  useEffect(() => {
    if (inPresenter || mode !== 'interactive') return

    const postCurrentSlide = (target?: BroadcastChannel | Window | null) => {
      const message = createSlideSyncMessage(deck.id, index, total)
      if (target instanceof BroadcastChannel) target.postMessage(message)
      else if (target) {
        try {
          target.postMessage(message, '*')
        } catch (_) {
          // Ignore popup messaging failures.
        }
      } else {
        channelRef.current?.postMessage(message)
      }
    }

    let channel: BroadcastChannel | null = null
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(channelName)
      channel.onmessage = (event) => {
        const message = event.data
        if (!isDeckSyncMessage(message, deck.id)) return
        if (message.type === 'presenter-ready') postCurrentSlide(channel)
        else if (message.type === 'nav') setIndex((current) => applyNav(current, total, message.dir))
      }
      channelRef.current = channel
    }

    const onWindowMessage = (event: MessageEvent) => {
      if (!isDeckSyncMessage(event.data, deck.id)) return
      if (event.data.type === 'presenter-ready') {
        const source = event.source
        if (source && 'postMessage' in source) postCurrentSlide(source as Window)
      } else if (event.data.type === 'nav') {
        setIndex((current) => applyNav(current, total, event.data.dir))
      }
    }

    window.addEventListener('message', onWindowMessage)
    postCurrentSlide()

    return () => {
      window.removeEventListener('message', onWindowMessage)
      channel?.close()
      if (channelRef.current === channel) channelRef.current = null
    }
  }, [channelName, deck.id, inPresenter, index, mode, total])

  useEffect(() => {
    if (!hint) return
    const timer = window.setTimeout(() => setHint(''), 2200)
    return () => window.clearTimeout(timer)
  }, [hint])

  const openPresenter = useCallback(() => {
    const popup = window.open(
      `${basePath}?presenter=1`,
      `htcs-presenter-${deck.id}`,
      'popup=yes,width=1100,height=820,menubar=no,toolbar=no,location=no,status=no',
    )

    if (!popup) {
      setHint('Allow popups to use presenter mode (P).')
      return
    }

    try {
      popup.focus()
    } catch (_) {
      // Ignore focus failures.
    }
  }, [basePath, deck.id])

  useEffect(() => {
    if (inPresenter || mode !== 'interactive') return

    const onKeydown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        openPresenter()
      }
    }

    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [inPresenter, mode, openPresenter])

  const toggleHref = mode === 'interactive' ? `${basePath}?mode=static` : basePath

  if (inPresenter) {
    return <DeckPresenter deck={deck} storageKey={storageKey} channelName={channelName} />
  }

  return (
    <DeckScreen
      deck={deck}
      mode={mode}
      storageKey={storageKey}
      currentIndex={index}
      onIndexChange={setIndex}
      overlayLeadingControls={
        <Link to={backTo} style={barLinkStyle}>
          Back to Lessons
        </Link>
      }
      overlayInlineControls={
        mode === 'interactive' ? (
          <button type="button" onClick={openPresenter} style={barButtonStyle}>
            Presenter(P)
          </button>
        ) : null
      }
      overlayTrailingControls={
        <Link to={toggleHref} style={barLinkStyle}>
          {mode === 'interactive' ? 'Static Preview' : 'Interactive Preview'}
        </Link>
      }
      chrome={hint ? (
        <div
          style={{
            position: 'fixed',
            top: 18,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 16px',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif',
            fontSize: 13,
            pointerEvents: 'none',
            zIndex: 40,
          }}
        >
          {hint}
        </div>
      ) : null}
    />
  )
}
