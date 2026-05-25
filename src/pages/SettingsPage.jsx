import { useEffect, useState } from 'react';
import { getStoredTheme, setTheme, subscribeTheme } from '../lib/theme';
import { clearAllProgress } from '../lib/progress';
import { useGlobalProgress } from '../hooks/useProgress';

const THEME_OPTIONS = [
  { id: 'light',  label: 'Light',  desc: 'Always light' },
  { id: 'dark',   label: 'Dark',   desc: 'Always dark' },
  { id: 'system', label: 'System', desc: 'Match OS preference' },
];

export default function SettingsPage() {
  const [stored, setStored] = useState(() => getStoredTheme() ?? 'system');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const { studiedIds, quizResults } = useGlobalProgress();

  useEffect(() => subscribeTheme(() => setStored(getStoredTheme() ?? 'system')), []);

  const onPickTheme = (id) => {
    setTheme(id);
    setStored(id);
  };

  const onReset = () => {
    clearAllProgress();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Settings</div>
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 leading-tight">
        Make it yours.
      </h1>

      {/* Appearance */}
      <section className="mt-10">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Appearance</h2>
        <div className="card p-2">
          <div className="grid grid-cols-3 gap-1">
            {THEME_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => onPickTheme(opt.id)}
                className={[
                  'rounded-xl px-4 py-3 text-left transition-colors duration-200',
                  stored === opt.id
                    ? 'bg-ink-100 dark:bg-ink-800 ring-1 ring-ink-300 dark:ring-ink-700'
                    : 'hover:bg-ink-50 dark:hover:bg-ink-900',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <ThemeIcon id={opt.id} />
                  <span className="text-sm font-medium text-ink-900 dark:text-ink-50">{opt.label}</span>
                </div>
                <div className="text-xs text-ink-500">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Account (placeholder for future Firebase Auth) */}
      <section className="mt-10">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Account</h2>
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-medium text-ink-900 dark:text-ink-50">Local-only progress</div>
              <p className="text-xs text-ink-500 mt-1 max-w-md">
                Your progress is stored in this browser and isn't synced. Google sign-in for cloud sync
                will arrive when Firebase Auth is enabled in the console.
              </p>
            </div>
            <button className="btn-ghost border border-ink-200 dark:border-ink-800 cursor-not-allowed opacity-60" disabled>
              Sign in (coming soon)
            </button>
          </div>
        </div>
      </section>

      {/* Progress data */}
      <section className="mt-10">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Progress data</h2>
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-medium text-ink-900 dark:text-ink-50">
                {studiedIds.length} lesson{studiedIds.length === 1 ? '' : 's'} studied · {Object.keys(quizResults).length} quiz result{Object.keys(quizResults).length === 1 ? '' : 's'}
              </div>
              <p className="text-xs text-ink-500 mt-1 max-w-md">
                Removes every studied-marker and quiz result from this browser. Can't be undone.
              </p>
            </div>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-ghost border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                Reset progress
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowResetConfirm(false)} className="btn-ghost">Cancel</button>
                <button
                  onClick={onReset}
                  className="btn bg-rose-600 text-white hover:bg-rose-700"
                >
                  Yes, reset all progress
                </button>
              </div>
            )}
          </div>
          {resetDone && (
            <div className="mt-4 text-xs text-emerald-700 dark:text-emerald-400">
              ✓ All progress cleared.
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="mt-10">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">About</h2>
        <div className="card p-6 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
          <p>CFA·Coach is an open, free study tool for the CFA Level 1 exam. Content is authored by hand and committed to the repo. No subscriptions, no ads, no tracking — your study state lives only in this browser.</p>
          <p className="mt-3 text-xs text-ink-500">CFA® is a trademark of CFA Institute. This tool is independent and unaffiliated.</p>
        </div>
      </section>
    </div>
  );
}

function ThemeIcon({ id }) {
  if (id === 'light') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M5 5l1.5 1.5M17.5 17.5L19 19M2 12h2M20 12h2M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>;
  if (id === 'dark')  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-ink-500"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-500"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8"/></svg>;
}
