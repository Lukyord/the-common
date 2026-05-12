import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20260512_070147_contact from './20260512_070147_contact';
import * as migration_20260512_070814_lifestyle from './20260512_070814_lifestyle';
import * as migration_20260512_073350 from './20260512_073350';
import * as migration_20260512_080500_homepage from './20260512_080500_homepage';
import * as migration_20260512_083303 from './20260512_083303';
import * as migration_20260512_090911 from './20260512_090911';
import * as migration_20260512_095655 from './20260512_095655';

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
    name: '20260512_095655'
  },
];
