// Single placeholder used for routes whose UI lands in later phases.

export default function PlaceholderPage({ title, eyebrow, body, phase }) {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
      {eyebrow && (
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 leading-tight">
        {title}
      </h1>
      <p className="mt-5 text-lg text-ink-500 dark:text-ink-400 leading-relaxed">
        {body}
      </p>
      {phase && (
        <div className="mt-8 inline-flex items-center gap-2 pill-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
          Coming in Phase {phase}
        </div>
      )}
    </div>
  );
}
