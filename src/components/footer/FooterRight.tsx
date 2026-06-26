import Link from 'next/link'

import AnimateOnScroll from '../common/animate-on-scroll'
import type { FooterContact } from './footer-types'
import { toExternalHref } from './footer-utils'

type FooterRightProps = {
  contact: FooterContact
  faqHref: string
}

export function FooterRight({ contact, faqHref }: FooterRightProps) {
  const kinnestHref = toExternalHref(contact.kinnestGroup)
  const instagramHref = toExternalHref(contact.instagram)
  const facebookHref = toExternalHref(contact.facebook)
  const lineHref = toExternalHref(contact.line)
  const hasSocial = Boolean(instagramHref || facebookHref || lineHref)

  return (
    <div className="footer-right">
      <div className="footer-links">
        {hasSocial && (
          <AnimateOnScroll triggerClass="fadeIn">
            <ul className="social">
              {instagramHref && (
                <li>
                  <Link href={instagramHref} target="_blank" rel="noopener noreferrer">
                    <i className="ic ic-instagram size-icon-lg"></i>
                  </Link>
                </li>
              )}
              {facebookHref && (
                <li>
                  <Link href={facebookHref} target="_blank" rel="noopener noreferrer">
                    <i className="ic ic-facebook size-icon-lg"></i>
                  </Link>
                </li>
              )}
              {lineHref && (
                <li className="line">
                  <Link href={lineHref} target="_blank" rel="noopener noreferrer">
                    <i className="ic ic-line size-icon-sm"></i>
                  </Link>
                </li>
              )}
            </ul>
          </AnimateOnScroll>
        )}

        {contact.kinnestGroup && kinnestHref && (
          <AnimateOnScroll triggerClass="fadeIn">
            <Link
              href={kinnestHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-hover type-d-text-link type-m-body-r letter-spacing-003"
            >
              A Member of Kinnest Group
            </Link>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll triggerClass="fadeIn">
          <Link
            href="/privacy-policy"
            className="underline-hover type-d-text-link type-m-body-r letter-spacing-003"
          >
            Privacy Policy
          </Link>
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeIn">
          <Link
            href={faqHref}
            className="underline-hover type-d-text-link type-m-body-r letter-spacing-003"
          >
            FAQs
          </Link>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll triggerClass="fadeIn" className="footer-copyright">
        <p className="type-d-text-link type-m-body-s uppercase letter-spacing-003">
          © {new Date().getFullYear()} ALL RIGHTS RESERVED
        </p>
      </AnimateOnScroll>
    </div>
  )
}
