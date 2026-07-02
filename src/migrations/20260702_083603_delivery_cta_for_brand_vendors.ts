import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages_landing_cards\` ADD \`color\` text;`)
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`latest_all_branches_text_color\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`all_events_and_workshops_event_archive_text_color\` text;`,
  )
  await db.run(sql`ALTER TABLE \`vendors_page\` ADD \`background_color\` text;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` ADD \`text_color\` text;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` ADD \`delivery_title\` text;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` ADD \`grab_link\` text;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` ADD \`lineman_link\` text;`)
  await db.run(
    sql`ALTER TABLE \`whats_on_page\` ADD \`all_events_and_workshops_event_archive_text_color\` text;`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_whats_on_pages_landing_cards\` DROP COLUMN \`color\`;`)
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`latest_all_branches_text_color\`;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`all_events_and_workshops_event_archive_text_color\`;`,
  )
  await db.run(sql`ALTER TABLE \`vendors_page\` DROP COLUMN \`background_color\`;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` DROP COLUMN \`text_color\`;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` DROP COLUMN \`delivery_title\`;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` DROP COLUMN \`grab_link\`;`)
  await db.run(sql`ALTER TABLE \`vendors_page\` DROP COLUMN \`lineman_link\`;`)
  await db.run(
    sql`ALTER TABLE \`whats_on_page\` DROP COLUMN \`all_events_and_workshops_event_archive_text_color\`;`,
  )
}
