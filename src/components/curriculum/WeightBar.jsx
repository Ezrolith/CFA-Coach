import { TOPICS, topicWeightMid } from '../../data/curriculum';
import { styleFor } from '../../data/topicStyles';
import { Link } from 'react-router-dom';

// A single horizontal bar showing all 10 topics' weight share. Apple-clean.
export default function WeightBar() {
  const total = TOPICS.reduce((s, t) => s + topicWeightMid(t), 0);

  return (
    <div className="w-full">
      <div className="flex h-2 w-full rounded-full overflow-hidden bg-ink-100 dark:bg-ink-900">
        {TOPICS.map(t => {
          const s = styleFor(t.id);
          const pct = (topicWeightMid(t) / total) * 100;
          return (
            <Link
              key={t.id}
              to={`/topic/${t.id}`}
              title={`${t.name} — ${t.weight}`}
              className="block h-full transition-opacity duration-200 hover:opacity-80"
              style={{ width: `${pct}%`, background: s.accent }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px]">
        {TOPICS.map(t => {
          const s = styleFor(t.id);
          return (
            <div key={t.id} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              <span className="text-ink-500">{t.shortName}</span>
              <span className="num text-ink-400">{t.weight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
