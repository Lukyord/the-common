-- Complete interrupted vendors rebuild. Only run when __new_vendors exists.

PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS vendors;
ALTER TABLE __new_vendors RENAME TO vendors;

CREATE INDEX IF NOT EXISTS vendors_media_idx ON vendors (media_id);
CREATE UNIQUE INDEX IF NOT EXISTS vendors_slug_idx ON vendors (slug);
CREATE INDEX IF NOT EXISTS vendors_branch_idx ON vendors (branch_id);
CREATE INDEX IF NOT EXISTS vendors_category_idx ON vendors (category_id);
CREATE INDEX IF NOT EXISTS vendors_meta_meta_image_idx ON vendors (meta_image_id);
CREATE INDEX IF NOT EXISTS vendors_updated_at_idx ON vendors (updated_at);
CREATE INDEX IF NOT EXISTS vendors_created_at_idx ON vendors (created_at);

PRAGMA foreign_keys=ON;
