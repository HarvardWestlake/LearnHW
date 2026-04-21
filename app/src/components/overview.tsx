import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Overview page type — a reusable template for topic-introduction pages
 * (e.g. /code/overview for Cryptography). Composed of:
 *
 *   <OverviewPage>
 *     <OverviewGroup label="Foundations">
 *       <OverviewSection ... />
 *       <OverviewConnector />
 *       <OverviewSection ... />
 *     </OverviewGroup>
 *     <OverviewGroup label="..."> ... </OverviewGroup>
 *   </OverviewPage>
 *
 * Heroes and watermarks are passed as React nodes so subject-specific
 * graphics live in the page that renders them and are trivial to swap.
 */

/* ============================================================
 * OverviewPage — top-level shell (title, eyebrow, intro blurb)
 * ============================================================ */
export interface OverviewPageProps {
  eyebrow?: string;        // "Computer Science"
  title: string;           // "Cryptography"
  blurb?: string;          // single-paragraph topic intro
  backTo?: string;         // e.g. "/code"
  backLabel?: string;      // e.g. "Computer Science"
  children: ReactNode;
}

export function OverviewPage({ eyebrow, title, blurb, backTo, backLabel, children }: OverviewPageProps) {
  return (
    <main className="page overview-page">
      <div className="container overview-page__hero">
        {backTo && (
          <Link className="btn btn--outline btn--sm overview-page__back" to={backTo}>
            ← {backLabel ?? 'Back'}
          </Link>
        )}
        {eyebrow && <div className="eyebrow overview-page__eyebrow">{eyebrow}</div>}
        <h1 className="h1 overview-page__title">{title}</h1>
        {blurb && <p className="lead overview-page__blurb">{blurb}</p>}
      </div>
      <div className="container overview-page__body">
        {children}
      </div>
    </main>
  );
}

/* ============================================================
 * OverviewGroup — visually bands related sections together
 * ============================================================ */
export type OverviewAccent = 'gray' | 'red' | 'gold' | 'black';

export interface OverviewGroupProps {
  label?: string;
  accent?: OverviewAccent;
  children: ReactNode;
}

export function OverviewGroup({ label, accent = 'gray', children }: OverviewGroupProps) {
  return (
    <section className={`overview-group overview-group--${accent}`}>
      {label && (
        <div className="overview-group__header">
          <span className="overview-group__bar" aria-hidden />
          <span className="overview-group__label">{label}</span>
        </div>
      )}
      <div className="overview-group__body">{children}</div>
    </section>
  );
}

/* ============================================================
 * OverviewSection — one section in the vertical flow
 * ============================================================ */
export interface OverviewLink {
  to: string;
  label: string;
  external?: boolean;
}

export interface OverviewSectionProps {
  eyebrow?: string;         // "01"
  title: string;
  blurb?: string;
  takeaways?: ReactNode[];
  links?: OverviewLink[];
  hero?: ReactNode;         // right-column graphic
  watermark?: ReactNode;    // faded decorative background graphic
  accent?: OverviewAccent;
  children?: ReactNode;     // optional extra copy below blurb
}

export function OverviewSection({
  eyebrow, title, blurb, takeaways, links, hero, watermark, accent = 'gray', children,
}: OverviewSectionProps) {
  return (
    <article className={`overview-section overview-section--${accent}`}>
      {watermark && <div className="overview-section__watermark" aria-hidden>{watermark}</div>}
      <div className="overview-section__inner">
        <div className="overview-section__copy">
          {eyebrow && <div className="overview-section__eyebrow">{eyebrow}</div>}
          <h2 className="overview-section__title">{title}</h2>
          {blurb && <p className="overview-section__blurb">{blurb}</p>}
          {children}
          {takeaways && takeaways.length > 0 && (
            <ul className="overview-section__takeaways">
              {takeaways.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          )}
          {links && links.length > 0 && (
            <div className="overview-section__links">
              {links.map((l, i) =>
                l.external ? (
                  <a key={i} className="btn btn--outline btn--sm" href={l.to} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                ) : (
                  <Link key={i} className="btn btn--outline btn--sm" to={l.to}>
                    {l.label} →
                  </Link>
                )
              )}
            </div>
          )}
        </div>
        {hero && <div className="overview-section__hero" aria-hidden>{hero}</div>}
      </div>
    </article>
  );
}

/* ============================================================
 * OverviewConnector — minimal drawn thread between sections
 * ============================================================ */
export function OverviewConnector({ accent = 'gray' }: { accent?: OverviewAccent } = {}) {
  return (
    <div className={`overview-connector overview-connector--${accent}`} aria-hidden>
      <svg viewBox="0 0 24 64" width="28" height="68" preserveAspectRatio="xMidYMid meet">
        <path d="M 12 2 Q 12 32 12 54" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M 7 49 L 12 58 L 17 49" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
