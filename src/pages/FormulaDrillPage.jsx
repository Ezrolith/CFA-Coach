import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { allFormulas } from '../lib/formulas';
import { styleFor } from '../data/topicStyles';
import { shuffle } from '../lib/questions';

export default function FormulaDrillPage() {
  const formulas = useMemo(() => allFormulas(), []);
  const [deck, setDeck] = useState(() => shuffle(formulas));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState({}); // { name: 'knew' | 'review' }
  const [direction, setDirection] = useState('name->formula'); // or 'formula->name'

  useEffect(() => {
    setDeck(shuffle(formulas));
    setIdx(0);
    setRevealed(false);
    setResults({});
  }, [formulas, direction]);

  if (deck.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
          No formulas in the deck yet.
        </h1>
        <p className="mt-3 text-ink-500">Formulas appear here automatically as lessons are authored.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">← Library</Link>
      </div>
    );
  }

  const card = deck[idx];
  const knewCount = Object.values(results).filter(v => v === 'knew').length;
  const reviewCount = Object.values(results).filter(v => v === 'review').length;
  const finished = idx >= deck.length;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">Drill complete</div>
        <div className="num font-display text-7xl font-bold tracking-tighter text-ink-900 dark:text-ink-50">
          {Math.round((knewCount / deck.length) * 100)}<span className="text-3xl text-ink-400">%</span>
        </div>
        <div className="mt-2 text-ink-500">{knewCount} known · {reviewCount} to review</div>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="btn-ghost">← Library</Link>
          <button onClick={() => { setDeck(shuffle(formulas)); setIdx(0); setRevealed(false); setResults({}); }} className="btn-primary">
            Shuffle and retry
          </button>
        </div>
      </div>
    );
  }

  const grade = (verdict) => {
    setResults(r => ({ ...r, [card.name]: verdict }));
    setIdx(idx + 1);
    setRevealed(false);
  };

  const s = styleFor(card.topicId);

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">Formula drill</div>
        <div className="flex items-center gap-1 text-[11px]">
          <button
            onClick={() => setDirection('name->formula')}
            className={[
              'px-2.5 py-1 rounded-full transition-colors',
              direction === 'name->formula' ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-ink-500 hover:text-ink-900 dark:hover:text-ink-50',
            ].join(' ')}
          >Name → Formula</button>
          <button
            onClick={() => setDirection('formula->name')}
            className={[
              'px-2.5 py-1 rounded-full transition-colors',
              direction === 'formula->name' ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'text-ink-500 hover:text-ink-900 dark:hover:text-ink-50',
            ].join(' ')}
          >Formula → Name</button>
        </div>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
        Card {idx + 1} of {deck.length}
      </h1>

      <div className="mt-4 h-1 w-full rounded-full bg-ink-100 dark:bg-ink-900 overflow-hidden">
        <div
          className="h-full bg-accent-500 transition-all duration-300 ease-out-soft"
          style={{ width: `${(idx / deck.length) * 100}%` }}
        />
      </div>

      <section className="card mt-8 p-6 md:p-10 min-h-[280px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <Link to={`/lesson/${card.lessonId}`} className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
            {card.topicShortName} · {card.lessonName}
          </Link>
        </div>

        {/* Prompt */}
        <div className="flex-1 flex flex-col justify-center text-center">
          {direction === 'name->formula' ? (
            <>
              <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-2">Recall the formula</div>
              <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                {card.name}
              </div>
              {card.plain && <p className="mt-3 text-sm text-ink-500 max-w-lg mx-auto">{card.plain}</p>}
              {revealed && (
                <div className="mt-8 text-xl md:text-2xl overflow-x-auto">
                  <BlockMath math={card.latex} settings={{ strict: false }} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-2">Name this formula</div>
              <div className="text-xl md:text-2xl overflow-x-auto">
                <BlockMath math={card.latex} settings={{ strict: false }} />
              </div>
              {revealed && (
                <div className="mt-8 font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                  {card.name}
                </div>
              )}
              {revealed && card.plain && <p className="mt-3 text-sm text-ink-500 max-w-lg mx-auto">{card.plain}</p>}
            </>
          )}
        </div>

        <div className="mt-8">
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="btn-primary w-full">
              Show {direction === 'name->formula' ? 'formula' : 'name'} →
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => grade('review')}
                className="btn bg-rose-600 hover:bg-rose-700 text-white"
              >
                Review again
              </button>
              <button
                onClick={() => grade('knew')}
                className="btn bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Knew it
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between text-sm text-ink-500">
        <div>{knewCount} known · {reviewCount} to review</div>
        <Link to="/" className="text-ink-500 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">← Library</Link>
      </div>
    </div>
  );
}
