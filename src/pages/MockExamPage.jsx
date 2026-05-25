import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MarkdownView from '../components/lesson/MarkdownView';
import { buildMockExam, groupResultsByTopic } from '../lib/examBuilder';
import { allQuestions } from '../lib/questions';
import { getTopicById } from '../data/curriculum';
import { styleFor } from '../data/topicStyles';

const DEFAULT_COUNT = 30;
const SECONDS_PER_Q = 90; // 1.5 min — slightly looser than real exam pace

export default function MockExamPage() {
  const [stage, setStage] = useState('start'); // 'start' | 'running' | 'done'
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});       // { questionId: true } for review markers
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAtRef = useRef(null);

  const poolSize = allQuestions().length;
  const targetCount = Math.min(DEFAULT_COUNT, poolSize);

  // Timer tick
  useEffect(() => {
    if (stage !== 'running') return;
    if (secondsLeft <= 0) {
      setStage('done');
      return;
    }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [stage, secondsLeft]);

  const onStart = () => {
    const q = buildMockExam(targetCount);
    setQuestions(q);
    setAnswers({});
    setFlags({});
    setIdx(0);
    setSecondsLeft(q.length * SECONDS_PER_Q);
    startedAtRef.current = Date.now();
    setStage('running');
  };

  if (stage === 'start') {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Mock exam</div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 leading-tight">
          Real conditions. Real format.
        </h1>
        <p className="mt-4 text-lg text-ink-500 dark:text-ink-400 max-w-2xl leading-relaxed">
          The real CFA Level 1 sitting is 180 questions across two sessions. We don't have that many questions yet —
          so we'll run a {targetCount}-question scaled simulation, with topic weights matching the real exam and a 90-second-per-question allowance.
        </p>

        <div className="mt-10 card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-200/60 dark:bg-ink-800/60 rounded-xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60">
            <Stat label="Questions"      value={targetCount} />
            <Stat label="Time"           value={formatMMSS(targetCount * SECONDS_PER_Q)} mono />
            <Stat label="Pool available" value={poolSize} />
            <Stat label="Weighted"       value="Yes" />
          </div>
          <p className="text-xs text-ink-500 mt-4">
            As the question bank grows (each lesson authoring sprint adds 6+ questions), mock exams will scale toward the full 180.
          </p>
          <div className="mt-6 flex items-center justify-end gap-2">
            <Link to="/" className="btn-ghost">← Back</Link>
            <button onClick={onStart} disabled={poolSize === 0} className="btn-primary disabled:opacity-40">
              Start mock exam →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'running') {
    const q = questions[idx];
    const chosen = answers[q.id];
    const flagged = !!flags[q.id];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="max-w-4xl mx-auto px-6 pt-6 pb-24">
        {/* Top bar: timer + progress */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Mock exam · {idx + 1} / {questions.length}
            </span>
            <span className="num text-xs text-ink-400">{answeredCount} answered</span>
          </div>
          <div className={[
            'num font-mono text-sm font-semibold px-3 py-1.5 rounded-full',
            secondsLeft < 60
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 animate-pulse'
              : 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200',
          ].join(' ')}>
            {formatMMSS(secondsLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden mb-6">
          <div
            className="h-full bg-accent-500 transition-all duration-300 ease-out-soft"
            style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Stem */}
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TopicTag topicId={q.topicId} />
            <span className="pill-muted text-[10px] uppercase tracking-wider">{q.difficulty}</span>
            {flagged && <span className="pill text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Flagged</span>}
          </div>
          <div className="text-[16px] text-ink-800 dark:text-ink-100 leading-relaxed">
            <MarkdownView>{q.stem}</MarkdownView>
          </div>
        </div>

        {/* Choices */}
        <div className="space-y-2 mb-6">
          {q.choices.map(c => {
            const selected = chosen === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setAnswers(a => ({ ...a, [q.id]: c.id }))}
                className={[
                  'group w-full text-left flex items-start gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 ease-out-soft',
                  'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-ink-950',
                  selected
                    ? 'border-ink-400 dark:border-ink-500 bg-ink-50/70 dark:bg-ink-900'
                    : 'border-ink-200 dark:border-ink-800 hover:border-ink-300 dark:hover:border-ink-700 bg-white dark:bg-ink-950',
                ].join(' ')}
              >
                <span className={[
                  'flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold transition-colors',
                  selected ? 'border-ink-900 dark:border-ink-50 text-ink-900 dark:text-ink-50' :
                             'border-ink-300 dark:border-ink-700 text-ink-600 dark:text-ink-400',
                ].join(' ')}>{c.id}</span>
                <span className="text-[15px] leading-relaxed flex-1 pt-0.5">{c.text}</span>
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="btn-ghost disabled:opacity-40"
            >← Previous</button>
            <button
              onClick={() => setFlags(f => ({ ...f, [q.id]: !flagged }))}
              className={[
                'btn-ghost',
                flagged ? 'text-amber-600' : '',
              ].join(' ')}
            >
              {flagged ? '★ Flagged' : '☆ Flag for review'}
            </button>
          </div>
          {idx + 1 < questions.length ? (
            <button onClick={() => setIdx(i => i + 1)} className="btn-primary">
              Next →
            </button>
          ) : (
            <button onClick={() => setStage('done')} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
              Submit exam →
            </button>
          )}
        </div>
      </div>
    );
  }

  // stage === 'done'
  return <MockExamResults questions={questions} answers={answers} timeUsed={questions.length * SECONDS_PER_Q - secondsLeft} />;
}

function MockExamResults({ questions, answers, timeUsed }) {
  const correct = questions.filter(q => answers[q.id] === q.answer).length;
  const total = questions.length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const byTopic = groupResultsByTopic(questions, answers);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3 text-center">Mock exam complete</div>

      <div className="text-center">
        <div className="num font-display text-7xl font-bold tracking-tighter text-ink-900 dark:text-ink-50">
          {pct}<span className="text-3xl text-ink-400">%</span>
        </div>
        <div className="mt-2 text-ink-500">{correct} of {total} correct · {formatMMSS(timeUsed)} elapsed</div>
        <div className={[
          'mt-4 inline-flex pill text-[11px] uppercase tracking-wider',
          pct >= 70 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
          pct >= 50 ? 'bg-amber-100  text-amber-800  dark:bg-amber-900/40  dark:text-amber-300' :
                      'bg-rose-100   text-rose-800   dark:bg-rose-900/40   dark:text-rose-300',
        ].join(' ')}>
          {pct >= 70 ? 'On track' : pct >= 50 ? 'Needs work' : 'Substantial gaps'}
        </div>
      </div>

      {/* Per-topic breakdown */}
      <section className="mt-10">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">By topic</h2>
        <div className="card divide-y divide-ink-100 dark:divide-ink-800/60 overflow-hidden">
          {byTopic.map(b => {
            const t = getTopicById(b.topicId);
            const s = styleFor(b.topicId);
            const tPct = b.total ? Math.round((b.correct / b.total) * 100) : 0;
            return (
              <div key={b.topicId} className="px-5 py-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  <span className="flex-1 text-sm font-medium text-ink-900 dark:text-ink-50">{t?.name ?? b.topicId}</span>
                  <span className="num text-xs text-ink-500">{b.correct}/{b.total}</span>
                  <span className="num text-sm font-semibold w-12 text-right text-ink-900 dark:text-ink-50">{tPct}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out-soft"
                    style={{ width: `${tPct}%`, background: s.accent }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detail toggle */}
      <details className="mt-10">
        <summary className="cursor-pointer text-sm font-medium text-ink-700 dark:text-ink-200 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
          Show question-by-question review →
        </summary>
        <ol className="mt-4 space-y-3">
          {questions.map((q, i) => {
            const got = answers[q.id];
            const right = got === q.answer;
            return (
              <li key={q.id} className="card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="num text-xs font-medium text-ink-400 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <TopicTag topicId={q.topicId} />
                  <span className={[
                    'pill text-[10px] uppercase tracking-wider',
                    right ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
                  ].join(' ')}>
                    {right ? '✓ correct' : got ? `✗ chose ${got} (right: ${q.answer})` : `unanswered (right: ${q.answer})`}
                  </span>
                </div>
                <div className="text-[15px] text-ink-800 dark:text-ink-100">
                  <MarkdownView>{q.stem}</MarkdownView>
                </div>
                <div className="mt-3 pt-3 border-t border-ink-100 dark:border-ink-800/60">
                  <MarkdownView>{q.explanation}</MarkdownView>
                </div>
              </li>
            );
          })}
        </ol>
      </details>

      <div className="mt-10 flex items-center justify-center gap-3">
        <Link to="/" className="btn-ghost">← Library</Link>
        <button onClick={() => window.location.reload()} className="btn-primary">Take another mock</button>
      </div>
    </div>
  );
}

function TopicTag({ topicId }) {
  const t = getTopicById(topicId);
  const s = styleFor(topicId);
  if (!t) return null;
  return (
    <span className="inline-flex items-center gap-1.5 pill bg-ink-100 dark:bg-ink-800 text-[10px] uppercase tracking-wider">
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      <span className="text-ink-700 dark:text-ink-300">{t.shortName}</span>
    </span>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="bg-white dark:bg-ink-950 px-4 py-3 flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</span>
      <span className={[
        'mt-0.5 text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-50',
        mono ? 'font-mono text-base' : 'num',
      ].join(' ')}>{value}</span>
    </div>
  );
}

function formatMMSS(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
}
