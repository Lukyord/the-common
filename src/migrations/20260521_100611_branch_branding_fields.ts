import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branches\` ADD \`logo_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`primary_color\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`bg_color\` text;`)
  await db.run(
    sql`ALTER TABLE \`branches\` ADD \`hero_background_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`branches\` ADD \`hero_mobile_background_media_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`branches\` ADD \`hero_title\` text;`)
  await db.run(sql`CREATE INDEX \`branches_logo_idx\` ON \`branches\` (\`logo_id\`);`)
  await db.run(
    sql`CREATE INDEX \`branches_hero_hero_background_media_idx\` ON \`branches\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_hero_hero_mobile_background_media_idx\` ON \`branches\` (\`hero_mobile_background_media_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branches\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_branches\`("id", "name", "slug", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "name", "slug", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`branches\`;`,
  )
  await db.run(sql`DROP TABLE \`branches\`;`)
  await db.run(sql`ALTER TABLE \`__new_branches\` RENAME TO \`branches\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`branches_slug_idx\` ON \`branches\` (\`slug\`);`)
  await db.run(
    sql`CREATE INDEX \`branches_meta_meta_image_idx\` ON \`branches\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`branches_updated_at_idx\` ON \`branches\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`branches_created_at_idx\` ON \`branches\` (\`created_at\`);`)
}
