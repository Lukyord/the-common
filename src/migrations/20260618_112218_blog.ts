import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`blogs_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`branches_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blogs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branches_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blogs_rels_order_idx\` ON \`blogs_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`blogs_rels_parent_idx\` ON \`blogs_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blogs_rels_path_idx\` ON \`blogs_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`blogs_rels_branches_id_idx\` ON \`blogs_rels\` (\`branches_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`blogs_rels_media_id_idx\` ON \`blogs_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_background_media_id\` integer,
  	\`hero_mobile_background_media_id\` integer,
  	\`hero_title\` text,
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
    sql`CREATE INDEX \`blog_page_hero_hero_background_media_idx\` ON \`blog_page\` (\`hero_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`blog_page_hero_hero_mobile_background_media_idx\` ON \`blog_page\` (\`hero_mobile_background_media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`blog_page_meta_meta_image_idx\` ON \`blog_page\` (\`meta_image_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`branch_locations_thonglor\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`branch_locations_saladaeng\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`branch_locations_cloud11\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`published_date\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`date_to_be_archived\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`button_text\` text;`)
  await db.run(sql`ALTER TABLE \`blogs\` ADD \`button_link\` text;`)
  await db.run(sql`CREATE INDEX \`blogs_media_idx\` ON \`blogs\` (\`media_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`blogs_rels\`;`)
  await db.run(sql`DROP TABLE \`blog_page\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_blogs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
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
    sql`INSERT INTO \`__new_blogs\`("id", "title", "slug", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`blogs\`;`,
  )
  await db.run(sql`DROP TABLE \`blogs\`;`)
  await db.run(sql`ALTER TABLE \`__new_blogs\` RENAME TO \`blogs\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`blogs_slug_idx\` ON \`blogs\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blogs_meta_meta_image_idx\` ON \`blogs\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blogs_updated_at_idx\` ON \`blogs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blogs_created_at_idx\` ON \`blogs\` (\`created_at\`);`)
}
