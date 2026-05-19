import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage_motto\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`shape\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_motto_order_idx\` ON \`homepage_motto\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`homepage_motto_parent_id_idx\` ON \`homepage_motto\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`homepage_flexible_section\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`homepage_flexible_section_order_idx\` ON \`homepage_flexible_section\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_flexible_section_parent_id_idx\` ON \`homepage_flexible_section\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_flexible_section_media_idx\` ON \`homepage_flexible_section\` (\`media_id\`);`,
  )
  await db.run(sql`DROP TABLE \`homepage_flexible_section_content\`;`)
  await db.run(
    sql`ALTER TABLE \`homepage\` ADD \`hero_mobile_background_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_hero_hero_mobile_background_media_idx\` ON \`homepage\` (\`hero_mobile_background_media_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`motto_text\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`motto_shape\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`flexible_section_show\`;`)
  await db.run(sql`ALTER TABLE \`lifestyle\` DROP COLUMN \`active\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage_flexible_section_content\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text_title\` text,
  	\`text_description\` text,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`homepage_flexible_section_content_order_idx\` ON \`homepage_flexible_section_content\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_flexible_section_content_parent_id_idx\` ON \`homepage_flexible_section_content\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_flexible_section_content_media_idx\` ON \`homepage_flexible_section_content\` (\`media_id\`);`,
  )
  await db.run(sql`DROP TABLE \`homepage_motto\`;`)
  await db.run(sql`DROP TABLE \`homepage_flexible_section\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_media_id\` integer,
  	\`hero_title\` text,
  	\`motto_text\` text,
  	\`motto_shape\` text,
  	\`about_title\` text,
  	\`about_description\` text,
  	\`people_of_the_commons_title\` text,
  	\`flexible_section_show\` integer DEFAULT false,
  	\`recommender_title\` text,
  	\`recommender_suffix\` text,
  	\`membership_title\` text,
  	\`membership_description\` text,
  	\`membership_button_text\` text,
  	\`membership_button_link\` text,
  	\`bingo_title\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_homepage\`("id", "hero_background_media_id", "hero_title", "motto_text", "motto_shape", "about_title", "about_description", "people_of_the_commons_title", "flexible_section_show", "recommender_title", "recommender_suffix", "membership_title", "membership_description", "membership_button_text", "membership_button_link", "bingo_title", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "hero_background_media_id", "hero_title", "motto_text", "motto_shape", "about_title", "about_description", "people_of_the_commons_title", "flexible_section_show", "recommender_title", "recommender_suffix", "membership_title", "membership_description", "membership_button_text", "membership_button_link", "bingo_title", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`homepage\`;`,
  )
  await db.run(sql`DROP TABLE \`homepage\`;`)
  await db.run(sql`ALTER TABLE \`__new_homepage\` RENAME TO \`homepage\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`homepage_hero_hero_background_media_idx\` ON \`homepage\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_meta_meta_image_idx\` ON \`homepage\` (\`meta_image_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`lifestyle\` ADD \`active\` integer DEFAULT true;`)
}
