import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260512_070147_contact from './20260512_070147_contact';
import * as migration_20260512_070814_lifestyle from './20260512_070814_lifestyle';
import * as migration_20260512_073350 from './20260512_073350';
import * as migration_20260512_080500_homepage from './20260512_080500_homepage';
import * as migration_20260512_083303 from './20260512_083303';
import * as migration_20260512_090911 from './20260512_090911';
import * as migration_20260512_095655 from './20260512_095655';
import * as migration_20260513_145604_contact_accordion from './20260513_145604_contact_accordion';
import * as migration_20260515_001957 from './20260515_001957';
import * as migration_20260519_061819 from './20260519_061819';
import * as migration_20260521_100611_branch_branding_fields from './20260521_100611_branch_branding_fields';
import * as migration_20260522_051321 from './20260522_051321';
import * as migration_20260522_093131_homepage_flexible_section_fields from './20260522_093131_homepage_flexible_section_fields';
import * as migration_20260525_080751_homepage_membership from './20260525_080751_homepage_membership';
import * as migration_20260526_093848 from './20260526_093848';
import * as migration_20260526_102848 from './20260526_102848';
import * as migration_20260526_110104 from './20260526_110104';
import * as migration_20260526_111205_normalize_vendor_cat from './20260526_111205_normalize_vendor_cat';
import * as migration_20260527_080215 from './20260527_080215';
import * as migration_20260527_111505 from './20260527_111505';
import * as migration_20260528_054351_about_info_title from './20260528_054351_about_info_title';
import * as migration_20260528_111107 from './20260528_111107';
import * as migration_20260529_075225 from './20260529_075225';
import * as migration_20260529_092424 from './20260529_092424';
import * as migration_20260529_101546_privacy_policy_global from './20260529_101546_privacy_policy_global';
import * as migration_20260601_131438_contact_bg from './20260601_131438_contact_bg';
import * as migration_20260601_153356_contact_accordion from './20260601_153356_contact_accordion';
import * as migration_20260602_113513 from './20260602_113513';
import * as migration_20260603_015121_whats_on_fields from './20260603_015121_whats_on_fields';
import * as migration_20260603_015710_vendors_gallery from './20260603_015710_vendors_gallery';
import * as migration_20260603_021749_whats_on_branch_has_many from './20260603_021749_whats_on_branch_has_many';
import * as migration_20260603_032621_whats_on_section from './20260603_032621_whats_on_section';
import * as migration_20260603_062945_whats_on_tags from './20260603_062945_whats_on_tags';
import * as migration_20260603_104605_barnch_whats_on from './20260603_104605_barnch_whats_on';
import * as migration_20260604_082841_vendor_category_has_many from './20260604_082841_vendor_category_has_many';
import * as migration_20260604_105037_barnch_about_words from './20260604_105037_barnch_about_words';
import * as migration_20260605_080703_branch_whats_on_all_events from './20260605_080703_branch_whats_on_all_events';
import * as migration_20260608_074823 from './20260608_074823';
import * as migration_20260608_095619_sticky_note_media from './20260608_095619_sticky_note_media';
import * as migration_20260609_051918 from './20260609_051918';
import * as migration_20260609_091637 from './20260609_091637';
import * as migration_20260610_054900 from './20260610_054900';
import * as migration_20260610_081621 from './20260610_081621';
import * as migration_20260617_093640 from './20260617_093640';
import * as migration_20260618_081430_moode_presentence_mobile from './20260618_081430_moode_presentence_mobile';
import * as migration_20260618_112218_blog from './20260618_112218_blog';
import * as migration_20260623_045224_brand_space_rental_page from './20260623_045224_brand_space_rental_page';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20260512_070147_contact.up,
    down: migration_20260512_070147_contact.down,
    name: '20260512_070147_contact',
  },
  {
    up: migration_20260512_070814_lifestyle.up,
    down: migration_20260512_070814_lifestyle.down,
    name: '20260512_070814_lifestyle',
  },
  {
    up: migration_20260512_073350.up,
    down: migration_20260512_073350.down,
    name: '20260512_073350',
  },
  {
    up: migration_20260512_080500_homepage.up,
    down: migration_20260512_080500_homepage.down,
    name: '20260512_080500_homepage',
  },
  {
    up: migration_20260512_083303.up,
    down: migration_20260512_083303.down,
    name: '20260512_083303',
  },
  {
    up: migration_20260512_090911.up,
    down: migration_20260512_090911.down,
    name: '20260512_090911',
  },
  {
    up: migration_20260512_095655.up,
    down: migration_20260512_095655.down,
    name: '20260512_095655',
  },
  {
    up: migration_20260513_145604_contact_accordion.up,
    down: migration_20260513_145604_contact_accordion.down,
    name: '20260513_145604_contact_accordion',
  },
  {
    up: migration_20260515_001957.up,
    down: migration_20260515_001957.down,
    name: '20260515_001957',
  },
  {
    up: migration_20260519_061819.up,
    down: migration_20260519_061819.down,
    name: '20260519_061819',
  },
  {
    up: migration_20260521_100611_branch_branding_fields.up,
    down: migration_20260521_100611_branch_branding_fields.down,
    name: '20260521_100611_branch_branding_fields',
  },
  {
    up: migration_20260522_051321.up,
    down: migration_20260522_051321.down,
    name: '20260522_051321',
  },
  {
    up: migration_20260522_093131_homepage_flexible_section_fields.up,
    down: migration_20260522_093131_homepage_flexible_section_fields.down,
    name: '20260522_093131_homepage_flexible_section_fields',
  },
  {
    up: migration_20260525_080751_homepage_membership.up,
    down: migration_20260525_080751_homepage_membership.down,
    name: '20260525_080751_homepage_membership',
  },
  {
    up: migration_20260526_093848.up,
    down: migration_20260526_093848.down,
    name: '20260526_093848',
  },
  {
    up: migration_20260526_102848.up,
    down: migration_20260526_102848.down,
    name: '20260526_102848',
  },
  {
    up: migration_20260526_110104.up,
    down: migration_20260526_110104.down,
    name: '20260526_110104',
  },
  {
    up: migration_20260526_111205_normalize_vendor_cat.up,
    down: migration_20260526_111205_normalize_vendor_cat.down,
    name: '20260526_111205_normalize_vendor_cat',
  },
  {
    up: migration_20260527_080215.up,
    down: migration_20260527_080215.down,
    name: '20260527_080215',
  },
  {
    up: migration_20260527_111505.up,
    down: migration_20260527_111505.down,
    name: '20260527_111505',
  },
  {
    up: migration_20260528_054351_about_info_title.up,
    down: migration_20260528_054351_about_info_title.down,
    name: '20260528_054351_about_info_title',
  },
  {
    up: migration_20260528_111107.up,
    down: migration_20260528_111107.down,
    name: '20260528_111107',
  },
  {
    up: migration_20260529_075225.up,
    down: migration_20260529_075225.down,
    name: '20260529_075225',
  },
  {
    up: migration_20260529_092424.up,
    down: migration_20260529_092424.down,
    name: '20260529_092424',
  },
  {
    up: migration_20260529_101546_privacy_policy_global.up,
    down: migration_20260529_101546_privacy_policy_global.down,
    name: '20260529_101546_privacy_policy_global',
  },
  {
    up: migration_20260601_131438_contact_bg.up,
    down: migration_20260601_131438_contact_bg.down,
    name: '20260601_131438_contact_bg',
  },
  {
    up: migration_20260601_153356_contact_accordion.up,
    down: migration_20260601_153356_contact_accordion.down,
    name: '20260601_153356_contact_accordion',
  },
  {
    up: migration_20260602_113513.up,
    down: migration_20260602_113513.down,
    name: '20260602_113513',
  },
  {
    up: migration_20260603_015121_whats_on_fields.up,
    down: migration_20260603_015121_whats_on_fields.down,
    name: '20260603_015121_whats_on_fields',
  },
  {
    up: migration_20260603_015710_vendors_gallery.up,
    down: migration_20260603_015710_vendors_gallery.down,
    name: '20260603_015710_vendors_gallery',
  },
  {
    up: migration_20260603_021749_whats_on_branch_has_many.up,
    down: migration_20260603_021749_whats_on_branch_has_many.down,
    name: '20260603_021749_whats_on_branch_has_many',
  },
  {
    up: migration_20260603_032621_whats_on_section.up,
    down: migration_20260603_032621_whats_on_section.down,
    name: '20260603_032621_whats_on_section',
  },
  {
    up: migration_20260603_062945_whats_on_tags.up,
    down: migration_20260603_062945_whats_on_tags.down,
    name: '20260603_062945_whats_on_tags',
  },
  {
    up: migration_20260603_104605_barnch_whats_on.up,
    down: migration_20260603_104605_barnch_whats_on.down,
    name: '20260603_104605_barnch_whats_on',
  },
  {
    up: migration_20260604_082841_vendor_category_has_many.up,
    down: migration_20260604_082841_vendor_category_has_many.down,
    name: '20260604_082841_vendor_category_has_many',
  },
  {
    up: migration_20260604_105037_barnch_about_words.up,
    down: migration_20260604_105037_barnch_about_words.down,
    name: '20260604_105037_barnch_about_words',
  },
  {
    up: migration_20260605_080703_branch_whats_on_all_events.up,
    down: migration_20260605_080703_branch_whats_on_all_events.down,
    name: '20260605_080703_branch_whats_on_all_events',
  },
  {
    up: migration_20260608_074823.up,
    down: migration_20260608_074823.down,
    name: '20260608_074823',
  },
  {
    up: migration_20260608_095619_sticky_note_media.up,
    down: migration_20260608_095619_sticky_note_media.down,
    name: '20260608_095619_sticky_note_media',
  },
  {
    up: migration_20260609_051918.up,
    down: migration_20260609_051918.down,
    name: '20260609_051918',
  },
  {
    up: migration_20260609_091637.up,
    down: migration_20260609_091637.down,
    name: '20260609_091637',
  },
  {
    up: migration_20260610_054900.up,
    down: migration_20260610_054900.down,
    name: '20260610_054900',
  },
  {
    up: migration_20260610_081621.up,
    down: migration_20260610_081621.down,
    name: '20260610_081621',
  },
  {
    up: migration_20260617_093640.up,
    down: migration_20260617_093640.down,
    name: '20260617_093640',
  },
  {
    up: migration_20260618_081430_moode_presentence_mobile.up,
    down: migration_20260618_081430_moode_presentence_mobile.down,
    name: '20260618_081430_moode_presentence_mobile',
  },
  {
    up: migration_20260618_112218_blog.up,
    down: migration_20260618_112218_blog.down,
    name: '20260618_112218_blog',
  },
  {
    up: migration_20260623_045224_brand_space_rental_page.up,
    down: migration_20260623_045224_brand_space_rental_page.down,
    name: '20260623_045224_brand_space_rental_page'
  },
];
