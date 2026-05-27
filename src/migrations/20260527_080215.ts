import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`social_facebook\` text;`)
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`social_instagram\` text;`)
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`social_grab\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`vendors\` DROP COLUMN \`social_facebook\`;`)
  await db.run(sql`ALTER TABLE \`vendors\` DROP COLUMN \`social_instagram\`;`)
  await db.run(sql`ALTER TABLE \`vendors\` DROP COLUMN \`social_grab\`;`)
}
