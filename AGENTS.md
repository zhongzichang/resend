# Agent Notes

## Project type
Single Cloudflare Worker that exposes one POST endpoint to send email via the Resend SDK.

## Entrypoint
- `worker.js` — the only application file.
- `wrangler.json` configures `main: "worker.js"`, `name: "resend"`, compatibility date `2026-05-27`.

## Dependencies / tooling
- Runtime packages: `resend`.
- Dev tooling: `wrangler` only.
- **No tests, no lint script, no typecheck script, no formatter config, and no lockfile.** Do not assume a standard toolchain exists.

## Local dev
```bash
npm install
npx wrangler dev
```

## Deploy
```bash
npx wrangler deploy
```

## Secrets / env
The worker reads these from the Cloudflare Worker environment at runtime (not from a local `.env` in production):
- `RESEND_API_KEY` — Resend API key.
- `AUTH_TOKEN` — Static bearer token clients must send as `Authorization: Bearer <token>`.

Set them in production with:
```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put AUTH_TOKEN
```

## API behavior
- Only `POST` is allowed; preflight `OPTIONS` returns CORS headers.
- Required JSON body fields: `to`, `subject`, and either `html` or `text`.
- `to` may be a string or an array.
- When only `text` is provided, it is sent as `html` (the worker does not set a separate text part).
- `from` is read from the request body, just like `to`; the sending domain must be verified in the Resend dashboard.
- CORS allows `*` origins.

## Gotchas
- There is no `package.json` `scripts` section; use `npx wrangler` directly.
- Sending will fail at runtime if the `from` domain is not verified in Resend, even with a valid API key.
- Local `.env` files are ignored by `.gitignore`; use `wrangler secret` or `.dev.vars` for local secrets if needed.
