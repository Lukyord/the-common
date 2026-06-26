import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` ADD \`social_instagram\` text;`)
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` ADD \`social_facebook\` text;`)
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` ADD \`social_line\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` DROP COLUMN \`social_instagram\`;`)
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` DROP COLUMN \`social_facebook\`;`)
  await db.run(sql`ALTER TABLE \`branch_contact_pages\` DROP COLUMN \`social_line\`;`)
}
