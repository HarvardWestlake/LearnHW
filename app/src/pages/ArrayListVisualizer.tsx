import { useState, useRef, useCallback, useEffect } from 'react'
import { WidgetShell, OperationField, MetricsDisplay } from '../components/widget'

interface CellState {
  allocated: boolean
  filled: boolean
  value: string
  current: boolean
  copyActive: boolean
  bouncing: boolean
}

interface SleepHandle {
  timeoutId: ReturnType<typeof setTimeout>
  resolve: () => void
}

const BASELINE_COLS = 10
const BASELINE_ROWS = 5
const GROWTH_FACTOR = 2

const ENTER_ANIM_MS = 560
const EXIT_ANIM_MS = 450

const SPEED_OPTIONS = [
  { label: '0.5x', value: 1 },
  { label: '1x', value: 2 },
  { label: '1.5x', value: 3 },
  { label: '2x', value: 4 },
] as const

function makeCells(
  capacity: number,
  size: number,
  values: string[],
  currentIdx: number | null = null,
  copyActives: Set<number> = new Set(),
  bouncingIdx: number | null = null,
): CellState[] {
  const total = Math.max(BASELINE_COLS * BASELINE_ROWS, capacity)
  return Array.from({ length: total }, (_, i) => ({
    allocated: i < capacity,
    filled: i < size,
    value: i < size ? values[i] : '',
    current: i === currentIdx,
    copyActive: copyActives.has(i),
    bouncing: i === bouncingIdx,
  }))
}

interface MemoryGridProps {
  cells: CellState[]
  label: string
}

function MemoryGrid({ cells, label }: MemoryGridProps) {
  return (
    <div
      className="mem-grid al-memory-grid"
      style={{ '--mem-cols': BASELINE_COLS } as React.CSSProperties}
      aria-label={label}
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          style={{ '--cell-row': Math.floor(i / BASELINE_COLS) } as React.CSSProperties}
          className={[
            'mem-cell',
            cell.allocated ? 'mem-cell--allocated' : '',
            cell.filled ? 'mem-cell--filled' : '',
            cell.current ? 'mem-cell--current' : '',
            cell.copyActive ? 'mem-cell--copy' : '',
            cell.bouncing ? 'al-cell--bounce' : '',
          ].filter(Boolean).join(' ')}
        >
          <span className="al-cell__content">{cell.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ArrayListVisualizer() {
  const [cells, setCells] = useState<CellState[]>(() => makeCells(0, 0, []))
  const [newCells, setNewCells] = useState<CellState[] | null>(null)
  const [status, setStatus] = useState('Click "Create" to allocate capacity (cells turn red).')
  const [output, setOutput] = useState('')
  const [busy, setBusy] = useState(false)
  const [displaySize, setDisplaySize] = useState(0)
  const [displayCapacity, setDisplayCapacity] = useState(0)

  const [expandPhase, setExpandPhase] = useState<'entering' | 'copying' | 'exiting' | null>(null)

  const [showHowItWorks, setShowHowItWorks] = useState(false)

  const [initialCapacity, setInitialCapacity] = useState(10)
  const [addValue, setAddValue] = useState('')
  const [removeIndex, setRemoveIndex] = useState('')
  const [containsValue, setContainsValue] = useState('')
  const [speed, setSpeed] = useState(2)

  const opSeqRef = useRef(0)
  const sleepHandleRef = useRef<SleepHandle | null>(null)
  const busyRef = useRef(false)
  const stepsPerSecondRef = useRef(6)
  const vizState = useRef({ values: [] as string[], size: 0, capacity: 0 })

  const sleep = useCallback((ms: number) => new Promise<void>(resolve => {
    const id = setTimeout(() => {
      if (sleepHandleRef.current?.timeoutId === id) sleepHandleRef.current = null
      resolve()
    }, ms)
    sleepHandleRef.current = { timeoutId: id, resolve }
  }), [])

  const stepPause = useCallback(() =>
    sleep(Math.max(5, 1000 / stepsPerSecondRef.current)), [sleep])

  const shouldAbort = (opId: number) => opId !== opSeqRef.current

  const cancelCurrentSleep = useCallback(() => {
    if (sleepHandleRef.current) {
      clearTimeout(sleepHandleRef.current.timeoutId)
      sleepHandleRef.current.resolve()
      sleepHandleRef.current = null
    }
  }, [])

  const syncMetrics = useCallback(() => {
    setDisplaySize(vizState.current.size)
    setDisplayCapacity(vizState.current.capacity)
  }, [])

  const renderCells = useCallback((currentIdx: number | null = null, copyActives = new Set<number>()) => {
    const s = vizState.current
    setCells(makeCells(s.capacity, s.size, s.values, currentIdx, copyActives))
    syncMetrics()
  }, [syncMetrics])

  const setVisualBusy = useCallback((on: boolean) => {
    busyRef.current = on
    setBusy(on)
  }, [])

  const requestCancel = useCallback(() => {
    if (!busyRef.current) return
    opSeqRef.current += 1
    cancelCurrentSleep()
    renderCells()
    setNewCells(null)
    setExpandPhase(null)
    setStatus('Animation cancelled.')
  }, [cancelCurrentSleep, renderCells])

  const ensureCapacity = useCallback(async (targetSize: number, myOp: number): Promise<boolean> => {
    const s = vizState.current
    if (targetSize <= s.capacity) return true

    const oldCap = s.capacity
    let newCap = oldCap === 0 ? 1 : oldCap
    while (newCap < targetSize) newCap = Math.max(newCap * GROWTH_FACTOR, newCap + 1)

    const oldValues = s.values.slice(0, s.size)
    const oldSize = s.size

    setStatus(`Capacity ${oldCap} insufficient → resizing to ${newCap}...`)
    renderCells()

    setNewCells(makeCells(newCap, 0, []))
    setExpandPhase('entering')
    await sleep(ENTER_ANIM_MS)
    if (shouldAbort(myOp)) { setNewCells(null); setExpandPhase(null); return false }

    setExpandPhase('copying')

    setStatus(`Copying ${oldSize} element${oldSize !== 1 ? 's' : ''} into new array...`)
    for (let i = 0; i < oldSize; i++) {
      if (shouldAbort(myOp)) { setNewCells(null); setExpandPhase(null); return false }

      setCells(makeCells(s.capacity, s.size, s.values, null, new Set([i])))
      setNewCells(prev => prev ? prev.map((c, idx) => ({
        ...c, current: idx === i, copyActive: idx === i, bouncing: false,
      })) : prev)
      await stepPause()
      if (shouldAbort(myOp)) { setNewCells(null); setExpandPhase(null); return false }

      const partial = oldValues.slice(0, i + 1)
      setNewCells(makeCells(newCap, i + 1, partial, null, new Set(), i))
      setCells(makeCells(s.capacity, s.size, s.values))
      await stepPause()
      if (shouldAbort(myOp)) { setNewCells(null); setExpandPhase(null); return false }
    }

    setExpandPhase('exiting')
    await sleep(EXIT_ANIM_MS)
    if (shouldAbort(myOp)) { setNewCells(null); setExpandPhase(null); return false }

    s.capacity = newCap
    setNewCells(null)
    setExpandPhase(null)
    renderCells()
    if (!shouldAbort(myOp)) setStatus(`Resize complete. New capacity: ${newCap}.`)
    return true
  }, [renderCells, stepPause, sleep])

  const opCreate = useCallback(async () => {
    if (busyRef.current) return
    setVisualBusy(true)
    const myOp = ++opSeqRef.current
    const s = vizState.current
    s.values = []
    s.size = 0
    s.capacity = 0
    const cap = Math.max(1, initialCapacity)

    setCells(makeCells(0, 0, []))
    syncMetrics()
    setOutput('')
    setStatus(`Allocating backing array with capacity ${cap}...`)

    try {
      for (let i = 0; i < cap; i++) {
        s.capacity = i + 1
        setCells(makeCells(s.capacity, s.size, s.values, i))
        syncMetrics()
        await stepPause()
        if (shouldAbort(myOp)) return
      }
      renderCells()
      setStatus('ArrayList created.')
    } finally {
      setVisualBusy(false)
    }
  }, [initialCapacity, setVisualBusy, syncMetrics, stepPause, renderCells])

  const opAdd = useCallback(async () => {
    if (busyRef.current) return
    setVisualBusy(true)
    const myOp = ++opSeqRef.current
    const s = vizState.current

    try {
      if (s.capacity === 0) { setStatus('Create the ArrayList first.'); return }
      const val = addValue.trim() !== '' ? addValue : String(s.size)

      const ok = await ensureCapacity(s.size + 1, myOp)
      if (!ok || shouldAbort(myOp)) return

      setStatus(`add(${JSON.stringify(val)}) at index ${s.size}`)
      setCells(makeCells(s.capacity, s.size, s.values, s.size))
      await stepPause()
      if (shouldAbort(myOp)) { renderCells(); return }

      s.values[s.size] = val
      s.size += 1
      renderCells()
      await stepPause()
      if (shouldAbort(myOp)) return

      renderCells()
      setStatus('add() complete.')
      setAddValue('')
      setRemoveIndex('')
      setContainsValue('')
    } finally {
      setVisualBusy(false)
    }
  }, [addValue, ensureCapacity, renderCells, stepPause, setVisualBusy])

  const opRemove = useCallback(async () => {
    if (busyRef.current) return
    setVisualBusy(true)
    const myOp = ++opSeqRef.current
    const s = vizState.current

    try {
      if (s.size === 0) { setStatus('List is empty. Nothing to remove.'); return }
      const idx = parseInt(removeIndex, 10)
      if (isNaN(idx) || idx < 0 || idx >= s.size) {
        setStatus(`Invalid index. Must be between 0 and ${s.size - 1}.`); return
      }

      setStatus(`remove(${idx}) — shift elements left`)
      setCells(makeCells(s.capacity, s.size, s.values, idx))
      await stepPause()
      if (shouldAbort(myOp)) { renderCells(); return }

      for (let j = idx; j < s.size - 1; j++) {
        setCells(makeCells(s.capacity, s.size, s.values, j + 1))
        await stepPause()
        if (shouldAbort(myOp)) { renderCells(); return }
        s.values[j] = s.values[j + 1]
        setCells(makeCells(s.capacity, s.size, s.values, j))
        await stepPause()
        if (shouldAbort(myOp)) { renderCells(); return }
      }

      s.size -= 1
      s.values.length = s.size
      renderCells()
      await stepPause()
      if (shouldAbort(myOp)) return

      renderCells()
      setStatus('remove() complete.')
      setRemoveIndex('')
    } finally {
      setVisualBusy(false)
    }
  }, [removeIndex, renderCells, stepPause, setVisualBusy])

  const opContains = useCallback(async () => {
    if (busyRef.current) return
    setVisualBusy(true)
    const myOp = ++opSeqRef.current
    const s = vizState.current

    try {
      const needle = containsValue.trim()
      if (!needle) { setStatus('Enter a value to search for.'); return }

      setStatus(`contains(${JSON.stringify(needle)}) — linear scan...`)
      for (let i = 0; i < s.size; i++) {
        setCells(makeCells(s.capacity, s.size, s.values, i))
        await stepPause()
        if (shouldAbort(myOp)) { renderCells(); return }
        if (String(s.values[i]) === needle) {
          setStatus(`Found at index ${i}. contains() → true`)
          await stepPause()
          if (shouldAbort(myOp)) { renderCells(); return }
          renderCells()
          return
        }
      }
      setStatus('Not found. contains() → false')
      await stepPause()
      if (shouldAbort(myOp)) { renderCells(); return }
      renderCells()
    } finally {
      setVisualBusy(false)
    }
  }, [containsValue, renderCells, stepPause, setVisualBusy])

  const opToString = useCallback(async () => {
    if (busyRef.current) return
    setVisualBusy(true)
    const myOp = ++opSeqRef.current
    const s = vizState.current

    try {
      setStatus('Building string representation...')
      setOutput('')
      for (let i = 0; i < s.size; i++) {
        setCells(makeCells(s.capacity, s.size, s.values, i))
        await stepPause()
        if (shouldAbort(myOp)) { renderCells(); return }
      }
      renderCells()
      if (!shouldAbort(myOp)) {
        setOutput(`[${s.values.slice(0, s.size).join(', ')}]`)
        setStatus('toString() complete.')
      }
    } finally {
      setVisualBusy(false)
    }
  }, [renderCells, stepPause, setVisualBusy])

  useEffect(() => {
    stepsPerSecondRef.current = speed * 3
  }, [speed])

  useEffect(() => {
    if (!showHowItWorks) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowHowItWorks(false) }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showHowItWorks])

  const activityTone = busy ? 'badge--primary' : displayCapacity > 0 ? 'badge--accent' : 'badge--neutral'
  const activityLabel = busy
    ? 'Animation running'
    : displayCapacity > 0
      ? 'Ready for operations'
      : 'Create a list to begin'

  return (
    <main className="page al-page">
      <div className="container container--wide">

        <section className="al-hero">
          <div className="eyebrow">Computer Science Explorer</div>
          <h1 className="h2 al-hero__title">Java <code>ArrayList</code> Memory Visualizer</h1>
          <p className="lead al-hero__lead">
            Watch the backing array grow, copy elements into fresh memory, and shift values during each operation.
          </p>
        </section>

        <WidgetShell
          controls={
            /* ── Left: operations ── */
            <section className="panel al-side-panel al-operations-panel">
              <div className="widget-panel__head al-side-panel__head">
                <div className="eyebrow">Operations</div>
              </div>
              <div className="al-operation-stack">
                <section className="al-operation-card">
                  <div className="al-operation-card__title">new ArrayList&lt;&gt;()</div>
                  <OperationField
                    htmlFor="al-init-cap"
                    label="Initial capacity"
                    buttonLabel="Create"
                    onAction={opCreate}
                    disabled={busy}
                  >
                    <input
                      id="al-init-cap"
                      type="number"
                      className="input"
                      style={{ flex: 1, minWidth: 0 }}
                      min={1}
                      step={1}
                      value={initialCapacity}
                      onChange={e => setInitialCapacity(Math.max(1, parseInt(e.target.value) || 10))}
                      disabled={busy}
                    />
                  </OperationField>
                </section>

                <section className="al-operation-card">
                  <div className="al-operation-card__title">add(value)</div>
                  <OperationField
                    htmlFor="al-add-val"
                    label={null}
                    buttonLabel="add()"
                    onAction={opAdd}
                    disabled={busy}
                  >
                    <input
                      id="al-add-val"
                      type="text"
                      className="input"
                      style={{ flex: 1, minWidth: 0 }}
                      placeholder="42 or 'cat'"
                      value={addValue}
                      onChange={e => setAddValue(e.target.value)}
                      disabled={busy}
                      onKeyDown={e => { if (e.key === 'Enter') opAdd() }}
                    />
                  </OperationField>
                </section>

                <section className="al-operation-card">
                  <div className="al-operation-card__title">remove(index)</div>
                  <OperationField
                    htmlFor="al-remove-idx"
                    label={null}
                    buttonLabel="remove()"
                    onAction={opRemove}
                    disabled={busy}
                    hint="Shifts elements left – O(n)"
                  >
                    <input
                      id="al-remove-idx"
                      type="number"
                      className="input"
                      style={{ flex: 1, minWidth: 0 }}
                      min={0}
                      step={1}
                      placeholder="index"
                      value={removeIndex}
                      onChange={e => setRemoveIndex(e.target.value)}
                      disabled={busy}
                      onKeyDown={e => { if (e.key === 'Enter') opRemove() }}
                    />
                  </OperationField>
                </section>

                <section className="al-operation-card">
                  <div className="al-operation-card__title">contains(value)</div>
                  <OperationField
                    htmlFor="al-contains-val"
                    label={null}
                    buttonLabel="contains()"
                    onAction={opContains}
                    disabled={busy}
                  >
                    <input
                      id="al-contains-val"
                      type="text"
                      className="input"
                      style={{ flex: 1, minWidth: 0 }}
                      placeholder="value"
                      value={containsValue}
                      onChange={e => setContainsValue(e.target.value)}
                      disabled={busy}
                      onKeyDown={e => { if (e.key === 'Enter') opContains() }}
                    />
                  </OperationField>
                </section>

                <section className="al-operation-card">
                  <div className="al-operation-card__title">toString()</div>
                  <button className="btn op-field__btn al-operation-card__method-btn" onClick={opToString} disabled={busy}>
                    toString()
                  </button>
                </section>

              </div>
            </section>
          }

          info={
            /* ── Right: snapshot + details ── */
            <>
              <section className="panel al-side-panel">
                <div className="widget-panel__head al-side-panel__head">
                  <div className="eyebrow">ArrayList Snapshot</div>
                </div>
                <span className={`badge ${activityTone} al-state-badge`}>
                  {activityLabel}
                </span>
                <MetricsDisplay
                  className="al-metrics-grid"
                  metrics={[
                    { label: 'Size', value: displaySize },
                    { label: 'Capacity', value: displayCapacity },
                    { label: 'Growth', value: `×${GROWTH_FACTOR}` },
                  ]}
                />
              </section>

              <section className="panel al-side-panel">
                <div className="widget-panel__head al-side-panel__head">
                  <div className="eyebrow">Animation &amp; Details</div>
                </div>
                <div className="al-operation-card__title">Animation Speed</div>
                <div className="segment-group al-speed-segments" role="group" aria-label="Animation speed">
                  {SPEED_OPTIONS.map(option => (
                    <button
                      key={option.label}
                      type="button"
                      className={`segment${speed === option.value ? ' active' : ''}`}
                      onClick={() => setSpeed(option.value)}
                      aria-pressed={speed === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn--outline btn--sm btn--block"
                  onClick={() => setShowHowItWorks(true)}
                >
                  ArrayLists Explained
                </button>
              </section>
            </>
          }
        >
          {/* ── Center: memory visualization ── */}
          <div
            onClick={requestCancel}
            style={{ cursor: busy ? 'pointer' : 'default', display: 'flex', flexDirection: 'column', gap: '.75rem' }}
          >
            <div
              className={status.includes('→ false') ? 'alert alert--warning' : 'alert alert--info'}
              aria-live="polite"
            >
              {status}
            </div>

            <div className="mem-viz-frame al-backing-array" data-label="Backing Array - Java Heap Memory">
              <div className="al-heap-grids">
                {newCells && (
                  <div className={`al-heap-grid-section${expandPhase === 'entering' ? ' al-heap-grid-section--new-enter' : ''}`}>
                    <div className="al-backing-array-title al-backing-array-title--resize">
                      New backing array - resizing
                    </div>
                    <MemoryGrid cells={newCells} label="New capacity grid" />
                  </div>
                )}
                <div className={`al-heap-grid-section${expandPhase === 'exiting' ? ' al-heap-grid-section--old-exit' : ''}`}>
                  <div className="al-backing-array-title">
                    {displayCapacity} slots allocated - {displaySize} filled
                  </div>
                  <MemoryGrid cells={cells} label="Program memory grid" />
                </div>
              </div>
              <div className="legend-key al-legend-inline al-legend-inline--below" aria-label="Memory key">
                <div className="legend-key__item">
                  <span className="legend-key__dot al-legend-dot al-legend-dot--unused" />
                  Unused memory
                </div>
                <div className="legend-key__item">
                  <span className="legend-key__dot al-legend-dot al-legend-dot--allocated" />
                  Allocated capacity
                </div>
                <div className="legend-key__item">
                  <span className="legend-key__dot al-legend-dot al-legend-dot--filled" />
                  Filled slot
                </div>
                <div className="legend-key__item">
                  <span className="legend-key__dot al-legend-dot al-legend-dot--current" />
                  Current cell
                </div>
              </div>
            </div>

            {output && (
              <section className="panel al-side-panel al-console-panel" aria-live="polite">
                <div className="widget-panel__head al-side-panel__head">
                  <div className="eyebrow">Console</div>
                </div>
                <pre className="code-block al-console-output">{output}</pre>
              </section>
            )}

            <p className={`muted al-cancel-note${busy ? ' al-cancel-note--visible' : ''}`}>
              Click anywhere in the memory view to cancel the animation.
            </p>
          </div>
        </WidgetShell>

      </div>

      {showHowItWorks && (
        <div className="popup-overlay" role="presentation" onClick={() => setShowHowItWorks(false)}>
          <section
            className="panel popup popup--sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="al-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="popup__header">
              <div className="eyebrow" id="al-modal-title">ArrayLists Explained</div>
              <button type="button" className="btn btn--outline btn--sm popup__close" onClick={() => setShowHowItWorks(false)}>Close</button>
            </div>
            <div className="stack-xs" style={{ fontSize: '.9rem' }}>
              <div className="eyebrow">BACKING ARRAY</div>
              <p className="muted">
                A Java <code>ArrayList</code> stores its elements in a regular array behind the scenes. That is why the
                capacity can be larger than the size: the list may reserve extra memory slots before they are filled.
              </p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>RESIZING</div>
              <p className="muted">
                When the current array runs out of room, the <code>ArrayList</code> allocates a larger array and copies
                every existing element into the new one. That resize takes extra work in the moment, but it helps future{' '}
                <code>add()</code> operations stay fast overall.
              </p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>ACCESS AND SEARCH</div>
              <p className="muted">
                Methods like <code>get(i)</code> and <code>set(i, value)</code> are usually <code>O(1)</code> because the
                list can jump straight to a numbered position. The <code>contains(value)</code> method is <code>O(n)</code>
                because it may need to check each element one at a time.
              </p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>REMOVING ELEMENTS</div>
              <p className="muted">
                The <code>remove(index)</code> method is <code>O(n)</code> because every element after the removed item has
                to shift one position to the left to close the gap.
              </p>
            </div>
          </section>
        </div>
      )}

    </main>
  )
}
