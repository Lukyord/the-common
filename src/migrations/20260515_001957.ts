import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`branches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`branches_slug_idx\` ON \`branches\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`branches_meta_meta_image_idx\` ON \`branches\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`branches_updated_at_idx\` ON \`branches\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`branches_created_at_idx\` ON \`branches\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`branch_contact_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
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
  await db.run(sql`CREATE UNIQUE INDEX \`branch_contact_pages_branch_idx\` ON \`branch_contact_pages\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`branch_contact_pages_meta_meta_image_idx\` ON \`branch_contact_pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`branch_contact_pages_updated_at_idx\` ON \`branch_contact_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`branch_contact_pages_created_at_idx\` ON \`branch_contact_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`branch_space_rental_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
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
  await db.run(sql`CREATE UNIQUE INDEX \`branch_space_rental_pages_branch_idx\` ON \`branch_space_rental_pages\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`branch_space_rental_pages_meta_meta_image_idx\` ON \`branch_space_rental_pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`branch_space_rental_pages_updated_at_idx\` ON \`branch_space_rental_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`branch_space_rental_pages_created_at_idx\` ON \`branch_space_rental_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blogs\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`blogs_slug_idx\` ON \`blogs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blogs_branch_idx\` ON \`blogs\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`blogs_meta_meta_image_idx\` ON \`blogs\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blogs_updated_at_idx\` ON \`blogs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blogs_created_at_idx\` ON \`blogs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`vendors\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`vendors_slug_idx\` ON \`vendors\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vendors_branch_idx\` ON \`vendors\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_meta_meta_image_idx\` ON \`vendors\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_updated_at_idx\` ON \`vendors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendors_created_at_idx\` ON \`vendors\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`whats_on\` (
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
  await db.run(sql`CREATE UNIQUE INDEX \`whats_on_slug_idx\` ON \`whats_on\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_branch_idx\` ON \`whats_on\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_meta_meta_image_idx\` ON \`whats_on\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_updated_at_idx\` ON \`whats_on\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_created_at_idx\` ON \`whats_on\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`branches_id\` integer REFERENCES branches(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`branch_contact_pages_id\` integer REFERENCES branch_contact_pages(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`branch_space_rental_pages_id\` integer REFERENCES branch_space_rental_pages(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`blogs_id\` integer REFERENCES blogs(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`vendors_id\` integer REFERENCES vendors(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`whats_on_id\` integer REFERENCES whats_on(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_branches_id_idx\` ON \`payload_locked_documents_rels\` (\`branches_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_branch_contact_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`branch_contact_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_branch_space_rental_pages__idx\` ON \`payload_locked_documents_rels\` (\`branch_space_rental_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blogs_id_idx\` ON \`payload_locked_documents_rels\` (\`blogs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_vendors_id_idx\` ON \`payload_locked_documents_rels\` (\`vendors_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_whats_on_id_idx\` ON \`payload_locked_documents_rels\` (\`whats_on_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branches\`;`)
  await db.run(sql`DROP TABLE \`branch_contact_pages\`;`)
  await db.run(sql`DROP TABLE \`branch_space_rental_pages\`;`)
  await db.run(sql`DROP TABLE \`blogs\`;`)
  await db.run(sql`DROP TABLE \`vendors\`;`)
  await db.run(sql`DROP TABLE \`whats_on\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`lifestyle_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "lifestyle_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "lifestyle_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_lifestyle_id_idx\` ON \`payload_locked_documents_rels\` (\`lifestyle_id\`);`)
}
