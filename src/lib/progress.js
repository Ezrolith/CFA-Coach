// Per-browser progress state, stored in localStorage.
// Schema (versioned for future migration):
// {
//   version: 1,
//   lessonsStudied: { [lessonId]: { studiedAt: ISO_TS } },
//   quizResults:    { [lessonId]: { lastPct, lastTaken, bestPct, takenCount, last: { correct, total } } },
// }

const STORAGE_KEY = 'cfa-coach-progress-v1';

const EMPTY = {
  version: 1,
  lessonsStudied: {},
  quizResults: {},
};

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return { ...EMPTY };
    return { ...EMPTY, ...parsed };
  } catch {
    return { ...EMPTY };
  }
}

function write(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or privacy mode — fail silently */
  }
}

// --- Lesson studied state ---

export function isLessonStudied(lessonId) {
  return Boolean(read().lessonsStudied[lessonId]);
}

export function markLessonStudied(lessonId) {
  const state = read();
  state.lessonsStudied[lessonId] = { studiedAt: new Date().toISOString() };
  write(state);
  notify();
}

export function unmarkLessonStudied(lessonId) {
  const state = read();
  delete state.lessonsStudied[lessonId];
  write(state);
  notify();
}

export function studiedLessonIds() {
  return Object.keys(read().lessonsStudied);
}

// --- Quiz results ---

export function recordQuizResult(lessonId, correct, total) {
  const state = read();
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const existing = state.quizResults[lessonId] ?? { takenCount: 0, bestPct: 0 };
  state.quizResults[lessonId] = {
    lastPct: pct,
    lastTaken: new Date().toISOString(),
    bestPct: Math.max(existing.bestPct ?? 0, pct),
    takenCount: (existing.takenCount ?? 0) + 1,
    last: { correct, total },
  };
  write(state);
  notify();
}

export function getQuizResult(lessonId) {
  return read().quizResults[lessonId] ?? null;
}

export function allQuizResults() {
  return read().quizResults;
}

// --- Reset (settings page utility) ---

export function clearAllProgress() {
  write({ ...EMPTY });
  notify();
}

// --- Cross-component reactivity (simple pub/sub) ---

const listeners = new Set();
function notify() { listeners.forEach(l => l()); }

export function subscribeProgress(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
