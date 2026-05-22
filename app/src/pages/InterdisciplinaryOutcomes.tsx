import { useMemo, useState } from 'react'

function binom(n: number, k: number, p: number) {
  if (p < 0 || p > 1) return 0

  let coeff = 1
  for (let i = 1; i <= k; i += 1) {
    coeff = coeff * (n - i + 1) / i
  }

  return coeff * (p ** k) * ((1 - p) ** (n - k))
}

function clampProbability(value: number) {
  return Math.min(1, Math.max(0, value))
}

function ProbabilityBar({
  label,
  percentage,
  highlight = false,
}: {
  label: string
  percentage: number
  highlight?: boolean
}) {
  return (
    <div className="outcomes-bar-row">
      <div className="outcomes-bar-label">{label}</div>
      <div className="outcomes-bar-wrapper">
        <div
          className={`outcomes-bar-fill${highlight ? ' outcomes-bar-fill--highlight' : ''}`}
          style={{ width: `${percentage.toFixed(1)}%` }}
        >
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function SectionGroup({ label }: { label: string }) {
  return (
    <div className="outcomes-section-group">
      <span />
      <span>{label}</span>
      <span />
    </div>
  )
}

export default function InterdisciplinaryOutcomes() {
  const [teachers, setTeachers] = useState(15)
  const [sections, setSections] = useState(3.3)
  const [totalSections, setTotalSections] = useState(359)
  const [target, setTarget] = useState(28)

  const projection = useMemo(() => {
    const p = clampProbability((teachers * sections) / totalSections)

    const day1 = {
      none: binom(3, 0, p) * 100,
      one: binom(3, 1, p) * 100,
      two: binom(3, 2, p) * 100,
      three: binom(3, 3, p) * 100,
    }
    const day1TwoPlus = day1.two + day1.three

    const day2 = {
      none: binom(4, 0, p) * 100,
      one: binom(4, 1, p) * 100,
      two: binom(4, 2, p) * 100,
      three: binom(4, 3, p) * 100,
      four: binom(4, 4, p) * 100,
    }
    const day2TwoPlus = day2.two + day2.three + day2.four

    const currentImpact = (
      (day1TwoPlus / 100)
      + (day2TwoPlus / 100)
      - ((day1TwoPlus / 100) * (day2TwoPlus / 100))
    ) * 100

    let teachersNeeded = 0
    for (let teacherCount = 1; teacherCount <= 150; teacherCount += 1) {
      const projectedP = clampProbability((teacherCount * sections) / totalSections)
      const projectedDay1 = binom(3, 2, projectedP) + binom(3, 3, projectedP)
      const projectedDay2 = binom(4, 2, projectedP) + binom(4, 3, projectedP) + binom(4, 4, projectedP)
      const projectedCombined = projectedDay1 + projectedDay2 - (projectedDay1 * projectedDay2)

      if (projectedCombined >= target / 100) {
        teachersNeeded = teacherCount
        break
      }
    }

    return { currentImpact, day1, day2, teachersNeeded }
  }, [teachers, sections, totalSections, target])

  return (
    <main className="page">
      <div className="container outcomes-container">
        <h1 className="h2">Interdisciplinary Impact Explorer</h1>
        <p className="muted" style={{ marginTop: '.25rem' }}>
          Interactive projection for student cohort scheduling and teacher requirements.
        </p>

        <SectionGroup label="Inputs" />

        <div className="outcomes-grid">
          <div>
            <section className="panel outcomes-panel">
              <h2 className="h5 eyebrow">Variables</h2>

              <label className="outcomes-control">
                <span className="outcomes-control__header">
                  <span>Participating Teachers</span>
                  <span>{teachers}</span>
                </span>
                <input className="range" type="range" min="1" max="50" value={teachers} step="1" onChange={event => setTeachers(Number(event.target.value))} />
              </label>

              <label className="outcomes-control">
                <span className="outcomes-control__header">
                  <span>Sections per Teacher</span>
                  <span>{sections.toFixed(1)}</span>
                </span>
                <input className="range" type="range" min="1" max="6" value={sections} step="0.1" onChange={event => setSections(Number(event.target.value))} />
              </label>

              <label className="outcomes-control">
                <span className="outcomes-control__header">
                  <span>Total School Sections</span>
                  <span>{totalSections}</span>
                </span>
                <input className="range" type="range" min="100" max="800" value={totalSections} step="1" onChange={event => setTotalSections(Number(event.target.value))} />
              </label>
            </section>

            <section className="panel outcomes-panel">
              <h2 className="h5 eyebrow">Goal Setting</h2>
              <label className="outcomes-control outcomes-control--last outcomes-control--target">
                <span className="outcomes-control__header">
                  <span>Target Student Overlap %</span>
                  <span>{target}%</span>
                </span>
                <input className="range" type="range" min="5" max="60" value={target} step="1" onChange={event => setTarget(Number(event.target.value))} />
              </label>
              <p className="helper-text">Target percentage of students experiencing 2+ cohort classes in a single day.</p>
            </section>
          </div>

          <div>
            <div className="outcomes-kpi-grid">
              <div className="outcomes-kpi">
                <div className="outcomes-kpi__value">{projection.currentImpact.toFixed(1)}%</div>
                <div className="outcomes-kpi__label">Current Impact (2+ Classes)</div>
              </div>
              <div className="outcomes-kpi outcomes-kpi--target">
                <div className="outcomes-kpi__value">{projection.teachersNeeded}</div>
                <div className="outcomes-kpi__label">Teachers Needed for Target</div>
              </div>
            </div>

            <section className="panel outcomes-panel">
              <h2 className="h5 eyebrow">Probability Breakdown</h2>

              <div className="outcomes-chart-section">
                <h3 className="h6">Day 1 Schedule (3 Periods)</h3>
                <ProbabilityBar label="0 Teachers (No overlap)" percentage={projection.day1.none} />
                <ProbabilityBar label="1 Teacher" percentage={projection.day1.one} />
                <ProbabilityBar label="2 Teachers" percentage={projection.day1.two} highlight />
                <ProbabilityBar label="3 Teachers" percentage={projection.day1.three} highlight />
              </div>

              <div className="outcomes-chart-section">
                <h3 className="h6">Day 2 Schedule (4 Periods)</h3>
                <ProbabilityBar label="0 Teachers (No overlap)" percentage={projection.day2.none} />
                <ProbabilityBar label="1 Teacher" percentage={projection.day2.one} />
                <ProbabilityBar label="2 Teachers" percentage={projection.day2.two} highlight />
                <ProbabilityBar label="3 Teachers" percentage={projection.day2.three} highlight />
                <ProbabilityBar label="4 Teachers" percentage={projection.day2.four} highlight />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
