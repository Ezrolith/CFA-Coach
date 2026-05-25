import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MarkdownView from '../lesson/MarkdownView';
import { shuffle } from '../../lib/questions';

export default function QuizPlayer({ questions, title, returnTo }) {
  const initial = useMemo(() => shuffle(questions), [questions]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});      // { questionId: choiceId }
  const [submitted, setSubmitted] = useState({});  // { questionId: true }
  const [finished, setFinished] = useState(false);

  if (!initial.length) {
    return (
      <div className="card p-6 text-sm text-ink-500 italic">
        No questions authored for this scope yet. Question banks grow with each authoring sprint.
      </div>
    );
  }

  if (finished) {
    return <QuizResults questions={initial} answers={answers} returnTo={returnTo} />;
  }

  const q = initial[idx];
  const chosen = answers[q.id];
  const isSubmitted = !!submitted[q.id];
  const isCorrect = isSubmitted && chosen === q.answer;

  const pickChoice = (cid) => {
    if (isSubmitted) return;
    setAnswers(a => ({ ...a, [q.id]: cid }));
  };
  const submit = () => {
    if (!chosen) return;
    setSubmitted(s => ({ ...s, [q.id]: true }));
  };
  const next = () => {
    if (idx + 1 < initial.length) setIdx(i => i + 1);
    else setFinished(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
          {title ?? 'Practice quiz'} · Question {idx + 1} of {initial.length}
        </span>
        <span className="num text-xs text-ink-400">
          {Object.keys(submitted).length} answered
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden mb-8">
        <div
          className="h-full bg-accent-500 transition-all duration-300 ease-out-soft"
          style={{ width: `${((idx + (isSubmitted ? 1 : 0)) / initial.length) * 100}%` }}
        />
      </div>

      {/* Stem */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={[
            'pill text-[10px] uppercase tracking-wider',
            q.difficulty === 'easy'   ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
            q.difficulty === 'medium' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' :
                                        'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
          ].join(' ')}>{q.difficulty}</span>
          <span className="pill-muted text-[10px] uppercase tracking-wider mono">{q.id}</span>
        </div>
        <div className="text-[16px] text-ink-800 dark:text-ink-100 leading-relaxed">
          <MarkdownView>{q.stem}</MarkdownView>
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-2 mb-6">
        {q.choices.map(c => {
          const selected = chosen === c.id;
          const showCorrect = isSubmitted && c.id === q.answer;
          const showWrong   = isSubmitted && selected && c.id !== q.answer;
          return (
            <button
              key={c.id}
              onClick={() => pickChoice(c.id)}
              disabled={isSubmitted}
              className={[
                'group w-full text-left flex items-start gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 ease-out-soft',
                'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-ink-950',
                showCorrect ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-900/15 text-ink-900 dark:text-ink-50' :
                showWrong   ? 'border-rose-500/60 bg-rose-50 dark:bg-rose-900/15 text-ink-900 dark:text-ink-50' :
                selected    ? 'border-ink-400 dark:border-ink-500 bg-ink-50/70 dark:bg-ink-900' :
                              'border-ink-200 dark:border-ink-800 hover:border-ink-300 dark:hover:border-ink-700 bg-white dark:bg-ink-950',
              ].join(' ')}
            >
              <span className={[
                'flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold transition-colors',
                showCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                showWrong   ? 'border-rose-500 bg-rose-500 text-white' :
                selected    ? 'border-ink-900 dark:border-ink-50 text-ink-900 dark:text-ink-50' :
                              'border-ink-300 dark:border-ink-700 text-ink-600 dark:text-ink-400',
              ].join(' ')}>{c.id}</span>
              <span className="text-[15px] leading-relaxed flex-1 pt-0.5">{c.text}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isSubmitted && (
        <div className={[
          'card p-6 mb-6',
          isCorrect ? 'border-emerald-200 dark:border-emerald-900/40' : 'border-rose-200 dark:border-rose-900/40',
        ].join(' ')}>
          <div className="flex items-center gap-2 mb-3">
            <span className={[
              'pill text-[10px] uppercase tracking-wider',
              isCorrect
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
            ].join(' ')}>
              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </span>
            {!isCorrect && (
              <span className="text-xs text-ink-500">Correct answer: <strong className="text-ink-900 dark:text-ink-50">{q.answer}</strong></span>
            )}
          </div>
          <MarkdownView>{q.explanation}</MarkdownView>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-3">
        {returnTo ? (
          <Link to={returnTo} className="btn-ghost">← Back</Link>
        ) : <span />}
        {!isSubmitted ? (
          <button onClick={submit} disabled={!chosen} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            Submit answer
          </button>
        ) : (
          <button onClick={next} className="btn-primary">
            {idx + 1 < initial.length ? 'Next question →' : 'Finish quiz →'}
          </button>
        )}
      </div>
    </div>
  );
}

function QuizResults({ questions, answers, returnTo }) {
  const correct = questions.filter(q => answers[q.id] === q.answer).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Quiz complete</div>
      <div className="num font-display text-7xl font-bold tracking-tighter text-ink-900 dark:text-ink-50">
        {pct}<span className="text-3xl text-ink-400">%</span>
      </div>
      <div className="mt-2 text-ink-500">{correct} out of {total} correct</div>

      <div className="mt-10 grid grid-cols-2 gap-px bg-ink-200/60 dark:bg-ink-800/60 rounded-2xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60 text-left">
        <Stat label="Correct"   value={correct} accent />
        <Stat label="Incorrect" value={total - correct} />
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button onClick={() => window.location.reload()} className="btn-ghost">Retry quiz</button>
        {returnTo && <Link to={returnTo} className="btn-primary">← Back to lesson</Link>}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="bg-white dark:bg-ink-950 px-5 py-4 flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</span>
      <span className={[
        'mt-1 num font-display text-2xl font-semibold tracking-tight',
        accent ? 'text-accent-600 dark:text-accent-400' : 'text-ink-900 dark:text-ink-50',
      ].join(' ')}>{value}</span>
    </div>
  );
}
