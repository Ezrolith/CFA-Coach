import { Link, useParams, Navigate } from 'react-router-dom';
import { getTopicById } from '../data/curriculum';
import { styleFor } from '../data/topicStyles';

export default function TopicPage() {
  const { id } = useParams();
  const topic = getTopicById(id);

  if (!topic) return <Navigate to="/" replace />;

  const s = styleFor(topic.id);
  const totalLessons = topic.modules.reduce((n, m) => n + (m.lessons?.length ?? 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-500 mb-6">
        <Link to="/" className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">Library</Link>
        <span className="mx-2 text-ink-300">/</span>
        <span className="text-ink-700 dark:text-ink-300">{topic.shortName}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
            Topic {String(topic.order).padStart(2, '0')} · {topic.weight}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 leading-tight">
          {topic.name}
        </h1>
        <p className="mt-5 text-lg text-ink-500 dark:text-ink-400 max-w-3xl leading-relaxed">
          {topic.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-px bg-ink-200/60 dark:bg-ink-800/60 rounded-xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60">
          <MiniStat label="Modules"  value={topic.modules.length} />
          <MiniStat label="Lessons"  value={totalLessons} />
          <MiniStat label="Weight"   value={topic.weight} mono />
          <MiniStat label="Progress" value="0%" accent />
        </div>
      </header>

      {/* Modules list */}
      <section>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Modules</h2>
        <ol className="card divide-y divide-ink-100 dark:divide-ink-800/60 overflow-hidden">
          {topic.modules.map((m, i) => (
            <li key={m.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-ink-50/70 dark:hover:bg-ink-900/40 transition-colors">
              <span className="num text-xs font-medium text-ink-400 w-6">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink-900 dark:text-ink-50 truncate">{m.name}</div>
                <div className="text-xs text-ink-500 mt-0.5">
                  {(m.lessons?.length ?? 0) === 0 ? 'No lessons yet — coming soon' : `${m.lessons.length} lesson${m.lessons.length === 1 ? '' : 's'}`}
                </div>
              </div>
              <span className="text-ink-300 group-hover:text-ink-500 transition-colors" aria-hidden>→</span>
            </li>
          ))}
        </ol>

        {totalLessons === 0 && (
          <div className="mt-6 text-sm text-ink-500 italic">
            Lessons and LOS for this topic will be populated in the next authoring sprint.
          </div>
        )}
      </section>
    </div>
  );
}

function MiniStat({ label, value, accent, mono }) {
  return (
    <div className="flex-1 min-w-[120px] bg-white dark:bg-ink-950 px-5 py-3 flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</span>
      <span className={[
        'mt-0.5 text-lg font-semibold tracking-tight',
        mono ? 'font-mono text-base' : 'num',
        accent ? 'text-accent-600 dark:text-accent-400' : 'text-ink-900 dark:text-ink-50',
      ].join(' ')}>
        {value}
      </span>
    </div>
  );
}
