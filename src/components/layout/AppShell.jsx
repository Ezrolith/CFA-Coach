import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/',          label: 'Library' },
  { to: '/review',    label: 'Daily Review' },
  { to: '/quiz',      label: 'Practice' },
  { to: '/mock-exam', label: 'Mock Exam' },
  { to: '/progress',  label: 'Progress' },
];

export default function AppShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-ink-950">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-ink-950/70 border-b border-ink-200/70 dark:border-ink-800/70">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Logomark />
            <span className="font-display font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              CFA·Coach
            </span>
            <span className="hidden sm:inline-flex pill-muted text-[10px] uppercase tracking-wider ml-1">
              Level 1
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => {
              const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ease-out-soft',
                    active
                      ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                      : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50 hover:bg-ink-100/60 dark:hover:bg-ink-900/60',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn-ghost !px-2 !py-2" aria-label="Settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink-200/70 dark:border-ink-800/70 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-ink-500">
          <div>CFA·Coach — Level 1 study companion · v0.5</div>
          <div className="hidden sm:block">CFA® is a trademark of CFA Institute. This tool is independent.</div>
        </div>
      </footer>
    </div>
  );
}

function Logomark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-ink-900 dark:text-ink-50">
      <rect x="2"  y="13" width="3" height="8" rx="1" fill="currentColor" opacity="0.45"/>
      <rect x="7"  y="9"  width="3" height="12" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="12" y="5"  width="3" height="16" rx="1" fill="currentColor"/>
      <rect x="17" y="2"  width="3" height="19" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}
