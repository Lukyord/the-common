import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`vendors\` RENAME COLUMN "title" TO "name";`)
  await db.run(sql`CREATE TABLE \`branches_floors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`floor_id\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`branches_floors_order_idx\` ON \`branches_floors\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`branches_floors_parent_id_idx\` ON \`branches_floors\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`vendor_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category_id\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`vendor_categories_category_id_idx\` ON \`vendor_categories\` (\`category_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`vendor_categories_updated_at_idx\` ON \`vendor_categories\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`vendor_categories_created_at_idx\` ON \`vendor_categories\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`vendors_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`vendors_tags_order_idx\` ON \`vendors_tags\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_tags_parent_idx\` ON \`vendors_tags\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`vendors_more_at\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`vendors_more_at_order_idx\` ON \`vendors_more_at\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`vendors_more_at_parent_id_idx\` ON \`vendors_more_at\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`vendors_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`vendors_texts_order_parent\` ON \`vendors_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`vendors_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`vendor_categories_id\` integer,
  	\`lifestyle_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendor_categories_id\`) REFERENCES \`vendor_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`vendors_rels_order_idx\` ON \`vendors_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_parent_idx\` ON \`vendors_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_path_idx\` ON \`vendors_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`vendors_rels_vendor_categories_id_idx\` ON \`vendors_rels\` (\`vendor_categories_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`vendors_rels_lifestyle_id_idx\` ON \`vendors_rels\` (\`lifestyle_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`floor\` text;`)
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`floor_location\` text;`)
  await db.run(
    sql`ALTER TABLE \`vendors\` ADD \`main_tag_id\` integer REFERENCES vendor_categories(id);`,
  )
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`opening_hours\` text;`)
  await db.run(sql`CREATE INDEX \`vendors_media_idx\` ON \`vendors\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_main_tag_idx\` ON \`vendors\` (\`main_tag_id\`);`)
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`vendor_categories_id\` integer REFERENCES vendor_categories(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_vendor_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`vendor_categories_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branches_floors\`;`)
  await db.run(sql`DROP TABLE \`vendor_categories\`;`)
  await db.run(sql`DROP TABLE \`vendors_tags\`;`)
  await db.run(sql`DROP TABLE \`vendors_more_at\`;`)
  await db.run(sql`DROP TABLE \`vendors_texts\`;`)
  await db.run(sql`DROP TABLE \`vendors_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_vendors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_vendors\`("id", "title", "slug", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`vendors\`;`,
  )
  await db.run(sql`DROP TABLE \`vendors\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors\` RENAME TO \`vendors\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`vendors_slug_idx\` ON \`vendors\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vendors_branch_idx\` ON \`vendors\` (\`branch_id\`);`)
  await db.run(
    sql`CREATE INDEX \`vendors_meta_meta_image_idx\` ON \`vendors\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`vendors_updated_at_idx\` ON \`vendors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendors_created_at_idx\` ON \`vendors\` (\`created_at\`);`)
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
  	FOREIGN KEY (\`vendors_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "lifestyle_id", "branches_id", "branch_contact_pages_id", "branch_space_rental_pages_id", "blogs_id", "vendors_id", "whats_on_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "lifestyle_id", "branches_id", "branch_contact_pages_id", "branch_space_rental_pages_id", "blogs_id", "vendors_id", "whats_on_id" FROM \`payload_locked_documents_rels\`;`,
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
    sql`CREATE INDEX \`payload_locked_documents_rels_vendors_id_idx\` ON \`payload_locked_documents_rels\` (\`vendors_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_id\`);`,
  )
}
