# Local D1: Drizzle push / “index already exists”

Use this when dev Payload fails on startup or admin with errors like:

```text
Failed query: CREATE INDEX `…_idx` ON `…` (…);
D1_ERROR: index …_idx already exists: SQLITE_ERROR
```

## Cause

In **local dev**, Payload runs **drizzle-kit push** on init (`pushDevSchema`). A schema change (new upload field, relationship, etc.) can leave the DB **half-applied**:

- columns and/or indexes exist
- foreign keys (or other steps) were never finished

Push then retries `CREATE INDEX` on every request → **index already exists**.

## Diagnose

Replace `TABLE` with the table from the error (e.g. `contact`).

```bash
pnpm exec wrangler d1 execute D1 --local --command "PRAGMA table_info('TABLE');"
pnpm exec wrangler d1 execute D1 --local --command "PRAGMA index_list('TABLE');"
pnpm exec wrangler d1 execute D1 --local --command "PRAGMA foreign_key_list('TABLE');"
```

**Drift signal:** new `*_id` columns and matching `*_idx` indexes exist, but `foreign_key_list` has no FK from those columns to `media` (or the expected related table). Compare with a similar table that works (e.g. `about` for upload backgrounds).

## Fix (local only)

1. From the error, note **table**, **index name(s)**, and **column name(s)** (often `snake_case` of the field + `_id`).
2. Drop the orphaned indexes and columns so push can rerun cleanly:

```bash
pnpm exec wrangler d1 execute D1 --local --command "
DROP INDEX IF EXISTS TABLE_COLUMN_idx;
DROP INDEX IF EXISTS TABLE_OTHER_COLUMN_idx;
ALTER TABLE TABLE DROP COLUMN column_id;
ALTER TABLE TABLE DROP COLUMN other_column_id;
"
```

3. **Restart** `pnpm run dev` and wait for push to finish without errors.
4. Re-run `PRAGMA foreign_key_list('TABLE')` and confirm FKs are present.

### Example: `contact` + `contactBg` / `contactBgMobile`

```bash
pnpm exec wrangler d1 execute D1 --local --command "
DROP INDEX IF EXISTS contact_contact_bg_idx;
DROP INDEX IF EXISTS contact_contact_bg_mobile_idx;
ALTER TABLE contact DROP COLUMN contact_bg_id;
ALTER TABLE contact DROP COLUMN contact_bg_mobile_id;
"
```

Then restart dev and let push recreate the columns with FKs. If admin still errors with `table contact has no column named contact_bg_id`, run:

```bash
pnpm exec wrangler d1 execute D1 --local --file scripts/d1-repair-contact-bg.sql
```

No dev restart needed for that script — retry saving in admin.

### Example: `DROP TABLE branches` + `vendors.branch_id` NOT NULL

Half-finished table rebuild (often shows `__new_branches` in sqlite_master):

```text
Failed query: DROP TABLE `branches`;
NOT NULL constraint failed: vendors.branch_id: SQLITE_CONSTRAINT
```

**Drift signal:** `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '__new_%';` returns `__new_branches`.

**Fix (local only):** stop dev, then run the repair helper (uses `sqlite3` + `PRAGMA foreign_keys=OFF`; safe when `__new_*` is missing):

```bash
pnpm run db:repair-local
```

It will:

- finish `__new_branches` → `branches` only when that orphan table exists
- finish `__new_vendors` → `vendors` only when that orphan table exists
- otherwise drop a stuck `vendors_media_idx` so push can recreate it

Do **not** run `scripts/d1-repair-branches-push.sql` via wrangler when `__new_branches` is already gone — that runs `DROP TABLE branches` and fails with `vendors.branch_id` NOT NULL.

### Example: removing `about.title` / `about.description` / about background uploads

Push may warn about deleting `about_title`, `about_description`, `about_background_media_id`, `about_mobile_background_media_id`, then fail on `DROP TABLE branches` (same `vendors.branch_id` error).

**Drift signal:** `__new_branches` exists; `branches` still has the old `about_*` columns; `branches_about_word_groups` may already exist.

**Fix (local only):** stop dev, then:

```bash
pnpm run db:repair-local
pnpm run dev
```

That finishes the interrupted rebuild (`__new_branches` → `branches` with `PRAGMA foreign_keys=OFF`). Your branch rows and other tables are kept; only the dropped about columns are removed from `branches`.

### Example: `payload_locked_documents_rels` + `…_order_idx already exists`

```text
CREATE INDEX `payload_locked_documents_rels_order_idx` …
index payload_locked_documents_rels_order_idx already exists
```

```bash
pnpm run db:repair-local
pnpm run dev
```

### Example: `whats_on_rels` + `whats_on_rels_order_idx already exists`

```text
CREATE INDEX `whats_on_rels_order_idx` ON `whats_on_rels` (`order`);
index whats_on_rels_order_idx already exists
```

```bash
pnpm run db:repair-local
pnpm run dev
```

### Example: `branches_rels` + `branches_rels_order_idx already exists`

```text
CREATE INDEX `branches_rels_order_idx` ON `branches_rels` (`order`);
index branches_rels_order_idx already exists
```

```bash
pnpm run db:repair-local
pnpm run dev
```

### Example: `branch_whats_on_pages` + `branch_whats_on_pages_branch_idx already exists`

Often after changing `allEventsAndWorkshops.mainTag` to `hasMany` (column → `branch_whats_on_pages_rels`):

```text
CREATE UNIQUE INDEX `branch_whats_on_pages_branch_idx` ON `branch_whats_on_pages` (`branch_id`);
index branch_whats_on_pages_branch_idx already exists
```

**Drift signal:** `all_events_and_workshops_main_tag_id` is gone, `branch_whats_on_pages_rels` exists, but push still errors on `branch_whats_on_pages_branch_idx`.

```bash
pnpm run db:repair-local
pnpm run dev
```

Or manually:

```bash
pnpm exec wrangler d1 execute D1 --local --command "DROP INDEX IF EXISTS branch_whats_on_pages_branch_idx;"
```

Then restart dev.

### Example: `branch_contact_pages` + `branch_contact_pages_branch_idx already exists`

Often after adding contact fields (background uploads, accordion blocks, etc.):

```text
CREATE UNIQUE INDEX `branch_contact_pages_branch_idx` ON `branch_contact_pages` (`branch_id`);
index branch_contact_pages_branch_idx already exists
```

```bash
pnpm run db:repair-local
pnpm run dev
```

Or manually:

```bash
pnpm exec wrangler d1 execute D1 --local --command "DROP INDEX IF EXISTS branch_contact_pages_branch_idx;"
```

Then restart dev.

### Example: `homepage_about_sticky_notes` + `homepage_about_sticky_notes_order_idx already exists`

Often after adding `media` upload to homepage sticky notes:

```text
CREATE INDEX `homepage_about_sticky_notes_order_idx` ON `homepage_about_sticky_notes` (`_order`);
index homepage_about_sticky_notes_order_idx already exists
```

```bash
pnpm run db:repair-local
pnpm run dev
```

### Example: `vendors` + `vendors_media_idx already exists`

```text
CREATE INDEX `vendors_media_idx` ON `vendors` (`media_id`);
index vendors_media_idx already exists
```

```bash
pnpm run db:repair-local
pnpm run dev
```

## If repair still fails

Reset local D1 (deletes all local CMS data):

```bash
pnpm run db:reset-local
pnpm run dev
```

## Avoid next time

- After Payload schema changes, let dev **fully start** once; don’t kill mid-push.
- Don’t hand-edit local D1 columns/indexes for fields that push manages.
- If push errors, fix drift **before** editing content in admin.
- **Local** = drizzle push; **production** = `payload migrate` (separate from this doc).

## Agent shortcut

> “Fix per `docs/local-drizzle-push-errors.md` — error: `CREATE INDEX … already exists` on table `X`.”

Provide the table name and full error line from the terminal.
