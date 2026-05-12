import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`contact_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`contact_texts_order_parent\` ON \`contact_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`contact\` ADD \`meta_title\` text;`)
  await db.run(sql`ALTER TABLE \`contact\` ADD \`meta_description\` text;`)
  await db.run(sql`ALTER TABLE \`contact\` ADD \`meta_image_id\` integer REFERENCES media(id);`)
  await db.run(
    sql`CREATE INDEX \`contact_meta_meta_image_idx\` ON \`contact\` (\`meta_image_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`flexible_section_show\` integer DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`contact_texts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_contact\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text,
  	\`tel\` text,
  	\`kinnest_group\` text,
  	\`social_instagram\` text,
  	\`social_facebook\` text,
  	\`social_line\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_contact\`("id", "email", "tel", "kinnest_group", "social_instagram", "social_facebook", "social_line", "updated_at", "created_at") SELECT "id", "email", "tel", "kinnest_group", "social_instagram", "social_facebook", "social_line", "updated_at", "created_at" FROM \`contact\`;`,
  )
  await db.run(sql`DROP TABLE \`contact\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact\` RENAME TO \`contact\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`flexible_section_show\`;`)
}
