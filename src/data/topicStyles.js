// Each topic gets a subtle accent hue, used as a thin underline / pill colour.
// We keep things restrained — these are *tints* layered on a monochrome base.

export const TOPIC_STYLES = {
  ethics: {
    accent: '#b45309', // amber-700 — gravitas
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/30',
    soft: 'bg-amber-500/5',
  },
  quant: {
    accent: '#0ea5e9', // sky-500
    dot: 'bg-sky-500',
    text: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500/30',
    soft: 'bg-sky-500/5',
  },
  economics: {
    accent: '#14b8a6', // teal-500
    dot: 'bg-teal-500',
    text: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-500/30',
    soft: 'bg-teal-500/5',
  },
  fra: {
    accent: '#6366f1', // indigo-500
    dot: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500/30',
    soft: 'bg-indigo-500/5',
  },
  'corp-issuers': {
    accent: '#a855f7', // purple-500
    dot: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/30',
    soft: 'bg-purple-500/5',
  },
  equity: {
    accent: '#10b981', // emerald-500
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/30',
    soft: 'bg-emerald-500/5',
  },
  'fixed-income': {
    accent: '#f43f5e', // rose-500
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/30',
    soft: 'bg-rose-500/5',
  },
  derivatives: {
    accent: '#06b6d4', // cyan-500
    dot: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    ring: 'ring-cyan-500/30',
    soft: 'bg-cyan-500/5',
  },
  alts: {
    accent: '#f97316', // orange-500
    dot: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    ring: 'ring-orange-500/30',
    soft: 'bg-orange-500/5',
  },
  portfolio: {
    accent: '#3a6bf5', // accent blue
    dot: 'bg-accent-500',
    text: 'text-accent-600 dark:text-accent-400',
    ring: 'ring-accent-500/30',
    soft: 'bg-accent-500/5',
  },
};

export function styleFor(topicId) {
  return TOPIC_STYLES[topicId] ?? {
    accent: '#5e5e68',
    dot: 'bg-ink-400',
    text: 'text-ink-600 dark:text-ink-400',
    ring: 'ring-ink-400/30',
    soft: 'bg-ink-500/5',
  };
}
