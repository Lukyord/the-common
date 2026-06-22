import AnimateOnScroll from '@/components/common/animate-on-scroll'
import { branchHeaderThemeStyle } from '@/lib/branchTheme'
import { formatPhoneDisplay, normalizeTelHref } from '@/lib/formatPhone'
import type { Branch, Vendor } from '@/payload-types'
import Link from 'next/link'
import { CardBranchDots } from '../../components/card-branch-dots'

type VendorSingleContactProps = {
  tel?: Vendor['tel']
  floor?: Vendor['floor']
  lotNumber?: Vendor['lotNumber']
  floors?: Branch['floors']
  branch: Branch
  branchTheme?: {
    bgColor?: string | null
    primaryColor?: string | null
  }
}

function getFloorTitle(floorId: string | null | undefined, floors?: Branch['floors']) {
  if (!floorId || !floors?.length) return ''

  return floors.find((floor) => floor.floorId === floorId)?.title?.trim() || ''
}

export default function VendorSingleContact({
  tel,
  floor,
  lotNumber,
  floors,
  branch,
  branchTheme,
}: VendorSingleContactProps) {
  const phoneNumbers = tel?.filter(Boolean) ?? []
  const lot = lotNumber != null ? String(lotNumber).padStart(2, '0') : null
  const floorTitle = getFloorTitle(floor, floors)
  const themeStyle = branchHeaderThemeStyle(branchTheme)

  if (!phoneNumbers.length && !lot && !floorTitle) return null

  return (
    <div className="vs-block vs-contact sc-info">
      {phoneNumbers.length > 0 && (
        <AnimateOnScroll triggerClass="fadeIn" className="tel">
          <div className="item-ttl">
            <i className="ic ic-phone size-icon-xs"></i>
          </div>
          <div className="item-content">
            {phoneNumbers.map((phone, index) => (
              <div key={phone} className="item-value">
                <Link
                  href={`tel:${normalizeTelHref(phone)}`}
                  className="type-d-text-link type-m-body-s letter-spacing-002"
                >
                  {formatPhoneDisplay(phone)}
                </Link>
                {index < phoneNumbers.length - 1 && <span>, </span>}
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      )}

      {(lot || floorTitle) && (
        <AnimateOnScroll triggerClass="fadeIn" className="lot-floor">
          <div className="item-content" style={themeStyle}>
            <span className="branch-dot"></span>

            {lot && (
              <span className="lot-number type-d-body-xs type-m-body-s letter-spacing-002">
                {lot}
              </span>
            )}

            {floorTitle && (
              <span className="location type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                {floorTitle},{' '}
              </span>
            )}
            <span className="branch-name type-d-text-link type-m-body-s letter-spacing-002 weight-medium uppercase">
              {branch.name}
            </span>
          </div>
        </AnimateOnScroll>
      )}
    </div>
  )
}
