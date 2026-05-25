import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage_membership\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`button_text\` text,
  	\`button_link\` text,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_membership_order_idx\` ON \`homepage_membership\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_membership_parent_id_idx\` ON \`homepage_membership\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_membership_media_idx\` ON \`homepage_membership\` (\`media_id\`);`)
  await db.run(sql`DROP TABLE \`homepage_membership_card_media\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`membership_title\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`membership_description\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`membership_button_text\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` DROP COLUMN \`membership_button_link\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`homepage_membership_card_media\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_membership_card_media_order_idx\` ON \`homepage_membership_card_media\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_membership_card_media_parent_id_idx\` ON \`homepage_membership_card_media\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`homepage_membership_card_media_media_idx\` ON \`homepage_membership_card_media\` (\`media_id\`);`)
  await db.run(sql`DROP TABLE \`homepage_membership\`;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`membership_title\` text;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`membership_description\` text;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`membership_button_text\` text;`)
  await db.run(sql`ALTER TABLE \`homepage\` ADD \`membership_button_link\` text;`)
}
