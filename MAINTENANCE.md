# Maintenance verification

The site now uses Astro 7.3.5 and Bun 1.4.2, with current compatible sitemap,
font, image and HTML-parser packages. Runtime images use verified exact Bun and
nginx versions and multi-platform digests. TypeScript stays on 6.0.3 because
the current Astro Check package supports TypeScript 5/6, not 7.

Content collections use explicit loaders in `src/content.config.ts`, coerced
dates and the current `render(entry)` API. `scripts/fixtures/routes-v5.json`
records all 104 pre-upgrade routes; `bun run verify:build` requires the same
route set and all 103 Markdown twins with matching token counts. No article,
photo, caption, language or URL was rewritten for this migration.

Useful checks:

- `bun install --frozen-lockfile --ignore-scripts`
- `(cd scripts/archive-fetcher && bun install --frozen-lockfile --ignore-scripts)`
- `bun --no-install run check`
- `bun --no-install test scripts`
- `bun --no-install run build && bun --no-install run verify:build`

The new offline regressions cover decoded Markdown text, duplicate nested list
items, navigation/script removal, archive path traversal and YAML quoting.
Archive validation runs before fetching a page or writing files. The archive
command itself is not run during verification. Historical OpenAI generator
files under `backup/` are excluded from current-app typechecking and remain
untouched.

Read-only pull-request CI repeats those checks on the complete asset checkout,
builds the production image, tests HTML/Markdown content negotiation and runs
sandboxed browser journeys. Browser checks block third-party requests and cover
RU/EN navigation, light/dark mobile/desktop views, repeated gallery dismissal,
focus restoration and denied browser storage. Astro telemetry is disabled for
verification. There is no merge or deployment job in the new workflow.

Local verification: 17 unit tests, zero type errors/warnings (19 existing
deprecation/unused-symbol hints remain), all 104 routes and 103 Markdown twins.
The authorized 2026-10-03 audit found and then cleared patched mdast-util-to-hast
and picomatch advisories through compatible transitive updates. The final root
audit reports only the unpatched cache-policy advisory below; the separate
archive-fetcher audit reports no findings. This is not a zero-vulnerability claim
for the full site toolchain.
Astro still declares the unpatched build-time `http-cache-semantics` advisory
[GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp).
The deployed image serves static files with nginx and does not ship Node/Bun
dependencies. Browser and container outcomes are recorded in the PR's CI.

Migration references: [Astro 6](https://docs.astro.build/en/guides/upgrade-to/v6/),
[Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/).
