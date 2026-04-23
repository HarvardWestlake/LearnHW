import { useState, useRef, useCallback, useEffect } from 'react'

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

    // Phase 1: new array slides in from top (cells stagger by row), old array pushed down
    setNewCells(makeCells(newCap, 0, []))
    setExpandPhase('entering')
    await sleep(ENTER_ANIM_MS)
    if (shouldAbort(myOp)) { setNewCells(null); setExpandPhase(null); return false }

    setExpandPhase('copying')

    // Phase 2: copy elements with existing highlight + bounce on arrival
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

    // Phase 3: old array exits downward, new array stays
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

  const activityTone = busy ? 'badge--primary' : displayCapacity > 0 ? 'badge--accent' : 'badge--neutral'
  const activityLabel = busy
    ? 'Animation running'
    : displayCapacity > 0
      ? 'Ready for operations'
      : 'Create a list to begin'

  return (
    <main className="page al-page">
      <div className="container container--wide">
        <section className="panel al-hero">
          <div className="eyebrow">Computer Science Explorer</div>
          <div className="al-hero__row">
            <div className="al-hero__copy">
              <h1 className="h2 al-hero__title">Java <code>ArrayList</code> Memory Visualizer</h1>
              <p className="lead al-hero__lead">
                Watch the backing array grow, copy elements into fresh memory, and shift values during each operation.
              </p>
            </div>
            <div className="al-hero__actions">
              <button className="btn btn--outline btn--sm" onClick={() => setShowHowItWorks(true)}>
                How It Works
              </button>
            </div>
          </div>
        </section>

        <div className="al-layout">

          {/* ── Left column: snapshot + legend ── */}
          <aside className="al-left-col">
            <section className="panel al-side-panel">
              <div className="al-side-panel__head">
                <div className="eyebrow">ArrayList Snapshot</div>
              </div>
              <span className={`badge ${activityTone} al-state-badge`}>
                {activityLabel}
              </span>
              <div className="metrics-grid al-metrics-grid">
                <div className="metric">
                  <span className="metric__label">Size</span>
                  <span className="metric__value">{displaySize}</span>
                </div>
                <div className="metric">
                  <span className="metric__label">Capacity</span>
                  <span className="metric__value">{displayCapacity}</span>
                </div>
                <div className="metric">
                  <span className="metric__label">Growth</span>
                  <span className="metric__value">×{GROWTH_FACTOR}</span>
                </div>
              </div>
              <p className="helper-text al-side-note">
                The <code>ArrayList</code> keeps a backing array in memory, so capacity can stay ahead of size.
              </p>
            </section>

            <section className="panel al-side-panel">
              <div className="al-side-panel__head">
                <div className="eyebrow">Memory Key</div>
              </div>
              <div className="legend-key al-legend-list">
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
            </section>
          </aside>

          {/* ── Center column: backing array + memory grid ── */}
          <section className="al-center-col" onClick={requestCancel} style={{ cursor: busy ? 'pointer' : 'default' }}>
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
            </div>

            <p className={`muted al-cancel-note${busy ? ' al-cancel-note--visible' : ''}`}>
              Click anywhere in the memory view to cancel the animation.
            </p>

            {output && (
              <pre className="code-block al-output">
                <span className="code-block__lang">toString()</span>
                {output}
              </pre>
            )}
          </section>

          {/* ── Right column: operations ── */}
          <aside className="al-right-col">
            <section className="panel al-side-panel al-operations-panel">
              <div className="al-side-panel__head">
                <div className="eyebrow">Operations</div>
              </div>
              <div className="stack-sm">

                <div>
                  <label className="label" htmlFor="al-init-cap">Initial capacity</label>
                  <div className="al-field-row">
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
                    <button className="btn al-op-btn" onClick={opCreate} disabled={busy}>
                      Create
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="al-add-val">add(value)</label>
                  <div className="al-field-row">
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
                    <button className="btn al-op-btn" onClick={opAdd} disabled={busy}>add()</button>
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="al-remove-idx">remove(index)</label>
                  <div className="al-field-row">
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
                    <button className="btn al-op-btn" onClick={opRemove} disabled={busy}>remove()</button>
                  </div>
                  <div className="helper-text al-action-hint">Shifts elements left - O(n)</div>
                </div>

                <div>
                  <label className="label" htmlFor="al-contains-val">contains(value)</label>
                  <div className="al-field-row">
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
                    <button className="btn al-op-btn" onClick={opContains} disabled={busy}>contains()</button>
                  </div>
                </div>

                <button className="btn btn--outline btn--block" onClick={opToString} disabled={busy}>
                  toString()
                </button>

                <div>
                  <label className="label" htmlFor="al-speed">
                    Speed: <strong>{speed}x</strong>
                  </label>
                  <input
                    id="al-speed"
                    type="range"
                    className="range"
                    min={0.25}
                    max={5}
                    step={0.25}
                    value={speed}
                    onChange={e => setSpeed(parseFloat(e.target.value))}
                  />
                </div>

              </div>
            </section>
          </aside>
        </div>
      </div>

      {showHowItWorks && (
        <div className="al-modal-overlay" onClick={() => setShowHowItWorks(false)}>
          <div className="al-modal" onClick={e => e.stopPropagation()}>
            <div className="al-modal-header">
              <h2 className="h5 eyebrow" style={{ margin: 0 }}>How It Works</h2>
              <button className="al-modal-close" onClick={() => setShowHowItWorks(false)} aria-label="Close">×</button>
            </div>
            <div className="stack-xs" style={{ fontSize: '.9rem' }}>
              <div className="eyebrow">DYNAMIC SIZING</div>
              <p className="muted">Wraps a plain Java array. When full, a 2× array is allocated and all elements are copied over.</p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>INDEXED ACCESS</div>
              <p className="muted"><code>get(i)</code> / <code>set(i, v)</code> — O(1). <code>contains()</code> — O(n) linear scan.</p>
              <div className="eyebrow" style={{ marginTop: '.5rem' }}>REMOVE SHIFTS</div>
              <p className="muted"><code>remove(idx)</code> — O(n). Every element after the gap shifts one position left.</p>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
