import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`homepage_about_sticky_notes\` ADD \`media_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_about_sticky_notes_media_idx\` ON \`homepage_about_sticky_notes\` (\`media_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_homepage_about_sticky_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`shape\` text,
  	\`text\` text,
  	\`bg_color\` text,
  	\`text_color\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_homepage_about_sticky_notes\`("_order", "_parent_id", "id", "shape", "text", "bg_color", "text_color") SELECT "_order", "_parent_id", "id", "shape", "text", "bg_color", "text_color" FROM \`homepage_about_sticky_notes\`;`,
  )
  await db.run(sql`DROP TABLE \`homepage_about_sticky_notes\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_homepage_about_sticky_notes\` RENAME TO \`homepage_about_sticky_notes\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`homepage_about_sticky_notes_order_idx\` ON \`homepage_about_sticky_notes\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`homepage_about_sticky_notes_parent_id_idx\` ON \`homepage_about_sticky_notes\` (\`_parent_id\`);`,
  )
}
