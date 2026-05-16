# AGENTS.md

- Before planning or editing, read `SPEC.md`.
- `SPEC.md` is canonical for product direction.
- `STATUS.md` tracks current backlog.
- Do not contradict `SPEC.md` unless the task explicitly changes product direction.
- Update `SPEC.md` when product direction changes.
- Update `STATUS.md` when backlog changes.
- Use hard cutover: do not keep old flows, names, or dead code around.
- Make surgical diffs. Every changed line must trace to the request.
- Prefer deleting code over adding code when that fully solves the problem.
- State verifiable success criteria before writing code.
- Prefer tests, scripts, benchmarks, screenshots, or type checks over reasoning from the diff.
- Run relevant verification before saying the task is done.
- Run lint, typecheck, tests, and build before commits when practical.
- Always run build/test/fix loops before commits.
- If verification fails, fix the root cause, not the test.
- For UI changes, verify visually with before/after screenshots when practical.
- Read full errors, logs, and stack traces before changing code.
- Prefer running the code over guessing about it.
- Use subagents for broad exploration that would otherwise flood context.
- Prefer `gh`, `rg`, `fd`, `jq`, `git`, `curl`, and project CLIs over MCPs when possible.
- After two failed corrections on the same issue, stop and summarize what was learned before continuing.
- Keep commits focused and descriptive. Subject under 72 characters; explain why in the body when useful.
- Do not add `Co-Authored-By` unless explicitly requested.
- Never commit `.env`, private keys, tokens, mnemonics, generated wallets, local DBs, keystores, or logs containing secrets.
- Never expose server secrets through `NEXT_PUBLIC_*` variables or browser code.
- Hosted write APIs must stay server-only, admin-token protected, allowlisted, idempotent where possible, and testnet-only.
- Do not commit private info such as author names, local paths, machine names, or personal identifiers.

## Project Learnings

Keep this section short. Add concrete rules only when a mistake shows they are needed. Prune rules that no longer prevent real mistakes.

- Public repo rule: never write prompts, Codex history, local paths, private workflow notes, generated media, or model caches into tracked files.
- Keep `.gitignore`, ESLint ignores, privacy scans, and Vercel excludes aligned whenever new generated/tooling paths appear.
- For globe/map UI, use real public geographic data or map tiles with provenance; do not hand-draw approximate landforms.
- For Codex-authored pushes, verify the commit is signed with the configured p0s key and confirm the hosted health/search pages after deploy.
