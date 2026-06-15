-- Unstick drizzle push: indexes exist but push retries CREATE INDEX on whats_on_rels.
DROP INDEX IF EXISTS whats_on_rels_order_idx;
DROP INDEX IF EXISTS whats_on_rels_parent_idx;
DROP INDEX IF EXISTS whats_on_rels_path_idx;
DROP INDEX IF EXISTS whats_on_rels_branches_id_idx;
DROP INDEX IF EXISTS whats_on_rels_media_id_idx;
DROP INDEX IF EXISTS whats_on_rels_whats_on_sub_tags_id_idx;

CREATE INDEX IF NOT EXISTS whats_on_rels_order_idx ON whats_on_rels (`order`);
CREATE INDEX IF NOT EXISTS whats_on_rels_parent_idx ON whats_on_rels (parent_id);
CREATE INDEX IF NOT EXISTS whats_on_rels_path_idx ON whats_on_rels (path);
CREATE INDEX IF NOT EXISTS whats_on_rels_branches_id_idx ON whats_on_rels (branches_id);
CREATE INDEX IF NOT EXISTS whats_on_rels_media_id_idx ON whats_on_rels (media_id);
CREATE INDEX IF NOT EXISTS whats_on_rels_whats_on_sub_tags_id_idx ON whats_on_rels (whats_on_sub_tags_id);
