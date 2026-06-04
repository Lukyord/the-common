import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`branches_about_word_groups\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`__new_branches\`;`)

  await db.run(
    sql`DROP INDEX IF EXISTS \`branches_about_about_background_media_idx\`;`,
  )
  await db.run(
    sql`DROP INDEX IF EXISTS \`branches_about_about_mobile_background_media_idx\`;`,
  )
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`about_title\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`about_description\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`about_background_media_id\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`about_mobile_background_media_id\`;`)

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
