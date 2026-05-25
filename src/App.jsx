import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import PlaceholderPage from './pages/PlaceholderPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/review" element={
            <PlaceholderPage
              eyebrow="Daily review"
              title="Your spaced-repetition queue lives here."
              body="Once you've started studying, this page shows the lessons and questions due for review today, based on what you've seen and how confidently you answered."
              phase="6"
            />
          }/>
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/mock-exam" element={
            <PlaceholderPage
              eyebrow="Mock exam"
              title="180 questions. Two sessions. Real exam conditions."
              body="A full simulation of the CFA Level 1 exam, with the official topic weights, timing, and no-back-skipping between sessions."
              phase="9"
            />
          }/>
          <Route path="/progress" element={
            <PlaceholderPage
              eyebrow="Progress"
              title="See exactly where you stand."
              body="Heatmap of confidence across every topic and module, streaks, study time, and a predicted-readiness score that updates as you go."
              phase="7"
            />
          }/>
          <Route path="/settings" element={
            <PlaceholderPage
              eyebrow="Settings"
              title="Account, appearance, study preferences."
              body="Connects your Google account for cloud-synced progress (Phase 1+), and lets you toggle dark mode, default explanation depth, daily targets."
              phase="1"
            />
          }/>
          <Route path="*" element={
            <PlaceholderPage
              eyebrow="Lost?"
              title="Page not found."
              body="The link you followed doesn't exist (yet). Head back to the library to pick a topic."
            />
          }/>
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
