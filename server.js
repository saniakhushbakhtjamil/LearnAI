const express = require('express');
const path    = require('path');

const { getDb }    = require('./lib/db');
const apiRoutes    = require('./lib/routes');

const MOCK = process.env.MOCK === 'true';
const PORT = process.env.PORT || 3000;

const app = express();

// Run DB migrations + user seed at startup so the first request is fast and
// any schema error surfaces in the boot log.
getDb();

app.use(express.json({ limit: '64kb' }));

// Static app assets
app.use(express.static(path.join(__dirname, 'public')));

// Dev: serve kit from the Almari submodule so edits to design/kit/ are live
// without a Docker rebuild. In prod (Docker), the kit is also copied into
// public/kit/ at build time, so the static mount above wins.
app.use(
  '/kit',
  express.static(path.join(__dirname, 'vendor', 'almari-kit', 'design', 'kit'))
);

// Health endpoint — keeps the MOCK plumbing visible for future phases.
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mock: MOCK });
});

// API: curriculum, state, progress, quiz, notes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(
    `Learn AI together running on http://localhost:${PORT} [${MOCK ? 'MOCK' : 'LIVE'}]`
  );
});
