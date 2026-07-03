export type HeaderLocationContext = 'brand' | 'thonglor' | 'saladaeng' | 'cloud-11'
export type HeaderLocationTarget = HeaderLocationContext

const BRANCH_TARGETS = [
  'thonglor',
  'saladaeng',
  'cloud-11',
] as const satisfies readonly HeaderLocationTarget[]

export function isHeaderLocationTarget(slug: string): slug is HeaderLocationTarget {
  return slug === 'brand' || (BRANCH_TARGETS as readonly string[]).includes(slug)
}

export function getHeaderLocationSelectorContext(slug: string | undefined): HeaderLocationContext {
  if (slug === 'thonglor' || slug === 'saladaeng' || slug === 'cloud-11') return slug
  return 'brand'
}

/**
 * Colors for each location item in the mobile header selector.
 * Outer key: branch/page the user is currently on.
 * Inner key: location row or trigger being rendered (`brand` = All locations).
 */
export type LocationThemeColors = {
  iconColor: string
  titleColor: string
  textColor: string
}

export const HEADER_LOCATION_SELECTOR_THEMES: Record<
  HeaderLocationContext,
  Record<HeaderLocationTarget, LocationThemeColors>
> = {
  brand: {
    brand: {
      iconColor: 'var(--color-beige)',
      titleColor: 'var(--color-beige)',
      textColor: 'var(--color-beige)',
    },
    thonglor: {
      iconColor: 'var(--color-thonglor-cyan)',
      titleColor: 'var(--color-thonglor-cyan)',
      textColor: 'var(--color-beige)',
    },
    saladaeng: {
      iconColor: 'var(--color-saladaeng-orange)',
      titleColor: 'var(--color-saladaeng-orange)',
      textColor: 'var(--color-beige)',
    },
    'cloud-11': {
      iconColor: 'var(--color-cloud-11-pink)',
      titleColor: 'var(--color-cloud-11-pink)',
      textColor: 'var(--color-beige)',
    },
  },
  thonglor: {
    brand: {
      iconColor: 'var(--color-dark-brown)',
      titleColor: 'var(--color-dark-brown)',
      textColor: 'var(--color-dark-brown)',
    },
    thonglor: {
      iconColor: 'var(--color-thonglor-navy)',
      titleColor: 'var(--color-dark-brown)',
      textColor: 'var(--color-thonglor-navy)',
    },
    saladaeng: {
      iconColor: 'var(--color-saladaeng-orange)',
      titleColor: 'var(--color-saladaeng-orange)',
      textColor: 'var(--color-dark-brown)',
    },
    'cloud-11': {
      iconColor: 'var(--color-cloud-11-pink)',
      titleColor: 'var(--color-cloud-11-pink)',
      textColor: 'var(--color-dark-brown)',
    },
  },
  saladaeng: {
    brand: {
      iconColor: 'var(--color-dark-brown)',
      titleColor: 'var(--color-dark-brown)',
      textColor: 'var(--color-dark-brown)',
    },
    thonglor: {
      iconColor: 'var(--color-thonglor-navy)',
      titleColor: 'var(--color-thonglor-navy)',
      textColor: 'var(--color-dark-brown)',
    },
    saladaeng: {
      iconColor: 'var(--color-saladaeng-accent)',
      titleColor: 'var(--color-dark-brown)',
      textColor: 'var(--color-thonglor-navy)',
    },
    'cloud-11': {
      iconColor: 'var(--color-cloud-11-pink)',
      titleColor: 'var(--color-cloud-11-pink)',
      textColor: 'var(--color-dark-brown)',
    },
  },
  'cloud-11': {
    brand: {
      iconColor: 'var(--color-beige)',
      titleColor: 'var(--color-beige)',
      textColor: 'var(--color-beige)',
    },
    thonglor: {
      iconColor: 'var(--color-thonglor-cyan)',
      titleColor: 'var(--color-thonglor-cyan)',
      textColor: 'var(--color-white)',
    },
    saladaeng: {
      iconColor: 'var(--color-saladaeng-orange)',
      titleColor: 'var(--color-saladaeng-orange)',
      textColor: 'var(--color-white)',
    },
    'cloud-11': {
      iconColor: 'var(--color-cloud-11-pink)',
      titleColor: 'var(--color-cloud-11-pink)',
      textColor: 'var(--color-cloud-11-pink)',
    },
  },
}

export function getHeaderLocationSelectorColors(
  context: HeaderLocationContext,
  target: HeaderLocationTarget,
): LocationThemeColors {
  return HEADER_LOCATION_SELECTOR_THEMES[context][target]
}
