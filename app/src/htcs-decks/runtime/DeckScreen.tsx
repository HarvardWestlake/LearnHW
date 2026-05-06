import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { DeckMetaContext, DeckRenderModeContext } from './context'
import type { DeckDefinition, DeckRenderMode } from './types'

const DESIGN_W_DEFAULT = 1920
const DESIGN_H_DEFAULT = 1080
const DECK_FONT_HREF = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
const OVERLAY_HIDE_MS = 1800
const FOOTER_HOVER_HEIGHT = 120

type DeckScreenProps = {
  deck: DeckDefinition
  mode?: DeckRenderMode
  storageKey?: string
  initialSlide?: number
  currentIndex?: number
  onIndexChange?: (index: number) => void
  chrome?: ReactNode
  overlayLeadingControls?: ReactNode
  overlayInlineControls?: ReactNode
  overlayTrailingControls?: ReactNode
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function overlayButtonStyle(): CSSProperties {
  return {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    color: '#fff',
    font: 'inherit',
    cursor: 'pointer',
    padding: '0 2px',
  }
}

function overlayPillStyle(): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.86)',
    color: '#fff',
    borderRadius: 999,
    fontFamily: '"Inter Tight", Helvetica, Arial, sans-serif',
    fontSize: 13,
    letterSpacing: '0.02em',
  }
}

export default function DeckScreen({
  deck,
  mode = 'interactive',
  storageKey = `htcs-deck:${deck.id}`,
  initialSlide,
  currentIndex,
  onIndexChange,
  chrome,
  overlayLeadingControls,
  overlayInlineControls,
  overlayTrailingControls,
}: DeckScreenProps) {
  const designWidth = deck.designWidth || DESIGN_W_DEFAULT
  const designHeight = deck.designHeight || DESIGN_H_DEFAULT
  const maxIndex = Math.max(deck.slides.length - 1, 0)
  const [internalIndex, setInternalIndex] = useState(() => clamp(initialSlide ?? 0, 0, maxIndex))
  const [footerHoverActive, setFooterHoverActive] = useState(false)
  const [shortcutOverlayVisible, setShortcutOverlayVisible] = useState(false)
  const [supportsFooterHover] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))
  const hideTimerRef = useRef<number | null>(null)
  const index = clamp(currentIndex ?? internalIndex, 0, maxIndex)
  const overlayVisible = !supportsFooterHover || footerHoverActive || shortcutOverlayVisible

  const goTo = (nextIndex: number) => {
    const clamped = clamp(nextIndex, 0, maxIndex)
    if (currentIndex == null) setInternalIndex(clamped)
    onIndexChange?.(clamped)
  }

  const flashOverlay = useCallback(() => {
    setShortcutOverlayVisible(true)
    if (hideTimerRef.current != null) window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      setShortcutOverlayVisible(false)
      hideTimerRef.current = null
    }, OVERLAY_HIDE_MS)
  }, [])

  useEffect(() => {
    if (document.head.querySelector('link[data-htcs-deck-fonts]')) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = DECK_FONT_HREF
    link.setAttribute('data-htcs-deck-fonts', 'true')
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (deck.speakerNotes.length !== deck.slides.length) {
      console.warn(`[htcs-decks] ${deck.id} has ${deck.slides.length} slides but ${deck.speakerNotes.length} speaker notes.`)
    }
  }, [deck.id, deck.slides.length, deck.speakerNotes.length])

  useEffect(() => {
    if (currentIndex != null) return
    if (typeof initialSlide === 'number') {
      setInternalIndex(clamp(initialSlide, 0, maxIndex))
      return
    }

    try {
      const saved = Number(window.localStorage.getItem(storageKey))
      if (!Number.isNaN(saved)) {
        setInternalIndex(clamp(saved, 0, maxIndex))
      }
    } catch (_) {
      // Ignore localStorage errors in private browsing or restricted contexts.
    }
  }, [currentIndex, initialSlide, maxIndex, storageKey])

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, String(index))
    } catch (_) {
      // Ignore localStorage errors.
    }
  }, [index, storageKey])

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!supportsFooterHover) return

    const onMouseMove = (event: MouseEvent) => {
      setFooterHoverActive(event.clientY >= window.innerHeight - FOOTER_HOVER_HEIGHT)
    }

    const onMouseLeave = () => {
      setFooterHoverActive(false)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }
  }, [supportsFooterHover])

  useEffect(() => {
    return () => {
      if (hideTimerRef.current != null) {
        window.clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const keyLower = event.key.toLowerCase()

      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ' || event.key === 'Spacebar') {
        goTo(index + 1)
        event.preventDefault()
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        goTo(index - 1)
        event.preventDefault()
      } else if (event.key === 'Home' || keyLower === 'r') {
        goTo(0)
        if (keyLower === 'r') flashOverlay()
        event.preventDefault()
      } else if (event.key === 'End') {
        goTo(maxIndex)
        event.preventDefault()
      } else if (keyLower === 'p') {
        flashOverlay()
      }
    }

    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [flashOverlay, goTo, index, maxIndex])

  const scale = useMemo(
    () => Math.min(viewport.width / designWidth, viewport.height / designHeight),
    [designHeight, designWidth, viewport.height, viewport.width],
  )

  return (
    <DeckMetaContext.Provider value={deck.meta}>
      <DeckRenderModeContext.Provider value={mode}>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: designWidth,
                height: designHeight,
                flexShrink: 0,
                background: '#fff',
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              {deck.slides.map(({ label, Component }, slideIndex) => {
                const active = slideIndex === index
                return (
                  <section
                    key={label}
                    data-label={label}
                    data-deck-active={active ? '' : undefined}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      opacity: active ? 1 : 0,
                      pointerEvents: active ? 'auto' : 'none',
                      visibility: active ? 'visible' : 'hidden',
                    }}
                  >
                    <Component />
                  </section>
                )
              })}
            </div>
          </div>

          {chrome}

          <div
            style={{
              position: 'fixed',
              left: '50%',
              bottom: 22,
              transform: overlayVisible ? 'translate(-50%, 0) scale(1)' : 'translate(-50%, 6px) scale(0.92)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: overlayVisible ? 1 : 0,
              filter: overlayVisible ? 'blur(0)' : 'blur(6px)',
              pointerEvents: overlayVisible ? 'auto' : 'none',
              transition: 'opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease',
              transformOrigin: 'center bottom',
              userSelect: 'none',
              zIndex: 30,
            }}
          >
            {overlayLeadingControls ? (
              <div style={overlayPillStyle()}>
                {overlayLeadingControls}
              </div>
            ) : null}
            <div style={overlayPillStyle()}>
              <button type="button" onClick={() => goTo(index - 1)} style={overlayButtonStyle()}>
                Prev
              </button>
              <span style={{ opacity: 0.55 }}>|</span>
              <span>
                {String(index + 1).padStart(2, '0')} / {String(deck.slides.length).padStart(2, '0')}
              </span>
              <span style={{ opacity: 0.55 }}>|</span>
              <button type="button" onClick={() => goTo(index + 1)} style={overlayButtonStyle()}>
                Next
              </button>
              <span style={{ opacity: 0.55 }}>|</span>
              <button type="button" onClick={() => goTo(0)} style={overlayButtonStyle()}>
                Reset(R)
              </button>
              {overlayInlineControls ? (
                <>
                  <span style={{ opacity: 0.55 }}>|</span>
                  {overlayInlineControls}
                </>
              ) : null}
            </div>
            {overlayTrailingControls ? (
              <div style={overlayPillStyle()}>
                {overlayTrailingControls}
              </div>
            ) : null}
          </div>
        </div>
      </DeckRenderModeContext.Provider>
    </DeckMetaContext.Provider>
  )
}
