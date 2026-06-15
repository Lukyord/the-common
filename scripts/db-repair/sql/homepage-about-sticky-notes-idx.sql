-- Unstick drizzle push when homepage_about_sticky_notes indexes exist but push retries CREATE INDEX.
DROP INDEX IF EXISTS homepage_about_sticky_notes_order_idx;
DROP INDEX IF EXISTS homepage_about_sticky_notes_parent_id_idx;
DROP INDEX IF EXISTS homepage_about_sticky_notes_media_idx;
