import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`contact_blocks_double_column_columns\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`rich_text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_blocks_double_column\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`contact_blocks_double_column_columns_order_idx\` ON \`contact_blocks_double_column_columns\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`contact_blocks_double_column_columns_parent_id_idx\` ON \`contact_blocks_double_column_columns\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`contact_blocks_single_column\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_single_column\` ADD \`button_text\` text;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_single_column\` ADD \`link\` text;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_double_column\` DROP COLUMN \`rich_text\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`contact_blocks_double_column_columns\`;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_double_column\` ADD \`rich_text\` text;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_single_column\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_single_column\` DROP COLUMN \`button_text\`;`)
  await db.run(sql`ALTER TABLE \`contact_blocks_single_column\` DROP COLUMN \`link\`;`)
}
