import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages_venues\` ADD \`show\` integer DEFAULT true;`,
  )
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages_venues\` ADD \`form_option_name\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`rate_text_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`promo_text_color\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages_venues\` DROP COLUMN \`show\`;`)
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages_venues\` DROP COLUMN \`form_option_name\`;`,
  )
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` DROP COLUMN \`rate_text_color\`;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` DROP COLUMN \`promo_text_color\`;`)
}
