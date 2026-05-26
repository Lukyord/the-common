import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` ADD \`text\` text;`)
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` ADD \`bg_color\` text;`)
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` ADD \`text_color\` text;`)
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` DROP COLUMN \`hex_code\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` ADD \`hex_code\` text;`)
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` DROP COLUMN \`text\`;`)
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` DROP COLUMN \`bg_color\`;`)
  await db.run(sql`ALTER TABLE \`homepage_about_sticky_notes\` DROP COLUMN \`text_color\`;`)
}
