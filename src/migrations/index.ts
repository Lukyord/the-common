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
    name: '20260526_111205_normalize_vendor_cat'
  },
];
