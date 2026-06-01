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

**Fix (local only):** drop the orphaned rebuild table, then fix any other half-applied columns (e.g. contact BG per above):

```bash
pnpm exec wrangler d1 execute D1 --local --command "
DROP TABLE IF EXISTS __new_branches;
DROP INDEX IF EXISTS contact_contact_bg_idx;
DROP INDEX IF EXISTS contact_contact_bg_mobile_idx;
ALTER TABLE contact DROP COLUMN contact_bg_id;
ALTER TABLE contact DROP COLUMN contact_bg_mobile_id;
"
```

Stop dev before running SQL if commands hang. Restart `pnpm run dev` and let push finish once.

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
