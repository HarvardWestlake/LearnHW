import { Link } from 'react-router-dom'
import { HTCS_LESSON_WIDGETS } from './widgetMaps'

const HTCS_LESSONS = [
  { slug: 'htcs-unit-6-day-1', title: 'Unit 6 Day 1', subtitle: 'Hash Functions & Asymmetric Keys' },
  { slug: 'htcs-unit-6-day-2', title: 'Unit 6 Day 2', subtitle: 'Peer-to-Peer Networks' },
  { slug: 'htcs-unit-6-day-3', title: 'Unit 6 Day 3', subtitle: 'Proof of Work' },
  { slug: 'htcs-unit-6-day-4', title: 'Unit 6 Day 4', subtitle: 'Bitcoin Wallets & Multi-Signatures' },
  { slug: 'htcs-unit-6-day-5', title: 'Unit 6 Day 5', subtitle: 'Lightning Networks' },
]

export default function HtcsLessons() {
  return (
    <main className="page">
      <div className="container widgets-page">
        <Link to="/code" className="muted" style={{ fontSize: '.875rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
          ← Computer Science
        </Link>
        <h1 className="h1">Honors Topics in Computer Science</h1>
        <p className="muted" style={{ marginTop: '.25rem' }}>
          Lesson presentations for the HTCS course.
        </p>

        <section className="panel" style={{ marginTop: '2rem' }}>
          <h2 className="h5 eyebrow">UNIT 6</h2>
          <div className="widgets-grid" style={{ marginTop: '1.25rem' }}>
            {HTCS_LESSONS.map(lesson => {
              const src = HTCS_LESSON_WIDGETS[lesson.slug].src
              const filename = src.split('/').pop()!
              return (
                <div key={lesson.slug} className="widget-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="title-row">
                    <h3>{lesson.title}</h3>
                  </div>
                  <p style={{ flex: 1 }}>{lesson.subtitle}</p>
                  <div style={{ display: 'flex', gap: '.5rem', marginTop: 'auto' }}>
                    <a
                      className="button"
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Open
                    </a>
                    <a
                      className="btn btn--outline btn--sm"
                      href={src}
                      download={filename}
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Download
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
