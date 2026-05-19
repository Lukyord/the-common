import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_info\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`hex_code\` text,
  	\`rich_text_editor\` text,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_info_order_idx\` ON \`about_info\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_info_parent_id_idx\` ON \`about_info\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_info_media_idx\` ON \`about_info\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`about_awards_media\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_awards_media_order_idx\` ON \`about_awards_media\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_awards_media_parent_id_idx\` ON \`about_awards_media\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_awards_media_media_idx\` ON \`about_awards_media\` (\`media_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about_kinnest_marquee_media\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_kinnest_marquee_media_order_idx\` ON \`about_kinnest_marquee_media\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_kinnest_marquee_media_parent_id_idx\` ON \`about_kinnest_marquee_media\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_kinnest_marquee_media_media_idx\` ON \`about_kinnest_marquee_media\` (\`media_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_title\` text,
  	\`hero_background_media_id\` integer,
  	\`hero_mobile_background_media_id\` integer,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_mobile_background_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_hero_hero_background_media_idx\` ON \`about\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_hero_hero_mobile_background_media_idx\` ON \`about\` (\`hero_mobile_background_media_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`about_meta_meta_image_idx\` ON \`about\` (\`meta_image_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_info\`;`)
  await db.run(sql`DROP TABLE \`about_awards_media\`;`)
  await db.run(sql`DROP TABLE \`about_kinnest_marquee_media\`;`)
  await db.run(sql`DROP TABLE \`about\`;`)
}
