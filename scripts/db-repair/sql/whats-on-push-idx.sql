-- Unstick drizzle push when whats_on indexes exist but push retries CREATE INDEX.
DROP INDEX IF EXISTS whats_on_slug_idx;
DROP INDEX IF EXISTS whats_on_media_idx;
DROP INDEX IF EXISTS whats_on_meta_meta_image_idx;
DROP INDEX IF EXISTS whats_on_updated_at_idx;
DROP INDEX IF EXISTS whats_on_created_at_idx;
DROP INDEX IF EXISTS whats_on_main_tag_idx;
