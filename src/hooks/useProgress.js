import { useEffect, useState } from 'react';
import {
  subscribeProgress, isLessonStudied, getQuizResult, studiedLessonIds,
  allQuizResults, getStreak, getTotalActiveDays, getNote, notedLessonCount,
} from '../lib/progress';

// Force a re-render whenever progress state changes anywhere in the app.
function useProgressTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeProgress(() => setTick(t => t + 1)), []);
  return tick;
}

export function useLessonProgress(lessonId) {
  useProgressTick();
  return {
    studied: isLessonStudied(lessonId),
    quiz: getQuizResult(lessonId),
    note: getNote(lessonId),
  };
}

export function useGlobalProgress() {
  useProgressTick();
  return {
    studiedIds: studiedLessonIds(),
    quizResults: allQuizResults(),
    streak: getStreak(),
    activeDays: getTotalActiveDays(),
    noteCount: notedLessonCount(),
  };
}
