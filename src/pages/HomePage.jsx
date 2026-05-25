import { Link } from 'react-router-dom';
import { TOPICS, totalCounts } from '../data/curriculum';
import { authoredLessonIds } from '../lib/content';
import { findLesson } from '../data/curriculum';
import TopicCard from '../components/curriculum/TopicCard';
import WeightBar from '../components/curriculum/WeightBar';

const EXAM_TARGET = new Date('2027-11-15'); // approximate Nov 2027 sitting

function daysUntilExam() {
  const today = new Date();
  const ms = EXAM_TARGET.getTime() - today.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function HomePage() {
  const counts = totalCounts();
  const days = daysUntilExam();
  const authored = authoredLessonIds().map(id => findLesson(id)).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-24">
      {/* Hero */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-5">
          <span className="pill-accent">Welcome, Peter</span>
          <span className="pill-muted">CFA Level 1 · Nov 2027 target</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter text-ink-900 dark:text-ink-50 max-w-3xl leading-[1.05]">
          The whole Level&nbsp;1 syllabus, in one place. Learn it, test it, master it.
        </h1>
        <p className="mt-5 text-lg text-ink-500 dark:text-ink-400 max-w-2xl leading-relaxed">
          A focused study companion that maps the entire CFA Level&nbsp;1 curriculum,
          surfaces clear explanations on every concept, and tests you in real exam format.
        </p>

        {/* Stat strip */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-200/60 dark:bg-ink-800/60 rounded-2xl overflow-hidden border border-ink-200/60 dark:border-ink-800/60">
          <Stat label="Topics"        value={counts.topics} />
          <Stat label="Modules"       value={counts.modules} />
          <Stat label="LOS to learn"  value={counts.los} />
          <Stat label="Days to exam"  value={days.toLocaleString()} accent />
        </div>
      </section>

      {/* Authored lessons spotlight */}
      {authored.length > 0 && (
        <section className="mb-16">
          <SectionHeader
            eyebrow="Just authored"
            title="Lessons with full content ready to study"
            hint={`${authored.length} lesson${authored.length === 1 ? '' : 's'} with explanations, formulas, worked examples`}
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {authored.map(({ topic, module, lesson }) => (
              <Link
                key={lesson.id}
                to={`/lesson/${lesson.id}`}
                className="card card-hover p-5 group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-500">
                    {topic.shortName} · {module.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-50 leading-tight">
                    {lesson.name}
                  </h3>
                  <span className="text-ink-300 group-hover:text-ink-500 transition-colors" aria-hidden>→</span>
                </div>
                <p className="text-xs text-ink-500 mt-1">{lesson.los?.length ?? 0} LOS · full content</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Weight bar */}
      <section className="mb-16">
        <SectionHeader
          eyebrow="Curriculum weight"
          title="How the exam splits across 10 topic areas"
          hint="Hover a band to see the topic"
        />
        <div className="mt-6">
          <WeightBar />
        </div>
      </section>

      {/* Topic grid */}
      <section>
        <SectionHeader
          eyebrow="The library"
          title="Pick a topic to start"
          hint={`${counts.topics} topics · ${counts.modules} modules`}
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map(t => <TopicCard key={t.id} topic={t} />)}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, hint }) {
  return (
    <div className="flex items-end justify-between gap-6 flex-wrap">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-400">{eyebrow}</div>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50">
          {title}
        </h2>
      </div>
      {hint && <div className="text-sm text-ink-500">{hint}</div>}
    </div>
  );
}

function Stat({ label, value, suffix, accent }) {
  return (
    <div className="bg-white dark:bg-ink-950 px-5 py-4 flex flex-col">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</span>
      <span className={[
        'mt-1 num font-display text-2xl font-semibold tracking-tight',
        accent ? 'text-accent-600 dark:text-accent-400' : 'text-ink-900 dark:text-ink-50',
      ].join(' ')}>
        {value}{suffix && <span className="text-base font-normal text-ink-500 ml-0.5">{suffix}</span>}
      </span>
    </div>
  );
}
