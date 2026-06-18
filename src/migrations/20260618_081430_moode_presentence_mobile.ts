import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`homepage\` ADD \`what_are_you_in_the_mood_for_pre_sentence_mobile\` text;`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`homepage\` DROP COLUMN \`what_are_you_in_the_mood_for_pre_sentence_mobile\`;`,
  )
}
