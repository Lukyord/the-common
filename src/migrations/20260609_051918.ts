import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`branch_contact_pages_blocks_double_column_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`rich_text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_contact_pages_blocks_double_column\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_double_column_columns_order_idx\` ON \`branch_contact_pages_blocks_double_column_columns\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_double_column_columns_parent_id_idx\` ON \`branch_contact_pages_blocks_double_column_columns\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_contact_pages_blocks_double_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_contact_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_double_column_order_idx\` ON \`branch_contact_pages_blocks_double_column\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_double_column_parent_id_idx\` ON \`branch_contact_pages_blocks_double_column\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_double_column_path_idx\` ON \`branch_contact_pages_blocks_double_column\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_contact_pages_blocks_single_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`rich_text\` text,
  	\`button_text\` text,
  	\`link\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_contact_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_single_column_order_idx\` ON \`branch_contact_pages_blocks_single_column\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_single_column_parent_id_idx\` ON \`branch_contact_pages_blocks_single_column\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_blocks_single_column_path_idx\` ON \`branch_contact_pages_blocks_single_column\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_contact_pages_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`branch_contact_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_texts_order_parent\` ON \`branch_contact_pages_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_contact_pages\` ADD \`contact_bg_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_contact_pages\` ADD \`contact_bg_mobile_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` ADD \`tel\` text;`)
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_contact_bg_idx\` ON \`branch_contact_pages\` (\`contact_bg_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_contact_bg_mobile_idx\` ON \`branch_contact_pages\` (\`contact_bg_mobile_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`homepage_membership\` ADD \`rich_text\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branch_contact_pages_blocks_double_column_columns\`;`)
  await db.run(sql`DROP TABLE \`branch_contact_pages_blocks_double_column\`;`)
  await db.run(sql`DROP TABLE \`branch_contact_pages_blocks_single_column\`;`)
  await db.run(sql`DROP TABLE \`branch_contact_pages_texts\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branch_contact_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
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
  await db.run(
    sql`INSERT INTO \`__new_branch_contact_pages\`("id", "title", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`branch_contact_pages\`;`,
  )
  await db.run(sql`DROP TABLE \`branch_contact_pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_branch_contact_pages\` RENAME TO \`branch_contact_pages\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`branch_contact_pages_branch_idx\` ON \`branch_contact_pages\` (\`branch_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_meta_meta_image_idx\` ON \`branch_contact_pages\` (\`meta_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_updated_at_idx\` ON \`branch_contact_pages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_contact_pages_created_at_idx\` ON \`branch_contact_pages\` (\`created_at\`);`,
  )
  await db.run(sql`ALTER TABLE \`homepage_membership\` DROP COLUMN \`rich_text\`;`)
}
