import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll } from '../../lib/search';
import { styleFor } from '../../data/topicStyles';

// Command palette overlay. Opens with Cmd/Ctrl+K or "/" (when no input focused).
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Global keyboard listener: Cmd/Ctrl+K or "/" to open; Esc to close (handled inside).
  useEffect(() => {
    function onKey(e) {
      const isModK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && !isTypingInField(e.target);
      if (isModK || isSlash) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus input & reset state when opened.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      // Defer to allow modal to mount.
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results = useMemo(() => searchAll(query, 12), [query]);

  // Keep activeIdx in bounds when results change.
  useEffect(() => {
    if (activeIdx >= results.length) setActiveIdx(Math.max(0, results.length - 1));
  }, [results.length, activeIdx]);

  function go(item) {
    setOpen(false);
    const targetId = item.type === 'formula' ? item.lessonId : item.id;
    navigate(`/lesson/${targetId}`);
  }

  function onInputKey(e) {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[activeIdx];
      if (item) go(item);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100 dark:border-ink-800/60">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400 flex-shrink-0">
            <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={onInputKey}
            placeholder="Search lessons, formulas, topics…"
            className="flex-1 bg-transparent text-base text-ink-900 dark:text-ink-50 placeholder:text-ink-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex pill-muted text-[10px] uppercase tracking-wider">Esc</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <EmptyState />
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-500">
              No matches. Try a different keyword.
            </div>
          ) : (
            <ul className="py-2">
              {results.map((item, idx) => {
                const active = idx === activeIdx;
                const s = styleFor(item.topicId);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => go(item)}
                      className={[
                        'w-full text-left px-5 py-2.5 flex items-start gap-3 transition-colors',
                        active
                          ? 'bg-ink-100 dark:bg-ink-900/70'
                          : 'hover:bg-ink-50 dark:hover:bg-ink-900/40',
                      ].join(' ')}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot} mt-2 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-ink-900 dark:text-ink-50 truncate">
                            {item.title}
                          </span>
                          {item.type === 'formula' && (
                            <span className="pill-muted text-[9px] uppercase tracking-wider">formula</span>
                          )}
                        </div>
                        <div className="text-xs text-ink-500 truncate">{item.subtitle}</div>
                      </div>
                      <span className="text-ink-300 text-xs flex-shrink-0 mt-1">↵</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-5 py-2.5 border-t border-ink-100 dark:border-ink-800/60 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-400">
          <div className="flex items-center gap-4">
            <span><kbd className="text-ink-600 dark:text-ink-300">↑↓</kbd> navigate</span>
            <span><kbd className="text-ink-600 dark:text-ink-300">↵</kbd> open</span>
          </div>
          <span><kbd className="text-ink-600 dark:text-ink-300">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-5 py-8 text-center">
      <div className="text-sm text-ink-500">Type to search across all lessons, formulas, and topics.</div>
      <div className="mt-3 text-xs text-ink-400">
        Try: <span className="font-medium text-ink-600 dark:text-ink-300">"duration"</span> · <span className="font-medium text-ink-600 dark:text-ink-300">"put-call parity"</span> · <span className="font-medium text-ink-600 dark:text-ink-300">"DDM"</span>
      </div>
    </div>
  );
}

function isTypingInField(el) {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  return el.isContentEditable === true;
}
