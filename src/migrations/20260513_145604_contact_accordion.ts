import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`contact_blocks_double_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`rich_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_blocks_double_column_order_idx\` ON \`contact_blocks_double_column\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_blocks_double_column_parent_id_idx\` ON \`contact_blocks_double_column\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_blocks_double_column_path_idx\` ON \`contact_blocks_double_column\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`contact_blocks_single_column\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rich_text\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_blocks_single_column_order_idx\` ON \`contact_blocks_single_column\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_blocks_single_column_parent_id_idx\` ON \`contact_blocks_single_column\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_blocks_single_column_path_idx\` ON \`contact_blocks_single_column\` (\`_path\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`contact_blocks_double_column\`;`)
  await db.run(sql`DROP TABLE \`contact_blocks_single_column\`;`)
}
