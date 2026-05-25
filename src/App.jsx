import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import MockExamPage from './pages/MockExamPage';
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
          <Route path="/mock-exam" element={<MockExamPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
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
