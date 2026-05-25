import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { questionsForLesson, questionsForTopic, allQuestions } from '../lib/questions';
import { findLesson, getTopicById } from '../data/curriculum';
import QuizPlayer from '../components/quiz/QuizPlayer';

export default function QuizPage() {
  const [params] = useSearchParams();
  const lessonId = params.get('lesson');
  const topicId = params.get('topic');

  let questions = [];
  let title = 'Practice quiz';
  let returnTo = '/';

  if (lessonId) {
    const found = findLesson(lessonId);
    if (!found) return <Navigate to="/quiz" replace />;
    questions = questionsForLesson(lessonId);
    title = `${found.topic.shortName} · ${found.lesson.name}`;
    returnTo = `/lesson/${lessonId}`;
  } else if (topicId) {
    const topic = getTopicById(topicId);
    if (!topic) return <Navigate to="/quiz" replace />;
    questions = questionsForTopic(topicId);
    title = `${topic.shortName} · topic quiz`;
    returnTo = `/topic/${topicId}`;
  } else {
    questions = allQuestions();
    title = 'Mixed practice';
  }

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400 mb-3">No questions yet</div>
        <h1 className="font-display text-3xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50">
          Question bank empty for this scope.
        </h1>
        <p className="mt-4 text-ink-500">Question banks are authored alongside lesson content. Come back as more lessons get full content.</p>
        <Link to="/" className="btn-primary mt-8">← Back to library</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
      <QuizPlayer
        questions={questions}
        title={title}
        returnTo={returnTo}
        recordKey={lessonId ?? null}
      />
    </div>
  );
}
