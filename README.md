# CFA·Coach

A focused, information-dense study companion for the CFA Level 1 exam.
Maps the entire syllabus, surfaces clear explanations on every concept,
and tests you in real exam format.

> **Status:** Phase 1 scaffold — homepage, topic + lesson routes, full curriculum skeleton (10 topics · 93 modules). Lesson content authoring sprints come next.

## Stack

- React 18 + Vite + React Router
- Tailwind CSS (custom `ink` + `accent` palette, Inter + JetBrains Mono)
- Firebase (Spark / free tier): Hosting + Firestore + Auth — *to be wired up in Phase 1.5*
- KaTeX for formula rendering — *Phase 3*

No backend, no API keys, no runtime cost. All curriculum + lesson content lives as static JSON / Markdown in `/content`, authored by hand and committed to the repo.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173 (or whichever Vite picks)
npm run build    # produces ./dist
npm run preview
```

## Project layout

```
content/             # All study content (curriculum, lessons, questions)
  curriculum/        # one JSON file per topic
  lessons/           # one Markdown file per LOS (coming)
  questions/         # question bank per topic (coming)
src/
  components/        # UI components (layout, curriculum, quiz, lesson, progress)
  pages/             # Route-level pages
  data/              # Curriculum loader + topic styles
  hooks/             # React hooks (auth, progress, content)
  lib/               # Algorithms (spaced repetition, mock exam builder)
```

## See also

- [PLAN.md](./PLAN.md) — the master plan (current: v0.3)

---

CFA® is a trademark of CFA Institute. This tool is independent and unaffiliated.
