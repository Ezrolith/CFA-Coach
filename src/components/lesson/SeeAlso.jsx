import { Link } from 'react-router-dom';
import { findLesson } from '../../data/curriculum';
import { styleFor } from '../../data/topicStyles';

// Render cross-references to other lessons. `items` is an array of either:
//   - "lesson-id" string, or
//   - { id: "lesson-id", why: "optional reason text" } object
export default function SeeAlso({ items }) {
  if (!items || items.length === 0) return null;

  // Normalise and resolve.
  const resolved = items
    .map(raw => {
      const ref = typeof raw === 'string' ? { id: raw } : raw;
      const found = findLesson(ref.id);
      if (!found) return null;
      return { ref, found };
    })
    .filter(Boolean);

  if (resolved.length === 0) return null;

  return (
    <section className="card p-6 mb-10">
      <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">
        See also
      </h2>
      <ul className="space-y-2">
        {resolved.map(({ ref, found }) => {
          const s = styleFor(found.topic.id);
          return (
            <li key={ref.id}>
              <Link
                to={`/lesson/${ref.id}`}
                className="flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-900/40 transition-colors group"
              >
                <span className={`w-2 h-2 rounded-full ${s.dot} mt-2 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-medium text-ink-900 dark:text-ink-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                      {found.lesson.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-ink-400">
                      {found.topic.shortName}
                    </span>
                  </div>
                  {ref.why && (
                    <p className="text-xs text-ink-500 mt-0.5">{ref.why}</p>
                  )}
                </div>
                <span className="text-ink-300 group-hover:text-accent-500 transition-colors">→</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
