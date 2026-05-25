# CFA-Coach — Master Plan

> v0.6 — updated 2026-05-25. **Phases 1, 2, 3, 5, 7, 9 shipped + Phases 4/6/10 in progress.** Live at https://cfa-coach-app.web.app · code at https://github.com/Ezrolith/CFA-Coach.

## Status

| Phase | Status | Notes |
|---|---|---|
| 1 — Foundation | ✅ Shipped | Vite + React + Tailwind, Firebase project `cfa-coach-app`, deployed |
| 2 — Curriculum skeleton | ✅ Shipped | 10 topics · 93 modules · **327 LOS** with verb pills + draft flags |
| 3 — Lesson content viewer | ✅ Shipped | Markdown + KaTeX, three-mode tabs, formulas / examples / pitfalls / FAQ / resources |
| 4 — Content authoring | 🟡 In progress | **8 lessons fully authored** (TVM, Rates & Returns, Ethics I, Eq Val, FRA Inc Stmts, PM Risk II, FI Bond Val, Derivatives Options). ~320 LOS still to write |
| 5 — Quiz engine | ✅ Shipped | Player works, **48 questions** across Quant/Ethics/Equity/FRA/PM/FI/Derivatives |
| 6 — Spaced repetition | 🟡 Lite shipped | localStorage study state + quiz score tracking. SM-2 scheduling not yet wired |
| 7 — Progress dashboard | ✅ Shipped | Per-topic heatmap, readiness %, quiz performance, suggested focus |
| 8 — Content sprint #2 (Alts/Corp/Econ/more) | ⏳ Next | |
| 9 — Mock exam | ✅ Shipped | 30-question scaled simulation with topic weighting, timer, flag-for-review, by-topic breakdown |
| 10 — PWA + mobile polish | 🟡 Lite shipped | Manifest + service worker; mobile polish still to come |
| 11 — Settings + theme | ✅ Shipped (added scope) | Dark/Light/System theme toggle + reset-progress button |
| 12 — Polish + drills | ⏳ | |


---

## 1. Vision

A web-based interactive study companion that takes you from zero CFA knowledge to ready-to-pass Level 1 over ~18 months. Three core jobs:

1. **Map the territory** — show the full Level 1 curriculum down to the smallest unit (Learning Outcome Statement), so you always know where you are and what's next.
2. **Be a knowledge fountain** — for every topic, surface pre-authored explanations, worked examples, key formulas, common pitfalls, and curated external resources.
3. **Test and track** — quiz you in CFA format from a curated question bank, flag weak areas, schedule reviews, and simulate the real exam closer to the date.

Target learner: you, Peter. Public on GitHub so others *could* use it, but optimised for one learner.

**Target exam:** approximately Nov 2027 (18 months from May 2026). Long runway → we build properly and grow content organically.

---

## 2. Architecture

Free-tier, no API keys, no servers, no Cloud Functions. Everything is static or in Firestore.

| Layer | Choice | Why |
|---|---|---|
| **Framework** | React 18 + Vite | The UX (multi-page, dynamic quizzes, dashboards, spaced repetition, mock exam) outgrows a single-file pattern. Vite = instant dev server, fast builds, no Webpack pain. |
| **Styling** | Tailwind CSS | Polished "finance-tool" look without writing CSS files. |
| **Language** | JavaScript | Matches HannaPig style. Migrate to TS later only if pain emerges. |
| **State / Routing** | React Router + Zustand | Lightweight. No Redux. |
| **Curriculum + content** | Static JSON/Markdown files in the repo | All content authored by us during Claude Code sessions, committed to GitHub. Free forever, version-controlled, no runtime cost. |
| **Database** | Firebase Firestore (Spark/free tier) | Per-user progress, notes, quiz results, spaced-repetition schedule. Free tier comfortably covers a single user. |
| **Auth** | Firebase Auth (Google sign-in) | One click, no passwords. Enables multi-user if it ever takes off. |
| **Hosting** | Firebase Hosting (Spark/free) | Same flow you know from HannaPig. |
| **PWA** | Phase 10 — installable, offline-capable | |

### Trade-offs you should know
- **Build step**: `npm run dev` to work on it, `npm run build` to deploy. Small learning curve, then smooth.
- **No live AI Q&A** in the app. Compensating: I author broad, deep content per LOS during sessions (explain three different ways, worked examples, pitfalls, FAQ). For ad-hoc follow-ups during study, you have Claude.ai on tap separately.
- **Spark plan limits**: Firestore is 1 GiB storage + 50K reads/day + 20K writes/day, Hosting is 10 GB/month bandwidth. Solo use → not even close to the limits.

---

## 3. Locked-in Decisions

- **Project name:** CFA-Coach
- **GitHub repo:** `Ezrolith/CFA-Coach`, **public**
- **No Anthropic API.** All content pre-authored, no runtime AI.
- **Firebase Spark plan only** (free tier). No Cloud Functions.
- **Personalisation: on** — tool uses your name, adapts to your background.
- **JS not TS.** Matches HannaPig style; revisit later if needed.
- **One repo, one app.** Not a monorepo.
- **Curriculum data lives in JSON files** in the repo (version controlled).
- **User progress lives in Firestore** (synced across devices).
- **Desktop-first, mobile-friendly.** Real exam is desktop; you'll study mostly on a laptop.

### Learner profile (Peter)

- **Day job:** commercial role in telecoms — pricing decisions, gross margin, profitability, payback period work. Financially literate but not from inside the financial industry.
- **Implication for content authoring:**
  - Basic finance vocabulary (margin, NPV-style payback thinking, cost vs. revenue framing) is safe to use without explaining.
  - CFA-specific finance domains (equity valuation, fixed income mechanics, derivatives, FRA-style ratio analysis, portfolio theory) should default to **"Like I'm new"** mode — assume zero prior exposure.
  - Analogies to telecoms pricing / commercial decisions land well — use them where natural (e.g. WACC ↔ pricing hurdles, duration ↔ contract repricing risk, options ↔ optional-volume telco contracts).
  - Ethics is non-finance content — author for general intelligent reader, no special framing needed.

### Visual style

- **Minimal Apple-clean**, but **information-dense**. Not Duolingo-friendly, not playful.
- Goal: "look amazing, blow people away" — premium feel.
- Practical translation:
  - Typography-led design. SF Pro / Inter for UI, JetBrains Mono for numbers/formulas, KaTeX for math.
  - Mostly monochrome (true blacks/whites, soft greys), one restrained accent colour for action/highlight.
  - Heavy whitespace + tight typography hierarchy — but pack each screen with actually useful information.
  - Subtle motion (60 fps, ease-out), never bouncy.
  - Charts: minimalist line/bar, no chart-junk. Think FT/Apple Health, not Bloomberg-cluttered.
  - Dark mode as a first-class option (not an afterthought).

---

## 4. The Content Authoring Model

This replaces the "AI runtime" idea. Here's how it works:

- The curriculum (10 topics → modules → lessons → LOS) is one JSON file per topic.
- Each LOS gets its own **content package** — a markdown file (or structured JSON) with:
  - **Three-mode explanation**: *Like I'm new* / *Like I'm a finance pro* / *Exam-style* (terse, exactly what CFA wants).
  - **Worked examples** with steps shown.
  - **Key formulas** in LaTeX (rendered via KaTeX in the app).
  - **Common pitfalls** ("students often confuse X with Y...").
  - **Mini-FAQ** — anticipated follow-up questions, pre-answered.
  - **Curated resources** — links to Investopedia, free YouTube (Mark Meldrum's free content, Bionic Turtle, CFA Society webinars), etc.
  - **5–10 MCQs** in real CFA format, with detailed answer explanations.
- I author these in Claude Code sessions. We commit to the repo. The app serves them.
- Over 18 months, ~400 LOS × ~5 pages each = a serious study resource. We don't have to do it all upfront — we author as you study.

### Content authoring workflow
1. You pick a topic/module to focus on next.
2. I write the full content package for those LOS, committing to the repo as we go.
3. App auto-picks up the new content (it just reads files).
4. You study, take quizzes, flag gaps.
5. We revise/expand content based on what you found confusing or wanted more on.

This is a virtuous cycle: the more you study, the better the tool gets, the more useful for the next round of study.

---

## 5. Project Structure

```
CFA-Coach/
├── README.md
├── PLAN.md
├── CLAUDE.md                     # Project-specific Claude instructions
├── package.json
├── vite.config.js
├── tailwind.config.js
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── .firebaserc
├── public/
│   ├── icon.svg
│   ├── manifest.json
│   └── sw.js
├── content/                      # All study content (static, authored)
│   ├── curriculum/
│   │   ├── 01-ethics.json
│   │   ├── 02-quant.json
│   │   ├── 03-economics.json
│   │   ├── 04-fra.json
│   │   ├── 05-corp-issuers.json
│   │   ├── 06-equity.json
│   │   ├── 07-fixed-income.json
│   │   ├── 08-derivatives.json
│   │   ├── 09-alt-investments.json
│   │   └── 10-portfolio-mgmt.json
│   ├── lessons/
│   │   └── <los-id>.md           # one file per LOS
│   └── questions/
│       └── <topic-id>.json       # question bank per topic
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── firebase.js
    ├── content-loader.js         # reads /content/* at build time
    ├── components/
    │   ├── layout/
    │   ├── curriculum/
    │   ├── quiz/
    │   ├── progress/
    │   └── lesson/
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── TopicPage.jsx
    │   ├── LessonPage.jsx
    │   ├── QuizPage.jsx
    │   ├── MockExamPage.jsx
    │   ├── ReviewPage.jsx
    │   └── SettingsPage.jsx
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useProgress.js
    │   └── useContent.js
    └── lib/
        ├── spaced-repetition.js  # SM-2 algorithm
        └── exam-builder.js       # mock exam construction
```

---

## 6. The Curriculum Data Model

The CFA Institute organises Level 1 as:

```
Topic  ──▶  Learning Module  ──▶  Lesson  ──▶  Learning Outcome Statement (LOS)
```

Each LOS has a **command verb** (calculate, describe, explain, compare, distinguish, etc.) that signals the depth expected.

### Topic file shape:

```json
{
  "id": "quant",
  "name": "Quantitative Methods",
  "order": 2,
  "weight": "6-9%",
  "description": "Statistical foundations for finance...",
  "modules": [
    {
      "id": "quant-rates-returns",
      "name": "Rates and Returns",
      "lessons": [
        {
          "id": "quant-rates-returns-tvm",
          "name": "Time Value of Money",
          "los": [
            {
              "id": "quant-tvm-1",
              "verb": "calculate",
              "statement": "calculate and interpret the future value (FV) and present value (PV) of a single sum of money",
              "depth": "calculation",
              "subtopics": ["FV", "PV", "compounding", "discounting"],
              "contentFile": "lessons/quant-tvm-1.md"
            }
          ]
        }
      ]
    }
  ]
}
```

### 2025 weights (to verify against current CFA Institute publication when populating):

| # | Topic | Weight |
|---|---|---|
| 1 | Ethical & Professional Standards | 15–20% |
| 2 | Quantitative Methods | 6–9% |
| 3 | Economics | 6–9% |
| 4 | Financial Statement Analysis | 11–14% |
| 5 | Corporate Issuers | 6–9% |
| 6 | Equity Investments | 11–14% |
| 7 | Fixed Income | 11–14% |
| 8 | Derivatives | 5–8% |
| 9 | Alternative Investments | 7–10% |
| 10 | Portfolio Management | 8–12% |

**Source rules:** the LOS *statements* are publicly published by CFA Institute (free to reference). The *curriculum text* is paid/copyrighted — we never reproduce it. All explanations are originals, authored fresh.

---

## 7. Phased Roadmap

Twelve phases. Roughly one session each, but flexible. Each phase produces something usable on its own.

### Phase 1 — Foundation (Session 1–2)
- Initialise repo, Vite, Tailwind, Firebase project, GitHub
- Google sign-in
- Empty curriculum data files (placeholder JSON for all 10 topics)
- Homepage listing all topics with weights
- Deploy to Firebase Hosting → live URL working

**Outcome:** Live, signed-in homepage showing all 10 topics.

### Phase 2 — Curriculum Skeleton (Session 3–4)
- Populate official LOS list across all 10 topics
- Topic page → modules, lessons, all LOS
- Lesson page → single LOS with command verb, description, subtopics
- "Mark as understood" checkbox per LOS, stored in Firestore

**Outcome:** Full Level 1 syllabus navigable. Empty content, full structure.

### Phase 3 — Lesson Content Viewer (Session 5)
- Markdown rendering with KaTeX for formulas
- Three-mode explanation tabs (New / Pro / Exam)
- Worked examples expand/collapse
- Mini-FAQ accordion
- Curated resources sidebar

**Outcome:** Lesson pages display rich content beautifully. Empty for now.

### Phase 4 — Content Authoring Sprint #1 (Session 6–8)
- Author full content for **Ethics** (15–20% weight — biggest payoff first)
- Author full content for **Quant Methods** (foundational for everything)
- 5–10 MCQs per LOS, committed to repo

**Outcome:** Two complete topics live, fully studyable.

### Phase 5 — Quiz Engine (Session 9)
- Quiz UI (single-question, multi-question, flag-for-review)
- Pull questions from `/content/questions/` JSON files
- Result tracking → Firestore (per-LOS correct/incorrect/time)
- Answer explanations after submit

**Outcome:** Take a quiz on any topic with explanations.

### Phase 6 — Spaced Repetition (Session 10)
- SM-2 (or FSRS, the modern Anki algorithm) implementation
- Daily review queue on homepage
- Schedule re-quizzes based on confidence + time elapsed
- Flashcard mode for definitions / formulas

**Outcome:** Daily review keeps things fresh. Tool tells you what to study today.

### Phase 7 — Progress Dashboard (Session 11)
- Heatmap: confidence per topic / module / LOS
- Streaks, daily study time, questions answered, accuracy
- Predicted readiness % (weighted by official topic weights)
- Weak areas surfaced with "study this next" links

**Outcome:** One-screen view of your readiness.

### Phase 8 — Content Authoring Sprint #2 (Session 12–14)
- Author **FRA**, **Equity**, **Fixed Income** (the big three after Ethics)

**Outcome:** Five of ten topics fully studyable.

### Phase 9 — Mock Exam (Session 15)
- 180-question, two-session format matching real exam
- Real CFA topic weights enforced
- Timer, navigation, flag-for-review
- Post-exam analytics

**Outcome:** Simulate the real exam. Stamina + readiness check.

### Phase 10 — PWA + Mobile (Session 16)
- Service worker, install prompt
- Offline mode for content already loaded
- Responsive design polish
- Touch-friendly quiz UI

**Outcome:** Phone-installable. Study on the train, offline.

### Phase 11 — Remaining Topics (Session 17–19)
- **Economics**, **Corporate Issuers**, **Derivatives**, **Alt Investments**, **Portfolio Management**

**Outcome:** All 10 topics complete.

### Phase 12 — Polish, Drills, Long Tail (Session 20+)
- Formula drill mode (dozens of formulas to memorise)
- Ethics scenario mode (heavy weight, distinct skill)
- Dark mode, keyboard shortcuts, sharing card
- Continuous content revisions based on usage

**Outcome:** Real-product feel. Tool keeps improving alongside your studies.

---

## 8. Feature Deep-Dives

### Knowledge Fountain (per-LOS lesson pages)
- **Three-mode explanation** — toggle:
  - *New* — friendly, analogy-rich, no jargon
  - *Pro* — concise, jargon-heavy, assumes finance fluency
  - *Exam* — exactly what CFA expects you to know, no fluff
- Worked examples with collapsible steps
- Key formulas (LaTeX, rendered via KaTeX)
- Common pitfalls / "watch out for..."
- Mini-FAQ (anticipated questions, pre-answered)
- Curated external resources
- Your own notes (per LOS, stored in Firestore)

### Quiz Modes
| Mode | Source | When |
|---|---|---|
| Lesson quiz | Question bank, filtered to one LOS | After studying a lesson |
| Topic quiz | Question bank, full topic | End of a topic |
| Spaced review | From bank, scheduled | Daily |
| Mock exam | Full bank, weighted | Monthly, then weekly closer to exam |
| Formula drill | Formula deck | Anytime (5-min sessions) |
| Ethics scenarios | Scenario deck | Anytime (Ethics-only) |

### Spaced Repetition
- After each quiz answer, the tool infers confidence (correctness + time + self-rating)
- Schedules next review: 1d → 3d → 1w → 2w → 1m → 3m
- Daily review queue on homepage drives consistent practice

### Mock Exam
- 180 Qs, two 2hr 15min sessions (matches real exam)
- Topic weights enforced: ~32 Ethics Qs, ~24 Equity, etc.
- No backward navigation between sessions (matches real exam)
- Post-exam: full breakdown by topic, time-per-question, "narrowly missed" highlights

---

## 9. Risks & Constraints

| Risk | Mitigation |
|---|---|
| **CFA Institute copyright** — curriculum text is paid; we can't redistribute it | Use only the publicly-published LOS list. All explanations original. Link to free external sources for further reading. |
| **Content authoring volume** — 400+ LOS × 5 pages = a lot | Spread over 18 months. Author as you study (no need to front-load). Ethics + Quant in Sprint #1 give you a solid base. |
| **You lose motivation 8 months in** | Tool designed for daily 10-min friction-free habit. Streaks, dashboard, daily review queue. |
| **CFA curriculum changes annually** | LOS data in JSON — easy to update. Pin to a specific exam-year version. |
| **No live AI Q&A** | Pre-written FAQ per LOS handles common follow-ups. For anything novel, you have Claude.ai separately on tap. |
| **Maintenance over 18 months** | Plan checkpoints every 3 months. Minimal dependencies. |

---

## 10. Next Steps

All foundational decisions are made. Plan is ready to execute.

1. **Phase 1** — scaffold the repo (Vite + React + Tailwind), Firebase project (Spark plan), Google sign-in, deployed homepage live on `hannapig-2838d`-style firebase domain. One session.
2. **Phase 2** — populate the LOS data and make the full syllabus navigable.
3. **Phase 3+** — per the roadmap in §7.

---

## 11. Things deliberately out of scope (for now)

- Audio / read-aloud
- Discord/Slack notifications
- Calendar integration
- Social features (study groups, comparison to others)
- Level 2 / Level 3 expansion
- Live AI Q&A (decided against — see §2)

All possible later. Not Phase 1–12 material.
