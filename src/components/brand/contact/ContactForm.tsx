import AnimateOnScroll from '@/components/common/animate-on-scroll'
import RenderMedia from '@/components/common/media'
import ContactFormFields from '@/components/brand/contact/ContactFormFields'
import { toEmailHref, toTelHref } from '@/components/footer/footer-utils'
import { resolveMedia } from '@/lib/resolveMedia'
import type { Branch, Contact } from '@/payload-types'

type ContactFormData = Pick<
  Contact,
  'contactBg' | 'contactBgMobile' | 'tel' | 'email' | 'contactSubject'
> & {
  title?: string | null
  branch?: number | Branch | null
}
import Link from 'next/link'

export type ResolvedMedia = NonNullable<ReturnType<typeof resolveMedia>>

export type ContactFormProps = {
  title?: string
  bg?: ResolvedMedia
  bgMobile?: ResolvedMedia
  tel?: string | null
  email?: string | null
  subjects?: string[]
  priority?: boolean
  branch?: Branch
}

export function toContactFormProps(data?: ContactFormData | null): ContactFormProps {
  return {
    title: data?.title ?? 'Contact',
    bg: resolveMedia(data?.contactBg),
    bgMobile: resolveMedia(data?.contactBgMobile),
    tel: data?.tel ?? null,
    email: data?.email ?? null,
    subjects: data?.contactSubject?.filter((item) => item.trim().length > 0) ?? [],
    priority: true,
    branch: typeof data?.branch === 'object' ? data.branch : undefined,
  }
}

export default function ContactForm({
  title = 'Contact',
  bg,
  bgMobile,
  tel,
  email,
  subjects = [],
  priority = false,
  branch,
}: ContactFormProps) {
  const telHref = toTelHref(tel)
  const emailHref = toEmailHref(email)

  return (
    <section data-section="contact">
      <div className="contact-media bg-dark-brown">
        <AnimateOnScroll triggerClass="fadeIn" className="cover">
          {bg?.src && (
            <RenderMedia
              src={bg.src}
              srcMobile={bgMobile?.src}
              alt={bg.alt || title}
              priority={priority}
            />
          )}
        </AnimateOnScroll>

        <AnimateOnScroll triggerClass="fadeEntry" delay={500} className="contact-header">
          <div className="sc-ttl">
            <h1 className="type-d-display type-m-display weight-medium letter-spacing-002">
              {title}
            </h1>
          </div>

          <div className="contact-info">
            {tel && telHref && (
              <Link
                href={telHref}
                target="_blank"
                className="type-d-body-l type-m-body-m weight-medium letter-spacing-002"
              >
                {tel}
              </Link>
            )}
            {email && emailHref && (
              <Link
                href={emailHref}
                target="_blank"
                className="type-d-body-l type-m-body-m weight-medium letter-spacing-002"
              >
                {email}
              </Link>
            )}
          </div>
        </AnimateOnScroll>
      </div>

      <div className="contact-form bg-dark-brown">
        <ContactFormFields subjects={subjects} buttonColor={branch?.footerBg ?? undefined} />
      </div>
    </section>
  )
}
