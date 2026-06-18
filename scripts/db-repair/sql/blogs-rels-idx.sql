-- Unstick drizzle push: indexes exist but push retries CREATE INDEX on blogs_rels.
DROP INDEX IF EXISTS blogs_rels_order_idx;
DROP INDEX IF EXISTS blogs_rels_parent_idx;
DROP INDEX IF EXISTS blogs_rels_path_idx;
DROP INDEX IF EXISTS blogs_rels_branches_id_idx;
DROP INDEX IF EXISTS blogs_rels_media_id_idx;

CREATE INDEX IF NOT EXISTS blogs_rels_order_idx ON blogs_rels (`order`);
CREATE INDEX IF NOT EXISTS blogs_rels_parent_idx ON blogs_rels (parent_id);
CREATE INDEX IF NOT EXISTS blogs_rels_path_idx ON blogs_rels (path);
CREATE INDEX IF NOT EXISTS blogs_rels_branches_id_idx ON blogs_rels (branches_id);
CREATE INDEX IF NOT EXISTS blogs_rels_media_id_idx ON blogs_rels (media_id);
