import { HtmlContent } from '../common/html-content'
import type { FooterBranchItem } from './footer-types'

type FooterMiddleProps = {
  branch: FooterBranchItem
}

export function FooterMiddle({ branch }: FooterMiddleProps) {
  return (
    <div className="footer-middle">
      {branch.infoSections.map(({ title, field, html }) => (
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
      ))}
    </div>
  )
}
