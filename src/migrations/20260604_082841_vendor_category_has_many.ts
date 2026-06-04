import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_event_schedule_dates\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_event_schedule_dates_order_idx\` ON \`whats_on_event_schedule_dates\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_event_schedule_dates_parent_id_idx\` ON \`whats_on_event_schedule_dates\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`whats_on_event_schedule_ranges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`start_date\` text,
  	\`end_date\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_event_schedule_ranges_order_idx\` ON \`whats_on_event_schedule_ranges\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_event_schedule_ranges_parent_id_idx\` ON \`whats_on_event_schedule_ranges\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`vendors_rels\` ADD \`vendor_categories_id\` integer REFERENCES vendor_categories(id);`,
  )
  await db.run(
    sql`INSERT INTO \`vendors_rels\` (\`order\`, \`parent_id\`, \`path\`, \`vendor_categories_id\`) SELECT 0, \`id\`, 'category', \`category_id\` FROM \`vendors\` WHERE \`category_id\` IS NOT NULL;`,
  )
  await db.run(
    sql`CREATE INDEX \`vendors_rels_vendor_categories_id_idx\` ON \`vendors_rels\` (\`vendor_categories_id\`);`,
  )
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
  	\`description\` text,
  	\`opening_hours\` text,
  	\`social_facebook\` text,
  	\`social_instagram\` text,
  	\`social_grab\` text,
  	\`social_website\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_vendors\`("id", "media_id", "name", "slug", "branch_id", "floor", "floor_location", "lot_number", "description", "opening_hours", "social_facebook", "social_instagram", "social_grab", "social_website", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "media_id", "name", "slug", "branch_id", "floor", "floor_location", "lot_number", "description", "opening_hours", "social_facebook", "social_instagram", "social_grab", "social_website", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`vendors\`;`,
  )
  await db.run(sql`DROP TABLE \`vendors\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors\` RENAME TO \`vendors\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`vendors_media_idx\` ON \`vendors\` (\`media_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`vendors_slug_idx\` ON \`vendors\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`vendors_branch_idx\` ON \`vendors\` (\`branch_id\`);`)
  await db.run(
    sql`CREATE INDEX \`vendors_meta_meta_image_idx\` ON \`vendors\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`vendors_updated_at_idx\` ON \`vendors\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`vendors_created_at_idx\` ON \`vendors\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`latest_title\` text;`)
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`latest_background\` text;`)
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`latest_all_branches_background\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`whats_on\` ADD \`event_schedule_pattern\` text DEFAULT 'single' NOT NULL;`,
  )
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`event_schedule_date\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`event_schedule_start_date\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`event_schedule_end_date\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`whats_on_event_schedule_dates\`;`)
  await db.run(sql`DROP TABLE \`whats_on_event_schedule_ranges\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_vendors_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`lifestyle_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_vendors_rels\`("id", "order", "parent_id", "path", "media_id", "lifestyle_id") SELECT "id", "order", "parent_id", "path", "media_id", "lifestyle_id" FROM \`vendors_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`vendors_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors_rels\` RENAME TO \`vendors_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`vendors_rels_order_idx\` ON \`vendors_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_parent_idx\` ON \`vendors_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_path_idx\` ON \`vendors_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_media_id_idx\` ON \`vendors_rels\` (\`media_id\`);`)
  await db.run(
    sql`CREATE INDEX \`vendors_rels_lifestyle_id_idx\` ON \`vendors_rels\` (\`lifestyle_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`vendors\` ADD \`category_id\` integer REFERENCES vendor_categories(id);`,
  )
  await db.run(sql`CREATE INDEX \`vendors_category_idx\` ON \`vendors\` (\`category_id\`);`)
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`latest_title\`;`)
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`latest_background\`;`)
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`latest_all_branches_background\`;`,
  )
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`event_schedule_pattern\`;`)
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`event_schedule_date\`;`)
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`event_schedule_start_date\`;`)
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`event_schedule_end_date\`;`)
}
