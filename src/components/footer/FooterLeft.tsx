import Link from 'next/link'

import AnimateOnScroll from '../common/animate-on-scroll'
import RenderMedia from '../common/media'
import type { FooterBranchItem, FooterContact } from './footer-types'
import { toEmailHref, toTelHref } from './footer-utils'

type FooterLeftProps = {
  currentBranch?: FooterBranchItem
  branches: FooterBranchItem[]
  contact: FooterContact
}

export function FooterLeft({ currentBranch, branches, contact }: FooterLeftProps) {
  const emailHref = toEmailHref(contact.email)

  return (
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

        {contact.email && emailHref && (
          <AnimateOnScroll triggerClass="fadeIn" className="email">
            <Link
              href={emailHref}
              className="type-d-body-l type-m-title weight-medium letter-spacing-003"
            >
              {contact.email}
            </Link>
          </AnimateOnScroll>
        )}
      </div>

      {branches.length > 0 && (
        <AnimateOnScroll triggerClass="fadeIn" className="footer-branch">
          {branches.map((branch) => (
            <div className="footer-branch__item" key={branch.id}>
              <Link href={`/${branch.slug}`} className="link-overlay" aria-label={branch.name}>
                &nbsp;
              </Link>

              {branch.logo?.src && (
                <div className="branch-media">
                  <RenderMedia src={branch.logo.src} alt={branch.logo.alt || branch.name} />
                </div>
              )}
              <div className="branch-name">
                <h3 className="type-d-label type-m-body-s weight-medium uppercase letter-spacing-002">
                  {branch.name}
                </h3>
                <i className="ic ic-arrow-square-top-right size-icon-5xs"></i>
              </div>
            </div>
          ))}
        </AnimateOnScroll>
      )}
    </div>
  )
}
