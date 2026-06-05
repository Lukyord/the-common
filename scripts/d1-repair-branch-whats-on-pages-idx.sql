-- Unstick drizzle push: branch_whats_on_pages_branch_idx exists but push retries CREATE UNIQUE INDEX.
DROP INDEX IF EXISTS branch_whats_on_pages_branch_idx;

CREATE UNIQUE INDEX IF NOT EXISTS branch_whats_on_pages_branch_idx ON branch_whats_on_pages (branch_id);
