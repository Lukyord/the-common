import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`branch_locations_thonglor\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`branch_locations_saladaeng\` text;`)
  await db.run(sql`ALTER TABLE \`whats_on\` ADD \`branch_locations_cloud11\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`branch_locations_thonglor\`;`)
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`branch_locations_saladaeng\`;`)
  await db.run(sql`ALTER TABLE \`whats_on\` DROP COLUMN \`branch_locations_cloud11\`;`)
}
