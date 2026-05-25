// Per-browser progress state, stored in localStorage.
// Schema (versioned for future migration):
// v1: { lessonsStudied, quizResults }
// v2: + reviews: { [lessonId]: { ef, interval, reps, nextDueISO, lastQuality, lastReviewedISO } }

const STORAGE_KEY = 'cfa-coach-progress-v1';

const EMPTY = {
  version: 1,
  lessonsStudied: {},
  quizResults: {},
  reviews: {},
  activityDays: {},   // { 'YYYY-MM-DD': true } — any day with study activity
};

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function recordActivity(state) {
  state.activityDays[dateKey()] = true;
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return { ...EMPTY };
    return {
      ...EMPTY,
      ...parsed,
      reviews: parsed.reviews ?? {},
      activityDays: parsed.activityDays ?? {},
    };
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
  // Seed a review entry so the lesson enters the SR queue.
  if (!state.reviews[lessonId]) {
    state.reviews[lessonId] = seedReview();
  }
  recordActivity(state);
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

  // Feed the SR algorithm: map quiz % to SM-2 quality (0–5).
  const quality = quizPctToQuality(pct);
  state.reviews[lessonId] = applySm2(state.reviews[lessonId] ?? seedReview(), quality);

  recordActivity(state);
  write(state);
  notify();
}

export function getQuizResult(lessonId) {
  return read().quizResults[lessonId] ?? null;
}

export function allQuizResults() {
  return read().quizResults;
}

// --- SM-2 spaced repetition ---

// Seed a fresh card.
function seedReview() {
  return {
    ef: 2.5,           // easiness factor
    interval: 0,       // days
    reps: 0,           // successful repetitions in a row
    nextDueISO: new Date().toISOString(), // due immediately on first creation
    lastQuality: null,
    lastReviewedISO: null,
  };
}

// SM-2 update step. q: 0..5 quality of recall.
function applySm2(card, q) {
  const c = { ...card };
  c.lastQuality = q;
  c.lastReviewedISO = new Date().toISOString();

  if (q < 3) {
    c.reps = 0;
    c.interval = 1;
  } else {
    if (c.reps === 0) c.interval = 1;
    else if (c.reps === 1) c.interval = 6;
    else c.interval = Math.round(c.interval * c.ef);
    c.reps += 1;
  }

  // Update easiness factor; clamp at 1.3 lower bound.
  c.ef = Math.max(1.3, c.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  const due = new Date();
  due.setDate(due.getDate() + c.interval);
  c.nextDueISO = due.toISOString();

  return c;
}

// Quiz % → SM-2 quality (0–5)
function quizPctToQuality(pct) {
  if (pct >= 95) return 5;
  if (pct >= 80) return 4;
  if (pct >= 65) return 3;
  if (pct >= 50) return 2;
  if (pct >= 30) return 1;
  return 0;
}

// Manual rating from the /review page (1=again, 2=hard, 3=good, 4=easy).
const MANUAL_RATING_TO_Q = { again: 1, hard: 3, good: 4, easy: 5 };

export function gradeReview(lessonId, ratingKey) {
  const state = read();
  const q = MANUAL_RATING_TO_Q[ratingKey] ?? 3;
  state.reviews[lessonId] = applySm2(state.reviews[lessonId] ?? seedReview(), q);
  recordActivity(state);
  write(state);
  notify();
}

// --- Streak tracking ---

export function getStreak() {
  const days = read().activityDays;
  let streak = 0;
  const d = new Date();
  // Count back: today + each previous consecutive day with activity.
  while (days[dateKey(d)]) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function getTotalActiveDays() {
  return Object.keys(read().activityDays).length;
}

export function getReview(lessonId) {
  return read().reviews[lessonId] ?? null;
}

export function allReviews() {
  return read().reviews;
}

// Returns lessonIds whose next-due date is today or earlier, ordered most-overdue first.
export function dueReviewIds(asOf = new Date()) {
  const reviews = read().reviews;
  const out = [];
  for (const [lessonId, card] of Object.entries(reviews)) {
    const due = new Date(card.nextDueISO);
    if (due.getTime() <= asOf.getTime()) {
      out.push({ lessonId, daysOverdue: (asOf.getTime() - due.getTime()) / (1000 * 60 * 60 * 24) });
    }
  }
  out.sort((a, b) => b.daysOverdue - a.daysOverdue);
  return out.map(x => x.lessonId);
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
