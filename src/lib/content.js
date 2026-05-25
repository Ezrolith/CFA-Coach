// Eager-loads every per-lesson content JSON in /content/lessons/*.json at build time.
// Each file's shape is documented in components/lesson/LessonContent.jsx.

const modules = import.meta.glob('../../content/lessons/*.json', { eager: true });

const LESSONS = {};
for (const path in modules) {
  const data = modules[path].default ?? modules[path];
  if (data && data.lessonId) {
    LESSONS[data.lessonId] = data;
  }
}

export function getLessonContent(lessonId) {
  return LESSONS[lessonId] ?? null;
}

export function hasLessonContent(lessonId) {
  return Boolean(LESSONS[lessonId]);
}

export function authoredLessonIds() {
  return Object.keys(LESSONS);
}
