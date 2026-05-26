import { useEffect, useRef, useState } from 'react';
import { setNote } from '../../lib/progress';

// Personal notes textarea — auto-saves to localStorage on blur and via debounce.
export default function LessonNotes({ lessonId, initialNote }) {
  const [text, setText] = useState(initialNote?.text ?? '');
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const lastSavedRef = useRef(initialNote?.text ?? '');
  const debounceRef = useRef(null);

  // Reset state when navigating between lessons.
  useEffect(() => {
    setText(initialNote?.text ?? '');
    lastSavedRef.current = initialNote?.text ?? '';
    setSaveState('idle');
  }, [lessonId, initialNote?.text]);

  function persist(value) {
    if (value === lastSavedRef.current) return;
    setNote(lessonId, value);
    lastSavedRef.current = value;
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 1500);
  }

  function handleChange(e) {
    const value = e.target.value;
    setText(value);
    setSaveState('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persist(value), 700);
  }

  function handleBlur() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    persist(text);
  }

  const updatedAt = initialNote?.updatedAt;
  const updatedAtLabel = updatedAt ? new Date(updatedAt).toLocaleString() : null;

  return (
    <section className="card p-6 mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">
          Your notes
        </h2>
        <span className="text-[10px] text-ink-400">
          {saveState === 'saving' && 'Saving…'}
          {saveState === 'saved' && '✓ Saved'}
          {saveState === 'idle' && updatedAtLabel && `Last saved ${updatedAtLabel}`}
        </span>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Jot down your own summary, a worked example, or a question you want to revisit. Saved locally to this browser."
        rows={6}
        className="w-full resize-y rounded-md bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 px-4 py-3 text-sm text-ink-800 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-shadow"
      />
    </section>
  );
}
