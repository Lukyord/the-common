import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_sub_tags\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_sub_tags_order_idx\` ON \`whats_on_sub_tags\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_sub_tags_parent_idx\` ON \`whats_on_sub_tags\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`whats_on_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`branches_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branches_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`whats_on_rels_order_idx\` ON \`whats_on_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_parent_idx\` ON \`whats_on_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_path_idx\` ON \`whats_on_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`whats_on_rels_branches_id_idx\` ON \`whats_on_rels\` (\`branches_id\`);`,
  )
  await db.run(sql`DROP TABLE \`whats_on_texts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_whats_on\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`date_to_be_archived\` text,
  	\`media_id\` integer,
  	\`bg_color\` text,
  	\`date\` text,
  	\`time\` text,
  	\`main_tag\` text,
  	\`highlight_text_enabled\` integer,
  	\`highlight_text_text\` text,
  	\`content\` text,
  	\`button_text\` text,
  	\`button_link\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_whats_on\`("id", "title", "slug", "date_to_be_archived", "media_id", "bg_color", "date", "time", "main_tag", "highlight_text_enabled", "highlight_text_text", "content", "button_text", "button_link", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "date_to_be_archived", "media_id", "bg_color", "date", "time", "main_tag", "highlight_text_enabled", "highlight_text_text", "content", "button_text", "button_link", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`whats_on\`;`,
  )
  await db.run(sql`DROP TABLE \`whats_on\`;`)
  await db.run(sql`ALTER TABLE \`__new_whats_on\` RENAME TO \`whats_on\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`whats_on_slug_idx\` ON \`whats_on\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_media_idx\` ON \`whats_on\` (\`media_id\`);`)
  await db.run(
    sql`CREATE INDEX \`whats_on_meta_meta_image_idx\` ON \`whats_on\` (\`meta_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`whats_on_updated_at_idx\` ON \`whats_on\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_created_at_idx\` ON \`whats_on\` (\`created_at\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_texts_order_parent\` ON \`whats_on_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`DROP TABLE \`whats_on_sub_tags\`;`)
  await db.run(sql`DROP TABLE \`whats_on_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`whats_on\` ADD \`branch_id\` integer NOT NULL REFERENCES branches(id);`,
  )
  await db.run(sql`CREATE INDEX \`whats_on_branch_idx\` ON \`whats_on\` (\`branch_id\`);`)
}
