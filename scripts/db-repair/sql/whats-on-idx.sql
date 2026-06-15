-- Recreate whats_on indexes missing after a failed drizzle push rebuild.
-- Index names are global in SQLite; a partial rebuild can leave names on a renamed table
-- and block CREATE INDEX on the new table — drop orphans first, then recreate.
DROP INDEX IF EXISTS whats_on_slug_idx;
DROP INDEX IF EXISTS whats_on_branch_idx;
DROP INDEX IF EXISTS whats_on_media_idx;
DROP INDEX IF EXISTS whats_on_meta_meta_image_idx;
DROP INDEX IF EXISTS whats_on_updated_at_idx;
DROP INDEX IF EXISTS whats_on_created_at_idx;

CREATE UNIQUE INDEX IF NOT EXISTS whats_on_slug_idx ON whats_on (slug);
CREATE INDEX IF NOT EXISTS whats_on_media_idx ON whats_on (media_id);
CREATE INDEX IF NOT EXISTS whats_on_meta_meta_image_idx ON whats_on (meta_image_id);
CREATE INDEX IF NOT EXISTS whats_on_updated_at_idx ON whats_on (updated_at);
CREATE INDEX IF NOT EXISTS whats_on_created_at_idx ON whats_on (created_at);
