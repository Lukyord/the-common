-- Unstick drizzle push: indexes exist but push retries CREATE INDEX on branches_rels.
DROP INDEX IF EXISTS branches_rels_order_idx;
DROP INDEX IF EXISTS branches_rels_parent_idx;
DROP INDEX IF EXISTS branches_rels_path_idx;
DROP INDEX IF EXISTS branches_rels_vendors_id_idx;
DROP INDEX IF EXISTS branches_rels_whats_on_id_idx;

CREATE INDEX IF NOT EXISTS branches_rels_order_idx ON branches_rels (`order`);
CREATE INDEX IF NOT EXISTS branches_rels_parent_idx ON branches_rels (parent_id);
CREATE INDEX IF NOT EXISTS branches_rels_path_idx ON branches_rels (path);
CREATE INDEX IF NOT EXISTS branches_rels_vendors_id_idx ON branches_rels (vendors_id);
CREATE INDEX IF NOT EXISTS branches_rels_whats_on_id_idx ON branches_rels (whats_on_id);
