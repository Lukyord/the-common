import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`branch_whats_on_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`whats_on_main_tags_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`branch_whats_on_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`whats_on_main_tags_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_order_idx\` ON \`branch_whats_on_pages_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_parent_idx\` ON \`branch_whats_on_pages_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_path_idx\` ON \`branch_whats_on_pages_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_rels_whats_on_main_tags_id_idx\` ON \`branch_whats_on_pages_rels\` (\`whats_on_main_tags_id\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branch_whats_on_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`landing_title\` text,
  	\`latest_title\` text,
  	\`latest_background\` text,
  	\`latest_all_branches_background\` text,
  	\`club_title\` text,
  	\`club_main_tag_id\` integer,
  	\`all_events_and_workshops_title\` text,
  	\`all_events_and_workshops_background\` text,
  	\`all_events_and_workshops_event_archive_background\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`club_main_tag_id\`) REFERENCES \`whats_on_main_tags\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_branch_whats_on_pages\`("id", "title", "branch_id", "landing_title", "latest_title", "latest_background", "latest_all_branches_background", "club_title", "club_main_tag_id", "all_events_and_workshops_title", "all_events_and_workshops_background", "all_events_and_workshops_event_archive_background", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "branch_id", "landing_title", "latest_title", "latest_background", "latest_all_branches_background", "club_title", "club_main_tag_id", "all_events_and_workshops_title", "all_events_and_workshops_background", "all_events_and_workshops_event_archive_background", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`branch_whats_on_pages\`;`,
  )
  await db.run(sql`DROP TABLE \`branch_whats_on_pages\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_branch_whats_on_pages\` RENAME TO \`branch_whats_on_pages\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`branch_whats_on_pages_branch_idx\` ON \`branch_whats_on_pages\` (\`branch_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_club_club_main_tag_idx\` ON \`branch_whats_on_pages\` (\`club_main_tag_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_meta_meta_image_idx\` ON \`branch_whats_on_pages\` (\`meta_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_updated_at_idx\` ON \`branch_whats_on_pages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_created_at_idx\` ON \`branch_whats_on_pages\` (\`created_at\`);`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branch_whats_on_pages_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` ADD \`all_events_and_workshops_main_tag_id\` integer REFERENCES whats_on_main_tags(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_whats_on_pages_all_events_and_workshops_all_event_idx\` ON \`branch_whats_on_pages\` (\`all_events_and_workshops_main_tag_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`all_events_and_workshops_background\`;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_whats_on_pages\` DROP COLUMN \`all_events_and_workshops_event_archive_background\`;`,
  )
}
