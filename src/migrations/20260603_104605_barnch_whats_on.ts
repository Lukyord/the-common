import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`branch_whats_on_pages_landing_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`background\` text,
  	\`pattern\` text,
  	\`front_title\` text,
  	\`back_title\` text,
  	\`back_description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_whats_on_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_landing_cards_order_idx\` ON \`branch_whats_on_pages_landing_cards\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_landing_cards_parent_id_idx\` ON \`branch_whats_on_pages_landing_cards\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_whats_on_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`landing_title\` text,
  	\`club_title\` text,
  	\`club_main_tag_id\` integer,
  	\`all_events_and_workshops_title\` text,
  	\`all_events_and_workshops_main_tag_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`club_main_tag_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`all_events_and_workshops_main_tag_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`branch_whats_on_pages_branch_idx\` ON \`branch_whats_on_pages\` (\`branch_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_club_club_main_tag_idx\` ON \`branch_whats_on_pages\` (\`club_main_tag_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_all_events_and_workshops_all_event_idx\` ON \`branch_whats_on_pages\` (\`all_events_and_workshops_main_tag_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_meta_meta_image_idx\` ON \`branch_whats_on_pages\` (\`meta_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_updated_at_idx\` ON \`branch_whats_on_pages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_created_at_idx\` ON \`branch_whats_on_pages\` (\`created_at\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`branch_whats_on_pages_id\` integer REFERENCES branch_whats_on_pages(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_branch_whats_on_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`branch_whats_on_pages_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branch_whats_on_pages_landing_cards\`;`)
  await db.run(sql`DROP TABLE \`branch_whats_on_pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`branches_id\` integer,
  	\`branch_contact_pages_id\` integer,
  	\`branch_space_rental_pages_id\` integer,
  	\`blogs_id\` integer,
  	\`vendors_id\` integer,
  	\`whats_on_id\` integer,
  	\`lifestyle_id\` integer,
  	\`vendor_categories_id\` integer,
  	\`whats_on_main_tags_id\` integer,
  	\`whats_on_sub_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branches_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branch_contact_pages_id\`) REFERENCES \`branch_contact_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branch_space_rental_pages_id\`) REFERENCES \`branch_space_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blogs_id\`) REFERENCES \`blogs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendors_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendor_categories_id\`) REFERENCES \`vendor_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_main_tags_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_sub_tags_id\`) REFERENCES \`whats_on_sub_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "branches_id", "branch_contact_pages_id", "branch_space_rental_pages_id", "blogs_id", "vendors_id", "whats_on_id", "lifestyle_id", "vendor_categories_id", "whats_on_main_tags_id", "whats_on_sub_tags_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "branches_id", "branch_contact_pages_id", "branch_space_rental_pages_id", "blogs_id", "vendors_id", "whats_on_id", "lifestyle_id", "vendor_categories_id", "whats_on_main_tags_id", "whats_on_sub_tags_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_branches_id_idx\` ON \`payload_locked_documents_rels\` (\`branches_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_branch_contact_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`branch_contact_pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_branch_space_rental_pages__idx\` ON \`payload_locked_documents_rels\` (\`branch_space_rental_pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_blogs_id_idx\` ON \`payload_locked_documents_rels\` (\`blogs_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_vendors_id_idx\` ON \`payload_locked_documents_rels\` (\`vendors_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_lifestyle_id_idx\` ON \`payload_locked_documents_rels\` (\`lifestyle_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_vendor_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`vendor_categories_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_main_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_main_tags_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_sub_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_sub_tags_id\`);`,
  )
}
