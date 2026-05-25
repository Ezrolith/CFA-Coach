import { Link, useParams, Navigate } from 'react-router-dom';
import { findLesson } from '../data/curriculum';
import { styleFor } from '../data/topicStyles';

const VERB_COLORS = {
  calculate:   'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
  compare:     'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  describe:    'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
  explain:     'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  interpret:   'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  identify:    'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
  evaluate:    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  recommend:   'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  demonstrate: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  formulate:   'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
  define:      'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
};

function verbStyle(verb) {
  return VERB_COLORS[verb] ?? 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300';
}

export default function LessonPage() {
  const { id } = useParams();
  const found = findLesson(id);

  if (!found) return <Navigate to="/" replace />;

  const { topic, module, lesson } = found;
  const s = styleFor(topic.id);
  const los = lesson.los ?? [];

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">Library</Link>
        <span className="text-ink-300">/</span>
        <Link to={`/topic/${topic.id}`} className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">{topic.shortName}</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-700 dark:text-ink-300">{module.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
            {topic.shortName} · {module.name}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 leading-tight">
          {lesson.name}
        </h1>
        <p className="mt-3 text-sm text-ink-500">{los.length} Learning Outcome Statement{los.length === 1 ? '' : 's'}</p>
      </header>

      {/* Three-mode explanation placeholder (Phase 3) */}
      <section className="card p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">Explanation</h2>
          <div className="inline-flex items-center gap-px bg-ink-100 dark:bg-ink-800/60 rounded-full p-0.5 text-[11px]">
            <button className="px-2.5 py-1 rounded-full bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-50 shadow-sm font-medium">New</button>
            <button className="px-2.5 py-1 rounded-full text-ink-500 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">Pro</button>
            <button className="px-2.5 py-1 rounded-full text-ink-500 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">Exam</button>
          </div>
        </div>
        <p className="text-sm text-ink-500 leading-relaxed italic">
          Phase 3 will render the full lesson body here — three-mode explanation, worked examples,
          key formulas in KaTeX, common pitfalls, mini-FAQ, and curated resources. The Learning
          Outcome Statements below are the spine that content is built against.
        </p>
      </section>

      {/* LOS list */}
      <section>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Learning Outcome Statements</h2>
        <ol className="space-y-3">
          {los.map((item, i) => (
            <li key={item.id} className="card p-5 flex gap-4">
              <span className="num text-xs font-medium text-ink-400 w-6 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`pill text-[10px] uppercase tracking-wider ${verbStyle(item.verb)}`}>
                    {item.verb}
                  </span>
                  {item.depth && (
                    <span className="pill-muted text-[10px] uppercase tracking-wider">{item.depth}</span>
                  )}
                </div>
                <p className="text-[15px] leading-relaxed text-ink-800 dark:text-ink-100">
                  {item.statement}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
