import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`about_awards_media_with_link\` ADD \`link\` text;`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`awards_title\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`about_awards_media_with_link\` DROP COLUMN \`link\`;`)
  await db.run(sql`ALTER TABLE \`about\` DROP COLUMN \`awards_title\`;`)
}
