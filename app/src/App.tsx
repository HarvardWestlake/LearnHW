import { Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Chem from './pages/Chem.tsx'
import Econ from './pages/Econ.tsx'
import Math from './pages/Math.tsx'
import Code from './pages/Code.tsx'
import Stats from './pages/Stats.tsx'
import StaticEmbed from './pages/StaticEmbed.tsx'
import WidgetRoute from './pages/WidgetRoute.tsx'
import ArrayListVisualizer from './pages/ArrayListVisualizer.tsx'
import BinaryExplorer from './pages/BinaryExplorer.tsx'
import Sha1FlowExplorer from './pages/Sha1FlowExplorer.tsx'
import HtcsUnit6Day4React from './pages/HtcsUnit6Day4React.tsx'
import HtcsUnit6Day5React from './pages/HtcsUnit6Day5React.tsx'
import { CODE_WIDGETS, HISTORY_WIDGETS, HTCS_LESSON_WIDGETS, MATH_WIDGETS, STATS_WIDGETS } from './pages/widgetMaps'
import HtcsLessons from './pages/HtcsLessons.tsx'
import History from './history/History.tsx'
import WorldGlobe from './history/WorldGlobe.tsx'
import LectureViewer from './history/LectureViewer.tsx'
import StyleGuide from './admin/StyleGuide.tsx'
import MobileFullscreen from './pages/MobileFullscreen.tsx'
import Cryptography from './pages/overviews/Cryptography.tsx'

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z" fill="currentColor" />
    </svg>
  )
}

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/math': 'Math',
  '/code': 'Computer Science',
  '/code/htcs-lessons': 'HTCS Lessons',
  '/stats': 'Statistics',
  '/chem': 'Chemistry',
  '/econ': 'Economics',
  '/history': 'History',
}

function TopNav() {
  const { pathname } = useLocation()
  const parentPath = pathname === '/' ? null : (pathname.slice(0, pathname.lastIndexOf('/')) || '/')
  const parentLabel = parentPath ? (PAGE_NAMES[parentPath] ?? 'Back') : null

  return (
    <header className="hw-topnav">
      <div className="container container--wide hw-topnav__inner" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavLink to="/" end className={({ isActive }) => `hw-nav__link${isActive ? ' active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HomeIcon />
          </NavLink>
          {parentLabel && (
            <Link to={parentPath!} className="hw-nav__link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← {parentLabel}
            </Link>
          )}
        </div>
        <Link to="/" className="hw-brand" style={{ textAlign: 'center' }}>Harvard‑Westlake</Link>
        <nav className="hw-nav" style={{ justifyContent: 'flex-end' }}>
          <NavLink to="/mobile" className={({ isActive }) => `hw-nav__link${isActive ? ' active' : ''}`}>Mobile Fullscreen</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const hideChrome = pathname.startsWith('/code/htcs-lessons/day') && pathname.endsWith('-react')

  return (
    <>
      {!hideChrome ? <TopNav /> : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="math" element={<Math />} />
        <Route path="math/overview" element={<Navigate to="/#subject-math" replace />} />
        <Route path="math/:widget" element={<WidgetRoute widgets={MATH_WIDGETS} backTo="/math" />} />
        <Route path="code" element={<Code />} />
        <Route path="code/overview" element={<Cryptography />} />
        <Route path="code/array-list" element={<ArrayListVisualizer />} />
        <Route path="code/binary-explorer" element={<BinaryExplorer />} />
        <Route path="code/sha1-flow-explorer" element={<Sha1FlowExplorer />} />
        <Route path="code/htcs-lessons" element={<HtcsLessons />} />
        <Route path="code/htcs-lessons/day4-react" element={<HtcsUnit6Day4React />} />
        <Route path="code/htcs-lessons/day5-react" element={<HtcsUnit6Day5React />} />
        <Route path="code/htcs-lessons/:widget" element={<WidgetRoute widgets={HTCS_LESSON_WIDGETS} backTo="/code/htcs-lessons" />} />
        <Route path="code/:widget" element={<WidgetRoute widgets={CODE_WIDGETS} backTo="/code" />} />
        <Route path="stats" element={<Stats />} />
        <Route path="stats/overview" element={<Navigate to="/#subject-stats" replace />} />
        <Route path="stats/:widget" element={<WidgetRoute widgets={STATS_WIDGETS} backTo="/stats" />} />
        <Route path="chem" element={<Chem />} />
        <Route path="chem/overview" element={<Navigate to="/#subject-chem" replace />} />
        <Route path="chem/crystallization" element={<StaticEmbed title="Crystallization Explorer" src="/static/chem/crystallization/crystallization.html" />} />
        <Route path="econ" element={<Econ />} />
        <Route path="econ/overview" element={<Navigate to="/#subject-econ" replace />} />
        <Route path="econ/imperfect-competitor" element={<StaticEmbed title="Imperfect Competitor" src="/static/econ/widgets/imperfect-competitor/imperfect-competitor.html" />} />
        <Route path="econ/production-cost" element={<StaticEmbed title="Production Cost" src="/static/econ/widgets/production-cost/production-cost.html" />} />
        <Route path="admin" element={<StyleGuide />} />
        <Route path="mobile" element={<MobileFullscreen />} />
        <Route path="history" element={<History />} />
        <Route path="history/overview" element={<Navigate to="/#subject-history" replace />} />
        <Route path="history/world" element={<WorldGlobe />} />
        <Route path="history/lecture" element={<LectureViewer />} />
        <Route path="history/widgets/:widget" element={<WidgetRoute widgets={HISTORY_WIDGETS} backTo="/history" />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!hideChrome ? (
        <footer className="hw-footer">
          <div className="container container--wide">
            <div className="muted">© Harvard‑Westlake · Demo UI</div>
          </div>
        </footer>
      ) : null}
    </>
  )
}
 
