# Legacy data migration

Migrates JSON exports from `legacy-db/` into Payload collections.

## Layout

```
scripts/migration/
  lib/              # shared: CLI, paths, media upload, slug registry, rollback log
  events/           # whats-on (events) — see events/migrate.ts
  shops/            # vendors (planned)
  blogs/            # blogs — see blogs/migrate.ts
  zones/            # zones (planned)
scripts/db-repair/  # local D1 repair SQL + repair-local.sh
```

Entry points at the migration root (`migrate-events.ts`, `rollback-events.ts`) are thin shims for `package.json` scripts.

## Events (whats-on)

See [events workflow](#events-whats-on) below. Commands:

```bash
pnpm migrate:events [--write] [--indexes N,...] [--assets-dir PATH]
pnpm migrate:events:rollback [--write] [--indexes N,...]

# Production (remote D1 + R2 via wrangler)
pnpm migrate:events:prod [--write] [--indexes N,...] [--assets-dir PATH]
pnpm migrate:events:rollback:prod [--write] [--indexes N,...]
```

---

## Blogs

Migrates `legacy-db/the-commons-cloud.blogs.json` into Payload `blogs`.

**Default is dry-run.** Pass `--write` to upload media and create records in D1/R2.

Only blogs whose `publishedDate` (from legacy `date`) falls within the last 5 years are imported.

```bash
# Dry-run first 2 blogs
pnpm migrate:blogs --indexes 0,1 --assets-dir ./legacy-db/assets

# Import locally
pnpm migrate:blogs --write --indexes 0,1 --assets-dir ./legacy-db/assets

# Production
pnpm migrate:blogs:prod --write --indexes 0 --assets-dir ./legacy-db/assets
```

### Field mapping

| Legacy | Payload |
|--------|---------|
| `title` | `title` |
| `slug` | `slug` (shared when same title+content across branches; `{slug}-{branch}` when same title, different content) |
| `branch` | `branch` (relationship, if present) |
| `date` | `publishedDate` |
| `images[0]` | `media` |
| `images[]` | `gallery` (first item reuses `media` without re-upload; max 5) |
| `content` | `content` (HTML → Lexical) |

`branchLocations`, `dateToBeArchived`, `buttonText`, and `buttonLink` are left empty.

Images are converted to WebP before upload (same pipeline as events).

**Duplicate titles:**

- Same title + same content + different branch → one blog, branches merged
- Same title + different content → slug becomes `{legacy-slug}-{branch}` (e.g. `april-live-music-saladaeng`)

### Rollback

Default is dry-run; pass `--write` to delete records.

```bash
# Preview rollback locally
pnpm migrate:blogs:rollback

# Roll back specific indexes locally
pnpm migrate:blogs:rollback --write --indexes 182,183

# Production rollback
pnpm migrate:blogs:rollback:prod --write --indexes 182,183
```

Uses `scripts/migration/blogs/reports/rollback-log.json` (written on each successful import). If missing, falls back to the last `blogs-import-preview.json` from a `--write` run.

For each entry:

- **created** — deletes the `blogs` record, removes orphaned media, cleans manifest fingerprints
- **branch_merged** — removes the merged branch from the existing record (does not delete the record)

Prod uses `media-manifest.prod.json` (local uses `media-manifest.json`).

---

Migrates `legacy-db/the-commons-cloud.events.json` into Payload `whats-on`.

**Default is dry-run.** Pass `--write` to upload media and create records in D1/R2.

Each legacy index is processed independently: analyze → prepare media → upload → import → clean cache. If one index fails, fix the issue and resume from that index.

## Rules

- **Date window:** only events whose end date is within the last 5 years (>= cutoff)
- **Media:** card image (`imagePath` → `coverImagePath` → `images[0]`) → `media`
- **Gallery:** first 5 entries from `images[]` (skips paths already used as media, including different S3 URLs that resolve to the same image; single-image events with `imagePath` reuse the card media without a second upload)
- **Images:** downloaded → converted to WebP locally → uploaded to R2 with `alt = event title`
- **Bg Color:** dominant color extracted from card media → `bgColor` on whats-on
- **Tags:** legacy flat categories mapped to CMS main/sub tags (see `events/config/legacy-tag-map.ts`)
- **Date to be Archived:** set to the event's last day (parsed end date from `when`)

## Prerequisites

1. **Local:** D1 running (via `pnpm dev` or existing `.wrangler/state`)
2. **Production:** `wrangler login`, `PAYLOAD_SECRET` in `.env.local` / `.env`, prod branches + tags already in D1
3. `.env.local` (or `.env`) with `PAYLOAD_SECRET`
4. Image source — either:
   - `--assets-dir ./legacy-db/assets` (mirror S3 paths locally), or
   - network access to legacy S3 (may require credentials; bucket is often private)

## Usage

```bash
# Dry-run last 2 events
pnpm migrate:events --indexes -2,-1 --assets-dir ./legacy-db/assets

# Import last 2 events locally
pnpm migrate:events --write --indexes -2,-1 --assets-dir ./legacy-db/assets

# Import a single event (resume after failure)
pnpm migrate:events --write --indexes 1236 --assets-dir ./legacy-db/assets
```

## Production migration

Uses remote D1 + R2 bindings (`NODE_ENV=production`, no local D1). **Always dry-run first.**

```bash
# Preview one event against prod (no writes)
pnpm migrate:events:prod --indexes -1 --assets-dir ./legacy-db/assets

# Import to prod — start small, then batch
pnpm migrate:events:prod --write --indexes 1236 --assets-dir ./legacy-db/assets

# Roll back a prod import
pnpm migrate:events:rollback:prod --write --indexes 1236
```

Prod writes upload media to the production R2 bucket and create `whats-on` records in remote D1. Prod uses a **separate** manifest at `scripts/migration/events/reports/media-manifest.prod.json` (not the local one).

### Images not showing after prod migration?

You do **not** need a public R2 bucket. Payload serves files from R2 via `/api/media/file/...` on your site.

If images are missing, the usual cause is reusing **local** `mediaId`s from `media-manifest.json` against prod D1 (IDs exist but point at the wrong files). Prod migration now uses `media-manifest.prod.json` and re-uploads when filenames do not match.

**Fix affected events:**

```bash
# 1. Roll back bad prod imports (or delete in admin)
pnpm migrate:events:rollback:prod --write --indexes 1236

# 2. Re-import with assets available
pnpm migrate:events:prod --write --indexes 1236 --assets-dir ./legacy-db/assets
```

**Verify in admin:** open the event → media field → preview should load. URL should look like `/api/media/file/your-slug.webp`.

**Verify in R2 (optional):** Cloudflare dashboard → R2 → `the-common` bucket → objects named like `your-event-slug.webp` should exist after upload.

## CLI flags

| Flag                | Description                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `--write`           | Upload media and write to D1/R2 (default: dry-run)                                                 |
| `--indexes LIST`    | Comma-separated positions in the legacy JSON (0-based). Supports negatives, e.g. `-1` = last event |
| `--limit N`         | Process only the first N eligible events (after index selection)                                   |
| `--assets-dir PATH` | Local folder mirroring legacy S3 paths                                                             |
| `--keep-cache`      | Keep WebP files in `scripts/migration/events/cache/media/` after each index (default: clean up)    |
| `--remote`          | Set automatically by `migrate:events:prod` — use remote D1/R2                                      |

## Per-index workflow

For each index the command:

1. Checks eligibility and prints event details
2. Converts images to WebP and extracts `bgColor`
3. Uploads unique media to R2 (`--write` only)
4. Creates the `whats-on` record (`--write` only)
5. Removes that index's WebP cache files (unless `--keep-cache`)

On failure, the pipeline stops immediately. Check `scripts/migration/events/reports/migration-progress.json` for the failed index and a suggested resume command.

## Rollback

Undo a previous `--write` migration. Default is dry-run; pass `--write` to delete records.

```bash
# Preview rollback of last migration
pnpm migrate:events:rollback

# Roll back specific legacy indexes
pnpm migrate:events:rollback --write --indexes 1232,1233
```

Rollback uses `scripts/migration/events/reports/rollback-log.json` (written on each successful import). If that file is missing, it falls back to the last `events-import-preview.json` from a `--write` run.

For each entry:

- **created** — deletes the `whats-on` record, removes orphaned media, cleans manifest fingerprints
- **branch_merged** — removes the merged branch from the existing record (does not delete the record)

Entries are processed in reverse migration order (newest first).

After rollback, re-running migration automatically clears stale media IDs from `media-manifest.json` before import. Stale references are also purged from the manifest when deleted media IDs are detected during upload.

## Reports (gitignored)

- `scripts/migration/events/reports/events-analysis.json` — batch summary
- `scripts/migration/events/reports/events-mapped.json` — mapped payload preview
- `scripts/migration/events/reports/media-manifest.json` — media IDs, colors, content hashes
- `scripts/migration/events/reports/migration-progress.json` — completed/failed indexes
- `scripts/migration/events/reports/rollback-log.json` — rollback targets (append-only)
- `scripts/migration/events/cache/media/` — temporary WebP cache (cleaned per index)
