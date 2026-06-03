#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

DB="$(find .wrangler/state/v3/d1/miniflare-D1DatabaseObject -maxdepth 1 -name '*.sqlite' ! -name '*-wal' ! -name '*-shm' 2>/dev/null | head -1)"

if [[ -z "${DB}" ]]; then
  echo "No local D1 sqlite file found. Run pnpm run dev once, or pnpm run db:reset-local."
  exit 1
fi

echo "Using database: ${DB}"

has_table() {
  sqlite3 "${DB}" "SELECT 1 FROM sqlite_master WHERE type='table' AND name='$1' LIMIT 1;" | grep -q 1
}

if has_table '__new_branches'; then
  echo "Repairing branches (__new_branches → branches)…"
  sqlite3 "${DB}" < scripts/d1-repair-branches-push.sql
else
  echo "Skip branches repair (no __new_branches)."
fi

if has_table '__new_vendors'; then
  echo "Repairing vendors (__new_vendors → vendors)…"
  sqlite3 "${DB}" < scripts/d1-repair-vendors-push.sql
else
  echo "Skip vendors table swap (no __new_vendors)."
  if sqlite3 "${DB}" "SELECT 1 FROM sqlite_master WHERE type='index' AND name='vendors_media_idx';" | grep -q 1; then
    echo "Dropping vendors_media_idx so drizzle push can recreate it…"
    sqlite3 "${DB}" < scripts/d1-repair-vendors-media-idx.sql
  fi
fi

if has_table '__new_payload_locked_documents_rels'; then
  echo "Found __new_payload_locked_documents_rels — drop it manually or reset local D1."
else
  if sqlite3 "${DB}" "SELECT 1 FROM sqlite_master WHERE type='index' AND name='payload_locked_documents_rels_order_idx';" | grep -q 1; then
    echo "Dropping payload_locked_documents_rels indexes so drizzle push can recreate them…"
    sqlite3 "${DB}" < scripts/d1-repair-payload-locked-docs-rels-idx.sql
  fi
fi

if has_table '__new_whats_on'; then
  echo "Found __new_whats_on — drop it manually or reset local D1."
else
  missing_whats_on_idx=0
  for idx in whats_on_slug_idx whats_on_branch_idx whats_on_media_idx; do
    if ! sqlite3 "${DB}" "SELECT 1 FROM sqlite_master WHERE type='index' AND name='${idx}';" | grep -q 1; then
      missing_whats_on_idx=1
      break
    fi
  done
  if [[ "${missing_whats_on_idx}" -eq 1 ]]; then
    echo "Recreating missing whats_on indexes…"
    sqlite3 "${DB}" < scripts/d1-repair-whats-on-idx.sql
  fi
fi

echo "Done. Restart: pnpm run dev"
