import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branches_floors\` ADD \`title\` text;`)
  await db.run(sql`ALTER TABLE \`branches_floors\` ADD \`description\` text;`)
  await db.run(sql`ALTER TABLE \`vendors\` DROP COLUMN \`floor_location\`;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`vendors\` ADD \`floor_location\` text;`)
  await db.run(sql`ALTER TABLE \`branches_floors\` DROP COLUMN \`title\`;`)
  await db.run(sql`ALTER TABLE \`branches_floors\` DROP COLUMN \`description\`;`)
}
