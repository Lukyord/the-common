import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`contact\` ADD \`contact_bg_id\` integer REFERENCES media(id);`)
  await db.run(
    sql`ALTER TABLE \`contact\` ADD \`contact_bg_mobile_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`CREATE INDEX \`contact_contact_bg_idx\` ON \`contact\` (\`contact_bg_id\`);`)
  await db.run(
    sql`CREATE INDEX \`contact_contact_bg_mobile_idx\` ON \`contact\` (\`contact_bg_mobile_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_contact\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text,
  	\`tel\` text,
  	\`kinnest_group\` text,
  	\`social_instagram\` text,
  	\`social_facebook\` text,
  	\`social_line\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_contact\`("id", "email", "tel", "kinnest_group", "social_instagram", "social_facebook", "social_line", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "email", "tel", "kinnest_group", "social_instagram", "social_facebook", "social_line", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`contact\`;`,
  )
  await db.run(sql`DROP TABLE \`contact\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact\` RENAME TO \`contact\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`contact_meta_meta_image_idx\` ON \`contact\` (\`meta_image_id\`);`,
  )
}
