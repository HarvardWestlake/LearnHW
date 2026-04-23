import { useState } from 'react'
import { OverviewPage, OverviewGroup, OverviewSection, OverviewConnector } from '../components/overview'
import { IconCpu, IconMemory, IconBinary, IconInbox, IconSearch } from '../components/icons'

export default function StyleGuide() {
  const [activeTab, setActiveTab] = useState(0)
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)
  const [activeSeg, setActiveSeg] = useState(0)
  const [activeCard, setActiveCard] = useState(0)
  const primaryTokens = [
    { name: '--hw-brand-black', value: '#000000', cmyk: 'CMYK 0 0 0 100', bg: 'var(--hw-brand-black)', light: true },
    { name: '--hw-brand-red', value: '#DA0016', cmyk: 'Pantone 186 C · CMYK 12 100 91 3', bg: 'var(--hw-brand-red)', light: true },
    { name: '--hw-brand-gold', value: '#EDA300', cmyk: 'Pantone 124 C · CMYK 7 36 100 0', bg: 'var(--hw-brand-gold)', light: false },
  ]
  const secondaryTokens = [
    { name: '--hw-secondary-blue', value: '#539ADC', cmyk: 'Pantone 646 C · 100%', bg: 'var(--hw-secondary-blue)', light: false },
    { name: '--hw-secondary-blue-50', value: 'rgb(83 154 220 / 50%)', cmyk: 'Pantone 646 C · 50%', bg: 'var(--hw-secondary-blue-50)', light: false },
    { name: '--hw-secondary-blue-20', value: 'rgb(83 154 220 / 20%)', cmyk: 'Pantone 646 C · 20%', bg: 'var(--hw-secondary-blue-20)', light: false },
    { name: '--hw-secondary-black', value: '#4D4D4D', cmyk: '70% Black · 100%', bg: 'var(--hw-secondary-black)', light: true },
    { name: '--hw-secondary-black-50', value: 'rgb(77 77 77 / 50%)', cmyk: '70% Black · 50%', bg: 'var(--hw-secondary-black-50)', light: false },
    { name: '--hw-secondary-black-20', value: 'rgb(77 77 77 / 20%)', cmyk: '70% Black · 20%', bg: 'var(--hw-secondary-black-20)', light: false },
    { name: '--hw-secondary-khaki', value: '#BFC299', cmyk: 'Pantone 452 C · 100%', bg: 'var(--hw-secondary-khaki)', light: false },
    { name: '--hw-secondary-khaki-50', value: 'rgb(191 194 153 / 50%)', cmyk: 'Pantone 452 C · 50%', bg: 'var(--hw-secondary-khaki-50)', light: false },
    { name: '--hw-secondary-khaki-20', value: 'rgb(191 194 153 / 20%)', cmyk: 'Pantone 452 C · 20%', bg: 'var(--hw-secondary-khaki-20)', light: false },
    { name: '--hw-secondary-orange', value: '#FA7300', cmyk: 'Pantone 144 C · 100%', bg: 'var(--hw-secondary-orange)', light: false },
    { name: '--hw-secondary-orange-50', value: 'rgb(250 115 0 / 50%)', cmyk: 'Pantone 144 C · 50%', bg: 'var(--hw-secondary-orange-50)', light: false },
    { name: '--hw-secondary-orange-20', value: 'rgb(250 115 0 / 20%)', cmyk: 'Pantone 144 C · 20%', bg: 'var(--hw-secondary-orange-20)', light: false },
    { name: '--hw-secondary-green', value: '#9CCA00', cmyk: 'Pantone 383 C · 100%', bg: 'var(--hw-secondary-green)', light: false },
    { name: '--hw-secondary-green-50', value: 'rgb(156 202 0 / 50%)', cmyk: 'Pantone 383 C · 50%', bg: 'var(--hw-secondary-green-50)', light: false },
    { name: '--hw-secondary-green-20', value: 'rgb(156 202 0 / 20%)', cmyk: 'Pantone 383 C · 20%', bg: 'var(--hw-secondary-green-20)', light: false },
  ]
  const heapMemoryBg = {
    token: 'color-mix(12% khaki, 88% white)',
    bg: 'color-mix(in srgb, var(--hw-secondary-khaki) 12%, white)',
    border: 'var(--hw-secondary-khaki-50)',
  }

  return (
    <main className="page styleguide-page">
      <div className="container styleguide">
        <h1 className="h2">Style Guide</h1>

        {/* Widget Layout */}
        <section className="panel">
          <h2 className="h5 eyebrow">Widget Layout</h2>
          <p className="muted">
            Two-column interactive widget shell: a fixed-width <code>.sidebar</code> on the left for controls,
            and a fluid <code>.chartarea</code> on the right for the visualization. Wrap both in{' '}
            <code>.controls-container</code>. On narrow screens they stack vertically.
          </p>
          <div className="controls-container" style={{ marginTop: '1rem', pointerEvents: 'none', opacity: 0.85 }}>
            <aside className="sidebar">
              <div className="panel">
                <h3 className="h5 eyebrow" style={{ marginBottom: '.5rem' }}>Controls</h3>
                <div className="stack-sm">
                  <div>
                    <label className="label" htmlFor="sg-input">Label</label>
                    <input id="sg-input" className="input" placeholder="Input field" readOnly />
                  </div>
                  <button className="btn btn--block">Primary action</button>
                  <div className="divider" />
                  <button className="btn btn--outline btn--block">Secondary action</button>
                  <div>
                    <label className="label" htmlFor="sg-range">Speed</label>
                    <input id="sg-range" type="range" className="range" defaultValue={50} />
                  </div>
                </div>
              </div>
              <div className="panel">
                <h3 className="h5 eyebrow" style={{ marginBottom: '.5rem' }}>Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric"><span className="metric__label">Size</span><span className="metric__value">12</span></div>
                  <div className="metric"><span className="metric__label">Capacity</span><span className="metric__value">20</span></div>
                </div>
              </div>
              <div className="panel">
                <h3 className="h5 eyebrow" style={{ marginBottom: '.5rem' }}>Legend</h3>
                <div className="legend-key">
                  <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-red)' }} />Active</div>
                  <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-gold)' }} />Modified</div>
                  <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-secondary-khaki-50)' }} />Free</div>
                </div>
              </div>
            </aside>
            <div className="chartarea" style={{ minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="muted" style={{ textAlign: 'center' }}>Visualization canvas / grid goes here</p>
            </div>
          </div>
          <div className="stack-sm" style={{ marginTop: '1rem', fontSize: '.9rem' }}>
            <p><code>.controls-container</code> — flex row, wraps on mobile.</p>
            <p><code>.sidebar</code> — fixed 320 px, stacks its children with gap.</p>
            <p><code>.chartarea</code> — grows to fill remaining width; white card with shadow.</p>
          </div>
        </section>

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

        {/* Color Tokens */}
        <section className="panel">
          <h2 className="h5 eyebrow">Color Tokens</h2>
          <p className="muted">
            Approved brand palette only. Primary colors stay solid; every secondary color ships in 100%, 50%, and 20% opacity tokens.
          </p>
          <div className="stack-md" style={{ marginTop: '1rem' }}>
            <div>
              <h3 className="h6">Primary</h3>
              <div className="token-grid" style={{ marginTop: '.75rem' }}>
                {primaryTokens.map(t => (
                  <div className="token-swatch" key={t.name}>
                    <div className="token-swatch__color" style={{ background: t.bg, display: 'flex', alignItems: 'flex-end', padding: '4px 6px' }}>
                      <span style={{ fontSize: '.6rem', fontWeight: 700, color: t.light ? 'white' : 'var(--hw-brand-black)', fontFamily: 'monospace' }}>{t.value}</span>
                    </div>
                    <div className="token-swatch__label">
                      {t.name.replace('--', '')}
                      <span className="token-swatch__hex">{t.value}</span>
                      <span className="token-swatch__meta">{t.cmyk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="h6">Secondary</h3>
              <div className="token-grid" style={{ marginTop: '.75rem' }}>
                {secondaryTokens.map(t => (
                  <div className="token-swatch" key={t.name}>
                    <div className="token-swatch__color" style={{ background: t.bg, display: 'flex', alignItems: 'flex-end', padding: '4px 6px' }}>
                      <span style={{ fontSize: '.6rem', fontWeight: 700, color: t.light ? 'white' : 'var(--hw-brand-black)', fontFamily: 'monospace' }}>{t.value}</span>
                    </div>
                    <div className="token-swatch__label">
                      {t.name.replace('--', '')}
                      <span className="token-swatch__hex">{t.value}</span>
                      <span className="token-swatch__meta">{t.cmyk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Code Blocks */}
        <section className="panel">
          <h2 className="h5 eyebrow">Code Blocks</h2>
          <p className="muted">Dark-background block for multi-line code; inline <code>code</code> for short snippets.</p>
          <div className="stack-md" style={{ marginTop: '1rem' }}>
            <pre className="code-block">
              <span className="code-block__lang">Java</span>
{`public static int factorial(int n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`}
            </pre>
            <pre className="code-block">
              <span className="code-block__lang">Python</span>
{`def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1`}
            </pre>
            <p>Inline: use <code>arr[i]</code> to access the <code>i</code>-th element in <code>O(1)</code> time.</p>
          </div>
        </section>

        {/* Tabs */}
        <section className="panel">
          <h2 className="h5 eyebrow">Tabs</h2>
          <p className="muted">Horizontal tab strip for switching between views within a panel.</p>
          <div style={{ marginTop: '1rem' }}>
            <div className="tabs">
              {['Overview', 'Code', 'Output'].map((label, i) => (
                <button key={label} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{label}</button>
              ))}
            </div>
            <div className={`tab-panel${activeTab === 0 ? ' active' : ''}`}>
              <p className="muted">This is the <strong>Overview</strong> tab. Describe the concept or module here.</p>
            </div>
            <div className={`tab-panel${activeTab === 1 ? ' active' : ''}`}>
              <pre className="code-block"><span className="code-block__lang">Java</span>{`// Example code tab\nint x = 42;`}</pre>
            </div>
            <div className={`tab-panel${activeTab === 2 ? ' active' : ''}`}>
              <p className="muted">Program output or results appear here.</p>
            </div>
          </div>
        </section>

        {/* Tooltips */}
        <section className="panel">
          <h2 className="h5 eyebrow">Tooltips</h2>
          <p className="muted">Hover any element wrapped in <code>.tooltip-wrap</code> to reveal the label.</p>
          <div className="stack-sm" style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="tooltip-wrap">
              <button className="btn btn--sm">Hover me</button>
              <span className="tooltip-tip">Primary action</span>
            </span>
            <span className="tooltip-wrap">
              <button className="btn btn--outline btn--sm">What does this do?</button>
              <span className="tooltip-tip">Cancels the operation</span>
            </span>
            <span className="tooltip-wrap">
              <span className="badge badge--accent">NEW</span>
              <span className="tooltip-tip">Added in v2.4</span>
            </span>
          </div>
        </section>

        {/* Toasts */}
        <section className="panel">
          <h2 className="h5 eyebrow">Toasts & Notifications</h2>
          <p className="muted">Dismissable floating messages for feedback after an action.</p>
          <div className="toast-stack" style={{ marginTop: '1rem' }}>
            <div className="toast toast--info">
              <span className="toast__icon">ℹ</span>
              <span>Your session will expire in 10 minutes.</span>
              <button className="toast__close" aria-label="Dismiss">✕</button>
            </div>
            <div className="toast toast--success">
              <span className="toast__icon">✓</span>
              <span>Widget saved successfully.</span>
              <button className="toast__close" aria-label="Dismiss">✕</button>
            </div>
            <div className="toast toast--warning">
              <span className="toast__icon">⚠</span>
              <span>Unsaved changes will be lost.</span>
              <button className="toast__close" aria-label="Dismiss">✕</button>
            </div>
            <div className="toast toast--error">
              <span className="toast__icon">✕</span>
              <span>Failed to load resource. Try again.</span>
              <button className="toast__close" aria-label="Dismiss">✕</button>
            </div>
          </div>
        </section>

        {/* Progress */}
        <section className="panel">
          <h2 className="h5 eyebrow">Progress Bars</h2>
          <p className="muted">For completion, loading, and numeric progress.</p>
          <div className="stack-md" style={{ marginTop: '1rem' }}>
            <div className="progress-labeled">
              <div className="progress-labeled__header"><span>Lesson Progress</span><span>65%</span></div>
              <div className="progress"><div className="progress__bar" style={{ width: '65%' }} /></div>
            </div>
            <div className="progress-labeled">
              <div className="progress-labeled__header"><span>Score</span><span>90%</span></div>
              <div className="progress"><div className="progress__bar progress__bar--success" style={{ width: '90%' }} /></div>
            </div>
            <div className="progress-labeled">
              <div className="progress-labeled__header"><span>Gold milestone</span><span>40%</span></div>
              <div className="progress progress--lg"><div className="progress__bar progress__bar--gold" style={{ width: '40%' }} /></div>
            </div>
            <div className="progress progress--sm"><div className="progress__bar" style={{ width: '20%' }} /></div>
          </div>
        </section>

        {/* Accordion */}
        <section className="panel">
          <h2 className="h5 eyebrow">Accordion</h2>
          <p className="muted">Expandable panels for hints, FAQs, or collapsible content.</p>
          <div className="accordion" style={{ marginTop: '1rem' }}>
            {[
              { title: 'What is a hash function?', body: 'A hash function maps input data of arbitrary size to a fixed-size output. Good hash functions are deterministic, fast to compute, and produce uniform distributions.' },
              { title: 'Why is SHA-1 deprecated?', body: 'SHA-1 is vulnerable to collision attacks — two different inputs can produce the same hash. Modern systems use SHA-256 or SHA-3.' },
              { title: 'What is the difference between encryption and hashing?', body: 'Encryption is reversible (given the key); hashing is a one-way function. Hashing is used for integrity checks; encryption is used for confidentiality.' },
            ].map((item, i) => (
              <div className="accordion__item" key={i}>
                <button
                  className="accordion__trigger"
                  aria-expanded={openAccordion === i}
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                >
                  {item.title}
                  <svg className="accordion__chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openAccordion === i && <div className="accordion__body">{item.body}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Segmented Control */}
        <section className="panel">
          <h2 className="h5 eyebrow">Segmented Control</h2>
          <p className="muted">Compact tab-like toggle for switching between a small set of options.</p>
          <div className="stack-sm" style={{ marginTop: '1rem' }}>
            <div className="segment-group">
              {['8-bit', '16-bit', '32-bit', '64-bit'].map((label, i) => (
                <button key={label} className={`segment${activeSeg === i ? ' active' : ''}`} onClick={() => setActiveSeg(i)}>{label}</button>
              ))}
            </div>
            <div className="segment-group">
              {['Binary', 'Hex', 'Decimal'].map((label, i) => (
                <button key={label} className={`segment${i === 1 ? ' active' : ''}`}>{label}</button>
              ))}
            </div>
          </div>
        </section>

        {/* Selectable Cards */}
        <section className="panel">
          <h2 className="h5 eyebrow">Selectable Cards</h2>
          <p className="muted">Radio-button-style card grid for selecting a mode, system, or category.</p>
          <div className="grid grid-3@md gap-md" style={{ marginTop: '1rem' }}>
            {([
              { icon: <IconBinary size={28} />, title: '8-bit', sub: 'Commodore 64 era' },
              { icon: <IconCpu size={28} />,    title: '32-bit', sub: 'Modern standard' },
              { icon: <IconMemory size={28} />, title: '64-bit', sub: 'Current processors' },
            ] as const).map((card, i) => (
              <div key={i} className={`selectable-card${activeCard === i ? ' active' : ''}`} onClick={() => setActiveCard(i)}>
                <div className="selectable-card__icon">{card.icon}</div>
                <div className="selectable-card__title">{card.title}</div>
                <div className="selectable-card__sub">{card.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Callouts */}
        <section className="panel">
          <h2 className="h5 eyebrow">Callouts</h2>
          <p className="muted">Gold-bordered notes for educational hints and important caveats.</p>
          <div className="stack-sm" style={{ marginTop: '1rem' }}>
            <div className="callout">
              <div className="callout__title">Note</div>
              SHA-1 produces a 160-bit (20-byte) digest, always represented as a 40-character hex string.
            </div>
            <div className="callout callout--info">
              <div className="callout__title">Tip</div>
              Use the segmented control above to switch between binary, hex, and decimal views.
            </div>
            <div className="callout callout--error">
              <div className="callout__title">Warning</div>
              Do not use MD5 or SHA-1 for password hashing. Use bcrypt or Argon2 instead.
            </div>
          </div>
        </section>

        {/* Step Cards */}
        <section className="panel">
          <h2 className="h5 eyebrow">Step Cards</h2>
          <p className="muted">Numbered sequence cards for showing algorithm phases or process steps.</p>
          <div className="step-cards" style={{ marginTop: '1rem' }}>
            <div className="step-card">
              <div className="step-card__num">1</div>
              <div><p className="step-card__title">Pre-processing</p><p className="step-card__body">Pad the message to a multiple of 512 bits. Append the original length as a 64-bit integer.</p></div>
            </div>
            <div className="step-card">
              <div className="step-card__num">2</div>
              <div><p className="step-card__title">Chunk processing</p><p className="step-card__body">Break the padded message into 512-bit chunks and expand each into 80 32-bit words.</p></div>
            </div>
            <div className="step-card step-card--gold">
              <div className="step-card__num">3</div>
              <div><p className="step-card__title">Compression</p><p className="step-card__body">Run 80 rounds of mixing using bitwise operations, modular addition, and round constants.</p></div>
            </div>
            <div className="step-card step-card--gold">
              <div className="step-card__num">4</div>
              <div><p className="step-card__title">Final hash</p><p className="step-card__body">Concatenate the five 32-bit state variables to produce the 160-bit digest.</p></div>
            </div>
          </div>
        </section>

        {/* Stat Cards + Metrics */}
        <section className="panel">
          <h2 className="h5 eyebrow">Stat Cards & Metrics</h2>
          <p className="muted">At-a-glance numbers for dashboards, summaries, or algorithm stats.</p>
          <div className="grid grid-3@md gap-md" style={{ marginTop: '1rem' }}>
            <div className="stat-card">
              <span className="stat-card__label">Widgets</span>
              <span className="stat-card__value">24</span>
              <span className="stat-card__delta stat-card__delta--up">↑ 3 this month</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Digest size</span>
              <span className="stat-card__value">160</span>
              <span className="stat-card__delta">bits (SHA-1)</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Rounds</span>
              <span className="stat-card__value">80</span>
              <span className="stat-card__delta stat-card__delta--down">SHA-1 compression</span>
            </div>
          </div>
          <div className="metrics-grid" style={{ marginTop: '1rem' }}>
            <div className="metric"><span className="metric__label">Block size</span><span className="metric__value">512</span><span className="metric__note">bits</span></div>
            <div className="metric"><span className="metric__label">Word size</span><span className="metric__value">32</span><span className="metric__note">bits</span></div>
            <div className="metric"><span className="metric__label">Chunks</span><span className="metric__value">4</span><span className="metric__note">for "hello"</span></div>
            <div className="metric"><span className="metric__label">Rounds/chunk</span><span className="metric__value">80</span><span className="metric__note">4 phases × 20</span></div>
          </div>
        </section>

        {/* Chips + Divider */}
        <section className="panel">
          <h2 className="h5 eyebrow">Chips & Labeled Divider</h2>
          <p className="muted">Interactive removable tags and a divider with an inline label.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '1rem' }}>
            <span className="chip">Sorting</span>
            <span className="chip chip--active">Cryptography <button className="chip__remove" aria-label="Remove">✕</button></span>
            <span className="chip">Data Structures</span>
            <span className="chip chip--gold">SHA-1 <button className="chip__remove" aria-label="Remove">✕</button></span>
            <span className="chip">Recursion</span>
          </div>
          <div className="divider--labeled" style={{ marginTop: '1.25rem' }}>OR</div>
          <div className="divider--labeled" style={{ marginTop: '.75rem' }}>SECTION BREAK</div>
        </section>

        {/* Breadcrumb */}
        <section className="panel">
          <h2 className="h5 eyebrow">Breadcrumb</h2>
          <p className="muted">Navigation trail for deep pages.</p>
          <div className="stack-sm" style={{ marginTop: '1rem' }}>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <div className="breadcrumb__item"><a className="breadcrumb__link" href="#">Home</a><span className="breadcrumb__sep">/</span></div>
              <div className="breadcrumb__item"><a className="breadcrumb__link" href="#">Code</a><span className="breadcrumb__sep">/</span></div>
              <div className="breadcrumb__item"><span className="breadcrumb__current">SHA-1 Explorer</span></div>
            </nav>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <div className="breadcrumb__item"><a className="breadcrumb__link" href="#">Home</a><span className="breadcrumb__sep">/</span></div>
              <div className="breadcrumb__item"><a className="breadcrumb__link" href="#">Math</a><span className="breadcrumb__sep">/</span></div>
              <div className="breadcrumb__item"><a className="breadcrumb__link" href="#">Calculus</a><span className="breadcrumb__sep">/</span></div>
              <div className="breadcrumb__item"><span className="breadcrumb__current">Derivatives</span></div>
            </nav>
          </div>
        </section>

        {/* Skeleton Loader */}
        <section className="panel">
          <h2 className="h5 eyebrow">Skeleton Loader</h2>
          <p className="muted">Animated placeholder while content loads.</p>
          <div className="stack-md" style={{ marginTop: '1rem' }}>
            <div className="stack-sm">
              <span className="skeleton skeleton--heading" style={{ width: '45%' }} />
              <span className="skeleton skeleton--text" style={{ width: '90%' }} />
              <span className="skeleton skeleton--text" style={{ width: '75%' }} />
              <span className="skeleton skeleton--text" style={{ width: '60%' }} />
            </div>
            <div className="grid grid-3@md gap-md">
              <span className="skeleton skeleton--rect" />
              <span className="skeleton skeleton--rect" />
              <span className="skeleton skeleton--rect" />
            </div>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
              <span className="skeleton skeleton--circle" style={{ width: 40, height: 40, flexShrink: 0 }} />
              <div className="stack-xs" style={{ flex: 1 }}>
                <span className="skeleton skeleton--text" style={{ width: '50%' }} />
                <span className="skeleton skeleton--text" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Empty State */}
        <section className="panel">
          <h2 className="h5 eyebrow">Empty State</h2>
          <p className="muted">Placeholder for when a list or section has no content yet.</p>
          <div className="grid grid-2@md gap-md" style={{ marginTop: '1rem' }}>
            <div className="empty-state">
              <div className="empty-state__icon"><IconInbox size={40} /></div>
              <p className="empty-state__title">No widgets yet</p>
              <p className="empty-state__body">This subject doesn't have any interactive tools yet. Check back soon.</p>
              <button className="btn btn--sm">Browse all widgets</button>
            </div>
            <div className="empty-state">
              <div className="empty-state__icon"><IconSearch size={40} /></div>
              <p className="empty-state__title">No results</p>
              <p className="empty-state__body">Try adjusting your search or clearing the filters.</p>
              <button className="btn btn--outline btn--sm">Clear filters</button>
            </div>
          </div>
        </section>

        {/* Canvas Card + Legend */}
        <section className="panel">
          <h2 className="h5 eyebrow">Canvas Card & Legend</h2>
          <p className="muted">Container for canvas-based visualizations with a color-key legend below.</p>
          <div className="grid grid-2@md gap-md" style={{ marginTop: '1rem' }}>
            <div className="canvas-card">
              <span className="canvas-card__label">Memory Heap</span>
              <div className="canvas-card__area">canvas goes here</div>
            </div>
            <div className="canvas-card">
              <span className="canvas-card__label">Call Stack</span>
              <div className="canvas-card__area">canvas goes here</div>
            </div>
          </div>
          <div className="legend-key" style={{ marginTop: '1rem' }}>
            <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-red)' }} />Active node</div>
            <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-gold)' }} />Modified</div>
            <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-secondary-khaki)' }} />Free / null</div>
            <div className="legend-key__item"><span className="legend-key__dot" style={{ background: 'var(--hw-success)' }} />Visited</div>
          </div>
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
            border: '1px dashed var(--hw-secondary-khaki)',
            borderRadius: 'var(--hw-radius-sm)',
            padding: '.5rem',
            background: 'var(--hw-secondary-khaki-20)',
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
                      <rect x="10" y="10" width="180" height="100" rx="0" fill="var(--hw-secondary-khaki-20)" stroke="var(--hw-border)" />
                      <text x="100" y="66" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--hw-secondary-black)">hero goes here</text>
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
                  hero={<svg viewBox="0 0 200 120" role="img"><circle cx="100" cy="60" r="36" fill="var(--hw-brand-red-20)" /><text x="100" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--hw-red)">hero slot</text></svg>}
                  accent="gray"
                />
              </OverviewGroup>

              <OverviewGroup label="Group B · sibling concept" accent="gold">
                <OverviewSection
                  eyebrow="03"
                  title="Related idea"
                  blurb="Sits alongside the previous group as a parallel concept; no connector needed."
                  accent="gold"
                  hero={<svg viewBox="0 0 200 120" role="img"><rect x="40" y="30" width="120" height="60" rx="0" fill="var(--hw-brand-gold-20)" /><text x="100" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--hw-warning)">hero slot</text></svg>}
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

        {/* Memory Visualization — square grid tile pattern */}
        <section className="panel">
          <h2 className="h5 eyebrow">Memory Visualization — Grid Tile</h2>
          <p className="muted">
            Square cell grid for data-structure widgets that show a region of memory (ArrayList, HashMap, arrays, etc.).
            Wrap the grid in <code>.mem-viz-frame</code> with a <code>data-label</code> attribute for the red badge.
            Use <code>.mem-grid</code> for the inner grid; set <code>--mem-cols</code> to control column count.
            Planned use: hexadecimal memory viewer and future data-structure visualizers.
          </p>

          <div className="mem-viz-frame" data-label="Backing Array — Java Heap Memory" style={{ marginTop: '1.25rem' }}>
            <div className="mem-grid" style={{ '--mem-cols': '10' } as React.CSSProperties}>
              {/* Unused */}
              {Array.from({ length: 3 }, (_, i) => (
                <div key={`u${i}`} className="mem-cell" />
              ))}
              {/* Allocated */}
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`a${i}`} className="mem-cell mem-cell--allocated" />
              ))}
              {/* Filled */}
              {Array.from({ length: 2 }, (_, i) => (
                <div key={`f${i}`} className="mem-cell mem-cell--filled">{i === 0 ? '42' : 'hi'}</div>
              ))}
              {/* Current */}
              <div className="mem-cell mem-cell--allocated mem-cell--current">7</div>
            </div>
          </div>

          <div className="legend-key" style={{ marginTop: '1rem' }}>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ background: 'var(--hw-secondary-khaki-20)', border: '1px solid var(--hw-secondary-khaki-50)' }} />
              Unused memory
            </div>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ background: 'var(--hw-brand-red-20)', border: '2px solid var(--hw-red)' }} />
              Allocated (backing array capacity)
            </div>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ background: 'var(--hw-red)' }} />
              Filled slot (holds a value)
            </div>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ border: '2px solid var(--hw-gold)', boxShadow: '0 0 0 2px var(--hw-brand-gold-50)' }} />
              Current cell (being read/written)
            </div>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ background: 'var(--hw-success-20)', border: '2px solid var(--hw-success)' }} />
              Copy-in-progress (resize sweep)
            </div>
          </div>

          <div className="stack-sm" style={{ marginTop: '1rem', fontSize: '.9rem' }}>
            <p><code>.mem-viz-frame[data-label="..."]</code> — outer red-bordered panel; badge text comes from the attribute.</p>
            <p><code>.mem-grid</code> + <code>--mem-cols</code> — grid container; default 10 columns.</p>
            <p><code>.mem-cell</code> → <code>--allocated</code> → <code>--filled</code> → <code>--current</code> → <code>--copy</code> — cell states.</p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 className="h6">Preferred Heap Background</h3>
            <p className="muted" style={{ marginTop: '.35rem' }}>
              Heap memory preview using the softer container background while the bit-tile pattern stays on the current default background.
            </p>
            <div className="panel" style={{ padding: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem' }}>
                <div>
                  <div className="h6" style={{ marginBottom: '.15rem' }}>Heap Container</div>
                  <div className="muted"><code>{heapMemoryBg.token}</code></div>
                </div>
                <div
                  aria-hidden
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: heapMemoryBg.bg,
                    border: `1px solid ${heapMemoryBg.border}`,
                    flexShrink: 0,
                  }}
                />
              </div>

              <div style={{ marginTop: '.75rem', ['--hw-memory-grid-bg' as string]: heapMemoryBg.bg } as React.CSSProperties}>
                <div className="mem-viz-frame" data-label="Heap Sample">
                  <div className="mem-grid" style={{ '--mem-cols': '5', padding: '.75rem' } as React.CSSProperties}>
                    <div className="mem-cell" />
                    <div className="mem-cell mem-cell--allocated" />
                    <div className="mem-cell mem-cell--filled">42</div>
                    <div className="mem-cell mem-cell--allocated mem-cell--current">7</div>
                    <div className="mem-cell mem-cell--copy">A</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Cell — bit tile pattern */}
        <section className="panel">
          <h2 className="h5 eyebrow">Data Cell — Bit Tile</h2>
          <p className="muted">
            Rectangular bit tile for binary / low-level memory widgets where each cell represents a single bit in a word.
            Group 8 tiles in a <code>.bit-byte-group</code>, then arrange byte groups in a <code>.bit-word-container</code>.
            Used by the Binary Interpretation Explorer; planned reuse in the hexadecimal memory viewer.
          </p>

          <div style={{ marginTop: '1.25rem' }}>
            <div className="bit-word-container" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {(['00101010', '11001100', '11110000', '01010101'] as const).map((byte, bi) => (
                <div key={bi} className="bit-byte-group">
                  {byte.split('').map((bit, i) => (
                    <div
                      key={i}
                      className={`bit-tile ${bit === '1' ? 'bit-tile--one' : 'bit-tile--zero'}${bi === 0 && i === 2 ? ' bit-tile--highlight' : ''}`}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="legend-key" style={{ marginTop: '1rem' }}>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ background: 'var(--hw-secondary-khaki-20)', border: '1px solid var(--hw-secondary-khaki-50)' }} />
              0 — zero bit
            </div>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ background: 'var(--hw-red)' }} />
              1 — one bit
            </div>
            <div className="legend-key__item">
              <span className="legend-key__dot" style={{ border: '2px solid var(--hw-gold)', boxShadow: '0 0 0 2px var(--hw-brand-gold-50)' }} />
              Highlighted (hover / selection)
            </div>
          </div>

          <div className="stack-sm" style={{ marginTop: '1rem', fontSize: '.9rem' }}>
            <p><code>.bit-tile</code> + <code>.bit-tile--zero</code> / <code>.bit-tile--one</code> — the individual bit cell.</p>
            <p><code>.bit-tile--highlight</code> — gold ring highlight (applied via hover or interaction state).</p>
            <p><code>.bit-byte-group</code> — white card grouping 8 bits into one byte with a subtle border.</p>
            <p><code>.bit-word-container</code> — responsive grid of byte groups; default 4-column for 32-bit words.</p>
          </div>
        </section>

      </div>
    </main>
  )
}
