import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_venues_venue_description\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_venue_description_order_idx\` ON \`branch_venue_rental_pages_venues_venue_description\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_venue_description_parent_id_idx\` ON \`branch_venue_rental_pages_venues_venue_description\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_venues_venue_amenities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_venue_amenities_order_idx\` ON \`branch_venue_rental_pages_venues_venue_amenities\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_venue_amenities_parent_id_idx\` ON \`branch_venue_rental_pages_venues_venue_amenities\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_venues_other_amenities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_other_amenities_order_idx\` ON \`branch_venue_rental_pages_venues_other_amenities\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_other_amenities_parent_id_idx\` ON \`branch_venue_rental_pages_venues_other_amenities\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_venues_additional_fee\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_additional_fee_order_idx\` ON \`branch_venue_rental_pages_venues_additional_fee\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_additional_fee_parent_id_idx\` ON \`branch_venue_rental_pages_venues_additional_fee\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_venues_staff_fee_info\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_staff_fee_info_order_idx\` ON \`branch_venue_rental_pages_venues_staff_fee_info\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_staff_fee_info_parent_id_idx\` ON \`branch_venue_rental_pages_venues_staff_fee_info\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_venues\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`button_bg_color\` text,
  	\`button_text_color\` text,
  	\`amenities_description\` text,
  	\`information_area\` text,
  	\`information_number_of_people\` text,
  	\`staff_fee_title\` text,
  	\`cta_cta_text\` text,
  	\`cta_cta_link\` text,
  	\`cta_button_bg_color\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_order_idx\` ON \`branch_venue_rental_pages_venues\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venues_parent_id_idx\` ON \`branch_venue_rental_pages_venues\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_rate_cnt_cols_cells\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_rate_cnt_cols\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rate_cnt_cols_cells_order_idx\` ON \`branch_venue_rental_pages_rate_cnt_cols_cells\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rate_cnt_cols_cells_parent_id_idx\` ON \`branch_venue_rental_pages_rate_cnt_cols_cells\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_rate_cnt_cols\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rate_cnt_cols_order_idx\` ON \`branch_venue_rental_pages_rate_cnt_cols\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rate_cnt_cols_parent_id_idx\` ON \`branch_venue_rental_pages_rate_cnt_cols\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_promo_cnt_cols_cells\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages_promo_cnt_cols\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_promo_cnt_cols_cells_order_idx\` ON \`branch_venue_rental_pages_promo_cnt_cols_cells\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_promo_cnt_cols_cells_parent_id_idx\` ON \`branch_venue_rental_pages_promo_cnt_cols_cells\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_promo_cnt_cols\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`branch_venue_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_promo_cnt_cols_order_idx\` ON \`branch_venue_rental_pages_promo_cnt_cols\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_promo_cnt_cols_parent_id_idx\` ON \`branch_venue_rental_pages_promo_cnt_cols\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`branch_venue_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_texts_order_parent\` ON \`branch_venue_rental_pages_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`branch_venue_rental_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`branch_venue_rental_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rels_order_idx\` ON \`branch_venue_rental_pages_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rels_parent_idx\` ON \`branch_venue_rental_pages_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rels_path_idx\` ON \`branch_venue_rental_pages_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_rels_media_id_idx\` ON \`branch_venue_rental_pages_rels\` (\`media_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`branch_name\` text;`)
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_type\` text DEFAULT 'form';`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_form_selected_button_bg_color\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_form_selected_button_text_color\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_form_submit_button_bg_color\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_form_submit_white_text_on_hover\` integer DEFAULT false;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_form_submit_dark_brown_text_on_hover\` integer DEFAULT false;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_linkout_description\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_linkout_button_bg_color\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_linkout_button_text\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_linkout_button_link\` text;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`booking_cta_linkout_button_white_text_on_hover\` integer DEFAULT false;`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`landing_media_desktop_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`landing_media_mobile_id\` integer REFERENCES media(id);`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`venue_package_type\` text DEFAULT 'link';`,
  )
  await db.run(
    sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`venue_package_pdf_id\` integer REFERENCES media(id);`,
  )
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`venue_package_link\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`rate_title\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`rate_description\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`rate_background_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`rate_cnt_title\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`promo_title\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`promo_description\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`promo_background_color\` text;`)
  await db.run(sql`ALTER TABLE \`branch_venue_rental_pages\` ADD \`promo_cnt_title\` text;`)
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_landing_media_landing_media_de_idx\` ON \`branch_venue_rental_pages\` (\`landing_media_desktop_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_landing_media_landing_media_mo_idx\` ON \`branch_venue_rental_pages\` (\`landing_media_mobile_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_venue_package_venue_package_pd_idx\` ON \`branch_venue_rental_pages\` (\`venue_package_pdf_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`venue_rental_page_branch_groups\` ADD \`button_white_text_on_hover\` integer DEFAULT false;`,
  )
  await db.run(
    sql`ALTER TABLE \`venue_rental_page_branch_groups\` ADD \`button_dark_brown_text_on_hover\` integer DEFAULT false;`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_venues_venue_description\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_venues_venue_amenities\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_venues_other_amenities\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_venues_additional_fee\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_venues_staff_fee_info\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_venues\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_rate_cnt_cols_cells\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_rate_cnt_cols\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_promo_cnt_cols_cells\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_promo_cnt_cols\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_texts\`;`)
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_branch_venue_rental_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`branch_id\` integer NOT NULL,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`branch_id\`) REFERENCES \`branches\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_branch_venue_rental_pages\`("id", "title", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "branch_id", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`branch_venue_rental_pages\`;`,
  )
  await db.run(sql`DROP TABLE \`branch_venue_rental_pages\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_branch_venue_rental_pages\` RENAME TO \`branch_venue_rental_pages\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`branch_venue_rental_pages_branch_idx\` ON \`branch_venue_rental_pages\` (\`branch_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_meta_meta_image_idx\` ON \`branch_venue_rental_pages\` (\`meta_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_updated_at_idx\` ON \`branch_venue_rental_pages\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`branch_venue_rental_pages_created_at_idx\` ON \`branch_venue_rental_pages\` (\`created_at\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`venue_rental_page_branch_groups\` DROP COLUMN \`button_white_text_on_hover\`;`,
  )
  await db.run(
    sql`ALTER TABLE \`venue_rental_page_branch_groups\` DROP COLUMN \`button_dark_brown_text_on_hover\`;`,
  )
}
