# Searics

Search song lyrics. Live at [searics.aliataf.com](https://searics.aliataf.com).

Vite + React 18 + TypeScript SPA. Uses public APIs (no backend):
- [api.lyrics.ovh](https://api.lyrics.ovh) — search suggestions
- [lrclib.net](https://lrclib.net) — lyrics

## Develop

```sh
npm install
npm run dev          # http://localhost:3000
npm test             # vitest
npm run build        # outputs dist/
```

Requires Node 22 (see `.nvmrc`).

## Deploy

Auto-deploys to Vercel on push to `main`. Custom domain `searics.aliataf.com` is configured in the Vercel project settings; SPA rewrites live in [vercel.json](vercel.json).

No environment variables required — the two API URLs are inlined as constants in [src/services/api.ts](src/services/api.ts).
