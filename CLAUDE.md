# Learn AI together — Agent Reference

12-week shared AI learning app for Sania and Björn. Targets AI engineering
and AI PM roles in Eindhoven (ASML, Philips, Brainport ecosystem).

Deploys to `learnai.almari` on the Almari home server.

## Agent identity

This repo is Sania's. Agent: **Dhamo** 🧸. Every commit trailer: `[agent:dhamo]`.

## Stack

- Express backend (`server.js` + `lib/`)
- React via CDN + Babel-in-browser — no build step
- Almari design kit via git submodule (`vendor/almari-kit/`) — kit is the single source of truth for all UI
- SQLite via better-sqlite3 — one DB file, persisted in a Docker volume (`/data/learn.sqlite`)
- MOCK mode: `MOCK=true` → `data/dev.sqlite`; production → `/data/learn.sqlite`

**Kit discipline:** all UI must use kit primitives. Read `vendor/almari-kit/CLAUDE.md`
("Kit discipline", "Frontend app build convention", "Local dev server") before touching any frontend file.

## Repo layout

```
server.js          Express entry — static public/, /kit mount, /api routes
lib/
  db.js            SQLite singleton — migrations + seed users on first call
  routes.js        All 6 API routes
  curriculum.js    12-week content — edit this to update lessons
public/
  index.html       Script tags: React CDN, kit files, all public/*.js modules
  app.js           Root App — user picker, tabs, all API calls
  today.js         Today tab
  weeks.js         Weeks tab — phase-grouped list, inline expand
  lesson.js        Lesson detail — Learn/Quiz/Build tabs, mark-complete
  progress.js      Progress tab — stats + 12×3 completion grid
  you.js           You tab — user switcher, palette picker
  style.css        Minimal reset + AppShell overrides + animations
vendor/
  almari-kit/      Git submodule → saniakhushbakhtjamil/Almari (design/kit/)
```

## Two users

| ID | Name | Accent |
|---|---|---|
| `s` | Sania | purple `oklch(0.7 0.18 305)` |
| `b` | Björn | teal `oklch(0.72 0.115 200)` |

No auth — home LAN only. User picked once on first load, stored in `localStorage.learnUser`.

## API routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/curriculum` | Full 12-week curriculum |
| GET | `/api/state?user=s\|b` | User state: streak, completed, quizzes, notes |
| POST | `/api/progress` | Mark lesson complete |
| DELETE | `/api/progress` | Undo completion |
| POST | `/api/quiz` | Record quiz attempt (first attempt only) |
| PUT | `/api/notes` | Save a per-concept note (debounced from client) |

`user` must be `s` or `b`. `lesson_id` matches `^w\d{1,2}-[lqp]\d{1,2}$`.

## Curriculum schema (`lib/curriculum.js`)

Each week has exactly 3 lessons: one `type: 'lesson'`, one `type: 'quiz'`, one `type: 'project'`.
IDs: `w{N}-l1`, `w{N}-q1`, `w{N}-p1`. 12 weeks × 3 = 36 total.

```js
{
  id: 'w2-l1',
  title: '...',
  sub: '...',           // one-line description
  type: 'lesson',       // lesson | quiz | project
  duration: '22 min',
  learn: [{ concept: '...', body: '...' }],   // 2-4 blocks; Week 1 uses 'title' instead of 'concept'
  quiz: { q: '...', opts: ['A','B','C','D'], correct: 0, explanation: '...' },
  project: [{ step: '...', body: '...' }],    // 3-5 steps; Week 1 uses plain strings
  ownProject: '...',    // open-ended challenge
}
```

Week 1 uses the original schema (`title` in learn, strings in project) — renderer handles both formats.

## Local dev

```bash
git clone --recurse-submodules <repo>
cd "Learn AI with me"
npm install
npm run dev           # http://localhost:3000  (MOCK=true, data/dev.sqlite)
```

Kit files are static-mounted at `/kit` by the dev server — browser refresh is enough after kit edits.

## Deploy

Auto-deploy is active: push to `main` → server polls every 5 min → rebuilds if new commit detected.
Logs: `ssh agent@192.168.50.11 -p 2222 "tail -30 /home/agent/logs/learnai-deploy.log"`

Manual rebuild if needed:
```bash
ssh agent@192.168.50.11 -p 2222 "cd /opt/almari/external/learnai && git pull && docker compose up -d --build"
```

## Layout fix (important)

`Surface` must use `height: 100dvh, overflow: hidden` (not `minHeight`) so AppShell's flex column
fills the exact viewport — this is what keeps BottomBar pinned to the bottom. `style.css` adds
`.ak-reset { height: 100% }` and `.ak-reset main { overflow-y: auto }` to complete the fix.
Do not change these back to `minHeight`.

## Almari server reference

Full server docs: `vendor/almari-kit/CLAUDE.md` or `ssh agent@192.168.50.11 -p 2222 "cat /opt/almari/repo/CLAUDE.md"`.

Server: `192.168.50.11`, port 2222. Agent user owns `/opt/almari/external/learnai/`.
Use `bjorn@` for any commands needing sudo.
