import Image from 'next/image'
import Link from 'next/link'

import './footer.css'
import AnimateOnScroll from '../common/animate-on-scroll'
import { resolveMedia } from '@/lib/resolveMedia'
import { getBranches } from '@/payload/queries/branch'
import { getContactPayloadData } from '@/payload/queries/contact'
import RenderMedia from '../common/media'

export async function Footer() {
  const [{ contact }, branches] = await Promise.all([getContactPayloadData(), getBranches()])

  const emailHref = contact?.email ? `mailto:${contact.email}` : undefined
  const kinnestHref = toExternalHref(contact?.kinnestGroup)
  const instagramHref = toExternalHref(contact?.social?.instagram)
  const facebookHref = toExternalHref(contact?.social?.facebook)
  const lineHref = toExternalHref(contact?.social?.line)

  return (
    <footer id="footer">
      <div className="footer-nav">
        <div className="footer-left">
          {contact?.email && (
            <AnimateOnScroll triggerClass="fadeIn" className="email">
              <Link
                href={emailHref!}
                className="type-d-title type-m-headliner-m weight-medium letter-spacing-003"
              >
                {contact.email}
              </Link>
            </AnimateOnScroll>
          )}

          {branches.length > 0 && (
            <AnimateOnScroll triggerClass="fadeIn" className="footer-branch">
              {branches.map((branch) => {
                const logo = resolveMedia(branch.logo)

                return (
                  <div className="footer-branch__item" key={branch.id}>
                    <Link
                      href={`/${branch.slug}`}
                      className="link-overlay"
                      aria-label={branch.name}
                    >
                      &nbsp;
                    </Link>

                    {logo?.src && (
                      <div className="branch-media">
                        <RenderMedia src={logo.src} alt={logo.alt || branch.name} />
                      </div>
                    )}
                    <div className="branch-name">
                      <h3 className="type-d-label type-m-body-s weight-medium uppercase letter-spacing-003">
                        {branch.name}
                      </h3>
                      <i className="ic ic-arrow-square-top-right size-icon-3xs"></i>
                    </div>
                  </div>
                )
              })}
            </AnimateOnScroll>
          )}
        </div>
        <div className="footer-right">
          <div className="footer-links">
            {(instagramHref || facebookHref || lineHref) && (
              <AnimateOnScroll triggerClass="fadeIn">
                <ul className="social">
                  {instagramHref && (
                    <li>
                      <Link href={instagramHref}>
                        <i className="ic ic-instagram size-icon-lg"></i>
                      </Link>
                    </li>
                  )}
                  {facebookHref && (
                    <li>
                      <Link href={facebookHref}>
                        <i className="ic ic-facebook size-icon-lg"></i>
                      </Link>
                    </li>
                  )}
                  {lineHref && (
                    <li className="line">
                      <Link href={lineHref}>
                        <i className="ic ic-line size-icon-sm"></i>
                      </Link>
                    </li>
                  )}
                </ul>
              </AnimateOnScroll>
            )}

            {contact?.kinnestGroup && (
              <AnimateOnScroll triggerClass="fadeIn">
                {kinnestHref && (
                  <Link
                    href={kinnestHref}
                    className="type-d-text-link type-m-body-r letter-spacing-003"
                  >
                    Kinnest Group
                  </Link>
                )}
              </AnimateOnScroll>
            )}

            <AnimateOnScroll triggerClass="fadeIn">
              <Link href="" className="type-d-text-link type-m-body-r letter-spacing-003">
                Privacy Policy
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll triggerClass="fadeIn">
              <Link href="" className="type-d-text-link type-m-body-r letter-spacing-003">
                FAQs
              </Link>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll triggerClass="fadeIn">
            <p className="type-d-text-link type-m-body-s uppercase letter-spacing-003">
              © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </footer>
  )
}

function toExternalHref(value?: string | null) {
  return value?.startsWith('http') ? value : undefined
}
