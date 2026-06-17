import { Link } from 'react-router-dom'

export default function TeachingResources() {
  return (
    <main className="page">
      <div className="container widgets-page">
        <h1 className="h1">Teaching Resources</h1>
        <p className="muted" style={{ marginTop: '.25rem' }}>
          Classroom materials organized separately from interactive subject tools.
        </p>

        <h2 className="h5 eyebrow" style={{ marginTop: '2rem' }}>Resources</h2>
        <div className="widgets-grid">
          <Link className="widget-card" to="/teaching-resources/lessons">
            <div className="title-row">
              <h3>Lessons</h3>
            </div>
            <p>Browse classroom lesson presentations by subject and course.</p>
            <span className="button">Open</span>
          </Link>
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
