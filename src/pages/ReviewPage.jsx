import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { findLesson } from '../data/curriculum';
import { styleFor } from '../data/topicStyles';
import { useGlobalProgress } from '../hooks/useProgress';
import { dueReviewIds, gradeReview, getReview } from '../lib/progress';

const RATINGS = [
  { key: 'again', label: 'Again',   hint: 'Forgot — soon',        cls: 'bg-rose-600   hover:bg-rose-700   text-white' },
  { key: 'hard',  label: 'Hard',    hint: 'Struggled — short interval',  cls: 'bg-amber-500  hover:bg-amber-600  text-white' },
  { key: 'good',  label: 'Good',    hint: 'Got it — normal interval', cls: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { key: 'easy',  label: 'Easy',    hint: 'Too easy — longer interval',  cls: 'bg-accent-600 hover:bg-accent-700 text-white' },
];

export default function ReviewPage() {
  const { studiedIds } = useGlobalProgress();
  const due = useMemo(() => dueReviewIds(), [studiedIds]); // recomputes when state changes
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Reset when due list changes meaningfully
  useEffect(() => {
    if (idx >= due.length && due.length > 0) setIdx(0);
  }, [due.length, idx]);

  // Empty / done states
  if (due.length === 0 && !done) {
    return <EmptyState />;
  }
  if (done || idx >= due.length) {
    return <CompletionState completed={due.length} />;
  }

  const lessonId = due[idx];
  const found = findLesson(lessonId);
  if (!found) {
    // Skip orphan
    return null;
  }

  const { topic, module, lesson } = found;
  const s = styleFor(topic.id);
  const review = getReview(lessonId);

  const onGrade = (key) => {
    gradeReview(lessonId, key);
    if (idx + 1 >= due.length) setDone(true);
    else {
      setIdx(idx + 1);
      setRevealed(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Daily review</div>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
          {idx + 1} of {due.length} due
        </h1>
        <span className="text-sm text-ink-500">Spaced repetition · SM-2</span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden">
        <div
          className="h-full bg-accent-500 transition-all duration-300 ease-out-soft"
          style={{ width: `${(idx / due.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <section className="card mt-8 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
            {topic.shortName} · {module.name}
          </span>
        </div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          {lesson.name}
        </h2>

        {!revealed ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-ink-500 mb-6">
              Try to recall the key concepts from this lesson before checking. How confident are you?
            </p>
            <button onClick={() => setRevealed(true)} className="btn-primary">
              Show lesson →
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <Link to={`/lesson/${lesson.id}`} className="block card-hover card p-4 -mx-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-ink-900 dark:text-ink-50">Open the lesson →</span>
                <span className="text-ink-400">↗</span>
              </div>
            </Link>

            {review && (
              <div className="grid grid-cols-3 gap-px bg-ink-200/60 dark:bg-ink-800/60 rounded-xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60 text-left">
                <Stat label="Current interval" value={`${review.interval}d`} mono />
                <Stat label="Easiness factor"  value={review.ef.toFixed(2)} mono />
                <Stat label="Reps streak"      value={review.reps} />
              </div>
            )}

            <div className="pt-3">
              <p className="text-xs text-ink-500 mb-3 text-center">
                Rate your recall — the algorithm schedules the next review.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {RATINGS.map(r => (
                  <button
                    key={r.key}
                    onClick={() => onGrade(r.key)}
                    className={[
                      'btn flex flex-col py-3 h-auto !rounded-xl',
                      r.cls,
                    ].join(' ')}
                  >
                    <span className="text-sm font-semibold">{r.label}</span>
                    <span className="text-[10px] font-normal opacity-80 mt-0.5">{r.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">All caught up</div>
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
        Nothing due today.
      </h1>
      <p className="mt-4 text-ink-500 max-w-md mx-auto">
        Lessons enter the spaced-repetition queue when you mark them studied or take a quiz.
        The algorithm schedules them for review based on how confidently you recalled them.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-flex">← Browse the library</Link>
    </div>
  );
}

function CompletionState({ completed }) {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Done for today</div>
      <h1 className="font-display text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
        {completed} reviewed.
      </h1>
      <p className="mt-4 text-ink-500">Come back tomorrow — the algorithm will surface the right lessons at the right time.</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">← Library</Link>
    </div>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="bg-white dark:bg-ink-950 px-4 py-3 flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</span>
      <span className={[
        'mt-0.5 text-base font-semibold tracking-tight text-ink-900 dark:text-ink-50',
        mono ? 'font-mono' : 'num',
      ].join(' ')}>{value}</span>
    </div>
  );
}
