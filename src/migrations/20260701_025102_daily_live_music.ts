import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`daily_live_music_title\` text;`)
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages_rels\` ADD \`media_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_media_id_idx\` ON \`branch_whats_on_pages_rels\` (\`media_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branch_whats_on_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`whats_on_main_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`branch_whats_on_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_main_tags_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_branch_whats_on_pages_rels\`("id", "order", "parent_id", "path", "whats_on_main_tags_id") SELECT "id", "order", "parent_id", "path", "whats_on_main_tags_id" FROM \`branch_whats_on_pages_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`branch_whats_on_pages_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_branch_whats_on_pages_rels\` RENAME TO \`branch_whats_on_pages_rels\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_order_idx\` ON \`branch_whats_on_pages_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_parent_idx\` ON \`branch_whats_on_pages_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_path_idx\` ON \`branch_whats_on_pages_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_whats_on_main_tags_id_idx\` ON \`branch_whats_on_pages_rels\` (\`whats_on_main_tags_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`daily_live_music_title\`;`)
}
