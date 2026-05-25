import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MarkdownView from '../components/lesson/MarkdownView';
import { allEthicsScenarios } from '../lib/scenarios';
import { shuffle } from '../lib/questions';

export default function EthicsDrillPage() {
  const deck = useMemo(() => shuffle(allEthicsScenarios()), []);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [finished, setFinished] = useState(false);

  if (deck.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
          No scenarios available.
        </h1>
        <Link to="/" className="btn-primary mt-6 inline-flex">← Library</Link>
      </div>
    );
  }

  const q = deck[idx];
  const userChoice = chosen[q.id];
  const isSubmitted = !!submitted[q.id];
  const isCorrect = isSubmitted && userChoice === q.answer;

  if (finished) {
    const correct = deck.filter(s => chosen[s.id] === s.answer).length;
    const pct = Math.round((correct / deck.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24 text-center">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Ethics drill complete</div>
        <div className="num font-display text-7xl font-bold tracking-tighter text-ink-900 dark:text-ink-50">
          {pct}<span className="text-3xl text-ink-400">%</span>
        </div>
        <div className="mt-2 text-ink-500">{correct} of {deck.length} scenarios correct</div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="btn-ghost">← Library</Link>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry shuffled</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">Ethics scenarios</div>
        <span className="num text-xs text-ink-400">Scenario {idx + 1} of {deck.length}</span>
      </div>
      <div className="h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden mb-6">
        <div
          className="h-full bg-accent-500 transition-all duration-300 ease-out-soft"
          style={{ width: `${((idx + (isSubmitted ? 1 : 0)) / deck.length) * 100}%` }}
        />
      </div>

      <div className="card p-6 mb-4">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-2">Scenario</h2>
        <p className="text-[16px] text-ink-800 dark:text-ink-100 leading-relaxed">{q.scenario}</p>
        <p className="mt-4 text-sm text-ink-500 italic">Which Standard does the conduct *most likely* violate?</p>
      </div>

      <div className="space-y-2 mb-6">
        {q.options.map(opt => {
          const selected = userChoice === opt.id;
          const showCorrect = isSubmitted && opt.id === q.answer;
          const showWrong   = isSubmitted && selected && opt.id !== q.answer;
          return (
            <button
              key={opt.id}
              onClick={() => !isSubmitted && setChosen(c => ({ ...c, [q.id]: opt.id }))}
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
                'flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-semibold',
                showCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                showWrong   ? 'border-rose-500 bg-rose-500 text-white' :
                selected    ? 'border-ink-900 dark:border-ink-50 text-ink-900 dark:text-ink-50' :
                              'border-ink-300 dark:border-ink-700 text-ink-600 dark:text-ink-400',
              ].join(' ')}>{opt.id}</span>
              <span className="text-[15px] leading-relaxed flex-1 pt-0.5">{opt.text}</span>
            </button>
          );
        })}
      </div>

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
            {!isCorrect && <span className="text-xs text-ink-500">Best answer: <strong className="text-ink-900 dark:text-ink-50">{q.answer}</strong></span>}
          </div>
          <MarkdownView>{q.explanation}</MarkdownView>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="btn-ghost">← Library</Link>
        {!isSubmitted ? (
          <button
            onClick={() => userChoice && setSubmitted(s => ({ ...s, [q.id]: true }))}
            disabled={!userChoice}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => {
              if (idx + 1 < deck.length) setIdx(idx + 1);
              else setFinished(true);
            }}
            className="btn-primary"
          >
            {idx + 1 < deck.length ? 'Next scenario →' : 'Finish →'}
          </button>
        )}
      </div>
    </div>
  );
}
