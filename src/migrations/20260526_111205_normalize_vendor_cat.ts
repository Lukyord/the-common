import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`vendor_categories_category_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`vendor_categories\` DROP COLUMN \`category_id\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`vendor_categories\` ADD \`category_id\` text NOT NULL;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`vendor_categories_category_id_idx\` ON \`vendor_categories\` (\`category_id\`);`,
  )
}
