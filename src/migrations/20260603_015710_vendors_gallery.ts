import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`vendors_rels\` ADD \`media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_media_id_idx\` ON \`vendors_rels\` (\`media_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_vendors_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`lifestyle_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`vendors\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`lifestyle_id\`) REFERENCES \`lifestyle\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_vendors_rels\`("id", "order", "parent_id", "path", "lifestyle_id") SELECT "id", "order", "parent_id", "path", "lifestyle_id" FROM \`vendors_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`vendors_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_vendors_rels\` RENAME TO \`vendors_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`vendors_rels_order_idx\` ON \`vendors_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_parent_idx\` ON \`vendors_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`vendors_rels_path_idx\` ON \`vendors_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`vendors_rels_lifestyle_id_idx\` ON \`vendors_rels\` (\`lifestyle_id\`);`,
  )
}
