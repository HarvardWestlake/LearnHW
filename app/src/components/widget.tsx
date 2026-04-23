import type { ReactNode } from 'react'

/**
 * Reusable React components for interactive widget pages.
 *
 * Pattern: WidgetShell wraps a three-column (or two-column) layout matching the
 * quadratic-transformations-explorer visual structure — controls left, visualization
 * center, optional info/legend right. Use OperationField for every labeled
 * input-plus-button row, and MetricsDisplay for at-a-glance stat grids.
 *
 *   <WidgetShell controls={<ControlsPanel />} info={<InfoPanel />}>
 *     <VisualizationArea />
 *   </WidgetShell>
 */

/* ============================================================
 * WidgetShell — two- or three-column interactive layout grid.
 *   controls  → left sidebar (always present)
 *   children  → center visualization area
 *   info      → right sidebar (optional; omit for two-column)
 * ============================================================ */
export interface WidgetShellProps {
  controls: ReactNode
  info?: ReactNode
  children: ReactNode
  className?: string
}

export function WidgetShell({ controls, info, children, className }: WidgetShellProps) {
  return (
    <div className={[
      'widget-shell',
      info ? 'widget-shell--three-col' : 'widget-shell--two-col',
      className,
    ].filter(Boolean).join(' ')}>
      <aside className="widget-shell__controls">{controls}</aside>
      <div className="widget-shell__main">{children}</div>
      {info && <aside className="widget-shell__info">{info}</aside>}
    </div>
  )
}

/* ============================================================
 * OperationField — one labeled operation row: label + input(s) + action button.
 * Pass the input as children; htmlFor links the label to the input's id.
 * ============================================================ */
export interface OperationFieldProps {
  htmlFor: string
  label?: ReactNode
  buttonLabel: string
  onAction: () => void
  disabled?: boolean
  hint?: string
  children: ReactNode
}

export function OperationField({
  htmlFor, label, buttonLabel, onAction, disabled, hint, children,
}: OperationFieldProps) {
  return (
    <div className="op-field">
      {label != null && <label className="label" htmlFor={htmlFor}>{label}</label>}
      <div className="op-field__row">
        {children}
        <button className="btn op-field__btn" onClick={onAction} disabled={disabled}>
          {buttonLabel}
        </button>
      </div>
      {hint && <div className="helper-text">{hint}</div>}
    </div>
  )
}

/* ============================================================
 * MetricsDisplay — compact grid of labeled stats (size, capacity, etc.).
 * Pass className to override column count (e.g. "al-metrics-grid" for 3-col).
 * ============================================================ */
export interface MetricItem {
  label: string
  value: ReactNode
  note?: string
}

export function MetricsDisplay({ metrics, className }: { metrics: MetricItem[]; className?: string }) {
  return (
    <div className={`metrics-grid${className ? ` ${className}` : ''}`}>
      {metrics.map((m, i) => (
        <div key={i} className="metric">
          <span className="metric__label">{m.label}</span>
          <span className="metric__value">{m.value}</span>
          {m.note && <span className="metric__note">{m.note}</span>}
        </div>
      ))}
    </div>
  )
}
