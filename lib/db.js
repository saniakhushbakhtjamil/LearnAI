// SQLite persistence for "Learn AI together".
//
// Single-file SQLite per Almari convention. Path resolution:
//   - process.env.DB_PATH wins if set
//   - else MOCK=true -> ./data/dev.sqlite (gitignored)
//   - else /data/learn.sqlite (Docker volume mount point)
//
// Exports getDb(): singleton better-sqlite3 connection. First call runs
// migrations and seeds the two users.

const path = require('path');
const fs   = require('fs');
const Database = require('better-sqlite3');

let _db = null;

function resolveDbPath() {
  if (process.env.DB_PATH) return process.env.DB_PATH;
  if (process.env.MOCK === 'true') {
    return path.join(__dirname, '..', 'data', 'dev.sqlite');
  }
  return '/data/learn.sqlite';
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      accent TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed_at INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      selected INTEGER NOT NULL,
      correct INTEGER NOT NULL,
      attempted_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_quiz_user_lesson
      ON quiz_attempts(user_id, lesson_id);

    CREATE TABLE IF NOT EXISTS notes (
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      concept_idx INTEGER NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
      PRIMARY KEY (user_id, lesson_id, concept_idx)
    );

    CREATE TABLE IF NOT EXISTS streaks (
      user_id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      last_date TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

function seed(db) {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO users (id, display_name, accent) VALUES (?, ?, ?)'
  );
  insert.run('s', 'Sania', 'purple');
  insert.run('b', 'Björn', 'teal');

  const seedStreak = db.prepare(
    'INSERT OR IGNORE INTO streaks (user_id, count, last_date) VALUES (?, 0, \'\')'
  );
  seedStreak.run('s');
  seedStreak.run('b');
}

function getDb() {
  if (_db) return _db;
  const dbPath = resolveDbPath();
  ensureDir(dbPath);
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  seed(db);
  _db = db;
  return _db;
}

module.exports = { getDb, resolveDbPath };
