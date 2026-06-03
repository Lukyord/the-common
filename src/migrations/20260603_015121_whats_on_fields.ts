import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`whats_on_gallery_order_idx\` ON \`whats_on_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_gallery_parent_id_idx\` ON \`whats_on_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_gallery_media_idx\` ON \`whats_on_gallery\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`whats_on_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`whats_on_texts_order_parent\` ON \`whats_on_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`date_to_be_archived\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`bg_color\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`date\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`time\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`main_tag\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`highlight_text_enabled\` integer;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`highlight_text_text\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`button_text\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`button_link\` text;`)
  await db.run(sql`CREATE INDEX \`whats_on_media_idx\` ON \`whats_on\` (\`media_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`whats_on_gallery\`;`)
  await db.run(sql`DROP TABLE \`whats_on_texts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_whats_on\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_whats_on\`("id", "title", "slug", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`whats_on\`;`)
  await db.run(sql`DROP TABLE \`whats_on\`;`)
  await db.run(sql`ALTER TABLE \`__new_whats_on\` RENAME TO \`whats_on\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`whats_on_slug_idx\` ON \`whats_on\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_branch_idx\` ON \`whats_on\` (\`branch_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_meta_meta_image_idx\` ON \`whats_on\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_updated_at_idx\` ON \`whats_on\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_created_at_idx\` ON \`whats_on\` (\`created_at\`);`)
}
