import { Link } from 'react-router-dom'

const LESSON_AREAS = [
  {
    key: 'computer-science',
    to: '/teaching-resources/lessons/computer-science',
    title: 'Computer Science',
    blurb: 'Lesson presentations for computer science courses, including Honors Topics in Computer Science.',
  },
]

export default function Lessons() {
  return (
    <main className="page">
      <div className="container widgets-page">
        <h1 className="h1">Lessons</h1>
        <p className="muted" style={{ marginTop: '.25rem' }}>
          Classroom lessons grouped by subject.
        </p>

        <h2 className="h5 eyebrow" style={{ marginTop: '2rem' }}>Subjects</h2>
        <div className="widgets-grid">
          {LESSON_AREAS.map(area => (
            <Link key={area.key} id={`lessons-${area.key}`} className="widget-card" to={area.to}>
              <div className="title-row">
                <h3>{area.title}</h3>
              </div>
              <p>{area.blurb}</p>
              <span className="button">Open</span>
            </Link>
          ))}
        </div>

        <h2 className="h5 eyebrow" style={{ marginTop: '2rem' }}>Outcomes</h2>
        <div className="widgets-grid">
          <Link className="widget-card" to="/teaching-resources/lessons/interdisciplinary-outcomes">
            <div className="title-row">
              <h3>Interdisciplinary</h3>
            </div>
            <p>Explore projected student overlap and teacher requirements for interdisciplinary cohort scheduling.</p>
            <span className="button">Open</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
