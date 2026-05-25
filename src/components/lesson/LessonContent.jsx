import { useState } from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import MarkdownView from './MarkdownView';

/**
 * Lesson content shape (per /content/lessons/<lessonId>.json):
 * {
 *   lessonId: "quant-time-value-overview",
 *   modes: { new: "...md...", pro: "...md...", exam: "...md..." },
 *   examples: [ { title, body } ],
 *   formulas: [ { name, latex, plain } ],
 *   pitfalls: [ "..." ],
 *   faq:      [ { q, a } ],
 *   resources:[ { label, url, kind } ]
 * }
 */

const MODES = [
  { id: 'new',  label: 'Like I\'m new',  desc: 'Friendly, analogies, zero jargon' },
  { id: 'pro',  label: 'Like I\'m a pro', desc: 'Tight, jargon, fast' },
  { id: 'exam', label: 'Exam mode',       desc: 'Exactly what CFA expects' },
];

export default function LessonContent({ content }) {
  const [mode, setMode] = useState('new');
  const body = content.modes?.[mode] ?? content.modes?.new ?? '';

  return (
    <>
      {/* Explanation card with mode switcher */}
      <section className="card p-6 mb-8">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">Explanation</h2>
            <p className="text-xs text-ink-500 mt-1">{MODES.find(m => m.id === mode)?.desc}</p>
          </div>
          <div className="inline-flex items-center gap-px bg-ink-100 dark:bg-ink-800/60 rounded-full p-0.5 text-[11px]">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={[
                  'px-3 py-1 rounded-full transition-colors duration-200 ease-out-soft',
                  mode === m.id
                    ? 'bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-50 shadow-sm font-medium'
                    : 'text-ink-500 hover:text-ink-900 dark:hover:text-ink-50',
                ].join(' ')}
              >{m.label}</button>
            ))}
          </div>
        </div>
        <MarkdownView>{body}</MarkdownView>
      </section>

      {/* Key formulas */}
      {content.formulas?.length > 0 && (
        <section className="card p-6 mb-8">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Key formulas</h2>
          <ul className="divide-y divide-ink-100 dark:divide-ink-800/60 -my-2">
            {content.formulas.map((f, i) => (
              <li key={i} className="py-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 md:gap-6 items-center">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-ink-500">{f.name}</div>
                  {f.plain && <div className="text-xs text-ink-400 mt-0.5">{f.plain}</div>}
                </div>
                <div className="text-base md:text-lg overflow-x-auto">
                  <BlockMath math={f.latex} settings={{ strict: false }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Worked examples */}
      {content.examples?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Worked examples</h2>
          <div className="space-y-4">
            {content.examples.map((ex, i) => (
              <details key={i} className="card group">
                <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="num text-xs font-medium text-ink-400">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-medium text-ink-900 dark:text-ink-50">{ex.title}</span>
                  </div>
                  <span className="text-ink-400 group-open:rotate-90 transition-transform duration-200">→</span>
                </summary>
                <div className="px-6 pb-5 pt-1 border-t border-ink-100 dark:border-ink-800/60">
                  <MarkdownView>{ex.body}</MarkdownView>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Pitfalls */}
      {content.pitfalls?.length > 0 && (
        <section className="card p-6 mb-8 border-amber-200/60 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-700 dark:text-amber-500 mb-4">Common pitfalls</h2>
          <ul className="space-y-2">
            {content.pitfalls.map((p, i) => (
              <li key={i} className="flex gap-3 text-[15px] text-ink-700 dark:text-ink-300 leading-relaxed">
                <span className="text-amber-600 dark:text-amber-500 mt-0.5">⚠</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {content.faq?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">FAQ</h2>
          <div className="space-y-3">
            {content.faq.map((item, i) => (
              <details key={i} className="card group">
                <summary className="cursor-pointer list-none px-5 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{item.q}</span>
                  <span className="text-ink-400 group-open:rotate-90 transition-transform duration-200">→</span>
                </summary>
                <div className="px-5 pb-4 pt-1 border-t border-ink-100 dark:border-ink-800/60">
                  <MarkdownView>{item.a}</MarkdownView>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {content.resources?.length > 0 && (
        <section className="card p-6 mb-2">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">External resources</h2>
          <ul className="space-y-2">
            {content.resources.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-200 hover:text-accent-600 dark:hover:text-accent-400 transition-colors">
                  <span className="pill-muted text-[10px] uppercase tracking-wider">{r.kind ?? 'link'}</span>
                  <span>{r.label}</span>
                  <span className="text-ink-300 text-xs">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
