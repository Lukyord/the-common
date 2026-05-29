import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`announcement_show\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`announcement_format\` text;`)
  await db.run(
    sql`ALTER TABLE \`homepage\` ADD \`announcement_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`announcement_link\` text;`)
  await db.run(
    sql`ALTER TABLE \`homepage\` ADD \`what_are_you_in_the_mood_for_title_line_one\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`homepage\` ADD \`what_are_you_in_the_mood_for_title_line_two\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`homepage\` ADD \`what_are_you_in_the_mood_for_pre_sentence\` text;`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_announcement_announcement_media_idx\` ON \`homepage\` (\`announcement_media_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`recommender_title\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`recommender_suffix\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_media_id\` integer,
  	\`hero_mobile_background_media_id\` integer,
  	\`hero_title\` text,
  	\`about_title\` text,
  	\`about_description\` text,
  	\`people_of_the_commons_title\` text,
  	\`flexible_section_show\` integer DEFAULT false,
  	\`recommender_title\` text,
  	\`recommender_suffix\` text,
  	\`bingo_title\` text,
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
    sql`INSERT INTO \`__new_homepage\`("id", "hero_background_media_id", "hero_mobile_background_media_id", "hero_title", "about_title", "about_description", "people_of_the_commons_title", "flexible_section_show", "recommender_title", "recommender_suffix", "bingo_title", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "hero_background_media_id", "hero_mobile_background_media_id", "hero_title", "about_title", "about_description", "people_of_the_commons_title", "flexible_section_show", "recommender_title", "recommender_suffix", "bingo_title", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`homepage\`;`,
  )
  await db.run(sql`DROP TABLE \`homepage\`;`)
  await db.run(sql`ALTER TABLE \`__new_homepage\` RENAME TO \`homepage\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`homepage_hero_hero_background_media_idx\` ON \`homepage\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_hero_hero_mobile_background_media_idx\` ON \`homepage\` (\`hero_mobile_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_meta_meta_image_idx\` ON \`homepage\` (\`meta_image_id\`);`,
  )
}
