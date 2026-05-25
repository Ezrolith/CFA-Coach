import { Link } from 'react-router-dom';
import { TOPICS, findLesson } from '../data/curriculum';
import { styleFor } from '../data/topicStyles';
import { useGlobalProgress } from '../hooks/useProgress';
import { authoredLessonIds } from '../lib/content';

export default function ProgressPage() {
  const { studiedIds, quizResults } = useGlobalProgress();
  const studiedSet = new Set(studiedIds);

  // Per-topic rollup
  const topicStats = TOPICS.map(topic => {
    let total = 0;
    let studied = 0;
    let authoredHere = 0;
    let quizScores = [];
    for (const m of topic.modules) {
      for (const l of (m.lessons ?? [])) {
        total += 1;
        if (studiedSet.has(l.id)) studied += 1;
        if (quizResults[l.id]) quizScores.push(quizResults[l.id].bestPct);
      }
    }
    const avgScore = quizScores.length
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : null;
    return { topic, total, studied, pct: total ? Math.round((studied / total) * 100) : 0, avgScore };
  });

  // Quiz performance, ranked
  const quizRows = Object.entries(quizResults).map(([lessonId, r]) => {
    const found = findLesson(lessonId);
    return found ? { lessonId, topic: found.topic, module: found.module, lesson: found.lesson, ...r } : null;
  }).filter(Boolean).sort((a, b) => b.bestPct - a.bestPct);

  // Overall readiness (weighted across topics by official weight midpoint, modulated by lessons studied + quiz scores)
  const readiness = computeReadiness(topicStats);

  // Empty-state shortcut
  const hasAnyProgress = studiedIds.length > 0 || quizRows.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Progress dashboard</div>
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 leading-tight">
        Where you stand.
      </h1>
      <p className="mt-3 text-ink-500">Stored in this browser. Cloud sync arrives when Firebase Auth is wired up.</p>

      {!hasAnyProgress ? (
        <div className="card p-8 mt-10 text-center">
          <p className="text-ink-500">No progress recorded yet. Open a lesson, mark it studied, and take a quiz — the dashboard fills in automatically.</p>
          <Link to="/" className="btn-primary mt-6">← Browse the library</Link>
        </div>
      ) : (
        <>
          {/* Readiness gauge */}
          <section className="mt-10 card p-8">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">Estimated readiness</div>
                <div className="mt-2 num font-display text-7xl font-bold tracking-tighter text-ink-900 dark:text-ink-50">
                  {readiness.pct}<span className="text-3xl text-ink-400">%</span>
                </div>
                <div className="text-sm text-ink-500 mt-2">{readiness.summary}</div>
              </div>
              <div className="text-xs text-ink-500 max-w-sm">
                Heuristic: weighted by official topic weights, factoring in lessons studied and quiz best-scores.
                As content authoring grows, this will reflect lesson-level mastery on every LOS.
              </div>
            </div>
            <ReadinessBar pct={readiness.pct} />
          </section>

          {/* Per-topic heatmap */}
          <section className="mt-10">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">By topic</h2>
            <div className="card divide-y divide-ink-100 dark:divide-ink-800/60 overflow-hidden">
              {topicStats.map(t => {
                const s = styleFor(t.topic.id);
                return (
                  <Link
                    key={t.topic.id}
                    to={`/topic/${t.topic.id}`}
                    className="block px-5 py-4 hover:bg-ink-50/70 dark:hover:bg-ink-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-ink-900 dark:text-ink-50 truncate">{t.topic.name}</div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="num text-xs text-ink-500">{t.studied}/{t.total} lessons</span>
                            {t.avgScore !== null && (
                              <span className="num text-xs text-accent-600 dark:text-accent-400 font-medium">{t.avgScore}%</span>
                            )}
                            <span className="num text-sm font-semibold text-ink-900 dark:text-ink-50 w-12 text-right">{t.pct}%</span>
                          </div>
                        </div>
                        <div className="mt-2 h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 ease-out-soft"
                            style={{ width: `${t.pct}%`, background: s.accent }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Quiz performance */}
          {quizRows.length > 0 && (
            <section className="mt-10">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Quiz performance</h2>
              <div className="card divide-y divide-ink-100 dark:divide-ink-800/60 overflow-hidden">
                {quizRows.map(row => {
                  const s = styleFor(row.topic.id);
                  return (
                    <Link
                      key={row.lessonId}
                      to={`/quiz?lesson=${row.lessonId}`}
                      className="block px-5 py-4 hover:bg-ink-50/70 dark:hover:bg-ink-900/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500 mb-0.5">
                            {row.topic.shortName} · {row.module.name}
                          </div>
                          <div className="text-sm font-medium text-ink-900 dark:text-ink-50 truncate">{row.lesson.name}</div>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-ink-400">Last</div>
                            <div className="num text-sm font-medium text-ink-700 dark:text-ink-200">{row.lastPct}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-ink-400">Best</div>
                            <div className={[
                              'num text-sm font-semibold',
                              row.bestPct >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                              row.bestPct >= 60 ? 'text-accent-600 dark:text-accent-400' :
                              'text-rose-600 dark:text-rose-400',
                            ].join(' ')}>{row.bestPct}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-ink-400">Tries</div>
                            <div className="num text-sm text-ink-500">{row.takenCount}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Weak areas */}
          {weakAreas(topicStats).length > 0 && (
            <section className="mt-10">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-4">Suggested focus</h2>
              <div className="card p-6">
                <p className="text-sm text-ink-500 mb-3">High-weight topics with the least coverage so far. Start here.</p>
                <ul className="space-y-2">
                  {weakAreas(topicStats).map(t => {
                    const s = styleFor(t.topic.id);
                    return (
                      <li key={t.topic.id} className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <Link to={`/topic/${t.topic.id}`} className="text-sm font-medium text-ink-900 dark:text-ink-50 hover:text-accent-600 dark:hover:text-accent-400 transition-colors flex-1">
                          {t.topic.name}
                        </Link>
                        <span className="text-xs text-ink-500">{t.topic.weight} weight · {t.studied}/{t.total} done</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function ReadinessBar({ pct }) {
  return (
    <div className="mt-6 h-2 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden">
      <div
        className="h-full bg-accent-500 transition-all duration-700 ease-out-soft"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function computeReadiness(topicStats) {
  const totalWeight = topicStats.reduce((s, t) => s + (t.topic.weightLow + t.topic.weightHigh) / 2, 0);
  let weightedScore = 0;
  for (const t of topicStats) {
    const w = (t.topic.weightLow + t.topic.weightHigh) / 2;
    // Mastery proxy: 60% from lessons studied, 40% from quiz best scores
    const studyComponent = t.pct;
    const quizComponent = t.avgScore ?? 0;
    const mastery = 0.6 * studyComponent + 0.4 * quizComponent;
    weightedScore += (w / totalWeight) * mastery;
  }
  const pct = Math.round(weightedScore);
  let summary = "Just getting started — keep going.";
  if (pct >= 70) summary = "On track. Mock exam practice would sharpen weak spots.";
  else if (pct >= 40) summary = "Building momentum. Spread coverage across the heavier-weight topics next.";
  else if (pct >= 15) summary = "Foundations in place. Time to broaden topic coverage.";
  return { pct, summary };
}

function weakAreas(topicStats) {
  // Topics ranked by 'gap' = weight × (1 - coverage). Returns top 3 with any progress to do or untouched high-weight topics.
  return topicStats
    .map(t => ({
      ...t,
      gap: (t.topic.weightLow + t.topic.weightHigh) / 2 * (1 - t.pct / 100),
    }))
    .filter(t => t.pct < 100)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);
}
