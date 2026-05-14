const express = require('express');
const path    = require('path');

const MOCK = process.env.MOCK === 'true';
const PORT = process.env.PORT || 3000;

const app = express();

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

app.listen(PORT, () => {
  console.log(
    `Learn AI together running on http://localhost:${PORT} [${MOCK ? 'MOCK' : 'LIVE'}]`
  );
});
