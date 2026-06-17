import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_media_id\` integer,
  	\`hero_mobile_background_media_id\` integer,
  	\`hero_title\` text,
  	\`club_title\` text,
  	\`club_main_tag_id\` integer,
  	\`all_events_and_workshops_title\` text,
  	\`all_events_and_workshops_description\` text,
  	\`all_events_and_workshops_background\` text,
  	\`all_events_and_workshops_event_archive_background\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_mobile_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`club_main_tag_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_page_hero_hero_background_media_idx\` ON \`whats_on_page\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_page_hero_hero_mobile_background_media_idx\` ON \`whats_on_page\` (\`hero_mobile_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_page_club_club_main_tag_idx\` ON \`whats_on_page\` (\`club_main_tag_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_page_meta_meta_image_idx\` ON \`whats_on_page\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`whats_on_page_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`whats_on_main_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on_page\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_main_tags_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_page_rels_order_idx\` ON \`whats_on_page_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_page_rels_parent_idx\` ON \`whats_on_page_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_page_rels_path_idx\` ON \`whats_on_page_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_page_rels_whats_on_main_tags_id_idx\` ON \`whats_on_page_rels\` (\`whats_on_main_tags_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`whats_on_page\`;`)
  await db.run(sql`DROP TABLE \`whats_on_page_rels\`;`)
}
