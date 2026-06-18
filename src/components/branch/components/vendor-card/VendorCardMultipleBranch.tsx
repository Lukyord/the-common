'use client'

import { useId, useState } from 'react'
import Link from 'next/link'

import RenderMedia from '@/components/common/media'
import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { Modal } from '@/components/common/modal'
import {
  CardBranchDots,
  type CardBranchDotItem,
} from '@/components/branch/components/card-branch-dots'
import type { MultiBranchVendorBranch } from '@/components/branch/vendors/types'

import './vendor-card-multiple-branch.css'

type VendorCardMultipleBranchProps = {
  branchSlug?: string | null
  branches?: MultiBranchVendorBranch[]
  media?: {
    src: string
    alt?: string
  }
  title: string
  tags?: string[]
  location?: string
}

export default function VendorCardMultipleBranch({
  branchSlug: _branchSlug,
  branches = [],
  media,
  title,
  tags = [],
}: VendorCardMultipleBranchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const titleId = useId()
  const branchDots: CardBranchDotItem[] = branches

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const cardContent = (
    <>
      <div className="card-media">
        {media?.src && <RenderMedia src={media.src} alt={media.alt || title} />}
      </div>

      <div className="card-ttl">
        <h3 className="type-d-body-l type-m-s letter-spacing-002 weight-medium">{title}</h3>

        <CardBranchDots branches={branchDots} />
      </div>

      <div className="card-desc">
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((tag) => (
              <Link
                href={`/vendors/filter?category=${encodeURIComponent(tag)}`}
                key={tag}
                className="tag"
              >
                <p className="type-d-body-xs type-m-body-xs letter-spacing-002">{tag}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      <AnimateOnScroll triggerClass="fadeIn" data-card="vendor" className="card">
        <button
          type="button"
          className="link-overlay"
          aria-label={`Choose branch for ${title}`}
          onClick={openModal}
        />
        {cardContent}
      </AnimateOnScroll>

      <Modal open={isOpen} onClose={closeModal} labelledBy={titleId}>
        <div className="vendor-branch-modal">
          <button type="button" className="modal__close" onClick={closeModal} aria-label="Close">
            <i className="ic ic-close-bold" aria-hidden />
          </button>

          <h2
            id={titleId}
            className="vendor-branch-modal__title type-d-title type-m-title letter-spacing-002 weight-medium"
          >
            PICK VENDOR LOCATION
          </h2>

          <ul className="vendor-branch-modal__list">
            {[...branches].reverse().map((branch) => (
              <li key={branch.slug}>
                <Link
                  href={branch.link}
                  className="vendor-branch-modal__item"
                  data-branch={branch.slug}
                  onClick={closeModal}
                >
                  <span className="vendor-branch-modal__name type-d-body-l type-m-title letter-spacing-002 weight-medium uppercase">
                    {branch.name}
                  </span>
                  <i className="ic ic-arrow-square-top-right size-icon-3xs" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  )
}
