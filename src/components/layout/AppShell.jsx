import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CommandPalette from './CommandPalette';

const NAV = [
  { to: '/',                 label: 'Library' },
  { to: '/review',           label: 'Daily Review' },
  { to: '/quiz',             label: 'Practice' },
  { to: '/drills/formulas',  label: 'Formulas' },
  { to: '/drills/ethics',    label: 'Ethics' },
  { to: '/mock-exam',        label: 'Mock Exam' },
  { to: '/progress',         label: 'Progress' },
];

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Prevent body scroll while drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-ink-950">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-ink-950/70 border-b border-ink-200/70 dark:border-ink-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <Logomark />
            <span className="font-display font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              CFA·Coach
            </span>
            <span className="hidden sm:inline-flex pill-muted text-[10px] uppercase tracking-wider ml-1">
              Level 1
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
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

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs text-ink-500 hover:text-ink-900 dark:hover:text-ink-50 bg-ink-100/60 hover:bg-ink-100 dark:bg-ink-900/60 dark:hover:bg-ink-900 rounded-full transition-colors"
              aria-label="Search"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>Search</span>
              <kbd className="text-[9px] uppercase tracking-wider opacity-70">⌘K</kbd>
            </button>
            <Link to="/settings" className="btn-ghost !px-2 !py-2" aria-label="Settings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden btn-ghost !px-2 !py-2"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-white dark:bg-ink-950 border-l border-ink-200 dark:border-ink-800 shadow-xl flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 border-b border-ink-100 dark:border-ink-800/60">
              <span className="font-display font-semibold tracking-tight text-ink-900 dark:text-ink-50">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn-ghost !px-2 !py-2"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV.map(item => {
                const active = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={[
                      'block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      active
                        ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                        : 'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-900',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-3 border-t border-ink-100 dark:border-ink-800/60">
                <Link
                  to="/settings"
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-900 transition-colors"
                >
                  Settings
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>
      <CommandPalette />

      <footer className="border-t border-ink-200/70 dark:border-ink-800/70 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-xs text-ink-500 flex-wrap gap-2">
          <div>CFA·Coach — Level 1 study companion · v0.7</div>
          <div className="hidden sm:block">CFA® is a trademark of CFA Institute. This tool is independent.</div>
        </div>
      </footer>
    </div>
  );
}

function Logomark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-ink-900 dark:text-ink-50 flex-shrink-0">
      <rect x="2"  y="13" width="3" height="8" rx="1" fill="currentColor" opacity="0.45"/>
      <rect x="7"  y="9"  width="3" height="12" rx="1" fill="currentColor" opacity="0.7"/>
      <rect x="12" y="5"  width="3" height="16" rx="1" fill="currentColor"/>
      <rect x="17" y="2"  width="3" height="19" rx="1" fill="currentColor" opacity="0.9"/>
    </svg>
  );
}
