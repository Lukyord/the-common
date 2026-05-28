import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_awards_media_with_link\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`about_awards_media_with_link_order_idx\` ON \`about_awards_media_with_link\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_awards_media_with_link_parent_id_idx\` ON \`about_awards_media_with_link\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`about_awards_media_with_link_media_idx\` ON \`about_awards_media_with_link\` (\`media_id\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_awards_media_with_link\`;`)
}
