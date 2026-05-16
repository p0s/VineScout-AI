# Security

VineScout AI is a demo-first diligence app. Treat all production credentials as server-only secrets.

## Reporting

Report security issues privately through the repository owner’s preferred private channel. Do not file public issues that include tokens, logs, screenshots, or environment values.

## Secret Handling

- Never commit `.env` files, service-role keys, API keys, private keys, local databases, browser traces, or generated media.
- Keep `ORBITAI_API_KEY`, `OPENAI_API_KEY`, Supabase service-role keys, and admin tokens server-only.
- Never expose secrets through `NEXT_PUBLIC_*`.
- Run `npm run privacy:scan` before pushing history rewrites or release candidates.
