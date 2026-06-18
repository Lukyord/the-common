-- Unstick drizzle push when blogs indexes exist but push retries CREATE INDEX.
DROP INDEX IF EXISTS blogs_slug_idx;
DROP INDEX IF EXISTS blogs_media_idx;
DROP INDEX IF EXISTS blogs_meta_meta_image_idx;
DROP INDEX IF EXISTS blogs_updated_at_idx;
DROP INDEX IF EXISTS blogs_created_at_idx;
DROP INDEX IF EXISTS blogs_branch_idx;
