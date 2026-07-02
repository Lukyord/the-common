import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branches\` ADD \`vibes_check_title_color\` text;`)
  await db.run(sql`ALTER TABLE \`branches\` ADD \`vibes_check_title_bg_color\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`vibes_check_title_color\`;`)
  await db.run(sql`ALTER TABLE \`branches\` DROP COLUMN \`vibes_check_title_bg_color\`;`)
}
