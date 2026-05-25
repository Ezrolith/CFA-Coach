// Build a mock exam by sampling from the question bank with topic weights.
// Falls back gracefully when the bank is small (most topics still unauthored).

import { TOPICS } from '../data/curriculum';
import { allQuestions, shuffle } from './questions';

export function buildMockExam(targetCount = 30) {
  const pool = allQuestions();
  if (pool.length === 0) return [];

  // Group by topic
  const byTopic = {};
  for (const q of pool) {
    (byTopic[q.topicId] ||= []).push(q);
  }

  // Allocate seats by topic weight (midpoint), rounded down — then top up with random.
  const totalWeight = TOPICS.reduce((s, t) => s + (t.weightLow + t.weightHigh) / 2, 0);
  const allocations = TOPICS.map(t => ({
    topicId: t.id,
    weight: (t.weightLow + t.weightHigh) / 2,
    available: (byTopic[t.id] ?? []).length,
    target: 0,
  }));
  for (const a of allocations) {
    const ideal = (a.weight / totalWeight) * targetCount;
    a.target = Math.min(a.available, Math.floor(ideal));
  }

  let picked = [];
  for (const a of allocations) {
    const fromTopic = shuffle(byTopic[a.topicId] ?? []).slice(0, a.target);
    picked = picked.concat(fromTopic);
  }

  // Top up to target with whatever's left
  const used = new Set(picked.map(q => q.id));
  const remaining = shuffle(pool.filter(q => !used.has(q.id)));
  while (picked.length < targetCount && remaining.length > 0) {
    picked.push(remaining.shift());
  }

  return shuffle(picked);
}

// Group results by topic for a post-exam breakdown.
export function groupResultsByTopic(questions, answers) {
  const byTopic = {};
  for (const q of questions) {
    const bucket = (byTopic[q.topicId] ||= { topicId: q.topicId, total: 0, correct: 0 });
    bucket.total += 1;
    if (answers[q.id] === q.answer) bucket.correct += 1;
  }
  return Object.values(byTopic).sort((a, b) => a.topicId.localeCompare(b.topicId));
}
