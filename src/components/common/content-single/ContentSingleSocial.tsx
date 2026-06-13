import Link from 'next/link'

import type { ContentSingleSocialLink } from './types'

type ContentSingleSocialProps = {
  links: ContentSingleSocialLink[]
}

export default function ContentSingleSocial({ links }: ContentSingleSocialProps) {
  if (!links.length) return null

  return (
    <div className="content-single-social">
      {links.map(({ key, href, icon, label, className }) => (
        <Link
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={className}
        >
          <i className={`ic ${icon}`} aria-hidden />
        </Link>
      ))}
    </div>
  )
}
