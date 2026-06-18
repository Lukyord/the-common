import AnimateOnScroll from '@/components/common/animate-on-scroll'
import type { WhatsOnSingleBranch } from '@/payload/queries/branch'

type WhatsOnSingleInfoProps = {
  date?: string | null
  time?: string | null
  publishedDate?: string | null
  branches: WhatsOnSingleBranch[]
}

export default function WhatsOnSingleInfo({
  date,
  time,
  publishedDate,
  branches,
}: WhatsOnSingleInfoProps) {
  return (
    <div className="sc-info">
      {publishedDate && (
        <>
          <div className="info-item date">
            <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
              <p className="type-d-body-xs type-m-body-s letter-spacing-002">PUBLISHED DATE</p>
            </AnimateOnScroll>
            <AnimateOnScroll triggerClass="fadeIn" className="item-content">
              <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                {publishedDate}
              </p>
            </AnimateOnScroll>
          </div>
          <div className="divider"></div>
        </>
      )}

      {date && (
        <>
          <div className="info-item date">
            <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
              <p className="type-d-body-xs type-m-body-s letter-spacing-002">DATE</p>
            </AnimateOnScroll>
            <AnimateOnScroll triggerClass="fadeIn" className="item-content">
              <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                {date}
              </p>
            </AnimateOnScroll>
          </div>
          <div className="divider"></div>
        </>
      )}

      {time && (
        <>
          <div className="info-item time">
            <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
              <p className="type-d-body-xs type-m-body-s letter-spacing-002">TIME</p>
            </AnimateOnScroll>
            <AnimateOnScroll triggerClass="fadeIn" className="item-content">
              <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                {time}
              </p>
            </AnimateOnScroll>
          </div>
          <div className="divider"></div>
        </>
      )}

      {branches.length > 0 && (
        <>
          <div className="info-item avialable-branches">
            <AnimateOnScroll triggerClass="fadeIn" className="item-ttl">
              <p className="type-d-body-xs type-m-body-s letter-spacing-002">LOCATION</p>
            </AnimateOnScroll>
            <div className="branches">
              {branches.map((branch) => (
                <AnimateOnScroll triggerClass="fadeIn" key={branch.slug} className="branch">
                  <span
                    className="branch-location"
                    style={{
                      backgroundColor: branch.bgColor ?? undefined,
                      color: branch.color ?? undefined,
                    }}
                  >
                    {branch.location}
                  </span>
                  <p className="type-d-text-link type-m-body-s letter-spacing-002 weight-medium">
                    {branch.name}
                  </p>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
          <div className="divider"></div>
        </>
      )}
    </div>
  )
}
