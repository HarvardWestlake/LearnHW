import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Subject {
  key: string
  to: string
  title: string
  blurb: string
}

const SUBJECTS: Subject[] = [
  { key: 'math',    to: '/math',    title: 'Math',             blurb: 'Interactive math learning widgets and explorations.' },
  { key: 'code',    to: '/code',    title: 'Computer Science', blurb: 'Programming visualizations, data structures, binary, and crypto demos.' },
  { key: 'econ',    to: '/econ',    title: 'Economics',        blurb: 'Micro and macro interactive widgets.' },
  { key: 'chem',    to: '/chem',    title: 'Chemistry',        blurb: 'Hands-on chemistry demos and visualizations.' },
  { key: 'stats',   to: '/stats',   title: 'Statistics',       blurb: 'Stats tools, visualizations, and calculators.' },
  { key: 'history', to: '/history', title: 'History',          blurb: 'Interactive timelines and maps for world histories.' },
]

function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link id={`subject-${subject.key}`} className="widget-card" to={subject.to}>
      <div className="title-row">
        <h3 className="widget-card__title">{subject.title}</h3>
      </div>
      <p>{subject.blurb}</p>
      <span className="button">Open</span>
    </Link>
  )
}

export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace(/^#/, '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [hash])


  return (
    <main className="page">
      <div className="container widgets-page">
        <h1 className="h1">Class Resources</h1>

        <h2 className="h5 eyebrow">Subjects</h2>
        <div className="widgets-grid">
          {SUBJECTS.map(s => <SubjectCard key={s.key} subject={s} />)}
        </div>

        <h2 className="h5 eyebrow">Admin</h2>
        <div className="widgets-grid">
          <Link className="widget-card" to="/admin">
            <div className="title-row">
              <h3>Style Guide</h3>
            </div>
            <p>UI components, tokens, and patterns used across the app.</p>
            <span className="button">Open</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
