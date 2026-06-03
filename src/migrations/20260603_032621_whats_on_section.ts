import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`whats_on_gallery\`;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`whats_on_section_title\` text;`)
  await db.run(
    sql`ALTER TABLE \`branches\` ADD \`whats_on_section_display_type\` text DEFAULT 'latest';`,
  )
  await db.run(
    sql`ALTER TABLE \`branches_rels\` ADD \`whats_on_id\` integer REFERENCES whats_on(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`branches_rels_whats_on_id_idx\` ON \`branches_rels\` (\`whats_on_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`whats_on_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(
    sql`CREATE INDEX \`whats_on_rels_media_id_idx\` ON \`whats_on_rels\` (\`media_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`whats_on_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer NOT NULL,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`whats_on_gallery_order_idx\` ON \`whats_on_gallery\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_gallery_parent_id_idx\` ON \`whats_on_gallery\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`whats_on_gallery_media_idx\` ON \`whats_on_gallery\` (\`media_id\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branches_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`vendors_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`vendors_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_branches_rels\`("id", "order", "parent_id", "path", "vendors_id") SELECT "id", "order", "parent_id", "path", "vendors_id" FROM \`branches_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`branches_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_branches_rels\` RENAME TO \`branches_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`branches_rels_order_idx\` ON \`branches_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`branches_rels_parent_idx\` ON \`branches_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`branches_rels_path_idx\` ON \`branches_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`branches_rels_vendors_id_idx\` ON \`branches_rels\` (\`vendors_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`__new_whats_on_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`branches_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`whats_on\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`branches_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_whats_on_rels\`("id", "order", "parent_id", "path", "branches_id") SELECT "id", "order", "parent_id", "path", "branches_id" FROM \`whats_on_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`whats_on_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_whats_on_rels\` RENAME TO \`whats_on_rels\`;`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_order_idx\` ON \`whats_on_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_parent_idx\` ON \`whats_on_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`whats_on_rels_path_idx\` ON \`whats_on_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`whats_on_rels_branches_id_idx\` ON \`whats_on_rels\` (\`branches_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`whats_on_section_title\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`whats_on_section_display_type\`;`)
}
