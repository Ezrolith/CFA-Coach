import { Link, useParams, Navigate } from 'react-router-dom';
import { getTopicById } from '../data/curriculum';
import { styleFor } from '../data/topicStyles';

export default function TopicPage() {
  const { id } = useParams();
  const topic = getTopicById(id);

  if (!topic) return <Navigate to="/" replace />;

  const s = styleFor(topic.id);

  let totalLessons = 0;
  let totalLOS = 0;
  for (const m of topic.modules) {
    for (const l of (m.lessons ?? [])) {
      totalLessons += 1;
      totalLOS += (l.los ?? []).length;
    }
  }

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

        {topic.draftFlag && (
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {topic.draftFlag}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-px bg-ink-200/60 dark:bg-ink-800/60 rounded-xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60">
          <MiniStat label="Modules"  value={topic.modules.length} />
          <MiniStat label="Lessons"  value={totalLessons} />
          <MiniStat label="LOS"      value={totalLOS} />
          <MiniStat label="Weight"   value={topic.weight} mono />
          <MiniStat label="Progress" value="0%" accent />
        </div>
      </header>

      {/* Modules list */}
      <section>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Modules</h2>
        <ol className="card divide-y divide-ink-100 dark:divide-ink-800/60 overflow-hidden">
          {topic.modules.map((m, i) => {
            const lessons = m.lessons ?? [];
            const losCount = lessons.reduce((n, l) => n + (l.los?.length ?? 0), 0);
            const hasContent = lessons.length > 0;
            return (
              <li key={m.id} className="group px-5 py-4 hover:bg-ink-50/70 dark:hover:bg-ink-900/40 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="num text-xs font-medium text-ink-400 w-6 pt-1">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-ink-900 dark:text-ink-50">{m.name}</div>
                    <div className="text-xs text-ink-500 mt-0.5 flex items-center gap-3">
                      {hasContent ? (
                        <>
                          <span>{losCount} LOS</span>
                          <span className="text-ink-300">·</span>
                          <span>{lessons.length} lesson{lessons.length === 1 ? '' : 's'}</span>
                        </>
                      ) : (
                        <span className="italic">Coming soon</span>
                      )}
                    </div>
                  </div>
                </div>

                {hasContent && (
                  <ul className="mt-3 ml-10 space-y-1">
                    {lessons.map(l => (
                      <li key={l.id}>
                        <Link
                          to={`/lesson/${l.id}`}
                          className="group/lesson flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-ink-900 -mx-3 transition-colors"
                        >
                          <span className="text-sm text-ink-700 dark:text-ink-200 group-hover/lesson:text-ink-900 dark:group-hover/lesson:text-ink-50 transition-colors">{l.name}</span>
                          <span className="num text-[11px] text-ink-400">{l.los?.length ?? 0} LOS</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
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
    <div className="flex-1 min-w-[110px] bg-white dark:bg-ink-950 px-5 py-3 flex flex-col">
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
