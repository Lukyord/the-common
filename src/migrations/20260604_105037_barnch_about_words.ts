import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Recover from a failed deploy that created child/new tables but did not finish.
  await db.run(sql`DROP TABLE IF EXISTS \`branches_about_word_groups\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`__new_branches\`;`)

  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`logo_id\` integer,
  	\`tel\` text,
  	\`primary_color\` text,
  	\`bg_color\` text,
  	\`footer_bg\` text,
  	\`footer_color\` text,
  	\`find_us\` text,
  	\`opening_hours\` text,
  	\`parking_options\` text,
  	\`hero_background_media_id\` integer,
  	\`hero_mobile_background_media_id\` integer,
  	\`hero_title\` text,
  	\`about_bg_color\` text,
  	\`vibes_check_title\` text,
  	\`vibes_check_primary_color\` text,
  	\`vibes_check_secondary_color\` text,
  	\`vendors_section_title\` text,
  	\`vendors_section_display_type\` text DEFAULT 'latest',
  	\`whats_on_section_title\` text,
  	\`whats_on_section_display_type\` text DEFAULT 'latest',
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_mobile_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_branches\`("id", "name", "slug", "logo_id", "tel", "primary_color", "bg_color", "footer_bg", "footer_color", "find_us", "opening_hours", "parking_options", "hero_background_media_id", "hero_mobile_background_media_id", "hero_title", "about_bg_color", "vibes_check_title", "vibes_check_primary_color", "vibes_check_secondary_color", "vendors_section_title", "vendors_section_display_type", "whats_on_section_title", "whats_on_section_display_type", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "name", "slug", "logo_id", "tel", "primary_color", "bg_color", "footer_bg", "footer_color", "find_us", "opening_hours", "parking_options", "hero_background_media_id", "hero_mobile_background_media_id", "hero_title", "about_bg_color", "vibes_check_title", "vibes_check_primary_color", "vibes_check_secondary_color", "vendors_section_title", "vendors_section_display_type", "whats_on_section_title", "whats_on_section_display_type", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`branches\`;`,
  )
  await db.run(sql`DROP TABLE \`branches\`;`)
  await db.run(sql`ALTER TABLE \`__new_branches\` RENAME TO \`branches\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`branches_slug_idx\` ON \`branches\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`branches_logo_idx\` ON \`branches\` (\`logo_id\`);`)
  await db.run(
    sql`CREATE INDEX \`branches_hero_hero_background_media_idx\` ON \`branches\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_hero_hero_mobile_background_media_idx\` ON \`branches\` (\`hero_mobile_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_meta_meta_image_idx\` ON \`branches\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`branches_updated_at_idx\` ON \`branches\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`branches_created_at_idx\` ON \`branches\` (\`created_at\`);`)

  await db.run(sql`CREATE TABLE \`branches_about_word_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text NOT NULL,
  	\`media_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branches_about_word_groups_order_idx\` ON \`branches_about_word_groups\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_about_word_groups_parent_id_idx\` ON \`branches_about_word_groups\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_about_word_groups_media_idx\` ON \`branches_about_word_groups\` (\`media_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branches_about_word_groups\`;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`about_title\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`about_description\` text;`)
  await db.run(
    sql`ALTER TABLE \`branches\` ADD \`about_background_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`branches\` ADD \`about_mobile_background_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_about_about_background_media_idx\` ON \`branches\` (\`about_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_about_about_mobile_background_media_idx\` ON \`branches\` (\`about_mobile_background_media_id\`);`,
  )
}
