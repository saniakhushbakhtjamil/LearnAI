# Learn AI together

A 12-week shared AI learning app for Sania and Björn. Deploys to
`learnai.almari` on the Almari home server.

Express + React via CDN + the Almari design kit. SQLite for shared
progress across both users on different devices.

## Local dev

```bash
git clone --recurse-submodules <repo>
cd "Learn AI with me"
npm install
npm run dev                     # http://localhost:3000  (MOCK=true)
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

The dev server static-mounts `vendor/almari-kit/design/kit/` at `/kit`, so
editing kit files in the submodule shows up on browser refresh — no Docker
rebuild needed during iteration.

## Health check

```bash
curl -s http://localhost:3000/api/health
# {"ok":true,"mock":true}
```

## Deploy

Builds a single container; reverse-proxied by Traefik on Almari at
`https://learnai.almari` (joins the `traefik-public` external network).

```bash
docker compose up -d --build
```

## Conventions

This app follows the Almari conventions — kit-only UI primitives, no build
step, MOCK plumbing, Express backend. See `vendor/almari-kit/CLAUDE.md`
("Building a new Almari app", "Frontend app build convention", "Local dev
server", "Kit discipline") for the full set of rules this scaffold honours.
