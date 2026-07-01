-- Unstick drizzle push: indexes exist but push retries CREATE INDEX on branch_whats_on_pages_rels.
DROP INDEX IF EXISTS branch_whats_on_pages_rels_order_idx;
DROP INDEX IF EXISTS branch_whats_on_pages_rels_parent_idx;
DROP INDEX IF EXISTS branch_whats_on_pages_rels_path_idx;
DROP INDEX IF EXISTS branch_whats_on_pages_rels_media_id_idx;
DROP INDEX IF EXISTS branch_whats_on_pages_rels_whats_on_main_tags_id_idx;

CREATE INDEX IF NOT EXISTS branch_whats_on_pages_rels_order_idx ON branch_whats_on_pages_rels (`order`);
CREATE INDEX IF NOT EXISTS branch_whats_on_pages_rels_parent_idx ON branch_whats_on_pages_rels (parent_id);
CREATE INDEX IF NOT EXISTS branch_whats_on_pages_rels_path_idx ON branch_whats_on_pages_rels (path);
CREATE INDEX IF NOT EXISTS branch_whats_on_pages_rels_media_id_idx ON branch_whats_on_pages_rels (media_id);
CREATE INDEX IF NOT EXISTS branch_whats_on_pages_rels_whats_on_main_tags_id_idx ON branch_whats_on_pages_rels (whats_on_main_tags_id);
