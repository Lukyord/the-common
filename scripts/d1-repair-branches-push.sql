-- Complete interrupted branches rebuild. Only run when __new_branches exists.
-- See scripts/db-repair-local.sh (or docs/local-drizzle-push-errors.md).

PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS branches;
ALTER TABLE __new_branches RENAME TO branches;

CREATE UNIQUE INDEX IF NOT EXISTS branches_slug_idx ON branches (slug);
CREATE INDEX IF NOT EXISTS branches_logo_idx ON branches (logo_id);
CREATE INDEX IF NOT EXISTS branches_hero_hero_background_media_idx ON branches (hero_background_media_id);
CREATE INDEX IF NOT EXISTS branches_hero_hero_mobile_background_media_idx ON branches (hero_mobile_background_media_id);
CREATE INDEX IF NOT EXISTS branches_meta_meta_image_idx ON branches (meta_image_id);
CREATE INDEX IF NOT EXISTS branches_updated_at_idx ON branches (updated_at);
CREATE INDEX IF NOT EXISTS branches_created_at_idx ON branches (created_at);

PRAGMA foreign_keys=ON;
