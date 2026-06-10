import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`default_map_tile_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`active_map_tile_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`pin_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`background_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`text_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`delivery_title\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`grab_link\` text;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` ADD \`lineman_link\` text;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`default_map_tile_color\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`active_map_tile_color\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`pin_color\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`background_color\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`text_color\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`delivery_title\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`grab_link\`;`)
  await db.run(sql`ALTER TABLE \`branch_vendor_pages\` DROP COLUMN \`lineman_link\`;`)
}
