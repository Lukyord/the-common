import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branches\` ADD \`tel\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`footer_bg\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`footer_color\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`find_us\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`opening_hours\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`parking_options\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`tel\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`footer_bg\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`footer_color\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`find_us\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`opening_hours\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`parking_options\`;`)
}
