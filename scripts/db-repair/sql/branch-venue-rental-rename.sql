-- Finish branch_space_rental → branch_venue_rental rename after interrupted drizzle push.
-- Safe when branch_venue_rental_pages exists and payload_locked_documents_rels still has branch_space_rental_pages_id.

PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS __new_payload_locked_documents_rels;

ALTER TABLE payload_locked_documents_rels
  RENAME COLUMN branch_space_rental_pages_id TO branch_venue_rental_pages_id;

DROP INDEX IF EXISTS payload_locked_documents_rels_branch_space_rental_pages__idx;
CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_branch_venue_rental_pages__idx
  ON payload_locked_documents_rels (branch_venue_rental_pages_id);

PRAGMA foreign_keys=ON;
