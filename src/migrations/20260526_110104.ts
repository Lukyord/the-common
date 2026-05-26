import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_vendors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`floor\` text,
  	\`floor_location\` text,
  	\`lot_number\` numeric,
  	\`category_id\` integer,
  	\`description\` text,
  	\`opening_hours\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`vendor_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_vendors\`("id", "media_id", "name", "slug", "branch_id", "floor", "floor_location", "lot_number", "category_id", "description", "opening_hours", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "media_id", "name", "slug", "branch_id", "floor", "floor_location", "lot_number", "category_id", "description", "opening_hours", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`vendors\`;`)
  await db.run(sql`DROP TABLE \`vendors\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors\` RENAME TO \`vendors\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`vendors_media_idx\` ON \`vendors\` (\`media_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`vendors_slug_idx\` ON \`vendors\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vendors_branch_idx\` ON \`vendors\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_category_idx\` ON \`vendors\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_meta_meta_image_idx\` ON \`vendors\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_updated_at_idx\` ON \`vendors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendors_created_at_idx\` ON \`vendors\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_vendors_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`lifestyle_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_vendors_rels\`("id", "order", "parent_id", "path", "lifestyle_id") SELECT "id", "order", "parent_id", "path", "lifestyle_id" FROM \`vendors_rels\`;`)
  await db.run(sql`DROP TABLE \`vendors_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors_rels\` RENAME TO \`vendors_rels\`;`)
  await db.run(sql`CREATE INDEX \`vendors_rels_order_idx\` ON \`vendors_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_parent_idx\` ON \`vendors_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_path_idx\` ON \`vendors_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_lifestyle_id_idx\` ON \`vendors_rels\` (\`lifestyle_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_vendors\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`floor\` text,
  	\`floor_location\` text,
  	\`main_tag_id\` integer,
  	\`description\` text,
  	\`opening_hours\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`main_tag_id\`) REFERENCES \`vendor_categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_vendors\`("id", "media_id", "name", "slug", "branch_id", "floor", "floor_location", "main_tag_id", "description", "opening_hours", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "media_id", "name", "slug", "branch_id", "floor", "floor_location", "main_tag_id", "description", "opening_hours", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`vendors\`;`)
  await db.run(sql`DROP TABLE \`vendors\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors\` RENAME TO \`vendors\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`vendors_media_idx\` ON \`vendors\` (\`media_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`vendors_slug_idx\` ON \`vendors\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vendors_branch_idx\` ON \`vendors\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_main_tag_idx\` ON \`vendors\` (\`main_tag_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_meta_meta_image_idx\` ON \`vendors\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_updated_at_idx\` ON \`vendors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendors_created_at_idx\` ON \`vendors\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`vendors_rels\` ADD \`vendor_categories_id\` integer REFERENCES vendor_categories(id);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_vendor_categories_id_idx\` ON \`vendors_rels\` (\`vendor_categories_id\`);`)
}
