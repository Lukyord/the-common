import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage_about_sticky_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`shape\` text,
  	\`hex_code\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`homepage_about_sticky_notes_order_idx\` ON \`homepage_about_sticky_notes\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_about_sticky_notes_parent_id_idx\` ON \`homepage_about_sticky_notes\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`homepage_people_of_the_commons_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`link\` text,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`homepage_people_of_the_commons_cards_order_idx\` ON \`homepage_people_of_the_commons_cards\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_people_of_the_commons_cards_parent_id_idx\` ON \`homepage_people_of_the_commons_cards\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_people_of_the_commons_cards_media_idx\` ON \`homepage_people_of_the_commons_cards\` (\`media_id\`);`,
  )
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
  await db.run(sql`CREATE TABLE \`homepage_membership_card_media\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`homepage_membership_card_media_order_idx\` ON \`homepage_membership_card_media\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_membership_card_media_parent_id_idx\` ON \`homepage_membership_card_media\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_membership_card_media_media_idx\` ON \`homepage_membership_card_media\` (\`media_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`homepage_bingo_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`homepage_bingo_grid_order_idx\` ON \`homepage_bingo_grid\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_bingo_grid_parent_id_idx\` ON \`homepage_bingo_grid\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`homepage\` (
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
    sql`CREATE INDEX \`homepage_hero_hero_background_media_idx\` ON \`homepage\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_meta_meta_image_idx\` ON \`homepage\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`homepage_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`lifestyle_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_rels_order_idx\` ON \`homepage_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_rels_parent_idx\` ON \`homepage_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_rels_path_idx\` ON \`homepage_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`homepage_rels_lifestyle_id_idx\` ON \`homepage_rels\` (\`lifestyle_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`homepage_about_sticky_notes\`;`)
  await db.run(sql`DROP TABLE \`homepage_people_of_the_commons_cards\`;`)
  await db.run(sql`DROP TABLE \`homepage_flexible_section_content\`;`)
  await db.run(sql`DROP TABLE \`homepage_membership_card_media\`;`)
  await db.run(sql`DROP TABLE \`homepage_bingo_grid\`;`)
  await db.run(sql`DROP TABLE \`homepage_rels\`;`)
  await db.run(sql`DROP TABLE \`homepage\`;`)
}
