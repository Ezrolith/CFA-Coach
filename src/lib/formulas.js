// Collect every formula from every authored lesson into a flat list, annotated with topic/lesson.

import { authoredLessonIds, getLessonContent } from './content';
import { findLesson } from '../data/curriculum';

export function allFormulas() {
  const out = [];
  for (const lessonId of authoredLessonIds()) {
    const content = getLessonContent(lessonId);
    if (!content?.formulas?.length) continue;
    const found = findLesson(lessonId);
    if (!found) continue;
    for (const f of content.formulas) {
      out.push({
        ...f,
        lessonId,
        lessonName: found.lesson.name,
        topicId: found.topic.id,
        topicShortName: found.topic.shortName,
      });
    }
  }
  return out;
}
