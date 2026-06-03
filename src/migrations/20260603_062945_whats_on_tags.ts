import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_main_tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_main_tags_updated_at_idx\` ON \`whats_on_main_tags\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_main_tags_created_at_idx\` ON \`whats_on_main_tags\` (\`created_at\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_whats_on_sub_tags\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_whats_on_sub_tags\`("id", "text", "updated_at", "created_at") SELECT "id", "text", "updated_at", "created_at" FROM \`whats_on_sub_tags\`;`,
  )
  await db.run(sql`DROP TABLE \`whats_on_sub_tags\`;`)
  await db.run(sql`ALTER TABLE \`__new_whats_on_sub_tags\` RENAME TO \`whats_on_sub_tags\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`whats_on_sub_tags_updated_at_idx\` ON \`whats_on_sub_tags\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_sub_tags_created_at_idx\` ON \`whats_on_sub_tags\` (\`created_at\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`whats_on\` ADD \`main_tag_id\` integer REFERENCES whats_on_main_tags(id);`,
  )
  await db.run(sql`CREATE INDEX \`whats_on_main_tag_idx\` ON \`whats_on\` (\`main_tag_id\`);`)
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`main_tag\`;`)
  await db.run(
    sql`ALTER TABLE \`whats_on_rels\` ADD \`whats_on_sub_tags_id\` integer REFERENCES whats_on_sub_tags(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_rels_whats_on_sub_tags_id_idx\` ON \`whats_on_rels\` (\`whats_on_sub_tags_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`whats_on_main_tags_id\` integer REFERENCES whats_on_main_tags(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`whats_on_sub_tags_id\` integer REFERENCES whats_on_sub_tags(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_main_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_main_tags_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_sub_tags_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_sub_tags_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`whats_on_main_tags\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_whats_on\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`date_to_be_archived\` text,
  	\`media_id\` integer,
  	\`bg_color\` text,
  	\`date\` text,
  	\`time\` text,
  	\`main_tag\` text,
  	\`highlight_text_enabled\` integer,
  	\`highlight_text_text\` text,
  	\`content\` text,
  	\`button_text\` text,
  	\`button_link\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_whats_on\`("id", "title", "slug", "date_to_be_archived", "media_id", "bg_color", "date", "time", "main_tag", "highlight_text_enabled", "highlight_text_text", "content", "button_text", "button_link", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "date_to_be_archived", "media_id", "bg_color", "date", "time", "main_tag", "highlight_text_enabled", "highlight_text_text", "content", "button_text", "button_link", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`whats_on\`;`,
  )
  await db.run(sql`DROP TABLE \`whats_on\`;`)
  await db.run(sql`ALTER TABLE \`__new_whats_on\` RENAME TO \`whats_on\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`whats_on_slug_idx\` ON \`whats_on\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_media_idx\` ON \`whats_on\` (\`media_id\`);`)
  await db.run(
    sql`CREATE INDEX \`whats_on_meta_meta_image_idx\` ON \`whats_on\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`whats_on_updated_at_idx\` ON \`whats_on\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_created_at_idx\` ON \`whats_on\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_whats_on_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`branches_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branches_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_whats_on_rels\`("id", "order", "parent_id", "path", "branches_id", "media_id") SELECT "id", "order", "parent_id", "path", "branches_id", "media_id" FROM \`whats_on_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`whats_on_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_whats_on_rels\` RENAME TO \`whats_on_rels\`;`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_order_idx\` ON \`whats_on_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_parent_idx\` ON \`whats_on_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_path_idx\` ON \`whats_on_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`whats_on_rels_branches_id_idx\` ON \`whats_on_rels\` (\`branches_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_rels_media_id_idx\` ON \`whats_on_rels\` (\`media_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`lifestyle_id\` integer,
  	\`branches_id\` integer,
  	\`branch_contact_pages_id\` integer,
  	\`branch_space_rental_pages_id\` integer,
  	\`blogs_id\` integer,
  	\`vendor_categories_id\` integer,
  	\`vendors_id\` integer,
  	\`whats_on_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branches_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branch_contact_pages_id\`) REFERENCES \`branch_contact_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branch_space_rental_pages_id\`) REFERENCES \`branch_space_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`blogs_id\`) REFERENCES \`blogs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendor_categories_id\`) REFERENCES \`vendor_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendors_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "lifestyle_id", "branches_id", "branch_contact_pages_id", "branch_space_rental_pages_id", "blogs_id", "vendor_categories_id", "vendors_id", "whats_on_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "lifestyle_id", "branches_id", "branch_contact_pages_id", "branch_space_rental_pages_id", "blogs_id", "vendor_categories_id", "vendors_id", "whats_on_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
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
    sql`CREATE INDEX \`payload_locked_documents_rels_lifestyle_id_idx\` ON \`payload_locked_documents_rels\` (\`lifestyle_id\`);`,
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
    sql`CREATE INDEX \`payload_locked_documents_rels_vendor_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`vendor_categories_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_vendors_id_idx\` ON \`payload_locked_documents_rels\` (\`vendors_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_id\`);`,
  )
  await db.run(sql`DROP INDEX \`whats_on_sub_tags_updated_at_idx\`;`)
  await db.run(sql`DROP INDEX \`whats_on_sub_tags_created_at_idx\`;`)
  await db.run(sql`ALTER TABLE \`whats_on_sub_tags\` ADD \`order\` integer NOT NULL;`)
  await db.run(
    sql`ALTER TABLE \`whats_on_sub_tags\` ADD \`parent_id\` integer NOT NULL REFERENCES whats_on(id);`,
  )
  await db.run(sql`ALTER TABLE \`whats_on_sub_tags\` ADD \`value\` text;`)
  await db.run(
    sql`CREATE INDEX \`whats_on_sub_tags_order_idx\` ON \`whats_on_sub_tags\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_sub_tags_parent_idx\` ON \`whats_on_sub_tags\` (\`parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`whats_on_sub_tags\` DROP COLUMN \`text\`;`)
  await db.run(sql`ALTER TABLE \`whats_on_sub_tags\` DROP COLUMN \`updated_at\`;`)
  await db.run(sql`ALTER TABLE \`whats_on_sub_tags\` DROP COLUMN \`created_at\`;`)
}
