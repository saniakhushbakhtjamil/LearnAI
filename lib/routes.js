// Express router for "Learn AI together".
//
// Six endpoints: GET /curriculum, GET /state, POST /progress,
// POST /quiz, PUT /notes, DELETE /progress. No auth — home LAN.

const express = require('express');
const { getDb } = require('./db');

const router = express.Router();

const VALID_USERS = new Set(['s', 'b']);
const LESSON_RE = /^w\d{1,2}-[lqp]\d{1,2}$/;
const NOTE_MAX_BYTES = 10 * 1024;

function todayLocal() {
  // YYYY-MM-DD in server local time.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function dayBefore(yyyymmdd) {
  // Returns the YYYY-MM-DD string for the day before the given date,
  // interpreted as a local-time calendar date.
  const [y, m, d] = yyyymmdd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  const y2 = dt.getFullYear();
  const m2 = String(dt.getMonth() + 1).padStart(2, '0');
  const d2 = String(dt.getDate()).padStart(2, '0');
  return `${y2}-${m2}-${d2}`;
}

function validUser(u) {
  return typeof u === 'string' && VALID_USERS.has(u);
}
function validLesson(id) {
  return typeof id === 'string' && LESSON_RE.test(id);
}

// GET /api/curriculum
router.get('/curriculum', (_req, res) => {
  try {
    // Bust require cache so updates from the concurrent agent are picked up
    // without a restart in dev.
    delete require.cache[require.resolve('./curriculum')];
    const curriculum = require('./curriculum');
    res.json(curriculum);
  } catch (err) {
    res.status(500).json({ error: 'curriculum_unavailable', detail: err.message });
  }
});

// GET /api/state?user=s
router.get('/state', (req, res) => {
  const user = req.query.user;
  if (!validUser(user)) return res.status(400).json({ error: 'bad_user' });

  const db = getDb();
  const u = db.prepare(
    'SELECT id, display_name, accent FROM users WHERE id = ?'
  ).get(user);
  if (!u) return res.status(404).json({ error: 'user_not_found' });

  const completedRows = db.prepare(
    'SELECT lesson_id FROM progress WHERE user_id = ? ORDER BY completed_at ASC'
  ).all(user);
  const completed = completedRows.map(r => r.lesson_id);

  // First attempt per (user, lesson). Take the earliest by id.
  const quizRows = db.prepare(`
    SELECT q.lesson_id, q.selected, q.correct, q.attempted_at
    FROM quiz_attempts q
    JOIN (
      SELECT lesson_id, MIN(id) AS min_id
      FROM quiz_attempts
      WHERE user_id = ?
      GROUP BY lesson_id
    ) m ON m.min_id = q.id
    WHERE q.user_id = ?
  `).all(user, user);
  const quizzes = {};
  for (const r of quizRows) {
    quizzes[r.lesson_id] = {
      selected: r.selected,
      correct: !!r.correct,
      at: r.attempted_at,
    };
  }

  const noteRows = db.prepare(
    'SELECT lesson_id, concept_idx, body FROM notes WHERE user_id = ?'
  ).all(user);
  const notes = {};
  for (const r of noteRows) {
    if (!notes[r.lesson_id]) notes[r.lesson_id] = {};
    notes[r.lesson_id][r.concept_idx] = r.body;
  }

  const streakRow = db.prepare(
    'SELECT count, last_date FROM streaks WHERE user_id = ?'
  ).get(user) || { count: 0, last_date: '' };

  res.json({
    user: u,
    completed,
    quizzes,
    notes,
    streak: streakRow,
  });
});

// POST /api/progress  body: {user, lesson_id}
router.post('/progress', (req, res) => {
  const { user, lesson_id } = req.body || {};
  if (!validUser(user)) return res.status(400).json({ error: 'bad_user' });
  if (!validLesson(lesson_id)) return res.status(400).json({ error: 'bad_lesson_id' });

  const db = getDb();
  const today = todayLocal();
  const yesterday = dayBefore(today);

  const tx = db.transaction(() => {
    db.prepare(
      'INSERT OR IGNORE INTO progress (user_id, lesson_id) VALUES (?, ?)'
    ).run(user, lesson_id);

    const cur = db.prepare(
      'SELECT count, last_date FROM streaks WHERE user_id = ?'
    ).get(user) || { count: 0, last_date: '' };

    let newCount, newDate;
    if (cur.last_date === today) {
      newCount = cur.count;
      newDate  = cur.last_date;
    } else if (cur.last_date === yesterday) {
      newCount = cur.count + 1;
      newDate  = today;
    } else {
      newCount = 1;
      newDate  = today;
    }

    db.prepare(`
      INSERT INTO streaks (user_id, count, last_date)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET count = excluded.count, last_date = excluded.last_date
    `).run(user, newCount, newDate);

    return { count: newCount, last_date: newDate };
  });

  const streak = tx();
  res.json({ ok: true, streak });
});

// DELETE /api/progress  body: {user, lesson_id}
router.delete('/progress', (req, res) => {
  const { user, lesson_id } = req.body || {};
  if (!validUser(user)) return res.status(400).json({ error: 'bad_user' });
  if (!validLesson(lesson_id)) return res.status(400).json({ error: 'bad_lesson_id' });

  const db = getDb();
  const today = todayLocal();

  const tx = db.transaction(() => {
    const row = db.prepare(
      'SELECT completed_at FROM progress WHERE user_id = ? AND lesson_id = ?'
    ).get(user, lesson_id);

    db.prepare(
      'DELETE FROM progress WHERE user_id = ? AND lesson_id = ?'
    ).run(user, lesson_id);

    if (!row) {
      const cur = db.prepare(
        'SELECT count, last_date FROM streaks WHERE user_id = ?'
      ).get(user) || { count: 0, last_date: '' };
      return cur;
    }

    // Recompute streak only if removal affects today.
    const cur = db.prepare(
      'SELECT count, last_date FROM streaks WHERE user_id = ?'
    ).get(user) || { count: 0, last_date: '' };

    if (cur.last_date !== today) return cur;

    // Is there any remaining completion today?
    const stillToday = db.prepare(`
      SELECT 1 FROM progress
      WHERE user_id = ? AND date(completed_at, 'unixepoch', 'localtime') = ?
      LIMIT 1
    `).get(user, today);

    if (stillToday) return cur;

    // Today is no longer credited. Roll the streak back by one day.
    const newCount = Math.max(0, cur.count - 1);
    const newDate  = newCount === 0 ? '' : (function () {
      // Best-effort: set last_date to yesterday so the chain remains valid
      // if the user completes something tomorrow.
      const [y, m, d] = today.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() - 1);
      const y2 = dt.getFullYear();
      const m2 = String(dt.getMonth() + 1).padStart(2, '0');
      const d2 = String(dt.getDate()).padStart(2, '0');
      return `${y2}-${m2}-${d2}`;
    })();

    db.prepare(`
      UPDATE streaks SET count = ?, last_date = ? WHERE user_id = ?
    `).run(newCount, newDate, user);

    return { count: newCount, last_date: newDate };
  });

  tx();
  res.json({ ok: true });
});

// POST /api/quiz  body: {user, lesson_id, selected, correct}
// Only first attempt per (user, lesson) is stored.
router.post('/quiz', (req, res) => {
  const { user, lesson_id, selected, correct } = req.body || {};
  if (!validUser(user)) return res.status(400).json({ error: 'bad_user' });
  if (!validLesson(lesson_id)) return res.status(400).json({ error: 'bad_lesson_id' });
  if (!Number.isInteger(selected) || selected < 0 || selected > 3) {
    return res.status(400).json({ error: 'bad_selected' });
  }
  const correctInt = correct ? 1 : 0;

  const db = getDb();
  const existing = db.prepare(
    'SELECT 1 FROM quiz_attempts WHERE user_id = ? AND lesson_id = ? LIMIT 1'
  ).get(user, lesson_id);
  if (!existing) {
    db.prepare(
      'INSERT INTO quiz_attempts (user_id, lesson_id, selected, correct) VALUES (?, ?, ?, ?)'
    ).run(user, lesson_id, selected, correctInt);
  }
  res.json({ ok: true });
});

// PUT /api/notes  body: {user, lesson_id, concept_idx, body}
router.put('/notes', (req, res) => {
  const { user, lesson_id, concept_idx, body } = req.body || {};
  if (!validUser(user)) return res.status(400).json({ error: 'bad_user' });
  if (!validLesson(lesson_id)) return res.status(400).json({ error: 'bad_lesson_id' });
  if (!Number.isInteger(concept_idx) || concept_idx < -1) {
    return res.status(400).json({ error: 'bad_concept_idx' });
  }
  if (typeof body !== 'string') {
    return res.status(400).json({ error: 'bad_body' });
  }
  if (Buffer.byteLength(body, 'utf8') > NOTE_MAX_BYTES) {
    return res.status(413).json({ error: 'note_too_large' });
  }

  const db = getDb();
  db.prepare(`
    INSERT INTO notes (user_id, lesson_id, concept_idx, body, updated_at)
    VALUES (?, ?, ?, ?, unixepoch())
    ON CONFLICT(user_id, lesson_id, concept_idx) DO UPDATE SET
      body = excluded.body,
      updated_at = excluded.updated_at
  `).run(user, lesson_id, concept_idx, body);

  res.json({ ok: true });
});

module.exports = router;
