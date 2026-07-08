import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'

export default function ContactReSeries() {
  return (
    <section data-section="contact-re-series">
      <div className="cover">
        <RenderMedia src="/designs/checked-bg.webp" alt="Re Series Background" />
      </div>

      <AnimateOnScroll triggerClass="fadeEntry" className="hand-flower hidden-device-md">
        <div className="flower-green">
          <RenderMedia src="/designs/green-flower.webp" alt="Green Flower" />
        </div>
        <div className="hand">
          <RenderMedia src="/designs/orange-hand.webp" alt="Orange Hand" />
        </div>
      </AnimateOnScroll>

      <div className="sc-inner pc-t-150 pc-b-0 mb-t-75 mb-b-200">
        <div className="container">
          <div className="sc-header">
            <h2 className="sc-ttl type-d-header type-m-headliner-m uppercase weight-medium letter-spacing-002">
              <AnimateOnScroll triggerClass="fadeIn">
                <span>SUPPORT OUR</span>
                <AnimateOnScroll triggerClass="spinScaleIn" className="flower-orange">
                  <RenderMedia src="/designs/orange-flower.webp" alt="Orange Flower" />
                </AnimateOnScroll>
              </AnimateOnScroll>
              <AnimateOnScroll triggerClass="fadeIn">
                <span>COMMON COMPASSION</span>
              </AnimateOnScroll>
              <AnimateOnScroll triggerClass="fadeIn">
                <span>INITIATIVE</span>
              </AnimateOnScroll>
            </h2>

            <AnimateOnScroll triggerClass="fadeEntry" delay={400} className="hand-flower show-md">
              <div className="flower-green">
                <RenderMedia src="/designs/green-flower.webp" alt="Green Flower" />
              </div>
              <div className="hand">
                <RenderMedia src="/designs/orange-hand.webp" alt="Orange Hand" />
              </div>
            </AnimateOnScroll>
          </div>

          <div className="sc-desc entry-content">
            <AnimateOnScroll triggerClass="fadeIn">
              <p>
                Our Common Compassion program raises funds to help Bangkok’s under-served
                communities. Follow our social media for updates. We’ll share the stories behind the
                people we reach.
              </p>
            </AnimateOnScroll>

            <ul>
              <li>
                <AnimateOnScroll triggerClass="fadeIn">
                  <p>
                    If you’d like to contribute, then kindly donate here: <b>409-448-1602</b> (Siam
                    Commercial Bank)
                  </p>
                </AnimateOnScroll>
              </li>
              <li>
                <AnimateOnScroll triggerClass="fadeIn">
                  <p>
                    If you know someone in the community who needs support, then email us at{` `}
                    <a href="mailto:info@thecommonsbkk.com">info@thecommonsbkk.com</a>
                  </p>
                </AnimateOnScroll>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
