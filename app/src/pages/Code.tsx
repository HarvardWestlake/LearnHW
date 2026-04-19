import { Link } from 'react-router-dom'
import { CODE_WIDGETS } from './widgetMaps'

export default function Code() {
  return (
    <main className="page">
      <div className="container widgets-page">
        <h1 className="h1">Computer Science</h1>
        <p className="muted" style={{ marginTop: '.25rem' }}>
          Interactive visualizations covering data structures, memory, cryptography, 
          and foundational computing concepts.
        </p>

        {/* Memory & Data Structures */}
        <section className="panel" style={{ marginTop: '2rem' }}>
          <h2 className="h5 eyebrow">MEMORY &amp; DATA STRUCTURES</h2>
          <p className="muted">
            How computers organize and visualize data in memory — from simple lists 
            to object graphs and binary interpretation.
          </p>
          <div className="widgets-grid" style={{ marginTop: '1.25rem' }}>
            <Link className="widget-card" to="/code/binary-explorer">
              <div className="title-row">
                <h3>Binary Interpretation Explorer</h3>
              </div>
              <p>Native React component. See how the exact same bits can represent integers, characters, hex values, and booleans.</p>
              <span className="button">Open</span>
            </Link>

            {['array-list', 'singly-linked-list', 'objects-static'].map(slug => {
              const w = CODE_WIDGETS[slug as keyof typeof CODE_WIDGETS]
              return (
                <Link key={slug} className="widget-card" to={`/code/${slug}`}>
                  <div className="title-row">
                    <h3>{w.title}</h3>
                  </div>
                  <p>Memory visualization and data structure exploration.</p>
                  <span className="button">Open</span>
                </Link>
              )
            })}
          </div>
          <div className="divider" style={{ margin: '2rem 0' }} />
        </section>

        {/* Cryptography */}
        <section className="panel">
          <h2 className="h5 eyebrow">CRYPTOGRAPHY</h2>
          <p className="muted">
            Classic and modern cryptographic primitives with visual demonstrations of how they work.
          </p>
          <div className="widgets-grid" style={{ marginTop: '1.25rem' }}>
            {['rsa-encryption', 'shamir'].map(slug => {
              const w = CODE_WIDGETS[slug as keyof typeof CODE_WIDGETS]
              return (
                <Link key={slug} className="widget-card" to={`/code/${slug}`}>
                  <div className="title-row">
                    <h3>{w.title}</h3>
                  </div>
                  <p>Cryptography and secure computation concepts.</p>
                  <span className="button">Open</span>
                </Link>
              )
            })}
          </div>
          <div className="divider" style={{ margin: '2rem 0' }} />
        </section>

        {/* Git Internals */}
        <section className="panel">
          <h2 className="h5 eyebrow">GIT INTERNALS</h2>
          <p className="muted">
            Low-level concepts behind Git: content-addressable storage, trees, and object models.
          </p>
          <div className="widgets-grid" style={{ marginTop: '1.25rem' }}>
            {['blob-creation', 'index-tree'].map(slug => {
              const w = CODE_WIDGETS[slug as keyof typeof CODE_WIDGETS]
              return (
                <Link key={slug} className="widget-card" to={`/code/${slug}`}>
                  <div className="title-row">
                    <h3>{w.title}</h3>
                  </div>
                  <p>Git internals and content-addressable storage.</p>
                  <span className="button">Open</span>
                </Link>
              )
            })}
          </div>
          <div className="divider" style={{ margin: '2rem 0' }} />
        </section>

        {/* Legacy Resources */}
        <section className="panel">
          <h2 className="h5 eyebrow">LEGACY RESOURCES</h2>
          <p className="muted">
            Original static HTML widgets and index pages from earlier versions of the course materials.
          </p>
          <div className="widgets-grid" style={{ marginTop: '1.25rem' }}>
            <a className="widget-card" href="/static/code/index.html">
              <div className="title-row">
                <h3>Legacy CS Index</h3>
              </div>
              <p>Open the original static index page containing all legacy computer science widgets.</p>
              <span className="button">Open</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}

