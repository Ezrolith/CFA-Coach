// Build a lightweight search index across all curriculum lessons + their authored content.
// Used by the command-palette overlay.

import { TOPICS } from '../data/curriculum';
import { getLessonContent } from './content';

// Build once at module load. The TOPICS + lesson content are static at build time.
const INDEX = buildIndex();

function buildIndex() {
  const items = [];
  for (const topic of TOPICS) {
    for (const module of topic.modules ?? []) {
      for (const lesson of module.lessons ?? []) {
        const content = getLessonContent(lesson.id);
        const formulas = (content?.formulas ?? []).map(f => f.name).join(' ');
        const losText = (lesson.los ?? []).map(l => l.statement).join(' ');

        // Haystack lowercased once for speed.
        const haystack = [
          lesson.name,
          module.name,
          topic.name,
          topic.shortName,
          formulas,
          losText,
        ].join(' ').toLowerCase();

        items.push({
          type: 'lesson',
          id: lesson.id,
          title: lesson.name,
          subtitle: `${topic.shortName} · ${module.name}`,
          topicId: topic.id,
          formulaCount: content?.formulas?.length ?? 0,
          hasContent: Boolean(content),
          haystack,
        });

        // Also index formulas individually so users can jump straight to the lesson.
        (content?.formulas ?? []).forEach(f => {
          items.push({
            type: 'formula',
            id: `${lesson.id}#formula-${f.name}`,
            lessonId: lesson.id,
            title: f.name,
            subtitle: `${topic.shortName} · ${lesson.name}`,
            topicId: topic.id,
            haystack: [f.name, f.plain, lesson.name, topic.shortName].join(' ').toLowerCase(),
          });
        });
      }
    }
  }
  return items;
}

// Simple ranked match: every search token must appear in haystack.
// Scoring: bonus for matches in title; bonus for prefix match; penalty for length.
export function searchAll(query, limit = 12) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const matches = [];
  for (const item of INDEX) {
    let allMatch = true;
    let score = 0;
    const titleLower = item.title.toLowerCase();

    for (const t of tokens) {
      if (!item.haystack.includes(t)) {
        allMatch = false;
        break;
      }
      if (titleLower.includes(t)) score += 5;
      if (titleLower.startsWith(t)) score += 4;
    }

    if (!allMatch) continue;

    // Slight preference for full lessons over formula refs.
    if (item.type === 'lesson') score += 1;

    matches.push({ ...item, score });
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit);
}
