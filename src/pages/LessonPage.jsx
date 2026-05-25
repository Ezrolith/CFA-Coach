import { Link, useParams } from 'react-router-dom';

// Placeholder — Phase 3 will give this real content rendering (markdown + KaTeX, three modes, FAQ).
export default function LessonPage() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      <nav className="text-sm text-ink-500 mb-6">
        <Link to="/" className="hover:text-ink-900 dark:hover:text-ink-50 transition-colors">Library</Link>
        <span className="mx-2 text-ink-300">/</span>
        <span>Lesson</span>
      </nav>

      <h1 className="font-display text-3xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
        Lesson detail
      </h1>
      <p className="mt-2 text-ink-500 text-sm font-mono">{id}</p>

      <div className="mt-10 card p-6 text-sm text-ink-500 leading-relaxed">
        Phase 3 will render the lesson body here: the three-mode explanation (New / Pro / Exam),
        worked examples, key formulas in KaTeX, common pitfalls, mini-FAQ, and curated resources.
      </div>
    </div>
  );
}
