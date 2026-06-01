-- Re-add contact BG upload columns after drift repair (see docs/local-drizzle-push-errors.md).
-- Run when Payload errors: table contact has no column named contact_bg_id
ALTER TABLE contact ADD COLUMN contact_bg_id integer REFERENCES media(id);
ALTER TABLE contact ADD COLUMN contact_bg_mobile_id integer REFERENCES media(id);
CREATE INDEX IF NOT EXISTS contact_contact_bg_idx ON contact (contact_bg_id);
CREATE INDEX IF NOT EXISTS contact_contact_bg_mobile_idx ON contact (contact_bg_mobile_id);
