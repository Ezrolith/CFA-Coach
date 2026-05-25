import { Link } from 'react-router-dom';
import { styleFor } from '../../data/topicStyles';
import { topicWeightMid } from '../../data/curriculum';

export default function TopicCard({ topic }) {
  const s = styleFor(topic.id);
  const moduleCount = topic.modules.length;
  const mid = topicWeightMid(topic);

  return (
    <Link
      to={`/topic/${topic.id}`}
      className="card card-hover group relative p-6 flex flex-col h-full overflow-hidden"
    >
      {/* tinted accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: s.accent }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-500">
            Topic {String(topic.order).padStart(2, '0')}
          </span>
        </div>
        <WeightBadge low={topic.weightLow} high={topic.weightHigh} />
      </div>

      <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 mb-2 leading-tight">
        {topic.name}
      </h3>

      <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-3 mb-6 flex-1">
        {topic.description}
      </p>

      <div className="flex items-end justify-between pt-4 border-t border-ink-100 dark:border-ink-800/60">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-ink-400">Modules</span>
          <span className="num text-lg font-semibold text-ink-900 dark:text-ink-50">{moduleCount}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-ink-400">Mid weight</span>
          <span className="num text-lg font-semibold text-ink-900 dark:text-ink-50">{mid.toFixed(1)}%</span>
        </div>
      </div>
    </Link>
  );
}

function WeightBadge({ low, high }) {
  return (
    <div className="flex flex-col items-end">
      <span className="num text-[11px] text-ink-500">
        <span className="font-mono">{low}–{high}%</span>
      </span>
      <span className="text-[10px] uppercase tracking-wider text-ink-400">weight</span>
    </div>
  );
}
