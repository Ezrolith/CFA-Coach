// Loads question banks from /content/questions/*.json at build time.

const modules = import.meta.glob('../../content/questions/*.json', { eager: true });

const QUESTIONS = [];
const BY_LESSON = {};
const BY_TOPIC = {};

for (const path in modules) {
  const data = modules[path].default ?? modules[path];
  if (!data?.questions) continue;
  for (const q of data.questions) {
    const enriched = { ...q, topicId: data.topicId };
    QUESTIONS.push(enriched);
    if (q.lessonId) {
      (BY_LESSON[q.lessonId] ||= []).push(enriched);
    }
    (BY_TOPIC[data.topicId] ||= []).push(enriched);
  }
}

export function allQuestions() {
  return QUESTIONS;
}

export function questionsForLesson(lessonId) {
  return BY_LESSON[lessonId] ?? [];
}

export function questionsForTopic(topicId) {
  return BY_TOPIC[topicId] ?? [];
}

// Fisher-Yates shuffle with optional seed (basic — deterministic enough).
export function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
