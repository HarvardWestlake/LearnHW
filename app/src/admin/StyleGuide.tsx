import { OverviewPage, OverviewGroup, OverviewSection, OverviewConnector } from '../components/overview'

export default function StyleGuide() {
  return (
    <main className="page">
      <div className="container styleguide">
        <h1 className="h2">Style Guide</h1>

        {/* Homepage Layout (Header, Sections, Modules) */}
        <section className="panel">
          <h2 className="h5 eyebrow">Homepage Layout</h2>
          <p className="muted">Demonstrates the homepage header, section headings, and module grid using shared classes.</p>
          <div className="widgets-page">
            <h1 className="h1">Class Resources (Demo)</h1>

            <h2>Subjects</h2>
            <div className="widgets-grid">
              <a className="widget-card" href="#">
                <div className="title-row">
                  <h3>Math</h3>
                </div>
                <p>Interactive math learning widgets and explorations.</p>
                <span className="button">Open</span>
              </a>
              <a className="widget-card" href="#">
                <div className="title-row">
                  <h3>Code</h3>
                </div>
                <p>Programming visualizations, data structures, and crypto demos.</p>
                <span className="button">Open</span>
              </a>
              <a className="widget-card" href="#">
                <div className="title-row">
                  <h3>Economics</h3>
                </div>
                <p>Micro and macro interactive widgets.</p>
                <span className="button">Open</span>
              </a>
            </div>

            <h2>Admin</h2>
            <div className="widgets-grid">
              <a className="widget-card" href="#">
                <div className="title-row">
                  <h3>Style Guide</h3>
                </div>
                <p>UI components, tokens, and patterns used across the app.</p>
                <span className="button">Open</span>
              </a>
            </div>
          </div>
        </section>

        {/* Subject Page Layout */}
        <section className="panel">
          <h2 className="h5 eyebrow">Subject Page Layout</h2>
          <p className="muted">Demonstrates the standard subject page pattern: centered h1 title, subtitle, and one or more sectioned panels with eyebrow headers and widget grids.</p>
          <div className="widgets-page" style={{ marginTop: '1rem' }}>
            <h1 className="h1">Subject Name (Demo)</h1>
            <p className="muted" style={{ marginTop: '.25rem' }}>
              Short description of what this subject covers.
            </p>
            <section className="panel" style={{ marginTop: '2rem' }}>
              <h2 className="h5 eyebrow">INTERACTIVE TOOLS</h2>
              <p className="muted">Brief description of what this group of widgets covers.</p>
              <div className="widgets-grid" style={{ marginTop: '1.25rem' }}>
                <a className="widget-card" href="#">
                  <div className="title-row">
                    <h3>Widget Title</h3>
                  </div>
                  <p>Short description of what this widget does.</p>
                  <span className="button">Open</span>
                </a>
                <a className="widget-card" href="#">
                  <div className="title-row">
                    <h3>Another Widget</h3>
                  </div>
                  <p>Short description of what this widget does.</p>
                  <span className="button">Open</span>
                </a>
              </div>
            </section>
          </div>
        </section>

        {/* Typography */}
        <section className="panel">
          <h2 className="h5 eyebrow">Typography Scale</h2>
          <p className="muted">
            Headlines use Source Sans Black; subheads Semibold; body Light/Regular. (Arial as fallback when needed.)
          </p>
          <div className="stack-md">
            <div className="type-sample">
              <div className="h1">H1 – Discover your voice</div>
              <div className="h2">H2 – Discover your power</div>
              <div className="h3">H3 – Discover your community</div>
              <div className="h4">H4 – Section heading</div>
              <div className="h5">H5 – Panel / Card heading</div>
              <div className="h6">H6 – Small heading</div>
              <p className="lead">Lead – Larger body for intro paragraphs.</p>
              <p>
                Body – Source Sans with comfortable line height. Links like
                <a className="link" href="#"> this</a> are underlined on hover and
                use HW red.
              </p>
              <p className="eyebrow">Eyebrow – small uppercase label</p>

            <div className="divider" />
            <div className="stack-sm">
              <div className="h6">Red uppercase heading utility (.red)</div>
              <div className="h1 red">H1 – Red Uppercase</div>
              <div className="h2 red">H2 – Red Uppercase</div>
              <div className="h3 red">H3 – Red Uppercase</div>
              <div className="h4 red">H4 – Red Uppercase</div>
            </div>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="panel">
          <h2 className="h5 eyebrow">Buttons</h2>
          <div className="grid grid-3@md gap-md">
            <button className="btn">Primary</button>
            <button className="btn btn--outline">Outline</button>
            <button className="btn btn--ghost">Ghost</button>
            <button className="btn btn--caps">All Caps</button>
            <button className="btn btn--sm">Small</button>
            <button className="btn btn--lg">Large</button>
            <button className="btn" disabled>Disabled</button>
            {/* Custom v2 demo (Style Guide only) */}
            <button className="custom-button custom-button--v2" style={{ width: '100%' }}>
              <span className="decorator"><span className="chev-rect" /><span className="stretch-bar" /></span>
              <span className="txt">Dive In</span>
              <span className="plus-icon"></span>
            </button>
          </div>
        </section>

        {/* Badges + Alerts */}
        <section className="panel">
          <h2 className="h5 eyebrow">Badges & Alerts</h2>
          <div className="stack-sm">
            <div className="stack-xs">
              <span className="badge badge--primary">Primary</span>
              <span className="badge badge--neutral">Neutral</span>
              <span className="badge badge--accent">Accent</span>
            </div>
            <div className="grid grid-3@md gap-md">
              <div className="alert alert--info">This is an info alert.</div>
              <div className="alert alert--success">This is a success alert.</div>
              <div className="alert alert--warning">This is a warning alert.</div>
            </div>
          </div>
        </section>

        {/* Forms */}
        <section className="panel">
          <h2 className="h5 eyebrow">Forms</h2>
          <p className="muted">
            Controls are 44px high minimum for touch, have 1px borders, clear focus rings,
            and never overflow their container.
          </p>
          <form className="form grid grid-2@md gap-lg">
            <div className="stack-sm">
              <label className="label" htmlFor="name">Name</label>
              <input id="name" className="input" placeholder="Jane Wolverine" />

              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" placeholder="wolverine@hw.com" />

              <label className="label" htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-prefix">@</span>
                <input id="password" type="password" className="input" placeholder="••••••••" />
                <button type="button" className="input-suffix btn btn--outline">Show</button>
              </div>
              <div className="helper-text">Use 12+ characters.</div>

              <label className="label" htmlFor="select">Program</label>
              <select id="select" className="select">
                <option>Upper School</option>
                <option>Middle School</option>
              </select>

              <label className="label" htmlFor="msg">Message</label>
              <textarea id="msg" className="textarea" rows={4} placeholder="Write your message…" />

              <div className="field">
                <label className="checkbox">
                  <input type="checkbox" /> <span>Subscribe to updates</span>
                </label>
              </div>

              <div className="field">
                <span className="label">Role</span>
                <label className="radio"><input name="role" type="radio" defaultChecked /> <span>Student</span></label>
                <label className="radio"><input name="role" type="radio" /> <span>Parent</span></label>
                <label className="radio"><input name="role" type="radio" /> <span>Faculty</span></label>
              </div>

              <div className="field">
                <label className="switch">
                  <input type="checkbox" /> <span className="switch__slider" /> Enable notifications
                </label>
              </div>
            </div>

            <div className="stack-sm">
              <label className="label" htmlFor="range">Range</label>
              <input id="range" type="range" className="range" />

              <label className="label" htmlFor="file">Upload file</label>
              <input id="file" type="file" className="input-file" />

              <div className="field">
                <label className="label">Inline controls</label>
                <div className="inline-controls">
                  <input type="checkbox" /> <span>Checkbox</span>
                  <input type="radio" name="r2" /> <span>Radio</span>
                </div>
              </div>

              <div className="field">
                <label className="label">Validation</label>
                <input className="input is-valid" placeholder="Looks good" />
                <div className="valid-text">Success message.</div>
                <input className="input is-invalid" placeholder="Has an error" />
                <div className="error-text">Please correct this field.</div>
              </div>
            </div>

            <div className="grid grid-2 gap-sm col-span-2">
              <button className="btn">Submit</button>
              <button className="btn btn--outline" type="button">Cancel</button>
            </div>
          </form>
        </section>

        {/* Tables */}
        <section className="panel">
          <h2 className="h5 eyebrow">Tables</h2>
          <table className="table table--sm">
            <thead>
              <tr>
                <th>Component</th><th>Example</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Button</td>
                <td><button className="btn btn--sm">Click</button></td>
                <td className="muted">Primary button</td>
              </tr>
              <tr>
                <td>Badge</td>
                <td><span className="badge badge--accent">New</span></td>
                <td className="muted">Accent badge</td>
              </tr>
              <tr>
                <td>Input</td>
                <td><input className="input" placeholder="Text" /></td>
                <td className="muted">Default input</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Overview Page Type */}
        <section className="panel">
          <h2 className="h5 eyebrow">Page type · Overview</h2>
          <p className="muted">
            Reusable template for subject-level introduction pages (e.g. <code>/code/overview</code>).
            Composed of <code>OverviewPage</code> → <code>OverviewGroup</code> →
            <code> OverviewSection</code> with an optional <code>OverviewConnector</code> between sections.
            Each section accepts its own <code>hero</code> and <code>watermark</code> as React nodes, so
            the per-topic graphics live inline in the page that renders them and are trivial to swap.
          </p>

          <h3 className="h6" style={{ marginTop: '1rem' }}>Minimal live example</h3>
          <div style={{
            border: '1px dashed var(--hw-gray-400)',
            borderRadius: 'var(--hw-radius-sm)',
            padding: '.5rem',
            background: 'var(--hw-gray-100)',
          }}>
            <OverviewPage eyebrow="Example subject" title="Topic title" blurb="One-paragraph intro to the topic; frames why it matters and what the sections cover.">
              <OverviewGroup label="Group A · shared concept" accent="gray">
                <OverviewSection
                  eyebrow="01"
                  title="First idea"
                  blurb="Short description; what this section introduces and how it sets up the next one."
                  takeaways={[<>Key takeaway one.</>, <>Key takeaway two.</>]}
                  links={[{ to: '#', label: 'Example lesson' }]}
                  hero={
                    <svg viewBox="0 0 200 120" role="img" aria-label="placeholder hero">
                      <rect x="10" y="10" width="180" height="100" rx="8" fill="var(--hw-gray-100)" stroke="var(--hw-border)" />
                      <text x="100" y="66" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--hw-gray-700)">hero goes here</text>
                    </svg>
                  }
                  watermark={
                    <svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice"><g fill="currentColor" fontFamily="monospace" fontSize="60" fontWeight="900"><text x="20" y="80">◆</text><text x="120" y="160">◆</text><text x="220" y="240">◆</text></g></svg>
                  }
                  accent="gray"
                />
                <OverviewConnector />
                <OverviewSection
                  eyebrow="02"
                  title="Second idea"
                  blurb="Follows from the first; this is where a connector often helps."
                  hero={<svg viewBox="0 0 200 120" role="img"><circle cx="100" cy="60" r="36" fill="var(--hw-red)" opacity=".25" /><text x="100" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--hw-red)">hero slot</text></svg>}
                  accent="gray"
                />
              </OverviewGroup>

              <OverviewGroup label="Group B · sibling concept" accent="gold">
                <OverviewSection
                  eyebrow="03"
                  title="Related idea"
                  blurb="Sits alongside the previous group as a parallel concept; no connector needed."
                  accent="gold"
                  hero={<svg viewBox="0 0 200 120" role="img"><rect x="40" y="30" width="120" height="60" rx="8" fill="var(--hw-gold)" opacity=".3" /><text x="100" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7a4c00">hero slot</text></svg>}
                />
              </OverviewGroup>
            </OverviewPage>
          </div>

          <h3 className="h6" style={{ marginTop: '1.25rem' }}>Component API</h3>
          <table className="table table--sm">
            <thead>
              <tr><th>Component</th><th>Role</th><th>Key props</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>OverviewPage</code></td>
                <td>Shell — title, eyebrow, intro paragraph, optional back button.</td>
                <td className="muted"><code>title</code>, <code>eyebrow</code>, <code>blurb</code>, <code>backTo</code>, <code>backLabel</code></td>
              </tr>
              <tr>
                <td><code>OverviewGroup</code></td>
                <td>Visually bands related sections together with a labeled accent bar.</td>
                <td className="muted"><code>label</code>, <code>accent</code>: <code>gray</code> | <code>red</code> | <code>gold</code> | <code>black</code></td>
              </tr>
              <tr>
                <td><code>OverviewSection</code></td>
                <td>One two-column section: copy left, hero right, faded watermark behind.</td>
                <td className="muted"><code>eyebrow</code>, <code>title</code>, <code>blurb</code>, <code>takeaways</code>, <code>links</code>, <code>hero</code>, <code>watermark</code>, <code>accent</code></td>
              </tr>
              <tr>
                <td><code>OverviewConnector</code></td>
                <td>Drop between sections where the narrative genuinely chains (not between siblings).</td>
                <td className="muted"><code>accent</code> to tint the arrow</td>
              </tr>
            </tbody>
          </table>

          <h3 className="h6" style={{ marginTop: '1.25rem' }}>Routing convention</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            Each subject's overview lives at <code>/&lt;subject&gt;/overview</code>. If that subject has no
            overview yet, the route redirects back to <code>/#subject-&lt;key&gt;</code> and the Home page
            scrolls to the matching card. Clicking a subject title on the Home page navigates to its
            overview; clicking the rest of the card opens the subject's widget index as before. Overviews
            aren't advertised as separate cards.
          </p>
          <p className="muted">
            Live example: <a className="link" href="/code/overview">/code/overview</a> (Cryptography).
          </p>
        </section>
      </div>
    </main>
  )
}



