import { headers } from 'next/headers'
import Link from 'next/link'

import './footer.css'
import AnimateOnScroll from '../common/animate-on-scroll'
import { HtmlContent } from '../common/html-content'
import { branchFooterThemeStyle } from '@/lib/branchTheme'
import { lexicalToHtml } from '@/lib/lexicalToHtml'
import { getSlugFromPathname } from '@/lib/pathname'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Branch } from '@/payload-types'
import { getBranches } from '@/payload/queries/branch'
import { getContactPayloadData } from '@/payload/queries/contact'
import RenderMedia from '../common/media'

const BRANCH_INFO_SECTIONS = [
  { title: 'Find Us', field: 'findUs' },
  { title: 'Opening Hours', field: 'openingHours' },
  { title: 'Parking Options', field: 'parkingOptions' },
] as const satisfies ReadonlyArray<{
  title: string
  field: keyof Pick<Branch, 'findUs' | 'openingHours' | 'parkingOptions'>
}>

export async function Footer() {
  const [{ contact }, branches] = await Promise.all([getContactPayloadData(), getBranches()])

  const pathname = (await headers()).get('x-pathname') ?? '/'
  const slug = getSlugFromPathname(pathname)
  const currentBranch = branches.find((branch) => branch.slug === slug)
  const isBranch = Boolean(currentBranch)
  const themeStyle = branchFooterThemeStyle(currentBranch)
  const footerBranches = currentBranch
    ? branches.filter((branch) => branch.id !== currentBranch.id)
    : branches

  const emailHref = contact?.email ? `mailto:${contact.email}` : undefined
  const kinnestHref = toExternalHref(contact?.kinnestGroup)
  const instagramHref = toExternalHref(contact?.social?.instagram)
  const facebookHref = toExternalHref(contact?.social?.facebook)
  const lineHref = toExternalHref(contact?.social?.line)

  return (
    <footer
      id="footer"
      className={isBranch ? 'footer--branch' : 'footer--brand'}
      style={themeStyle}
    >
      <div className="footer-nav">
        <div className="footer-left">
          <div className="footer-contact">
            {currentBranch?.tel && (
              <AnimateOnScroll triggerClass="fadeIn" className="tel">
                <Link
                  href={toTelHref(currentBranch.tel)!}
                  className="type-d-body-l type-m-title weight-medium letter-spacing-002"
                >
                  {currentBranch.tel}
                </Link>
              </AnimateOnScroll>
            )}

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
          </div>

          {footerBranches.length > 0 && (
            <AnimateOnScroll triggerClass="fadeIn" className="footer-branch">
              {footerBranches.map((branch) => {
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
                      <h3 className="type-d-label type-m-body-s weight-medium uppercase letter-spacing-002">
                        {branch.name}
                      </h3>
                      <i className="ic ic-arrow-square-top-right size-icon-5xs"></i>
                    </div>
                  </div>
                )
              })}
            </AnimateOnScroll>
          )}
        </div>

        {isBranch && currentBranch && (
          <div className="footer-middle">
            {BRANCH_INFO_SECTIONS.map(({ title, field }) => {
              const richText = currentBranch[field]
              const html = lexicalToHtml(richText)

              if (!html) return null

              return (
                <div className="footer-info" key={field}>
                  <div className="info-ttl">
                    <h3 className="type-d-label type-m-body-m weight-medium uppercase letter-spacing-002">
                      {title}
                    </h3>
                  </div>
                  <div className="info-content">
                    <HtmlContent html={html} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

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

          <AnimateOnScroll triggerClass="fadeIn" className="footer-copyright">
            <p className="type-d-text-link type-m-body-s uppercase letter-spacing-003">
              © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </footer>
  )
}

function toTelHref(value?: string | null) {
  return value ? `tel:${value.replace(/\s/g, '')}` : undefined
}

function toExternalHref(value?: string | null) {
  return value?.startsWith('http') ? value : undefined
}
